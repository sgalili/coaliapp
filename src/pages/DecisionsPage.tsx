import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { PollStoryCard } from "@/components/PollStoryCard";
import { StoriesProgressBar } from "@/components/StoriesProgressBar";
import { VoteHeader } from "@/components/VoteHeader";
import { VoteFilters, VoteFilterType } from "@/components/VoteFilters";
import { VideoFeedPage } from "@/components/VideoFeedPage";
import { Button } from "@/components/ui/button";
import { mockPollStories } from "@/data/mockPollStories";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";

const DecisionsPage = () => {
  const { cardId } = useParams();
  const navigate = useNavigate();
  const [currentStoryIndex, setCurrentStoryIndex] = useState(() => {
    const index = cardId ? parseInt(cardId) - 1 : 0;
    return index >= 0 && index < mockPollStories.length ? index : 0;
  });
  const [isMuted, setIsMuted] = useState(true);
  const [isReadingText, setIsReadingText] = useState(false);
  const [votedStories, setVotedStories] = useState<Record<string, string>>({});
  const [voteFilter, setVoteFilter] = useState<VoteFilterType>('for-me');
  const [zoozBalance, setZoozBalance] = useState(1250);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const { toast } = useToast();


  const handleNextStory = () => {
    if (currentStoryIndex < mockPollStories.length - 1) {
      const newIndex = currentStoryIndex + 1;
      setCurrentStoryIndex(newIndex);
      navigate(`/decisions/${newIndex + 1}`, { replace: true });
    } else {
      // End of stories - show completion message
      toast({
        title: "סיימת את כל ההצבעות! 🎉",
        description: "כל כבוד! סיימת את כל ההצבעות הזמינות.",
      });
    }
  };

  const handlePreviousStory = () => {
    if (currentStoryIndex > 0) {
      const newIndex = currentStoryIndex - 1;
      setCurrentStoryIndex(newIndex);
      navigate(`/decisions/${newIndex + 1}`, { replace: true });
    }
  };

  const handleVote = (storyId: string, optionId: string) => {
    console.log("Voted:", { storyId, optionId });
    
    // Update local state to track this vote
    setVotedStories(prev => ({
      ...prev,
      [storyId]: optionId
    }));
  };

  const handleToggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    // If muting, immediately stop any ongoing speech synthesis
    if (newMutedState && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsReadingText(false);
    }
  };

  // Filter navigation with animation
  const handleFilterChange = (newFilter: VoteFilterType) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setVoteFilter(newFilter);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Video feed handlers
  const handleTrust = (postId: string) => {
    toast({
      title: "Trust Given! ❤️",
      description: "Your trust helps build a better network.",
    });
  };

  const handleWatch = (postId: string) => {
    toast({
      title: "Now Watching 👁️", 
      description: "You'll see their content more often.",
    });
  };

  const handleZooz = (postId: string) => {
    if (zoozBalance < 1) {
      toast({
        title: "Insufficient ZOOZ",
        description: "You don't have enough ZOOZ to support this creator.",
      });
      return;
    }
    setZoozBalance(prev => prev - 1);
    toast({
      title: "ZOOZ Sent! 🚀",
      description: "Supporting amazing creators!",
    });
  };

  const handleVolumeToggle = () => {
    setIsMuted(!isMuted);
  };


  const constructIntelligentText = (story: any) => {
    let text = `השאלה היא: ${story.question}. `;
    text += `${story.description}. `;
    
    // Add options based on poll type
    if (story.pollType === "simple") {
      // For simple polls (usually 2 options)
      const option1 = story.options[0]?.text || "";
      const option2 = story.options[1]?.text || "";
      text += `האפשרויות הן: ${option1} או ${option2}.`;
    } else if (story.pollType === "expert") {
      // For expert/candidate polls
      text += "המועמדים הם: ";
      story.options.forEach((option: any, index: number) => {
        if (index === story.options.length - 1) {
          text += `ו${option.text}.`;
        } else if (index === story.options.length - 2) {
          text += `${option.text} `;
        } else {
          text += `${option.text}, `;
        }
      });
    } else {
      // For multiple choice polls
      text += "האפשרויות כוללות: ";
      story.options.forEach((option: any, index: number) => {
        if (index === 0) {
          text += `${option.text}`;
        } else if (index === story.options.length - 1) {
          text += ` ו${option.text}.`;
        } else {
          text += `, ${option.text}`;
        }
      });
    }
    
    return text;
  };

  const readPollText = async (story: any) => {
    try {
      setIsReadingText(true);
      
      if ('speechSynthesis' in window) {
        // Stop any ongoing speech
        window.speechSynthesis.cancel();
        
        const intelligentText = constructIntelligentText(story);
        const utterance = new SpeechSynthesisUtterance(intelligentText);
        utterance.lang = 'he-IL';
        utterance.rate = 0.8; // Slightly slower for better comprehension
        utterance.pitch = 1.1; // Slightly higher pitch for more professional tone
        
        utterance.onend = () => setIsReadingText(false);
        utterance.onerror = () => setIsReadingText(false);
        
        window.speechSynthesis.speak(utterance);
      } else {
        console.log('Speech synthesis not supported');
        setIsReadingText(false);
      }
    } catch (error) {
      console.error('Error reading text:', error);
      setIsReadingText(false);
    }
  };

  // Auto-read poll text when story changes
  useEffect(() => {
    if (!isMuted && currentStoryIndex < mockPollStories.length) {
      const currentStory = mockPollStories[currentStoryIndex];
      readPollText(currentStory);
    }
  }, [currentStoryIndex, isMuted]);

  const currentStory = mockPollStories[currentStoryIndex];

  return (
    <div className="min-h-screen bg-background relative">
      {/* Vote Header - only show for 'for-me' filter */}
      {voteFilter === 'for-me' && <VoteHeader />}
      
      {/* Vote Filters */}
      <VoteFilters 
        activeFilter={voteFilter}
        onFilterChange={handleFilterChange}
      />
      
      {/* Animated content container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={voteFilter}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.3 
          }}
          className="min-h-screen"
        >
          {/* Route between Poll Stories and VideoFeedPage based on filter */}
          {voteFilter === 'for-me' ? (
            <div className="relative h-screen overflow-hidden">
              {/* Stories Progress Bar */}
              <StoriesProgressBar 
                totalStories={mockPollStories.length}
                currentStoryIndex={currentStoryIndex}
              />

              {/* Add Poll Button */}
              <Button
                size="icon"
                className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm"
                onClick={() => toast({
                  title: "פתיחת יוצר הצבעות...",
                  description: "בקרוב תוכלו ליצור הצבעות חדשות!",
                })}
              >
                <Plus className="w-5 h-5" />
              </Button>

              {/* Stories Container with Global Tap Handler */}
              <div 
                className="h-screen overflow-auto relative cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const containerWidth = rect.width;
                  
                  // In RTL: right 40% is for previous, left 60% is for next
                  if (clickX > containerWidth * 0.6) {
                    handlePreviousStory();
                  } else {
                    handleNextStory();
                  }
                }}
              >
                <PollStoryCard
                  story={{
                    ...currentStory,
                    hasUserVoted: !!votedStories[currentStory.id],
                    userVotedOption: votedStories[currentStory.id]
                  }}
                  onVote={handleVote}
                  onNext={handleNextStory}
                  isMuted={isMuted}
                  onToggleMute={handleToggleMute}
                  isActive={true}
                />
              </div>
            </div>
          ) : (
            <VideoFeedPage
              activeFilter={voteFilter}
              onFilterChange={handleFilterChange}
              onTrust={handleTrust}
              onWatch={handleWatch}
              onZooz={handleZooz}
              userBalance={zoozBalance}
              isMuted={isMuted}
              onVolumeToggle={handleVolumeToggle}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Bottom navigation */}
      <Navigation zoozBalance={zoozBalance} />
    </div>
  );
};

export default DecisionsPage;