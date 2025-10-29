// supabase/functions/whatsapp-otp-verify/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
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
    const { phone, otp } = await req.json();
    if (!phone || !otp) return new Response("phone & otp required", { 
      status: 400, 
      headers: corsHeaders 
    });

    console.log(`Verifying OTP for phone: ${phone}, otp: ${otp}`);

    const { data, error } = await sb
      .from("otps")
      .select("*")
      .eq("phone", phone)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error('Database error:', error);
      return new Response(error.message, { 
        status: 500, 
        headers: corsHeaders 
      });
    }
    
    if (!data?.length) {
      console.log('No OTP found for phone:', phone);
      return new Response("no otp found", { 
        status: 404, 
        headers: corsHeaders 
      });
    }

    const record = data[0];
    console.log('Found OTP record:', { id: record.id, expires_at: record.expires_at, otp_match: record.otp === otp });

    if (new Date(record.expires_at) < new Date()) {
      console.log('OTP expired');
      return new Response("expired", { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    if (record.otp !== otp) {
      console.log('Invalid OTP provided');
      return new Response("invalid", { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    // success → delete OTP (consume it)
    await sb.from("otps").delete().eq("id", record.id);
    console.log('OTP verified and consumed successfully');

    return new Response(JSON.stringify({ success: true }), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error('Error in whatsapp-otp-verify:', e);
    return new Response(e?.message ?? "error", { 
      status: 500, 
      headers: corsHeaders 
    });
  }
});