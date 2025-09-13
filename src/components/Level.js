import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const LevelContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const Platform = styled(motion.div)`
  position: absolute;
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
  border: 2px solid #654321;
  box-shadow: 
    inset 0 2px 4px rgba(255, 255, 255, 0.1),
    0 4px 8px rgba(0, 0, 0, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    right: 2px;
    bottom: 2px;
    background: linear-gradient(135deg, #A0522D 0%, #8B4513 100%);
    border-radius: inherit;
  }
`;

const QuestionStation = styled(motion.div)`
  position: absolute;
  background: linear-gradient(135deg, #4A90E2 0%, #6BB6FF 100%);
  border: 3px solid #00d4ff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: 'Orbitron', monospace;
  font-weight: bold;
  font-size: 1.2rem;
  box-shadow: 
    0 0 20px rgba(0, 212, 255, 0.5),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);
  cursor: pointer;
  
  &::before {
    content: '?';
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  }
`;

const Collectible = styled(motion.div)`
  position: absolute;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  border: 2px solid #FF8C00;
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
  
  &::before {
    content: '★';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 0.8rem;
    text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  }
`;

const Enemy = styled(motion.div)`
  position: absolute;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #ff1744 0%, #d50000 100%);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  &::before {
    content: '👾';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.8rem;
  }
`;

const Level = ({ levelData, playerPosition }) => {
  const { platforms = [], questionStations = [], collectibles = [], enemies = [] } = levelData;

  return (
    <LevelContainer>
      {/* Platforms */}
      {platforms.map((platform, index) => (
        <Platform
          key={`platform-${index}`}
          style={{
            left: platform.x,
            top: platform.y,
            width: platform.width,
            height: platform.height
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        />
      ))}

      {/* Question Stations */}
      {questionStations.map((station, index) => (
        <QuestionStation
          key={`station-${station.id}`}
          style={{
            left: station.x,
            top: station.y,
            width: station.width,
            height: station.height
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.2 + 0.5, duration: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        />
      ))}

      {/* Collectibles */}
      {collectibles.map((collectible, index) => (
        <Collectible
          key={`collectible-${index}`}
          style={{
            left: collectible.x,
            top: collectible.y
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [0, -5, 0]
          }}
          transition={{ 
            delay: index * 0.1 + 1,
            duration: 0.5,
            y: {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }
          }}
        />
      ))}

      {/* Enemies */}
      {enemies.map((enemy, index) => (
        <Enemy
          key={`enemy-${index}`}
          style={{
            left: enemy.x,
            top: enemy.y
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ 
            opacity: 1, 
            x: 0,
            x: [0, 20, 0]
          }}
          transition={{ 
            delay: index * 0.2 + 1.5,
            duration: 0.5,
            x: {
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }
          }}
        />
      ))}
    </LevelContainer>
  );
};

export default Level;

