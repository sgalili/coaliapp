import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Camera, RotateCcw, CircleStop, Play, Mic, Flag, Monitor, Laptop, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { getDomainConfig, type ExpertDomain } from "@/lib/domainConfig";

interface VideoCreatorProps {
  onClose: () => void;
  onPublish: (videoData: any) => void;
}

type RecordingMode = "record" | "live";
type FilterType = "none" | "politics" | "podcast" | "tech" | "neutral";

interface Filter {
  id: FilterType;
  name: string;
  icon: React.ReactNode;
  backgroundImage?: string;
  backgroundCSS?: string;
}

const filters: Filter[] = [
  {
    id: "none",
    name: "None",
    icon: <X className="w-4 h-4" />,
  },
  {
    id: "politics",
    name: "Politics",
    icon: <Flag className="w-4 h-4" />,
    backgroundImage: "linear-gradient(135deg, #0078d4 0%, #ffffff 50%, #0078d4 100%)",
  },
  {
    id: "podcast",
    name: "Podcast",
    icon: <Mic className="w-4 h-4" />,
    backgroundCSS: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
  },
  {
    id: "tech",
    name: "Tech",
    icon: <Monitor className="w-4 h-4" />,
    backgroundCSS: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    id: "neutral",
    name: "Neutral",
    icon: <Laptop className="w-4 h-4" />,
    backgroundCSS: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  },
];

export const VideoCreator = ({ onClose, onPublish }: VideoCreatorProps) => {
  const [mode, setMode] = useState<RecordingMode>("record");
  const [isRecording, setIsRecording] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("none");
  const [selectedCategory, setSelectedCategory] = useState<ExpertDomain | "">("");
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [comment, setComment] = useState("");
  const [recordingTime, setRecordingTime] = useState(60);
  const [isCameraFacingUser, setIsCameraFacingUser] = useState(true);

  // Mock user profile domains - in real app, this would come from user context/API
  const userDomains: ExpertDomain[] = ['tech', 'politics', 'culture']; // Max 3 domains from user profile

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [isCameraFacingUser]);

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev <= 1) {
            // Auto-stop recording when countdown reaches 0
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording]);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: isCameraFacingUser ? "user" : "environment",
          width: { ideal: 1080 },
          height: { ideal: 1920 }
        },
        audio: true
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const flipCamera = () => {
    setIsCameraFacingUser(prev => !prev);
  };

  const startRecording = () => {
    if (!streamRef.current) return;

    try {
      const mediaRecorder = new MediaRecorder(streamRef.current);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        setRecordedBlob(blob);
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setRecordingTime(60);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Recording Error",
        description: "Could not start recording.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const startLive = () => {
    setIsLive(true);
    toast({
      title: "Going Live!",
      description: "Your live stream has started.",
    });
  };

  const stopLive = () => {
    setIsLive(false);
    toast({
      title: "Live Ended",
      description: "Your live stream has ended.",
    });
  };

  const handlePublish = () => {
    // Check if user has domains in profile
    if (userDomains.length === 0) {
      toast({
        title: "Profil incomplet",
        description: "Veuillez compléter votre profil avec vos domaines d'expertise avant de publier.",
        variant: "destructive"
      });
      return;
    }

    // Check if category is selected
    if (!selectedCategory) {
      toast({
        title: "Catégorie requise",
        description: "Veuillez sélectionner une catégorie pour votre contenu.",
        variant: "destructive"
      });
      return;
    }

    if (mode === "record" && recordedBlob && comment.trim()) {
      onPublish({
        videoBlob: recordedBlob,
        comment: comment.trim(),
        filter: selectedFilter,
        category: selectedCategory,
        mode: "record",
        duration: 60 - recordingTime,
        timestamp: new Date().toISOString()
      });
    } else if (mode === "live" && comment.trim()) {
      onPublish({
        comment: comment.trim(),
        filter: selectedFilter,
        category: selectedCategory,
        mode: "live",
        timestamp: new Date().toISOString()
      });
    }
  };

  const resetRecording = () => {
    setRecordedBlob(null);
    setRecordingTime(60);
    startCamera();
  };

  const getFilterStyle = () => {
    const filter = filters.find(f => f.id === selectedFilter);
    if (!filter || filter.id === "none") return {};

    if (filter.backgroundImage) {
      return { background: filter.backgroundImage };
    }
    if (filter.backgroundCSS) {
      return { background: filter.backgroundCSS };
    }
    return {};
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isFormValid = () => {
    if (userDomains.length === 0) return false;
    if (!selectedCategory) return false;
    if (mode === "record") {
      return recordedBlob && comment.trim();
    }
    return comment.trim();
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Category Selection */}
          {userDomains.length > 0 && (
            <div className="flex-1 max-w-[200px] mx-4">
              <Select value={selectedCategory} onValueChange={(value: ExpertDomain) => setSelectedCategory(value)}>
                <SelectTrigger className="bg-black/50 border-white/20 text-white text-sm h-8">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {userDomains.map((domain) => {
                    const config = getDomainConfig(domain);
                    const IconComponent = config.icon;
                    return (
                      <SelectItem 
                        key={domain} 
                        value={domain}
                        className="text-white hover:bg-gray-700 focus:bg-gray-700"
                      >
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4" />
                          <span>{config.hebrewName}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Mode Toggle */}
          <div className="flex bg-black/30 rounded-full p-1">
            <Button
              variant={mode === "record" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMode("record")}
              className={cn(
                "rounded-full text-sm",
                mode === "record" ? "bg-white text-black" : "text-white hover:bg-white/20"
              )}
            >
              Record
            </Button>
            <Button
              variant={mode === "live" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMode("live")}
              className={cn(
                "rounded-full text-sm",
                mode === "live" ? "bg-red-500 text-white" : "text-white hover:bg-white/20"
              )}
            >
              Live
            </Button>
          </div>

          {/* Timer */}
          {(isRecording || isLive) && (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-mono">
              {isLive && "🔴"} {formatTime(recordingTime)}
            </div>
          )}
        </div>

        {/* Profile Warning */}
        {userDomains.length === 0 && (
          <div className="mt-3 bg-red-500/90 text-white p-3 rounded-lg text-sm flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>Complétez votre profil pour publier du contenu</span>
          </div>
        )}
      </div>

      {/* Main Video Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Background Filter */}
        <div 
          className="absolute inset-0"
          style={getFilterStyle()}
        />
        
        {/* Video Preview */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={cn(
            "w-full h-full object-cover",
            selectedFilter === "politics" && "mix-blend-overlay",
            selectedFilter === "podcast" && "mix-blend-soft-light",
            selectedFilter === "tech" && "mix-blend-multiply",
            selectedFilter === "neutral" && "mix-blend-overlay"
          )}
        />

        {/* Recording Overlay */}
        {recordedBlob && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-center text-white">
              <Play className="w-16 h-16 mx-auto mb-4" />
              <p className="text-lg">Video Recorded!</p>
              <p className="text-sm text-gray-300">Duration: {formatTime(60 - recordingTime)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pb-8">
        {/* Filters Row */}
        <div className="flex justify-center gap-3 mb-6">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={selectedFilter === filter.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedFilter(filter.id)}
              className={cn(
                "rounded-full flex items-center gap-2 text-xs",
                selectedFilter === filter.id 
                  ? "bg-white text-black" 
                  : "text-white hover:bg-white/20"
              )}
            >
              {filter.icon}
              {filter.name}
            </Button>
          ))}
        </div>

        {/* Comment Input */}
        <div className="mb-4">
          <Textarea
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="bg-black/50 border-white/20 text-white placeholder:text-gray-400 resize-none"
            rows={2}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          {/* Flip Camera */}
          <Button
            variant="ghost"
            size="icon"
            onClick={flipCamera}
            className="text-white hover:bg-white/20"
          >
            <RotateCcw className="w-6 h-6" />
          </Button>

          {/* Main Action Button */}
          <div className="flex flex-col items-center">
            {mode === "record" ? (
              <>
                {!recordedBlob ? (
                  <Button
                    size="lg"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={cn(
                      "rounded-full w-20 h-20 p-0",
                      isRecording 
                        ? "bg-red-500 hover:bg-red-600" 
                        : "bg-white hover:bg-gray-100 text-black"
                    )}
                  >
                    {isRecording ? (
                      <CircleStop className="w-8 h-8" />
                    ) : (
                      <Camera className="w-8 h-8" />
                    )}
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={resetRecording}
                      className="text-white border-white hover:bg-white/20"
                    >
                      Retake
                    </Button>
                    <Button
                      onClick={handlePublish}
                      disabled={!isFormValid()}
                      className="bg-primary hover:bg-primary/90 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                      Publish
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <Button
                size="lg"
                onClick={isLive ? stopLive : startLive}
                disabled={!comment.trim() || userDomains.length === 0}
                className={cn(
                  "rounded-full w-20 h-20 p-0",
                  isLive 
                    ? "bg-red-500 hover:bg-red-600" 
                    : "bg-red-500 hover:bg-red-600 disabled:bg-gray-500"
                )}
              >
                {isLive ? (
                  <CircleStop className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8" />
                )}
              </Button>
            )}
          </div>

          {/* Publish Button for Live */}
          {mode === "live" && isLive && (
            <Button
              onClick={handlePublish}
              disabled={!isFormValid()}
              className="bg-primary hover:bg-primary/90 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              End & Publish
            </Button>
          )}

          {/* Spacer for alignment */}
          {mode === "record" && !recordedBlob && (
            <div className="w-12" />
          )}
          {mode === "live" && !isLive && (
            <div className="w-12" />
          )}
        </div>
      </div>
    </div>
  );
};
