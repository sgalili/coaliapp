import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Camera, VideoIcon, X, Tag, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentCreatorProps {
  onClose: () => void;
  onPublish: (content: any) => void;
}

export const ContentCreator = ({ onClose, onPublish }: ContentCreatorProps) => {
  const [contentType, setContentType] = useState<"image" | "video">("image");
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    caption: "",
    tags: [] as string[],
    location: "",
    isPublic: true
  });
  const [newTag, setNewTag] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handlePublish = () => {
    if (file && formData.caption) {
      onPublish({
        file,
        contentType,
        ...formData,
        timestamp: new Date().toISOString()
      });
    }
  };

  const isFormValid = () => {
    return file && formData.caption.trim();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="rtl">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">יצירת תוכן חדש</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content Type Selection */}
          <div className="flex gap-4">
            <Button
              variant={contentType === "image" ? "default" : "outline"}
              onClick={() => setContentType("image")}
              className="flex-1"
            >
              <Camera className="w-4 h-4 ml-2" />
              תמונה
            </Button>
            <Button
              variant={contentType === "video" ? "default" : "outline"}
              onClick={() => setContentType("video")}
              className="flex-1"
            >
              <VideoIcon className="w-4 h-4 ml-2" />
              וידאו
            </Button>
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            {!file ? (
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept={contentType === "image" ? "image/*" : "video/*"}
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                  id="fileUpload"
                />
                <label htmlFor="fileUpload" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">
                    העלה {contentType === "image" ? "תמונה" : "וידאו"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    גרור קובץ לכאן או לחץ לבחירה
                  </p>
                </label>
              </div>
            ) : (
              <div className="relative">
                {preview && (
                  <div className="rounded-lg overflow-hidden bg-muted">
                    {contentType === "image" ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-64 object-cover"
                      />
                    ) : (
                      <video
                        src={preview}
                        className="w-full h-64 object-cover"
                        controls
                      />
                    )}
                  </div>
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 left-2"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Caption */}
          <div>
            <Label htmlFor="caption">תיאור</Label>
            <Textarea
              id="caption"
              placeholder="כתב משהו על התוכן שלך..."
              value={formData.caption}
              onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
              className="text-right min-h-[100px]"
            />
          </div>

          {/* Tags */}
          <div>
            <Label>תגיות</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  #{tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:bg-destructive/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="הוסף תגית"
                className="text-right"
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <Button onClick={handleAddTag} variant="outline" size="icon">
                <Tag className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location">מיקום (אופציונלי)</Label>
            <div className="relative">
              <Input
                id="location"
                placeholder="הוסף מיקום"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="text-right pl-10"
              />
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          {/* Privacy */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
            />
            <Label htmlFor="isPublic">פרסם באופן ציבורי</Label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={onClose} variant="outline" className="flex-1">
              ביטול
            </Button>
            <Button 
              onClick={handlePublish} 
              disabled={!isFormValid()}
              className="flex-1"
            >
              פרסם
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};