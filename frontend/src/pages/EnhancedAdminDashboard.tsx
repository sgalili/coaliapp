/**
 * Enhanced Admin Dashboard
 * Separated Demo Area and Production Area
 */

import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  FileText, 
  Settings, 
  TrendingUp,
  Database,
  Globe,
  Lock,
  MessageSquare,
  Vote,
  RefreshCw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function EnhancedAdminDashboard() {
  const navigate = useNavigate();
  const [activeArea, setActiveArea] = useState<'demo' | 'production'>('production');
  const [stats, setStats] = useState({
    demo: {
      users: 0,
      posts: 0,
      channels: 0,
      decisions: 0
    },
    production: {
      users: 0,
      posts: 0,
      channels: 0,
      decisions: 0
    }
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Demo stats
      const { count: demoUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_demo', true);

      const { count: demoPosts } = await supabase
        .from('demo_posts')
        .select('*', { count: 'exact', head: true })
        .or('user_id.eq.demo-user,user_id.like.user-%');

      // Production stats
      const { count: prodUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_demo', false);

      const { count: prodPosts } = await supabase
        .from('demo_posts')
        .select('*', { count: 'exact', head: true })
        .not('user_id', 'eq', 'demo-user')
        .not('user_id', 'like', 'user-%');

      setStats({
        demo: {
          users: demoUsers || 0,
          posts: demoPosts || 0,
          channels: 4, // Hardcoded demo channels
          decisions: 5
        },
        production: {
          users: prodUsers || 0,
          posts: prodPosts || 0,
          channels: 0, // Only Coali
          decisions: 0
        }
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const currentStats = activeArea === 'demo' ? stats.demo : stats.production;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">לוח בקרה - מנהל</h1>
            <p className="text-muted-foreground">ניהול מערכת Coali</p>
          </div>
          <Button
            onClick={() => {
              loadStats();
              toast.success('נתונים עודכנו! 🔄');
            }}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            רענן
          </Button>
        </div>

        {/* Area Toggle */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setActiveArea('production')}
            className={`flex-1 py-4 px-6 rounded-lg font-bold transition-all ${
              activeArea === 'production'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <Globe className="w-5 h-5 inline mr-2" />
            אזור ייצור (Production)
          </button>
          <button
            onClick={() => setActiveArea('demo')}
            className={`flex-1 py-4 px-6 rounded-lg font-bold transition-all ${
              activeArea === 'demo'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <Database className="w-5 h-5 inline mr-2" />
            אזור דמו (Demo)
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-6 bg-card border rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">{currentStats.users}</span>
            </div>
            <p className="text-sm text-muted-foreground">משתמשים</p>
          </div>

          <div className="p-6 bg-card border rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">{currentStats.posts}</span>
            </div>
            <p className="text-sm text-muted-foreground">פוסטים</p>
          </div>

          <div className="p-6 bg-card border rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">{currentStats.channels}</span>
            </div>
            <p className="text-sm text-muted-foreground">ערוצים</p>
          </div>

          <div className="p-6 bg-card border rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <Vote className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">{currentStats.decisions}</span>
            </div>
            <p className="text-sm text-muted-foreground">החלטות</p>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Users Management */}
          <button
            onClick={() => navigate(`/admin/users?area=${activeArea}`)}
            className="p-6 bg-card border rounded-xl hover:shadow-lg transition-all text-right"
          >
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-bold">ניהול משתמשים</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {activeArea === 'demo' 
                ? 'הוסף/ערוך/מחק משתמשי דמו'
                : 'נהל משתמשים אמיתיים, ZOOZ, הרשאות'}
            </p>
          </button>

          {/* Content Management */}
          <button
            onClick={() => navigate(`/admin/content?area=${activeArea}`)}
            className="p-6 bg-card border rounded-xl hover:shadow-lg transition-all text-right"
          >
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-bold">ניהול תוכן</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {activeArea === 'demo'
                ? 'פוסטים, החלטות ותגובות דמו'
                : 'פוסטים, החלטות ותגובות אמיתיות'}
            </p>
          </button>

          {/* Channels Management */}
          <button
            onClick={() => navigate(`/admin/all-channels?area=${activeArea}`)}
            className="p-6 bg-card border rounded-xl hover:shadow-lg transition-all text-right"
          >
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-bold">ניהול ערוצים</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {activeArea === 'demo'
                ? 'ערוצי דמו (ערוץ 10, מכבי, אחווה)'
                : 'כל הערוצים - ערוך, מחק, נהל חברים'}
            </p>
          </button>

          {/* Decisions Management */}
          <button
            onClick={() => navigate(`/admin/decisions?area=${activeArea}`)}
            className="p-6 bg-card border rounded-xl hover:shadow-lg transition-all text-right"
          >
            <div className="flex items-center gap-3 mb-2">
              <Vote className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-bold">ניהול החלטות</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {activeArea === 'demo'
                ? 'החלטות לדוגמה'
                : 'החלטות אמיתיות, תוצאות'}
            </p>
          </button>
          
          {/* Go Public Requests - Production only */}
          {activeArea === 'production' && (
            <button
              onClick={() => navigate('/admin/public-requests')}
              className="p-6 bg-card border rounded-xl hover:shadow-lg transition-all text-right"
            >
              <div className="flex items-center gap-3 mb-2">
                <Globe className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-bold">בקשות להפוך לציבורי</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                אשר/דחה ערוצים פרטיים שרוצים להפוך לציבוריים
              </p>
            </button>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 p-6 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl">
          <h3 className="text-lg font-bold mb-4">פעולות מהירות</h3>
          <div className="grid md:grid-cols-3 gap-3">
            <button className="p-3 bg-background rounded-lg hover:bg-muted transition-colors text-sm">
              ➕ הוסף משתמש {activeArea === 'demo' ? 'דמו' : 'אמיתי'}
            </button>
            <button className="p-3 bg-background rounded-lg hover:bg-muted transition-colors text-sm">
              📝 צור פוסט {activeArea === 'demo' ? 'דמו' : 'חדש'}
            </button>
            <button className="p-3 bg-background rounded-lg hover:bg-muted transition-colors text-sm">
              🗳️ צור החלטה {activeArea === 'demo' ? 'לדוגמה' : 'חדשה'}
            </button>
          </div>
        </div>
      </div>

      <Navigation zoozBalance={999} />
    </div>
  );
}
