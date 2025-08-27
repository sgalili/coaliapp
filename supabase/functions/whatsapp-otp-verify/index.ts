import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  phone: string;
  code: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, code }: RequestBody = await req.json();

    if (!phone || !code) {
      return new Response(
        JSON.stringify({ error: 'Phone number and code are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate code format (4 digits)
    if (!/^\d{4}$/.test(code)) {
      return new Response(
        JSON.stringify({ error: 'Code must be 4 digits' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Normalize phone to E.164 format
    const normalizedPhone = normalizePhoneE164(phone);
    console.log(`Verifying code for phone: ${normalizedPhone}`);

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the most recent non-expired OTP for this phone
    const { data: otps, error: fetchError } = await supabase
      .from('whatsapp_otps')
      .select('*')
      .eq('phone_e164', normalizedPhone)
      .gt('expires_at', new Date().toISOString())
      .eq('status', 'sent')
      .order('created_at', { ascending: false })
      .limit(1);

    if (fetchError) {
      console.error('Database fetch error:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Database error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!otps || otps.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No valid OTP found. Please request a new code.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const otp = otps[0];

    // Check if already verified
    if (otp.verified_at) {
      return new Response(
        JSON.stringify({ error: 'Code already used. Please request a new code.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check attempt limit (max 3 attempts)
    if (otp.attempts >= 3) {
      // Mark as failed
      await supabase
        .from('whatsapp_otps')
        .update({ status: 'failed' })
        .eq('id', otp.id);

      return new Response(
        JSON.stringify({ error: 'Maximum attempts exceeded. Please request a new code.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Increment attempts
    const newAttempts = otp.attempts + 1;
    await supabase
      .from('whatsapp_otps')
      .update({ 
        attempts: newAttempts,
        last_attempt_at: new Date().toISOString()
      })
      .eq('id', otp.id);

    // Verify the code
    const pepper = Deno.env.get('OTP_PEPPER')!;
    const expectedHash = await hashCode(code, otp.salt, pepper);
    
    if (expectedHash !== otp.code_hash) {
      console.log(`Code verification failed for ${normalizedPhone}. Attempt ${newAttempts}/3`);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid code',
          attemptsRemaining: 3 - newAttempts
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mark as verified
    const { error: updateError } = await supabase
      .from('whatsapp_otps')
      .update({ 
        status: 'verified',
        verified_at: new Date().toISOString()
      })
      .eq('id', otp.id);

    if (updateError) {
      console.error('Database update error:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update verification status' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Code verified successfully for ${normalizedPhone}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Code verified successfully',
        phone: normalizedPhone
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in whatsapp-otp-verify function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Normalize phone number to E.164 format
function normalizePhoneE164(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // Handle Israeli numbers specifically (strip leading 0 after country code)
  if (digits.startsWith('972')) {
    const rest = digits.substring(3).replace(/^0+/, '');
    return `+972${rest}`;
  }

  // Local Israeli format starting with 0 (e.g., 05X...)
  if (digits.startsWith('0')) {
    return `+972${digits.substring(1)}`;
  }

  // If 9 digits without leading 0, assume Israel
  if (digits.length === 9) {
    return `+972${digits}`;
  }

  // If the original input already had a leading '+', keep it
  if (phone.trim().startsWith('+')) return phone.trim();

  // Fallback: just prefix a '+'
  return `+${digits}`;
}

// Hash the code with salt and pepper
async function hashCode(code: string, salt: string, pepper: string): Promise<string> {
  const data = new TextEncoder().encode(code + salt + pepper);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}