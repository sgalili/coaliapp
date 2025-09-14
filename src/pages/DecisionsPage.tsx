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
  const [isDragging, setIsDragging] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dragTimeoutRef = useRef<NodeJS.Timeout>();

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
    const startData = {
      y: event.touches[0].clientY,
      time: Date.now()
    };
    setTouchStart(startData);
    setIsDragging(false);
    setDebugInfo(`Touch Start: ${startData.y}px`);
    
    // Timeout pour considérer que c'est un drag après 100ms
    dragTimeoutRef.current = setTimeout(() => {
      setIsDragging(true);
    }, 100);
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    // Ne pas preventDefault sur mouseDown pour éviter les conflits
    const startData = {
      y: event.clientY,
      time: Date.now()
    };
    setTouchStart(startData);
    setIsDragging(false);
    setDebugInfo(`Mouse Start: ${startData.y}px`);
    
    // Timeout pour considérer que c'est un drag après 150ms (plus long pour trackpad)
    dragTimeoutRef.current = setTimeout(() => {
      setIsDragging(true);
    }, 150);
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    if (!touchStart) return;
    event.preventDefault();
    
    const currentY = event.touches[0].clientY;
    const deltaY = touchStart.y - currentY;
    setDebugInfo(`Touch Move: ${currentY}px, Δ${deltaY}px`);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!touchStart) return;
    // Ne pas preventDefault sur mouseMove sauf si on est en train de dragger
    if (isDragging) {
      event.preventDefault();
    }
    
    const currentY = event.clientY;
    const deltaY = touchStart.y - currentY;
    setDebugInfo(`Mouse Move: ${currentY}px, Δ${deltaY}px, Dragging: ${isDragging}`);
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (!touchStart) return;
    
    // Clear timeout
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }
    
    const endY = event.changedTouches[0].clientY;
    const endTime = Date.now();
    
    const deltaY = touchStart.y - endY;
    const deltaTime = endTime - touchStart.time;
    const velocity = Math.abs(deltaY) / deltaTime;
    
    // Seuils adaptés pour touch
    const minDistance = 30;
    const minVelocity = 0.15;
    
    setDebugInfo(`Touch End: Δ${deltaY}px, v${velocity.toFixed(2)}, isDrag: ${isDragging}`);
    
    if (isDragging && (Math.abs(deltaY) > minDistance || velocity > minVelocity)) {
      if (deltaY > 0) {
        handleNextStory();
      } else {
        handlePreviousStory();
      }
    }
    
    setTouchStart(null);
    setIsDragging(false);
    
    // Clear debug info after 2 seconds
    setTimeout(() => setDebugInfo(''), 2000);
  };

  const handleMouseUp = (event: React.MouseEvent) => {
    if (!touchStart) return;
    
    // Clear timeout
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }
    
    const endY = event.clientY;
    const endTime = Date.now();
    
    const deltaY = touchStart.y - endY;
    const deltaTime = endTime - touchStart.time;
    const velocity = Math.abs(deltaY) / deltaTime;
    
    // Seuils plus petits pour trackpad MacBook
    const minDistance = 20; // Plus petit pour trackpad
    const minVelocity = 0.08; // Plus petit pour trackpad
    
    setDebugInfo(`Mouse End: Δ${deltaY}px, v${velocity.toFixed(2)}, isDrag: ${isDragging}, time: ${deltaTime}ms`);
    
    // Vérifier si c'est un swipe valide
    if (isDragging && (Math.abs(deltaY) > minDistance || velocity > minVelocity)) {
      if (deltaY > 0) {
        handleNextStory();
      } else {
        handlePreviousStory();
      }
    }
    
    setTouchStart(null);
    setIsDragging(false);
    
    // Clear debug info after 2 seconds
    setTimeout(() => setDebugInfo(''), 2000);
  };

  const handleClick = (event: React.MouseEvent) => {
    // Ne toggle pause que si ce n'est pas un drag
    if (!isDragging && !touchStart) {
      setIsPaused(!isPaused);
      setDebugInfo('Click: Pause toggled');
      setTimeout(() => setDebugInfo(''), 1000);
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

      {/* Debug Info */}
      {debugInfo && (
        <div className="fixed top-16 left-4 z-50 bg-black/80 text-white px-3 py-2 rounded-lg text-sm font-mono backdrop-blur-sm">
          {debugInfo}
        </div>
      )}

      {/* Visual swipe indicators */}
      <div className="fixed top-1/2 left-4 transform -translate-y-1/2 z-40 text-white/50 text-xs">
        ↑ Next Story
      </div>
      <div className="fixed top-1/2 left-4 transform -translate-y-1/2 mt-8 z-40 text-white/50 text-xs">
        ↓ Previous Story
      </div>

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