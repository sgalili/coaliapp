import { useState, useEffect, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { ChannelSelector } from "@/components/ChannelSelector";
import { CategoryDropdown } from "@/components/CategoryDropdown";
import { Comments } from "@/components/Comments";
import { Heart, Eye, MessageCircle, Share2, Volume2, VolumeX, CheckCircle, MapPin, Plus, X, Video, Upload, RefreshCw, Square, Loader2, Shield, ShieldCheck, Bookmark, MoreVertical, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useChannel } from "@/contexts/ChannelContext";
import { supabase } from "@/integrations/supabase/client";
import { uploadMediaFile } from "@/services/uploadService";
import { saveDemoPost, fetchDemoPosts, fetchDemoDecisions, updatePostEngagement } from "@/services/database";
import { toast } from "sonner";

// Sample VIDEO posts ONLY - verified users
const originalCoaliPosts = [
  {
    id: '1',
    username: 'בנימין נתניהו',
    expertise: 'מנהיגות ופוליטיקה',
    profileImage: 'https://trust.coali.app/assets/netanyahu-profile-C6yQFuUl.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    caption: 'עמדתי לגבי הרפורמה המשפטית ומה שצריך להיעשות עכשיו',
    location: 'ירושלים, ישראל',
    isVerified: true,
    isLive: true,
    category: 'politics',
    voteCount: 1200,
    zoozCount: 89000,
    trustCount: 234600,
    watchCount: 1200000,
    commentCount: 23500,
    hasUserTrusted: false,
    hasUserWatched: false,
  },
  {
    id: '2',
    username: 'ירון זליכה',
    expertise: 'כלכלה אקדמית',
    profileImage: 'https://trust.coali.app/assets/yaron-zelekha-profile-0jVRyAhY.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    caption: 'ניתוח כלכלי מעמיק של המצב הנוכחי ודרכי הפתרון',
    location: 'ירושלים, ישראל',
    isVerified: true,
    isLive: false,
    category: 'economy',
    voteCount: 892,
    zoozCount: 67200,
    trustCount: 156800,
    watchCount: 890000,
    commentCount: 18900,
    hasUserTrusted: false,
    hasUserWatched: false,
  },
  {
    id: '3',
    username: 'יעקב אליעזרוב',
    expertise: 'תכשיטים ועסקים',
    profileImage: 'https://trust.coali.app/assets/yaakov-profile-B9QmZK8h.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    caption: 'תודה לה\' על הברכות בעסק התכשיטים והיהלומים',
    location: 'תל אביב, ישראל',
    isVerified: true,
    isLive: false,
    category: 'business',
    voteCount: 0,
    zoozCount: 15400,
    trustCount: 45700,
    watchCount: 230000,
    commentCount: 4600,
    hasUserTrusted: false,
    hasUserWatched: false,
  },
  {
    id: '4',
    username: 'Warren Buffett',
    expertise: 'השקעות ופיננסים',
    profileImage: 'https://trust.coali.app/assets/warren-buffett-profile-Bfn-yren.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    caption: 'Best investment advice ever - lessons for long-term wealth building',
    location: 'Omaha, USA',
    isVerified: true,
    isLive: false,
    category: 'economy',
    voteCount: 0,
    zoozCount: 123500,
    trustCount: 567900,
    watchCount: 2100000,
    commentCount: 45700,
    hasUserTrusted: false,
    hasUserWatched: false,
  },
  {
    id: '5',
    username: 'ד״ר מאיה רוזמן',
    expertise: 'דיאטה ותזונה',
    profileImage: 'https://trust.coali.app/assets/maya-profile-BXPf8jtn.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    caption: 'משרד החקלאות - למה חשוב לשלב ירקות בכל ארוחה',
    location: 'חיפה, ישראל',
    isVerified: true,
    isLive: false,
    category: 'health',
    voteCount: 0,
    zoozCount: 18900,
    trustCount: 67200,
    watchCount: 320000,
    commentCount: 6800,
    hasUserTrusted: false,
    hasUserWatched: false,
  },
];

// Add Channel 10 posts
const channel10Posts = [
  {
    id: '10-1',
    username: 'ערוץ 10 חדשות',
    expertise: 'עיתונאות',
    profileImage: 'https://trust.coali.app/assets/david-profile-RItxnDNA.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    caption: 'סיקור מיוחד: מה קורה בשוק ההון הישראלי השבוע?',
    location: 'תל אביב',
    isVerified: true,
    isLive: false,
    category: 'שוק ההון',
    voteCount: 0,
    zoozCount: 5600,
    trustCount: 12400,
    watchCount: 45000,
    commentCount: 234,
    hasUserTrusted: false,
    hasUserWatched: false,
  },
  {
    id: '10-2',
    username: 'כתב ערוץ 10',
    expertise: 'נדל״ן',
    profileImage: 'https://trust.coali.app/assets/amit-profile-CprpaaC6.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    caption: 'מחירי הדירות ממשיכים לעלות - מה הסיבות?',
    location: 'ירושלים',
    isVerified: true,
    isLive: true,
    category: 'נדל׳ן',
    voteCount: 0,
    zoozCount: 3400,
    trustCount: 8900,
    watchCount: 28000,
    commentCount: 156,
    hasUserTrusted: false,
    hasUserWatched: false,
  },
];

// Add Achva College posts
const achvaPosts = [
  {
    id: 'achva-1',
    username: 'פרופ׳ דוד כהן',
    expertise: 'מרצה במכללה',
    profileImage: 'https://trust.coali.app/assets/yaakov-profile-B9QmZK8h.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    caption: 'הרצאה מרתקת על בינה מלאכותית ועתיד הטכנולוגיה',
    location: 'מכללת אחווה',
    isVerified: true,
    isLive: false,
    category: 'הרצאות',
    voteCount: 0,
    zoozCount: 1200,
    trustCount: 3400,
    watchCount: 8900,
    commentCount: 45,
    hasUserTrusted: false,
    hasUserWatched: false,
  },
  {
    id: 'achva-2',
    username: 'סטודנטית אחווה',
    expertise: 'סטודנטית',
    profileImage: 'https://trust.coali.app/assets/noa-profile-Dw6oQwrQ.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    caption: 'הכנה לבחינות - טיפים ועצות ממני',
    location: 'מכללת אחווה',
    isVerified: false,
    isLive: false,
    category: 'לימודים',
    voteCount: 0,
    zoozCount: 890,
    trustCount: 2100,
    watchCount: 5600,
    commentCount: 28,
    hasUserTrusted: false,
    hasUserWatched: false,
  },
];

// Add Maccabi posts
const maccabiPosts = [
  {
    id: 'maccabi-1',
    username: 'מאמן מכבי',
    expertise: 'מאמן ראשי',
    profileImage: 'https://trust.coali.app/assets/yaron-zelekha-profile-0jVRyAhY.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    caption: 'ניצחון גדול! תקציר המשחק מהלילה 🏀',
    location: 'אולם יבנה',
    isVerified: true,
    isLive: false,
    category: 'משחקים',
    voteCount: 450,
    zoozCount: 8900,
    trustCount: 23400,
    watchCount: 67000,
    commentCount: 789,
    hasUserTrusted: false,
    hasUserWatched: false,
  },
  {
    id: 'maccabi-2',
    username: 'שחקן מכבי',
    expertise: 'שחקן',
    profileImage: 'https://trust.coali.app/assets/warren-buffett-profile-Bfn-yren.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    caption: 'אימון בוקר - התכוננות למשחק הבא',
    location: 'אולם אימונים',
    isVerified: true,
    isLive: false,
    category: 'שחקנים',
    voteCount: 0,
    zoozCount: 6700,
    trustCount: 18900,
    watchCount: 45000,
    commentCount: 234,
    hasUserTrusted: false,
    hasUserWatched: false,
  },
];

const samplePosts = [...channel10Posts, ...achvaPosts, ...maccabiPosts, ...originalCoaliPosts];

export default function Index() {
  const navigate = useNavigate();
  const { selectedChannel, setSelectedChannel, availableChannels, selectedCategory, setSelectedCategory, showChannelIndicator, setShowChannelIndicator } = useChannel();
  const [posts, setPosts] = useState(samplePosts);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [mutedVideos, setMutedVideos] = useState<{ [key: string]: boolean }>({});
  const [decisionsCount, setDecisionsCount] = useState(0);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showRecordingInterface, setShowRecordingInterface] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'camera' | 'file' | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [uploadChannel, setUploadChannel] = useState(selectedChannel.id);
  const [uploadCategory, setUploadCategory] = useState(selectedCategory);
  const [alsoPostToCoali, setAlsoPostToCoali] = useState(true);
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isFilteringPosts, setIsFilteringPosts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [videoReady, setVideoReady] = useState<{ [key: string]: boolean }>({});
  const [videoPaused, setVideoPaused] = useState<{ [key: string]: boolean }>({});
  const [showPlayIcon, setShowPlayIcon] = useState<{ [key: string]: boolean }>({});
  const [showZoozConfetti, setShowZoozConfetti] = useState(false);
  const [globalMute, setGlobalMute] = useState(true);
  const [recordingStream, setRecordingStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState('00:00');
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'he');
  }, []);

  // Load posts from database
  useEffect(() => {
    loadPostsFromDB();
  }, [selectedChannel.id, selectedCategory]);

  // Load decisions count
  useEffect(() => {
    const loadDecisionsCount = async () => {
      try {
        const decisions = await fetchDemoDecisions(selectedChannel.id);
        console.log(`🗳️ Decisions in ${selectedChannel.name}:`, decisions.length);
        setDecisionsCount(decisions.length);
      } catch (error) {
        console.error('Failed to load decisions count:', error);
        setDecisionsCount(0);
      }
    };
    
    loadDecisionsCount();
  }, [selectedChannel.id]);

  // Monitor channel changes and verify category reset
  useEffect(() => {
    console.log('🔄 Channel monitoring useEffect triggered');
    console.log('Selected channel ID:', selectedChannel.id);
    console.log('Selected channel name:', selectedChannel.name);
    console.log('Current category:', selectedCategory);
    console.log('Available categories:', selectedChannel.categories);
    
    // Force reset if category not in channel categories
    const firstCat = selectedChannel.categories[0];
    if (!selectedChannel.categories.includes(selectedCategory)) {
      console.log('⚠️ Category not in channel! Forcing reset to:', firstCat);
      setSelectedCategory(firstCat);
    } else {
      console.log('✅ Category is valid for this channel');
    }
  }, [selectedChannel.id]);

  const loadPostsFromDB = async () => {
    setIsLoadingPosts(true);
    try {
      console.log('📥 Loading posts from database...');
      const dbPosts = await fetchDemoPosts(selectedChannel.id, selectedCategory);
      console.log('✅ Loaded', dbPosts.length, 'posts from database');
      
      // Map database fields to component format
      const mappedPosts = dbPosts.map((post: any) => ({
        id: post.id,
        username: post.username,
        expertise: post.expertise,
        profileImage: post.profile_image,
        videoUrl: post.video_url,
        imageUrl: post.image_url,
        caption: post.caption,
        location: post.location,
        isVerified: post.is_verified,
        isLive: post.is_live,
        category: post.category,
        voteCount: post.vote_count || 0,
        zoozCount: post.zooz_count || 0,
        trustCount: post.trust_count || 0,
        watchCount: post.watch_count || 0,
        commentCount: post.comment_count || 0,
        hasUserTrusted: false,
        hasUserWatched: false,
      }));
      
      // Filter out invalid posts
      const validPosts = mappedPosts.filter(post => {
        const hasMedia = post.videoUrl || post.imageUrl;
        const hasRequiredFields = post.id && post.username && post.category;
        const hasValidUrl = post.videoUrl?.trim() || post.imageUrl?.trim();
        
        return hasMedia && hasRequiredFields && hasValidUrl;
      });
      
      console.log(`📊 Filtered ${mappedPosts.length} → ${validPosts.length} valid posts`);
      
      // Combine with sample posts
      const allPosts = [...validPosts, ...samplePosts];
      
      // Remove duplicates by ID
      const uniqueByID = allPosts.filter((post, index, self) => 
        index === self.findIndex(p => p.id === post.id)
      );
      
      setPosts(uniqueByID);
      
      // Always scroll to top when posts load
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = 0;
          setCurrentPostIndex(0);
          console.log('✅ Scrolled to first post');
        }
      }, 100);
    } catch (error) {
      console.error('Failed to load posts:', error);
      setPosts(samplePosts);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  // Test Supabase connection (commented out to prevent blocking)
  /*
  useEffect(() => {
    const testSupabaseConnection = async () => {
      console.log('🔍 Testing Supabase connection...');
      // ... test code
    };
    testSupabaseConnection();
  }, []);
  */

  const openComments = (postId: string) => {
    setActivePostId(postId);
    setCommentsOpen(true);
  };

  const closeComments = () => {
    setCommentsOpen(false);
    setActivePostId(null);
  };

  // Filter posts by channel and category
  const filteredPosts = posts.filter(post => {
    // Filter by channel (for now all posts are in main channel)
    // In Phase 2, we'll add channel_id to posts
    
    // Filter by category
    if (selectedCategory === 'הכל') {
      return true; // Show all if "הכל" selected
    }
    
    return post.category === selectedCategory;
  });

  // Remove duplicates by ID
  const uniquePosts = filteredPosts.filter((post, index, self) => 
    index === self.findIndex(p => p.id === post.id)
  );

  // Reset to first post when filters change
  useEffect(() => {
    console.log('📺 Filters changed - scrolling to top');
    console.log('Channel:', selectedChannel.name, 'Category:', selectedCategory);
    
    setIsFilteringPosts(true);
    setCurrentPostIndex(0);
    
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
      console.log('✅ Scrolled to top');
    }
    
    setTimeout(() => {
      setIsFilteringPosts(false);
      if (containerRef.current) {
        containerRef.current.scrollTop = 0; // Ensure it's at top
      }
    }, 300);
  }, [selectedChannel.id, selectedCategory]);

  const handleFABClick = () => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    
    // Show options menu
    setShowOptionsMenu(true);
  };

  const handleRecordVideo = async () => {
    console.log('🎬 handleRecordVideo called');
    console.log('📱 Navigator.mediaDevices available:', !!navigator.mediaDevices);
    console.log('🎥 getUserMedia available:', !!navigator.mediaDevices?.getUserMedia);
    
    setShowOptionsMenu(false);
    console.log('✅ Options menu closed');
    
    try {
      console.log('📸 Requesting camera access...');
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1080 },
          height: { ideal: 1920 }
        }, 
        audio: true 
      });
      
      console.log('✅ Camera stream obtained:', stream.id);
      console.log('📹 Video tracks:', stream.getVideoTracks().length);
      console.log('🎤 Audio tracks:', stream.getAudioTracks().length);
      
      setRecordingStream(stream);
      setShowRecordingInterface(true);
      
      console.log('✅ State updated, showing recording interface');
      
      setTimeout(() => {
        if (videoRef.current) {
          console.log('📺 Setting video source...');
          videoRef.current.srcObject = stream;
          videoRef.current.play().then(() => {
            console.log('▶️ Video playing');
          }).catch(err => {
            console.error('❌ Video play failed:', err);
          });
        } else {
          console.error('❌ Video ref not available');
        }
      }, 100);
      
    } catch (error: any) {
      console.error('❌ Camera access error:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      
      if (error.name === 'NotAllowedError') {
        alert('גישה למצלמה נדחתה. אנא אפשר הרשאות מצלמה בהגדרות הדפדפן.');
      } else if (error.name === 'NotFoundError') {
        alert('לא נמצאה מצלמה במכשיר.');
      } else if (error.name === 'NotSupportedError') {
        alert('הדפדפן אינו תומך בגישה למצלמה. נסה דפדפן אחר.');
      } else {
        alert('שגיאה בגישה למצלמה: ' + error.message);
      }
    }
  };

  const startRecording = () => {
    if (!recordingStream) return;
    
    const mediaRecorder = new MediaRecorder(recordingStream);
    mediaRecorderRef.current = mediaRecorder;
    recordedChunksRef.current = [];
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const file = new File([blob], `video-${Date.now()}.webm`, { type: 'video/webm' });
      
      recordingStream?.getTracks().forEach(track => track.stop());
      setRecordingStream(null);
      
      setSelectedVideo(file);
      setShowRecordingInterface(false);
      setShowUploadModal(true);
      
      // Pre-fill
      setUploadChannel(selectedChannel.id);
      setUploadCategory(selectedCategory !== 'הכל' ? selectedCategory : selectedChannel.categories[1] || selectedChannel.categories[0]);
      setAlsoPostToCoali(selectedChannel.id !== null);
    };
    
    mediaRecorder.start();
    setIsRecording(true);
    
    // Start timer
    let seconds = 0;
    timerIntervalRef.current = setInterval(() => {
      seconds++;
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      setRecordingTime(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        setRecordingTime('00:00');
      }
    }
  };

  const closeRecording = () => {
    if (isRecording) {
      stopRecording();
    }
    recordingStream?.getTracks().forEach(track => track.stop());
    setRecordingStream(null);
    setShowRecordingInterface(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedVideo(file);
      setShowOptionsMenu(false);
      setShowUploadModal(true);
      setUploadMethod('file');
      // Pre-fill
      setUploadChannel(selectedChannel.id);
      setUploadCategory(selectedCategory !== 'הכל' ? selectedCategory : selectedChannel.categories[1] || selectedChannel.categories[0]);
      setAlsoPostToCoali(selectedChannel.id !== null);
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedVideo(file);
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedVideo || !uploadCategory) {
      console.error('❌ Missing required fields:', { 
        hasFile: !!selectedVideo, 
        category: uploadCategory 
      });
      return;
    }
    
    console.log('🚀 Starting upload process...');
    console.log('📁 File:', selectedVideo.name, selectedVideo.type, selectedVideo.size);
    console.log('📂 Category:', uploadCategory);
    console.log('📺 Channel:', selectedChannel.id, selectedChannel.name);
    
    setIsUploading(true);
    
    try {
      // Upload file to Supabase Storage
      console.log('📤 Uploading file to Supabase...');
      toast.info('מעלה קובץ...');
      
      const permanentUrl = await uploadMediaFile(selectedVideo);
      console.log('✅ File uploaded:', permanentUrl);
      toast.success('הקובץ הועלה בהצלחה!');
      
      const newPost = {
        id: `post-${Date.now()}`,
        user_id: 'demo-user',
        username: 'אתה',
        expertise: 'משתמש',
        profile_image: 'https://trust.coali.app/assets/sarah-profile-_yeQYYpH.jpg',
        video_url: selectedVideo.type.startsWith('video/') ? permanentUrl : null,
        image_url: selectedVideo.type.startsWith('image/') ? permanentUrl : null,
        caption: caption.trim(),
        location: 'ישראל',
        is_verified: true,
        is_live: false,
        category: uploadCategory,
        channel_id: selectedChannel.id,
        vote_count: 0,
        zooz_count: 0,
        trust_count: 0,
        watch_count: 0,
        comment_count: 0,
      };
      
      console.log('📄 Post object:', newPost);
      
      // Save to database
      console.log('💾 Saving to database...');
      toast.info('שומר פוסט...');
      
      await saveDemoPost(newPost);
      console.log('✅ Post saved to database');
      
      // Add to local state
      setPosts(prev => [newPost, ...prev]);
      
      // Also post to Coali if checked
      if (alsoPostToCoali && selectedChannel.id !== null) {
        console.log('📤 Also posting to Coali...');
        const coaliPost = { 
          ...newPost, 
          id: `post-coali-${Date.now()}`,
          channel_id: null 
        };
        await saveDemoPost(coaliPost);
        setPosts(prev => [coaliPost, ...prev]);
      }
      
      console.log('🎉 Upload complete!');
      toast.success('הפוסט פורסם בהצלחה! 🎉');
      
      // Reload posts from database
      await loadPostsFromDB();
      
      setShowUploadModal(false);
      setSelectedVideo(null);
      setCaption('');
    } catch (error: any) {
      console.error('❌ UPLOAD ERROR:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        fullError: error
      });
      
      if (error.message?.includes('storage')) {
        toast.error('שגיאה בהעלאת הקובץ');
      } else if (error.message?.includes('demo_posts')) {
        toast.error('שגיאה בשמירה למסד נתונים');
      } else {
        toast.error(`שגיאה: ${error.message || 'שגיאה לא ידועה'}`);
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Auto-play videos in viewport
  useEffect(() => {
    console.log('🎬 Current post index:', currentPostIndex);
    
    const currentPost = uniquePosts[currentPostIndex];
    if (!currentPost) return;
    
    const currentVideo = videoRefs.current[currentPost.id];
    if (currentVideo && currentVideo.paused) {
      console.log('▶️ Auto-playing current video:', currentPost.id);
      currentVideo.play().catch(() => {
        currentVideo.muted = true;
        setMutedVideos(prev => ({ ...prev, [currentPost.id]: true }));
        currentVideo.play().catch(err => console.error('Play failed:', err));
      });
    }

    // Pause all other videos
    Object.entries(videoRefs.current).forEach(([id, video]) => {
      if (id !== currentPost.id && video && !video.paused) {
        console.log('⏸️ Pausing other video:', id);
        video.pause();
      }
    });
  }, [currentPostIndex, uniquePosts]);

  // Scroll handling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const windowHeight = window.innerHeight - 64;
      const newIndex = Math.round(scrollTop / windowHeight);
      
      if (newIndex !== currentPostIndex && newIndex >= 0 && newIndex < uniquePosts.length) {
        setCurrentPostIndex(newIndex);
      }

      // Hide/show nav on scroll
      if (scrollTop > lastScrollY && scrollTop > 100) {
        // Scrolling down - hide nav
        setShowNav(false);
      } else {
        // Scrolling up - show nav
        setShowNav(true);
      }
      setLastScrollY(scrollTop);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentPostIndex, posts.length, lastScrollY]);

  const toggleMute = () => {
    setGlobalMute(!globalMute);
    // Apply to all videos
    Object.values(videoRefs.current).forEach(video => {
      if (video) {
        video.muted = !globalMute;
      }
    });
  };

  const togglePlayPause = (postId: string) => {
    const video = videoRefs.current[postId];
    if (!video) return;
    
    if (video.paused) {
      console.log('▶️ Playing video:', postId);
      video.play().catch(err => {
        console.error('Play failed:', err);
      });
      setVideoPaused(prev => ({ ...prev, [postId]: false }));
      setShowPlayIcon(prev => ({ ...prev, [postId]: true }));
      setTimeout(() => setShowPlayIcon(prev => ({ ...prev, [postId]: false })), 1500);
    } else {
      console.log('⏸️ Pausing video:', postId);
      video.pause();
      setVideoPaused(prev => ({ ...prev, [postId]: true }));
      setShowPlayIcon(prev => ({ ...prev, [postId]: true }));
    }
  };

  const toggleTrust = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    const newTrusted = !post.hasUserTrusted;
    const newCount = newTrusted ? post.trustCount + 1 : post.trustCount - 1;
    
    console.log('🛡️ Toggling trust:', postId, newTrusted);
    
    // Optimistic update
    setPosts(posts.map(p => 
      p.id === postId 
        ? { ...p, hasUserTrusted: newTrusted, trustCount: newCount }
        : p
    ));
    
    if (newTrusted) {
      toast.success('נתת אמון! 🛡️');
    }
    
    try {
      await updatePostEngagement(postId, 'trust_count', newCount);
    } catch (error) {
      console.error('Failed to update trust:', error);
      // Revert on error
      setPosts(posts.map(p => 
        p.id === postId ? { ...p, trustCount: post.trustCount, hasUserTrusted: post.hasUserTrusted } : p
      ));
    }
  };

  const toggleWatch = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    const newWatched = !post.hasUserWatched;
    const newCount = newWatched ? post.watchCount + 1 : post.watchCount - 1;
    
    // Optimistic update
    setPosts(posts.map(p => 
      p.id === postId 
        ? { ...p, hasUserWatched: newWatched, watchCount: newCount }
        : p
    ));
    
    if (newWatched) {
      toast.success('נשמר! 🔖');
    }
    
    try {
      await updatePostEngagement(postId, 'watch_count', newCount);
    } catch (error) {
      console.error('Failed to update watch:', error);
      // Revert on error
      setPosts(posts.map(p => 
        p.id === postId ? { ...p, watchCount: post.watchCount, hasUserWatched: post.hasUserWatched } : p
      ));
    }
  };

  const sendZooz = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    const newCount = (post.zoozCount || 0) + 1;
    
    // Show confetti animation
    setShowZoozConfetti(true);
    setTimeout(() => setShowZoozConfetti(false), 2000);
    
    // Optimistic update
    setPosts(posts.map(p => 
      p.id === postId ? { ...p, zoozCount: newCount } : p
    ));
    
    try {
      await updatePostEngagement(postId, 'zooz_count', newCount);
      toast.success('שלחת 1 Zooz! 💰');
    } catch (error) {
      console.error('Failed to send Zooz:', error);
      setPosts(posts.map(p => 
        p.id === postId ? { ...p, zoozCount: post.zoozCount } : p
      ));
    }
  };

  const handleShare = async (post: any) => {
    console.log('📤 Sharing post:', post.id);
    
    try {
      const shareData = {
        title: 'Coali - ' + (post.caption || 'פוסט מעניין'),
        text: post.caption || 'צפה בפוסט ב-Coali',
        url: window.location.origin + '/?post=' + post.id
      };
      
      console.log('Share data:', shareData);
      
      if (navigator.share) {
        await navigator.share(shareData);
        console.log('✅ Shared successfully');
        toast.success('שותף! 🔗');
      } else {
        // Fallback: Copy link
        const link = window.location.origin + '/?post=' + post.id;
        await navigator.clipboard.writeText(link);
        console.log('✅ Link copied');
        toast.success('קישור הועתק! 🔗');
      }
    } catch (error) {
      console.error('Share failed:', error);
      if (error instanceof Error && error.name !== 'AbortError') {
        toast.error('שיתוף נכשל');
      }
    }
  };

  const formatCount = (count: number) => {
    if (!count && count !== 0) {
      return '0'; // Handle undefined/null
    }
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="h-screen bg-black overflow-hidden">
      {/* Zooz Confetti Animation */}
      {showZoozConfetti && (
        <div className="fixed inset-0 z-[70] pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full animate-zooz-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: i % 2 === 0 ? '#FFD700' : '#C0C0C0',
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${1.5 + Math.random()}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Filtering Loading Overlay */}
      {isFilteringPosts && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-background rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium">טוען תוכן...</p>
            </div>
          </div>
        </div>
      )}

      {/* FAB - Floating Action Button - 15px above bottom nav */}
      <button
        onClick={handleFABClick}
        className={cn(
          "fixed bottom-[79px] left-1/2 -translate-x-1/2 z-50 w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-all duration-300",
          !showNav && "translate-y-24 opacity-0"
        )}
      >
        <Plus className="w-6 h-6 text-white" />
      </button>

      {/* Top Left Corner - החלטות Button */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => navigate('/decisions')}
          data-tour-id="decisions-filter"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 text-white/80 hover:text-white bg-white/10 relative"
        >
          <span className="text-xs">החלטות</span>
          {decisionsCount > 0 && (
            <div className="absolute -top-1 -left-1 min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg">
              {decisionsCount > 9 ? '9+' : decisionsCount}
            </div>
          )}
        </button>
      </div>

      {/* Category Dropdown - Center Top (TikTok Style) */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <CategoryDropdown
          categories={selectedChannel.categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {/* Top Right Corner - Channel Selector */}
      <div className="fixed top-4 right-4 z-50">
        <ChannelSelector />
      </div>

      {/* Posts Feed */}
      <div 
        ref={containerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {uniquePosts.length > 0 ? (
          uniquePosts.map((post) => (
          <div 
            key={post.id}
            className="relative snap-start snap-always h-screen w-full"
          >
            {/* Black Background */}
            <div className="absolute inset-0 bg-black" />
            
            {/* Elegant Loader - shows while video loading */}
            {!videoReady[post.id] && (
              <div className="absolute inset-0 bg-black flex items-center justify-center">
                <div className="relative w-20 h-20">
                  {/* Outer ring */}
                  <div className="absolute inset-0 border-4 border-gray-800 rounded-full opacity-25" />
                  
                  {/* Spinning ring */}
                  <div className="absolute inset-0 border-4 border-transparent border-t-gray-600 rounded-full animate-spin" />
                  
                  {/* Inner pulsing circle */}
                  <div className="absolute inset-3 bg-gray-800 rounded-full animate-pulse" />
                </div>
              </div>
            )}

            {/* Video */}
            <video
              ref={(el) => (videoRefs.current[post.id] = el)}
              src={post.videoUrl}
              className="absolute inset-0 w-full h-full object-cover"
              loop
              playsInline
              muted={globalMute}
              preload="metadata"
              onClick={(e) => {
                e.stopPropagation();
                togglePlayPause(post.id);
              }}
              onCanPlay={() => {
                console.log('✅ Video ready:', post.id);
                setVideoReady(prev => ({ ...prev, [post.id]: true }));
              }}
              onLoadedData={() => {
                setVideoReady(prev => ({ ...prev, [post.id]: true }));
              }}
              onError={(e) => {
                console.error('❌ Video error for:', post.id, post.videoUrl);
                setVideoReady(prev => ({ ...prev, [post.id]: false }));
              }}
            />
            
            {/* Play/Pause Icon Overlay */}
            {showPlayIcon[post.id] && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-20 h-20 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center">
                  {videoPaused[post.id] ? (
                    <Play className="w-10 h-10 text-white fill-white" />
                  ) : (
                    <Pause className="w-10 h-10 text-white fill-white" />
                  )}
                </div>
              </div>
            )}
            
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />

            {/* Mute Button - No circle, 15px lower */}
            <button
              onClick={toggleMute}
              className="fixed top-[95px] right-4 p-0 z-10"
            >
              {globalMute ? (
                <VolumeX className="w-4 h-4 text-white drop-shadow-lg" />
              ) : (
                <Volume2 className="w-4 h-4 text-white drop-shadow-lg" />
              )}
            </button>

            {/* Action Buttons - LEFT Side */}
            <div className="absolute left-4 bottom-32 flex flex-col gap-6">
              {/* Zooz Button - TOP */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sendZooz(post.id);
                }}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-all">
                  <span className="text-zooz text-xl font-bold">Z</span>
                </div>
                <span className="text-white text-xs font-bold drop-shadow-lg">
                  {formatCount(post.zoozCount || 0)}
                </span>
              </button>

              {/* Trust Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTrust(post.id);
                }}
                className="flex flex-col items-center gap-1"
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200",
                  post.hasUserTrusted 
                    ? "bg-blue-500 shadow-lg shadow-blue-500/50" 
                    : "bg-black/30 backdrop-blur-sm hover:bg-black/50"
                )}>
                  {post.hasUserTrusted ? (
                    <ShieldCheck className="w-6 h-6 text-white" />
                  ) : (
                    <Shield className="w-6 h-6 text-white" />
                  )}
                </div>
                <span className={cn(
                  "text-xs font-bold drop-shadow-lg",
                  post.hasUserTrusted ? "text-blue-400" : "text-white"
                )}>
                  {formatCount(post.trustCount)}
                </span>
              </button>

              {/* Watch/Bookmark Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWatch(post.id);
                }}
                className="flex flex-col items-center gap-1"
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200",
                  post.hasUserWatched 
                    ? "bg-yellow-500 shadow-lg shadow-yellow-500/50" 
                    : "bg-black/30 backdrop-blur-sm hover:bg-black/50"
                )}>
                  <Bookmark className={cn(
                    "w-5 h-5 text-white",
                    post.hasUserWatched && "fill-white"
                  )} />
                </div>
                <span className={cn(
                  "text-xs font-bold drop-shadow-lg",
                  post.hasUserWatched ? "text-yellow-400" : "text-white"
                )}>
                  {formatCount(post.watchCount)}
                </span>
              </button>

              {/* Share Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare(post);
                }}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-all duration-200">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
              </button>
            </div>

            {/* Bottom Right - Caption and Info */}
            <div className="absolute bottom-20 right-4 left-20 z-10">
              {/* Profile and Name */}
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <img
                    src={post.profileImage}
                    alt={post.username}
                    className="w-12 h-12 rounded-full border-2 border-white object-cover"
                  />
                  {/* LIVE Badge below profile - 50% smaller */}
                  {post.isLive && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 whitespace-nowrap">
                      <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                      LIVE
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-white font-bold text-base drop-shadow-lg">
                    {post.username}
                  </h3>
                  <p className="text-white/90 text-sm drop-shadow-lg">
                    {post.expertise}
                  </p>
                </div>
              </div>

              {/* Caption */}
              <p className="text-white text-sm leading-relaxed mb-2 drop-shadow-lg">
                {post.caption}
              </p>

              {/* Location and Authenticity */}
              <div className="flex items-center gap-2 text-white/90 text-xs">
                {post.isVerified && (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-trust" />
                    <span className="drop-shadow-lg">אותנטי</span>
                    <span>|</span>
                  </>
                )}
                <MapPin className="w-3.5 h-3.5" />
                <span className="drop-shadow-lg">{post.location}</span>
              </div>
            </div>
          </div>
        ))
        ) : (
          <div className="h-screen flex items-center justify-center">
            <div className="text-center text-white px-6">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-bold mb-2">אין תוכן בקטגוריה זו</h3>
              <p className="text-white/60 mb-6">נסה קטגוריה אחרת או צור תוכן חדש</p>
              <button
                onClick={() => setSelectedCategory('הכל')}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
              >
                חזור להכל
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <Navigation zoozBalance={999} show={showNav} />

      {/* Comments Modal */}
      {activePostId && (
        <Comments
          postId={activePostId}
          isOpen={commentsOpen}
          onClose={closeComments}
          commentCount={posts.find(p => p.id === activePostId)?.commentCount || 0}
        />
      )}

      {/* Options Menu */}
      {showOptionsMenu && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center md:justify-center">
          <div 
            className="absolute inset-0" 
            onClick={() => setShowOptionsMenu(false)}
          />
          
          <div className="relative bg-background rounded-t-3xl md:rounded-2xl w-full md:max-w-md p-6 space-y-4 animate-slide-up">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold">יצירת תוכן חדש</h2>
              <p className="text-sm text-muted-foreground mt-1">בחר אופן העלאה</p>
            </div>
            
            <button
              onClick={() => {
                console.log('🎥 Camera button clicked!');
                handleRecordVideo();
              }}
              className="w-full p-5 border-2 border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-between group"
            >
              <div className="text-right flex-1">
                <p className="font-bold text-lg mb-1">הקלטת וידאו</p>
                <p className="text-sm text-muted-foreground">צלם וידאו חדש עם המצלמה</p>
              </div>
              <div className="w-14 h-14 bg-red-50 group-hover:bg-red-100 rounded-full flex items-center justify-center">
                <Video className="w-7 h-7 text-red-500" />
              </div>
            </button>
            
            <label className="w-full p-5 border-2 border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-between cursor-pointer group">
              <div className="text-right flex-1">
                <p className="font-bold text-lg mb-1">העלאת קובץ</p>
                <p className="text-sm text-muted-foreground">בחר וידאו או תמונה קיימת</p>
              </div>
              <div className="w-14 h-14 bg-blue-50 group-hover:bg-blue-100 rounded-full flex items-center justify-center">
                <Upload className="w-7 h-7 text-blue-500" />
              </div>
              <input
                type="file"
                accept="video/*,image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            
            <button
              onClick={() => setShowOptionsMenu(false)}
              className="w-full p-4 text-muted-foreground hover:text-foreground"
            >
              ביטול
            </button>
          </div>
        </div>
      )}

      {/* Recording Interface */}
      {showRecordingInterface && (
        <div className="fixed inset-0 bg-black z-[60] flex flex-col">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={!isRecording}
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
          />
          
          {isRecording && (
            <div className="absolute top-6 right-6 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              <span className="font-bold">REC</span>
              <span className="font-mono">{recordingTime}</span>
            </div>
          )}
          
          <div className="absolute top-6 left-6 flex gap-3">
            <button
              onClick={closeRecording}
              className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 pb-8 pt-6 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center justify-center gap-8">
              {!isRecording ? (
                <>
                  <button onClick={closeRecording} className="text-white text-sm">
                    ביטול
                  </button>
                  <button
                    onClick={startRecording}
                    className="w-20 h-20 rounded-full bg-red-500 border-4 border-white shadow-lg hover:bg-red-600 active:scale-95 transition-all"
                  >
                    <div className="w-full h-full rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 bg-white rounded-full" />
                    </div>
                  </button>
                  <div className="w-16" />
                </>
              ) : (
                <>
                  <div className="w-16" />
                  <button
                    onClick={stopRecording}
                    className="w-20 h-20 rounded-full bg-white border-4 border-white shadow-lg hover:bg-gray-100 active:scale-95 transition-all"
                  >
                    <Square className="w-8 h-8 text-red-500 fill-red-500" />
                  </button>
                  <div className="text-white font-mono text-sm">{recordingTime}</div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && selectedVideo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">פרסום תוכן</h2>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedVideo(null);
                    setCaption('');
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Video/Image Preview */}
                <div className="relative bg-muted rounded-lg overflow-hidden">
                  {selectedVideo.type.startsWith('video/') ? (
                    <video
                      src={URL.createObjectURL(selectedVideo)}
                      controls
                      className="w-full max-h-[400px] object-contain"
                    />
                  ) : (
                    <img
                      src={URL.createObjectURL(selectedVideo)}
                      alt="Preview"
                      className="w-full max-h-[400px] object-contain"
                    />
                  )}
                </div>

                {/* Caption */}
                <div>
                  <label className="block text-sm font-medium mb-2">כיתוב</label>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="הוסף כיתוב..."
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background min-h-[100px] resize-none"
                    maxLength={400}
                    dir="rtl"
                  />
                  <p className="text-xs text-muted-foreground text-right mt-1">
                    {caption.length}/400
                  </p>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">קטגוריה</label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background"
                    dir="rtl"
                  >
                    {selectedChannel.categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Also Post to Coali Checkbox */}
                {selectedChannel.id !== null && (
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <label className="flex items-center justify-end gap-3 cursor-pointer">
                      <div className="text-right">
                        <p className="text-sm font-medium">פרסם גם בערוץ Coali הראשי</p>
                        <p className="text-xs text-muted-foreground">התוכן יופיע גם בערוץ הראשי</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={alsoPostToCoali}
                        onChange={(e) => setAlsoPostToCoali(e.target.checked)}
                        className="w-5 h-5 rounded"
                      />
                    </label>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleUploadSubmit}
                  disabled={!uploadCategory || caption.trim().length === 0 || isUploading}
                  className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-bold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>מעלה...</span>
                    </div>
                  ) : (
                    'פרסם'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
