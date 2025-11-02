import { supabase } from '@/integrations/supabase/client';

export const uploadMediaFile = async (file: File): Promise<string> => {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('demo-media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('demo-media')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Failed to upload file:', error);
    throw new Error('Failed to upload file');
  }
};

export const deleteMediaFile = async (fileUrl: string): Promise<void> => {
  try {
    // Extract file path from URL
    const urlParts = fileUrl.split('/');
    const filePathIndex = urlParts.indexOf('uploads');
    
    if (filePathIndex === -1) {
      throw new Error('Invalid file URL');
    }
    
    const filePath = urlParts.slice(filePathIndex).join('/');

    const { error } = await supabase.storage
      .from('demo-media')
      .remove([filePath]);

    if (error) throw error;
  } catch (error) {
    console.error('Failed to delete file:', error);
    throw error;
  }
};

// Compress video before upload (optional)
export const compressVideo = async (file: File): Promise<File> => {
  // In a real implementation, you would use a library like ffmpeg.wasm
  // For now, just return the original file
  return file;
};

// Generate thumbnail from video
export const generateThumbnail = async (videoFile: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    
    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      video.currentTime = 1; // Get frame at 1 second
    };
    
    video.onseeked = () => {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(URL.createObjectURL(blob));
          } else {
            reject(new Error('Failed to generate thumbnail'));
          }
        }, 'image/jpeg', 0.7);
      }
    };
    
    video.onerror = () => reject(new Error('Failed to load video'));
    video.src = URL.createObjectURL(videoFile);
  });
};
