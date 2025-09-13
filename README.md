# LeetCode Quest 🎮

A gamified platformer game for practicing LeetCode problems! Journey through levels, solve coding challenges, and level up your programming skills in this engaging quest-style adventure.

## 🚀 Features

- **Platformer Gameplay**: Navigate through levels with smooth character movement and physics
- **Dynamic Coding Challenges**: AI-generated LeetCode problems with multiple difficulty levels
- **Progressive Difficulty**: Start with easy problems and advance to medium/hard challenges
- **Visual Effects**: Particle systems, animations, and smooth transitions
- **Responsive Design**: Works on desktop and mobile devices
- **XP & Leveling System**: Earn experience points and level up as you solve problems
- **Hint System**: Get helpful hints when you're stuck on a problem

## 🎯 Game Mechanics

### Controls
- **Desktop**: Arrow keys or WASD to move, Space/Up arrow to jump
- **Mobile**: Touch controls for movement and jumping

### Gameplay
1. Navigate through platformer levels
2. Reach coding stations (blue glowing platforms with "?")
3. Solve LeetCode-style problems to progress
4. Earn XP and level up
5. Unlock new levels with harder challenges

### Difficulty Levels
- **Easy**: Basic algorithms, data structures, time complexity
- **Medium**: Dynamic programming, graphs, trees, sorting
- **Hard**: Advanced algorithms, complex data structures, optimization

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **Styled Components** - CSS-in-JS styling
- **Framer Motion** - Smooth animations and transitions
- **Canvas API** - Game rendering and physics

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **Claude API** - AI question generation (configurable)

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd leetcode-quest
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. **Start the development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start them separately:
   # Frontend (port 3000)
   npm start
   
   # Backend (port 3001)
   cd backend && npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to start playing!

### Environment Variables (Optional)

Create a `.env` file in the backend directory for Claude API integration:

```env
CLAUDE_API_KEY=your_claude_api_key_here
NODE_ENV=development
```

## 🎮 How to Play

1. **Start the Game**: The game loads with a beautiful loading screen
2. **Navigate**: Use arrow keys or touch controls to move your character
3. **Jump**: Press space/up arrow or tap to jump over obstacles
4. **Find Coding Stations**: Look for blue glowing platforms with "?" symbols
5. **Solve Problems**: Click on coding stations to get LeetCode problems
6. **Get Hints**: Use the hint button if you're stuck
7. **Progress**: Correct answers give you XP and unlock new areas
8. **Level Up**: Gain enough XP to level up and unlock harder challenges

## 🏗️ Project Structure

```
leetcode-quest/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── GameEngine.js   # Core game engine
│   │   ├── GameUI.js       # UI overlay
│   │   ├── QuestionModal.js # Coding challenge modal
│   │   ├── Player.js       # Player character
│   │   ├── Level.js        # Level rendering
│   │   └── ParticleSystem.js # Visual effects
│   ├── context/            # React context for state
│   │   └── GameContext.js  # Game state management
│   ├── services/           # API services
│   │   └── aiService.js    # AI question generation
│   ├── App.js              # Main app component
│   └── index.js            # App entry point
├── backend/                # Backend API
│   ├── server.js           # Express server
│   └── package.json        # Backend dependencies
└── package.json            # Frontend dependencies
```

## 🎨 Customization

### Adding New Levels
Edit the `getLevelData` function in `GameEngine.js` to add new platform layouts and question stations.

### Modifying Questions
Update the `FALLBACK_QUESTIONS` object in `aiService.js` or `backend/server.js` to add your own questions.

### Styling Changes
Modify the styled components in each React component to change colors, animations, and visual effects.

## 🤖 AI Integration

The game is designed to work with Claude API for dynamic question generation. To enable this:

1. Get a Claude API key from Anthropic
2. Add it to your backend `.env` file
3. Uncomment the Claude API integration code in `backend/server.js`

The game will fallback to predefined questions if the AI service is unavailable.

## 🚀 Deployment

### Frontend (React)
```bash
npm run build
# Deploy the 'build' folder to your hosting service
```

### Backend (Node.js)
```bash
cd backend
npm start
# Deploy to your preferred Node.js hosting service
```

## 🐛 Troubleshooting

### Common Issues

1. **Game not loading**: Check that both frontend and backend servers are running
2. **Questions not appearing**: Verify the backend API is accessible at `http://localhost:3001`
3. **Mobile controls not working**: Ensure touch events are enabled in your browser
4. **Performance issues**: Try reducing the canvas size or disabling some animations

### Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Touch controls supported

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎉 Acknowledgments

- Inspired by classic platformer games
- Built with modern web technologies
- AI integration powered by Claude API
- Special thanks to the React and gaming communities

---

**Happy Coding and Gaming! 🎮💻**