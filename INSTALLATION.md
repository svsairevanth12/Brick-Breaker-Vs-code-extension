# 🧱 Brick Breaker Game - Installation Guide

## 🚀 Quick Start

### Method 1: Install from VSIX File (Recommended)

1. **Download the Extension**
   - Download `brick-breaker-game-1.0.0.vsix` from the releases

2. **Install in VS Code**
   - Open Visual Studio Code
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "Extensions: Install from VSIX..."
   - Select the downloaded `.vsix` file
   - Click "Install"

3. **Start Playing**
   - Press `Ctrl+Shift+P` again
   - Type "Open Brick Breaker Game"
   - Select the command and enjoy!

### Method 2: Development Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/brick-breaker-vscode.git
   cd brick-breaker-vscode
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Compile the Extension**
   ```bash
   npm run compile
   ```

4. **Launch Development Environment**
   - Open the project in VS Code
   - Press `F5` to launch Extension Development Host
   - In the new window, run "Open Brick Breaker Game"

## 🎮 How to Play

### Starting the Game
1. Open Command Palette (`Ctrl+Shift+P`)
2. Type "Open Brick Breaker Game"
3. Click or press Spacebar to start

### Controls
- **Mouse**: Move paddle left/right
- **Click/Spacebar**: Launch ball, start game, restart
- **Arrow Keys**: Alternative paddle movement
- **P or Escape**: Pause/Resume

### Objective
- Break all destructible bricks to advance levels
- Collect power-ups for advantages
- Avoid losing all lives when ball falls off screen

## 🔧 System Requirements

### Minimum Requirements
- **VS Code**: Version 1.74.0 or higher
- **Operating System**: Windows 10+, macOS 10.14+, or Linux
- **Memory**: 4GB RAM
- **Processor**: Any modern CPU (2GHz+)

### Recommended Requirements
- **VS Code**: Latest version
- **Memory**: 8GB RAM or more
- **Processor**: Multi-core CPU for smooth particle effects
- **Display**: 1920x1080 or higher resolution

## 🛠️ Troubleshooting

### Common Issues

#### Game Won't Start
- **Solution**: Ensure VS Code is version 1.74.0 or higher
- **Check**: Command Palette shows "Open Brick Breaker Game"
- **Verify**: Extension is properly installed and enabled

#### Performance Issues
- **Reduce**: Close other VS Code extensions temporarily
- **Check**: System meets minimum requirements
- **Try**: Restart VS Code if game becomes sluggish

#### Controls Not Working
- **Ensure**: Game panel has focus (click on it)
- **Check**: No conflicting VS Code shortcuts
- **Try**: Use alternative controls (mouse vs keyboard)

#### Visual Glitches
- **Solution**: Refresh the game panel
- **Check**: Graphics drivers are up to date
- **Try**: Restart VS Code

### Getting Help

If you encounter issues not covered here:

1. **Check the Console**
   - Press `F12` in VS Code
   - Look for error messages in the Console tab

2. **Report Issues**
   - Visit our GitHub repository
   - Create a new issue with:
     - VS Code version
     - Operating system
     - Error messages (if any)
     - Steps to reproduce

## 🔄 Updating the Extension

### From VSIX File
1. Download the latest `.vsix` file
2. Follow the same installation steps
3. VS Code will automatically update the extension

### From Development
```bash
git pull origin main
npm install
npm run compile
```

## 🗑️ Uninstalling

1. Open VS Code Extensions panel (`Ctrl+Shift+X`)
2. Find "Brick Breaker Game"
3. Click the gear icon → "Uninstall"
4. Restart VS Code

## 📊 Extension Details

### File Size
- **VSIX Package**: ~19KB
- **Installed Size**: ~50KB
- **Memory Usage**: <10MB during gameplay

### Permissions
- **Webview**: Required for game rendering
- **Commands**: Required for game activation
- **No Network**: Extension works completely offline

### Compatibility
- ✅ **Windows**: Fully supported
- ✅ **macOS**: Fully supported  
- ✅ **Linux**: Fully supported
- ✅ **VS Code Web**: Compatible
- ✅ **Codespaces**: Compatible

## 🎯 Performance Tips

### For Best Experience
1. **Close Unused Extensions**: Temporarily disable heavy extensions
2. **Adequate RAM**: Ensure sufficient free memory
3. **Updated Drivers**: Keep graphics drivers current
4. **Focus Game Panel**: Click on game for responsive controls

### Optimization Settings
- Game automatically adjusts particle count based on performance
- Ball speed caps prevent excessive CPU usage
- Memory cleanup occurs between levels

## 🔐 Privacy & Security

### Data Collection
- **No Data Collected**: Extension doesn't collect any user data
- **No Network Requests**: Completely offline operation
- **Local Storage Only**: Game state stored locally in VS Code

### Security
- **Sandboxed**: Runs in VS Code's secure webview environment
- **No File Access**: Cannot access your project files
- **Safe Code**: Open source and auditable

---

## 🎉 Ready to Play!

You're all set! Launch the game and enjoy breaking some bricks during your coding breaks.

**Happy Gaming! 🎮**

---

*For technical support, feature requests, or contributions, visit our GitHub repository.*
