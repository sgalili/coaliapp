import { useState, useEffect, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { ChannelSelector } from "@/components/ChannelSelector";
import { CategoryDropdown } from "@/components/CategoryDropdown";
import { Comments } from "@/components/Comments";
import { Heart, Eye, MessageCircle, Share2, Volume2, VolumeX, CheckCircle, MapPin, Plus, X, Video, Upload, RefreshCw, Square, Loader2, Shield, ShieldCheck, Bookmark, MoreVertical, Play, Pause, Gift, Handshake, Crown, Edit2, Trash2, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useChannel } from "@/contexts/ChannelContext";
import { supabase } from "@/integrations/supabase/client";
import { uploadMediaFile } from "@/services/uploadService";
import { saveDemoPost, fetchDemoPosts, fetchDemoDecisions, updatePostEngagement } from "@/services/database";
import { toast } from "sonner";

// Empty Category State Component
const EmptyCategoryState = () => {
  const [showIcon, setShowIcon] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIcon(true);
    }, 3000); // Show icon after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className={cn(
        "transition-opacity duration-1000",
        showIcon ? "opacity-100" : "opacity-0"
      )}>
        <svg 
          className="w-32 h-32 text-gray-600/30" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          strokeWidth="0.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
    </div>
  );
};

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
    shareCount: 15600,
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
    shareCount: 12400,
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
    shareCount: 3200,
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
    shareCount: 28900,
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
    shareCount: 4500,
    hasUserTrusted: false,
    hasUserWatched: false,
  },
];

// Add Channel 10 posts
const channel10Posts = [
  {
    id: 'ch10-video-1',
    username: 'ערוץ 10 כלכלה',
    expertise: 'עיתונאי כלכלה',
    profileImage: '/channel-10-logo.jpeg',
    videoUrl: '/videos/channel10_video1.webm',
    caption: 'בעקבות הכרזת הריבית של ג׳רום פאוול - ניתוח מעמיק',
    location: 'תל אביב',
    isVerified: true,
    isLive: false,
    category: 'שוק ההון',
    channel_id: 'channel-10-economy',
    voteCount: 0,
    zoozCount: 0,
    trustCount: 340,
    watchCount: 890,
    commentCount: 0,
    shareCount: 0,
    hasUserTrusted: false,
    hasUserWatched: false,
  },
  {
    id: 'ch10-video-2',
    username: 'כתב ערוץ 10',
    expertise: 'עיתונאות פוליטית',
    profileImage: 'https://trust.coali.app/assets/david-profile-RItxnDNA.jpg',
    videoUrl: '/videos/channel10_video2.webm',
    caption: 'דונלד טראמפ מגיב בצחוק לעיתונאים - תגובות נוספות',
    location: 'ירושלים',
    isVerified: true,
    isLive: false,
    category: 'טכנולוגיה',
    channel_id: 'channel-10-economy',
    voteCount: 0,
    zoozCount: 0,
    trustCount: 234,
    watchCount: 567,
    commentCount: 0,
    shareCount: 0,
    hasUserTrusted: false,
    hasUserWatched: false,
  },
  {
    id: 'ch10-video-3',
    username: 'דור מנטל',
    expertise: 'מומחה פיננסים',
    profileImage: 'https://trust.coali.app/assets/yaron-zelekha-profile-0jVRyAhY.jpg',
    videoUrl: '/videos/channel10_video3.webm',
    caption: 'קלף פוקימון אחד ששווה יותר מרכב - למה קלף בודד כל כך יקר?',
    location: 'תל אביב',
    isVerified: true,
    isLive: false,
    category: 'קריפטו',
    channel_id: 'channel-10-economy',
    voteCount: 0,
    zoozCount: 0,
    trustCount: 456,
    watchCount: 1200,
    commentCount: 0,
    shareCount: 0,
    hasUserTrusted: false,
    hasUserWatched: false,
  },
  {
    id: 'ch10-video-4',
    username: 'מומחה כלכלי',
    expertise: 'ייעוץ פיננסי',
    profileImage: 'https://trust.coali.app/assets/amit-profile-CprpaaC6.jpg',
    videoUrl: '/videos/channel10_video4.webm',
    caption: 'הכלי הפיננסי שהופך למלכודת חוב מתגלגלת - אזהרה',
    location: 'תל אביב',
    isVerified: true,
    isLive: false,
    category: 'שוק ההון',
    channel_id: 'channel-10-economy',
    voteCount: 0,
    zoozCount: 0,
    trustCount: 178,
    watchCount: 445,
    commentCount: 0,
    shareCount: 0,
    hasUserTrusted: false,
    hasUserWatched: false,
  },
  {
    id: 'ch10-video-5',
    username: 'ערוץ 10 חדשות',
    expertise: 'כתב כלכלה',
    profileImage: '/channel-10-logo.jpeg',
    videoUrl: '/videos/channel10_video5.webm',
    caption: 'הקלות בדרך: משרד האוצר מציג רפורמת מיסוי ההייטק החדשה',
    location: 'ירושלים',
    isVerified: true,
    isLive: false,
    category: 'טכנולוגיה',
    channel_id: 'channel-10-economy',
    voteCount: 0,
    zoozCount: 0,
    trustCount: 567,
    watchCount: 1340,
    commentCount: 0,
    shareCount: 0,
    hasUserTrusted: false,
    hasUserWatched: false,
  },
  {
    id: 'ch10-video-6',
    username: 'מנהל רשות המסים',
    expertise: 'ממשל ומיסוי',
    profileImage: 'https://trust.coali.app/assets/warren-buffett-profile-Bfn-yren.jpg',
    videoUrl: '/videos/channel10_video6.webm',
    caption: 'הורדת המע״מ לא עומדת על הפרק - התקציב עובר עד סוף מרץ',
    location: 'ירושלים',
    isVerified: true,
    isLive: false,
    category: 'נדל׳ן',
    channel_id: 'channel-10-economy',
    voteCount: 0,
    zoozCount: 0,
    trustCount: 290,
    watchCount: 678,
    commentCount: 0,
    shareCount: 0,
    hasUserTrusted: false,
    hasUserWatched: false,
  },
];

// Add Achva College posts
const achvaPosts = [
  {
    id: 'achva-video-1',
    username: 'פרופ׳ שרה כהן',
    expertise: 'מרצה בכירה',
    profileImage: 'https://trust.coali.app/assets/sarah-profile-_yeQYYpH.jpg',
    videoUrl: '/videos/achva_video1.webm',
    caption: 'הרצאה מרתקת מהמכללה האקדמית אחווה - טיפים ללימודים והצלחה',
    location: 'מכללת אחווה',
    isVerified: true,
    isLive: false,
    category: 'לימודים',
    channel_id: 'channel-achva',
    voteCount: 0,
    zoozCount: 0,
    trustCount: 120,
    watchCount: 350,
    commentCount: 0,
    shareCount: 0,
    hasUserTrusted: false,
    hasUserWatched: false,
  },
  {
    id: 'achva-video-2',
    username: 'ד״ר דוד לוי',
    expertise: 'חוקר בכיר',
    profileImage: 'https://trust.coali.app/assets/david-profile-RItxnDNA.jpg',
    videoUrl: '/videos/achva_video2.webm',
    caption: 'מחקר חדשני במכללת אחווה - גילויים מרתקים',
    location: 'מכללת אחווה',
    isVerified: true,
    isLive: false,
    category: 'מחקר',
    channel_id: 'channel-achva',
    voteCount: 0,
    zoozCount: 0,
    trustCount: 89,
    watchCount: 234,
    commentCount: 0,
    shareCount: 0,
    hasUserTrusted: false,
    hasUserWatched: false,
  },
  {
    id: 'achva-video-3',
    username: 'יוסי אברהם',
    expertise: 'סטודנט',
    profileImage: 'https://trust.coali.app/assets/yaakov-profile-B9QmZK8h.jpg',
    videoUrl: '/videos/achva_video3.webm',
    caption: 'אירוע מיוחד במכללה - חווית סטודנטים',
    location: 'מכללת אחווה',
    isVerified: false,
    isLive: false,
    category: 'אירועים',
    channel_id: 'channel-achva',
    voteCount: 0,
    zoozCount: 0,
    trustCount: 45,
    watchCount: 156,
    commentCount: 0,
    shareCount: 0,
    hasUserTrusted: false,
    hasUserWatched: false,
  },
  {
    id: 'achva-video-4',
    username: 'פרופ׳ מיכל שמיר',
    expertise: 'דיקנית',
    profileImage: 'https://trust.coali.app/assets/maya-profile-BXPf8jtn.jpg',
    videoUrl: '/videos/achva_video4.webm',
    caption: 'הרצאה מיוחדת - עתיד ההשכלה הגבוהה בישראל',
    location: 'מכללת אחווה',
    isVerified: true,
    isLive: false,
    category: 'הרצאות',
    channel_id: 'channel-achva',
    voteCount: 0,
    zoozCount: 0,
    trustCount: 234,
    watchCount: 567,
    commentCount: 0,
    shareCount: 0,
    hasUserTrusted: false,
    hasUserWatched: false,
  },
  {
    id: 'achva-video-5',
    username: 'נועה רותם',
    expertise: 'סטודנטית מצטיינת',
    profileImage: 'https://trust.coali.app/assets/noa-profile-Dw6oQwrQ.jpg',
    videoUrl: '/videos/achva_video5.webm',
    caption: 'חוויות מהלימודים במכללת אחווה - מומלץ לצפות!',
    location: 'מכללת אחווה',
    isVerified: false,
    isLive: false,
    category: 'סטודנטים',
    channel_id: 'channel-achva',
    voteCount: 0,
    zoozCount: 0,
    trustCount: 67,
    watchCount: 189,
    commentCount: 0,
    shareCount: 0,
    hasUserTrusted: false,
    hasUserWatched: false,
  },
];

// Add Maccabi posts
const maccabiPosts = [
  {
    id: 'maccabi-1',
    username: 'מאמן מכבי צבי יבנה',
    expertise: 'מאמן ראשי',
    profileImage: 'https://trust.coali.app/assets/yaron-zelekha-profile-0jVRyAhY.jpg',
    videoUrl: '/videos/maccabi_video1.mp4',
    caption: 'תקציר משחק - ניצחון גדול של מכבי! 🏀',
    location: 'אולם יבנה',
    isVerified: true,
    isLive: false,
    category: 'משחקים',
    channel_id: 'channel-maccabi',
    voteCount: 450,
    zoozCount: 8900,
    trustCount: 23400,
    watchCount: 67000,
    commentCount: 789,
    shareCount: 450,
    hasUserTrusted: false,
    hasUserWatched: false,
  },
  {
    id: 'maccabi-2',
    username: 'שחקן מכבי',
    expertise: 'שחקן כדורסל',
    profileImage: 'https://trust.coali.app/assets/warren-buffett-profile-Bfn-yren.jpg',
    videoUrl: '/videos/maccabi_video2.webm',
    caption: 'אימון בוקר - התכוננות למשחק הבא',
    location: 'אולם אימונים',
    isVerified: true,
    isLive: false,
    category: 'שחקנים',
    channel_id: 'channel-maccabi',
    voteCount: 0,
    zoozCount: 6700,
    trustCount: 18900,
    watchCount: 45000,
    commentCount: 234,
    shareCount: 180,
    hasUserTrusted: false,
    hasUserWatched: false,
  },
  {
    id: 'maccabi-3',
    username: 'אוהד מכבי',
    expertise: 'אוהד ותיק',
    profileImage: 'https://trust.coali.app/assets/david-profile-RItxnDNA.jpg',
    videoUrl: '/videos/maccabi_video3.mp4',
    caption: 'תוצאות המשחק האחרון - ניתוח מעמיק',
    location: 'יבנה',
    isVerified: false,
    isLive: false,
    category: 'תוצאות',
    channel_id: 'channel-maccabi',
    voteCount: 0,
    zoozCount: 3400,
    trustCount: 8900,
    watchCount: 23000,
    commentCount: 156,
    shareCount: 120,
    hasUserTrusted: false,
    hasUserWatched: false,
  },
  {
    id: 'maccabi-4',
    username: 'כתב ספורט',
    expertise: 'עיתונאי ספורט',
    profileImage: 'https://trust.coali.app/assets/yaakov-profile-B9QmZK8h.jpg',
    videoUrl: '/videos/maccabi_video4.mp4',
    caption: 'חדשות מכבי - עדכונים מהקבוצה',
    location: 'יבנה',
    isVerified: true,
    isLive: false,
    category: 'חדשות',
    channel_id: 'channel-maccabi',
    voteCount: 0,
    zoozCount: 4500,
    trustCount: 12300,
    watchCount: 34000,
    commentCount: 89,
    shareCount: 65,
    hasUserTrusted: false,
    hasUserWatched: false,
  },
  {
    id: 'maccabi-5',
    username: 'מנהל מכבי',
    expertise: 'מנהל קבוצה',
    profileImage: 'https://trust.coali.app/assets/amit-profile-CprpaaC6.jpg',
    videoUrl: '/videos/maccabi_video5.mp4',
    caption: 'פגישת אוהדים - תודה לתמיכה!',
    location: 'אולם יבנה',
    isVerified: true,
    isLive: false,
    category: 'אוהדים',
    channel_id: 'channel-maccabi',
    voteCount: 0,
    zoozCount: 5600,
    trustCount: 15600,
    watchCount: 38000,
    commentCount: 234,
    shareCount: 190,
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
  const [unreadNotifications, setUnreadNotifications] = useState(3); // Demo count
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
  const [globalMute, setGlobalMute] = useState(true);
  const [showZoozConfetti, setShowZoozConfetti] = useState(false);
  const [zoozCoinCount, setZoozCoinCount] = useState(0);
  const [showZoozSelector, setShowZoozSelector] = useState(false);
  const [selectedZoozAmount, setSelectedZoozAmount] = useState(1);
  const [zoozPressTimer, setZoozPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [currentZoozPost, setCurrentZoozPost] = useState<string | null>(null);
  const [userZoozBalance, setUserZoozBalance] = useState(1500); // Demo balance
  // Get current authenticated user
  const getCurrentUserId = () => {
    const authUserId = localStorage.getItem('authenticated_user_id');
    if (authUserId && authUserId !== 'demo-user') {
      console.log('🏠 Homepage using REAL user:', authUserId);
      return authUserId;
    }
    console.log('🏠 Homepage using demo-user');
    return 'demo-user';
  };
  
  const [currentUserId] = useState(getCurrentUserId());
  const [openMenuPostId, setOpenMenuPostId] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [postToDelete, setPostToDelete] = useState<any | null>(null);
  const [recordingStream, setRecordingStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState('00:00');
  const [showTextLabels, setShowTextLabels] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
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

  // Load posts from database - force reload when category changes
  useEffect(() => {
    console.log('🔄 Category/Channel changed - Force reload');
    console.log('Channel:', selectedChannel.name, 'Category:', selectedCategory);
    
    // Clear current posts first
    setPosts([]);
    
    // Small delay then reload
    setTimeout(() => {
      loadPostsFromDB();
    }, 50);
  }, [selectedChannel.id, selectedCategory]);

  // Load decisions count
  useEffect(() => {
    const loadDecisionsCount = async () => {
      try {
        console.log('🗳️ Loading decisions count for:', selectedChannel.name, selectedChannel.id);
        const decisions = await fetchDemoDecisions(selectedChannel.id);
        console.log('📊 Fetched decisions:', decisions);
        console.log('📊 Total count:', decisions.length);
        
        setDecisionsCount(decisions.length);
        
        // Force show badge for testing
        if (decisions.length === 0) {
          console.warn('⚠️ No decisions found for this channel');
        } else {
          console.log('✅ Badge should show:', decisions.length);
        }
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

  // Dynamic action button labels - cycle: 10s numbers → 6s text → repeat with smooth dissolve
  useEffect(() => {
    const runCycle = () => {
      // Start dissolve-out for numbers
      setIsTransitioning(true);
      
      // After dissolve-out animation (600ms), switch to text labels
      setTimeout(() => {
        setShowTextLabels(true);
        setIsTransitioning(false);
      }, 600);
      
      // After 6 seconds, start dissolve-out for text labels
      setTimeout(() => {
        setIsTransitioning(true);
        
        // After dissolve-out animation (600ms), switch back to numbers
        setTimeout(() => {
          setShowTextLabels(false);
          setIsTransitioning(false);
        }, 600);
      }, 6000);
    };

    // Run first cycle after 10 seconds
    const initialTimeout = setTimeout(runCycle, 10000);
    
    // Then repeat every 16 seconds (10s numbers + 6s text)
    const cycleInterval = setInterval(runCycle, 16000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(cycleInterval);
    };
  }, []); // Empty dependency array - only run once on mount

  const loadPostsFromDB = async () => {
    setIsLoadingPosts(true);
    try {
      console.log('📥 Loading posts - Channel:', selectedChannel.id, 'Category:', selectedCategory);
      
      // Fetch from database with current filters
      const dbPosts = await fetchDemoPosts(selectedChannel.id, selectedCategory);
      console.log('✅ DB returned', dbPosts.length, 'posts');
      
      // Map database fields
      const mappedPosts = dbPosts.map((post: any) => ({
        id: post.id,
        user_id: post.user_id,
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
        channel_id: post.channel_id,
        voteCount: post.vote_count || 0,
        zoozCount: post.zooz_count || 0,
        trustCount: post.trust_count || 0,
        watchCount: post.watch_count || 0,
        commentCount: post.comment_count || 0,
        shareCount: post.share_count || 0,
        hasUserTrusted: false,
        hasUserWatched: false,
      }));
      
      console.log('✅ Mapped', mappedPosts.length, 'posts');
      
      // Filter valid posts
      const validPosts = mappedPosts.filter(post => {
        const hasMedia = post.videoUrl || post.imageUrl;
        const hasRequired = post.id && post.username && post.category;
        const hasValidUrl = post.videoUrl?.trim() || post.imageUrl?.trim();
        return hasMedia && hasRequired && hasValidUrl;
      });
      
      console.log('✅ Valid:', validPosts.length);
      
      // DON'T combine with samplePosts - only use database
      // Remove duplicates just in case
      const uniqueByID = validPosts.filter((post, index, self) => 
        index === self.findIndex(p => p.id === post.id)
      );
      
      console.log('✅ Final posts:', uniqueByID.length);
      setPosts(uniqueByID);
      
      // Scroll to top
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = 0;
          setCurrentPostIndex(0);
        }
      }, 100);
    } catch (error) {
      console.error('Load failed:', error);
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
    // First filter by channel
    if (selectedChannel.id === null) {
      return !post.channel_id || (post.id && !post.id.toString().includes('10-') && !post.id.toString().includes('achva-') && !post.id.toString().includes('maccabi-'));
    } else {
      return post.channel_id === selectedChannel.id;
    }
  }).filter(post => {
    // Then filter by category - הכל shows ALL posts
    if (selectedCategory === 'הכל') {
      return true; // Show ALL posts when הכל is selected
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
      // Validate: Only videos
      if (!file.type.startsWith('video/')) {
        toast.error('ניתן להעלות רק קבצי וידאו');
        return;
      }
      
      // Validate: Max 10 minutes (600 seconds)
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        const duration = video.duration;
        
        if (duration > 600) {
          toast.error('הוידאו ארוך מדי. מקסימום 10 דקות');
          return;
        }
        
        // Valid video
        setSelectedVideo(file);
        setShowOptionsMenu(false);
        setShowUploadModal(true);
        setUploadMethod('file');
        setUploadChannel(selectedChannel.id);
        setUploadCategory(selectedCategory !== 'הכל' ? selectedCategory : selectedChannel.categories[1] || selectedChannel.categories[0]);
        setAlsoPostToCoali(selectedChannel.id !== null);
      };
      
      video.src = URL.createObjectURL(file);
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
      // Add bookmark and subscription
      try {
        // Save to bookmarks table
        const { data: bookmarkData, error: bookmarkError } = await supabase
          .from('bookmarks')
          .insert({
            post_id: postId,
            user_id: post.user_id || 'demo-user',
            bookmark_user_id: 'demo-user'
          })
          .select()
          .single();

        if (bookmarkError) throw bookmarkError;

        // Create subscription to post owner (if not self)
        if (post.user_id && post.user_id !== 'demo-user') {
          const { error: subError } = await supabase
            .from('subscriptions')
            .upsert({
              subscriber_id: 'demo-user',
              creator_id: post.user_id
            }, {
              onConflict: 'subscriber_id,creator_id',
              ignoreDuplicates: true
            });

          if (subError) console.warn('Subscription already exists or error:', subError);
          
          toast.success(`נשמר למועדפים! 🔖 + נרשמת למנוי של ${post.username || 'המשתמש'}`);
        } else {
          toast.success('נשמר למועדפים! 🔖');
        }

        // Update watch count in database
        await updatePostEngagement(postId, 'watch_count', newCount);
      } catch (error) {
        console.error('Failed to add bookmark:', error);
        // Revert on error
        setPosts(posts.map(p => 
          p.id === postId ? { ...p, watchCount: post.watchCount, hasUserWatched: post.hasUserWatched } : p
        ));
        toast.error('שגיאה בשמירה למועדפים');
      }
    } else {
      // Just toggle the UI, actual removal happens in profile bookmarks page
      toast.success('הוסר מהמועדפים');
      try {
        await updatePostEngagement(postId, 'watch_count', newCount);
      } catch (error) {
        console.error('Failed to update watch count:', error);
      }
    }
  };

  const sendZooz = async (postId: string, amount: number = 1) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    // Check balance
    if (userZoozBalance < amount) {
      toast.error('אין מספיק ZOOZ');
      return;
    }
    
    const newCount = (post.zoozCount || 0) + amount;
    
    // Show flying coins - exact amount, max 25 for animation
    const coinCount = Math.min(amount, 25);
    setZoozCoinCount(coinCount);
    setShowZoozConfetti(true);
    
    // Clear coins after animation completes
    setTimeout(() => {
      setShowZoozConfetti(false);
      setZoozCoinCount(0);
    }, 2000);
    
    // Update balance
    setUserZoozBalance(prev => prev - amount);
    
    // Optimistic update
    setPosts(posts.map(p => 
      p.id === postId ? { ...p, zoozCount: newCount } : p
    ));
    
    try {
      await updatePostEngagement(postId, 'zooz_count', newCount);
      toast.success(`שלחת ${amount} ZOOZ! 💰`);
    } catch (error) {
      console.error('Failed to send ZOOZ:', error);
      setPosts(posts.map(p => 
        p.id === postId ? { ...p, zoozCount: post.zoozCount } : p
      ));
      setUserZoozBalance(prev => prev + amount);
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

  const handleDeletePost = async (post: any) => {
    const confirmed = confirm(
      `האם למחוק את הפוסט?\n\n"${post.caption?.substring(0, 50)}..."\n\nלא ניתן לשחזר!`
    );
    
    if (!confirmed) {
      setOpenMenuPostId(null);
      return;
    }
    
    try {
      console.log('🗑️ Deleting post:', post.id);
      
      const { error } = await supabase
        .from('demo_posts')
        .delete()
        .eq('id', post.id);
      
      if (error) throw error;
      
      setPosts(posts.filter(p => p.id !== post.id));
      toast.success('הפוסט נמחק! 🗑️');
      setOpenMenuPostId(null);
      
      await loadPostsFromDB();
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('מחיקה נכשלה');
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

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffMonths = Math.floor(diffDays / 30);
    
    if (diffMins < 60) return `לפני ${diffMins} דקות`;
    if (diffHours < 24) return `לפני ${diffHours} שעות`;
    if (diffDays < 30) return `לפני ${diffDays} ימים`;
    if (diffMonths < 12) return `לפני ${diffMonths} חודשים`;
    
    // Over 12 months - show exact date
    return past.toLocaleDateString('he-IL', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-screen bg-black overflow-hidden">
      {/* Zooz Flying Coins Animation - Shoots to top-right corner */}
      {showZoozConfetti && zoozCoinCount > 0 && (
        <div className="fixed inset-0 z-[70] pointer-events-none">
          {[...Array(zoozCoinCount)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: '24px',
                bottom: showNav ? '200px' : '146px',
                animation: `zooz-fly-to-corner 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.08}s forwards`,
                ['--random-offset' as any]: `${(Math.random() - 0.5) * 40}px`,
              }}
            >
              <div className="zooz-coin" />
            </div>
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

      {/* Left Side Vertical Controls */}
      {/* FAB - Horizontally aligned with channel logo */}
      <button
        onClick={handleFABClick}
        className="fixed top-4 left-[10px] z-50 w-8 h-8 bg-gradient-to-br from-primary/50 to-primary/40 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
      >
        <Plus className="w-6 h-6 text-white opacity-85" strokeWidth={1.5} />
      </button>

      {/* Mute Button - Moved 25px down */}
      <button
        onClick={toggleMute}
        className="fixed top-[85px] left-4 p-0 z-10"
      >
        {globalMute ? (
          <VolumeX className="w-5 h-5 text-white drop-shadow-lg" />
        ) : (
          <Volume2 className="w-5 h-5 text-white drop-shadow-lg" />
        )}
      </button>

      {/* Top Center - Category and Decisions - Closer gap */}
      <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
        {/* Category Dropdown */}
        <CategoryDropdown
          categories={selectedChannel.categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        
        {/* החלטות Button - Text style, reduced by 2px */}
        <button
          onClick={() => navigate('/decisions')}
          className="flex items-center gap-1 px-2 py-2 text-white font-semibold text-sm transition-opacity hover:opacity-80"
        >
          <span>{decisionsCount > 0 ? `${decisionsCount} ` : ''}</span>
          <span>החלטות</span>
        </button>

        {/* Notification Bell - Same as Impact page */}
        <button
          onClick={() => navigate('/notifications')}
          className="p-2 hover:bg-white/10 rounded-full transition-colors relative"
        >
          <Bell className="w-5 h-5 text-white drop-shadow-lg" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-[1px] right-[17px] min-w-[16px] h-[16px] px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
              {unreadNotifications > 9 ? '9+' : unreadNotifications}
            </span>
          )}
        </button>
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
              onCanPlay={() => {
                setVideoReady(prev => ({ ...prev, [post.id]: true }));
              }}
              onLoadedData={() => {
                setVideoReady(prev => ({ ...prev, [post.id]: true }));
              }}
              onError={(e) => {
                console.error('❌ Video error for:', post.id);
                setVideoReady(prev => ({ ...prev, [post.id]: false }));
              }}
            />
            
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none" />


      {/* Mute Button moved to top with FAB */}

      {/* Three-Dot Menu - Opposite side, aligned horizontally with speaker */}
      {uniquePosts[currentPostIndex]?.user_id === 'demo-user' && (
        <div className="fixed top-[85px] right-4 z-30">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const newState = openMenuPostId === uniquePosts[currentPostIndex]?.id ? null : uniquePosts[currentPostIndex]?.id;
              setOpenMenuPostId(newState);
            }}
            className="p-0"
          >
            <MoreVertical className="w-4 h-4 text-white drop-shadow-lg" />
          </button>
          
          {openMenuPostId === uniquePosts[currentPostIndex]?.id && (
            <div className="absolute top-10 right-0 bg-white rounded-xl shadow-2xl w-[180px]">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('✏️ Edit clicked');
                  
                  const currentPost = uniquePosts[currentPostIndex];
                  setEditingPost(currentPost);
                  setEditCaption(currentPost.caption || '');
                  setEditCategory(currentPost.category);
                  setOpenMenuPostId(null);
                }}
                className="w-full px-4 py-3 text-right flex items-center justify-end gap-3 hover:bg-gray-50 active:bg-gray-100 rounded-t-xl"
              >
                <span className="text-sm font-medium">ערוך</span>
                <Edit2 className="w-4 h-4 text-blue-600" />
              </button>
              
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  const currentPost = uniquePosts[currentPostIndex];
                  console.log('🗑️ Delete button clicked');
                  
                  // Show custom confirmation modal
                  setPostToDelete(currentPost);
                  setShowDeleteConfirm(true);
                  setOpenMenuPostId(null);
                }}
                className="w-full px-4 py-3 text-right flex items-center justify-end gap-3 hover:bg-red-50 active:bg-red-100 border-t rounded-b-xl"
              >
                <span className="text-sm font-medium text-red-600">מחק</span>
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          )}
        </div>
      )}

            {/* Action Buttons - Responsive to nav visibility, moved 30px up and 20px left */}
            <div className={cn(
              "absolute left-0 flex flex-col gap-6 transition-all duration-300",
              showNav ? "bottom-[114px]" : "bottom-[60px]"
            )}>
              {/* Zooz Button - Hold for 3 seconds */}
              <button
                onMouseDown={(e) => {
                  e.stopPropagation();
                  const timer = setTimeout(() => {
                    console.log('⏱️ 2 seconds - opening selector');
                    setCurrentZoozPost(post.id);
                    setShowZoozSelector(true);
                  }, 2000); // 2 seconds
                  setZoozPressTimer(timer);
                }}
                onMouseUp={(e) => {
                  e.stopPropagation();
                  if (zoozPressTimer) {
                    clearTimeout(zoozPressTimer);
                    setZoozPressTimer(null);
                    
                    // If selector not open, send 1 ZOOZ
                    if (!showZoozSelector) {
                      sendZooz(post.id, 1);
                    }
                  }
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  const timer = setTimeout(() => {
                    setCurrentZoozPost(post.id);
                    setShowZoozSelector(true);
                  }, 2000); // 2 seconds
                  setZoozPressTimer(timer);
                }}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  if (zoozPressTimer) {
                    clearTimeout(zoozPressTimer);
                    setZoozPressTimer(null);
                    
                    if (!showZoozSelector) {
                      sendZooz(post.id, 1);
                    }
                  }
                }}
                className="flex flex-col items-center gap-1 min-w-[48px]"
              >
                <div className="relative flex items-center justify-center">
                  <Gift className="w-7 h-7 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' }} />
                  {/* Gold Z coin at top-right, moved 4px up and 4px right */}
                  <div className="absolute -top-[4.5px] -right-[4.5px] w-4 h-4 bg-zooz rounded-full flex items-center justify-center border border-yellow-600">
                    <span className="text-[10px] font-extrabold text-yellow-900">Z</span>
                  </div>
                </div>
                <span 
                  className={cn(
                    "text-white text-xs font-bold drop-shadow-lg whitespace-nowrap min-h-[16px]",
                    isTransitioning ? "label-dissolve-out" : "label-dissolve-in"
                  )}
                >
                  {showTextLabels ? 'ZOOZ' : formatCount(post.zoozCount || 0)}
                </span>
              </button>

              {/* Trust Button - Handshake without crown */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTrust(post.id);
                }}
                className="flex flex-col items-center gap-1 min-w-[48px]"
              >
                <div className="relative flex items-center justify-center">
                  <Handshake className={cn(
                    "w-7 h-7 transition-all duration-200",
                    post.hasUserTrusted ? "text-green-400" : "text-white"
                  )} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' }} />
                </div>
                <span 
                  className={cn(
                    "text-xs font-bold drop-shadow-lg whitespace-nowrap min-h-[16px]",
                    post.hasUserTrusted ? "text-green-400" : "text-white",
                    isTransitioning ? "label-dissolve-out" : "label-dissolve-in"
                  )}
                >
                  {showTextLabels ? 'תן אמון' : formatCount(post.trustCount)}
                </span>
              </button>

              {/* Watch/Bookmark Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWatch(post.id);
                }}
                className="flex flex-col items-center gap-1 min-w-[48px]"
              >
                <div className="relative flex items-center justify-center">
                  <Bookmark className={cn(
                    "w-6 h-6 transition-all duration-200",
                    post.hasUserWatched ? "text-yellow-400 fill-yellow-400" : "text-white"
                  )} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' }} />
                </div>
                <span 
                  className={cn(
                    "text-xs font-bold drop-shadow-lg whitespace-nowrap min-h-[16px]",
                    post.hasUserWatched ? "text-yellow-400" : "text-white",
                    isTransitioning ? "label-dissolve-out" : "label-dissolve-in"
                  )}
                >
                  {showTextLabels ? 'שמור' : formatCount(post.watchCount)}
                </span>
              </button>

              {/* Share Button - Curved Arrow Style */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare(post);
                }}
                className="flex flex-col items-center gap-1 min-w-[48px]"
              >
                <div className="relative flex items-center justify-center">
                  {/* Curved forward arrow - styled to match other icons */}
                  <svg 
                    viewBox="0 0 90 90" 
                    className="w-6 h-6 text-white" 
                    fill="currentColor"
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' }}
                  >
                    <path d="M 89.411 43.577 L 53.66 7.826 c -0.782 -0.782 -2.119 -0.228 -2.119 0.878 v 18.205 C 24.39 26.909 5.901 45.02 0.03 73.894 c -0.262 1.287 1.268 2.236 2.298 1.421 c 16.266 -12.872 31.546 -12.3 49.214 -12.3 v 18.281 c 0 1.106 1.337 1.66 2.119 0.878 l 35.75 -35.75 C 90.196 45.637 90.196 44.363 89.411 43.577 z" />
                  </svg>
                </div>
                <span 
                  className={cn(
                    "text-white text-xs font-bold drop-shadow-lg whitespace-nowrap min-h-[16px]",
                    isTransitioning ? "label-dissolve-out" : "label-dissolve-in"
                  )}
                >
                  {showTextLabels ? 'שיתוף' : formatCount(post.shareCount || 0)}
                </span>
              </button>
            </div>

            {/* Bottom Left - Caption and Info - Responsive to nav, moved 30px up */}
            <div className={cn(
              "absolute right-4 left-20 z-10 transition-all duration-300",
              showNav ? "bottom-[110px]" : "bottom-[60px]"
            )}>
              {/* Profile and Name - Clickable */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const userId = post.user_id || 'demo-user';
                  navigate(`/profile/${userId}`);
                }}
                className="flex items-center gap-3 mb-3"
              >
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
                <div className="text-right">
                  <h3 className="text-white font-bold text-base drop-shadow-lg">
                    {post.username}
                  </h3>
                  <p className="text-white/90 text-sm drop-shadow-lg">
                    {post.expertise}
                  </p>
                </div>
              </button>

              {/* Caption - With edit timestamp if edited */}
              {post.updated_at && post.updated_at !== post.created_at && (
                <p className="text-white/60 text-xs drop-shadow-lg mb-1">
                  נערך {formatTimeAgo(post.updated_at)}
                </p>
              )}
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
          <EmptyCategoryState />
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

      {/* Edit Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black/70 z-[80] flex items-end md:items-center md:justify-center">
          <div className="bg-white rounded-t-3xl md:rounded-2xl w-full md:max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <button
                onClick={() => setEditingPost(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-bold">עריכת פוסט</h2>
              <div className="w-9" />
            </div>
            
            <div className="p-6 space-y-4">
              {/* Video Preview - 9:16 portrait, 25% smaller */}
              <div className="flex justify-center">
                <div className="relative rounded-xl overflow-hidden bg-black w-[150px]" style={{ aspectRatio: '9/16' }}>
                  {editingPost.videoUrl ? (
                    <video 
                      src={editingPost.videoUrl} 
                      controls 
                      playsInline
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <img src={editingPost.imageUrl} className="w-full h-full object-cover" />
                  )}
                </div>
              </div>
              
              {/* Channel Info */}
              <div className="p-4 bg-muted/30 rounded-xl">
                <div className="flex items-center gap-3" dir="rtl">
                  <img 
                    src={selectedChannel.logo_url} 
                    className="w-10 h-10 rounded-lg object-contain"
                  />
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-0.5">מתפרסם בערוץ</p>
                    <p className="font-bold text-sm">{selectedChannel.name}</p>
                  </div>
                </div>
              </div>
              
              {/* Also Post to Coali - Only if not in Coali */}
              {selectedChannel.id !== null && (
                <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <label className="flex items-start gap-3 cursor-pointer" dir="rtl">
                    <input
                      type="checkbox"
                      checked={alsoPostToCoali}
                      onChange={(e) => setAlsoPostToCoali(e.target.checked)}
                      className="w-6 h-6 rounded accent-primary mt-1 flex-shrink-0"
                    />
                    <div className="text-right flex-1">
                      <p className="text-sm font-bold text-orange-900">
                        פרסם גם בערוץ Coali הראשי
                      </p>
                    </div>
                  </label>
                </div>
              )}
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">כיתוב</label>
                  <span className="text-xs text-muted-foreground">{editCaption.length}/400</span>
                </div>
                <textarea
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg"
                  rows={4}
                  maxLength={400}
                  dir="rtl"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">קטגוריה</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg"
                  dir="rtl"
                >
                  {selectedChannel.categories.filter(c => c !== 'הכל').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={async () => {
                  try {
                    const { error } = await supabase
                      .from('demo_posts')
                      .update({ 
                        caption: editCaption, 
                        category: editCategory,
                        updated_at: new Date().toISOString()
                      })
                      .eq('id', editingPost.id);
                    
                    if (error) throw error;
                    
                    toast.success('הפוסט עודכן!');
                    setEditingPost(null);
                    await loadPostsFromDB();
                  } catch (err) {
                    console.error(err);
                    toast.error('עדכון נכשל');
                  }
                }}
                className="w-full py-4 bg-primary text-white rounded-lg font-bold"
              >
                שמור
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && postToDelete && (
        <div className="fixed inset-0 bg-black/70 z-[80] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
            <h3 className="text-xl font-bold text-center mb-4">מחיקת פוסט</h3>
            <p className="text-center text-gray-600 mb-2">האם למחוק את הפוסט?</p>
            <p className="text-center text-sm text-gray-500 mb-6 line-clamp-2">
              "{postToDelete.caption}"
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setPostToDelete(null);
                }}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
              >
                ביטול
              </button>
              <button
                onClick={async () => {
                  try {
                    console.log('🗑️ Deleting:', postToDelete.id);
                    
                    const { error } = await supabase
                      .from('demo_posts')
                      .delete()
                      .eq('id', postToDelete.id);
                    
                    if (error) throw error;
                    
                    toast.success('הפוסט נמחק!');
                    setShowDeleteConfirm(false);
                    setPostToDelete(null);
                    await loadPostsFromDB();
                  } catch (err) {
                    console.error(err);
                    toast.error('מחיקה נכשלה');
                  }
                }}
                className="flex-1 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
              >
                מחק
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ZOOZ Amount Selector */}
      {showZoozSelector && currentZoozPost && (
        <div className="fixed inset-0 bg-black/70 z-[80] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <h3 className="text-xl font-bold text-center mb-4">שלח ZOOZ</h3>
            
            <div className="mb-6">
              <p className="text-sm text-muted-foreground text-center mb-2">
                היתרה שלך: {userZoozBalance}Z
              </p>
              
              <div className="flex items-center justify-center gap-4 mb-4">
                <button
                  onClick={() => setSelectedZoozAmount(Math.max(1, selectedZoozAmount - 1))}
                  className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-2xl"
                >
                  -
                </button>
                
                <div className="text-center">
                  <p className="text-5xl font-bold text-zooz">{selectedZoozAmount}</p>
                  <p className="text-sm text-muted-foreground">ZOOZ</p>
                </div>
                
                <button
                  onClick={() => setSelectedZoozAmount(Math.min(userZoozBalance, selectedZoozAmount + 1))}
                  className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-2xl"
                >
                  +
                </button>
              </div>
              
              <input
                type="range"
                min="1"
                max={userZoozBalance}
                value={selectedZoozAmount}
                onChange={(e) => setSelectedZoozAmount(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowZoozSelector(false);
                  setSelectedZoozAmount(1);
                  setCurrentZoozPost(null);
                }}
                className="flex-1 py-3 bg-gray-100 rounded-lg font-medium"
              >
                ביטול
              </button>
              <button
                onClick={() => {
                  sendZooz(currentZoozPost, selectedZoozAmount);
                  setShowZoozSelector(false);
                  setSelectedZoozAmount(1);
                  setCurrentZoozPost(null);
                }}
                className="flex-1 py-3 bg-primary text-white rounded-lg font-medium"
              >
                שלח {selectedZoozAmount}Z
              </button>
            </div>
          </div>
        </div>
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
                accept="video/*"
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
                {/* Video/Image Preview - 9:16 portrait, smaller */}
                <div className="flex justify-center">
                  <div className="relative bg-muted rounded-lg overflow-hidden w-[150px]" style={{ aspectRatio: '9/16' }}>
                    {selectedVideo.type.startsWith('video/') ? (
                      <video
                        src={URL.createObjectURL(selectedVideo)}
                        controls
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={URL.createObjectURL(selectedVideo)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>

                {/* Channel Info */}
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <div className="flex items-center gap-3" dir="rtl">
                    <img 
                      src={selectedChannel.logo_url} 
                      className="w-10 h-10 rounded-lg object-contain"
                    />
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-0.5">מתפרסם לערוץ</p>
                      <p className="font-bold text-sm text-primary">{selectedChannel.name}</p>
                    </div>
                  </div>
                </div>

                {/* Caption */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">כיתוב</label>
                    <span className="text-xs text-muted-foreground">{caption.length}/400</span>
                  </div>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="הוסף כיתוב..."
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background min-h-[100px] resize-none"
                    maxLength={400}
                    dir="rtl"
                  />
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
                    <label className="flex items-center gap-3 cursor-pointer" dir="rtl">
                      <input
                        type="checkbox"
                        checked={alsoPostToCoali}
                        onChange={(e) => setAlsoPostToCoali(e.target.checked)}
                        className="w-5 h-5 rounded flex-shrink-0"
                      />
                      <div className="text-right">
                        <p className="text-sm font-medium">פרסם גם בערוץ Coali הראשי</p>
                      </div>
                    </label>
                  </div>
                )}

                {/* Submit Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleUploadSubmit}
                    disabled={!uploadCategory || caption.trim().length === 0 || isUploading}
                    className="flex-1 py-4 bg-primary text-primary-foreground rounded-lg font-bold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                
                {/* Save as Draft Button */}
                <button
                  onClick={async () => {
                    if (!caption.trim()) {
                      toast.error('נא להזין תיאור');
                      return;
                    }
                    
                    try {
                      setIsUploading(true);
                      
                      // Save as draft (status = 'draft')
                      await saveDemoPost({
                        caption: caption,
                        category: uploadCategory,
                        videoUrl: uploadedVideoUrl,
                        status: 'draft'
                      });
                      
                      toast.success('נשמר כטיוטה! 📝');
                      setShowVideoModal(false);
                      setCaption('');
                      setUploadCategory('כללי');
                      setUploadedVideoUrl('');
                      setRecordedVideoUrl('');
                    } catch (error) {
                      console.error('Error saving draft:', error);
                      toast.error('שגיאה בשמירת הטיוטה');
                    } finally {
                      setIsUploading(false);
                    }
                  }}
                  disabled={isUploading || !caption.trim()}
                  className="flex-1 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  שמור כטיוטה
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
