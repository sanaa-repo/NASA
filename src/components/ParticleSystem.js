import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';

const ParticleContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 200;
`;

const Particle = styled(motion.div)`
  position: absolute;
  pointer-events: none;
  font-family: 'Orbitron', monospace;
  font-weight: bold;
  text-shadow: 0 0 10px currentColor;
  z-index: 201;
`;

const XPParticle = styled(Particle)`
  color: #00ff88;
  font-size: 1.2rem;
`;

const LevelUpParticle = styled(Particle)`
  color: #ff6b6b;
  font-size: 1.5rem;
  text-shadow: 0 0 20px #ff6b6b;
`;

const ScoreParticle = styled(Particle)`
  color: #00d4ff;
  font-size: 1rem;
`;

const ParticleSystem = () => {
  const { state, removeParticle } = useGame();
  const { particles } = state;

  useEffect(() => {
    // Auto-remove particles after their duration
    particles.forEach(particle => {
      if (particle.duration) {
        setTimeout(() => {
          removeParticle(particle.id);
        }, particle.duration);
      }
    });
  }, [particles, removeParticle]);

  const getParticleComponent = (particle) => {
    switch (particle.type) {
      case 'xp':
        return XPParticle;
      case 'levelup':
        return LevelUpParticle;
      case 'score':
        return ScoreParticle;
      default:
        return Particle;
    }
  };

  const getParticleAnimation = (particle) => {
    switch (particle.type) {
      case 'xp':
        return {
          initial: { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            x: 0
          },
          animate: { 
            opacity: 0, 
            scale: 1.5, 
            y: -100,
            x: Math.random() * 40 - 20
          },
          transition: { 
            duration: 2, 
            ease: 'easeOut' 
          }
        };
      case 'levelup':
        return {
          initial: { 
            opacity: 1, 
            scale: 0.5, 
            y: 0,
            rotate: -180
          },
          animate: { 
            opacity: 0, 
            scale: 2, 
            y: -150,
            rotate: 0
          },
          transition: { 
            duration: 3, 
            ease: 'easeOut' 
          }
        };
      case 'score':
        return {
          initial: { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            x: 0
          },
          animate: { 
            opacity: 0, 
            scale: 1.2, 
            y: -80,
            x: Math.random() * 30 - 15
          },
          transition: { 
            duration: 1.5, 
            ease: 'easeOut' 
          }
        };
      default:
        return {
          initial: { opacity: 1, scale: 1 },
          animate: { opacity: 0, scale: 0 },
          transition: { duration: 1 }
        };
    }
  };

  return (
    <ParticleContainer>
      <AnimatePresence>
        {particles.map((particle) => {
          const ParticleComponent = getParticleComponent(particle);
          const animation = getParticleAnimation(particle);
          
          return (
            <ParticleComponent
              key={particle.id}
              style={{
                left: particle.x,
                top: particle.y,
                color: particle.color
              }}
              initial={animation.initial}
              animate={animation.animate}
              exit={{ opacity: 0, scale: 0 }}
              transition={animation.transition}
              onAnimationComplete={() => {
                // Remove particle when animation completes
                setTimeout(() => {
                  removeParticle(particle.id);
                }, 100);
              }}
            >
              {particle.text}
            </ParticleComponent>
          );
        })}
      </AnimatePresence>
    </ParticleContainer>
  );
};

export default ParticleSystem;

