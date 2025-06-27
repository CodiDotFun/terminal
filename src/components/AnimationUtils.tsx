
import React, { useState, useEffect } from 'react';

interface StaggeredAnimationProps {
  children: React.ReactNode[];
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
  className?: string;
}

export const StaggeredAnimation: React.FC<StaggeredAnimationProps> = ({
  children,
  delay = 100,
  duration = 300,
  direction = 'up',
  className = ''
}) => {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(children.length).fill(false));

  useEffect(() => {
    children.forEach((_, index) => {
      setTimeout(() => {
        setVisibleItems(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      }, index * delay);
    });
  }, [children.length, delay]);

  const getAnimationClass = (direction: string, isVisible: boolean) => {
    const baseClass = `transition-all duration-${duration}`;
    const visibleClass = 'opacity-100 transform translate-x-0 translate-y-0 scale-100';
    
    if (isVisible) return `${baseClass} ${visibleClass}`;
    
    switch (direction) {
      case 'up':
        return `${baseClass} opacity-0 transform translate-y-4`;
      case 'down':
        return `${baseClass} opacity-0 transform -translate-y-4`;
      case 'left':
        return `${baseClass} opacity-0 transform translate-x-4`;
      case 'right':
        return `${baseClass} opacity-0 transform -translate-x-4`;
      case 'scale':
        return `${baseClass} opacity-0 transform scale-95`;
      default:
        return `${baseClass} opacity-0`;
    }
  };

  return (
    <div className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={getAnimationClass(direction, visibleItems[index])}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

interface ParticleEffectProps {
  trigger: boolean;
  color?: string;
  count?: number;
  duration?: number;
  size?: number;
}

export const ParticleEffect: React.FC<ParticleEffectProps> = ({
  trigger,
  color = '#97ff5f',
  count = 20,
  duration = 1000,
  size = 4
}) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
  }>>([]);

  useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: 50,
        y: 50,
        vx: (Math.random() - 0.5) * 200,
        vy: (Math.random() - 0.5) * 200,
        life: 1
      }));
      
      setParticles(newParticles);
      
      const animation = setInterval(() => {
        setParticles(prev => prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx * 0.016,
          y: particle.y + particle.vy * 0.016,
          life: particle.life - 0.016 * (1000 / duration)
        })).filter(particle => particle.life > 0));
      }, 16);
      
      setTimeout(() => {
        clearInterval(animation);
        setParticles([]);
      }, duration);
    }
  }, [trigger, count, duration]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            opacity: particle.life,
            transform: `scale(${particle.life})`,
            boxShadow: `0 0 ${size * 2}px ${color}`
          }}
        />
      ))}
    </div>
  );
};

interface GlitchTextProps {
  text: string;
  trigger: boolean;
  duration?: number;
  intensity?: number;
}

export const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  trigger,
  duration = 500,
  intensity = 3
}) => {
  const [glitchText, setGlitchText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsGlitching(true);
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
      
      const glitchInterval = setInterval(() => {
        setGlitchText(prev => 
          prev.split('').map(char => 
            Math.random() < 0.1 ? chars[Math.floor(Math.random() * chars.length)] : char
          ).join('')
        );
      }, 50);
      
      setTimeout(() => {
        clearInterval(glitchInterval);
        setGlitchText(text);
        setIsGlitching(false);
      }, duration);
    }
  }, [trigger, text, duration]);

  return (
    <span className={`${isGlitching ? 'animate-pulse' : ''}`} style={{
      textShadow: isGlitching ? `
        ${Math.random() * intensity}px ${Math.random() * intensity}px 0 #ff0000,
        ${Math.random() * -intensity}px ${Math.random() * -intensity}px 0 #00ff00,
        ${Math.random() * intensity}px ${Math.random() * -intensity}px 0 #0000ff
      ` : 'none'
    }}>
      {glitchText}
    </span>
  );
};
