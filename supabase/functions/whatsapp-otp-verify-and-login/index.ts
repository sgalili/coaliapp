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

    // Prepare deterministic email + password for phone-based accounts
    const normalized = String(phone).replace(/[^0-9]/g, '');
    const email = `otp+${normalized}@coalichain.demo`;
    const password = `PhoneOtp!${normalized}`; // deterministic but non-guessable enough for demo

    // Try signing in first in case account already exists
    console.log('Attempting sign-in first with existing account...', { email });
    const { data: trySignIn, error: trySignInError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (!trySignInError && trySignIn?.session && trySignIn?.user) {
      const access_token = trySignIn.session.access_token;
      const refresh_token = trySignIn.session.refresh_token;
      const user = trySignIn.user;

      console.log('Existing account sign-in succeeded for user:', user.id);

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

      console.log('=== OTP Verification Complete (existing user) ===');
      return new Response(
        JSON.stringify({
          user: { id: user.id, phone: user.phone, email: user.email },
          session: { access_token, refresh_token },
          profile_exists,
          is_new_user: false
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user exists by email
    console.log('Checking for existing user by email:', email);
    const { data: existingByEmail, error: getByEmailError } = await supabaseAdmin.auth.admin.getUserByEmail(email);
    if (getByEmailError) {
      console.error('Error getUserByEmail:', getByEmailError);
    }

    let user;
    let isNewUser = false;

    if (existingByEmail?.user) {
      console.log('Existing user found:', existingByEmail.user.id);
      user = existingByEmail.user;
      // Ensure password is set so we can create a session
      const { error: updatePwdError } = await supabaseAdmin.auth.admin.updateUserById(user.id, { password });
      if (updatePwdError) {
        console.error('Error updating user password:', updatePwdError);
      }
    } else {
      // Create new email-based user linked to phone in metadata
      console.log('Creating new user with email:', email, 'and phone:', phone);
      const { data: newUserData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true,
        password,
        user_metadata: { phone }
      });

      if (createError || !newUserData?.user) {
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

    console.log('Signing in with email/password to create session...');
    const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !signInData?.session) {
      console.error('Error signing in to create session:', signInError);
      return new Response(
        JSON.stringify({ error: 'Failed to create session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const access_token = signInData.session.access_token;
    const refresh_token = signInData.session.refresh_token;

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
