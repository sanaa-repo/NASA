import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { generateQuestion } from '../services/aiService';
import { getRandomQuestion } from '../data/leetcodeQuestions';

const GameContext = createContext();

// Game state reducer
const gameReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PLAYER_POSITION':
      return {
        ...state,
        player: {
          ...state.player,
          x: action.x,
          y: action.y
        }
      };
    
    case 'SET_PLAYER_VELOCITY':
      return {
        ...state,
        player: {
          ...state.player,
          vx: action.vx,
          vy: action.vy
        }
      };
    
    case 'SET_PLAYER_STATE':
      return {
        ...state,
        player: {
          ...state.player,
          state: action.state // 'idle', 'running', 'jumping', 'falling'
        }
      };
    
    case 'ADD_XP':
      return {
        ...state,
        player: {
          ...state.player,
          xp: state.player.xp + action.amount
        }
      };
    
    case 'LEVEL_UP':
      return {
        ...state,
        player: {
          ...state.player,
          level: state.player.level + 1,
          xp: 0,
          maxXp: state.player.maxXp + 100
        }
      };
    
    case 'SET_CURRENT_LEVEL':
      return {
        ...state,
        currentLevel: action.level
      };
    
    case 'UNLOCK_LEVEL':
      return {
        ...state,
        unlockedLevels: [...state.unlockedLevels, action.level]
      };
    
    case 'SET_QUESTION':
      return {
        ...state,
        currentQuestion: action.question
      };
    
    case 'SHOW_QUESTION_MODAL':
      return {
        ...state,
        showQuestionModal: true,
        questionStation: action.station
      };
    
    case 'HIDE_QUESTION_MODAL':
      return {
        ...state,
        showQuestionModal: false,
        currentQuestion: null,
        questionStation: null
      };
    
    case 'SET_GAME_STATE':
      return {
        ...state,
        gameState: action.state // 'playing', 'paused', 'question', 'levelComplete'
      };
    
    case 'ADD_SCORE':
      return {
        ...state,
        score: state.score + action.amount
      };
    
    case 'SET_PARTICLES':
      return {
        ...state,
        particles: action.particles
      };
    
    case 'ADD_PARTICLE':
      return {
        ...state,
        particles: [...state.particles, action.particle]
      };
    
    case 'REMOVE_PARTICLE':
      return {
        ...state,
        particles: state.particles.filter(p => p.id !== action.id)
      };
    
    case 'RESET_GAME':
      return {
        ...initialState,
        player: {
          ...initialState.player,
          level: state.player.level,
          unlockedLevels: state.unlockedLevels
        }
      };
    
    default:
      return state;
  }
};

// Initial game state
const initialState = {
  player: {
    x: 100,
    y: 400,
    vx: 0,
    vy: 0,
    width: 32,
    height: 48,
    state: 'idle',
    level: 1,
    xp: 0,
    maxXp: 100,
    health: 100,
    maxHealth: 100
  },
  currentLevel: 1,
  unlockedLevels: [1, 2, 3, 4, 5],
  gameState: 'playing', // 'playing', 'paused', 'question', 'levelComplete'
  score: 0,
  showQuestionModal: false,
  currentQuestion: null,
  questionStation: null,
  particles: [],
  camera: {
    x: 0,
    y: 0
  }
};

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Load game state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('leetcodeQuestGame');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      dispatch({ type: 'SET_CURRENT_LEVEL', level: parsedState.currentLevel || 1 });
      dispatch({ type: 'UNLOCK_LEVEL', level: parsedState.unlockedLevels || [1] });
    }
  }, []);

  // Save game state to localStorage when it changes
  useEffect(() => {
    const stateToSave = {
      currentLevel: state.currentLevel,
      unlockedLevels: state.unlockedLevels,
      player: {
        level: state.player.level,
        xp: state.player.xp
      }
    };
    localStorage.setItem('leetcodeQuestGame', JSON.stringify(stateToSave));
  }, [state.currentLevel, state.unlockedLevels, state.player.level, state.player.xp]);

  // Game actions
  const gameActions = {
    setPlayerPosition: (x, y) => dispatch({ type: 'SET_PLAYER_POSITION', x, y }),
    setPlayerVelocity: (vx, vy) => dispatch({ type: 'SET_PLAYER_VELOCITY', vx, vy }),
    setPlayerState: (state) => dispatch({ type: 'SET_PLAYER_STATE', state }),
    addXp: (amount) => dispatch({ type: 'ADD_XP', amount }),
    levelUp: () => dispatch({ type: 'LEVEL_UP' }),
    setCurrentLevel: (level) => dispatch({ type: 'SET_CURRENT_LEVEL', level }),
    unlockLevel: (level) => dispatch({ type: 'UNLOCK_LEVEL', level }),
    setQuestion: (question) => dispatch({ type: 'SET_QUESTION', question }),
    showQuestionModal: (station) => dispatch({ type: 'SHOW_QUESTION_MODAL', station }),
    hideQuestionModal: () => dispatch({ type: 'HIDE_QUESTION_MODAL' }),
    setGameState: (state) => dispatch({ type: 'SET_GAME_STATE', state }),
    addScore: (amount) => dispatch({ type: 'ADD_SCORE', amount }),
    addParticle: (particle) => dispatch({ type: 'ADD_PARTICLE', particle }),
    removeParticle: (id) => dispatch({ type: 'REMOVE_PARTICLE', id }),
    resetGame: () => dispatch({ type: 'RESET_GAME' }),

    // Complex actions
    triggerQuestion: async (station) => {
      try {
        dispatch({ type: 'SET_GAME_STATE', state: 'question' });
        
        // Try to get a LeetCode question first
        const leetcodeQuestion = getRandomQuestion(station.difficulty || 'easy');
        if (leetcodeQuestion) {
          dispatch({ type: 'SET_QUESTION', question: leetcodeQuestion });
          dispatch({ type: 'SHOW_QUESTION_MODAL', station });
          return;
        }
        
        // Fallback to AI-generated question
        const question = await generateQuestion(station.difficulty || 'easy');
        dispatch({ type: 'SET_QUESTION', question });
        dispatch({ type: 'SHOW_QUESTION_MODAL', station });
      } catch (error) {
        console.error('Failed to generate question:', error);
        // Fallback to a default LeetCode question
        const fallbackQuestion = getRandomQuestion(station.difficulty || 'easy') || {
          id: Date.now(),
          title: "Two Sum",
          description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
          difficulty: station.difficulty || 'easy',
          starterCode: `def two_sum(nums, target):
    """
    Given an array of integers nums and an integer target, 
    return indices of the two numbers such that they add up to target.
    
    Args:
        nums: List of integers
        target: Integer target sum
        
    Returns:
        List of two indices
    """
    # Your code here
    return []`,
          testCases: [
            { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] }
          ],
          hint: "Use a hash map to store numbers and their indices.",
          explanation: "The optimal solution uses a hash map to store each number and its index."
        };
        dispatch({ type: 'SET_QUESTION', question: fallbackQuestion });
        dispatch({ type: 'SHOW_QUESTION_MODAL', station });
      }
    },

    submitAnswer: (answer) => {
      const { currentQuestion } = state;
      if (!currentQuestion) return false;

      const isCorrect = answer === currentQuestion.correctAnswer;
      
      if (isCorrect) {
        // Correct answer - give rewards
        const xpReward = currentQuestion.difficulty === 'easy' ? 50 : 
                        currentQuestion.difficulty === 'medium' ? 100 : 200;
        
        gameActions.addXp(xpReward);
        gameActions.addScore(xpReward * 2);
        
        // Add particle effect
        gameActions.addParticle({
          id: Date.now(),
          type: 'xp',
          x: state.player.x,
          y: state.player.y,
          text: `+${xpReward} XP`,
          duration: 2000
        });

        // Check for level up
        if (state.player.xp >= state.player.maxXp) {
          gameActions.levelUp();
          gameActions.addParticle({
            id: Date.now() + 1,
            type: 'levelup',
            x: state.player.x,
            y: state.player.y - 50,
            text: 'LEVEL UP!',
            duration: 3000
          });
        }

        // Unlock next level if this was the last question
        if (state.currentLevel < 5) {
          gameActions.unlockLevel(state.currentLevel + 1);
        }
        
        // Advance to next level after completing enough questions
        const questionsCompleted = state.score / 100; // Assuming 100 points per question
        if (questionsCompleted >= state.currentLevel * 3 && state.currentLevel < 5) {
          gameActions.setCurrentLevel(state.currentLevel + 1);
        }
      }

      return isCorrect;
    }
  };

  return (
    <GameContext.Provider value={{ state, dispatch, ...gameActions }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
