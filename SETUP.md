# LeetCode Quest - Setup Guide 🚀

## Quick Setup with Claude AI Integration

### 1. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Set Up Claude API (Optional but Recommended)

1. **Get your Claude API key:**
   - Go to [Anthropic Console](https://console.anthropic.com/)
   - Sign up/login and get your API key

2. **Configure the API key:**
   ```bash
   cd backend
   cp env.example .env
   # Edit .env and add your API key:
   # CLAUDE_API_KEY=your_actual_api_key_here
   ```

3. **Without Claude API:**
   - The game will work with fallback validation
   - Questions will be from the built-in LeetCode database
   - Code validation will use basic heuristics

### 3. Start the Game
```bash
# Start both frontend and backend
npm run dev

# Or start them separately:
# Frontend (port 3002)
npm run client

# Backend (port 3001)
npm run server
```

### 4. Open Your Browser
Navigate to `http://localhost:3002` to start playing!

## 🎮 How to Play

### Controls
- **Desktop**: Arrow keys or WASD to move, Space/Up to jump
- **Mobile**: Touch left/right sides to move, tap to jump

### Gameplay
1. **Navigate** through the platformer world
2. **Find coding stations** (blue glowing platforms with "?")
3. **Solve LeetCode problems** in the code editor
4. **Run your code** to test against test cases
5. **Earn XP** and level up as you progress

## 🧠 LeetCode Problems

The game includes real LeetCode problems:

### Easy Problems
- Two Sum
- Valid Parentheses  
- Maximum Subarray
- Climbing Stairs

### Medium Problems
- Longest Palindromic Substring
- 3Sum
- Container With Most Water

### Hard Problems
- Median of Two Sorted Arrays
- Regular Expression Matching

## 🔧 Code Editor Features

- **Syntax highlighting** for multiple languages
- **Line numbers** and proper formatting
- **Test cases** displayed for each problem
- **Real-time validation** with Claude AI
- **Language support**: JavaScript, Python, Java, C++

## 🤖 Claude AI Integration

When you have a Claude API key configured:

1. **Code Validation**: Claude analyzes your solution against test cases
2. **Detailed Feedback**: Get explanations of why your code works or fails
3. **Learning Guidance**: Receive hints and suggestions for improvement
4. **Dynamic Questions**: AI can generate new problems (future feature)

## 🐛 Troubleshooting

### Common Issues

1. **Game not loading:**
   - Check that both servers are running (ports 3001 and 3002)
   - Open browser console for error messages

2. **Code validation not working:**
   - Check if backend server is running on port 3001
   - Verify Claude API key in backend/.env file
   - Game will use fallback validation if Claude is unavailable

3. **Graphics issues:**
   - Try refreshing the page
   - Check browser console for errors
   - Ensure you're using a modern browser (Chrome, Firefox, Safari, Edge)

4. **Mobile controls not working:**
   - Ensure touch events are enabled
   - Try tapping different areas of the screen
   - Check if your browser supports touch events

### Performance Tips

- Close other browser tabs for better performance
- Use Chrome or Firefox for best experience
- Ensure stable internet connection for AI features

## 🎯 Game Features

### Visual Effects
- Smooth 60fps gameplay
- Particle effects for XP gains
- Animated character and environments
- Responsive design for all screen sizes

### Progression System
- XP and leveling system
- Score tracking
- Level unlocking
- Achievement feedback

### Educational Value
- Real LeetCode problems
- Multiple difficulty levels
- Hint system for learning
- Detailed explanations

## 🚀 Advanced Configuration

### Custom Questions
Edit `src/data/leetcodeQuestions.js` to add your own problems.

### Styling
Modify styled components in each React component to customize appearance.

### API Configuration
Update `src/services/aiService.js` to change API endpoints or add new features.

---

**Ready to start your coding adventure? Launch the game and begin solving LeetCode problems in this fun platformer world! 🎮💻**

