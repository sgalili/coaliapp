import { useState, useEffect } from "react";
import { Plus, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { PollStoryCard } from "./PollStoryCard";
import { StoriesProgressBar } from "./StoriesProgressBar";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

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

  // Mock poll stories data
  const mockPollStories = [
    {
      id: "1",
      question: "האם לאפשר בנייה בגובה של 40 קומות?",
      description: "הצעה לשינוי תב״ע שתאפשר בנייה בגובה של עד 40 קומות במרכז העיר",
      backgroundImage: "https://images.unsplash.com/photo-1486718448742-163732cd1544?ixlib=rb-4.0.3",
      options: [
        { id: "1a", text: "בעד", votes: 245, percentage: 45 },
        { id: "1b", text: "נגד", votes: 301, percentage: 55 }
      ],
      totalVotes: 546,
      category: "עיר",
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      pollType: "simple" as const,
      organizationType: "city" as const,
      organizationName: "עיריית תל אביב",
      aiNarration: "שאלה מרכזית על עתיד הפיתוח העירוני",
      hasUserVoted: false
    },
    {
      id: "2", 
      question: "מי יהיה ראש העיר הבא?",
      description: "בחירות לראשות העיר תל אביב 2024",
      backgroundImage: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3",
      options: [
        { id: "2a", text: "רון חולדאי", votes: 1205, percentage: 35 },
        { id: "2b", text: "אסף זמיר", votes: 890, percentage: 26 }, 
        { id: "2c", text: "אורי בר-לב", votes: 672, percentage: 19 },
        { id: "2d", text: "אחר", votes: 689, percentage: 20 }
      ],
      totalVotes: 3456,
      category: "בחירות",
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      pollType: "expert" as const,
      organizationType: "city" as const,
      organizationName: "עיריית תל אביב",
      aiNarration: "הבחירות הקרובות לראשות העיר",
      hasUserVoted: false
    },
    {
      id: "3",
      question: "איך לפתור את בעיית התחבורה הציבורית?",
      description: "איזה פתרון תחבורתי יעיל הכי חשוב לעיר?",
      backgroundImage: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3",
      options: [
        { id: "3a", text: "רכבת קלה נוספת", votes: 892, percentage: 40 },
        { id: "3b", text: "רשת אוטובוסים מורחבת", votes: 534, percentage: 24 },
        { id: "3c", text: "עידוד אופניים חשמליים", votes: 445, percentage: 20 },
        { id: "3d", text: "הגבלות על רכבים פרטיים", votes: 357, percentage: 16 }
      ],
      totalVotes: 2228,
      category: "תחבורה",
      endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      pollType: "multiple" as const,
      organizationType: "country" as const,
      organizationName: "משרד התחבורה",
      aiNarration: "פתרונות חדשניים לבעיות התחבורה",
      hasUserVoted: false
    }
  ];

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
  );
};