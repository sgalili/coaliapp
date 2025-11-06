import { supabase } from '../integrations/supabase/client';

/**
 * Seeds demo data for the demo user profile
 * - Trust relationships (people I trust and who trust me)
 * - User votes on decisions
 */
export async function seedDemoProfileData() {
  console.log('🌱 Starting demo data seeding...');

  try {
    // 1. Create trust relationships - People who trust demo-user
    const trustersData = [
      {
        truster_user_id: 'user-1', // Yaron Zelekha
        trusted_user_id: 'demo-user',
        created_at: new Date().toISOString(),
      },
      {
        truster_user_id: 'user-2', // Noa Rotem
        trusted_user_id: 'demo-user',
        created_at: new Date().toISOString(),
      },
      {
        truster_user_id: 'user-3', // David Levi
        trusted_user_id: 'demo-user',
        created_at: new Date().toISOString(),
      },
    ];

    // 2. Create trust relationships - People demo-user trusts
    const trustedByMeData = [
      {
        truster_user_id: 'demo-user',
        trusted_user_id: 'user-1', // Yaron Zelekha
        created_at: new Date().toISOString(),
      },
      {
        truster_user_id: 'demo-user',
        trusted_user_id: 'user-4', // Rachel Cohen
        created_at: new Date().toISOString(),
      },
    ];

    // Insert trust relationships
    const { error: trustError } = await supabase
      .from('trust_relationships')
      .upsert([...trustersData, ...trustedByMeData], { onConflict: 'truster_user_id,trusted_user_id' });

    if (trustError) {
      console.error('❌ Error seeding trust relationships:', trustError);
    } else {
      console.log('✅ Trust relationships seeded successfully');
    }

    // 3. Get some decisions to vote on
    const { data: decisions, error: decisionsError } = await supabase
      .from('demo_decisions')
      .select('id, title, description')
      .limit(5);

    if (decisionsError) {
      console.error('❌ Error fetching decisions:', decisionsError);
    } else if (decisions && decisions.length > 0) {
      // Create votes for demo user
      const votesData = decisions.map((decision, index) => ({
        user_id: 'demo-user',
        decision_id: decision.id,
        vote_value: index % 3 === 0 ? 'yes' : index % 3 === 1 ? 'no' : 'abstain',
        created_at: new Date(Date.now() - index * 86400000).toISOString(), // Spread votes over past days
      }));

      const { error: votesError } = await supabase
        .from('user_votes')
        .upsert(votesData, { onConflict: 'user_id,decision_id' });

      if (votesError) {
        console.error('❌ Error seeding user votes:', votesError);
      } else {
        console.log('✅ User votes seeded successfully');
      }
    }

    console.log('🎉 Demo data seeding completed!');
    return { success: true };
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    return { success: false, error };
  }
}

// Run seeding if this file is executed directly
if (typeof window !== 'undefined') {
  (window as any).seedDemoProfileData = seedDemoProfileData;
  console.log('✅ Seeding function available as window.seedDemoProfileData()');
}
