import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import GameEngine from './components/GameEngine';
import GameUI from './components/GameUI';
import QuestionModal from './components/QuestionModal';
import { GameProvider } from './context/GameContext';
import './App.css';

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  overflow: hidden;
`;

const LoadingScreen = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  color: white;
  font-family: 'Orbitron', monospace;
`;

const LoadingText = styled.h1`
  font-size: 3rem;
  margin-bottom: 2rem;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
`;

const LoadingBar = styled.div`
  width: 300px;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 1rem;
`;

const LoadingProgress = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #00d4ff, #00ff88);
  border-radius: 3px;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
`;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Simulate loading with progress updates
    const loadingInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(loadingInterval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(loadingInterval);
  }, []);

  if (isLoading) {
    return (
      <LoadingScreen>
        <LoadingText>LeetCode Quest</LoadingText>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
          Loading your coding adventure...
        </p>
        <LoadingBar>
          <LoadingProgress progress={loadingProgress} />
        </LoadingBar>
      </LoadingScreen>
    );
  }

  return (
    <GameProvider>
      <AppContainer>
        <GameEngine />
        <GameUI />
        <QuestionModal />
      </AppContainer>
    </GameProvider>
  );
}

export default App;

