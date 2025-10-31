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
    const { phone } = await req.json();
    
    console.log('=== OTP SEND FUNCTION CALLED ===');
    console.log('Received phone:', phone);
    
    if (!phone) {
      throw new Error('Phone number is required');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated OTP:', otp);
    
    // Store OTP in Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await supabaseClient
      .from('otp_verifications')
      .upsert({
        phone_number: phone,
        otp_code: otp,
        expires_at: expiresAt.toISOString(),
        verified: false,
      }, {
        onConflict: 'phone_number'
      });

    console.log('OTP stored in database');

    // Send OTP via GreenAPI
    const greenApiInstanceId = Deno.env.get('GREENAPI_INSTANCE_ID');
    const greenApiToken = Deno.env.get('GREENAPI_API_TOKEN');

    console.log('GREENAPI_INSTANCE_ID exists:', !!greenApiInstanceId);
    console.log('GREENAPI_API_TOKEN exists:', !!greenApiToken);

    if (!greenApiInstanceId || !greenApiToken) {
      throw new Error('GreenAPI credentials not configured');
    }

    // Format phone for GreenAPI (remove all non-digits including +)
    const formattedPhone = phone.replace(/[^\d]/g, '');
    const chatId = `${formattedPhone}@c.us`;
    
    console.log('Formatted chatId:', chatId);

    const message = `Your verification code is: ${otp}\n\nThis code will expire in 10 minutes.`;
    
    const greenApiUrl = `https://api.green-api.com/waInstance${greenApiInstanceId}/sendMessage/${greenApiToken}`;
    
    console.log('Calling GreenAPI...');

    const greenApiResponse = await fetch(greenApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId: chatId,
        message: message,
      }),
    });

    console.log('GreenAPI response status:', greenApiResponse.status);

    const responseText = await greenApiResponse.text();
    console.log('GreenAPI response body:', responseText);

    if (!greenApiResponse.ok) {
      throw new Error(`Failed to send WhatsApp message: ${responseText}`);
    }

    const greenApiResult = JSON.parse(responseText);

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
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});
