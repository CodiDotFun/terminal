
import React, { createContext, useContext, useRef, useEffect, useState } from 'react';

interface SoundContextType {
  playSound: (soundType: 'success' | 'error' | 'typing' | 'notification' | 'ambient') => void;
  stopSound: (soundType: string) => void;
  setVolume: (volume: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const useSounds = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSounds must be used within a SoundProvider');
  }
  return context;
};

interface SoundProviderProps {
  children: React.ReactNode;
}

export const SoundProvider: React.FC<SoundProviderProps> = ({ children }) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [volume, setVolumeState] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const soundsRef = useRef<Map<string, AudioBuffer>>(new Map());

  useEffect(() => {
    // Initialize audio context
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    // Create sound buffers
    const createSoundBuffer = (frequency: number, duration: number, type: 'sine' | 'square' | 'sawtooth' = 'sine') => {
      const sampleRate = audioContextRef.current!.sampleRate;
      const length = sampleRate * duration;
      const buffer = audioContextRef.current!.createBuffer(1, length, sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        let value = 0;
        
        switch (type) {
          case 'sine':
            value = Math.sin(2 * Math.PI * frequency * t);
            break;
          case 'square':
            value = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1;
            break;
          case 'sawtooth':
            value = 2 * (t * frequency - Math.floor(t * frequency + 0.5));
            break;
        }
        
        // Apply envelope
        const envelope = Math.exp(-t * 3);
        data[i] = value * envelope * 0.1;
      }

      return buffer;
    };

    // Create different sound types
    soundsRef.current.set('success', createSoundBuffer(523.25, 0.3)); // C5
    soundsRef.current.set('error', createSoundBuffer(196, 0.5, 'square')); // G3
    soundsRef.current.set('typing', createSoundBuffer(800, 0.05, 'square'));
    soundsRef.current.set('notification', createSoundBuffer(659.25, 0.2)); // E5

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playSound = (soundType: 'success' | 'error' | 'typing' | 'notification' | 'ambient') => {
    if (isMuted || !audioContextRef.current) return;

    const buffer = soundsRef.current.get(soundType);
    if (!buffer) return;

    const source = audioContextRef.current.createBufferSource();
    const gainNode = audioContextRef.current.createGain();
    
    source.buffer = buffer;
    gainNode.gain.value = volume;
    
    source.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    source.start();
  };

  const stopSound = (soundType: string) => {
    // Implementation for stopping specific sounds if needed
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)));
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <SoundContext.Provider value={{
      playSound,
      stopSound,
      setVolume,
      isMuted,
      toggleMute
    }}>
      {children}
    </SoundContext.Provider>
  );
};
