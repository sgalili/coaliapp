import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { 
  X, 
  Camera, 
  Square, 
  Play, 
  RotateCcw,
  Settings,
  Monitor,
  Flag,
  Mic
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpertVideoCreatorProps {
  newsId: string;
  newsTitle: string;
  onClose: () => void;
  onPublish: (videoData: any) => void;
}

type VideoFilter = "none" | "studio" | "political" | "podcast";

const videoFilters = {
  none: { 
    name: "ללא פילטר", 
    icon: Camera,
    filter: "",
    background: ""
  },
  studio: { 
    name: "אולפן", 
    icon: Monitor,
    filter: "brightness(1.1) contrast(1.1)",
    background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
  },
  political: { 
    name: "פוליטי", 
    icon: Flag,
    filter: "brightness(1.05) contrast(1.05) saturate(1.1)",
    background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #ffffff 100%)"
  },
  podcast: { 
    name: "פודקאסט", 
    icon: Mic,
    filter: "sepia(0.1) brightness(0.9) contrast(1.2)",
    background: "linear-gradient(135deg, #1f2937 0%, #374151 100%)"
  }
};

export const ExpertVideoCreator = ({ 
  newsId, 
  newsTitle, 
  onClose, 
  onPublish 
}: ExpertVideoCreatorProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [comment, setComment] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<VideoFilter>("studio");
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [showAuthWarning, setShowAuthWarning] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: 1280, 
          height: 720,
          facingMode: 'user'
        },
        audio: true
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;

    chunksRef.current = [];
    mediaRecorderRef.current = new MediaRecorder(streamRef.current);
    
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      setRecordedBlob(blob);
      
      // Check if this was truly live recording
      if (!isLiveMode) {
        setShowAuthWarning(true);
      }
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const resetRecording = () => {
    setRecordedBlob(null);
    setShowAuthWarning(false);
    startCamera();
  };

  const handlePublish = () => {
    if (recordedBlob && comment.trim()) {
      onPublish({
        newsId,
        videoBlob: recordedBlob,
        comment: comment.trim(),
        filter: selectedFilter,
        isLive: isLiveMode,
        timestamp: new Date().toISOString(),
        hasAuthWarning: showAuthWarning
      });
    }
  };

  const getFilterStyle = () => {
    const filter = videoFilters[selectedFilter];
    return {
      filter: filter.filter,
      background: filter.background
    };
  };

  const isFormValid = () => {
    return recordedBlob && comment.trim();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" dir="rtl">
      <Card className="w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">תגובת מומחה</h2>
              <p className="text-sm text-slate-600 mt-1">{newsTitle}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Video Filter Selection */}
          <div className="space-y-3">
            <Label>רקע מקצועי</Label>
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(videoFilters).map(([key, filter]) => {
                const IconComponent = filter.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedFilter(key as VideoFilter)}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all",
                      selectedFilter === key 
                        ? "border-blue-500 bg-blue-50" 
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <IconComponent className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">{filter.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Video Recording Area */}
          <div className="space-y-4">
            <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden">
              {/* Background overlay for filters */}
              <div 
                className="absolute inset-0 opacity-30"
                style={{ background: videoFilters[selectedFilter].background }}
              />
              
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
                style={{ filter: videoFilters[selectedFilter].filter }}
              />
              
              {/* Recording indicator */}
              {isRecording && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  הקלטה בזמן אמת
                </div>
              )}

              {/* Auth warning overlay */}
              {showAuthWarning && (
                <div className="absolute bottom-4 left-4 right-4 bg-yellow-500/90 text-yellow-900 p-3 rounded-lg text-sm">
                  ⚠️ וידאו זה לא הוקלט בשידור חי ואין לו ערבות אותנטיות
                </div>
              )}

              {/* Control buttons */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                {!recordedBlob ? (
                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    variant={isRecording ? "destructive" : "default"}
                    size="lg"
                    className="rounded-full"
                  >
                    {isRecording ? (
                      <>
                        <Square className="w-5 h-5 ml-2" />
                        עצור הקלטה
                      </>
                    ) : (
                      <>
                        <Camera className="w-5 h-5 ml-2" />
                        התחל הקלטה
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={resetRecording}
                    variant="outline"
                    size="lg"
                    className="rounded-full bg-white"
                  >
                    <RotateCcw className="w-5 h-5 ml-2" />
                    הקלט מחדש
                  </Button>
                )}
              </div>
            </div>

            {/* Live mode toggle */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <input
                type="checkbox"
                id="liveMode"
                checked={isLiveMode}
                onChange={(e) => setIsLiveMode(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="liveMode" className="flex-1">
                מצב שידור חי (מומלץ לאימות אותנטיות)
              </Label>
              <Settings className="w-4 h-4 text-slate-500" />
            </div>
          </div>

          {/* Comment Section */}
          <div className="space-y-3">
            <Label htmlFor="comment">הערת המומחה</Label>
            <Textarea
              id="comment"
              placeholder="שתף את דעתך המקצועית על החדשה..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="text-right min-h-[120px]"
              rows={4}
            />
            <div className="text-xs text-slate-500 text-left">
              {comment.length}/500 תווים
            </div>
          </div>

          {/* Preview for recorded video */}
          {recordedBlob && (
            <div className="space-y-3">
              <Label>תצוגה מקדימה</Label>
              <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden">
                <video
                  src={URL.createObjectURL(recordedBlob)}
                  controls
                  className="w-full h-full object-cover"
                  style={{ filter: videoFilters[selectedFilter].filter }}
                />
                {showAuthWarning && (
                  <div className="absolute bottom-4 left-4 right-4 bg-yellow-500/90 text-yellow-900 p-2 rounded text-sm">
                    ⚠️ אין ערבות אותנטיות
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={onClose} variant="outline" className="flex-1">
              ביטול
            </Button>
            <Button 
              onClick={handlePublish} 
              disabled={!isFormValid()}
              className="flex-1"
            >
              פרסם תגובה
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};