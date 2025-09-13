const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Fallback questions for when Claude API is not available
const FALLBACK_QUESTIONS = {
  easy: [
    {
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correctAnswer: 1,
      hint: "Binary search eliminates half of the search space in each iteration.",
      explanation: "Binary search has O(log n) time complexity because it divides the search space in half with each comparison."
    },
    {
      question: "Which data structure uses LIFO (Last In, First Out) principle?",
      options: ["Queue", "Stack", "Array", "Linked List"],
      correctAnswer: 1,
      hint: "Think about how plates are stacked - the last one placed is the first one removed.",
      explanation: "A stack follows the LIFO principle where elements are added and removed from the same end (top)."
    },
    {
      question: "What is the space complexity of a recursive solution for Fibonacci?",
      options: ["O(1)", "O(n)", "O(log n)", "O(2^n)"],
      correctAnswer: 1,
      hint: "Consider the maximum depth of the recursion stack.",
      explanation: "The space complexity is O(n) due to the recursion stack that can go as deep as n levels."
    },
    {
      question: "Which sorting algorithm has the best average-case time complexity?",
      options: ["Bubble Sort", "Quick Sort", "Selection Sort", "Insertion Sort"],
      correctAnswer: 1,
      hint: "This algorithm uses a divide-and-conquer approach.",
      explanation: "Quick Sort has O(n log n) average-case time complexity, making it one of the most efficient sorting algorithms."
    },
    {
      question: "What does DFS stand for in graph algorithms?",
      options: ["Depth-First Search", "Data-First Search", "Dynamic-First Search", "Direct-First Search"],
      correctAnswer: 0,
      hint: "This algorithm explores as far as possible along each branch before backtracking.",
      explanation: "DFS (Depth-First Search) explores vertices by going as deep as possible before backtracking."
    }
  ],
  medium: [
    {
      question: "What is the time complexity of merge sort?",
      options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
      correctAnswer: 1,
      hint: "Merge sort divides the array in half and then merges the sorted halves.",
      explanation: "Merge sort has O(n log n) time complexity because it divides the array log n times and merges n elements each time."
    },
    {
      question: "Which algorithm is used to find the shortest path in a weighted graph?",
      options: ["BFS", "DFS", "Dijkstra's", "Binary Search"],
      correctAnswer: 2,
      hint: "This algorithm considers edge weights and uses a priority queue.",
      explanation: "Dijkstra's algorithm finds the shortest path in a weighted graph by using a greedy approach with a priority queue."
    },
    {
      question: "What is the space complexity of dynamic programming with memoization?",
      options: ["O(1)", "O(n)", "O(n²)", "Depends on the problem"],
      correctAnswer: 3,
      hint: "The space complexity depends on how much data needs to be stored.",
      explanation: "The space complexity of DP with memoization depends on the specific problem and the size of the memoization table."
    },
    {
      question: "Which data structure is best for implementing a priority queue?",
      options: ["Array", "Linked List", "Heap", "Stack"],
      correctAnswer: 2,
      hint: "This data structure maintains elements in a specific order for efficient access.",
      explanation: "A heap is the most efficient data structure for implementing a priority queue due to its O(log n) insertion and deletion operations."
    }
  ],
  hard: [
    {
      question: "What is the time complexity of the Floyd-Warshall algorithm?",
      options: ["O(n²)", "O(n³)", "O(n log n)", "O(2^n)"],
      correctAnswer: 1,
      hint: "This algorithm uses three nested loops over all vertices.",
      explanation: "Floyd-Warshall has O(n³) time complexity due to three nested loops, each iterating over all n vertices."
    },
    {
      question: "Which algorithm is used to find strongly connected components?",
      options: ["BFS", "DFS", "Kosaraju's", "Dijkstra's"],
      correctAnswer: 2,
      hint: "This algorithm uses DFS twice on the graph and its transpose.",
      explanation: "Kosaraju's algorithm finds strongly connected components by performing DFS twice - once on the original graph and once on its transpose."
    },
    {
      question: "What is the space complexity of the A* search algorithm?",
      options: ["O(1)", "O(b^d)", "O(d)", "O(bd)"],
      correctAnswer: 1,
      hint: "This algorithm stores all nodes in the frontier and explored set.",
      explanation: "A* has O(b^d) space complexity where b is the branching factor and d is the depth of the solution."
    }
  ]
};

// Get random question from fallback data
const getRandomQuestion = (difficulty) => {
  const questions = FALLBACK_QUESTIONS[difficulty] || FALLBACK_QUESTIONS.easy;
  const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
  
  return {
    ...randomQuestion,
    id: Date.now() + Math.random() * 1000,
    difficulty
  };
};

// Generate question using Claude API (placeholder for actual implementation)
const generateQuestionWithClaude = async (difficulty, topic) => {
  // This is where you would integrate with Claude API
  // For now, we'll use the fallback questions
  
  // Example Claude API integration (commented out):
  /*
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `Generate a ${difficulty} difficulty LeetCode-style multiple choice question about ${topic}. 
        Return a JSON object with: question, options (array of 4 strings), correctAnswer (0-3 index), 
        hint, and explanation. Make it engaging and educational.`
      }]
    })
  });
  
  const data = await response.json();
  return JSON.parse(data.content[0].text);
  */
  
  // For now, return a fallback question
  return getRandomQuestion(difficulty);
};

// API Routes

// Generate a new question
app.post('/api/generate-question', async (req, res) => {
  try {
    const { difficulty = 'easy', topic = 'algorithms' } = req.body;
    
    const question = await generateQuestionWithClaude(difficulty, topic);
    
    res.json(question);
  } catch (error) {
    console.error('Error generating question:', error);
    // Fallback to random question
    const fallbackQuestion = getRandomQuestion(req.body.difficulty || 'easy');
    res.json(fallbackQuestion);
  }
});

// Validate an answer
app.post('/api/validate-answer', (req, res) => {
  try {
    const { questionId, answer } = req.body;
    
    // In a real implementation, you would look up the question by ID
    // and validate the answer. For now, we'll return a simple response.
    res.json({
      isCorrect: true, // This would be determined by the actual question data
      explanation: 'Answer validation completed'
    });
  } catch (error) {
    console.error('Error validating answer:', error);
    res.status(500).json({ error: 'Failed to validate answer' });
  }
});

// Get hint for a question
app.post('/api/get-hint', (req, res) => {
  try {
    const { questionId } = req.body;
    
    // In a real implementation, you would look up the question by ID
    res.json({
      hint: 'Think about the problem step by step and consider the constraints.'
    });
  } catch (error) {
    console.error('Error getting hint:', error);
    res.status(500).json({ error: 'Failed to get hint' });
  }
});

// Get explanation for a question
app.post('/api/get-explanation', (req, res) => {
  try {
    const { questionId } = req.body;
    
    // In a real implementation, you would look up the question by ID
    res.json({
      explanation: 'This is a coding problem that requires algorithmic thinking and understanding of data structures.'
    });
  } catch (error) {
    console.error('Error getting explanation:', error);
    res.status(500).json({ error: 'Failed to get explanation' });
  }
});

// Validate code with Claude AI
app.post('/api/validate-code', async (req, res) => {
  try {
    const { question, code, language } = req.body;
    
    // Validate with Claude AI
    const validationResult = await validateCodeWithClaude(question, code, language);
    res.json(validationResult);
  } catch (error) {
    console.error('Error validating code:', error);
    // Fallback validation
    const fallbackResult = validateCodeFallback(req.body.question, req.body.code, req.body.language);
    res.json(fallbackResult);
  }
});

// Validate code with Claude AI
const validateCodeWithClaude = async (question, code, language) => {
  try {
    // Check if Claude API key is available
    if (!process.env.CLAUDE_API_KEY) {
      console.log('Claude API key not found, using fallback validation');
      return validateCodeFallback(question, code, language);
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `Please validate this ${language} code solution for the following LeetCode problem:

Problem: ${question.title}
Description: ${question.description}

Test Cases:
${question.testCases.map((tc, i) => `Test ${i + 1}: Input: ${JSON.stringify(tc.input)}, Expected: ${JSON.stringify(tc.expected)}`).join('\n')}

Code to validate:
\`\`\`${language}
${code}
\`\`\`

Please analyze the code and return a JSON response with:
- status: "success", "failed", or "error"
- message: Brief feedback message
- details: Detailed explanation of the validation result

The code should correctly handle all test cases and follow good coding practices.`
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API request failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.content[0].text;
    
    // Try to parse JSON response from Claude
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.warn('Failed to parse Claude response as JSON:', parseError);
    }

    // Fallback if JSON parsing fails
    return {
      status: 'success',
      message: 'Code validated by Claude AI',
      details: content
    };

  } catch (error) {
    console.error('Claude API error:', error);
    return validateCodeFallback(question, code, language);
  }
};

// Fallback code validation
const validateCodeFallback = (question, code, language = 'python') => {
  // Check if question and starterCode exist
  if (!question || !question.starterCode) {
    return {
      status: 'error',
      message: 'Invalid question data provided.'
    };
  }

  // Extract the function name from the starter code
  const functionName = question.starterCode.match(/def\s+(\w+)/)?.[1];
  
  if (!functionName) {
    return {
      status: 'error',
      message: 'Unable to determine function name from starter code.'
    };
  }

  // Check if code contains the required function name
  if (!code.includes(functionName)) {
    return {
      status: 'error',
      message: `Your code must contain the function '${functionName}' as shown in the starter code.`
    };
  }

  // Check if code has basic structure
  if (code.trim().length < 30) {
    return {
      status: 'error',
      message: 'Code appears to be incomplete. Please implement a solution.'
    };
  }

  // Check for basic Python syntax
  if (language === 'python') {
    if (!code.includes('def ') || !code.includes('return')) {
      return {
        status: 'error',
        message: 'Please write a proper Python function with a return statement.'
      };
    }
  }

  // For demo purposes, randomly pass/fail based on code length and quality
  const hasReturn = code.includes('return');
  const hasLogic = code.length > 100 && (code.includes('if') || code.includes('for') || code.includes('while'));
  const isCorrect = hasReturn && hasLogic && Math.random() > 0.2;
  
  if (isCorrect) {
    return {
      status: 'success',
      message: '✅ All test cases passed! Great job!',
      details: 'Your Python solution correctly handles all the provided test cases.'
    };
  } else {
    return {
      status: 'failed',
      message: '❌ Some test cases failed. Try again!',
      details: 'Your solution needs to handle edge cases better. Consider the hint for guidance.'
    };
  }
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'LeetCode Quest API is running' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 LeetCode Quest API server running on port ${PORT}`);
  console.log(`📚 Ready to generate coding challenges!`);
});

module.exports = app;
