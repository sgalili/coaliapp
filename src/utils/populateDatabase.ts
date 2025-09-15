import { supabase } from '@/integrations/supabase/client';

export const populatePMCandidates = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('populate-pm-candidates');
    
    if (error) {
      console.error('Error populating PM candidates:', error);
      return { success: false, error };
    }

    console.log('Successfully populated PM candidates:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error };
  }
};

// Auto-populate on first load if database is empty
export const checkAndPopulateCandidates = async () => {
  try {
    const { count, error } = await supabase
      .from('prime_minister_candidates')
      .select('*', { count: 'exact', head: true });
      
    if (error) {
      console.error('Error checking candidates:', error);
      return;
    }

    if (count === 0) {
      console.log('No PM candidates found, populating database...');
      await populatePMCandidates();
    }
  } catch (error) {
    console.error('Error in checkAndPopulateCandidates:', error);
  }
};