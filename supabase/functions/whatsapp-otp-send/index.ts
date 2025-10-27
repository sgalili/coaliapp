import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phoneNumber } = await req.json();
    
    if (!phoneNumber) {
      throw new Error('Phone number is required');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await supabaseClient
      .from('otp_verifications')
      .upsert({
        phone_number: phoneNumber,
        otp_code: otp,
        expires_at: expiresAt.toISOString(),
        verified: false,
      }, {
        onConflict: 'phone_number'
      });

    // Send OTP via GreenAPI
    const greenApiInstanceId = Deno.env.get('GREENAPI_INSTANCE_ID');
    const greenApiToken = Deno.env.get('GREENAPI_API_TOKEN');

    if (!greenApiInstanceId || !greenApiToken) {
      throw new Error('GreenAPI credentials not configured');
    }

    const message = `Your verification code is: ${otp}\n\nThis code will expire in 10 minutes.`;
    
    const greenApiUrl = `https://api.green-api.com/waInstance${greenApiInstanceId}/sendMessage/${greenApiToken}`;
    
    const greenApiResponse = await fetch(greenApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId: `${phoneNumber}@c.us`,
        message: message,
      }),
    });

    if (!greenApiResponse.ok) {
      const errorData = await greenApiResponse.text();
      console.error('GreenAPI error:', errorData);
      throw new Error(`Failed to send WhatsApp message: ${errorData}`);
    }

    const greenApiResult = await greenApiResponse.json();
    console.log('GreenAPI response:', greenApiResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP sent successfully',
        messageId: greenApiResult.idMessage 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in whatsapp-otp-send:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});
