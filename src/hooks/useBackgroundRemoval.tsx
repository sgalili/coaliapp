import { useState, useRef, useCallback } from 'react';
import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = false;

const MAX_IMAGE_DIMENSION = 256;
const PROCESSING_FPS = 8; // Process only 8 frames per second

export const useBackgroundRemoval = () => {
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const segmenterRef = useRef<any>(null);
  const processingCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const debugCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastProcessTimeRef = useRef<number>(0);
  const frameIntervalRef = useRef<number>(1000 / PROCESSING_FPS);
  const maskInvertedRef = useRef<boolean>(false);

  const initializeModel = useCallback(async () => {
    if (segmenterRef.current || isModelLoading) return;
    
    setIsModelLoading(true);
    try {
      console.log('Loading segmentation model...');
      segmenterRef.current = await pipeline(
        'image-segmentation', 
        'Xenova/segformer-b0-finetuned-ade-512-512',
        { device: 'webgpu' }
      );
      setIsModelReady(true);
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Failed to load model:', error);
      // Fallback to CPU if WebGPU fails
      try {
        segmenterRef.current = await pipeline(
          'image-segmentation', 
          'Xenova/segformer-b0-finetuned-ade-512-512'
        );
        setIsModelReady(true);
        console.log('Model loaded on CPU');
      } catch (cpuError) {
        console.error('Failed to load model on CPU:', cpuError);
      }
    } finally {
      setIsModelLoading(false);
    }
  }, [isModelLoading]);

  const processVideoFrame = useCallback(async (
    video: HTMLVideoElement,
    backgroundImageUrl?: string,
    backgroundCSS?: string,
    debugMode?: boolean
  ): Promise<{ canvas: HTMLCanvasElement; debugCanvas?: HTMLCanvasElement } | null> => {
    if (!segmenterRef.current || !isModelReady || isProcessing) return null;

    // Throttle processing to avoid browser crashes
    const now = Date.now();
    if (now - lastProcessTimeRef.current < frameIntervalRef.current) {
      return outputCanvasRef.current ? { canvas: outputCanvasRef.current } : null;
    }
    lastProcessTimeRef.current = now;

    setIsProcessing(true);
    
    try {
      // Create processing canvas if needed
      if (!processingCanvasRef.current) {
        processingCanvasRef.current = document.createElement('canvas');
      }
      
      if (!outputCanvasRef.current) {
        outputCanvasRef.current = document.createElement('canvas');
      }

      if (debugMode && !debugCanvasRef.current) {
        debugCanvasRef.current = document.createElement('canvas');
      }

      const processingCanvas = processingCanvasRef.current;
      const outputCanvas = outputCanvasRef.current;
      const ctx = processingCanvas.getContext('2d');
      const outputCtx = outputCanvas.getContext('2d');

      if (!ctx || !outputCtx) return null;

      // Resize and draw video frame to processing canvas
      let width = video.videoWidth;
      let height = video.videoHeight;

      if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
        if (width > height) {
          height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
          width = MAX_IMAGE_DIMENSION;
        } else {
          width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
          height = MAX_IMAGE_DIMENSION;
        }
      }

      processingCanvas.width = width;
      processingCanvas.height = height;
      ctx.drawImage(video, 0, 0, width, height);

      // Set output canvas to video dimensions
      outputCanvas.width = video.videoWidth;
      outputCanvas.height = video.videoHeight;

      // Draw background first
      if (backgroundImageUrl) {
        const bgImg = new Image();
        bgImg.crossOrigin = 'anonymous';
        await new Promise((resolve, reject) => {
          bgImg.onload = resolve;
          bgImg.onerror = reject;
          bgImg.src = backgroundImageUrl;
        });
        outputCtx.drawImage(bgImg, 0, 0, outputCanvas.width, outputCanvas.height);
      } else if (backgroundCSS) {
        // Create gradient background
        const gradient = outputCtx.createLinearGradient(0, 0, outputCanvas.width, outputCanvas.height);
        // Simple parsing for linear gradients - would need more sophisticated parsing for complex CSS
        if (backgroundCSS.includes('linear-gradient')) {
          gradient.addColorStop(0, '#667eea');
          gradient.addColorStop(1, '#764ba2');
        }
        outputCtx.fillStyle = gradient;
        outputCtx.fillRect(0, 0, outputCanvas.width, outputCanvas.height);
      } else {
        // Default green screen background
        outputCtx.fillStyle = '#00ff00';
        outputCtx.fillRect(0, 0, outputCanvas.width, outputCanvas.height);
      }

      // Get image data and run segmentation
      const imageData = processingCanvas.toDataURL('image/jpeg', 0.8);
      const result = await segmenterRef.current(imageData);

      if (!result || !Array.isArray(result) || result.length === 0 || !result[0].mask) {
        console.log('Segmentation failed or no mask returned');
        return null;
      }

      const maskData = result[0].mask.data;
      const maskMin = Math.min(...maskData);
      const maskMax = Math.max(...maskData);
      
      const debugData = {
        resultLength: result.length,
        maskWidth: result[0].mask.width,
        maskHeight: result[0].mask.height,
        maskDataLength: maskData.length,
        maskSample: maskData.slice(0, 10),
        maskMinMax: { min: maskMin, max: maskMax },
        isInverted: maskInvertedRef.current
      };
      
      setDebugInfo(debugData);
      console.log('Segmentation result:', debugData);

      // Scale video frame to output canvas
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = outputCanvas.width;
      tempCanvas.height = outputCanvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return null;
      
      tempCtx.drawImage(video, 0, 0, outputCanvas.width, outputCanvas.height);
      const videoImageData = tempCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
      const videoData = videoImageData.data;

      // Get output image data for efficient processing
      const outputImageData = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
      const outputData = outputImageData.data;

      // Scale mask to match output dimensions
      const maskWidth = result[0].mask.width || width;
      const maskHeight = result[0].mask.height || height;
      
      // Auto-detect if mask should be inverted by analyzing some pixels
      if (!maskInvertedRef.current) {
        const sampleSize = Math.min(1000, maskData.length);
        let personPixels = 0;
        let backgroundPixels = 0;
        
        for (let i = 0; i < sampleSize; i++) {
          const maskValue = maskData[i];
          if (maskValue > 0.5) personPixels++;
          else backgroundPixels++;
        }
        
        // If more than 70% of pixels are "person", probably need to invert
        if (personPixels > backgroundPixels * 2.5) {
          maskInvertedRef.current = true;
          console.log('Auto-detected: mask should be inverted');
        }
      }
      
      // Create debug canvas if needed
      let debugCanvas = null;
      if (debugMode && debugCanvasRef.current) {
        debugCanvas = debugCanvasRef.current;
        debugCanvas.width = outputCanvas.width;
        debugCanvas.height = outputCanvas.height;
        const debugCtx = debugCanvas.getContext('2d');
        if (debugCtx) {
          const debugImageData = debugCtx.createImageData(debugCanvas.width, debugCanvas.height);
          const debugData = debugImageData.data;
          
          // Create mask visualization
          for (let i = 0; i < debugData.length; i += 4) {
            const pixelIndex = i / 4;
            const x = pixelIndex % debugCanvas.width;
            const y = Math.floor(pixelIndex / debugCanvas.width);
            
            const maskX = Math.floor((x / debugCanvas.width) * maskWidth);
            const maskY = Math.floor((y / debugCanvas.height) * maskHeight);
            const maskIndex = maskY * maskWidth + maskX;
            
            let maskValue = maskData[maskIndex] || 0;
            if (maskInvertedRef.current) maskValue = 1 - maskValue;
            
            const intensity = Math.round(maskValue * 255);
            debugData[i] = intensity;     // R
            debugData[i + 1] = intensity; // G
            debugData[i + 2] = intensity; // B
            debugData[i + 3] = 255;       // A
          }
          
          debugCtx.putImageData(debugImageData, 0, 0);
        }
      }
      
      // Apply mask with improved processing
      for (let i = 0; i < outputData.length; i += 4) {
        const pixelIndex = i / 4;
        const x = pixelIndex % outputCanvas.width;
        const y = Math.floor(pixelIndex / outputCanvas.width);
        
        // Calculate corresponding mask position
        const maskX = Math.floor((x / outputCanvas.width) * maskWidth);
        const maskY = Math.floor((y / outputCanvas.height) * maskHeight);
        const maskIndex = maskY * maskWidth + maskX;
        
        let maskValue = maskData[maskIndex] || 0;
        if (maskInvertedRef.current) maskValue = 1 - maskValue;
        
        // Apply threshold with better person detection
        if (maskValue > 0.3) { // Higher confidence threshold
          // Keep the person - use video frame data with enhanced visibility
          const brightness = 1.8;
          const contrast = 1.2;
          
          outputData[i] = Math.min(255, Math.max(0, (videoData[i] - 128) * contrast + 128) * brightness);
          outputData[i + 1] = Math.min(255, Math.max(0, (videoData[i + 1] - 128) * contrast + 128) * brightness);
          outputData[i + 2] = Math.min(255, Math.max(0, (videoData[i + 2] - 128) * contrast + 128) * brightness);
          outputData[i + 3] = 255; // Full opacity
        }
        // Background pixels remain as they were drawn
      }
      
      // Apply the processed image data
      outputCtx.putImageData(outputImageData, 0, 0);

      return { canvas: outputCanvas, debugCanvas };
    } catch (error) {
      console.error('Error processing video frame:', error);
      return null;
    } finally {
      // Clean up temporary canvases to prevent memory leaks
      if (processingCanvasRef.current) {
        const ctx = processingCanvasRef.current.getContext('2d');
        ctx?.clearRect(0, 0, processingCanvasRef.current.width, processingCanvasRef.current.height);
      }
      setIsProcessing(false);
    }
  }, [isModelReady, isProcessing]);

  return {
    initializeModel,
    processVideoFrame,
    isModelLoading,
    isModelReady,
    isProcessing,
    debugInfo
  };
};
