import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { ChannelSelector } from '@/components/ChannelSelector';
import { CategoryDropdown } from '@/components/CategoryDropdown';
import { useAuth } from '@/hooks/useAuth';
import { useChannel } from '@/contexts/ChannelContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  TrendingUp, 
  Users, 
  Vote, 
  Award, 
  ArrowUp, 
  ArrowDown,
  Bell,
  Search,
  Crown,
  Target
} from 'lucide-react';
import { toast } from 'sonner';

interface ImpactItem {
  id: string;
  type: 'decision' | 'trust' | 'vote' | 'achievement';
  title: string;
  description: string;
  expert_id: string;
  expert_name: string;
  expert_image: string;
  expert_score: number;
  category: string;
  timestamp: string;
  impact_value: number;
  delegated_votes?: number;
  total_votes?: number;
  outcome?: string;
}

export default function ImpactPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { selectedChannel, selectedCategory, setSelectedCategory } = useChannel();
  const [impactItems, setImpactItems] = useState<ImpactItem[]>([]);
  const [myImpactScore, setMyImpactScore] = useState(0);
  const [trustedExperts, setTrustedExperts] = useState(0);
  const [votesInfluenced, setVotesInfluenced] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'he');
  }, []);

  useEffect(() => {
    loadImpactData();
    loadUserStats();
  }, [user, selectedCategory, selectedChannel]);

  const loadImpactData = async () => {
    setIsLoading(true);
    try {
      console.log('📊 Loading impact data...');
      
      // Fetch impact events from database
      let query = supabase
        .from('impact_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      // Filter by category if not "הכל"
      if (selectedCategory && selectedCategory !== 'הכל') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Error loading impact events:', error);
        throw error;
      }

      console.log('✅ Loaded impact events:', data?.length || 0);

      // Transform data and fetch expert info
      const items: ImpactItem[] = await Promise.all(
        (data || []).map(async (item: any) => {
          // Fetch expert profile
          const { data: expertProfile } = await supabase
            .from('profiles')
            .select('first_name, last_name, avatar_url, impact_score, user_id')
            .eq('user_id', item.expert_id)
            .single();

          return {
            id: item.id,
            type: item.type,
            title: item.title,
            description: item.description,
            expert_id: item.expert_id,
            expert_name: expertProfile 
              ? `${expertProfile.first_name} ${expertProfile.last_name}`
              : 'משתמש',
            expert_image: expertProfile?.avatar_url || 'https://trust.coali.app/assets/default-avatar.jpg',
            expert_score: expertProfile?.impact_score || 0,
            category: item.category,
            timestamp: item.created_at,
            impact_value: item.impact_value,
            delegated_votes: item.delegated_votes,
            total_votes: item.total_votes,
            outcome: item.outcome
          };
        })
      );

      setImpactItems(items);
    } catch (error) {
      console.error('Failed to load impact data:', error);
      toast.error('שגיאה בטעינת נתונים');
      
      // Use demo data as fallback
      setImpactItems([
        {
          id: '1',
          type: 'decision',
          title: 'תמך בהצעת תקציב',
          description: 'עזר ל-234 אנשים להחליט בנושא תקציב החינוך',
          expert_id: 'demo-user',
          expert_name: 'דוד לוי',
          expert_image: 'https://trust.coali.app/assets/david-profile-RItxnDNA.jpg',
          expert_score: 7490,
          category: 'פוליטיקה',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          impact_value: 2340,
          delegated_votes: 234,
          total_votes: 1500,
          outcome: 'אושרה'
        },
        {
          id: '2',
          type: 'trust',
          title: 'קיבל אמון מ-45 משתמשים',
          description: 'הפך למומחה מהימן בתחום הכלכלה',
          expert_id: 'demo-user',
          expert_name: 'דוד לוי',
          expert_image: 'https://trust.coali.app/assets/david-profile-RItxnDNA.jpg',
          expert_score: 7490,
          category: 'כלכלה',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          impact_value: 2250,
        },
        {
          id: '3',
          type: 'vote',
          title: 'השפיע על 120 קולות',
          description: 'דעתו שינתה את תוצאות ההצבעה על מיסוי הייטק',
          expert_id: 'demo-user',
          expert_name: 'דוד לוי',
          expert_image: 'https://trust.coali.app/assets/david-profile-RItxnDNA.jpg',
          expert_score: 7490,
          category: 'טכנולוגיה',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          impact_value: 600,
          delegated_votes: 120,
          total_votes: 450,
          outcome: 'השפעה גבוהה'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserStats = async () => {
    if (!user) {
      // Demo user stats
      setMyImpactScore(850);
      setTrustedExperts(12);
      setVotesInfluenced(45);
      return;
    }

    try {
      // Get user's impact score
      const { data: userData } = await supabase
        .from('profiles')
        .select('impact_score')
        .eq('user_id', user.id)
        .single();

      setMyImpactScore(userData?.impact_score || 0);

      // Get trusted experts count
      const { count: expertsCount } = await supabase
        .from('trust_delegations')
        .select('*', { count: 'exact', head: true })
        .eq('delegator_id', user.id);

      setTrustedExperts(expertsCount || 0);

      // Get votes influenced (as an expert)
      const { count: influencedCount } = await supabase
        .from('trust_delegations')
        .select('*', { count: 'exact', head: true })
        .eq('expert_id', user.id);

      setVotesInfluenced(influencedCount || 0);
    } catch (error) {
      console.error('Failed to load user stats:', error);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `לפני ${diffMins} דקות`;
    if (diffHours < 24) return `לפני ${diffHours} שעות`;
    if (diffDays < 30) return `לפני ${diffDays} ימים`;
    return past.toLocaleDateString('he-IL');
  };

  const getImpactIcon = (type: string) => {
    switch (type) {
      case 'decision':
        return <Vote className="w-5 h-5 text-blue-500" />;
      case 'trust':
        return <Users className="w-5 h-5 text-green-500" />;
      case 'vote':
        return <Target className="w-5 h-5 text-purple-500" />;
      case 'achievement':
        return <Award className="w-5 h-5 text-yellow-500" />;
      default:
        return <TrendingUp className="w-5 h-5 text-gray-500" />;
    }
  };

  const getImpactColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Channel Selector & Header */}
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <ChannelSelector />
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/notifications')}
              className="relative p-2 hover:bg-muted rounded-full transition"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                  {unreadNotifications}
                </span>
              )}
            </button>
            <button className="p-2 hover:bg-muted rounded-full transition">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Category Dropdown */}
        <div className="px-4 pb-3">
          <CategoryDropdown />
        </div>
      </div>

      {/* User Stats Section */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-white px-4 py-6 mb-4">
        <h2 className="text-xl font-bold mb-4">ההשפעה שלי</h2>
        <div className="grid grid-cols-3 gap-3">
          {/* My Impact Score */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <Crown className="w-5 h-5 mx-auto mb-2 text-yellow-300" />
            <div className="text-xl font-bold">{myImpactScore.toLocaleString()}</div>
            <div className="text-[10px] text-white/80 mt-1">ציון השפעה</div>
          </div>

          {/* Trusted Experts */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <Users className="w-5 h-5 mx-auto mb-2 text-green-300" />
            <div className="text-xl font-bold">{trustedExperts}</div>
            <div className="text-[10px] text-white/80 mt-1">מומחים</div>
          </div>

          {/* Votes Influenced */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <Vote className="w-5 h-5 mx-auto mb-2 text-blue-300" />
            <div className="text-xl font-bold">{votesInfluenced}</div>
            <div className="text-[10px] text-white/80 mt-1">קולות</div>
          </div>
        </div>
      </div>

      {/* Impact Feed */}
      <div className="p-4 space-y-3">
        {isLoading ? (
          // Loading skeleton
          [...Array(5)].map((_, i) => (
            <div key={i} className="bg-card rounded-xl p-4 animate-pulse">
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            </div>
          ))
        ) : impactItems.length === 0 ? (
          // Empty state
          <div className="text-center py-16">
            <TrendingUp className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold mb-2">אין אירועי השפעה</h3>
            <p className="text-muted-foreground">
              {selectedCategory === 'הכל' 
                ? 'התחל לעקוב אחרי מומחים כדי לראות את השפעתם'
                : `אין אירועי השפעה בקטגוריה ${selectedCategory}`
              }
            </p>
          </div>
        ) : (
          // Impact items
          impactItems.map((item) => (
            <div
              key={item.id}
              className="bg-card rounded-xl p-4 border hover:border-primary/50 transition cursor-pointer"
              onClick={() => {
                if (item.type === 'decision') {
                  toast.info('פרטי החלטה יוצגו בקרוב');
                } else {
                  navigate(`/profile/${item.expert_id}`);
                }
              }}
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                {/* Expert Avatar */}
                <img
                  src={item.expert_image}
                  alt={item.expert_name}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://trust.coali.app/assets/default-avatar.jpg';
                  }}
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold">{item.expert_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(item.timestamp)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    {getImpactIcon(item.type)}
                    <span className="capitalize">{item.type}</span>
                    <span>•</span>
                    <span>{item.category}</span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Impact Score */}
                <div className={`flex flex-col items-center ${getImpactColor(item.impact_value)}`}>
                  {item.impact_value > 0 ? (
                    <ArrowUp className="w-5 h-5" />
                  ) : (
                    <ArrowDown className="w-5 h-5" />
                  )}
                  <span className="text-lg font-bold">
                    {Math.abs(item.impact_value)}
                  </span>
                </div>
              </div>

              {/* Stats Footer */}
              {(item.delegated_votes || item.total_votes) && (
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-3 border-t">
                  {item.delegated_votes && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{item.delegated_votes} קולות ממונים</span>
                    </div>
                  )}
                  {item.total_votes && (
                    <div className="flex items-center gap-1">
                      <Vote className="w-4 h-4" />
                      <span>{item.total_votes} סה"כ קולות</span>
                    </div>
                  )}
                  {item.outcome && (
                    <div className="flex items-center gap-1 mr-auto">
                      <Award className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 font-medium">{item.outcome}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Navigation */}
      <Navigation zoozBalance={999} />
    </div>
  );
}
