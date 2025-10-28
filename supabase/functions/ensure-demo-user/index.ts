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
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For safety, only allow creating/updating the demo account
    const allowedDemoEmail = 'demo@coali.app';
    if (email.toLowerCase() !== allowedDemoEmail) {
      return new Response(
        JSON.stringify({ error: 'Only the demo account is allowed' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: { autoRefreshToken: false, persistSession: false },
      }
    );

    const adminApi: any = (supabaseAdmin as any).auth.admin;

    // Try to locate the user by email
    console.log('Ensuring demo user exists:', email);
    let existingUser: any = null;

    try {
      if (adminApi && typeof adminApi.getUserByEmail === 'function') {
        const { data, error } = await adminApi.getUserByEmail(email);
        if (error) console.warn('getUserByEmail error:', error);
        existingUser = data?.user ?? null;
      } else {
        console.log('getUserByEmail unavailable, using listUsers fallback');
        const { data: listData, error: listErr } = await adminApi.listUsers({ page: 1, perPage: 1000 });
        if (listErr) console.warn('listUsers error:', listErr);
        existingUser = listData?.users?.find((u: any) => u.email?.toLowerCase() === email.toLowerCase()) ?? null;
      }
    } catch (e) {
      console.error('Admin lookup failed:', e);
    }

    if (existingUser) {
      console.log('Demo user found, updating password and confirming email');
      const { error: updateErr } = await adminApi.updateUserById(existingUser.id, {
        password,
        email_confirm: true,
        user_metadata: { is_demo: true },
      });
      if (updateErr) {
        console.error('Failed to update demo user:', updateErr);
        return new Response(
          JSON.stringify({ error: 'Failed to update demo user' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify({ ok: true, created: false, userId: existingUser.id }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Demo user not found, creating...');
    const { data: created, error: createErr } = await adminApi.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { is_demo: true },
    });

    if (createErr || !created?.user) {
      console.error('Failed to create demo user:', createErr);
      return new Response(
        JSON.stringify({ error: 'Failed to create demo user' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ ok: true, created: true, userId: created.user.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('ensure-demo-user error:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});