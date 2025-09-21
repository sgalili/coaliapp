import { useCallback, useRef } from 'react';

export interface AudioFeedbackOptions {
  volume?: number;
  enabled?: boolean;
}

export const useAudioFeedback = (options: AudioFeedbackOptions = {}) => {
  const { volume = 0.5, enabled = true } = options;
  const audioRef = useRef<{ [key: string]: HTMLAudioElement }>({});

  const preloadAudio = useCallback((soundName: string, src: string) => {
    if (!enabled) return;
    
    const audio = new Audio(src);
    audio.preload = 'auto';
    audio.volume = volume;
    audioRef.current[soundName] = audio;
  }, [enabled, volume]);

  const playSound = useCallback(async (soundName: string, src?: string) => {
    if (!enabled) return;
    
    try {
      let audio = audioRef.current[soundName];
      
      if (!audio && src) {
        audio = new Audio(src);
        audio.volume = volume;
        audioRef.current[soundName] = audio;
      }
      
      if (audio) {
        audio.currentTime = 0;
        await audio.play();
      }
    } catch (error) {
      console.log('Audio play failed:', error);
    }
  }, [enabled, volume]);

  const playVoteSuccess = useCallback(() => {
    playSound('vote-success', '/sounds/vote-success.mp3');
  }, [playSound]);

  const playVoteSubmit = useCallback(() => {
    playSound('vote-submit', '/sounds/vote-submit.mp3');
  }, [playSound]);

  return {
    playVoteSuccess,
    playVoteSubmit,
    playSound,
    preloadAudio
  };
};