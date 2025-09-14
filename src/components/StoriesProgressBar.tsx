import { cn } from "@/lib/utils";

interface StoriesProgressBarProps {
  totalStories: number;
  currentStoryIndex: number;
  currentProgress: number; // 0-100
}

export const StoriesProgressBar = ({ 
  totalStories, 
  currentStoryIndex, 
  currentProgress 
}: StoriesProgressBarProps) => {
  return (
    <div className="fixed top-4 left-4 right-4 z-50 flex gap-1">
      {Array.from({ length: totalStories }).map((_, index) => (
        <div 
          key={index}
          className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm"
        >
          <div 
            className={cn(
              "h-full transition-all duration-300 ease-linear rounded-full",
              index < currentStoryIndex 
                ? "w-full bg-white" 
                : index === currentStoryIndex
                ? "bg-white"
                : "w-0 bg-white/50"
            )}
            style={{
              width: index === currentStoryIndex ? `${currentProgress}%` : 
                     index < currentStoryIndex ? '100%' : '0%'
            }}
          />
        </div>
      ))}
    </div>
  );
};