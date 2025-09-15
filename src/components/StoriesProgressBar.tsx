import { cn } from "@/lib/utils";

interface StoriesProgressBarProps {
  totalStories: number;
  currentStoryIndex: number;
}

export const StoriesProgressBar = ({ 
  totalStories, 
  currentStoryIndex
}: StoriesProgressBarProps) => {
  return (
    <div className="fixed top-3 left-4 right-4 z-50 flex gap-1">
      {Array.from({ length: totalStories }).map((_, index) => (
        <div 
          key={index}
          className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm"
        >
          <div 
            className={cn(
              "h-full transition-all duration-300 ease-linear rounded-full",
              index <= currentStoryIndex 
                ? "w-full bg-white" 
                : "w-0 bg-white/50"
            )}
          />
        </div>
      ))}
    </div>
  );
};