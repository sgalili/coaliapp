import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    console.log('=== WhatsApp Test Function Started ===');
    
    // Get secrets
    const instanceId = Deno.env.get('ULTRAMSG_INSTANCE_ID');
    const token = Deno.env.get('ULTRAMSG_TOKEN');
    
    console.log(`Instance ID: ${instanceId}`);
    console.log(`Token: ${token ? `${token.substring(0, 8)}...` : 'undefined'}`);
    
    if (!instanceId || !token) {
      return new Response(
        JSON.stringify({ 
          error: 'UltraMsg credentials not configured',
          instanceId: !!instanceId,
          token: !!token
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Test phone number and message
    const testPhone = '+972586136130';
    const testMessage = 'Test message from Coali - WhatsApp API is working! 🎉';
    
    console.log(`Sending test message to: ${testPhone}`);
    console.log(`Message: ${testMessage}`);
    
    // Prepare request
    const url = `https://api.ultramsg.com/${instanceId}/messages/chat`;
    const params = new URLSearchParams({
      token,
      to: testPhone,
      body: testMessage,
      priority: '10'
    });

    console.log(`API URL: ${url}`);
    console.log(`Request params: ${params.toString()}`);

    // Make request to UltraMsg
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    console.log(`Response status: ${response.status} ${response.statusText}`);
    
    // Get response text
    const responseText = await response.text();
    console.log(`Raw response: ${responseText}`);
    
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      responseData = { raw: responseText };
    }

    console.log(`Parsed response:`, JSON.stringify(responseData, null, 2));

    // Return result
    return new Response(
      JSON.stringify({
        success: response.ok && responseData.sent === 'true',
        httpStatus: response.status,
        httpStatusText: response.statusText,
        ultraMsgResponse: responseData,
        testDetails: {
          instanceId,
          phone: testPhone,
          message: testMessage,
          url
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Test function error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Test function failed',
        details: error.message,
        stack: error.stack
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});