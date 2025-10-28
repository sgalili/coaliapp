import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share, Heart, MessageCircle, Eye, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PostData {
  id: string;
  user_id: string;
  title?: string;
  content?: string;
  video_url?: string;
  thumbnail_url?: string;
  trust_count: number;
  watch_count: number;
  comment_count: number;
  share_count: number;
  category?: string;
  domain?: string;
  created_at: string;
  user?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
    phone?: string;
  };
}

const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [post, setPost] = useState<PostData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (postId) {
      fetchPost(postId);
    }
  }, [postId]);

  const fetchPost = async (id: string) => {
    try {
      setIsLoading(true);

      // Fetch post with user profile
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            avatar_url,
            phone
          )
        `)
        .eq('id', id)
        .maybeSingle();

      if (postError || !postData) {
        console.error('Error fetching post:', postError);
        setIsLoading(false);
        return;
      }

      // Transform the data to match our interface
      const transformedPost: PostData = {
        ...postData,
        user: Array.isArray(postData.profiles) ? postData.profiles[0] : postData.profiles
      };

      setPost(transformedPost);
      setIsLoading(false);

      // Increment view count
      await supabase.rpc('increment_post_views', { p_post_id: id });
    } catch (error) {
      console.error('Error fetching post:', error);
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "הקישור הועתק",
      description: "הקישור הועתק ללוח",
    });
  };

  const handleTrust = async () => {
    if (!post) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      // Check if already trusting
      const { data: existingTrust } = await supabase
        .from('trusts')
        .select('*')
        .eq('truster_id', user.id)
        .eq('trusted_id', post.user_id)
        .eq('post_id', post.id)
        .maybeSingle();

      if (existingTrust) {
        // Remove trust
        await supabase
          .from('trusts')
          .delete()
          .eq('id', existingTrust.id);
        
        toast({
          title: "האמון הוסר",
          description: "הסרת את האמון מהפוסט",
        });
      } else {
        // Add trust
        await supabase
          .from('trusts')
          .insert({
            truster_id: user.id,
            trusted_id: post.user_id,
            post_id: post.id
          });

        toast({
          title: "אמון ניתן",
          description: "נתת אמון בפוסט זה",
        });
      }

      // Refresh post data
      fetchPost(post.id);
    } catch (error) {
      console.error('Error toggling trust:', error);
      toast({
        title: "שגיאה",
        description: "לא ניתן לעדכן את האמון",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">טוען...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">פוסט לא נמצא</h2>
          <Button onClick={() => navigate('/')}>חזור לעמוד הבית</Button>
        </div>
      </div>
    );
  }

  const username = post.user 
    ? `${post.user.first_name} ${post.user.last_name}`.trim() || 'משתמש'
    : 'משתמש';

  return (
    <div className="h-screen bg-background flex flex-col" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold">פוסט</h1>
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Video Section */}
      <div className="flex-1 relative">
        {post.video_url ? (
          <video
            className="w-full h-full object-contain bg-black"
            src={post.video_url}
            controls
            autoPlay
            loop
          />
        ) : post.thumbnail_url ? (
          <img
            src={post.thumbnail_url}
            alt={post.title || 'Post'}
            className="w-full h-full object-contain bg-black"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <p className="text-muted-foreground">אין תוכן זמין</p>
          </div>
        )}
      </div>

      {/* Post Info */}
      <div className="bg-background border-t border-border p-4 space-y-4">
        {/* User Info */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/user/${post.user_id}`)}>
          {post.user?.avatar_url ? (
            <img 
              src={post.user.avatar_url} 
              alt={username}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <User className="w-5 h-5 text-muted-foreground" />
            </div>
          )}
          <div>
            <p className="font-semibold">{username}</p>
            {post.user?.phone && (
              <p className="text-sm text-muted-foreground">@{post.user.phone}</p>
            )}
          </div>
        </div>

        {/* Caption */}
        {(post.content || post.title) && (
          <p className="text-sm">{post.content || post.title}</p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-6 text-sm">
          <button onClick={handleTrust} className="flex items-center gap-1 hover:text-trust transition-colors">
            <Heart className="w-5 h-5" />
            <span>{post.trust_count}</span>
          </button>
          <div className="flex items-center gap-1">
            <Eye className="w-5 h-5" />
            <span>{post.watch_count}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-5 h-5" />
            <span>{post.comment_count}</span>
          </div>
          <div className="flex items-center gap-1">
            <Share className="w-5 h-5" />
            <span>{post.share_count}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
