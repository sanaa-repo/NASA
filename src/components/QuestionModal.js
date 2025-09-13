import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { validateCodeWithClaude } from '../services/aiService';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 20px;
  padding: 2rem;
  max-width: 90vw;
  max-height: 90vh;
  width: 800px;
  overflow-y: auto;
  border: 2px solid #00d4ff;
  box-shadow: 0 0 30px rgba(0, 212, 255, 0.3);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #333;
`;

const Title = styled.h2`
  color: #00d4ff;
  font-size: 1.8rem;
  margin: 0;
  font-family: 'Orbitron', monospace;
`;

const DifficultyBadge = styled.span`
  background: ${props => 
    props.difficulty === 'easy' ? '#4caf50' :
    props.difficulty === 'medium' ? '#ff9800' : '#f44336'
  };
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
`;

const CloseButton = styled.button`
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: #ff6666;
    transform: scale(1.1);
  }
`;

const Description = styled.div`
  color: #e0e0e0;
  line-height: 1.7;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  background: #2a2a2a;
  padding: 1.5rem;
  border-radius: 10px;
  border-left: 4px solid #00d4ff;
  font-family: 'Segoe UI', 'Roboto', sans-serif;
`;

const CodeEditor = styled.textarea`
  width: 100%;
  height: 350px;
  background: #1e1e1e;
  color: #d4d4d4;
  border: 2px solid #333;
  border-radius: 10px;
  padding: 1.5rem;
  font-family: 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 16px;
  line-height: 1.6;
  resize: vertical;
  margin-bottom: 1.5rem;
  tab-size: 4;
  white-space: pre;
  overflow-wrap: normal;
  overflow-x: auto;

  &:focus {
    outline: none;
    border-color: #00d4ff;
    box-shadow: 0 0 15px rgba(0, 212, 255, 0.4);
  }

  &::placeholder {
    color: #666;
    font-style: italic;
  }
`;

const TestCases = styled.div`
  margin-bottom: 1.5rem;
`;

const TestCaseTitle = styled.h4`
  color: #00d4ff;
  margin-bottom: 0.5rem;
  font-size: 1rem;
`;

const TestCase = styled.div`
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 1.2rem;
  margin-bottom: 0.8rem;
  font-family: 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  color: #e0e0e0;
  
  &:hover {
    background: #333;
    border-color: #555;
  }
`;

const TestCaseLabel = styled.div`
  color: #00d4ff;
  font-weight: bold;
  margin-bottom: 0.5rem;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TestCaseValue = styled.div`
  color: #ffd700;
  font-family: 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
  background: #1a1a1a;
  padding: 0.5rem;
  border-radius: 4px;
  margin: 0.3rem 0;
  border-left: 3px solid #00d4ff;
  white-space: pre-wrap;
  word-break: break-all;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;

  ${props => props.primary ? `
    background: linear-gradient(45deg, #00d4ff, #00ff88);
    color: #000;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 212, 255, 0.4);
    }
  ` : `
    background: #333;
    color: #fff;
    
    &:hover {
      background: #444;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
`;

const ResultMessage = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
  font-weight: bold;
  text-align: center;

  ${props => props.success ? `
    background: rgba(76, 175, 80, 0.2);
    color: #4caf50;
    border: 1px solid #4caf50;
  ` : `
    background: rgba(244, 67, 54, 0.2);
    color: #f44336;
    border: 1px solid #f44336;
  `}
`;

const Hint = styled.div`
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid #ffc107;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  color: #ffc107;
  font-style: italic;
`;

const QuestionModal = () => {
  const { state, hideQuestionModal, addXp, addScore, addParticle } = useGame();
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const { showQuestionModal, currentQuestion } = state;

  useEffect(() => {
    if (currentQuestion && showQuestionModal) {
      setCode(currentQuestion.starterCode || '');
      setResult(null);
    }
  }, [currentQuestion, showQuestionModal]);

  const handleSubmit = async () => {
    if (!currentQuestion || !code.trim()) return;

    setIsSubmitting(true);
    setResult(null);

    try {
      const validationResult = await validateCodeWithClaude(currentQuestion, code, 'python');
      
      if (validationResult.status === 'success') {
        setResult({ success: true, message: validationResult.message || 'Correct! Great job!' });
        
        // Give rewards
        const xpReward = currentQuestion.difficulty === 'easy' ? 50 : 
                        currentQuestion.difficulty === 'medium' ? 100 : 200;
        
        addXp(xpReward);
        addScore(xpReward * 2);
        
        // Add particle effect
        addParticle({
          id: Date.now(),
          type: 'xp',
          x: state.player.x,
          y: state.player.y,
          text: `+${xpReward} XP`,
          duration: 2000
        });

        // Close modal after a delay
        setTimeout(() => {
          hideQuestionModal();
        }, 2000);
      } else {
        setResult({ 
          success: false, 
          message: validationResult.message || 'Try again! Check your logic.' 
        });
      }
    } catch (error) {
      console.error('Validation error:', error);
      setResult({ 
        success: false, 
        message: 'Error validating code. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    hideQuestionModal();
  };

  if (!showQuestionModal || !currentQuestion) {
    return null;
  }

  return (
    <AnimatePresence>
      <ModalOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <ModalContent
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Header>
            <Title>{currentQuestion.title}</Title>
            <DifficultyBadge difficulty={currentQuestion.difficulty}>
              {currentQuestion.difficulty}
            </DifficultyBadge>
            <CloseButton onClick={handleClose}>×</CloseButton>
          </Header>

          <Description>
            {currentQuestion.description}
          </Description>

          {currentQuestion.hint && (
            <Hint>
              <strong>Hint:</strong> {currentQuestion.hint}
            </Hint>
          )}

          <TestCases>
            <TestCaseTitle>Test Cases:</TestCaseTitle>
            {currentQuestion.testCases?.map((testCase, index) => (
              <TestCase key={index}>
                <TestCaseLabel>Test Case {index + 1}</TestCaseLabel>
                <TestCaseLabel>Input:</TestCaseLabel>
                <TestCaseValue>{JSON.stringify(testCase.input, null, 2)}</TestCaseValue>
                <TestCaseLabel>Expected Output:</TestCaseLabel>
                <TestCaseValue>{JSON.stringify(testCase.expected, null, 2)}</TestCaseValue>
              </TestCase>
            ))}
          </TestCases>

          <CodeEditor
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="# Write your Python solution here...&#10;# Example:&#10;def two_sum(nums, target):&#10;    # Your code here&#10;    pass"
          />

          {result && (
            <ResultMessage success={result.success}>
              {result.message}
            </ResultMessage>
          )}

          <ButtonContainer>
            <Button onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              primary 
              onClick={handleSubmit}
              disabled={isSubmitting || !code.trim()}
            >
              {isSubmitting ? 'Running...' : 'Submit'}
            </Button>
          </ButtonContainer>
        </ModalContent>
      </ModalOverlay>
    </AnimatePresence>
  );
};

export default QuestionModal;
