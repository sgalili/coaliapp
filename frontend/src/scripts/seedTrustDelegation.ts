/**
 * Seed Trust Delegation Demo Data
 * Creates demo expertise, delegations, and votes for testing
 */

import { supabase } from '@/integrations/supabase/client';

export async function seedTrustDelegationData() {
  console.log('🌱 Seeding trust delegation demo data...');

  try {
    // 1. Seed user expertise for demo users
    const expertiseData = [
      { user_id: 'user-1', expertise_field: 'כלכלה', verified: true }, // Yaron Zelekha
      { user_id: 'user-2', expertise_field: 'טכנולוגיה', verified: true }, // Noa Rotem
      { user_id: 'user-3', expertise_field: 'חברה', verified: true }, // David Levi
      { user_id: 'user-4', expertise_field: 'בריאות', verified: true }, // Rachel Cohen
      { user_id: 'user-5', expertise_field: 'חברה', verified: true }, // Amit Barak
      { user_id: 'user-5', expertise_field: 'משפט', verified: true }, // Amit Barak - Law too
    ];

    for (const expertise of expertiseData) {
      await supabase.from('user_expertise').upsert(expertise, {
        onConflict: 'user_id,expertise_field'
      });
    }
    console.log('✅ User expertise seeded');

    // 2. Create trust delegations - demo-user trusts these experts
    const delegationsData = [
      { truster_id: 'demo-user', trusted_id: 'user-1', expertise_field: 'כלכלה', is_active: true },
      { truster_id: 'demo-user', trusted_id: 'user-2', expertise_field: 'טכנולוגיה', is_active: true },
      { truster_id: 'demo-user', trusted_id: 'user-4', expertise_field: 'בריאות', is_active: true },
    ];

    for (const delegation of delegationsData) {
      await supabase.from('trust_delegations').upsert(delegation, {
        onConflict: 'truster_id,trusted_id,expertise_field'
      });
    }
    console.log('✅ Trust delegations seeded');

    // 3. Update existing decisions with categories and deadlines
    const decisionsUpdates = [
      {
        id: 'dec-1',
        category: 'חברה',
        end_date: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'dec-2',
        category: 'חינוך',
        end_date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'dec-3',
        category: 'תחבורה',
        end_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    for (const update of decisionsUpdates) {
      const withdrawalDeadline = new Date(new Date(update.end_date).getTime() - 3 * 60 * 60 * 1000);
      
      await supabase.from('demo_decisions').update({
        category: update.category,
        end_date: update.end_date,
        withdrawal_deadline: withdrawalDeadline.toISOString(),
        status: 'active'
      }).eq('id', update.id);
    }
    console.log('✅ Decisions updated with categories and deadlines');

    // 4. Create a sample delegated vote
    // Simulate: Expert user-2 (Noa Rotem) voted on a tech decision
    // This should trigger delegated vote for demo-user
    const sampleVote = {
      user_id: 'demo-user',
      decision_id: 'dec-3',
      vote_value: 'yes',
      is_delegated: true,
      delegated_by: 'user-2',
      can_withdraw: true
    };

    await supabase.from('user_votes').upsert(sampleVote, {
      onConflict: 'user_id,decision_id'
    });
    console.log('✅ Sample delegated vote created');

    console.log('🎉 Trust delegation demo data seeded successfully!');
    return { success: true };
  } catch (error) {
    console.error('❌ Error seeding trust delegation data:', error);
    return { success: false, error };
  }
}

// Make available in browser console for manual seeding
if (typeof window !== 'undefined') {
  (window as any).seedTrustDelegationData = seedTrustDelegationData;
}
