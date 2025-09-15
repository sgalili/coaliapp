import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const PopulatePMCandidates = () => {
  const [isPopulating, setIsPopulating] = useState(false);

  const populateCandidates = async () => {
    try {
      setIsPopulating(true);
      
      const { data, error } = await supabase.functions.invoke('populate-pm-candidates');
      
      if (error) {
        console.error('Error calling populate function:', error);
        toast({
          title: "שגיאה",
          description: "לא הצלחנו לטעון את המועמדים",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "הצלחה!",
        description: `${data.count} מועמדים נטענו בהצלחה`,
      });
      
      // Refresh the page to load the new candidates
      window.location.reload();
      
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בלתי צפויה",
        variant: "destructive",
      });
    } finally {
      setIsPopulating(false);
    }
  };

  return (
    <Button 
      onClick={populateCandidates}
      disabled={isPopulating}
      variant="outline"
      size="sm"
    >
      {isPopulating ? "טוען מועמדים..." : "טען מועמדי ראש הממשלה"}
    </Button>
  );
};