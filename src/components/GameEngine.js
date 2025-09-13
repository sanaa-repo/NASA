import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useGame } from '../context/GameContext';
import ParticleSystem from './ParticleSystem';
import './GameEngine.css';

const GameEngine = () => {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const lastTimeRef = useRef(0);
  const { state, setPlayerPosition, setPlayerVelocity, setPlayerState, triggerQuestion } = useGame();
  
  // Image assets
  const [images, setImages] = useState({});
  const [audio, setAudio] = useState({});

  // Geometry Dash game constants
  const GRAVITY = 0.6;
  const JUMP_FORCE = -12;
  // const MOVE_SPEED = 4; // Auto-scroll speed (unused)
  const CANVAS_WIDTH = Math.min(window.innerWidth, 1200);
  const CANVAS_HEIGHT = Math.min(window.innerHeight, 600);
  
  // Game state
  const [obstacles, setObstacles] = useState([]);
  const [gameSpeed] = useState(4); // Horizontal movement speed
  const [score, setScore] = useState(0);
  const [isDead, setIsDead] = useState(false);
  // const [cameraX, setCameraX] = useState(0); // Not needed for fixed player position

  // Input handling
  const keys = useRef({
    space: false,
    up: false
  });

  // Generate obstacles (pipes)
  const generateObstacle = useCallback((x) => {
    const gapSize = 150; // Gap between top and bottom pipes
    const groundLevel = CANVAS_HEIGHT - 100; // Ground is at this Y position
    const minTopHeight = 80;
    const maxTopHeight = groundLevel - gapSize - 80; // Leave room for gap and bottom pipe
    const topPipeHeight = Math.random() * (maxTopHeight - minTopHeight) + minTopHeight;
    const bottomPipeY = topPipeHeight + gapSize;
    const bottomPipeHeight = groundLevel - bottomPipeY;
    
    // Pipe generation complete
    
    return {
      type: 'pipe',
      x: x,
      topY: 0,
      topHeight: topPipeHeight,
      bottomY: bottomPipeY,
      bottomHeight: bottomPipeHeight,
      width: 52, // Pipe width from sprite
      id: Date.now() + Math.random()
    };
  }, [CANVAS_HEIGHT]);

  // Load assets
  useEffect(() => {
    const loadAssets = async () => {
      const imagePromises = [
        'background-day.png',
        'base.png',
        'pipe-green.png',
        'bluebird-upflap.png',
        'bluebird-midflap.png',
        'bluebird-downflap.png'
      ].map(name => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve({ name, img });
          img.onerror = reject;
          img.src = `/assets/sprites/${name}`;
        });
      });

      const audioPromises = [
        'wing.wav',
        'hit.wav',
        'die.wav',
        'point.wav'
      ].map(name => {
        return new Promise((resolve, reject) => {
          const audio = new Audio();
          audio.oncanplaythrough = () => resolve({ name, audio });
          audio.onerror = reject;
          audio.src = `/assets/audio/${name}`;
        });
      });

      try {
        const loadedImages = await Promise.all(imagePromises);
        const loadedAudio = await Promise.all(audioPromises);
        
        const imageMap = {};
        loadedImages.forEach(({ name, img }) => {
          imageMap[name] = img;
        });
        
        const audioMap = {};
        loadedAudio.forEach(({ name, audio }) => {
          audioMap[name] = audio;
        });
        
        setImages(imageMap);
        setAudio(audioMap);
        console.log('Assets loaded successfully:', {
          images: Object.keys(imageMap),
          audio: Object.keys(audioMap)
        });
      } catch (error) {
        console.error('Failed to load assets:', error);
      }
    };

    loadAssets();
  }, []);

  // Initialize obstacles
  useEffect(() => {
    const initialObstacles = [];
    // Place pipes at starting positions (they will move horizontally)
    for (let i = 0; i < 3; i++) {
      initialObstacles.push(generateObstacle(CANVAS_WIDTH + 200 + i * 400));
    }
    setObstacles(initialObstacles);
  }, [generateObstacle, CANVAS_WIDTH]);

  // Handle keyboard input - Geometry Dash style (only jump)
  const handleKeyDown = useCallback((e) => {
    // Don't handle game controls when question modal is open or when dead
    if (state.showQuestionModal || isDead) {
      return;
    }
    
    switch (e.code) {
      case 'ArrowUp':
      case 'KeyW':
      case 'Space':
        keys.current.up = true;
        keys.current.space = true;
        e.preventDefault();
        break;
      case 'Escape':
        // Pause game
        break;
      default:
        // Handle other keys if needed
        break;
    }
  }, [state.showQuestionModal, isDead]);

  const handleKeyUp = useCallback((e) => {
    // Don't handle game controls when question modal is open or when dead
    if (state.showQuestionModal || isDead) {
      return;
    }
    
    switch (e.code) {
      case 'ArrowUp':
      case 'KeyW':
      case 'Space':
        keys.current.up = false;
        keys.current.space = false;
        break;
      default:
        // Handle other keys if needed
        break;
    }
  }, [state.showQuestionModal, isDead]);

  // Collision detection
  // Collision detection for pipes
  const checkCollision = useCallback((player, obstacle) => {
    if (obstacle.type === 'pipe') {
      const playerLeft = player.x;
      const playerRight = player.x + player.width;
      const playerTop = player.y;
      const playerBottom = player.y + player.height;
      
      const pipeLeft = obstacle.x;
      const pipeRight = obstacle.x + obstacle.width;
      
      // Check if player is horizontally aligned with pipe
      if (playerRight > pipeLeft && playerLeft < pipeRight) {
        // Check collision with top pipe (from top of screen to topHeight)
        if (playerTop < obstacle.topHeight) {
          return true;
        }
        // Check collision with bottom pipe (from bottomY to bottom of screen)
        if (playerBottom > obstacle.bottomY) {
          return true;
        }
      }
    }
    return false;
  }, []);

  // Handle player death
  const handleDeath = useCallback(() => {
    setIsDead(true);
    // Play death sound
    if (audio['hit.wav']) {
      audio['hit.wav'].currentTime = 0;
      audio['hit.wav'].play().catch(e => console.log('Audio play failed:', e));
    }
    // Trigger coding question when player dies
    triggerQuestion();
  }, [triggerQuestion, audio]);

  // Reset game (unused for now)
  // const resetGame = useCallback(() => {
  //   setIsDead(false);
  //   setScore(0);
  //   setCameraX(0);
  //   setGameSpeed(4);
  //   setPlayerPosition({ x: 100, y: CANVAS_HEIGHT - 100 });
  //   setPlayerVelocity({ x: 0, y: 0 });
  //   setPlayerState('idle');
  // }, [setPlayerPosition, setPlayerVelocity, setPlayerState, CANVAS_HEIGHT]);

  // Touch controls for mobile
  const handleTouchStart = useCallback((e) => {
    // Don't handle touch controls when question modal is open or when dead
    if (state.showQuestionModal || isDead) {
      return;
    }
    
    e.preventDefault();
    keys.current.up = true;
    keys.current.space = true;
  }, [state.showQuestionModal, isDead]);

  const handleTouchEnd = useCallback((e) => {
    // Don't handle touch controls when question modal is open or when dead
    if (state.showQuestionModal || isDead) {
      return;
    }
    
    e.preventDefault();
    keys.current.up = false;
    keys.current.space = false;
  }, [state.showQuestionModal, isDead]);

  // Draw scene function
  const drawScene = useCallback((ctx) => {
    // Draw background
    if (images['background-day.png']) {
      ctx.drawImage(images['background-day.png'], 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT - 100);
    } else {
      ctx.fillStyle = '#70c5ce';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT - 100);
    }

    // Draw ground/base
    if (images['base.png']) {
      const baseHeight = 112; // Base sprite height
      ctx.drawImage(images['base.png'], 0, CANVAS_HEIGHT - baseHeight, CANVAS_WIDTH, baseHeight);
    } else {
      ctx.fillStyle = '#deb887';
      ctx.fillRect(0, CANVAS_HEIGHT - 100, CANVAS_WIDTH, 100);
    }

    // Draw pipes
    if (images['pipe-green.png']) {
      obstacles.forEach(obstacle => {
        if (obstacle.type === 'pipe') {
          // Draw top pipe (flipped vertically)
          ctx.save();
          ctx.scale(1, -1);
          ctx.drawImage(
            images['pipe-green.png'], 
            obstacle.x, 
            -obstacle.topHeight, 
            obstacle.width, 
            obstacle.topHeight
          );
          ctx.restore();
          
          // Draw bottom pipe
          ctx.drawImage(
            images['pipe-green.png'], 
            obstacle.x, 
            obstacle.bottomY, 
            obstacle.width, 
            obstacle.bottomHeight
          );
        }
      });
    } else {
      // Fallback: draw colored rectangles
      obstacles.forEach(obstacle => {
        if (obstacle.type === 'pipe') {
          ctx.fillStyle = '#00ff00';
          // Top pipe
          ctx.fillRect(obstacle.x, 0, obstacle.width, obstacle.topHeight);
          // Bottom pipe
          ctx.fillRect(obstacle.x, obstacle.bottomY, obstacle.width, obstacle.bottomHeight);
        }
      });
    }

    // Draw player (Flappy Bird)
    console.log('Drawing bird:', {
      hasBirdSprite: !!images['bluebird-midflap.png'],
      playerY: state.player.y,
      playerX: state.player.x,
      isDead: isDead,
      imagesLoaded: Object.keys(images).length
    });
    
    if (images['bluebird-midflap.png']) {
      const birdSize = 34; // Bird sprite size
      
      // Choose bird sprite based on wing animation
      let birdSprite = images['bluebird-midflap.png'];
      if (images['bluebird-upflap.png'] && images['bluebird-downflap.png']) {
        const wingCycle = Math.floor(score / 5) % 3;
        if (wingCycle === 0) birdSprite = images['bluebird-upflap.png'];
        else if (wingCycle === 1) birdSprite = images['bluebird-midflap.png'];
        else birdSprite = images['bluebird-downflap.png'];
      }
      
      // Add slight rotation based on velocity for more dynamic look
      ctx.save();
      const rotation = Math.min(Math.max(state.player.vy * 0.1, -0.3), 0.3);
      ctx.translate(100 + birdSize/2, state.player.y + birdSize/2);
      ctx.rotate(rotation);
      ctx.drawImage(birdSprite, -birdSize/2, -birdSize/2, birdSize, birdSize);
      ctx.restore();
    } else {
      // Fallback: draw colored rectangle with better visibility
      console.log('Using fallback bird drawing');
      ctx.fillStyle = isDead ? '#ff0000' : '#00ff00';
      ctx.fillRect(100, state.player.y, 40, 40);
      // Add a simple eye
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(110, state.player.y + 8, 12, 12);
      ctx.fillStyle = '#000000';
      ctx.fillRect(113, state.player.y + 11, 6, 6);
      // Add a simple beak
      ctx.fillStyle = '#ffaa00';
      ctx.fillRect(140, state.player.y + 15, 8, 6);
    }

    // Draw score
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeText(`Score: ${score}`, 20, 40);
    ctx.fillText(`Score: ${score}`, 20, 40);

    // Draw instructions
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.strokeText('Press SPACE or UP to jump!', 20, CANVAS_HEIGHT - 20);
    ctx.fillText('Press SPACE or UP to jump!', 20, CANVAS_HEIGHT - 20);
  }, [obstacles, state.player, isDead, score, CANVAS_HEIGHT, CANVAS_WIDTH, images]);

  // Main game loop
  const gameLoop = useCallback((currentTime) => {
    if (!canvasRef.current) return;
    
    // Debug: Check if game loop is running
    if (Math.floor(currentTime / 1000) % 2 === 0) { // Log every 2 seconds
      console.log('Game loop running, currentTime:', currentTime);
    }

    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;

    // Skip frame if deltaTime is too large (tab switching, etc.)
    if (deltaTime > 100) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas with Geometry Dash style background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Don't update game if dead or in question modal
    if (isDead || state.showQuestionModal) {
      // Draw static scene
      drawScene(ctx);
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    // Update player physics - Geometry Dash style
    let newVx = 0; // No horizontal movement
    let newVy = state.player.vy;
    let newX = 100; // Fixed horizontal position
    let newY = state.player.y;
    let newState = state.player.state;
    
    // Debug physics
    console.log('Physics update:', {
      currentY: state.player.y,
      currentVy: state.player.vy,
      currentState: state.player.state,
      gravity: GRAVITY,
      jumpPressed: keys.current.up
    });

    // Handle jump input - Geometry Dash style
    if (keys.current.up && (newState === 'idle' || newState === 'running')) {
      newVy = JUMP_FORCE;
      newState = 'jumping';
      // Play wing sound
      if (audio['wing.wav']) {
        audio['wing.wav'].currentTime = 0;
        audio['wing.wav'].play().catch(e => console.log('Audio play failed:', e));
      }
    }

    // Apply gravity
    newVy += GRAVITY;

    // Update position
    newX += newVx;
    newY += newVy;

    // Ground collision
    const groundY = CANVAS_HEIGHT - 100;
    const playerHeight = 30;
    if (newY >= groundY - playerHeight) {
      newY = groundY - playerHeight;
      newVy = 0;
      newState = 'idle';
    }

    // Update score
    setScore(prev => prev + 1);

    // Update obstacles horizontally (move left) and check collisions
    setObstacles(prev => {
      const updated = prev.map(obstacle => ({
        ...obstacle,
        x: obstacle.x - gameSpeed // Move pipes left horizontally
      })).filter(obstacle => obstacle.x > -100); // Keep obstacles that are still visible

      // Add new obstacles
      if (updated.length < 5) {
        const lastObstacle = updated[updated.length - 1];
        const newX = lastObstacle ? lastObstacle.x + 400 : CANVAS_WIDTH + 200;
        updated.push(generateObstacle(newX));
      }

      // Check collisions with updated obstacles
      const player = { x: newX, y: newY, width: 30, height: 30 };
      for (const obstacle of updated) {
        if (checkCollision(player, obstacle)) {
          handleDeath();
          return prev; // Return previous state if collision
        }
      }

      return updated;
    });

    // Update player state
    console.log('Updating player state:', {
      newX, newY, newVx, newVy, newState,
      oldY: state.player.y, oldVy: state.player.vy
    });
    setPlayerPosition({ x: newX, y: newY });
    setPlayerVelocity({ x: newVx, y: newVy });
    setPlayerState(newState);

    // Draw the scene
    drawScene(ctx);

    // Continue game loop
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [state.player, obstacles, isDead, state.showQuestionModal, gameSpeed, checkCollision, handleDeath, generateObstacle, setPlayerPosition, setPlayerVelocity, setPlayerState, setScore, setObstacles, drawScene, CANVAS_HEIGHT, CANVAS_WIDTH, JUMP_FORCE, audio]);

  // Initialize game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

    // Start game loop
    gameLoopRef.current = requestAnimationFrame(gameLoop);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [handleKeyDown, handleKeyUp, handleTouchStart, handleTouchEnd, gameLoop, CANVAS_HEIGHT, CANVAS_WIDTH]);

  // Handle window resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = Math.min(window.innerWidth, 1200);
      canvas.height = Math.min(window.innerHeight, 600);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return (
    <div className="game-engine">
      <canvas
        ref={canvasRef}
        className="game-canvas"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          background: '#1a1a2e'
        }}
      />
      <ParticleSystem />
    </div>
  );
};

export default GameEngine;
