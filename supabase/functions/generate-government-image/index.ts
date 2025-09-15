import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CandidateData {
  name: string;
  avatar: string;
  expertise: string;
  party: string;
  experience: string;
}

interface GenerationRequest {
  selectedCandidates: Record<string, CandidateData>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { selectedCandidates }: GenerationRequest = await req.json();
    console.log('Generating image for candidates:', selectedCandidates);

    if (!selectedCandidates || Object.keys(selectedCandidates).length === 0) {
      return new Response(
        JSON.stringify({ error: 'No candidates provided' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const runwareApiKey = Deno.env.get('RUNWARE_API_KEY');
    if (!runwareApiKey) {
      console.error('RUNWARE_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'Configuration error: API key missing' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build detailed prompt for AI image generation
    const prompt = buildGovernmentPrompt(selectedCandidates);
    console.log('Generated prompt:', prompt);

    // Call Runware API
    const runwareResponse = await fetch('https://api.runware.ai/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        {
          taskType: "authentication",
          apiKey: runwareApiKey
        },
        {
          taskType: "imageInference",
          taskUUID: crypto.randomUUID(),
          positivePrompt: prompt,
          width: 1024,
          height: 1024,
          model: "runware:100@1",
          numberResults: 1,
          outputFormat: "WEBP",
          CFGScale: 1,
          scheduler: "FlowMatchEulerDiscreteScheduler",
          strength: 0.8
        }
      ])
    });

    if (!runwareResponse.ok) {
      const errorText = await runwareResponse.text();
      console.error('Runware API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Image generation failed', details: errorText }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const runwareData = await runwareResponse.json();
    console.log('Runware response:', runwareData);

    // Find the image result
    const imageResult = runwareData.data?.find((item: any) => item.taskType === 'imageInference');
    
    if (!imageResult || !imageResult.imageURL) {
      console.error('No image URL in response:', runwareData);
      return new Response(
        JSON.stringify({ error: 'No image generated' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        imageUrl: imageResult.imageURL,
        seed: imageResult.seed,
        prompt: prompt
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-government-image function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function buildGovernmentPrompt(selectedCandidates: Record<string, CandidateData>): string {
  const pmCandidate = selectedCandidates['pm'];
  const ministers = Object.entries(selectedCandidates)
    .filter(([key]) => key !== 'pm')
    .map(([ministry, candidate]) => ({ ministry, candidate }));

  let prompt = "Professional government portrait, official Israeli government photo style, ";
  
  if (pmCandidate) {
    prompt += `Prime Minister ${pmCandidate.name} in the center, `;
    prompt += `representing ${pmCandidate.party} party, `;
    prompt += `expertise in ${pmCandidate.expertise}, `;
  }

  if (ministers.length > 0) {
    prompt += "surrounded by cabinet ministers: ";
    ministers.forEach(({ ministry, candidate }, index) => {
      prompt += `${candidate.name} (${getMinistryName(ministry)})`;
      if (index < ministers.length - 1) prompt += ", ";
    });
  }

  prompt += ". Ultra high resolution, professional lighting, formal government setting, ";
  prompt += "Israeli flag in background, official government building interior, ";
  prompt += "sophisticated composition, political portrait photography style, ";
  prompt += "everyone wearing formal business attire, confident and authoritative poses, ";
  prompt += "realistic human faces, high quality professional photograph";

  return prompt;
}

function getMinistryName(ministryId: string): string {
  const ministryNames: Record<string, string> = {
    'defense': 'Defense Minister',
    'finance': 'Finance Minister', 
    'education': 'Education Minister',
    'health': 'Health Minister',
    'justice': 'Justice Minister',
    'transport': 'Transport Minister',
    'housing': 'Housing Minister',
    'economy': 'Economy Minister',
    'interior': 'Interior Minister',
    'foreign': 'Foreign Minister',
    'culture': 'Culture & Sports Minister',
    'science': 'Science & Technology Minister',
    'immigration': 'Immigration Minister',
    'agriculture': 'Agriculture Minister',
    'tourism': 'Tourism Minister'
  };
  return ministryNames[ministryId] || 'Minister';
}