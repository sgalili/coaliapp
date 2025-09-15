import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface EducationCandidate {
  id: string;
  name: string;
  avatar: string;
  expertise: string[];
  party: string;
  experience: string;
  bio?: string;
  wikipedia_url?: string;
}

export const useEducationCandidates = () => {
  const [candidates, setCandidates] = useState<EducationCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('education_candidates')
          .select('*')
          .order('name');

        if (error) {
          console.error('Error fetching Education candidates:', error);
          setError(error.message);
          return;
        }

        // Transform data to match the expected format
        const transformedCandidates: EducationCandidate[] = (data || []).map(candidate => ({
          id: candidate.id,
          name: candidate.name,
          avatar: candidate.avatar_url || '',
          expertise: candidate.expertise || [],
          party: candidate.party || '',
          experience: candidate.experience || '',
          bio: candidate.bio,
          wikipedia_url: candidate.wikipedia_url
        }));

        setCandidates(transformedCandidates);
      } catch (err) {
        console.error('Unexpected error fetching candidates:', err);
        setError('Failed to load candidates');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  return { candidates, isLoading, error };
};