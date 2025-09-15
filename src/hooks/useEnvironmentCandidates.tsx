import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface EnvironmentCandidate {
  id: string;
  name: string;
  avatar_url?: string;
  expertise?: string[];
  party?: string;
  experience?: string;
  bio?: string;
  wikipedia_url?: string;
}

export const useEnvironmentCandidates = () => {
  const [candidates, setCandidates] = useState<EnvironmentCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const { data, error } = await supabase
          .from('environment_candidates')
          .select('*')
          .order('name');
        
        if (error) throw error;
        setCandidates(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load environment candidates');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  return { candidates, isLoading, error };
};