import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  MessageSquare, 
  Settings,
  BarChart3,
  Bell,
  Database
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ posts: 0, users: 0, decisions: 0, channels: 4 });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Get total posts
      const { count: postsCount } = await supabase
        .from('demo_posts')
        .select('*', { count: 'exact', head: true });
      
      // Get unique users
      const { data: postsData } = await supabase
        .from('demo_posts')
        .select('user_id');
      const uniqueUsers = new Set(postsData?.map(p => p.user_id));
      
      // Get total decisions
      const { count: decisionsCount } = await supabase
        .from('demo_decisions')
        .select('*', { count: 'exact', head: true });
      
      setStats({
        posts: postsCount || 0,
        users: uniqueUsers.size || 0,
        decisions: decisionsCount || 0,
        channels: 4
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const adminSections = [
    { id: 'overview', icon: LayoutDashboard, label: 'סקירה כללית', path: '/admin' },
    { id: 'users', icon: Users, label: 'משתמשים', path: '/admin/users' },
    { id: 'content', icon: FileText, label: 'ניהול תוכן', path: '/admin/content' },
    { id: 'communication', icon: MessageSquare, label: 'תקשורת', path: '/admin/communication' },
    { id: 'analytics', icon: BarChart3, label: 'אנליטיקה', path: '/admin/analytics' },
    { id: 'notifications', icon: Bell, label: 'התראות', path: '/admin/notifications' },
    { id: 'database', icon: Database, label: 'מסד נתונים', path: '/admin/database' },
    { id: 'settings', icon: Settings, label: 'הגדרות', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">ניהול מערכת Coali</h1>
          <p className="text-muted-foreground">פאנל ניהול מלא</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {adminSections.map((section) => (
            <button
              key={section.id}
              onClick={() => navigate(section.path)}
              className="p-6 bg-card border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-right"
            >
              <section.icon className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-bold text-lg mb-1">{section.label}</h3>
            </button>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-card border rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">סך פוסטים</p>
            <p className="text-2xl font-bold">21</p>
          </div>
          <div className="p-4 bg-card border rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">משתמשים</p>
            <p className="text-2xl font-bold">1</p>
          </div>
          <div className="p-4 bg-card border rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">החלטות</p>
            <p className="text-2xl font-bold">14</p>
          </div>
          <div className="p-4 bg-card border rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">ערוצים</p>
            <p className="text-2xl font-bold">4</p>
          </div>
        </div>
      </div>

      <Navigation zoozBalance={999} />
    </div>
  );
}
