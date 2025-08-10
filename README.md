# 🧱 Brick Breaker Game for VS Code

A fully-featured classic brick breaker game that you can play directly within Visual Studio Code! Take a break from coding and enjoy this nostalgic arcade experience.

## ✨ Features

### Core Gameplay
- 🎮 **Classic brick breaker mechanics** with modern polish
- 🎯 **Smooth controls** via mouse and keyboard
- 🏆 **Score tracking** and lives system
- 📈 **Progressive difficulty** with unlimited levels
- ⚡ **Dynamic ball speed** that increases over time

### Visual Effects
- 🎨 **Colorful bricks** with different hit points and visual feedback
- ✨ **Particle effects** for brick destruction and level completion
- 🌟 **Animated menus** with glowing effects
- 🎭 **Visual power-up indicators** and status displays

### Power-Up System
- 🔫 **Laser Paddle**: Fire bullets to destroy bricks
- ⬅️➡️ **Expand Paddle**: Wider paddle for easier ball control
- 🏐 **Multi-ball**: Split ball into multiple balls (coming soon)
- 🐌 **Slow Ball**: Reduced ball speed for precision control
- ❤️ **Extra Life**: Additional chances to continue playing

### Advanced Features
- 🛡️ **Indestructible blocks** on higher levels
- 🔄 **Moving bricks** that change position
- 💎 **Multi-hit bricks** requiring multiple hits to destroy
- 🎚️ **Adaptive difficulty** scaling with level progression

## 🎮 How to Play

1. **Open the game**:
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "Open Brick Breaker Game"
   - Select the command from the list

2. **Start playing**:
   - Move your mouse to control the paddle
   - Click or press Spacebar to launch the ball
   - Break all destructible bricks to advance to the next level

3. **Collect power-ups**:
   - Power-ups fall from destroyed bricks
   - Move your paddle to catch them
   - Each power-up provides a temporary advantage

## 🎯 Controls

| Control | Action |
|---------|--------|
| **Mouse Movement** | Move paddle left/right |
| **Click** | Launch ball / Start game / Restart |
| **Spacebar** | Launch ball / Start game / Resume |
| **Arrow Keys** | Alternative paddle movement |
| **P or Escape** | Pause/Resume game |

## 🚀 Power-Ups Guide

| Power-Up | Effect | Duration |
|----------|--------|----------|
| 🔫 **Laser** | Paddle can fire bullets at bricks | 10 seconds |
| ⬅️➡️ **Expand** | Paddle becomes 50% wider | 15 seconds |
| 🏐 **Multi-ball** | Creates additional balls | Permanent |
| 🐌 **Slow** | Ball moves 40% slower | 8 seconds |
| ❤️ **Extra Life** | Adds one additional life | Permanent |

## 📊 Game Progression

- **Levels**: Unlimited with increasing difficulty
- **Brick Types**:
  - Regular bricks (1-3 hits)
  - Indestructible blocks (⚡ symbol)
  - Moving bricks (levels 5+)
- **Speed Scaling**: Ball speed increases every 30 seconds
- **Power-Up Frequency**: 10% chance per destroyed brick

## 🛠️ Installation

### From VS Code Marketplace (Coming Soon)
1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for "Brick Breaker Game"
4. Click Install

### Manual Installation
1. Download the `.vsix` file from releases
2. Open VS Code
3. Press `Ctrl+Shift+P` and type "Extensions: Install from VSIX"
4. Select the downloaded file

## 🔧 Development

### Prerequisites
- Node.js 16+
- VS Code 1.74+
- TypeScript

### Setup
```bash
# Clone the repository
git clone https://github.com/your-username/brick-breaker-vscode.git
cd brick-breaker-vscode

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Launch development environment
# Press F5 in VS Code to open Extension Development Host
```

### Building
```bash
# Compile the extension
npm run compile

# Package for distribution
npm run package
```

## 🎯 Game Tips

1. **Paddle Positioning**: Keep the paddle centered for better ball control
2. **Power-Up Strategy**: Prioritize Expand and Laser power-ups for easier gameplay
3. **Speed Management**: Use Slow Ball power-up when the game gets too fast
4. **Level Strategy**: Focus on destroying regular bricks first, leave indestructible blocks
5. **Angle Control**: Hit the ball with different parts of the paddle to control bounce angle

## 🐛 Known Issues

- Multi-ball power-up creates additional balls but game currently tracks only one
- Very high speeds (10x+) may cause collision detection issues
- Particle effects may impact performance on slower machines

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the classic Atari Breakout game
- Built with VS Code Extension API
- Uses HTML5 Canvas for rendering

---

**Enjoy your coding breaks with Brick Breaker! 🎮**
