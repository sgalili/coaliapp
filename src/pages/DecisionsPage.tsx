import { useState, useEffect, useRef } from "react";
import { Plus, RotateCcw } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { PollStoryCard } from "@/components/PollStoryCard";
import { StoriesProgressBar } from "@/components/StoriesProgressBar";
import { Button } from "@/components/ui/button";
import { mockPollStories } from "@/data/mockPollStories";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const DecisionsPage = () => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isReadingText, setIsReadingText] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout>();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-progress story
  useEffect(() => {
    if (currentStoryIndex >= mockPollStories.length || isPaused) return;
    
    const currentStory = mockPollStories[currentStoryIndex];
    if (currentStory.hasUserVoted) {
      // Skip already voted stories faster
      progressIntervalRef.current = setInterval(() => {
        setStoryProgress(prev => {
          if (prev >= 100) {
            handleNextStory();
            return 0;
          }
          return prev + 2; // Faster progression for voted stories
        });
      }, 50);
    } else {
      // Normal progression for new stories
      progressIntervalRef.current = setInterval(() => {
        setStoryProgress(prev => {
          if (prev >= 100) {
            handleNextStory();
            return 0;
          }
          return prev + 0.5; // Slower progression to allow reading and voting
        });
      }, 100);
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [currentStoryIndex, isPaused]);

  const handleNextStory = () => {
    if (currentStoryIndex < mockPollStories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setStoryProgress(0);
    } else {
      // End of stories - show completion message
      toast.success("סיימת את כל ההצבעות! 🎉", {
        position: "bottom-center",
        duration: 3000
      });
    }
  };

  const handlePreviousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setStoryProgress(0);
    }
  };

  const handleVote = (storyId: string, optionId: string) => {
    // Here you would normally update the backend
    console.log("Voted:", { storyId, optionId });
    
    // Update local state to show results
    const updatedStories = mockPollStories.map(story => 
      story.id === storyId 
        ? { ...story, hasUserVoted: true, userVotedOption: optionId }
        : story
    );
    
    // Reset progress to show results
    setStoryProgress(0);
  };

  // Swipe and navigation logic - same as FullscreenVideoPlayer
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Fixed direction logic: scroll down → next, scroll up → previous
      if (e.deltaY > 0 && currentStoryIndex < mockPollStories.length - 1) {
        // Scroll down → next story
        handleNextStory();
      } else if (e.deltaY < 0 && currentStoryIndex > 0) {
        // Scroll up → previous story
        handlePreviousStory();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' && currentStoryIndex < mockPollStories.length - 1) {
        handleNextStory();
      } else if (e.key === 'ArrowUp' && currentStoryIndex > 0) {
        handlePreviousStory();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const startY = e.touches[0].clientY;
      const startX = e.touches[0].clientX;
      
    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = startY - e.touches[0].clientY;
      const deltaX = e.touches[0].clientX - startX;
      
      if (Math.abs(deltaY) > 50 && Math.abs(deltaY) > Math.abs(deltaX)) { 
        e.preventDefault();
        // Vertical swipe (story navigation) - Fixed direction logic
        if (deltaY < 0 && currentStoryIndex < mockPollStories.length - 1) {
          // Swipe down (deltaY < 0) → next story
          handleNextStory();
        } else if (deltaY > 0 && currentStoryIndex > 0) {
          // Swipe up (deltaY > 0) → previous story
          handlePreviousStory();
        }
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      }
    };
      
      const handleTouchEnd = () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
      
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      container.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [currentStoryIndex, mockPollStories.length]);

  const readPollText = async (text: string) => {
    try {
      setIsReadingText(true);
      
      // Utiliser Web Speech API au lieu de l'API OpenAI qui a atteint sa limite
      if ('speechSynthesis' in window) {
        // Arrêter toute lecture en cours
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'he-IL'; // Hébreu
        utterance.rate = 0.9;
        utterance.pitch = 1;
        
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
      const textToRead = `${currentStory.question}. ${currentStory.description}`;
      readPollText(textToRead);
    }
  }, [currentStoryIndex, isMuted]);

  const currentStory = mockPollStories[currentStoryIndex];

  if (!currentStory) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary/80">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">סיימת את כל ההצבעות!</h2>
          <Button 
            onClick={() => {
              setCurrentStoryIndex(0);
              setStoryProgress(0);
            }}
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
        currentProgress={storyProgress}
      />

      {/* Add Poll Button */}
      <Button
        size="icon"
        className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm"
        onClick={() => toast.info("פתיחת יוצר הצבעות...", { position: "bottom-center" })}
      >
        <Plus className="w-5 h-5" />
      </Button>

      {/* Stories Container */}
      <div 
        ref={containerRef}
        className="h-screen overflow-hidden touch-none cursor-pointer select-none"
        onClick={() => setIsPaused(!isPaused)}
      >
        <PollStoryCard
          story={currentStory}
          onVote={handleVote}
          onNext={handleNextStory}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(!isMuted)}
          isActive={true}
        />
      </div>

      {/* Bottom navigation */}
      <Navigation />
    </div>
  );
};

export default DecisionsPage;