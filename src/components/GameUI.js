import React from 'react';
import styled from 'styled-components';
import { useGame } from '../context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';

const UIOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
  font-family: 'Orbitron', monospace;
`;

const TopBar = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  pointer-events: auto;
`;

const StatCard = styled(motion.div)`
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid ${props => props.color || '#00d4ff'};
  border-radius: 10px;
  padding: 10px 15px;
  color: white;
  backdrop-filter: blur(10px);
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #aaa;
  margin-bottom: 2px;
`;

const StatValue = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${props => props.color || '#00d4ff'};
`;

const XPBar = styled.div`
  width: 200px;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 5px;
`;

const XPProgress = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #00d4ff, #00ff88);
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
`;

const LevelIndicator = styled(motion.div)`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid #00d4ff;
  border-radius: 10px;
  padding: 10px 20px;
  color: white;
  backdrop-filter: blur(10px);
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
  pointer-events: auto;
`;

const ControlsHint = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid #4a90e2;
  border-radius: 10px;
  padding: 10px 15px;
  color: white;
  backdrop-filter: blur(10px);
  font-size: 0.9rem;
  pointer-events: auto;
`;

const PauseButton = styled(motion.button)`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid #00d4ff;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  backdrop-filter: blur(10px);
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
  pointer-events: auto;
  
  &:hover {
    background: rgba(0, 212, 255, 0.2);
    box-shadow: 0 0 30px rgba(0, 212, 255, 0.5);
  }
`;

const GameUI = () => {
  const { state, setGameState } = useGame();
  const { player, currentLevel, score, gameState } = state;

  const xpPercentage = (player.xp / player.maxXp) * 100;

  const handlePause = () => {
    if (gameState === 'playing') {
      setGameState('paused');
    } else if (gameState === 'paused') {
      setGameState('playing');
    }
  };

  return (
    <UIOverlay>
      <TopBar>
        <StatCard
          color="#00d4ff"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StatLabel>SCORE</StatLabel>
          <StatValue color="#00d4ff">{score.toLocaleString()}</StatValue>
        </StatCard>

      </TopBar>

      <LevelIndicator
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        LEVEL {currentLevel}
      </LevelIndicator>

      <StatCard
        style={{
          position: 'absolute',
          top: '20px',
          right: '80px'
        }}
        color="#00ff88"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <StatLabel>LEVEL {player.level}</StatLabel>
        <StatValue color="#00ff88">{player.xp}/{player.maxXp} XP</StatValue>
        <XPBar>
          <XPProgress
            initial={{ width: 0 }}
            animate={{ width: `${xpPercentage}%` }}
            transition={{ duration: 0.5, delay: 0.4 }}
          />
        </XPBar>
      </StatCard>

      <PauseButton
        onClick={handlePause}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {gameState === 'paused' ? '▶' : '⏸'}
      </PauseButton>

      <ControlsHint
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>CONTROLS:</div>
        <div>← → Move | ↑ Jump | Touch to move on mobile</div>
      </ControlsHint>

      <AnimatePresence>
        {gameState === 'paused' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              pointerEvents: 'auto'
            }}
          >
            <motion.h1
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              style={{ fontSize: '3rem', marginBottom: '2rem' }}
            >
              PAUSED
            </motion.h1>
            <motion.button
              onClick={() => setGameState('playing')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                background: 'linear-gradient(45deg, #00d4ff, #00ff88)',
                border: 'none',
                borderRadius: '10px',
                padding: '15px 30px',
                color: 'white',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)'
              }}
            >
              RESUME GAME
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gameState === 'levelComplete' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.9)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              pointerEvents: 'auto'
            }}
          >
            <motion.h1
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', delay: 0.2 }}
              style={{ 
                fontSize: '4rem', 
                marginBottom: '1rem',
                background: 'linear-gradient(45deg, #00d4ff, #00ff88)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 30px rgba(0, 212, 255, 0.5)'
              }}
            >
              LEVEL COMPLETE!
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{ fontSize: '1.5rem', marginBottom: '2rem' }}
            >
              Score: {score.toLocaleString()} | XP: {player.xp}
            </motion.div>
            <motion.button
              onClick={() => setGameState('playing')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                background: 'linear-gradient(45deg, #00d4ff, #00ff88)',
                border: 'none',
                borderRadius: '10px',
                padding: '15px 30px',
                color: 'white',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)'
              }}
            >
              CONTINUE
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </UIOverlay>
  );
};

export default GameUI;

