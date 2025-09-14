import { useState, useEffect, useRef } from "react";
import { Plus, RotateCcw } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { PollStoryCard } from "@/components/PollStoryCard";
import { StoriesProgressBar } from "@/components/StoriesProgressBar";
import { Button } from "@/components/ui/button";
import { mockPollStories } from "@/data/mockPollStories";
import { toast } from "sonner";

const DecisionsPage = () => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isReadingText, setIsReadingText] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const isNavigatingRef = useRef(false);
  const wheelEndTimerRef = useRef<number | null>(null);
  const swipeHandledRef = useRef(false);


  const handleNextStory = () => {
    if (currentStoryIndex < mockPollStories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
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
  };

  // Sync indexRef with currentStoryIndex
  useEffect(() => { 
    indexRef.current = currentStoryIndex; 
  }, [currentStoryIndex]);

  // Event listeners setup - only once
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isNavigatingRef.current) return;

      // 1 seul +1 / -1 par "rafale" de wheel
      if (e.deltaY > 0 && indexRef.current < mockPollStories.length - 1) {
        isNavigatingRef.current = true;
        setCurrentStoryIndex(i => i + 1);
      } else if (e.deltaY < 0 && indexRef.current > 0) {
        isNavigatingRef.current = true;
        setCurrentStoryIndex(i => i - 1);
      }

      // on relâche le lock seulement quand la rafale est VRAIMENT finie
      if (wheelEndTimerRef.current) clearTimeout(wheelEndTimerRef.current);
      wheelEndTimerRef.current = window.setTimeout(() => {
        isNavigatingRef.current = false;
      }, 350);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isNavigatingRef.current) return;
      if (e.key === 'ArrowDown' && indexRef.current < mockPollStories.length - 1) {
        isNavigatingRef.current = true; 
        setCurrentStoryIndex(i => i + 1);
      } else if (e.key === 'ArrowUp' && indexRef.current > 0) {
        isNavigatingRef.current = true; 
        setCurrentStoryIndex(i => i - 1);
      }
      if (isNavigatingRef.current) {
        // petit debounce pour éviter répétitions OS
        setTimeout(() => { isNavigatingRef.current = false; }, 250);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (isNavigatingRef.current) return;

      const startY = e.touches[0].clientY;
      const startX = e.touches[0].clientX;
      swipeHandledRef.current = false;

      const handleTouchMove = (e: TouchEvent) => {
        if (swipeHandledRef.current) return;

        const deltaY = startY - e.touches[0].clientY;
        const deltaX = e.touches[0].clientX - startX;

        if (Math.abs(deltaY) > 50 && Math.abs(deltaY) > Math.abs(deltaX)) {
          // 1 seul changement par swipe
          if (deltaY > 0 && indexRef.current < mockPollStories.length - 1) {
            isNavigatingRef.current = true;
            setCurrentStoryIndex(i => i + 1);
          } else if (deltaY < 0 && indexRef.current > 0) {
            isNavigatingRef.current = true;
            setCurrentStoryIndex(i => i - 1);
          }
          swipeHandledRef.current = true;
        }
      };

      const handleTouchEnd = () => {
        // libère le lock à la FIN du geste (pas sur timer arbitraire)
        isNavigatingRef.current = false;
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };

      document.addEventListener('touchmove', handleTouchMove, { passive: true });
      document.addEventListener('touchend', handleTouchEnd, { passive: true });
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
        if (wheelEndTimerRef.current) clearTimeout(wheelEndTimerRef.current);
      };
    }
  }, []);

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
        className="h-screen overflow-hidden touch-pan-y select-none"
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