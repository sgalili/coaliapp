import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { ArrowLeft, Search, Trash2, Edit2, Shield, Ban, Medal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVerified, setFilterVerified] = useState<string>('all');
  const [filterDemo, setFilterDemo] = useState<string>('all');
  const [filterExpertise, setFilterExpertise] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

  useEffect(() => {
    loadUsers();
  }, []);

  const expertiseFields = [
    'כלכלה', 'פוליטיקה', 'טכנולוגיה', 'ספורט', 'בריאות',
    'חינוך', 'תרבות', 'מדע', 'אומנות', 'משפטים',
    'ביטחון', 'סביבה', 'תקשורת', 'עסקים', 'תיירות',
    'מוזיקה', 'ספרות', 'קולנוע', 'אדריכלות', 'אופנה'
  ];

  const getRelevantExpertise = (username: string, expertise: string) => {
    // Smart assignment based on user
    if (username.includes('נתניהו') || username.includes('פוליטי')) return ['פוליטיקה', 'ביטחון', 'משפטים'];
    if (username.includes('זלקה') || username.includes('כלכל')) return ['כלכלה', 'עסקים', 'פיננסים'];
    if (username.includes('ערוץ 10')) return ['תקשורת', 'עיתונאות', 'כלכלה'];
    if (username.includes('מכבי') || username.includes('ספורט')) return ['ספורט', 'כדורסל', 'אימון'];
    if (username.includes('אחווה') || username.includes('מכללה')) return ['חינוך', 'אקדמיה', 'מחקר'];
    if (username.includes('רופא') || username.includes('בריאות')) return ['בריאות', 'רפואה', 'תזונה'];
    
    // Default random
    return expertiseFields.slice(0, 3);
  const loadUsers = async () => {
    try {
      // Get all posts with user info and aggregate stats
      const { data: postsData } = await supabase
        .from('demo_posts')
        .select('user_id, username, profile_image, is_verified, expertise, trust_count, watch_count, vote_count, zooz_count');
      
      // Group by user and calculate totals
      const userMap = new Map();
      
      for (const post of postsData || []) {
        if (!userMap.has(post.user_id)) {
          userMap.set(post.user_id, {
            user_id: post.user_id,
            username: post.username,
            profile_image: post.profile_image,
            is_verified: post.is_verified,
            expertise: getRelevantExpertise(post.username || '', post.expertise || ''),
            post_count: 1,
            total_trust: post.trust_count || 0,
            total_views: post.watch_count || 0,
            total_votes: post.vote_count || 0,
            total_zooz: post.zooz_count || 0,
            is_demo: post.user_id?.startsWith('user-') || post.user_id === 'demo-user'
          });
        } else {
          const user = userMap.get(post.user_id);
          user.post_count++;
          user.total_trust += post.trust_count || 0;
          user.total_views += post.watch_count || 0;
          user.total_votes += post.vote_count || 0;
          user.total_zooz += post.zooz_count || 0;
          if (post.expertise && !user.expertise.includes(post.expertise)) {
            user.expertise.push(post.expertise);
          }
        }
      }
      
      const uniqueUsers = Array.from(userMap.values());
      console.log('👥 Loaded', uniqueUsers.length, 'users with stats');
      setUsers(uniqueUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm(`למחוק את כל התוכן של משתמש זה?`)) return;
    
    try {
      // Delete all user's posts
      const { error } = await supabase
        .from('demo_posts')
        .delete()
        .eq('user_id', userId);
      
      if (error) throw error;
      
      toast.success('המשתמש נמחק');
      loadUsers();
    } catch (error) {
      toast.error('מחיקה נכשלה');
    }
  };

  const filteredUsers = users.filter(u => {
    // Search filter
    if (searchQuery && !u.username?.includes(searchQuery)) return false;
    
    // Verification filter
    if (filterVerified === 'verified' && !u.is_verified) return false;
    if (filterVerified === 'unverified' && u.is_verified) return false;
    
    // Demo filter
    if (filterDemo === 'demo' && !u.is_demo) return false;
    if (filterDemo === 'real' && u.is_demo) return false;
    
    // Expertise filter
    if (filterExpertise !== 'all' && !u.expertise?.includes(filterExpertise)) return false;
    
    return true;
  }).sort((a, b) => {
    // Sorting
    if (sortBy === 'trust') return b.total_trust - a.total_trust;
    if (sortBy === 'votes') return b.total_votes - a.total_votes;
    if (sortBy === 'views') return b.total_views - a.total_views;
    if (sortBy === 'zooz') return b.total_zooz - a.total_zooz;
    if (sortBy === 'posts') return b.post_count - a.post_count;
    return 0; // recent (default DB order)
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/admin')}
            className="p-2 hover:bg-muted rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">ניהול משתמשים</h1>
          <div className="w-10" />
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-5 gap-3">
          <select
            value={filterVerified}
            onChange={(e) => setFilterVerified(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="all">כל המשתמשים</option>
            <option value="verified">מאומתים 🏅</option>
            <option value="unverified">לא מאומתים</option>
          </select>
          
          <select
            value={filterDemo}
            onChange={(e) => setFilterDemo(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="all">הכל</option>
            <option value="demo">דמו בלבד</option>
            <option value="real">אמיתיים בלבד</option>
          </select>
          
          <select
            value={filterExpertise}
            onChange={(e) => setFilterExpertise(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="all">כל התחומים</option>
            {expertiseFields.map(field => (
              <option key={field} value={field}>{field}</option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="recent">לפי תאריך</option>
            <option value="trust">לפי אמון</option>
            <option value="votes">לפי הצבעות</option>
            <option value="views">לפי צפיות</option>
            <option value="zooz">לפי ZOOZ</option>
            <option value="posts">לפי פוסטים</option>
          </select>
          
          <button
            onClick={() => {
              setFilterVerified('all');
              setFilterDemo('all');
              setFilterExpertise('all');
              setSortBy('recent');
              setSearchQuery('');
            }}
            className="px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg"
          >
            נקה
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="חיפוש משתמש..."
              className="w-full pr-10 pl-4 py-2 border rounded-lg"
              dir="rtl"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="p-4 bg-card border rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">סך משתמשים</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
          <div className="p-4 bg-card border rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">דמו</p>
            <p className="text-2xl font-bold">{users.filter(u => u.is_demo).length}</p>
          </div>
          <div className="p-4 bg-card border rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">אמיתיים</p>
            <p className="text-2xl font-bold">{users.filter(u => !u.is_demo).length}</p>
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-3">
          {filteredUsers.map(user => (
            <div key={user.user_id} className="p-4 bg-card border rounded-xl">
              <div className="flex items-center gap-4">
                <img 
                  src={user.profile_image || '/default-avatar.jpg'} 
                  className="w-16 h-16 rounded-full object-cover"
                />
                
                <div className="flex-1 text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg">{user.username}</h3>
                    {user.is_demo && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">דמו</span>
                    )}
                    {user.is_verified && (
                      <Medal className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                  
                  {/* Expertise Tags - Relevant to user */}
                  <div className="flex flex-wrap gap-1 mb-2 justify-end">
                    {user.expertise?.slice(0, 5).map((exp: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded font-medium">
                        {exp}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-4 text-sm text-muted-foreground flex-wrap">
                    <span>📝 {user.post_count}</span>
                    <span>🤝 {user.total_trust}</span>
                    <span>👁️ {user.total_views}</span>
                    <span>🗳️ {user.total_votes}</span>
                    <span>💰 {user.total_zooz}Z</span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-1">
                    {user.user_id}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => navigate(`/profile/${user.user_id}`)}
                    className="p-2 hover:bg-muted rounded"
                    title="פרופיל משתמש"
                  >
                    👤
                  </button>
                  <button
                    onClick={() => toast.info('עריכה בפיתוח')}
                    className="p-2 hover:bg-muted rounded"
                  >
                    <Edit2 className="w-4 h-4 text-primary" />
                  </button>
                  <button
                    onClick={() => deleteUser(user.user_id)}
                    className="p-2 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

      <Navigation zoozBalance={999} />
    </div>
  );
}
