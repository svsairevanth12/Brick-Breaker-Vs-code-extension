import * as vscode from 'vscode';

export class BrickBreakerPanel {
    public static currentPanel: BrickBreakerPanel | undefined;
    public static readonly viewType = 'brickBreaker';

    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(extensionUri: vscode.Uri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        // If we already have a panel, show it
        if (BrickBreakerPanel.currentPanel) {
            BrickBreakerPanel.currentPanel._panel.reveal(column);
            return;
        }

        // Otherwise, create a new panel
        const panel = vscode.window.createWebviewPanel(
            BrickBreakerPanel.viewType,
            'Brick Breaker Game',
            column || vscode.ViewColumn.One,
            {
                // Enable javascript in the webview
                enableScripts: true,
                // And restrict the webview to only loading content from our extension's directory
                localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
            }
        );

        BrickBreakerPanel.currentPanel = new BrickBreakerPanel(panel, extensionUri);
    }

    public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        BrickBreakerPanel.currentPanel = new BrickBreakerPanel(panel, extensionUri);
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;
        this._extensionUri = extensionUri;

        // Set the webview's initial html content
        this._update();

        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programmatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        // Update the content based on view changes
        this._panel.onDidChangeViewState(
            e => {
                if (this._panel.visible) {
                    this._update();
                }
            },
            null,
            this._disposables
        );

        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'alert':
                        vscode.window.showErrorMessage(message.text);
                        return;
                    case 'gameScore':
                        // Handle score updates if needed
                        console.log('Game score:', message.score);
                        return;
                }
            },
            null,
            this._disposables
        );
    }

    public dispose() {
        BrickBreakerPanel.currentPanel = undefined;

        // Clean up our resources
        this._panel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private _update() {
        const webview = this._panel.webview;
        this._panel.title = 'Brick Breaker Game';
        this._panel.webview.html = this._getHtmlForWebview(webview);
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Brick Breaker Game</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            background-color: #1e1e1e;
            color: white;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 100vh;
        }
        
        #gameContainer {
            text-align: center;
            margin-bottom: 20px;
        }
        
        #gameCanvas {
            border: 2px solid #007acc;
            background-color: #000;
            cursor: none;
        }
        
        #gameInfo {
            margin-top: 10px;
            display: flex;
            justify-content: space-between;
            width: 800px;
            font-size: 18px;
            font-weight: bold;
        }
        
        #instructions {
            margin-top: 20px;
            max-width: 800px;
            text-align: center;
            line-height: 1.6;
        }
        
        .instruction-item {
            margin: 5px 0;
        }
        
        h1 {
            color: #007acc;
            margin-bottom: 10px;
        }
        
        .power-up {
            display: inline-block;
            margin: 0 10px;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <h1>🧱 Brick Breaker Game</h1>
    
    <div id="gameContainer">
        <canvas id="gameCanvas" width="800" height="600"></canvas>
        <div id="gameInfo">
            <div>Score: <span id="score">0</span></div>
            <div>Lives: <span id="lives">3</span></div>
            <div>Level: <span id="level">1</span></div>
        </div>
    </div>
    
    <div id="instructions">
        <div class="instruction-item"><strong>Controls:</strong> Move mouse to control paddle • Click or Spacebar to launch ball</div>
        <div class="instruction-item">
            <strong>Power-ups:</strong>
            <span class="power-up">🔫 Laser</span>
            <span class="power-up">⬅️➡️ Expand</span>
            <span class="power-up">🏐 Multi-ball</span>
            <span class="power-up">🐌 Slow</span>
            <span class="power-up">❤️ Extra Life</span>
        </div>
    </div>

    <script>
        // Get VS Code API
        const vscode = acquireVsCodeApi();

        // Game setup
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');

        // Game state
        let gameState = 'menu'; // 'menu', 'playing', 'paused', 'gameOver'
        let score = 0;
        let lives = 3;
        let level = 1;
        let animationId;
        let gameTime = 0; // Track game time for speed increases

        // Game object classes
        class Paddle {
            constructor(x, y, width, height) {
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
                this.speed = 8;
                this.color = '#007acc';
            }

            update() {
                // Mouse control
                this.x = mouseX - this.width / 2;

                // Keyboard control
                if (keys['ArrowLeft'] || keys['KeyA']) {
                    this.x -= this.speed;
                }
                if (keys['ArrowRight'] || keys['KeyD']) {
                    this.x += this.speed;
                }

                // Keep paddle within canvas bounds
                if (this.x < 0) {
                    this.x = 0;
                }
                if (this.x + this.width > canvas.width) {
                    this.x = canvas.width - this.width;
                }
            }

            render() {
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, this.width, this.height);

                // Add a highlight effect
                ctx.fillStyle = '#4da6ff';
                ctx.fillRect(this.x, this.y, this.width, 3);
            }

            getCenter() {
                return {
                    x: this.x + this.width / 2,
                    y: this.y + this.height / 2
                };
            }
        }

        class Ball {
            constructor(x, y, radius) {
                this.x = x;
                this.y = y;
                this.radius = radius;
                this.vx = 0;
                this.vy = 0;
                this.speed = 5;
                this.isAttached = true; // Ball starts attached to paddle
                this.color = '#fff';
                this.trail = []; // For visual trail effect
            }

            update() {
                if (this.isAttached && paddle) {
                    // Ball follows paddle when attached
                    this.x = paddle.getCenter().x;
                    this.y = paddle.y - this.radius - 5;
                    return;
                }

                // Update position
                this.x += this.vx;
                this.y += this.vy;

                // Add to trail
                this.trail.push({x: this.x, y: this.y});
                if (this.trail.length > 5) {
                    this.trail.shift();
                }

                // Bounce off walls
                if (this.x - this.radius <= 0 || this.x + this.radius >= canvas.width) {
                    this.vx = -this.vx;
                    this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
                }

                if (this.y - this.radius <= 0) {
                    this.vy = -this.vy;
                    this.y = this.radius;
                }

                // Check if ball fell off bottom
                if (this.y > canvas.height + this.radius) {
                    this.reset();
                }

                // Collision with paddle
                this.checkPaddleCollision();

                // Collision with bricks
                this.checkBrickCollisions();
            }

            checkPaddleCollision() {
                if (!paddle) return;

                // Simple AABB collision detection
                if (this.x + this.radius > paddle.x &&
                    this.x - this.radius < paddle.x + paddle.width &&
                    this.y + this.radius > paddle.y &&
                    this.y - this.radius < paddle.y + paddle.height) {

                    // Calculate bounce angle based on where ball hits paddle
                    const hitPos = (this.x - paddle.getCenter().x) / (paddle.width / 2);
                    const bounceAngle = hitPos * Math.PI / 3; // Max 60 degrees

                    this.vx = this.speed * Math.sin(bounceAngle);
                    this.vy = -Math.abs(this.speed * Math.cos(bounceAngle));

                    // Move ball above paddle to prevent sticking
                    this.y = paddle.y - this.radius - 1;
                }
            }

            checkBrickCollisions() {
                for (let i = 0; i < bricks.length; i++) {
                    const brick = bricks[i];
                    if (brick.isDestroyed) continue;

                    const bounds = brick.getBounds();

                    // Check if ball intersects with brick
                    if (this.x + this.radius > bounds.left &&
                        this.x - this.radius < bounds.right &&
                        this.y + this.radius > bounds.top &&
                        this.y - this.radius < bounds.bottom) {

                        // Determine collision side for proper bounce
                        const ballCenterX = this.x;
                        const ballCenterY = this.y;
                        const brickCenterX = bounds.left + (bounds.right - bounds.left) / 2;
                        const brickCenterY = bounds.top + (bounds.bottom - bounds.top) / 2;

                        const deltaX = ballCenterX - brickCenterX;
                        const deltaY = ballCenterY - brickCenterY;

                        // Calculate overlap on each axis
                        const overlapX = (brick.width / 2 + this.radius) - Math.abs(deltaX);
                        const overlapY = (brick.height / 2 + this.radius) - Math.abs(deltaY);

                        // Determine collision direction based on smallest overlap
                        if (overlapX < overlapY) {
                            // Horizontal collision
                            this.vx = -this.vx;
                            // Move ball out of brick
                            if (deltaX > 0) {
                                this.x = bounds.right + this.radius;
                            } else {
                                this.x = bounds.left - this.radius;
                            }
                        } else {
                            // Vertical collision
                            this.vy = -this.vy;
                            // Move ball out of brick
                            if (deltaY > 0) {
                                this.y = bounds.bottom + this.radius;
                            } else {
                                this.y = bounds.top - this.radius;
                            }
                        }

                        // Hit the brick
                        const destroyed = brick.hit();

                        // Create power-up if brick had one
                        if (destroyed && brick.powerUpType) {
                            createPowerUp(brick.x + brick.width/2, brick.y + brick.height/2, brick.powerUpType);
                        }

                        // Only process one collision per frame
                        break;
                    }
                }
            }

            launch() {
                if (this.isAttached) {
                    this.isAttached = false;
                    this.vx = (Math.random() - 0.5) * 2; // Random horizontal velocity
                    this.vy = -this.speed; // Upward velocity
                }
            }

            reset() {
                this.isAttached = true;
                this.vx = 0;
                this.vy = 0;
                this.trail = [];
                lives--;
                updateUI();

                if (lives <= 0) {
                    gameState = 'gameOver';
                }
            }

            render() {
                // Render trail
                ctx.globalAlpha = 0.3;
                for (let i = 0; i < this.trail.length; i++) {
                    const alpha = (i + 1) / this.trail.length * 0.3;
                    ctx.globalAlpha = alpha;
                    ctx.fillStyle = this.color;
                    ctx.beginPath();
                    ctx.arc(this.trail[i].x, this.trail[i].y, this.radius * 0.7, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Render ball
                ctx.globalAlpha = 1;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();

                // Add glow effect
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        class Brick {
            constructor(x, y, width, height, color, hitPoints = 1, isIndestructible = false) {
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
                this.color = color;
                this.hitPoints = hitPoints;
                this.maxHitPoints = hitPoints;
                this.isDestroyed = false;
                this.isIndestructible = isIndestructible;
                this.powerUpType = null; // Will be set randomly for some bricks
                this.moveSpeed = 0; // For moving bricks
                this.moveDirection = 1; // 1 for right, -1 for left
                this.originalX = x; // Store original position for moving bricks
            }

            update() {
                // Moving brick logic
                if (this.moveSpeed > 0) {
                    this.x += this.moveSpeed * this.moveDirection;

                    // Bounce off edges
                    if (this.x <= 0 || this.x + this.width >= canvas.width) {
                        this.moveDirection *= -1;
                    }

                    // Keep within reasonable bounds
                    this.x = Math.max(0, Math.min(canvas.width - this.width, this.x));
                }
            }

            hit() {
                if (this.isIndestructible) {
                    return false; // Indestructible bricks can't be destroyed
                }

                this.hitPoints--;

                // Create particles on hit
                createParticles(this.x + this.width/2, this.y + this.height/2, this.color, 4);

                if (this.hitPoints <= 0) {
                    this.isDestroyed = true;
                    score += 10 * this.maxHitPoints;
                    updateUI();

                    // Create more particles on destruction
                    createParticles(this.x + this.width/2, this.y + this.height/2, this.color, 12);

                    return true; // Brick destroyed
                }
                return false; // Brick still alive
            }

            render() {
                if (this.isDestroyed) return;

                // Special rendering for indestructible bricks
                if (this.isIndestructible) {
                    // Metallic gray color with pattern
                    ctx.fillStyle = '#666';
                    ctx.fillRect(this.x, this.y, this.width, this.height);

                    // Add metallic pattern
                    ctx.fillStyle = '#888';
                    for (let i = 0; i < this.width; i += 8) {
                        ctx.fillRect(this.x + i, this.y, 4, this.height);
                    }

                    // Strong border
                    ctx.strokeStyle = '#333';
                    ctx.lineWidth = 3;
                    ctx.strokeRect(this.x, this.y, this.width, this.height);

                    // Indestructible symbol
                    ctx.fillStyle = '#fff';
                    ctx.font = '16px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('⚡', this.x + this.width/2, this.y + this.height/2 + 6);

                    return;
                }

                // Calculate color intensity based on hit points
                const intensity = this.hitPoints / this.maxHitPoints;

                // Main brick color
                ctx.fillStyle = this.color;
                ctx.globalAlpha = intensity;
                ctx.fillRect(this.x, this.y, this.width, this.height);

                // Highlight effect
                ctx.globalAlpha = intensity * 0.8;
                ctx.fillStyle = '#fff';
                ctx.fillRect(this.x, this.y, this.width, 3);

                // Border
                ctx.globalAlpha = 1;
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 1;
                ctx.strokeRect(this.x, this.y, this.width, this.height);

                // Show hit points if more than 1
                if (this.maxHitPoints > 1) {
                    ctx.fillStyle = '#fff';
                    ctx.font = '12px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(this.hitPoints.toString(),
                        this.x + this.width/2, this.y + this.height/2 + 4);
                }

                ctx.globalAlpha = 1;
            }

            getBounds() {
                return {
                    left: this.x,
                    right: this.x + this.width,
                    top: this.y,
                    bottom: this.y + this.height
                };
            }
        }

        class PowerUp {
            constructor(x, y, type) {
                this.x = x;
                this.y = y;
                this.type = type;
                this.width = 30;
                this.height = 20;
                this.speed = 2;
                this.isActive = true;

                // Power-up properties
                this.colors = {
                    'laser': '#ff4444',
                    'expand': '#44ff44',
                    'multiball': '#4444ff',
                    'slow': '#ffff44',
                    'extralife': '#ff44ff'
                };

                this.symbols = {
                    'laser': '🔫',
                    'expand': '⬅️➡️',
                    'multiball': '🏐',
                    'slow': '🐌',
                    'extralife': '❤️'
                };
            }

            update() {
                if (!this.isActive) return;

                this.y += this.speed;

                // Remove if off screen
                if (this.y > canvas.height) {
                    this.isActive = false;
                }

                // Check collision with paddle
                if (paddle &&
                    this.x < paddle.x + paddle.width &&
                    this.x + this.width > paddle.x &&
                    this.y < paddle.y + paddle.height &&
                    this.y + this.height > paddle.y) {

                    this.activate();
                    this.isActive = false;
                }
            }

            activate() {
                switch(this.type) {
                    case 'laser':
                        activateLaser();
                        break;
                    case 'expand':
                        activateExpandPaddle();
                        break;
                    case 'multiball':
                        activateMultiball();
                        break;
                    case 'slow':
                        activateSlowBall();
                        break;
                    case 'extralife':
                        activateExtraLife();
                        break;
                }
            }

            render() {
                if (!this.isActive) return;

                // Draw power-up background
                ctx.fillStyle = this.colors[this.type];
                ctx.fillRect(this.x, this.y, this.width, this.height);

                // Draw border
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2;
                ctx.strokeRect(this.x, this.y, this.width, this.height);

                // Draw symbol
                ctx.fillStyle = '#fff';
                ctx.font = '14px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(this.symbols[this.type],
                    this.x + this.width/2, this.y + this.height/2 + 5);
            }
        }

        // Power-up creation
        function createPowerUp(x, y, type) {
            const powerUp = new PowerUp(x - 15, y, type); // Center on brick
            powerUps.push(powerUp);
        }

        // Power-up activation functions
        let activePowerUps = {
            laser: false,
            expand: false,
            slow: false
        };

        let powerUpTimers = {};

        function activateLaser() {
            activePowerUps.laser = true;
            paddle.color = '#ff4444';

            // Laser lasts 10 seconds
            clearTimeout(powerUpTimers.laser);
            powerUpTimers.laser = setTimeout(() => {
                activePowerUps.laser = false;
                paddle.color = '#007acc';
            }, 10000);
        }

        function activateExpandPaddle() {
            if (!activePowerUps.expand) {
                paddle.width *= 1.5;
                activePowerUps.expand = true;
                paddle.color = '#44ff44';

                // Expand lasts 15 seconds
                clearTimeout(powerUpTimers.expand);
                powerUpTimers.expand = setTimeout(() => {
                    paddle.width /= 1.5;
                    activePowerUps.expand = false;
                    if (!activePowerUps.laser) {
                        paddle.color = '#007acc';
                    }
                }, 15000);
            }
        }

        function activateMultiball() {
            if (ball && !ball.isAttached) {
                // Create two additional balls
                for (let i = 0; i < 2; i++) {
                    const newBall = new Ball(ball.x, ball.y, ball.radius);
                    newBall.isAttached = false;
                    newBall.vx = ball.vx + (Math.random() - 0.5) * 4;
                    newBall.vy = ball.vy + (Math.random() - 0.5) * 2;
                    newBall.speed = ball.speed;
                    // We'll need to modify the game to handle multiple balls
                    console.log('Additional ball created (multiball feature needs multiple ball support)');
                }
            }
        }

        function activateSlowBall() {
            if (ball) {
                ball.speed *= 0.6;
                activePowerUps.slow = true;

                // Slow lasts 8 seconds
                clearTimeout(powerUpTimers.slow);
                powerUpTimers.slow = setTimeout(() => {
                    ball.speed /= 0.6;
                    activePowerUps.slow = false;
                }, 8000);
            }
        }

        function activateExtraLife() {
            lives++;
            updateUI();
        }

        // Particle system for visual effects
        class Particle {
            constructor(x, y, color) {
                this.x = x;
                this.y = y;
                this.vx = (Math.random() - 0.5) * 8;
                this.vy = (Math.random() - 0.5) * 8;
                this.color = color;
                this.life = 1.0;
                this.decay = 0.02 + Math.random() * 0.02;
                this.size = 2 + Math.random() * 3;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += 0.2; // Gravity
                this.life -= this.decay;
                this.size *= 0.98;
            }

            render() {
                if (this.life <= 0) return;

                ctx.globalAlpha = this.life;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }

            isDead() {
                return this.life <= 0;
            }
        }

        function createParticles(x, y, color, count = 8) {
            for (let i = 0; i < count; i++) {
                particles.push(new Particle(x, y, color));
            }
        }

        // Game objects
        let paddle = null;
        let ball = null;
        let bricks = [];
        let powerUps = [];
        let particles = [];

        // Level generation
        function generateLevel(levelNumber) {
            bricks = [];
            const brickWidth = 75;
            const brickHeight = 25;
            const brickPadding = 5;
            const brickOffsetTop = 80;
            const brickOffsetLeft = 35;

            const brickColors = [
                '#ff4444', // Red - 1 hit
                '#ff8844', // Orange - 2 hits
                '#ffff44', // Yellow - 1 hit
                '#44ff44', // Green - 1 hit
                '#4444ff', // Blue - 2 hits
                '#ff44ff', // Purple - 3 hits
            ];

            // Calculate grid dimensions
            const bricksPerRow = Math.floor((canvas.width - 2 * brickOffsetLeft) / (brickWidth + brickPadding));
            const rows = Math.min(6 + Math.floor(levelNumber / 3), 10); // More rows as level increases

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < bricksPerRow; col++) {
                    const x = brickOffsetLeft + col * (brickWidth + brickPadding);
                    const y = brickOffsetTop + row * (brickHeight + brickPadding);

                    // Determine brick properties based on row and level
                    let colorIndex = row % brickColors.length;
                    let hitPoints = 1;
                    let isIndestructible = false;
                    let moveSpeed = 0;

                    // Higher rows and levels have stronger bricks
                    if (row < 2 && levelNumber > 2) {
                        hitPoints = 3;
                        colorIndex = 5; // Purple
                    } else if (row < 4 && levelNumber > 1) {
                        hitPoints = 2;
                        colorIndex = Math.min(colorIndex + 1, 4); // Orange or Blue
                    }

                    // Add indestructible blocks on higher levels (5% chance)
                    if (levelNumber > 3 && Math.random() < 0.05) {
                        isIndestructible = true;
                    }

                    // Add moving bricks on higher levels
                    if (levelNumber > 4 && row > 2 && Math.random() < 0.15) {
                        moveSpeed = 0.5 + Math.random() * 1; // Random speed between 0.5 and 1.5
                    }

                    const brick = new Brick(x, y, brickWidth, brickHeight,
                        brickColors[colorIndex], hitPoints, isIndestructible);

                    brick.moveSpeed = moveSpeed;

                    // Randomly assign power-ups to some bricks (10% chance, not for indestructible)
                    if (!isIndestructible && Math.random() < 0.1) {
                        const powerUpTypes = ['laser', 'expand', 'multiball', 'slow', 'extralife'];
                        brick.powerUpType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
                    }

                    bricks.push(brick);
                }
            }
        }

        // Input handling
        let keys = {};
        let mouseX = 0;
        let mouseY = 0;

        // Game loop
        function gameLoop() {
            update();
            render();
            animationId = requestAnimationFrame(gameLoop);
        }

        function update() {
            // Update game objects based on current state
            switch(gameState) {
                case 'menu':
                    // Menu update logic
                    break;
                case 'playing':
                    // Game playing update logic
                    updateGame();
                    break;
                case 'paused':
                    // Paused state
                    break;
                case 'gameOver':
                    // Game over state
                    break;
            }
        }

        function updateGame() {
            // Increment game time
            gameTime++;

            // Update paddle
            if (paddle) {
                paddle.update();
            }

            // Update ball
            if (ball) {
                ball.update();

                // Gradually increase ball speed over time (every 30 seconds at 60fps)
                if (gameTime % 1800 === 0 && !ball.isAttached) {
                    ball.speed *= 1.05; // 5% speed increase
                    console.log('Ball speed increased to:', ball.speed);
                }
            }

            // Update bricks (for moving bricks)
            bricks.forEach(brick => {
                if (!brick.isDestroyed) {
                    brick.update();
                }
            });

            // Update power-ups
            powerUps.forEach(powerUp => {
                powerUp.update();
            });

            // Remove inactive power-ups
            powerUps = powerUps.filter(powerUp => powerUp.isActive);

            // Update particles
            particles.forEach(particle => {
                particle.update();
            });

            // Remove dead particles
            particles = particles.filter(particle => !particle.isDead());

            // Check for level completion (exclude indestructible bricks)
            const remainingBricks = bricks.filter(brick => !brick.isDestroyed && !brick.isIndestructible);
            if (remainingBricks.length === 0) {
                // Level completed! Create celebration particles
                for (let i = 0; i < 50; i++) {
                    const x = Math.random() * canvas.width;
                    const y = Math.random() * canvas.height;
                    const colors = ['#ff4444', '#44ff44', '#4444ff', '#ffff44', '#ff44ff'];
                    createParticles(x, y, colors[Math.floor(Math.random() * colors.length)], 1);
                }

                level++;
                updateUI();
                generateLevel(level);

                // Reset ball but keep some speed progression
                if (ball) {
                    ball.reset();
                    ball.isAttached = true;
                    ball.speed = Math.min(ball.speed, 8); // Cap speed between levels
                }

                // Reset game time for speed progression
                gameTime = 0;
            }
        }

        function render() {
            // Clear canvas
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Render based on game state
            switch(gameState) {
                case 'menu':
                    renderMenu();
                    break;
                case 'playing':
                    renderGame();
                    break;
                case 'paused':
                    renderGame();
                    renderPauseOverlay();
                    break;
                case 'gameOver':
                    renderGameOver();
                    break;
            }
        }

        function renderMenu() {
            // Animated background
            const time = Date.now() * 0.001;
            for (let i = 0; i < 50; i++) {
                const x = (i * 37 + time * 20) % canvas.width;
                const y = (i * 23 + time * 15) % canvas.height;
                ctx.fillStyle = 'rgba(0, 122, 204, 0.1)';
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fill();
            }

            // Title with glow effect
            ctx.shadowColor = '#007acc';
            ctx.shadowBlur = 20;
            ctx.fillStyle = '#007acc';
            ctx.font = 'bold 48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('BRICK BREAKER', canvas.width/2, canvas.height/2 - 80);

            ctx.shadowBlur = 0;
            ctx.fillStyle = '#fff';
            ctx.font = '24px Arial';
            ctx.fillText('A Classic Game in VS Code', canvas.width/2, canvas.height/2 - 30);

            // Animated start button
            const buttonAlpha = 0.7 + 0.3 * Math.sin(time * 3);
            ctx.fillStyle = 'rgba(255, 255, 255, ' + buttonAlpha + ')';
            ctx.font = '28px Arial';
            ctx.fillText('Click or Press SPACE to Start', canvas.width/2, canvas.height/2 + 40);

            // Controls info
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.font = '16px Arial';
            ctx.fillText('Mouse: Move Paddle • Space/Click: Launch Ball • P: Pause', canvas.width/2, canvas.height/2 + 100);
        }

        function renderGame() {
            // Render bricks
            bricks.forEach(brick => {
                brick.render();
            });

            // Render power-ups
            powerUps.forEach(powerUp => {
                powerUp.render();
            });

            // Render particles
            particles.forEach(particle => {
                particle.render();
            });

            // Render paddle
            if (paddle) {
                paddle.render();
            }

            // Render ball
            if (ball) {
                ball.render();
            }

            // Show instructions if game just started
            if (!ball || ball.isAttached) {
                ctx.fillStyle = '#fff';
                ctx.font = '16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Move mouse to control paddle', canvas.width/2, 50);
                ctx.fillText('Click or press SPACE to launch ball', canvas.width/2, 75);
            }

            // Show pause instruction
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.font = '12px Arial';
            ctx.textAlign = 'right';
            ctx.fillText('Press P to pause', canvas.width - 10, 20);

            // Show active power-ups
            let powerUpY = 40;
            ctx.textAlign = 'left';
            if (activePowerUps.laser) {
                ctx.fillStyle = '#ff4444';
                ctx.fillText('🔫 Laser Active', 10, powerUpY);
                powerUpY += 20;
            }
            if (activePowerUps.expand) {
                ctx.fillStyle = '#44ff44';
                ctx.fillText('⬅️➡️ Expanded Paddle', 10, powerUpY);
                powerUpY += 20;
            }
            if (activePowerUps.slow) {
                ctx.fillStyle = '#ffff44';
                ctx.fillText('🐌 Slow Ball', 10, powerUpY);
                powerUpY += 20;
            }

            // Show ball speed if it's increased
            if (ball && ball.speed > 5.5) {
                ctx.fillStyle = '#ff8844';
                ctx.fillText('⚡ Speed: ' + ball.speed.toFixed(1) + 'x', 10, powerUpY);
            }
        }

        function renderPauseOverlay() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#007acc';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('PAUSED', canvas.width/2, canvas.height/2 - 30);

            ctx.fillStyle = '#fff';
            ctx.font = '20px Arial';
            ctx.fillText('Press P or ESC to resume', canvas.width/2, canvas.height/2 + 20);
            ctx.fillText('Press SPACE to resume', canvas.width/2, canvas.height/2 + 50);
        }

        function renderGameOver() {
            // Semi-transparent overlay
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#ff4444';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2 - 80);

            ctx.fillStyle = '#fff';
            ctx.font = '28px Arial';
            ctx.fillText('Final Score: ' + score, canvas.width/2, canvas.height/2 - 20);
            ctx.fillText('Level Reached: ' + level, canvas.width/2, canvas.height/2 + 20);

            ctx.font = '20px Arial';
            ctx.fillText('Click or Press SPACE to Restart', canvas.width/2, canvas.height/2 + 70);
        }

        // Input event listeners
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });

        canvas.addEventListener('click', (e) => {
            handleClick();
        });

        document.addEventListener('keydown', (e) => {
            keys[e.code] = true;
            if (e.code === 'Space') {
                e.preventDefault();
                handleSpacePress();
            }
            if (e.code === 'KeyP' || e.code === 'Escape') {
                e.preventDefault();
                handlePausePress();
            }
        });

        document.addEventListener('keyup', (e) => {
            keys[e.code] = false;
        });

        function handleClick() {
            if (gameState === 'menu' || gameState === 'gameOver') {
                startGame();
            } else if (gameState === 'playing') {
                // Launch ball
                if (ball && ball.isAttached) {
                    ball.launch();
                }
            }
        }

        function handleSpacePress() {
            if (gameState === 'menu' || gameState === 'gameOver') {
                startGame();
            } else if (gameState === 'playing') {
                // Launch ball
                if (ball && ball.isAttached) {
                    ball.launch();
                }
            } else if (gameState === 'paused') {
                resumeGame();
            }
        }

        function handlePausePress() {
            if (gameState === 'playing') {
                pauseGame();
            } else if (gameState === 'paused') {
                resumeGame();
            }
        }

        function pauseGame() {
            gameState = 'paused';
        }

        function resumeGame() {
            gameState = 'playing';
        }

        function startGame() {
            gameState = 'playing';
            score = 0;
            lives = 3;
            level = 1;
            updateUI();
            initializeGame();
        }

        function initializeGame() {
            // Initialize paddle
            const paddleWidth = 120;
            const paddleHeight = 15;
            const paddleX = (canvas.width - paddleWidth) / 2;
            const paddleY = canvas.height - 40;

            paddle = new Paddle(paddleX, paddleY, paddleWidth, paddleHeight);

            // Initialize ball
            const ballRadius = 8;
            const ballX = canvas.width / 2;
            const ballY = paddleY - ballRadius - 5;

            ball = new Ball(ballX, ballY, ballRadius);

            // Generate level
            generateLevel(level);

            console.log('Game initialized with paddle, ball, and bricks');
        }

        function updateUI() {
            document.getElementById('score').textContent = score;
            document.getElementById('lives').textContent = lives;
            document.getElementById('level').textContent = level;
        }

        // Initialize the game
        console.log('Brick Breaker Game Loading...');
        updateUI();
        gameLoop();

        // Send a message to the extension
        vscode.postMessage({
            command: 'alert',
            text: 'Brick Breaker Game loaded successfully!'
        });
    </script>
</body>
</html>`;
    }
}
