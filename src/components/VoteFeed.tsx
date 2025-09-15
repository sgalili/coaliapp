import { useState, useEffect } from "react";
import { Plus, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { PollStoryCard } from "./PollStoryCard";
import { StoriesProgressBar } from "./StoriesProgressBar";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { mockPollStories } from "@/data/mockPollStories";

export type VoteFilterType = 'for-me' | 'candidates' | 'experts' | 'all';

interface VoteFeedProps {
  filter: VoteFilterType;
}

export const VoteFeed = ({ filter }: VoteFeedProps) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isReadingText, setIsReadingText] = useState(false);
  const [votedStories, setVotedStories] = useState<Record<string, string>>({});
  
  const { toast } = useToast();


  const handleNextStory = () => {
    if (currentStoryIndex < mockPollStories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
    } else {
      toast({
        title: "סיימת את כל ההצבעות! 🎉",
        description: "כל כבוד! סיימת את כל ההצבעות הזמינות.",
      });
    }
  };

  const handlePreviousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
    }
  };

  const handleVote = (storyId: string, optionId: string) => {
    console.log("Voted:", { storyId, optionId });
    setVotedStories(prev => ({
      ...prev,
      [storyId]: optionId
    }));
  };

  const handleToggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    if (newMutedState && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsReadingText(false);
    }
  };

  const constructIntelligentText = (story: any) => {
    let text = `השאלה היא: ${story.question}. `;
    text += `${story.description}. `;
    
    if (story.pollType === "simple") {
      const option1 = story.options[0]?.text || "";
      const option2 = story.options[1]?.text || "";
      text += `האפשרויות הן: ${option1} או ${option2}.`;
    } else if (story.pollType === "expert") {
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
        window.speechSynthesis.cancel();
        
        const intelligentText = constructIntelligentText(story);
        const utterance = new SpeechSynthesisUtterance(intelligentText);
        utterance.lang = 'he-IL';
        utterance.rate = 0.8;
        utterance.pitch = 1.1;
        
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

  useEffect(() => {
    if (!isMuted && currentStoryIndex < mockPollStories.length) {
      const currentStory = mockPollStories[currentStoryIndex];
      readPollText(currentStory);
    }
  }, [currentStoryIndex, isMuted]);

  // Only handle 'for-me' filter in VoteFeed
  if (filter !== 'for-me') {
    return null;
  }

  const currentStory = mockPollStories[currentStoryIndex];

  if (!currentStory) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary/80">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">סיימת את כל ההצבעות!</h2>
          <Button 
            onClick={() => setCurrentStoryIndex(0)}
            className="bg-white text-primary hover:bg-white/90"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            התחל מחדש
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Stories Progress Bar */}
      <StoriesProgressBar 
        totalStories={mockPollStories.length}
        currentStoryIndex={currentStoryIndex}
      />

      {/* Add Poll Button */}
      <Button
        size="icon"
        className="fixed top-4 left-4 z-50 w-10 h-10 rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm"
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
  );
};