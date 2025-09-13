import React, { useRef, useEffect, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import Player from './Player';
import Level from './Level';
import ParticleSystem from './ParticleSystem';
import './GameEngine.css';

const GameEngine = () => {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const lastTimeRef = useRef(0);
  const { state, setPlayerPosition, setPlayerVelocity, setPlayerState, triggerQuestion } = useGame();

  // Game constants
  const GRAVITY = 0.6;
  const FRICTION = 0.8;
  const JUMP_FORCE = -12;
  const MOVE_SPEED = 4;
  const CANVAS_WIDTH = Math.min(window.innerWidth, 2000);
  const CANVAS_HEIGHT = Math.min(window.innerHeight, 1000);

  // Input handling
  const keys = useRef({
    left: false,
    right: false,
    up: false,
    space: false
  });

  // Handle keyboard input
  const handleKeyDown = useCallback((e) => {
    switch (e.code) {
      case 'ArrowLeft':
      case 'KeyA':
        keys.current.left = true;
        e.preventDefault();
        break;
      case 'ArrowRight':
      case 'KeyD':
        keys.current.right = true;
        e.preventDefault();
        break;
      case 'ArrowUp':
      case 'KeyW':
      case 'Space':
        keys.current.up = true;
        e.preventDefault();
        break;
      case 'Escape':
        // Pause game
        break;
    }
  }, []);

  const handleKeyUp = useCallback((e) => {
    switch (e.code) {
      case 'ArrowLeft':
      case 'KeyA':
        keys.current.left = false;
        break;
      case 'ArrowRight':
      case 'KeyD':
        keys.current.right = false;
        break;
      case 'ArrowUp':
      case 'KeyW':
      case 'Space':
        keys.current.up = false;
        break;
    }
  }, []);

  // Touch controls for mobile
  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    // Simple touch controls - left half for left, right half for right, tap for jump
    if (x < CANVAS_WIDTH / 2) {
      keys.current.left = true;
    } else {
      keys.current.right = true;
    }
    keys.current.up = true;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    e.preventDefault();
    keys.current.left = false;
    keys.current.right = false;
    keys.current.up = false;
  }, []);

  // Physics and collision detection
  const checkCollision = useCallback((player, platforms) => {
    const playerRect = {
      x: player.x,
      y: player.y,
      width: player.width,
      height: player.height
    };

    for (const platform of platforms) {
      if (
        playerRect.x < platform.x + platform.width &&
        playerRect.x + playerRect.width > platform.x &&
        playerRect.y < platform.y + platform.height &&
        playerRect.y + playerRect.height > platform.y
      ) {
        return platform;
      }
    }
    return null;
  }, []);

  const checkQuestionStationCollision = useCallback((player, stations) => {
    const playerRect = {
      x: player.x,
      y: player.y,
      width: player.width,
      height: player.height
    };

    for (const station of stations) {
      if (
        playerRect.x < station.x + station.width &&
        playerRect.x + playerRect.width > station.x &&
        playerRect.y < station.y + station.height &&
        playerRect.y + playerRect.height > station.y
      ) {
        return station;
      }
    }
    return null;
  }, []);

  // Main game loop
  const gameLoop = useCallback((currentTime) => {
    if (!canvasRef.current) return;

    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;

    // Skip frame if deltaTime is too large (tab switching, etc.)
    if (deltaTime > 100) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Update player physics
    let newVx = state.player.vx;
    let newVy = state.player.vy;
    let newX = state.player.x;
    let newY = state.player.y;
    let newState = state.player.state;

    // Handle input
    if (keys.current.left && !keys.current.right) {
      newVx = -MOVE_SPEED;
      newState = 'running';
    } else if (keys.current.right && !keys.current.left) {
      newVx = MOVE_SPEED;
      newState = 'running';
    } else {
      newVx *= FRICTION;
      if (Math.abs(newVx) < 0.1) {
        newVx = 0;
        if (newState === 'running') newState = 'idle';
      }
    }

    // Jumping
    if (keys.current.up && newState !== 'jumping' && newState !== 'falling') {
      newVy = JUMP_FORCE;
      newState = 'jumping';
    }

    // Apply gravity
    newVy += GRAVITY;

    // Update position
    newX += newVx;
    newY += newVy;

    // Get current level data
    const currentLevelData = getLevelData(state.currentLevel);
    const platforms = currentLevelData.platforms;
    const questionStations = currentLevelData.questionStations;

    // Check platform collisions
    const tempPlayer = { x: newX, y: newY, width: state.player.width, height: state.player.height };
    const collidedPlatform = checkCollision(tempPlayer, platforms);

    if (collidedPlatform) {
      // Landing on top of platform
      if (newVy > 0 && newY + state.player.height > collidedPlatform.y) {
        newY = collidedPlatform.y - state.player.height;
        newVy = 0;
        if (newState === 'jumping' || newState === 'falling') {
          newState = 'idle';
        }
      }
      // Hitting platform from below
      else if (newVy < 0 && newY < collidedPlatform.y + collidedPlatform.height) {
        newY = collidedPlatform.y + collidedPlatform.height;
        newVy = 0;
        newState = 'falling';
      }
      // Hitting platform from the side
      else if (newVx > 0 && newX + state.player.width > collidedPlatform.x) {
        newX = collidedPlatform.x - state.player.width;
        newVx = 0;
      } else if (newVx < 0 && newX < collidedPlatform.x + collidedPlatform.width) {
        newX = collidedPlatform.x + collidedPlatform.width;
        newVx = 0;
      }
    } else {
      // No platform collision - check if falling
      if (newVy > 0 && newState !== 'jumping') {
        newState = 'falling';
      }
    }

    // Check question station collisions
    if (state.gameState === 'playing') {
      const collidedStation = checkQuestionStationCollision(tempPlayer, questionStations);
      if (collidedStation && !state.showQuestionModal) {
        // Trigger question modal
        triggerQuestion(collidedStation);
      }
    }

    // Boundary checks
    if (newX < 0) {
      newX = 0;
      newVx = 0;
    }
    if (newX + state.player.width > CANVAS_WIDTH) {
      newX = CANVAS_WIDTH - state.player.width;
      newVx = 0;
    }
    if (newY > CANVAS_HEIGHT) {
      // Player fell off the world - reset position
      newY = 100;
      newX = 100;
      newVy = 0;
    }

    // Update player state
    setPlayerPosition(newX, newY);
    setPlayerVelocity(newVx, newVy);
    setPlayerState(newState);

    // Render game
    renderGame(ctx);

    // Continue game loop
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [state, setPlayerPosition, setPlayerVelocity, setPlayerState, checkCollision, checkQuestionStationCollision]);

  // Render game
  const renderGame = useCallback((ctx) => {
    // Draw background
    drawBackground(ctx);

    // Get current level data
    const currentLevelData = getLevelData(state.currentLevel);

    // Draw level
    drawLevel(ctx, currentLevelData);

    // Draw player
    drawPlayer(ctx, state.player);

    // Draw particles
    drawParticles(ctx, state.particles);
  }, [state]);

  // Draw background
  const drawBackground = useCallback((ctx) => {
    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(0.7, '#98FB98');
    gradient.addColorStop(1, '#90EE90');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 5; i++) {
      const x = (i * 200 + (Date.now() * 0.01) % 200) % (CANVAS_WIDTH + 100);
      const y = 50 + Math.sin(i) * 20;
      drawCloud(ctx, x, y);
    }
  }, []);

  // Draw cloud
  const drawCloud = useCallback((ctx, x, y) => {
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.arc(x + 25, y, 25, 0, Math.PI * 2);
    ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
    ctx.arc(x + 25, y - 15, 20, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  // Draw level
  const drawLevel = useCallback((ctx, levelData) => {
    // Draw platforms
    ctx.fillStyle = '#8B4513';
    levelData.platforms.forEach(platform => {
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      
      // Add some texture
      ctx.fillStyle = '#A0522D';
      ctx.fillRect(platform.x + 2, platform.y + 2, platform.width - 4, platform.height - 4);
      ctx.fillStyle = '#8B4513';
    });

    // Draw question stations
    levelData.questionStations.forEach(station => {
      drawQuestionStation(ctx, station);
    });
  }, []);

  // Draw question station
  const drawQuestionStation = useCallback((ctx, station) => {
    const x = station.x;
    const y = station.y;
    const width = station.width;
    const height = station.height;

    // Station base
    ctx.fillStyle = '#4A90E2';
    ctx.fillRect(x, y, width, height);

    // Glowing effect
    ctx.shadowColor = '#4A90E2';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#6BB6FF';
    ctx.fillRect(x + 5, y + 5, width - 10, height - 10);
    ctx.shadowBlur = 0;

    // Question mark
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('?', x + width / 2, y + height / 2 + 8);
  }, []);

  // Draw player
  const drawPlayer = useCallback((ctx, player) => {
    const x = player.x;
    const y = player.y;
    const width = player.width;
    const height = player.height;

    // Player body
    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(x, y, width, height);

    // Player head
    ctx.fillStyle = '#FFB6C1';
    ctx.fillRect(x + 8, y - 8, 16, 16);

    // Eyes
    ctx.fillStyle = 'black';
    ctx.fillRect(x + 10, y - 6, 3, 3);
    ctx.fillRect(x + 19, y - 6, 3, 3);

    // Simple animation based on state
    if (player.state === 'running') {
      // Add running animation effect
      ctx.fillStyle = 'rgba(255, 107, 107, 0.3)';
      ctx.fillRect(x - 5, y + height - 5, width + 10, 5);
    }
  }, []);

  // Draw particles
  const drawParticles = useCallback((ctx, particles) => {
    particles.forEach(particle => {
      ctx.fillStyle = particle.color || '#00FF88';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(particle.text, particle.x, particle.y);
    });
  }, []);

  // Get level data
  const getLevelData = useCallback((level) => {
    const groundY = CANVAS_HEIGHT - 100;
    const levelData = {
      1: {
        platforms: [
          { x: 0, y: groundY, width: 200, height: 50 },
          { x: 250, y: groundY - 50, width: 150, height: 50 },
          { x: 450, y: groundY - 100, width: 150, height: 50 },
          { x: 650, y: groundY - 150, width: 150, height: 50 },
          { x: 850, y: groundY - 200, width: 150, height: 50 },
          { x: 1050, y: groundY - 250, width: 150, height: 50 },
          { x: 1250, y: groundY - 300, width: 150, height: 50 },
          { x: 1450, y: groundY - 350, width: 150, height: 50 }
        ],
        questionStations: [
          { x: 200, y: groundY - 100, width: 50, height: 50, difficulty: 'easy', id: 1 },
          { x: 400, y: groundY - 150, width: 50, height: 50, difficulty: 'easy', id: 2 },
          { x: 600, y: groundY - 200, width: 50, height: 50, difficulty: 'easy', id: 3 },
          { x: 800, y: groundY - 250, width: 50, height: 50, difficulty: 'easy', id: 4 },
          { x: 1000, y: groundY - 300, width: 50, height: 50, difficulty: 'easy', id: 5 }
        ]
      },
      2: {
        platforms: [
          { x: 0, y: groundY, width: 150, height: 50 },
          { x: 200, y: groundY - 50, width: 100, height: 50 },
          { x: 350, y: groundY - 100, width: 100, height: 50 },
          { x: 500, y: groundY - 150, width: 100, height: 50 },
          { x: 650, y: groundY - 200, width: 100, height: 50 },
          { x: 800, y: groundY - 250, width: 100, height: 50 },
          { x: 950, y: groundY - 300, width: 100, height: 50 },
          { x: 1100, y: groundY - 350, width: 100, height: 50 },
          { x: 1250, y: groundY - 400, width: 100, height: 50 },
          { x: 1400, y: groundY - 450, width: 100, height: 50 }
        ],
        questionStations: [
          { x: 150, y: groundY - 100, width: 50, height: 50, difficulty: 'medium', id: 6 },
          { x: 300, y: groundY - 150, width: 50, height: 50, difficulty: 'medium', id: 7 },
          { x: 450, y: groundY - 200, width: 50, height: 50, difficulty: 'medium', id: 8 },
          { x: 600, y: groundY - 250, width: 50, height: 50, difficulty: 'medium', id: 9 },
          { x: 750, y: groundY - 300, width: 50, height: 50, difficulty: 'medium', id: 10 },
          { x: 900, y: groundY - 350, width: 50, height: 50, difficulty: 'medium', id: 11 }
        ]
      },
      3: {
        platforms: [
          { x: 0, y: groundY, width: 120, height: 50 },
          { x: 180, y: groundY - 40, width: 100, height: 50 },
          { x: 330, y: groundY - 80, width: 100, height: 50 },
          { x: 480, y: groundY - 120, width: 100, height: 50 },
          { x: 630, y: groundY - 160, width: 100, height: 50 },
          { x: 780, y: groundY - 200, width: 100, height: 50 },
          { x: 930, y: groundY - 240, width: 100, height: 50 },
          { x: 1080, y: groundY - 280, width: 100, height: 50 },
          { x: 1230, y: groundY - 320, width: 100, height: 50 },
          { x: 1380, y: groundY - 360, width: 100, height: 50 },
          { x: 1530, y: groundY - 400, width: 100, height: 50 },
          { x: 1680, y: groundY - 440, width: 100, height: 50 }
        ],
        questionStations: [
          { x: 120, y: groundY - 90, width: 50, height: 50, difficulty: 'hard', id: 12 },
          { x: 270, y: groundY - 130, width: 50, height: 50, difficulty: 'hard', id: 13 },
          { x: 420, y: groundY - 170, width: 50, height: 50, difficulty: 'hard', id: 14 },
          { x: 570, y: groundY - 210, width: 50, height: 50, difficulty: 'hard', id: 15 },
          { x: 720, y: groundY - 250, width: 50, height: 50, difficulty: 'hard', id: 16 },
          { x: 870, y: groundY - 290, width: 50, height: 50, difficulty: 'hard', id: 17 },
          { x: 1020, y: groundY - 330, width: 50, height: 50, difficulty: 'hard', id: 18 }
        ]
      },
      4: {
        platforms: [
          { x: 0, y: groundY, width: 100, height: 50 },
          { x: 150, y: groundY - 30, width: 80, height: 50 },
          { x: 280, y: groundY - 60, width: 80, height: 50 },
          { x: 410, y: groundY - 90, width: 80, height: 50 },
          { x: 540, y: groundY - 120, width: 80, height: 50 },
          { x: 670, y: groundY - 150, width: 80, height: 50 },
          { x: 800, y: groundY - 180, width: 80, height: 50 },
          { x: 930, y: groundY - 210, width: 80, height: 50 },
          { x: 1060, y: groundY - 240, width: 80, height: 50 },
          { x: 1190, y: groundY - 270, width: 80, height: 50 },
          { x: 1320, y: groundY - 300, width: 80, height: 50 },
          { x: 1450, y: groundY - 330, width: 80, height: 50 },
          { x: 1580, y: groundY - 360, width: 80, height: 50 },
          { x: 1710, y: groundY - 390, width: 80, height: 50 },
          { x: 1840, y: groundY - 420, width: 80, height: 50 }
        ],
        questionStations: [
          { x: 100, y: groundY - 80, width: 50, height: 50, difficulty: 'easy', id: 19 },
          { x: 230, y: groundY - 110, width: 50, height: 50, difficulty: 'medium', id: 20 },
          { x: 360, y: groundY - 140, width: 50, height: 50, difficulty: 'hard', id: 21 },
          { x: 490, y: groundY - 170, width: 50, height: 50, difficulty: 'easy', id: 22 },
          { x: 620, y: groundY - 200, width: 50, height: 50, difficulty: 'medium', id: 23 },
          { x: 750, y: groundY - 230, width: 50, height: 50, difficulty: 'hard', id: 24 },
          { x: 880, y: groundY - 260, width: 50, height: 50, difficulty: 'easy', id: 25 },
          { x: 1010, y: groundY - 290, width: 50, height: 50, difficulty: 'medium', id: 26 },
          { x: 1140, y: groundY - 320, width: 50, height: 50, difficulty: 'hard', id: 27 }
        ]
      },
      5: {
        platforms: [
          { x: 0, y: groundY, width: 80, height: 50 },
          { x: 120, y: groundY - 25, width: 70, height: 50 },
          { x: 230, y: groundY - 50, width: 70, height: 50 },
          { x: 340, y: groundY - 75, width: 70, height: 50 },
          { x: 450, y: groundY - 100, width: 70, height: 50 },
          { x: 560, y: groundY - 125, width: 70, height: 50 },
          { x: 670, y: groundY - 150, width: 70, height: 50 },
          { x: 780, y: groundY - 175, width: 70, height: 50 },
          { x: 890, y: groundY - 200, width: 70, height: 50 },
          { x: 1000, y: groundY - 225, width: 70, height: 50 },
          { x: 1110, y: groundY - 250, width: 70, height: 50 },
          { x: 1220, y: groundY - 275, width: 70, height: 50 },
          { x: 1330, y: groundY - 300, width: 70, height: 50 },
          { x: 1440, y: groundY - 325, width: 70, height: 50 },
          { x: 1550, y: groundY - 350, width: 70, height: 50 },
          { x: 1660, y: groundY - 375, width: 70, height: 50 },
          { x: 1770, y: groundY - 400, width: 70, height: 50 },
          { x: 1880, y: groundY - 425, width: 70, height: 50 },
          { x: 1990, y: groundY - 450, width: 70, height: 50 }
        ],
        questionStations: [
          { x: 80, y: groundY - 75, width: 50, height: 50, difficulty: 'medium', id: 28 },
          { x: 190, y: groundY - 100, width: 50, height: 50, difficulty: 'hard', id: 29 },
          { x: 300, y: groundY - 125, width: 50, height: 50, difficulty: 'easy', id: 30 },
          { x: 410, y: groundY - 150, width: 50, height: 50, difficulty: 'medium', id: 31 },
          { x: 520, y: groundY - 175, width: 50, height: 50, difficulty: 'hard', id: 32 },
          { x: 630, y: groundY - 200, width: 50, height: 50, difficulty: 'easy', id: 33 },
          { x: 740, y: groundY - 225, width: 50, height: 50, difficulty: 'medium', id: 34 },
          { x: 850, y: groundY - 250, width: 50, height: 50, difficulty: 'hard', id: 35 },
          { x: 960, y: groundY - 275, width: 50, height: 50, difficulty: 'easy', id: 36 },
          { x: 1070, y: groundY - 300, width: 50, height: 50, difficulty: 'medium', id: 37 },
          { x: 1180, y: groundY - 325, width: 50, height: 50, difficulty: 'hard', id: 38 },
          { x: 1290, y: groundY - 350, width: 50, height: 50, difficulty: 'easy', id: 39 }
        ]
      }
    };

    return levelData[level] || levelData[1];
  }, [CANVAS_HEIGHT]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const newWidth = Math.min(window.innerWidth, 2000);
        const newHeight = Math.min(window.innerHeight, 1000);
        canvas.width = newWidth;
        canvas.height = newHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial setup

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Set up event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Keyboard events
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Touch events
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

    // Start game loop
    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [handleKeyDown, handleKeyUp, handleTouchStart, handleTouchEnd, gameLoop]);

  return (
    <div className="game-engine">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="game-canvas"
      />
      <ParticleSystem />
    </div>
  );
};

export default GameEngine;
