import { supabase } from '@/lib/supabase';

export async function trackDecisionImpact(
  decisionId: string,
  expertId: string,
  outcome: string,
  delegatedVotes: number,
  totalVotes: number
) {
  try {
    const impactValue = delegatedVotes * 10; // 10 points per delegated vote

    await supabase.from('impact_events').insert({
      type: 'decision',
      title: 'השפעה על החלטה',
      description: `עזר ל-${delegatedVotes} אנשים להחליט`,
      expert_id: expertId,
      category: 'החלטות',
      impact_value: impactValue,
      delegated_votes: delegatedVotes,
      total_votes: totalVotes,
      outcome
    });
    
    console.log('✅ Decision impact tracked:', { expertId, impactValue });
  } catch (error) {
    console.error('❌ Failed to track decision impact:', error);
  }
}

export async function trackTrustGained(
  expertId: string,
  trusterId: string,
  category: string
) {
  try {
    const impactValue = 50; // 50 points per new trust

    const { data: truster } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('user_id', trusterId)
      .single();

    const trusterName = truster 
      ? `${truster.first_name} ${truster.last_name}`
      : 'משתמש';

    await supabase.from('impact_events').insert({
      type: 'trust',
      title: 'קיבל אמון חדש',
      description: `${trusterName} נתן אמון`,
      expert_id: expertId,
      category,
      impact_value: impactValue
    });
    
    console.log('✅ Trust impact tracked:', { expertId, impactValue });
  } catch (error) {
    console.error('❌ Failed to track trust impact:', error);
  }
}

export async function trackVoteInfluence(
  expertId: string,
  decisionTitle: string,
  votersInfluenced: number,
  category: string
) {
  try {
    const impactValue = votersInfluenced * 5; // 5 points per influenced voter

    await supabase.from('impact_events').insert({
      type: 'vote',
      title: 'השפיע על הצבעה',
      description: decisionTitle,
      expert_id: expertId,
      category,
      impact_value: impactValue,
      delegated_votes: votersInfluenced
    });
    
    console.log('✅ Vote influence tracked:', { expertId, votersInfluenced, impactValue });
  } catch (error) {
    console.error('❌ Failed to track vote influence:', error);
  }
}

export async function trackAchievement(
  expertId: string,
  achievementTitle: string,
  description: string,
  category: string,
  impactValue: number
) {
  try {
    await supabase.from('impact_events').insert({
      type: 'achievement',
      title: achievementTitle,
      description,
      expert_id: expertId,
      category,
      impact_value: impactValue
    });
    
    console.log('✅ Achievement tracked:', { expertId, achievementTitle, impactValue });
  } catch (error) {
    console.error('❌ Failed to track achievement:', error);
  }
}
