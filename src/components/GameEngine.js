import React, { useRef, useEffect, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import ParticleSystem from './ParticleSystem';
import './GameEngine.css';

const GameEngine = () => {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const lastTimeRef = useRef(0);
  const { state, dispatch, setPlayerPosition, setPlayerVelocity, setPlayerState, triggerQuestion } = useGame();

  // Game constants - Fireboy and Watergirl style
  const GRAVITY = 0.8; // Stronger gravity for more realistic falling
  const FRICTION = 0.85; // Better friction for smoother stopping
  const AIR_FRICTION = 0.95; // Less friction in air for better jumping
  const JUMP_FORCE = -15; // Stronger jump force
  const MOVE_SPEED = 5; // Faster movement
  const ACCELERATION = 0.8; // Acceleration for smoother movement
  const MAX_SPEED = 6; // Maximum movement speed
  const CANVAS_WIDTH = Math.min(window.innerWidth, 2000);
  const CANVAS_HEIGHT = Math.min(window.innerHeight, 1000);
  const CAMERA_OFFSET_X = CANVAS_WIDTH * 0.3; // Camera follows player when they're 30% from left edge
  const CAMERA_OFFSET_Y = CANVAS_HEIGHT * 0.3; // Camera follows player when they're 30% from top edge

  // Input handling
  const keys = useRef({
    left: false,
    right: false,
    up: false,
    space: false
  });

  // Handle keyboard input
  const handleKeyDown = useCallback((e) => {
    // Don't handle game controls when question modal is open
    if (state.showQuestionModal) {
      return;
    }
    
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
      default:
        // Handle other keys if needed
        break;
    }
  }, [state.showQuestionModal]);

  const handleKeyUp = useCallback((e) => {
    // Don't handle game controls when question modal is open
    if (state.showQuestionModal) {
      return;
    }
    
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
      default:
        // Handle other keys if needed
        break;
    }
  }, [state.showQuestionModal]);

  // Touch controls for mobile
  const handleTouchStart = useCallback((e) => {
    // Don't handle touch controls when question modal is open
    if (state.showQuestionModal) {
      return;
    }
    
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;

    // Simple touch controls - left half for left, right half for right, tap for jump
    if (x < CANVAS_WIDTH / 2) {
      keys.current.left = true;
    } else {
      keys.current.right = true;
    }
    keys.current.up = true;
  }, [CANVAS_WIDTH, state.showQuestionModal]);

  const handleTouchEnd = useCallback((e) => {
    // Don't handle touch controls when question modal is open
    if (state.showQuestionModal) {
      return;
    }
    
    e.preventDefault();
    keys.current.left = false;
    keys.current.right = false;
    keys.current.up = false;
  }, [state.showQuestionModal]);

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

  // Camera system
  const updateCamera = useCallback((playerX, playerY) => {
    const newCameraX = Math.max(0, playerX - CAMERA_OFFSET_X);
    const newCameraY = Math.max(0, playerY - CAMERA_OFFSET_Y);
    
    // Update camera position in state if it changed significantly
    if (Math.abs(newCameraX - state.camera.x) > 5 || Math.abs(newCameraY - state.camera.y) > 5) {
      dispatch({ type: 'SET_CAMERA', x: newCameraX, y: newCameraY });
    }
  }, [state.camera.x, state.camera.y, CAMERA_OFFSET_X, CAMERA_OFFSET_Y, dispatch]);

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


    // Get current level data
    const currentLevelData = getLevelData(state.currentLevel);
    const questionStations = currentLevelData.questionStations;
    
    // Handle input and physics - only when not in question modal
    if (!state.showQuestionModal) {
      // Fireboy and Watergirl style movement with momentum
      const isOnGround = newState === 'idle' || newState === 'running';
      const currentFriction = isOnGround ? FRICTION : AIR_FRICTION;
      
      // Horizontal movement with acceleration
      if (keys.current.left && !keys.current.right) {
        newVx = Math.max(newVx - ACCELERATION, -MAX_SPEED);
        newState = 'running';
      } else if (keys.current.right && !keys.current.left) {
        newVx = Math.min(newVx + ACCELERATION, MAX_SPEED);
        newState = 'running';
      } else {
        // Apply friction
        newVx *= currentFriction;
        if (Math.abs(newVx) < 0.1) {
          newVx = 0;
          if (newState === 'running') newState = 'idle';
        }
      }

      // Jumping - only when on ground
      if (keys.current.up && isOnGround) {
        newVy = JUMP_FORCE;
        newState = 'jumping';
      }

      // Apply gravity
      newVy += GRAVITY;
      
      // Limit fall speed (terminal velocity)
      if (newVy > 15) {
        newVy = 15;
      }

      // Update position
      newX += newVx;
      newY += newVy;
    } else {
      // When modal is open, freeze the player completely
      newVx = 0;
      newVy = 0;
      newX = state.player.x;
      newY = state.player.y;
      newState = state.player.state;
    }


    // Use the level data already declared above
    const platforms = currentLevelData.platforms;

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
    if (state.gameState === 'playing' && !state.showQuestionModal) {
      const collidedStation = checkQuestionStationCollision(tempPlayer, questionStations);
      if (collidedStation) {
        // Check if this station was already completed
        const stationId = collidedStation.id;
        const completedStations = state.completedStations || [];
        const isCompleted = completedStations.includes(stationId);
        
        
        if (!isCompleted) {
          // Trigger question modal
          triggerQuestion(collidedStation);
        }
      }
    }

    // Update camera based on player position
    updateCamera(newX, newY);

    // Boundary checks - now relative to world, not screen
    const worldWidth = 3000; // Total world width
    const worldHeight = CANVAS_HEIGHT + 200; // Total world height
    
    if (newX < 0) {
      newX = 0;
      newVx = 0;
    }
    if (newX + state.player.width > worldWidth) {
      newX = worldWidth - state.player.width;
      newVx = 0;
    }
    if (newY > worldHeight) {
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
    renderGame(ctx, currentLevelData);

    // Continue game loop
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [state, setPlayerPosition, setPlayerVelocity, setPlayerState, checkCollision, checkQuestionStationCollision]);

  // Render game
  const renderGame = useCallback((ctx, levelData) => {
    // Save canvas state
    ctx.save();
    
    // Apply camera transform
    ctx.translate(-state.camera.x, -state.camera.y);
    
    // Draw background
    drawBackground(ctx);

    // Draw level
    drawLevel(ctx, levelData);

    // Draw player
    drawPlayer(ctx, state.player);

    // Draw particles
    drawParticles(ctx, state.particles);
    
    // Restore canvas state
    ctx.restore();
  }, [state]);

  // Draw background - Fireboy and Watergirl style
  const drawBackground = useCallback((ctx) => {
    const worldWidth = 3000; // Total world width
    const worldHeight = CANVAS_HEIGHT + 200; // Total world height
    
    // Fireboy and Watergirl style gradient - more vibrant
    const gradient = ctx.createLinearGradient(0, 0, 0, worldHeight);
    gradient.addColorStop(0, '#4A90E2'); // Bright blue sky
    gradient.addColorStop(0.3, '#87CEEB'); // Light blue
    gradient.addColorStop(0.7, '#98FB98'); // Light green
    gradient.addColorStop(1, '#228B22'); // Forest green ground
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, worldWidth, worldHeight);

    // Add some decorative elements
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < 20; i++) {
      const x = (i * 150 + (Date.now() * 0.005) % 150) % (worldWidth + 100);
      const y = 30 + Math.sin(i * 0.5) * 15;
      drawCloud(ctx, x, y);
    }
    
    // Add some floating particles for atmosphere
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 10; i++) {
      const x = (i * 300 + (Date.now() * 0.02) % 300) % worldWidth;
      const y = 100 + Math.sin(i + Date.now() * 0.001) * 50;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
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

  // Draw level - Fireboy and Watergirl style
  const drawLevel = useCallback((ctx, levelData) => {
    // Draw platforms with better styling
    levelData.platforms.forEach(platform => {
      // Main platform body
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      
      // Platform highlight
      ctx.fillStyle = '#A0522D';
      ctx.fillRect(platform.x + 2, platform.y + 2, platform.width - 4, 8);
      
      // Platform shadow
      ctx.fillStyle = '#654321';
      ctx.fillRect(platform.x + 2, platform.y + platform.height - 6, platform.width - 4, 4);
      
      // Platform border
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 2;
      ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
    });

    // Draw question stations
    levelData.questionStations.forEach(station => {
      drawQuestionStation(ctx, station);
    });
  }, []);

  // Draw question station - Fireboy and Watergirl style
  const drawQuestionStation = useCallback((ctx, station) => {
    const x = station.x;
    const y = station.y;
    const width = station.width;
    const height = station.height;
    
    // Check if station is completed
    const isCompleted = state.completedStations && state.completedStations.includes(station.id);
    
    // Floating animation
    const floatOffset = Math.sin(Date.now() * 0.003 + station.id) * 3;
    const drawY = y + floatOffset;

    if (isCompleted) {
      // Completed station - diamond with checkmark
      ctx.shadowColor = '#4CAF50';
      ctx.shadowBlur = 15;
      
      // Diamond shape
      ctx.fillStyle = '#4CAF50';
      ctx.beginPath();
      ctx.moveTo(x + width/2, drawY);
      ctx.lineTo(x + width, drawY + height/2);
      ctx.lineTo(x + width/2, drawY + height);
      ctx.lineTo(x, drawY + height/2);
      ctx.closePath();
      ctx.fill();
      
      ctx.shadowBlur = 0;
      
      // Inner diamond
      ctx.fillStyle = '#66BB6A';
      ctx.beginPath();
      ctx.moveTo(x + width/2, drawY + 5);
      ctx.lineTo(x + width - 5, drawY + height/2);
      ctx.lineTo(x + width/2, drawY + height - 5);
      ctx.lineTo(x + 5, drawY + height/2);
      ctx.closePath();
      ctx.fill();
      
      // Checkmark
      ctx.fillStyle = 'white';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('✓', x + width / 2, drawY + height / 2 + 6);
    } else {
      // Active station - glowing diamond with question mark
      ctx.shadowColor = '#4A90E2';
      ctx.shadowBlur = 20;
      
      // Outer glow
      ctx.fillStyle = 'rgba(74, 144, 226, 0.3)';
      ctx.beginPath();
      ctx.arc(x + width/2, drawY + height/2, width/2 + 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Diamond shape
      ctx.fillStyle = '#4A90E2';
      ctx.beginPath();
      ctx.moveTo(x + width/2, drawY);
      ctx.lineTo(x + width, drawY + height/2);
      ctx.lineTo(x + width/2, drawY + height);
      ctx.lineTo(x, drawY + height/2);
      ctx.closePath();
      ctx.fill();
      
      ctx.shadowBlur = 0;
      
      // Inner diamond
      ctx.fillStyle = '#6BB6FF';
      ctx.beginPath();
      ctx.moveTo(x + width/2, drawY + 5);
      ctx.lineTo(x + width - 5, drawY + height/2);
      ctx.lineTo(x + width/2, drawY + height - 5);
      ctx.lineTo(x + 5, drawY + height/2);
      ctx.closePath();
      ctx.fill();
      
      // Question mark
      ctx.fillStyle = 'white';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('?', x + width / 2, drawY + height / 2 + 6);
    }
  }, [state.completedStations]);

  // Draw player - Fireboy and Watergirl style
  const drawPlayer = useCallback((ctx, player) => {
    const x = player.x;
    const y = player.y;
    const width = player.width;
    const height = player.height;

    // Player shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(x + 2, y + height + 2, width, 4);

    // Player body - Fireboy style (red/orange)
    const bodyGradient = ctx.createLinearGradient(x, y, x, y + height);
    bodyGradient.addColorStop(0, '#FF4444'); // Bright red top
    bodyGradient.addColorStop(1, '#CC0000'); // Darker red bottom
    ctx.fillStyle = bodyGradient;
    ctx.fillRect(x, y, width, height);

    // Player head
    const headGradient = ctx.createLinearGradient(x + 8, y - 8, x + 8, y + 8);
    headGradient.addColorStop(0, '#FFB6C1'); // Light pink top
    headGradient.addColorStop(1, '#FF8FA3'); // Darker pink bottom
    ctx.fillStyle = headGradient;
    ctx.fillRect(x + 8, y - 8, 16, 16);

    // Eyes
    ctx.fillStyle = 'white';
    ctx.fillRect(x + 10, y - 6, 4, 4);
    ctx.fillRect(x + 18, y - 6, 4, 4);
    
    ctx.fillStyle = 'black';
    ctx.fillRect(x + 11, y - 5, 2, 2);
    ctx.fillRect(x + 19, y - 5, 2, 2);

    // Mouth
    ctx.fillStyle = 'black';
    ctx.fillRect(x + 14, y - 2, 4, 1);

    // Animation effects
    if (player.state === 'running') {
      // Running dust particles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      for (let i = 0; i < 3; i++) {
        const dustX = x - 5 - i * 3 + Math.sin(Date.now() * 0.01 + i) * 2;
        const dustY = y + height - 2 + Math.sin(Date.now() * 0.02 + i) * 1;
        ctx.fillRect(dustX, dustY, 2, 2);
      }
    }
    
    if (player.state === 'jumping') {
      // Jumping sparkles
      ctx.fillStyle = 'rgba(255, 255, 0, 0.8)';
      for (let i = 0; i < 2; i++) {
        const sparkleX = x + width/2 + Math.sin(Date.now() * 0.01 + i) * 5;
        const sparkleY = y + height + Math.sin(Date.now() * 0.02 + i) * 3;
        ctx.fillRect(sparkleX, sparkleY, 1, 1);
      }
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
    const groundY = CANVAS_HEIGHT - 50; // Lower ground level
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
          { x: 1450, y: groundY - 350, width: 150, height: 50 },
          { x: 1650, y: groundY - 400, width: 150, height: 50 },
          { x: 1850, y: groundY - 450, width: 150, height: 50 },
          { x: 2050, y: groundY - 500, width: 150, height: 50 },
          { x: 2250, y: groundY - 550, width: 150, height: 50 },
          { x: 2450, y: groundY - 600, width: 150, height: 50 },
          { x: 2650, y: groundY - 650, width: 150, height: 50 }
        ],
        questionStations: [
          { x: 200, y: groundY - 100, width: 50, height: 50, difficulty: 'easy', id: 1 },
          { x: 400, y: groundY - 150, width: 50, height: 50, difficulty: 'easy', id: 2 },
          { x: 600, y: groundY - 200, width: 50, height: 50, difficulty: 'easy', id: 3 },
          { x: 800, y: groundY - 250, width: 50, height: 50, difficulty: 'easy', id: 4 },
          { x: 1000, y: groundY - 300, width: 50, height: 50, difficulty: 'easy', id: 5 },
          { x: 1200, y: groundY - 350, width: 50, height: 50, difficulty: 'easy', id: 6 },
          { x: 1400, y: groundY - 400, width: 50, height: 50, difficulty: 'easy', id: 7 },
          { x: 1600, y: groundY - 450, width: 50, height: 50, difficulty: 'easy', id: 8 },
          { x: 1800, y: groundY - 500, width: 50, height: 50, difficulty: 'easy', id: 9 },
          { x: 2000, y: groundY - 550, width: 50, height: 50, difficulty: 'easy', id: 10 },
          { x: 2200, y: groundY - 600, width: 50, height: 50, difficulty: 'easy', id: 11 },
          { x: 2400, y: groundY - 650, width: 50, height: 50, difficulty: 'easy', id: 12 },
          { x: 2600, y: groundY - 700, width: 50, height: 50, difficulty: 'easy', id: 13 }
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
