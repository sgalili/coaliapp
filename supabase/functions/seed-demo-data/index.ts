import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.54.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting demo data seeding...');

    // Clear existing demo data
    await clearDemoData(supabase);

    // Generate demo profiles
    const profiles = await generateDemoProfiles(supabase);
    console.log(`Created ${profiles.length} demo profiles`);

    // Generate demo posts
    const posts = await generateDemoPosts(supabase, profiles);
    console.log(`Created ${posts.length} demo posts`);

    // Generate trust relationships
    await generateTrustRelationships(supabase, profiles);
    console.log('Created trust relationships');

    // Generate watch relationships
    await generateWatchRelationships(supabase, profiles);
    console.log('Created watch relationships');

    // Generate demo comments
    await generateDemoComments(supabase, posts, profiles);
    console.log('Created demo comments');

    // Generate wallet balances and transactions
    await generateWalletData(supabase, profiles);
    console.log('Created wallet data');

    // Generate demo polls
    await generateDemoPolls(supabase, profiles);
    console.log('Created demo polls');

    // Generate demo news
    await generateDemoNews(supabase);
    console.log('Created demo news');

    // Generate demo news comments
    await generateDemoNewsComments(supabase, profiles);
    console.log('Created demo news comments');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Demo data seeded successfully',
        stats: {
          profiles: profiles.length,
          posts: posts.length,
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error seeding demo data:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function clearDemoData(supabase: any) {
  const tables = [
    'demo_trusts',
    'demo_poll_votes',
    'zooz_transactions',
    'user_balances',
    'demo_posts',
    'demo_news_articles',
    'demo_polls',
    'demo_profiles',
  ];

  for (const table of tables) {
    await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
  }
}

async function generateDemoProfiles(supabase: any) {
  // First, create the primary demo user (Yaron Zelekha)
  const primaryDemoUserId = crypto.randomUUID();
  const primaryJoinDate = new Date('2023-03-15');
  
  const { data: primaryProfile, error: primaryError } = await supabase
    .from('demo_profiles')
    .insert({
      user_id: primaryDemoUserId,
      first_name: 'ירון',
      last_name: 'זלקה',
      phone: '+972501234567',
      avatar_url: '/src/assets/yaron-zelekha-profile.jpg',
      created_at: primaryJoinDate.toISOString(),
    })
    .select()
    .single();

  if (primaryError) {
    console.error('Error creating primary profile:', primaryError);
  }

  const profiles = primaryProfile ? [{ 
    ...primaryProfile, 
    bio: 'כלכלן, מומחה לשוק ההון וכלכלת ישראל. לשעבר סמנכ"ל בנק ישראל',
    location: 'תל אביב, ישראל',
    isPrimary: true
  }] : [];

  // Create user balance for primary user
  await supabase.from('user_balances').insert({
    user_id: primaryDemoUserId,
    zooz_balance: 15680,
    usd_value: 203.84,
    percentage_change: 5.2,
  });

  // Create KYC verification for primary user (Level 5)
  await supabase.from('kyc_verifications').insert({
    user_id: primaryDemoUserId,
    level: 5,
    status: 'verified',
    verified_at: primaryJoinDate.toISOString(),
  });

  // Create expertise for primary user
  await supabase.from('user_expertise').insert([
    { user_id: primaryDemoUserId, domain: 'economy', level: 5, verified: true },
    { user_id: primaryDemoUserId, domain: 'finance', level: 5, verified: true },
    { user_id: primaryDemoUserId, domain: 'policy', level: 4, verified: true },
  ]);

  // Store primary user ID in localStorage-like variable for reference
  console.log('Primary demo user created:', primaryDemoUserId);

  const names = [
    { first: 'נועה', last: 'רותם', bio: 'עיתונאית חוקרת, מתמחה בפוליטיקה' },
    { first: 'דוד', last: 'לוי', bio: 'יועץ טכנולוגי, מומחה בסייבר' },
    { first: 'רחל', last: 'כהן', bio: 'רופאה בכירה, מנהלת מחלקה' },
    { first: 'אמית', last: 'ברק', bio: 'עורך דין חוקתי, פעיל חברתי' },
    { first: 'מיכל', last: 'שמיר', bio: 'מורה לפיזיקה, בלוגרית מדע' },
    { first: 'יוסי', last: 'אברהם', bio: 'יזם סטארטאפים, משקיע מלאך' },
    { first: 'תמר', last: 'גולן', bio: 'פסיכולוגית קלינית, מרצה' },
    { first: 'עומר', last: 'שרון', bio: 'חוקר סביבה, פעיל אקלים' },
    { first: 'ליאת', last: 'מזרחי', bio: 'מנהלת משאבי אנוש, מאמנת קריירה' },
    { first: 'אלון', last: 'גבעתי', bio: 'סופר ועיתונאי, כותב טורים' },
    { first: 'שירה', last: 'לבנון', bio: 'מעצבת גרפית, אמנית דיגיטלית' },
    { first: 'רוני', last: 'פרץ', bio: 'מהנדס תוכנה, מפתח אופן סורס' },
    { first: 'יעל', last: 'ברוך', bio: 'מנהלת מוצר, יועצת חדשנות' },
    { first: 'גיא', last: 'אורן', bio: 'מדען מחשב, חוקר בינה מלאכותית' },
    { first: 'הדר', last: 'כץ', bio: 'מנהלת קהילה, פעילה חברתית' },
    { first: 'עידו', last: 'בן דוד', bio: 'אנליסט פיננסי, יועץ השקעות' },
    { first: 'מאיה', last: 'שטרן', bio: 'עורכת וידאו, יוצרת תוכן' },
    { first: 'אורי', last: 'גל', bio: 'מורה לכלכלה, חוקר שווקים' },
    { first: 'דנה', last: 'ויזל', bio: 'עובדת סוציאלית, מתנדבת' },
  ];

  const profiles = [];
  const baseDate = new Date();

  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const joinDate = new Date(baseDate.getTime() - Math.random() * 180 * 24 * 60 * 60 * 1000);
    
    const { data, error } = await supabase
      .from('demo_profiles')
      .insert({
        user_id: crypto.randomUUID(),
        first_name: name.first,
        last_name: name.last,
        phone: `+97250${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`,
        avatar_url: `/public/candidates/placeholder-defense.jpg`,
        created_at: joinDate.toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      continue;
    }

    profiles.push({ ...data, bio: name.bio, location: '' });

    // Create user balance
    const zoozBalance = Math.floor(1000 + Math.random() * 4000);
    await supabase.from('user_balances').insert({
      user_id: data.user_id,
      zooz_balance: zoozBalance,
      usd_value: zoozBalance * 0.013,
      percentage_change: (Math.random() - 0.5) * 10,
    });

    // Create KYC verification for most users
    if (i < 15) {
      await supabase.from('kyc_verifications').insert({
        user_id: data.user_id,
        level: Math.floor(Math.random() * 4) + 1,
        status: 'verified',
        verified_at: joinDate.toISOString(),
      });
    }
  }

  return profiles;
}

async function generateDemoPosts(supabase: any, profiles: any[]) {
  const categories = ['הכל', 'פוליטיקה', 'טכנולוגיה', 'כלכלה', 'חברה', 'בריאות', 'חינוך'];
  const domains = ['politics', 'technology', 'economy', 'society', 'health', 'education'];
  
  const posts = [];
  const baseDate = new Date();
  
  // Find the primary user
  const primaryUser = profiles.find(p => p.isPrimary) || profiles[0];

  // Create 47 posts for primary user
  const primaryPostTemplates = [
    { title: 'ניתוח התקציב החדש - מה באמת קורה?', content: 'פירוט מעמיק של הצעת התקציב ומשמעויותיה על הכלכלה', category: 'כלכלה', domain: 'economy' },
    { title: 'האינפלציה בישראל - תמונת מצב', content: 'סקירה של מגמות האינפלציה והשפעתן על האזרח הממוצע', category: 'כלכלה', domain: 'economy' },
    { title: 'שוק הנדל"ן - לאן הוא הולך?', content: 'ניתוח מגמות ותחזיות לשוק הדיור בישראל', category: 'כלכלה', domain: 'economy' },
    { title: 'המלחמה הכלכלית בין ארה"ב לסין', content: 'השלכות על הכלכלה הגלובלית וישראל', category: 'כלכלה', domain: 'economy' },
    { title: 'מדיניות בנק ישראל - ריבית וצמיחה', content: 'האם בנק ישראל עושה מספיק?', category: 'כלכלה', domain: 'economy' },
    { title: 'הייטק ישראלי - משבר או הזדמנות?', content: 'מה קורה עם חברות הסטארטאפ שלנו?', category: 'טכנולוגיה', domain: 'technology' },
    { title: 'רפורמה במערכת הפנסיונית', content: 'מה צריך להשתנות כדי להבטיח עתיד כלכלי?', category: 'כלכלה', domain: 'economy' },
    { title: 'משבר האנרגיה העולמי', content: 'השפעות על מחירי הדלק והחשמל בישראל', category: 'כלכלה', domain: 'economy' },
    { title: 'הכלכלה הירוקה - עתיד או אשליה?', content: 'האם זה כדאי כלכלית?', category: 'סביבה', domain: 'environment' },
    { title: 'שוק העבודה המשתנה', content: 'טכנולוגיה, גלובליזציה והעתיד של העובדים', category: 'כלכלה', domain: 'economy' },
  ];

  for (let i = 0; i < 47; i++) {
    const template = primaryPostTemplates[i % primaryPostTemplates.length];
    const createdAt = new Date(baseDate.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    
    const trustCount = Math.floor(800 + Math.random() * 1200);
    const watchCount = Math.floor(1500 + Math.random() * 2000);
    const commentCount = Math.floor(30 + Math.random() * 70);
    const shareCount = Math.floor(20 + Math.random() * 50);
    const viewCount = Math.floor(8000 + Math.random() * 5000);
    const zoozEarned = Math.floor(trustCount * 0.5 + watchCount * 0.2);

    const { data, error } = await supabase
      .from('demo_posts')
      .insert({
        user_id: primaryUser.user_id,
        title: `${template.title}`,
        content: template.content,
        category: template.category,
        domain: template.domain,
        trust_count: trustCount,
        watch_count: watchCount,
        comment_count: commentCount,
        share_count: shareCount,
        view_count: viewCount,
        zooz_earned: zoozEarned,
        created_at: createdAt.toISOString(),
        video_url: i % 4 === 0 ? '/public/videos/netanyahu-debate.mp4' : null,
        thumbnail_url: '/public/vote.png',
      })
      .select()
      .single();

    if (!error && data) {
      posts.push(data);
    }
  }

  // Create additional posts for other users
  const postTemplates = [
    { title: 'מה דעתכם על הצעת התקציב החדשה?', content: 'הממשלה הציגה את הצעת התקציב. האם זה מספיק לטיפול במשבר המחיר?', category: 'כלכלה', domain: 'economy' },
    { title: 'בינה מלאכותית משנה את שוק העבודה', content: 'איך נתכונן למהפכה הטכנולוגית הקרובה?', category: 'טכנולוגיה', domain: 'technology' },
    { title: 'רפורמה במערכת החינוך - הזמן הגיע', content: 'מה צריך להשתנות כדי להתאים את החינוך למאה ה-21?', category: 'חינוך', domain: 'education' },
    { title: 'משבר האקלים - האם עושים מספיק?', content: 'מדענים מזהירים, אבל האם הציבור מבין את הסיכון?', category: 'חברה', domain: 'society' },
    { title: 'מערכת הבריאות קורסת תחת העומס', content: 'האם הגיע הזמן לפתרונות דיגיטליים?', category: 'בריאות', domain: 'health' },
    { title: 'שקיפות בפוליטיקה - למה זה חשוב', content: 'איך אפשר לדרוש אחריותיות מהנבחרים שלנו?', category: 'פוליטיקה', domain: 'politics' },
    { title: 'סטארטאפים ישראליים משנים את העולם', content: 'איך המערכת התומכת יכולה להמשיך לחזק חדשנות?', category: 'טכנולוגיה', domain: 'technology' },
    { title: 'הפער החברתי מתרחב', content: 'מה אפשר לעשות כדי לצמצם את אי השוויון?', category: 'חברה', domain: 'society' },
    { title: 'מדיניות חוץ בעידן חדש', content: 'איך ישראל צריכה למקם את עצמה במזרח התיכון המשתנה?', category: 'פוליטיקה', domain: 'politics' },
    { title: 'חינוך דיגיטלי - האם זה עובד?', content: 'ניתוח השפעת הלמידה מרחוק על התלמידים', category: 'חינוך', domain: 'education' },
  ];

  for (let i = 0; i < 30; i++) {
    const template = postTemplates[i % postTemplates.length];
    const author = profiles.filter(p => !p.isPrimary)[Math.floor(Math.random() * (profiles.length - 1))];
    const createdAt = new Date(baseDate.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    
    const trustCount = Math.floor(500 + Math.random() * 4500);
    const watchCount = Math.floor(1000 + Math.random() * 7000);
    const commentCount = Math.floor(10 + Math.random() * 40);
    const shareCount = Math.floor(5 + Math.random() * 45);
    const viewCount = Math.floor(5000 + Math.random() * 15000);
    const zoozEarned = Math.floor(trustCount * 0.5 + watchCount * 0.2);

    const { data, error } = await supabase
      .from('demo_posts')
      .insert({
        user_id: author.user_id,
        title: `${template.title} #${i + 1}`,
        content: template.content,
        category: template.category,
        domain: template.domain,
        trust_count: trustCount,
        watch_count: watchCount,
        comment_count: commentCount,
        share_count: shareCount,
        view_count: viewCount,
        zooz_earned: zoozEarned,
        created_at: createdAt.toISOString(),
        video_url: i % 3 === 0 ? '/public/videos/netanyahu-debate.mp4' : null,
        thumbnail_url: '/public/vote.png',
      })
      .select()
      .single();

    if (!error) {
      posts.push(data);
    }
  }

  return posts;
}

async function generateTrustRelationships(supabase: any, profiles: any[]) {
  const trusts = [];
  const primaryUser = profiles.find(p => p.isPrimary);
  
  // Create trusters for primary user (people who trust Yaron)
  if (primaryUser) {
    const trustersCount = 35; // Will simulate ~8,547 through multiple entries
    const trusters = [...profiles]
      .filter(p => p.user_id !== primaryUser.user_id)
      .slice(0, trustersCount);

    for (const truster of trusters) {
      // Each truster trusts primary user multiple times (simulating domain-specific trust)
      for (let i = 0; i < Math.floor(200 + Math.random() * 300); i++) {
        trusts.push({
          truster_id: truster.user_id,
          trusted_id: primaryUser.user_id,
          created_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        });
      }
    }

    // Primary user trusts 25 others
    const trustedByPrimary = [...profiles]
      .filter(p => p.user_id !== primaryUser.user_id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 25);

    for (const trusted of trustedByPrimary) {
      trusts.push({
        truster_id: primaryUser.user_id,
        trusted_id: trusted.user_id,
        created_at: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
  }
  
  // Create trust relationships for other users
  for (const truster of profiles.filter(p => !p.isPrimary)) {
    const trustCount = Math.floor(5 + Math.random() * 10);
    const trustedUsers = [...profiles]
      .filter(p => p.user_id !== truster.user_id)
      .sort(() => Math.random() - 0.5)
      .slice(0, trustCount);

    for (const trusted of trustedUsers) {
      trusts.push({
        truster_id: truster.user_id,
        trusted_id: trusted.user_id,
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
  }

  // Insert in batches
  const batchSize = 100;
  for (let i = 0; i < trusts.length; i += batchSize) {
    await supabase.from('demo_trusts').insert(trusts.slice(i, i + batchSize));
  }
}

async function generateWatchRelationships(supabase: any, profiles: any[]) {
  // Similar to trusts but different pattern
  for (const watcher of profiles) {
    const watchCount = Math.floor(3 + Math.random() * 10);
    const watchedUsers = [...profiles]
      .filter(p => p.user_id !== watcher.user_id)
      .sort(() => Math.random() - 0.5)
      .slice(0, watchCount);

    // Note: This would need a demo_watches table if it doesn't exist
    // Skipping for now as it's not in the schema
  }
}

async function generateDemoComments(supabase: any, posts: any[], profiles: any[]) {
  const commentTemplates = [
    'נקודה מעניינת! לא חשבתי על זה מהזווית הזו.',
    'אני חושב שצריך לקחת בחשבון גם...',
    'מסכים לחלוטין, זה בדיוק מה שחסר לנו.',
    'יש פה נקודה חשובה, אבל אני חושב שזה מסובך יותר.',
    'שאלה מצוינת! מי שיש לו מידע נוסף?',
    'תודה על השיתוף, זה ממש רלוונטי.',
    'אני לא בטוח שזה נכון, יש לי נקודת מבט אחרת.',
    'זה נושא חשוב שצריך יותר תשומת לב ציבורית.',
  ];

  // Generate 100+ comments
  for (let i = 0; i < 120; i++) {
    const post = posts[Math.floor(Math.random() * posts.length)];
    const author = profiles[Math.floor(Math.random() * profiles.length)];
    const comment = commentTemplates[Math.floor(Math.random() * commentTemplates.length)];
    
    await supabase.from('demo_posts').insert({
      user_id: author.user_id,
      content: `${comment} (${i + 1})`,
      created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }
}

async function generateWalletData(supabase: any, profiles: any[]) {
  const transactionTypes = ['reward', 'send', 'receive', 'purchase'];
  const descriptions = [
    'פרסום פוסט פופולרי',
    'קיבלת תגובה חיובית',
    'העברה מחבר',
    'רכישת Zooz',
    'פרס על תוכן איכותי',
    'השתתפות בסקר',
  ];

  for (const profile of profiles) {
    // Generate 3-5 transactions per user
    const txCount = Math.floor(3 + Math.random() * 3);
    
    for (let i = 0; i < txCount; i++) {
      const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
      const amount = type === 'purchase' ? Math.floor(50 + Math.random() * 450) : Math.floor(1 + Math.random() * 50);
      
      await supabase.from('zooz_transactions').insert({
        from_user_id: type === 'send' ? profile.user_id : null,
        to_user_id: type === 'receive' || type === 'reward' ? profile.user_id : null,
        amount,
        transaction_type: type,
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
  }
}

async function generateDemoPolls(supabase: any, profiles: any[]) {
  const pollTemplates = [
    {
      question: 'מה לדעתך הנושא הכי חשוב כרגע?',
      options: ['כלכלה', 'ביטחון', 'חינוך', 'בריאות', 'סביבה'],
      type: 'multiple_choice'
    },
    {
      question: 'האם אתה בעד רפורמה במערכת המשפט?',
      options: ['בעד', 'נגד', 'לא בטוח'],
      type: 'binary'
    },
    {
      question: 'כמה שעות ביום אתה משקיע בחדשות?',
      options: ['פחות משעה', '1-2 שעות', '2-3 שעות', 'יותר מ-3 שעות'],
      type: 'multiple_choice'
    },
    {
      question: 'מה הערוץ המועדף עליך לצריכת חדשות?',
      options: ['טלוויזיה', 'רדיו', 'אינטרנט', 'רשתות חברתיות', 'עיתונים'],
      type: 'multiple_choice'
    },
    {
      question: 'האם הממשלה עושה מספיק למשבר האקלים?',
      options: ['כן', 'לא', 'לא יודע'],
      type: 'binary'
    },
  ];

  const polls = [];

  for (let i = 0; i < 15; i++) {
    const template = pollTemplates[i % pollTemplates.length];
    const author = profiles[Math.floor(Math.random() * profiles.length)];
    
    const { data, error } = await supabase
      .from('demo_polls')
      .insert({
        question: `${template.question} (${i + 1})`,
        options: JSON.stringify(template.options.map(opt => ({ id: crypto.randomUUID(), text: opt }))),
        poll_type: template.type,
        published_date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        expires_at: new Date(Date.now() + (Math.random() > 0.3 ? 7 : -1) * 24 * 60 * 60 * 1000).toISOString(),
        total_votes: Math.floor(100 + Math.random() * 400),
      })
      .select()
      .single();

    if (!error && data) {
      polls.push(data);
      
      // Generate votes for this poll
      const voteCount = Math.floor(100 + Math.random() * 400);
      const options = JSON.parse(data.options);
      
      for (let v = 0; v < voteCount; v++) {
        const voter = profiles[Math.floor(Math.random() * profiles.length)];
        const option = options[Math.floor(Math.random() * options.length)];
        
        await supabase.from('demo_poll_votes').insert({
          poll_id: data.id,
          user_id: voter.user_id,
          option_id: option.id,
          created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        });
      }
    }
  }

  return polls;
}

async function generateDemoNews(supabase: any) {
  const newsTemplates = [
    { 
      title: 'הממשלה מאשרת תקציב שיא לחינוך',
      description: 'התקציב החדש כולל העלאת שכר למורים והשקעה במבנים חדשים',
      content: 'הכנסת אישרה היום בקריאה שלישית את תקציב החינוך הגדול בתולדות המדינה. התקציב כולל העלאת שכר של 15% למורים, בניית 200 בתי ספר חדשים, והשקעה נרחבת בטכנולוגיה חינוכית. שר החינוך: "זהו צעד היסטורי שישפר את מערכת החינוך לדורות הבאים".',
      category: 'חינוך', 
      source: 'חדשות 13' 
    },
    { 
      title: 'פריצת דרך בטכנולוגיית האנרגיה הירוקה',
      description: 'סטארטאפ ישראלי פיתח סוללה חדשנית שמכפילה את יעילות האחסון',
      content: 'חברת אנרטק הישראלית הציגה היום סוללה חדשנית המבוססת על טכנולוגיה קוונטית. הסוללה מסוגלת לאחסן כמות אנרגיה כפולה במשך זמן ארוך יותר, ועלותה נמוכה ב-40% מסוללות קיימות. המומחים טוענים שזו יכולה להיות מהפכה בתחום האנרגיה המתחדשת.',
      category: 'סביבה', 
      source: 'גלובס' 
    },
    { 
      title: 'כלכלנים צופים צמיחה של 4% השנה',
      description: 'תחזית אופטימית למרות האתגרים הגלובליים',
      content: 'הכלכלנים המובילים במשק מעריכים כי הכלכלה הישראלית תצמח השנה ב-4%, קצב מרשים למרות המצב הגלובלי. הצמיחה תונע על ידי תעשיית ההייטק, יצוא שיאי, וצריכה פנימית חזקה. עם זאת, המומחים מזהירים מפני האינפלציה המתמשכת.',
      category: 'כלכלה', 
      source: 'TheMarker' 
    },
    { 
      title: 'מחקר חדש על השפעת הבינה המלאכותית',
      description: 'אוניברסיטת תל אביב חושפת: AI משנה את שוק העבודה מהר יותר מהצפוי',
      content: 'מחקר מקיף שנערך באוניברסיטת תל אביב מראה כי טכנולוגיות AI משנות את שוק העבודה בקצב מהיר פי 3 מהתחזיות. המחקר בוחן 500 מקצועות ומצביע על הצורך בהכשרה מחדש של עובדים רבים. פרופ\' שמואל כהן: "עלינו להיערך כבר היום למציאות החדשה".',
      category: 'טכנולוגיה', 
      source: 'Ynet' 
    },
    { 
      title: 'רפורמה במערכת הבריאות זוכה לתמיכה רחבה',
      description: 'קואליציה רחבה תומכת בשינויים המיוחלים במערכת הבריאות',
      content: 'הרפורמה המקיפה במערכת הבריאות זוכה לתמיכה נרחבת מכל קשת הספקטרום הפוליטי. הרפורמה כוללת הקצאת תקציב נוסף, צמצום רשימות המתנה, ושיפור תנאי העבודה של הצוות הרפואי. ארגוני הרופאים והאחיות מברכים על הצעדים.',
      category: 'בריאות', 
      source: 'מעריב' 
    },
    { 
      title: 'ראש הממשלה בנאום חשוב בכנסת',
      description: 'נתניהו מציג חזון למדיניות החוץ לעשור הבא',
      content: 'ראש הממשלה בנימין נתניהו נשא היום נאום מדיניות חשוב בכנסת, בו הציג את החזון שלו למדיניות החוץ של ישראל לעשור הבא. הנאום התמקד בחיזוק הקשרים עם מדינות המפרץ, שמירה על היתרון האיכותי הביטחוני, והרחבת שיתופי הפעולה הכלכליים.',
      category: 'פוליטיקה', 
      source: 'ערוץ 12' 
    },
    { 
      title: 'חברות הייטק ישראליות מגייסות מיליארדים',
      description: 'גל השקעות חדש מעיד על אמון במשק הישראלי',
      content: 'חברות הייטק ישראליות גייסו ברבעון האחרון 5.2 מיליארד דולר, שיא חדש ברבעון בודד. ההשקעות מגיעות מקרנות מובילות בעולם ומעידות על האמון הגבוה של המשקיעים הבינלאומיים בחדשנות הישראלית. ענפי ה-AI והסייבר מובילים את הגיוסים.',
      category: 'טכנולוגיה', 
      source: 'כלכליסט' 
    },
    { 
      title: 'עשרות אלפים במחאה למען הסביבה',
      description: 'מחאה היסטורית דורשת צעדים דרסטיים נגד משבר האקלים',
      content: 'מאות אלפי אזרחים יצאו היום לרחובות בערים גדולות ברחבי הארץ, בדרישה מהממשלה לנקוט בצעדים מיידיים למאבק במשבר האקלים. המפגינים דרשו הגברת השימוש באנרגיות מתחדשות, הפחתת פליטות, והשקעה בתחבורה ציבורית ירוקה.',
      category: 'חברה', 
      source: 'הארץ' 
    },
    { 
      title: 'משבר הדיור: פתרונות חדשניים באופק',
      description: 'תוכנית לאומית מציעה דרכים יצירתיות להתמודד עם משבר הדיור',
      content: 'משרד השיכון הציג תוכנית מקיפה שמטרתה להתמודד עם משבר הדיור. התוכנית כוללת בנייה מואצת של 100,000 יחידות דיור, תמריצים למשקיעים בדיור בר השגה, ושינוי תמ"א להקלות בנייה. המומחים סקפטיים אך רואים בזה צעד ראשון.',
      category: 'חברה', 
      source: 'חדשות 13' 
    },
    { 
      title: 'מערכת החינוך עוברת דיגיטציה נרחבת',
      description: 'כל תלמיד יקבל מחשב נייד ונגישות למשאבי למידה דיגיטליים',
      content: 'משרד החינוך מתחיל ביישום תוכנית דיגיטציה ארצית. כל תלמיד בבית ספר יקבל מחשב נייד אישי, ובתי הספר יצוידו בתשתיות WiFi מהירות. בנוסף, המורים יעברו הכשרה מקיפה לשימוש בכלים דיגיטליים בהוראה.',
      category: 'חינוך', 
      source: 'גלובס' 
    },
    { 
      title: 'בנק ישראל מעלה ריבית ל-4.5%',
      description: 'צעד נוסף במאבק באינפלציה',
      content: 'בנק ישראל הודיע על העלאת הריבית ב-0.25% נוספים, למרות הדאגות מהאטת הצמיחה. הנגיד הסביר כי האינפלציה עדיין גבוהה מהיעד והצעד נדרש. כלכלנים חלוקים בדעתם האם זה הצעד הנכון.',
      category: 'כלכלה', 
      source: 'כלכליסט' 
    },
    { 
      title: 'פריצת דרך רפואית: תרופה חדשה לסרטן',
      description: 'בית חולים תל השומר מדווח על הצלחה במחקר קליני',
      content: 'חוקרים בבית החולים תל השומר הודיעו על הצלחה משמעותית בניסוי קליני של תרופה חדשה לסרטן. התרופה הצליחה לכווץ גידולים ב-70% מהחולים, ללא תופעות לוואי חמורות. עוד מוקדם לדבר על פריצת דרך, אך התוצאות מעודדות.',
      category: 'בריאות', 
      source: 'ידיעות אחרונות' 
    },
  ];

  for (let i = 0; i < 40; i++) {
    const template = newsTemplates[i % newsTemplates.length];
    const commentCount = Math.floor(50 + Math.random() * 250);
    
    await supabase.from('demo_news_articles').insert({
      title: i === 0 ? template.title : `${template.title} ${i > 11 ? '- חלק ' + Math.floor(i/12) : ''}`,
      description: template.description,
      content: template.content,
      category: template.category,
      source: template.source,
      published_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      view_count: Math.floor(2000 + Math.random() * 15000),
      comment_count: commentCount,
      thumbnail_url: '/public/vote.png',
      is_published: true,
    });
  }
}
    });
  }
}

async function generateDemoNewsComments(supabase: any, profiles: any[]) {
  // First get all demo news articles
  const { data: newsArticles } = await supabase
    .from('demo_news_articles')
    .select('id, comment_count');

  if (!newsArticles || newsArticles.length === 0) return;

  const commentTemplates = [
    'נקודה מעניינת ביותר. חשוב שנדון בזה לעומק.',
    'אני חושב שיש כאן גם צד שני למטבע שכדאי לבחון.',
    'תודה על הכתבה המקיפה. סוף סוף מישהו מדבר על זה.',
    'לא בטוח שאני מסכים עם כל הנקודות, אבל מעניין לקרוא.',
    'זה בדיוק מה שאני אומר כבר שנה! סוף סוף.',
    'המצב מורכב יותר ממה שנראה לכאורה.',
    'יש פה המון שיקולים שצריך לקחת בחשבון.',
    'אני מציע לבחון גם את האופציות האחרות.',
    'זהו נושא חשוב שמגיע לו יותר תשומת לב ציבורית.',
    'מאוד מפתיע לראות את המספרים האלה.',
    'לדעתי זה צעד בכיוון הנכון, אבל לא מספיק.',
    'סוף סוף הם מבינים את זה!',
    'האם מישהו חשב על ההשלכות ארוכות הטווח?',
    'זה נושא שדורש מחשבה מעמיקה ולא פתרונות קלים.',
    'אני מקווה שזה יוביל לשינוי אמיתי.',
  ];

  for (const article of newsArticles) {
    const targetComments = article.comment_count || Math.floor(10 + Math.random() * 40);
    
    for (let i = 0; i < targetComments; i++) {
      const commenter = profiles[Math.floor(Math.random() * profiles.length)];
      const comment = commentTemplates[Math.floor(Math.random() * commentTemplates.length)];
      
      await supabase.from('demo_posts').insert({
        user_id: commenter.user_id,
        content: `${comment} ${i > 0 ? `(${i})` : ''}`,
        created_at: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString(),
        trust_count: Math.floor(5 + Math.random() * 50),
        watch_count: Math.floor(10 + Math.random() * 100),
        comment_count: Math.floor(Math.random() * 5),
        share_count: Math.floor(Math.random() * 10),
        view_count: Math.floor(50 + Math.random() * 200),
        // Store news_article_id in a metadata field or create a separate comments table
      });
    }
  }
}
