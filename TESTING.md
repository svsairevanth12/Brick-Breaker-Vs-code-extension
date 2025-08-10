# Brick Breaker Game - Testing Guide

## Test Environment Setup

1. Open VS Code
2. Open this project folder
3. Press `F5` to launch Extension Development Host
4. In the new window, press `Ctrl+Shift+P` and run "Open Brick Breaker Game"

## Core Functionality Tests

### ✅ Extension Loading
- [ ] Extension activates without errors
- [ ] Command appears in Command Palette
- [ ] Webview panel opens successfully
- [ ] Game canvas renders properly

### ✅ Basic Game Mechanics
- [ ] Menu screen displays correctly
- [ ] Click/Spacebar starts the game
- [ ] Paddle follows mouse movement
- [ ] Paddle responds to arrow keys
- [ ] Ball launches from paddle
- [ ] Ball bounces off walls correctly
- [ ] Ball bounces off paddle with angle variation
- [ ] Ball resets when falling off screen
- [ ] Lives decrease when ball is lost

### ✅ Brick System
- [ ] Bricks render in proper grid layout
- [ ] Ball destroys bricks on collision
- [ ] Multi-hit bricks require multiple hits
- [ ] Brick colors indicate hit points
- [ ] Score increases when bricks are destroyed
- [ ] Level completes when all destructible bricks are gone
- [ ] New level generates with increased difficulty

### ✅ Collision Detection
- [ ] Ball-paddle collision works accurately
- [ ] Ball-brick collision detects all sides
- [ ] Ball bounces in correct direction after brick hit
- [ ] No ball sticking to objects
- [ ] Collision detection works at high speeds

## Advanced Features Tests

### ✅ Power-Up System
- [ ] Power-ups drop from destroyed bricks (10% chance)
- [ ] Power-ups fall at correct speed
- [ ] Paddle catches power-ups correctly
- [ ] Laser power-up activates (red paddle, 10s duration)
- [ ] Expand power-up works (wider paddle, 15s duration)
- [ ] Slow ball power-up functions (8s duration)
- [ ] Extra life power-up adds life
- [ ] Power-up timers work correctly
- [ ] Multiple power-ups can be active simultaneously
- [ ] Power-up status displays correctly

### ✅ Advanced Brick Types
- [ ] Indestructible blocks appear on level 4+
- [ ] Indestructible blocks show ⚡ symbol
- [ ] Indestructible blocks don't count for level completion
- [ ] Moving bricks appear on level 5+
- [ ] Moving bricks bounce off screen edges
- [ ] Moving bricks maintain collision detection while moving

### ✅ Game Progression
- [ ] Ball speed increases every 30 seconds
- [ ] Speed indicator shows when ball is fast
- [ ] Level number increases correctly
- [ ] Brick patterns become more complex
- [ ] Difficulty scales appropriately

## UI and Visual Tests

### ✅ User Interface
- [ ] Score displays and updates correctly
- [ ] Lives counter shows current lives
- [ ] Level indicator updates properly
- [ ] Pause instruction visible during gameplay
- [ ] Active power-ups display correctly
- [ ] Speed indicator appears when relevant

### ✅ Visual Effects
- [ ] Menu has animated background
- [ ] Title has glow effect
- [ ] Start button pulses
- [ ] Particle effects on brick destruction
- [ ] Level completion celebration particles
- [ ] Ball trail effect renders smoothly
- [ ] Paddle highlight effect visible

### ✅ Game States
- [ ] Menu state renders correctly
- [ ] Playing state shows all game elements
- [ ] Pause overlay appears with P/Escape
- [ ] Game over screen shows final score and level
- [ ] All transitions between states work smoothly

## Control Tests

### ✅ Mouse Controls
- [ ] Mouse movement controls paddle smoothly
- [ ] Click launches ball when attached
- [ ] Click starts game from menu
- [ ] Click restarts from game over
- [ ] Mouse works across entire canvas width

### ✅ Keyboard Controls
- [ ] Spacebar launches ball
- [ ] Spacebar starts/restarts game
- [ ] Arrow keys move paddle
- [ ] P key pauses/resumes game
- [ ] Escape key pauses/resumes game
- [ ] No key conflicts with VS Code

## Edge Cases and Error Handling

### ✅ Boundary Conditions
- [ ] Paddle stays within screen bounds
- [ ] Ball bounces correctly at screen edges
- [ ] Moving bricks don't go off screen
- [ ] Power-ups disappear when off screen
- [ ] Particles clean up properly

### ✅ Performance Tests
- [ ] Game runs smoothly at 60fps
- [ ] No memory leaks during extended play
- [ ] Particle system doesn't cause lag
- [ ] Multiple power-ups don't impact performance
- [ ] High ball speeds maintain smooth gameplay

### ✅ Error Scenarios
- [ ] Game handles rapid clicking
- [ ] Multiple simultaneous key presses work
- [ ] Resizing VS Code panel doesn't break game
- [ ] Switching between VS Code tabs and back works
- [ ] No console errors during normal gameplay

## Browser Compatibility

### ✅ Canvas Support
- [ ] HTML5 Canvas renders correctly
- [ ] All drawing operations work
- [ ] Animation frame timing is consistent
- [ ] Mouse event coordinates are accurate

## Accessibility

### ✅ Basic Accessibility
- [ ] Game instructions are clear
- [ ] Controls are documented
- [ ] Visual feedback is sufficient
- [ ] Text is readable

## Performance Benchmarks

### Target Metrics
- [ ] Consistent 60fps during normal gameplay
- [ ] < 100MB memory usage
- [ ] < 5% CPU usage on modern hardware
- [ ] Smooth animation with 100+ particles

## Test Results Summary

**Date:** ___________  
**Tester:** ___________  
**VS Code Version:** ___________  
**OS:** ___________  

**Overall Status:** ⭐⭐⭐⭐⭐ (Rate 1-5 stars)

**Critical Issues Found:** ___________

**Recommendations:** ___________

---

## Automated Testing Commands

```bash
# Compile and check for TypeScript errors
npm run compile

# Run linting
npm run lint

# Package extension
npm run package
```
