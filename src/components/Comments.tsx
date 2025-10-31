import { useState, useRef, useEffect } from "react";
import { X, Send, Heart, MessageCircle, MoreVertical, Flag, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Comment {
  id: string;
  username: string;
  profileImage: string;
  text: string;
  timestamp: string;
  likes: number;
  hasUserLiked: boolean;
  replies: Comment[];
  isVerified?: boolean;
}

interface CommentsProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
  commentCount: number;
}

// Sample comments data
const sampleComments: Comment[] = [
  {
    id: "c1",
    username: "דוד כהן",
    profileImage: "https://i.pravatar.cc/150?img=1",
    text: "תוכן מעולה! ממש עזר לי להבין את הנושא",
    timestamp: "לפני 2 שעות",
    likes: 24,
    hasUserLiked: false,
    isVerified: true,
    replies: [
      {
        id: "c1r1",
        username: "שרה לוי",
        profileImage: "https://i.pravatar.cc/150?img=2",
        text: "גם לי! מסכימה איתך לגמרי",
        timestamp: "לפני שעה",
        likes: 5,
        hasUserLiked: false,
        replies: [],
      },
    ],
  },
  {
    id: "c2",
    username: "יוסי אברהם",
    profileImage: "https://i.pravatar.cc/150?img=3",
    text: "יש לי שאלה - איך זה משפיע על המצב הכלכלי?",
    timestamp: "לפני 3 שעות",
    likes: 12,
    hasUserLiked: false,
    replies: [],
  },
  {
    id: "c3",
    username: "מיכל רוזנברג",
    profileImage: "https://i.pravatar.cc/150?img=4",
    text: "תודה על השיתוף! 🙏",
    timestamp: "לפני 5 שעות",
    likes: 8,
    hasUserLiked: true,
    isVerified: true,
    replies: [],
  },
];

export function Comments({ postId, isOpen, onClose, commentCount }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>(sampleComments);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [showOptionsFor, setShowOptionsFor] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const newCommentObj: Comment = {
      id: `c${Date.now()}`,
      username: "אתה",
      profileImage: "https://i.pravatar.cc/150?img=10",
      text: newComment,
      timestamp: "עכשיו",
      likes: 0,
      hasUserLiked: false,
      replies: [],
    };

    if (replyingTo) {
      // Add as reply
      setComments(comments.map(comment => {
        if (comment.id === replyingTo) {
          return {
            ...comment,
            replies: [...comment.replies, newCommentObj],
          };
        }
        return comment;
      }));
      setReplyingTo(null);
    } else {
      // Add as top-level comment
      setComments([newCommentObj, ...comments]);
    }

    setNewComment("");
    
    // Scroll to bottom after adding comment
    setTimeout(() => {
      commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const toggleLike = (commentId: string, isReply: boolean = false, parentId?: string) => {
    if (isReply && parentId) {
      setComments(comments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.map(reply => {
              if (reply.id === commentId) {
                return {
                  ...reply,
                  hasUserLiked: !reply.hasUserLiked,
                  likes: reply.hasUserLiked ? reply.likes - 1 : reply.likes + 1,
                };
              }
              return reply;
            }),
          };
        }
        return comment;
      }));
    } else {
      setComments(comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            hasUserLiked: !comment.hasUserLiked,
            likes: comment.hasUserLiked ? comment.likes - 1 : comment.likes + 1,
          };
        }
        return comment;
      }));
    }
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter(c => c.id !== commentId));
    setShowOptionsFor(null);
  };

  const renderComment = (comment: Comment, isReply: boolean = false, parentId?: string) => (
    <div key={comment.id} className={cn("flex gap-3", isReply && "mr-12 mt-3")}>
      <img
        src={comment.profileImage}
        alt={comment.username}
        className="w-8 h-8 rounded-full flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="bg-gray-100 rounded-2xl px-4 py-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">{comment.username}</span>
            {comment.isVerified && (
              <div className="w-3.5 h-3.5 bg-trust rounded-full flex items-center justify-center">
                <span className="text-white text-[8px]">✓</span>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-800 break-words">{comment.text}</p>
        </div>
        
        <div className="flex items-center gap-4 mt-1 px-2">
          <span className="text-xs text-gray-500">{comment.timestamp}</span>
          <button
            onClick={() => toggleLike(comment.id, isReply, parentId)}
            className="text-xs text-gray-600 hover:text-trust font-medium"
          >
            {comment.hasUserLiked ? "אהבתי" : "אהוב"}
          </button>
          {comment.likes > 0 && (
            <span className="text-xs text-gray-600">{comment.likes} לייקים</span>
          )}
          {!isReply && (
            <button
              onClick={() => setReplyingTo(comment.id)}
              className="text-xs text-gray-600 hover:text-primary font-medium"
            >
              השב
            </button>
          )}
          
          {/* Options menu */}
          <div className="relative mr-auto">
            <button
              onClick={() => setShowOptionsFor(showOptionsFor === comment.id ? null : comment.id)}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <MoreVertical className="w-3.5 h-3.5 text-gray-500" />
            </button>
            
            {showOptionsFor === comment.id && (
              <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-[120px]">
                <button
                  onClick={() => {
                    // Report functionality
                    setShowOptionsFor(null);
                  }}
                  className="w-full px-4 py-2 text-right text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  <Flag className="w-4 h-4" />
                  דווח
                </button>
                {comment.username === "אתה" && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="w-full px-4 py-2 text-right text-sm hover:bg-gray-100 flex items-center gap-2 text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                    מחק
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Replies */}
        {comment.replies.length > 0 && (
          <div className="mt-2">
            {comment.replies.map(reply => renderComment(reply, true, comment.id))}
          </div>
        )}
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <div className="bg-white w-full max-w-2xl h-[85vh] rounded-t-3xl flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold">תגובות ({commentCount})</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <MessageCircle className="w-12 h-12 mb-2" />
              <p>אין תגובות עדיין</p>
              <p className="text-sm">היה הראשון להגיב!</p>
            </div>
          ) : (
            comments.map(comment => renderComment(comment))
          )}
          <div ref={commentsEndRef} />
        </div>

        {/* Reply indicator */}
        {replyingTo && (
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              משיב ל-{comments.find(c => c.id === replyingTo)?.username}
            </span>
            <button
              onClick={() => setReplyingTo(null)}
              className="text-sm text-primary font-medium"
            >
              ביטול
            </button>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/150?img=10"
              alt="You"
              className="w-8 h-8 rounded-full flex-shrink-0"
            />
            <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
              <input
                ref={inputRef}
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubmitComment()}
                placeholder={replyingTo ? "כתוב תשובה..." : "הוסף תגובה..."}
                className="flex-1 bg-transparent outline-none text-sm"
              />
              <button
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
                className={cn(
                  "p-1.5 rounded-full transition-colors",
                  newComment.trim()
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                )}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
