import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  phone: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone }: RequestBody = await req.json();

    if (!phone) {
      return new Response(
        JSON.stringify({ error: 'Phone number is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Normalize phone to E.164 format (special handling for Israel)
    const normalizedPhone = normalizePhoneE164(phone);
    console.log(`Normalized phone: ${phone} -> ${normalizedPhone}`);

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check rate limiting (1 code per minute)
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
    const { data: recentOtps } = await supabase
      .from('whatsapp_otps')
      .select('id')
      .eq('phone_e164', normalizedPhone)
      .gte('created_at', oneMinuteAgo);

    if (recentOtps && recentOtps.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded. Please wait 1 minute before requesting another code.',
          cooldown: 60 
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate 4-digit code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(`Generated code for ${normalizedPhone}: ${code}`);

    // Generate salt and hash
    const salt = crypto.randomUUID();
    const pepper = Deno.env.get('OTP_PEPPER')!;
    const codeHash = await hashCode(code, salt, pepper);

    // Set expiration (5 minutes)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // Send WhatsApp message via UltraMsg
    const instanceId = Deno.env.get('ULTRAMSG_INSTANCE_ID')!;
    const token = Deno.env.get('ULTRAMSG_TOKEN')!;
    
    const message = `קוד האימות שלך ב-Coali: ${code}\n\nהקוד יפוג בעוד 5 דקות.`;
    
    console.log(`Sending WhatsApp to ${normalizedPhone}: ${message}`);
    
    const ultraMsgResponse = await sendWhatsAppMessage(instanceId, token, normalizedPhone, message);
    console.log('UltraMsg response:', ultraMsgResponse);

    // Store OTP in database
    const { error: dbError } = await supabase
      .from('whatsapp_otps')
      .insert({
        phone_e164: normalizedPhone,
        code_hash: codeHash,
        salt,
        expires_at: expiresAt,
        status: ultraMsgResponse.sent ? 'sent' : 'failed',
        vendor_message_id: ultraMsgResponse.id || null,
        ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown'
      });

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to store OTP' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!ultraMsgResponse.sent) {
      return new Response(
        JSON.stringify({ error: 'Failed to send WhatsApp message' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Code sent successfully',
        cooldown: 60
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in whatsapp-otp-send function:', error);
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

// Send WhatsApp message via UltraMsg
async function sendWhatsAppMessage(instanceId: string, token: string, to: string, body: string) {
  try {
    const params = new URLSearchParams({
      token,
      to,
      body,
      priority: '10'
    });

    const response = await fetch(`https://api.ultramsg.com/${instanceId}/messages/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await response.json();
    
    return {
      sent: response.ok && data.sent === 'true',
      id: data.id || null,
      error: response.ok ? null : data.error || 'Unknown error'
    };
  } catch (error) {
    console.error('UltraMsg API error:', error);
    return {
      sent: false,
      id: null,
      error: error.message
    };
  }
}