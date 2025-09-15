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

    // Upload candidate images as references and build prompt
    const { prompt, imageReferences } = await buildGovernmentPromptWithReferences(selectedCandidates, runwareApiKey);
    console.log('Generated prompt:', prompt);
    console.log('Image references:', imageReferences);

    // Prepare Runware API tasks
    const tasks = [
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
        model: "runware:101@1", // PhotoMaker model
        numberResults: 1,
        outputFormat: "WEBP",
        CFGScale: 1,
        scheduler: "FlowMatchEulerDiscreteScheduler",
        strength: 0.8,
        ...(imageReferences.length > 0 && { 
          inputImages: imageReferences,
          photoMakerStrength: 0.8
        })
      }
    ];

    // Call Runware API
    const runwareResponse = await fetch('https://api.runware.ai/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tasks)
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

async function buildGovernmentPromptWithReferences(
  selectedCandidates: Record<string, CandidateData>, 
  runwareApiKey: string
): Promise<{ prompt: string; imageReferences: string[] }> {
  const pmCandidate = selectedCandidates['pm'];
  const ministers = Object.entries(selectedCandidates)
    .filter(([key]) => key !== 'pm')
    .map(([ministry, candidate]) => ({ ministry, candidate }));

  const totalPeople = 1 + ministers.length; // PM + ministers
  const imageReferences: string[] = [];

  // Upload candidate images as references
  try {
    const uploadTasks = [];
    
    if (pmCandidate?.avatar) {
      uploadTasks.push(uploadImageReference(pmCandidate.avatar, runwareApiKey));
    }
    
    for (const { candidate } of ministers) {
      if (candidate.avatar) {
        uploadTasks.push(uploadImageReference(candidate.avatar, runwareApiKey));
      }
    }

    const uploadResults = await Promise.all(uploadTasks);
    imageReferences.push(...uploadResults.filter(Boolean));
  } catch (error) {
    console.warn('Failed to upload some image references:', error);
  }

  // Build enhanced prompt with spatial arrangement
  let prompt = `Professional Israeli government portrait photograph featuring exactly ${totalPeople} people: `;
  
  if (pmCandidate) {
    prompt += `Prime Minister ${pmCandidate.name} in the center foreground, `;
    prompt += `representing ${pmCandidate.party} party, `;
  }

  if (ministers.length > 0) {
    prompt += `flanked by ${ministers.length} cabinet ministers arranged around: `;
    ministers.forEach(({ ministry, candidate }, index) => {
      prompt += `${candidate.name} (${getMinistryName(ministry)})`;
      if (index < ministers.length - 1) prompt += ", ";
    });
  }

  prompt += ". All wearing dark formal business suits, standing in official Israeli government building ";
  prompt += "with Israeli flag backdrop, professional lighting, distinct facial features for each person, ";
  prompt += "no duplicate faces, official state portrait style, high resolution, ";
  prompt += "sophisticated composition, confident and authoritative poses, realistic human faces";

  return { prompt, imageReferences };
}

async function uploadImageReference(avatarPath: string, runwareApiKey: string): Promise<string | null> {
  try {
    // Convert relative path to full URL
    const baseUrl = 'https://hcqygoupvgcsdxtzyest.supabase.co/storage/v1/object/public';
    const imageUrl = avatarPath.startsWith('http') ? avatarPath : `${baseUrl}${avatarPath}`;
    
    const uploadResponse = await fetch('https://api.runware.ai/v1', {
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
          taskType: "imageUpload",
          taskUUID: crypto.randomUUID(),
          imageInitiator: imageUrl
        }
      ])
    });

    if (uploadResponse.ok) {
      const uploadData = await uploadResponse.json();
      const uploadResult = uploadData.data?.find((item: any) => item.taskType === 'imageUpload');
      return uploadResult?.imageUUID || null;
    }
  } catch (error) {
    console.warn('Failed to upload image reference:', avatarPath, error);
  }
  return null;
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