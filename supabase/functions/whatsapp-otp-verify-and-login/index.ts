import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const URL = Deno.env.get("SUPABASE_URL")!;
const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const PEPPER = Deno.env.get("OTP_PEPPER")!;

const admin = createClient(URL, SERVICE);  // admin (DB + auth)
const pub = createClient(URL, ANON);       // public (pour sign-in)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const sha256 = async (s: string) => {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(d)).map(b => b.toString(16).padStart(2, "0")).join("");
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, otp } = await req.json();
    if (!phone || !otp) {
      return new Response("phone & otp required", { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    console.log(`Verifying OTP and creating session for phone: ${phone}`);

    // 1) Vérifier OTP
    const { data: row, error: otpError } = await admin
      .from("otps")
      .select("*")
      .eq("phone", phone)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (otpError || !row) {
      console.log('OTP not found for phone:', phone);
      return new Response("otp_not_found", { 
        status: 404, 
        headers: corsHeaders 
      });
    }

    if (row.otp !== otp) {
      console.log('Invalid OTP provided');
      return new Response("otp_invalid", { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    if (new Date(row.expires_at) < new Date()) {
      console.log('OTP expired');
      return new Response("otp_expired", { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    // Marquer OTP comme vérifié au lieu de le supprimer
    await admin.from("otps").update({ 
      verified_at: new Date().toISOString() 
    }).eq("id", row.id);

    console.log('OTP verified successfully');

    // 2) User par téléphone (sans email)
    const password = await sha256(`${phone}:${PEPPER}`);

    // Créer user si n'existe pas (ignorer erreur si existe déjà)
    console.log('Creating/retrieving user by phone');
    await admin.auth.admin.createUser({
      phone,
      password,
      phone_confirm: true, // confirme le phone côté auth
    }).catch((err) => {
      console.log('User may already exist, continuing:', err.message);
    });

    // 3) Sign-in serveur → tokens
    console.log('Signing in server-side to get tokens');
    const { data: signed, error: signErr } = await pub.auth.signInWithPassword({ 
      phone, 
      password 
    });

    if (signErr || !signed?.session) {
      console.error('Sign-in failed:', signErr?.message);
      return new Response(signErr?.message || "signin_failed", { 
        status: 500, 
        headers: corsHeaders 
      });
    }

    const { access_token, refresh_token, expires_in, token_type, user } = signed.session;
    
    console.log('Session created successfully for user:', user.id);

    return new Response(JSON.stringify({ 
      access_token, 
      refresh_token, 
      expires_in, 
      token_type, 
      user 
    }), { 
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (e: any) {
    console.error('Error in whatsapp-otp-verify-and-login:', e);
    return new Response(e?.message ?? "error", { 
      status: 500, 
      headers: corsHeaders 
    });
  }
});