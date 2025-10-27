import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

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
    console.log('=== FUNCTION CALLED ===');
    
    // Get request body
    const { phone } = await req.json();
    console.log('Received phone:', phone);

    // Validate phone number
    if (!phone || !phone.startsWith('+')) {
      console.error('Invalid phone format:', phone);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Phone number must be in format +972501234567' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated OTP:', otp);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized');

    // Store OTP in database
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    console.log('OTP expires at:', expiresAt.toISOString());

    const { data: otpRecord, error: dbError } = await supabase
      .from('otp_verifications')
      .insert({
        phone_number: phone,
        otp_code: otp,
        expires_at: expiresAt.toISOString(),
        verified: false,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to store OTP', 
          details: dbError.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('OTP stored in database:', otpRecord.id);

    // Get GreenAPI credentials
    const instanceId = Deno.env.get('GREENAPI_INSTANCE_ID');
    const apiToken = Deno.env.get('GREENAPI_API_TOKEN');

    console.log('GREENAPI_INSTANCE_ID exists:', !!instanceId);
    console.log('GREENAPI_API_TOKEN exists:', !!apiToken);

    if (!instanceId || !apiToken) {
      console.error('Missing GreenAPI credentials');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'GreenAPI credentials not configured' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('GreenAPI Instance ID:', instanceId);

    // Format phone for GreenAPI: +972501234567 -> 972501234567@c.us
    const formattedPhone = phone.replace(/[^\d]/g, ''); // Remove + and all non-digits
    const chatId = `${formattedPhone}@c.us`;
    console.log('Formatted chatId:', chatId);

    // Prepare message
    const message = `Your verification code is: ${otp}\n\nThis code will expire in 10 minutes.`;
    console.log('Message prepared');

    // Send via GreenAPI
    const greenApiUrl = `https://api.green-api.com/waInstance${instanceId}/sendMessage/${apiToken}`;
    console.log('GreenAPI URL:', greenApiUrl);

    const greenApiPayload = {
      chatId: chatId,
      message: message,
    };
    console.log('GreenAPI payload:', JSON.stringify(greenApiPayload));

    const greenApiResponse = await fetch(greenApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(greenApiPayload),
    });

    console.log('GreenAPI response status:', greenApiResponse.status);
    const responseText = await greenApiResponse.text();
    console.log('GreenAPI response:', responseText);
    
    let greenApiResult;
    try {
      greenApiResult = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse GreenAPI response:', e);
      greenApiResult = { error: 'Invalid response format', raw: responseText };
    }

    if (!greenApiResponse.ok) {
      console.error('GreenAPI error:', greenApiResult);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to send WhatsApp message',
          details: greenApiResult 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('=== WhatsApp OTP Send Function Completed Successfully ===');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP sent successfully',
        otpId: otpRecord.id,
        messageId: greenApiResult.idMessage || null
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('=== Unexpected Error ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error',
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
