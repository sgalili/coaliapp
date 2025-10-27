import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, otp } = await req.json();
    console.log('=== OTP Verification Started ===');
    console.log('Phone:', phone);
    console.log('OTP provided:', otp ? 'Yes' : 'No');

    if (!phone || !otp) {
      console.error('Missing phone or OTP');
      return new Response(
        JSON.stringify({ error: 'Phone number and OTP are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Verify OTP from otp_verifications table
    console.log('Querying otp_verifications table...');
    const { data: otpData, error: otpError } = await supabaseAdmin
      .from('otp_verifications')
      .select('*')
      .eq('phone_number', phone)
      .eq('otp_code', otp)
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    console.log('Found OTP record:', { 
      found: !!otpData, 
      phone: otpData?.phone_number, 
      has_otp: !!otpData?.otp_code,
      expired: otpData ? new Date(otpData.expires_at) < new Date() : null
    });

    if (otpError) {
      console.error('Error querying OTP:', otpError);
      return new Response(
        JSON.stringify({ error: 'Database error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!otpData) {
      console.error('Invalid or expired OTP');
      return new Response(
        JSON.stringify({ error: 'Invalid or expired OTP' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('OTP verified successfully');

    // Mark OTP as verified
    console.log('Marking OTP as verified...');
    const { error: updateError } = await supabaseAdmin
      .from('otp_verifications')
      .update({ 
        verified: true, 
        verified_at: new Date().toISOString() 
      })
      .eq('id', otpData.id);

    if (updateError) {
      console.error('Error updating OTP status:', updateError);
    } else {
      console.log('OTP marked as verified');
    }

    // Check if user exists with this phone number
    console.log('Checking for existing user...');
    const { data: existingUsers, error: userListError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (userListError) {
      console.error('Error listing users:', userListError);
    }

    const existingUser = existingUsers?.users.find(u => u.phone === phone);
    console.log('Existing user found:', !!existingUser);

    let user;
    let isNewUser = false;

    if (existingUser) {
      console.log('User exists, generating session for user:', existingUser.id);
      user = existingUser;
    } else {
      // Create new user
      console.log('Creating new user with phone:', phone);
      const { data: newUserData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        phone,
        phone_confirm: true,
        user_metadata: { phone }
      });

      if (createError) {
        console.error('Error creating user:', createError);
        return new Response(
          JSON.stringify({ error: 'Failed to create user' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('New user created:', newUserData.user.id);
      user = newUserData.user;
      isNewUser = true;
    }

    console.log('Sign-in successful, user ID:', user.id, 'phone:', user.phone);

    // Generate session tokens
    console.log('Generating session tokens...');
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: `${user.id}@temp.coalichain.com`,
      options: {
        redirectTo: Deno.env.get('SUPABASE_URL') ?? '',
      }
    });

    if (sessionError) {
      console.error('Error generating session:', sessionError);
      return new Response(
        JSON.stringify({ error: 'Failed to create session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use proper token-based session creation
    const { data: { session }, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email: `${user.id}@temp.coalichain.com`,
      password: user.id, // Using user ID as temporary password
    });

    let access_token, refresh_token;

    if (signInError || !session) {
      // Fallback: Create session manually
      console.log('Creating session manually for user:', user.id);
      const sessionResponse = await supabaseAdmin.auth.admin.createSession({ userId: user.id });
      
      if (sessionResponse.error) {
        console.error('Error creating manual session:', sessionResponse.error);
        return new Response(
          JSON.stringify({ error: 'Failed to create session' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      access_token = sessionResponse.data.access_token;
      refresh_token = sessionResponse.data.refresh_token;
    } else {
      access_token = session.access_token;
      refresh_token = session.refresh_token;
    }

    console.log('Session tokens generated:', { 
      access_token: !!access_token, 
      refresh_token: !!refresh_token 
    });

    // Check if profile exists
    console.log('Checking for existing profile...');
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    const profile_exists = !!profile && !profileError;
    console.log('Profile exists:', profile_exists, profile ? `(${profile.first_name} ${profile.last_name})` : '');

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error checking profile:', profileError);
    }

    console.log('=== OTP Verification Complete ===');
    console.log('Returning:', { user_id: user.id, profile_exists, is_new_user: isNewUser });

    return new Response(
      JSON.stringify({
        user: {
          id: user.id,
          phone: user.phone,
          email: user.email,
        },
        session: {
          access_token,
          refresh_token,
        },
        profile_exists,
        is_new_user: isNewUser
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('=== OTP Verification Error ===');
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
