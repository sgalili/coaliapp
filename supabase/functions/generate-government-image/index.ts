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

  const totalPeople = (pmCandidate ? 1 : 0) + ministers.length;
  
  let prompt = `Professional Israeli government portrait featuring exactly ${totalPeople} people. `;
  
  // Composition structure
  if (pmCandidate && ministers.length > 0) {
    prompt += `1 Prime Minister in center foreground, ${ministers.length} cabinet ministers arranged around. `;
  } else if (pmCandidate) {
    prompt += "1 Prime Minister in center. ";
  } else if (ministers.length > 0) {
    prompt += `${ministers.length} cabinet ministers arranged in formal composition. `;
  }

  // Specific positioning and details
  if (pmCandidate) {
    prompt += `Prime Minister ${pmCandidate.name} (center position, dark formal suit, confident pose), `;
  }

  if (ministers.length > 0) {
    ministers.forEach(({ ministry, candidate }, index) => {
      const positions = ['left side', 'right side', 'back left', 'back right', 'back center'];
      const position = positions[index] || 'background';
      prompt += `${getMinistryName(ministry)} ${candidate.name} (${position} position, formal attire), `;
    });
  }

  // Visual quality specifications
  prompt += "All individuals with unique and distinct facial features, no duplicate faces, ";
  prompt += "different ages and builds for diversity, all wearing dark formal business suits, ";
  prompt += "standing in official Israeli government building interior, Israeli flag prominently displayed in background, ";
  prompt += "professional studio lighting with soft shadows, formal government setting, ";
  prompt += "sophisticated political portrait photography style, confident and authoritative body language, ";
  prompt += "ultra high resolution, sharp focus, realistic human proportions, ";
  prompt += "professional government photo quality, no artificial or cartoonish features, ";
  prompt += "natural skin tones, proper formal dress code, dignified poses";

  return prompt;
}

function getMinistryName(ministryId: string): string {
  const ministryNames: Record<string, string> = {
    'defense': 'Defense Minister',
    'finance': 'Finance Minister', 
    'education': 'Education Minister',
    'health': 'Health Minister',
    'justice': 'Justice Minister',
    'environment': 'Environment Minister',
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