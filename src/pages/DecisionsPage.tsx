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
  const [touchStart, setTouchStart] = useState<{ y: number; time: number } | null>(null);
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

  const handleTouchStart = (event: React.TouchEvent) => {
    event.preventDefault();
    setTouchStart({
      y: event.touches[0].clientY,
      time: Date.now()
    });
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    setTouchStart({
      y: event.clientY,
      time: Date.now()
    });
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    event.preventDefault(); // Prevent native scrolling
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!touchStart) return;
    event.preventDefault();
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (!touchStart) return;
    
    const endY = event.changedTouches[0].clientY;
    const endTime = Date.now();
    
    const deltaY = touchStart.y - endY;
    const deltaTime = endTime - touchStart.time;
    const velocity = Math.abs(deltaY) / deltaTime;
    
    // Require minimum distance (50px) OR high velocity
    const minDistance = 50;
    const minVelocity = 0.2;
    
    if (Math.abs(deltaY) > minDistance || velocity > minVelocity) {
      if (deltaY > 0) {
        // Swipe up - next story
        handleNextStory();
      } else {
        // Swipe down - previous story  
        handlePreviousStory();
      }
    }
    
    setTouchStart(null);
  };

  const handleMouseUp = (event: React.MouseEvent) => {
    if (!touchStart) return;
    
    const endY = event.clientY;
    const endTime = Date.now();
    
    const deltaY = touchStart.y - endY;
    const deltaTime = endTime - touchStart.time;
    const velocity = Math.abs(deltaY) / deltaTime;
    
    // Require minimum distance (50px) OR high velocity
    const minDistance = 50;
    const minVelocity = 0.2;
    
    if (Math.abs(deltaY) > minDistance || velocity > minVelocity) {
      if (deltaY > 0) {
        // Swipe up - next story
        handleNextStory();
      } else {
        // Swipe down - previous story  
        handlePreviousStory();
      }
    }
    
    setTouchStart(null);
  };

  const handleClick = (event: React.MouseEvent) => {
    // Ne pas toggle pause si c'est un swipe
    if (!touchStart) {
      setIsPaused(!isPaused);
    }
  };

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
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
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