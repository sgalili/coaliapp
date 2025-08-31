// supabase/functions/whatsapp-otp-send/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ULTRA_ID = Deno.env.get("ULTRAMSG_INSTANCE_ID")!;
const ULTRA_TOKEN = Deno.env.get("ULTRAMSG_TOKEN")!;

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone } = await req.json();
    if (!phone) return new Response("phone required", { status: 400, headers: corsHeaders });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    console.log(`Generating OTP for phone: ${phone}`);
    console.log(`Using ULTRA_ID: ${ULTRA_ID}, ULTRA_TOKEN: ${ULTRA_TOKEN ? 'SET' : 'NOT SET'}`);

    // store in DB
    await sb.from("otps").insert({ phone, otp, expires_at: expires });

    // send via UltraMsg
    const res = await fetch(`https://api.ultramsg.com/${ULTRA_ID}/messages/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        token: ULTRA_TOKEN,
        to: phone,
        body: `🔐 Your OTP is: ${otp}`,
        priority: "10",
      }),
    });

    const json = await res.json().catch(() => ({}));
    console.log(`UltraMsg response:`, { status: res.status, json });
    
    return new Response(JSON.stringify({ ok: res.ok, vendor_status: res.status, vendor_json: json }), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error('Error in whatsapp-otp-send:', e);
    return new Response(e?.message ?? "error", { 
      status: 500, 
      headers: corsHeaders 
    });
  }
});