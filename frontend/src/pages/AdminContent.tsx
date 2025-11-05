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
  }, [tab]);

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
              <div key={post.id} className="p-4 bg-card border rounded-xl flex items-center gap-4">
                {post.video_url && (
                  <video src={post.video_url} className="w-24 h-32 object-cover rounded" />
                )}
                <div className="flex-1 text-right">
                  <p className="font-medium line-clamp-2">{post.caption}</p>
                  <p className="text-sm text-muted-foreground">{post.username}</p>
                  <p className="text-xs text-muted-foreground">
                    {post.channel_id || 'Coali'} • {post.category}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toast.info('Edit coming soon')}
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

      <Navigation zoozBalance={999} />
    </div>
  );
}
