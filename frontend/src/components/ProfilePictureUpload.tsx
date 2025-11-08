/**
 * Profile Picture Upload Component
 * Upload from local device (camera/gallery)
 */

import React, { useRef } from 'react';
import { Camera, Upload } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ProfilePictureUploadProps {
  currentImageUrl: string;
  onImageChange: (url: string) => void;
  userInitials?: string;
  hideUploadButton?: boolean;
}

export const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentImageUrl,
  onImageChange,
  userInitials = '?'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('נא לבחור קובץ תמונה');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('גודל התמונה חייב להיות עד 5MB');
      return;
    }

    // Convert to base64 or upload to server
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onImageChange(base64String);
      toast.success('תמונה הועלתה בהצלחה');
    };
    reader.readAsDataURL(file);
  };

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <Avatar 
          className="w-24 h-24 cursor-pointer ring-4 ring-primary/20 hover:ring-primary/40 transition-all"
          onClick={handleCameraClick}
        >
          <AvatarImage src={currentImageUrl} />
          <AvatarFallback className="text-xl bg-gradient-to-br from-primary/20 to-primary/10">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        <div 
          className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform"
          onClick={handleCameraClick}
        >
          <Camera className="w-5 h-5 text-primary-foreground" />
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleCameraClick}
        className="flex items-center gap-2"
      >
        <Upload className="w-4 h-4" />
        העלה תמונה
      </Button>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};
