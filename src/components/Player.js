import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const PlayerContainer = styled(motion.div)`
  position: absolute;
  width: 32px;
  height: 48px;
  z-index: 10;
`;

const PlayerSprite = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);
  border-radius: 8px 8px 4px 4px;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  
  /* Player head */
  &::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 8px;
    width: 16px;
    height: 16px;
    background: linear-gradient(135deg, #ffb6c1 0%, #ffc0cb 100%);
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  /* Eyes */
  &::after {
    content: '';
    position: absolute;
    top: -6px;
    left: 10px;
    width: 3px;
    height: 3px;
    background: black;
    border-radius: 50%;
    box-shadow: 9px 0 0 black;
  }
`;

const PlayerShadow = styled.div`
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  filter: blur(2px);
`;

const Player = ({ player }) => {
  const getAnimationVariant = (state) => {
    switch (state) {
      case 'running':
        return {
          x: [0, 2, 0, -2, 0],
          transition: {
            duration: 0.3,
            repeat: Infinity,
            ease: 'easeInOut'
          }
        };
      case 'jumping':
        return {
          scale: [1, 1.1, 1],
          transition: {
            duration: 0.2,
            ease: 'easeOut'
          }
        };
      case 'falling':
        return {
          scale: [1, 0.95, 1],
          transition: {
            duration: 0.4,
            repeat: Infinity,
            ease: 'easeInOut'
          }
        };
      default:
        return {
          scale: 1,
          transition: { duration: 0.2 }
        };
    }
  };

  return (
    <PlayerContainer
      style={{
        left: player.x,
        top: player.y
      }}
      animate={getAnimationVariant(player.state)}
    >
      <PlayerSprite />
      <PlayerShadow />
    </PlayerContainer>
  );
};

export default Player;

