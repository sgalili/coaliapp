import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { ArrowLeft, Trash2, Edit2, Eye, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AdminContent() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'posts' | 'decisions' | 'news'>('posts');
  const [posts, setPosts] = useState<any[]>([]);
  const [decisions, setDecisions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterChannel, setFilterChannel] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterUser, setFilterUser] = useState<string>('all');
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, [tab, filterChannel, filterCategory, filterUser]); // Reload when filters change

  const loadContent = async () => {
    try {
      if (tab === 'posts') {
        const { data } = await supabase
          .from('demo_posts')
          .select('*')
          .order('created_at', { ascending: false });
        setPosts(data || []);
      } else if (tab === 'decisions') {
        const { data } = await supabase
          .from('demo_decisions')
          .select('*')
          .order('created_at', { ascending: false });
        setDecisions(data || []);
      }
    } catch (error) {
      console.error('Failed to load content:', error);
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm('האם למחוק פוסט זה?')) return;
    
    try {
      const { error } = await supabase
        .from('demo_posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setPosts(posts.filter(p => p.id !== id));
      toast.success('הפוסט נמחק');
    } catch (error) {
      toast.error('מחיקה נכשלה');
    }
  };

  const deleteDecision = async (id: string) => {
    if (!confirm('האם למחוק החלטה זו?')) return;
    
    try {
      const { error } = await supabase
        .from('demo_decisions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setDecisions(decisions.filter(d => d.id !== id));
      toast.success('ההחלטה נמחקה');
    } catch (error) {
      toast.error('מחיקה נכשלה');
    }
  };

  const filteredPosts = posts.filter(p => {
    if (searchQuery && !p.caption?.includes(searchQuery) && !p.username?.includes(searchQuery)) {
      return false;
    }
    if (filterChannel !== 'all' && p.channel_id !== filterChannel) {
      return false;
    }
    if (filterCategory !== 'all' && p.category !== filterCategory) {
      return false;
    }
    if (filterUser !== 'all' && p.user_id !== filterUser) {
      return false;
    }
    return true;
  });

  const filteredDecisions = decisions.filter(d => 
    d.title?.includes(searchQuery)
  );

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
          <h1 className="text-2xl font-bold">ניהול תוכן</h1>
          <div className="w-10" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setTab('posts')}
            className={`px-4 py-2 font-medium border-b-2 ${
              tab === 'posts' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground'
            }`}
          >
            פוסטים ({posts.length})
          </button>
          <button
            onClick={() => setTab('decisions')}
            className={`px-4 py-2 font-medium border-b-2 ${
              tab === 'decisions' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground'
            }`}
          >
            החלטות ({decisions.length})
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          <select
            value={filterChannel}
            onChange={(e) => setFilterChannel(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="all">כל הערוצים</option>
            <option value={null as any}>Coali</option>
            <option value="channel-10-economy">ערוץ 10</option>
            <option value="channel-achva">אחווה</option>
            <option value="channel-maccabi">מכבי</option>
          </select>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="all">כל הקטגוריות</option>
            <option value="משחקים">משחקים</option>
            <option value="לימודים">לימודים</option>
            <option value="הרצאות">הרצאות</option>
          </select>
          
          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="all">כל המשתמשים</option>
            <option value="demo-user">Demo User</option>
          </select>
          
          <button
            onClick={() => {
              setFilterChannel('all');
              setFilterCategory('all');
              setFilterUser('all');
              setSearchQuery('');
            }}
            className="px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg"
          >
            נקה סינון
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
              placeholder="חיפוש..."
              className="w-full pr-10 pl-4 py-2 border rounded-lg"
              dir="rtl"
            />
          </div>
        </div>

        {/* Posts List */}
        {tab === 'posts' && (
          <div className="space-y-3">
            {filteredPosts.map(post => (
              <div key={post.id} className="p-4 bg-card border rounded-xl">
                <div className="flex items-start gap-4">
                  {post.video_url && (
                    <button
                      onClick={() => setPreviewVideo(post.video_url)}
                      className="relative w-24 h-32 rounded overflow-hidden flex-shrink-0 hover:opacity-90"
                    >
                      <video src={post.video_url} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                    </button>
                  )}
                  
                  <div className="flex-1 text-right">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium line-clamp-2">{post.caption}</p>
                      {post.user_id === 'demo-user' && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">DEMO</span>
                      )}
                    </div>
                    
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>👤 {post.username}</p>
                      <p>📺 {post.channel_id || 'Coali'}</p>
                      <p>📂 {post.category}</p>
                      <p>📅 {new Date(post.created_at).toLocaleString('he-IL')}</p>
                      <div className="flex gap-4 mt-2">
                        <span>👁️ {post.watch_count || 0}</span>
                        <span>🤝 {post.trust_count || 0}</span>
                        <span>🗳️ {post.vote_count || 0}</span>
                        <span>💬 {post.comment_count || 0}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => navigate(`/profile`)}
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
                      onClick={() => deletePost(post.id)}
                      className="p-2 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Decisions List */}
        {tab === 'decisions' && (
          <div className="space-y-3">
            {filteredDecisions.map(decision => (
              <div key={decision.id} className="p-4 bg-card border rounded-xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 text-right">
                    <p className="font-medium mb-1">{decision.title}</p>
                    <p className="text-sm text-muted-foreground mb-2">{decision.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {decision.total_votes} הצבעות • {decision.channel_id || 'Coali'}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteDecision(decision.id)}
                    className="p-2 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Preview Modal */}
      {previewVideo && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setPreviewVideo(null)}>
          <div className="relative w-full max-w-md" style={{ aspectRatio: '9/16' }}>
            <video
              src={previewVideo}
              controls
              autoPlay
              className="w-full h-full object-cover rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setPreviewVideo(null)}
              className="absolute top-4 right-4 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <Navigation zoozBalance={999} />
    </div>
  );
}
