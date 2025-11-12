import { ArrowUp, Users, Vote, Award, Target, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImpactComment {
  id: string;
  userId: string;
  username: string;
  userImage: string;
  videoUrl?: string;
  duration?: number;
  likes: number;
  replies: number;
  trustLevel: number;
  timestamp: string;
  category: string;
  kycLevel: 1 | 2 | 3;
}

interface ImpactItemProps {
  item: {
    id: string;
    type: 'decision' | 'trust' | 'vote' | 'achievement';
    title: string;
    description: string;
    thumbnail?: string;
    publishedAt: string;
    category: string;
    source: string;
    impactValue: number;
    delegatedVotes?: number;
    totalVotes?: number;
    outcome?: string;
    comments: ImpactComment[];
  };
  onImpactClick: (impactId: string) => void;
  onProfileClick: (impactId: string, comment: ImpactComment) => void;
}

const getImpactIcon = (type: string) => {
  switch (type) {
    case 'decision':
      return <Vote className="w-4 h-4" />;
    case 'trust':
      return <Users className="w-4 h-4" />;
    case 'vote':
      return <Target className="w-4 h-4" />;
    case 'achievement':
      return <Award className="w-4 h-4" />;
    default:
      return <ArrowUp className="w-4 h-4" />;
  }
};

const getImpactColor = (type: string) => {
  switch (type) {
    case 'decision':
      return 'bg-blue-50 text-blue-600 border-blue-200';
    case 'trust':
      return 'bg-green-50 text-green-600 border-green-200';
    case 'vote':
      return 'bg-purple-50 text-purple-600 border-purple-200';
    case 'achievement':
      return 'bg-yellow-50 text-yellow-600 border-yellow-200';
    default:
      return 'bg-gray-50 text-gray-600 border-gray-200';
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

export const ImpactItemComponent = ({ item, onImpactClick, onProfileClick }: ImpactItemProps) => {
  const hasComments = item.comments && item.comments.length > 0;
  
  return (
    <div className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden border border-gray-100">
      {/* Impact Header */}
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => onImpactClick(item.id)}
      >
        <div className="flex items-start gap-3 mb-3">
          {/* Impact Type Badge */}
          <div className={cn(
            "flex items-center justify-center p-3 rounded-xl border",
            getImpactColor(item.type)
          )}>
            {getImpactIcon(item.type)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-gray-500">{item.category}</span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500">{formatTimeAgo(item.publishedAt)}</span>
            </div>
            
            <h3 className="font-bold text-base mb-2 leading-snug line-clamp-2">
              {item.title}
            </h3>
            
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
              {item.description}
            </p>
          </div>

          {/* Impact Score */}
          <div className="flex flex-col items-center bg-green-50 px-3 py-2 rounded-xl border border-green-100">
            <ArrowUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-bold text-green-600">
              {item.impactValue}
            </span>
          </div>
        </div>

        {/* Stats */}
        {(item.delegatedVotes || item.totalVotes || item.outcome) && (
          <div className="flex items-center gap-4 text-xs text-gray-500 mt-3 pt-3 border-t">
            {item.delegatedVotes && (
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>{item.delegatedVotes} קולות</span>
              </div>
            )}
            {item.totalVotes && (
              <div className="flex items-center gap-1">
                <Vote className="w-3.5 h-3.5" />
                <span>{item.totalVotes} סה"כ</span>
              </div>
            )}
            {item.outcome && (
              <div className="flex items-center gap-1 mr-auto">
                <Award className="w-3.5 h-3.5 text-green-600" />
                <span className="text-green-700 font-medium">{item.outcome}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Expert Comments Section */}
      {hasComments && (
        <div className="border-t border-gray-100">
          <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                תגובות מומחים ({item.comments.length})
              </span>
            </div>
          </div>

          {/* Expert Avatars Row */}
          <div className="px-4 py-3 flex items-center gap-3 overflow-x-auto scrollbar-hide">
            {item.comments.slice(0, 8).map((comment) => (
              <div
                key={comment.id}
                className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onProfileClick(item.id, comment);
                }}
              >
                <div className="relative">
                  <img
                    src={comment.userImage}
                    alt={comment.username}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  {/* KYC Level Indicator */}
                  {comment.kycLevel >= 2 && (
                    <div className={cn(
                      "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold",
                      comment.kycLevel === 3 ? "bg-blue-500 text-white" : "bg-green-500 text-white"
                    )}>
                      ✓
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {item.comments.length > 8 && (
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                +{item.comments.length - 8}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
