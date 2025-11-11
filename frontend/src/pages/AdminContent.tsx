import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { ArrowLeft, Trash2, Edit2, Eye, Search, Plus, Loader2, X, Upload, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { uploadMediaFile, compressVideo } from "@/services/uploadService";

export default function AdminContent() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const area = searchParams.get('area') || 'production';
  
  const [tab, setTab] = useState<'posts' | 'decisions' | 'news'>('posts');
  const [posts, setPosts] = useState<any[]>([]);
  const [decisions, setDecisions] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingContent, setLoadingContent] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterChannel, setFilterChannel] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterUser, setFilterUser] = useState<string>('all');
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostUserId, setNewPostUserId] = useState('');
  const [newPostCaption, setNewPostCaption] = useState('');
  const [newPostVideoUrl, setNewPostVideoUrl] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('');
  const [newPostChannel, setNewPostChannel] = useState<string | null>(null);
  const [newPostLocation, setNewPostLocation] = useState('');
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPostVideoFile, setNewPostVideoFile] = useState<File | null>(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [uploadedVideoPreview, setUploadedVideoPreview] = useState<string | null>(null);

  const formatUserName = (user: any) => {
    if (!user) return '';
    const first = user?.first_name ?? '';
    const last = user?.last_name ?? '';
    const combined = `${first} ${last}`.trim();
    if (combined) return combined;
    if (user?.username) return user.username;
    return user?.user_id ?? '';
  };

  const getUserDisplayName = (userId: string, fallback?: string) => {
    const user = users.find(u => u.user_id === userId);
    const name = formatUserName(user);
    if (name) return name;
    if (fallback) return fallback;
    return userId;
  };

  const resetNewPostForm = () => {
    setNewPostUserId('');
    setNewPostCaption('');
    setNewPostVideoUrl('');
     setNewPostVideoFile(null);
     setUploadedVideoPreview(null);
    setNewPostCategory('');
    setNewPostChannel(null);
    setNewPostLocation('');
  };

  console.log('👨‍💼 Admin Content - Area:', area);

  useEffect(() => {
    loadReferenceData();
  }, [area]);

  useEffect(() => {
    loadContent();
  }, [tab, filterChannel, filterCategory, filterUser, area]);

  const loadReferenceData = async () => {
    await Promise.all([
      loadUsers(),
      loadChannelsData(),
      loadCategories()
    ]);
  };

  const loadUsers = async () => {
    try {
      const { data: profileData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, avatar_url, title, city, is_verified')
        .order('first_name', { ascending: true });

      if (profilesError) throw profilesError;

      const profilesMap = new Map<string, any>();
      (profileData || []).forEach(profile => {
        if (profile?.user_id) {
          profilesMap.set(profile.user_id, profile);
        }
      });

      const { data: postUsers, error: postUsersError } = await supabase
        .from('demo_posts')
        .select('user_id, username')
        .eq('is_demo', area === 'demo');

      if (postUsersError) {
        console.warn('Failed to load post users:', postUsersError);
      } else {
        (postUsers || []).forEach(user => {
          if (user?.user_id && !profilesMap.has(user.user_id)) {
            profilesMap.set(user.user_id, {
              user_id: user.user_id,
              first_name: user.username ?? user.user_id,
              last_name: '',
              avatar_url: null,
              title: '',
              city: '',
              is_verified: false
            });
          }
        });
      }

      setUsers(Array.from(profilesMap.values()));
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const loadChannelsData = async () => {
    try {
      const { data, error } = await supabase
        .from('channel_requests')
        .select('id, channel_name, status')
        .eq('status', 'approved')
        .order('channel_name', { ascending: true });

      if (error) throw error;
      setChannels(data || []);
    } catch (error) {
      console.error('Failed to load channels:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('demo_posts')
        .select('category')
        .eq('is_demo', area === 'demo')
        .not('category', 'is', null);

      let categoriesData = data;
      if (error) {
        if ((error as any)?.code === '42703') {
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('demo_posts')
            .select('category')
            .not('category', 'is', null);

          if (fallbackError) throw fallbackError;
          categoriesData = fallbackData;
        } else {
          throw error;
        }
      }

      const unique = Array.from(
        new Set(
          (categoriesData || [])
            .map(item => item?.category)
            .filter((category): category is string => Boolean(category))
        )
      );

      setCategories(unique);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const isDemoUser = (userId: string) => {
    return userId?.startsWith('user-') || userId === 'demo-user';
  }; // Reload when filters change

  const loadContent = async () => {
    try {
      setLoadingContent(true);
      console.log('📋 Loading content for area:', area);
      
      if (tab === 'posts') {
        let query = supabase
          .from('demo_posts')
          .select('*')
          .eq('is_demo', area === 'demo')
          .order('created_at', { ascending: false });
        
          if (filterChannel === 'null') {
            query = query.is('channel_id', null);
        } else if (filterChannel !== 'all') {
            query = query.eq('channel_id', filterChannel);
        }
        
        if (filterCategory !== 'all') {
          query = query.eq('category', filterCategory);
        }
        
        if (filterUser !== 'all') {
          query = query.eq('user_id', filterUser);
        }
        
        const { data, error } = await query;
        let postsData = data;

        if (error) {
          if ((error as any)?.code === '42703') {
            let fallbackQuery = supabase
              .from('demo_posts')
              .select('*')
              .order('created_at', { ascending: false });

            if (area === 'demo') {
              fallbackQuery = fallbackQuery.or('user_id.eq.demo-user,user_id.like.user-%');
            } else {
              fallbackQuery = fallbackQuery
                .not('user_id', 'eq', 'demo-user')
                .not('user_id', 'like', 'user-%');
            }

            if (filterChannel === 'null') {
              fallbackQuery = fallbackQuery.is('channel_id', null);
            } else if (filterChannel !== 'all') {
              fallbackQuery = fallbackQuery.eq('channel_id', filterChannel);
            }

            if (filterCategory !== 'all') {
              fallbackQuery = fallbackQuery.eq('category', filterCategory);
            }

            if (filterUser !== 'all') {
              fallbackQuery = fallbackQuery.eq('user_id', filterUser);
            }

            const { data: fallbackData, error: fallbackError } = await fallbackQuery;
            if (fallbackError) throw fallbackError;
            postsData = fallbackData;
          } else {
            throw error;
          }
        }

        setPosts(postsData || []);
      } else if (tab === 'decisions') {
        let query = supabase
          .from('demo_decisions')
          .select('*')
          .eq('is_demo', area === 'demo')
          .order('created_at', { ascending: false });
        
          if (filterChannel === 'null') {
            query = query.is('channel_id', null);
        } else if (filterChannel !== 'all') {
            query = query.eq('channel_id', filterChannel);
        }
        
        const { data, error } = await query;
        let decisionsData = data;

        if (error) {
          if ((error as any)?.code === '42703') {
            let fallbackQuery = supabase
              .from('demo_decisions')
              .select('*')
              .order('created_at', { ascending: false });

            if (filterChannel === 'null') {
              fallbackQuery = fallbackQuery.is('channel_id', null);
            } else if (filterChannel !== 'all') {
              fallbackQuery = fallbackQuery.eq('channel_id', filterChannel);
            }

            const { data: fallbackData, error: fallbackError } = await fallbackQuery;
            if (fallbackError) throw fallbackError;
            decisionsData = fallbackData;
          } else {
            throw error;
          }
        }

        setDecisions(decisionsData || []);
      }
    } catch (error) {
      console.error('Failed to load content:', error);
      toast.error('שגיאה בטעינת תוכן');
    } finally {
      setLoadingContent(false);
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

  const handleCreatePost = async () => {
    if (!newPostUserId) {
      toast.error('יש לבחור משתמש');
      return;
    }

    if (!newPostCaption.trim()) {
      toast.error('יש להזין כיתוב לפוסט');
      return;
    }

    try {
      setIsCreatingPost(true);

      let profile = users.find(u => u.user_id === newPostUserId);

      if (!profile) {
        const { data, error } = await supabase
          .from('profiles')
          .select('user_id, first_name, last_name, avatar_url, title, city, is_verified')
          .eq('user_id', newPostUserId)
          .maybeSingle();

        if (error) throw error;
        profile = data || null;
      }

      const displayName = getUserDisplayName(newPostUserId, profile?.username);
      const channelId = newPostChannel === '' ? null : newPostChannel;
      const isDemo = isDemoUser(newPostUserId) || area === 'demo';

      const newPost = {
        user_id: newPostUserId,
        username: displayName,
        title: profile?.title || '',
        profile_image: profile?.avatar_url || '/default-avatar.jpg',
        expertise: profile?.title || 'משתמש',
        caption: newPostCaption.trim(),
        video_url: newPostVideoUrl || null,
        image_url: null,
        category: newPostCategory || 'כללי',
        channel_id: channelId,
        location: newPostLocation || profile?.city || 'ישראל',
        is_verified: profile?.is_verified ?? false,
        is_demo: isDemo,
        is_live: false,
        is_camera_recorded: false,
        created_at: new Date().toISOString()
      };

      const { error: insertError } = await supabase
        .from('demo_posts')
        .insert(newPost);

      if (insertError) throw insertError;

      toast.success('הפוסט נוצר בהצלחה ✅');
      setShowCreatePost(false);
      resetNewPostForm();
      await Promise.all([loadContent(), loadCategories(), loadUsers()]);
    } catch (error) {
      console.error('Failed to create post:', error);
      toast.error('יצירת הפוסט נכשלה');
    } finally {
      setIsCreatingPost(false);
    }
  };

  const filteredPosts = posts.filter(p => {
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      const caption = (p.caption || '').toLowerCase();
      const username = getUserDisplayName(p.user_id, p.username)?.toLowerCase();
      if (!caption.includes(query) && !(username || '').includes(query)) {
        return false;
      }
    }
    if (filterChannel === 'null' && p.channel_id !== null) {
      return false;
    }
    if (filterChannel !== 'all' && filterChannel !== 'null' && p.channel_id !== filterChannel) {
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
          <button
            onClick={() => setShowCreatePost(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            פוסט חדש
          </button>
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
            <option value="null">Coali</option>
            {channels.map(channel => (
              <option key={channel.id} value={channel.id}>
                {channel.channel_name || channel.id}
              </option>
            ))}
          </select>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="all">כל הקטגוריות</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          
          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="all">כל המשתמשים</option>
            {users.map(user => (
              <option key={user.user_id} value={user.user_id}>
                {formatUserName(user)} {isDemoUser(user.user_id) && '(דמו)'}
              </option>
            ))}
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
            {filteredPosts.map(post => {
              const displayName = getUserDisplayName(post.user_id, post.username);
              const demoUser = isDemoUser(post.user_id);
              return (
              <div key={post.id} className="p-4 bg-card border rounded-xl">
                <div className="flex items-start gap-4">
                    {post.video_url ? (
                    <button
                      onClick={() => setPreviewVideo(post.video_url)}
                      className="relative w-24 h-32 rounded overflow-hidden flex-shrink-0 hover:opacity-90"
                    >
                      <video src={post.video_url} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                    </button>
                    ) : (
                      <div className="w-24 h-32 bg-muted flex items-center justify-center text-muted-foreground rounded">
                        ללא וידאו
                      </div>
                  )}
                  
                  <div className="flex-1 text-right">
                    <div className="flex items-center gap-2 mb-2">
                        <p className="font-medium line-clamp-2">{post.caption || 'ללא כיתוב'}</p>
                        {demoUser && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">דמו</span>
                      )}
                    </div>
                    
                    <div className="space-y-1 text-sm text-muted-foreground">
                        <p>👤 {displayName}</p>
                        <p>📺 {post.channel_id ? (channels.find(c => c.id === post.channel_id)?.channel_name || post.channel_id) : 'Coali'}</p>
                        <p>📂 {post.category || 'כללי'}</p>
                        <p>📍 {post.location || 'ישראל'}</p>
                        <p>📅 {post.created_at ? new Date(post.created_at).toLocaleString('he-IL') : 'לא ידוע'}</p>
                        <div className="flex flex-wrap gap-4 mt-2">
                        <span>👁️ {post.watch_count || 0}</span>
                        <span>🤝 {post.trust_count || 0}</span>
                        <span>🗳️ {post.vote_count || 0}</span>
                        <span>💬 {post.comment_count || 0}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <button
                        onClick={() => navigate(`/profile/${post.user_id}`)}
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
              );
            })}

            {!loadingContent && filteredPosts.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                אין פוסטים להצגה.
              </div>
            )}
            {loadingContent && (
              <div className="flex items-center justify-center py-10 text-muted-foreground gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                טוען תוכן...
              </div>
            )}
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
            {!loadingContent && filteredDecisions.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                אין החלטות להצגה.
              </div>
            )}
            {loadingContent && (
              <div className="flex items-center justify-center py-10 text-muted-foreground gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                טוען החלטות...
              </div>
            )}
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

      {showCreatePost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => {
            setShowCreatePost(false);
            resetNewPostForm();
          }}
        >
          <div
            className="bg-background rounded-2xl shadow-xl w-full max-w-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto"
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">יצירת פוסט חדש</h2>
              <button
                onClick={() => {
                  setShowCreatePost(false);
                  resetNewPostForm();
                }}
                className="p-2 hover:bg-muted rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">בחר משתמש</label>
                <select
                  value={newPostUserId}
                  onChange={(e) => setNewPostUserId(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">בחר משתמש...</option>
                  {users.map(user => (
                    <option key={user.user_id} value={user.user_id}>
                      {formatUserName(user)} {isDemoUser(user.user_id) && '(דמו)'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">ערוץ</label>
                <select
                  value={newPostChannel ?? ''}
                  onChange={(e) => setNewPostChannel(e.target.value === '' ? null : e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">Coali</option>
                  {channels.map(channel => (
                    <option key={channel.id} value={channel.id}>
                      {channel.channel_name || channel.id}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">כיתוב</label>
              <textarea
                value={newPostCaption}
                onChange={(e) => setNewPostCaption(e.target.value)}
                rows={4}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="כתוב את תוכן הפוסט..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">כתובת וידאו (לא חובה)</label>
                <input
                  type="url"
                  value={newPostVideoUrl}
                  onChange={(e) => setNewPostVideoUrl(e.target.value)}
                  placeholder="https://example.com/video.mp4"
                  className="w-full border rounded-lg px-3 py-2"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">קטגוריה</label>
                <input
                  list="admin-category-options"
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                  placeholder="בחירת קטגוריה..."
                  className="w-full border rounded-lg px-3 py-2"
                />
                <datalist id="admin-category-options">
                  {categories.map(category => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">מיקום (לא חובה)</label>
              <input
                type="text"
                value={newPostLocation}
                onChange={(e) => setNewPostLocation(e.target.value)}
                placeholder="ישראל"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreatePost(false);
                  resetNewPostForm();
                }}
                className="px-4 py-2 border rounded-lg hover:bg-muted"
                disabled={isCreatingPost}
              >
                ביטול
              </button>
              <button
                onClick={handleCreatePost}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-60"
                disabled={isCreatingPost}
              >
                {isCreatingPost && <Loader2 className="w-4 h-4 animate-spin" />}
                פרסם
              </button>
            </div>
          </div>
        </div>
      )}

      <Navigation zoozBalance={999} />
    </div>
  );
}
