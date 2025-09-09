// Managers.js - UI & Interaction Logic
// This module handles all UI interactions, data persistence, and Firebase integration

const UIManager = {
    // UI Elements
    elements: {},
    
    // Firebase Configuration (Production)
    firebaseConfig: {
        apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        authDomain: "gemgameref-prod.firebaseapp.com",
        databaseURL: "https://gemgameref-prod-default-rtdb.firebaseio.com",
        projectId: "gemgameref-prod",
        storageBucket: "gemgameref-prod.appspot.com",
        messagingSenderId: "123456789012",
        appId: "1:123456789012:web:abcdefghijklmnopqr",
        measurementId: "G-XXXXXXXXXX"
    },

    // Initialize UI Manager
    init() {
        this.cacheElements();
        this.bindEvents();
        this.initializeFirebase();
        this.loadUserSettings();
        this.updateDisplay();
        console.log('UI Manager initialized');
    },

    // Cache DOM elements for performance
    cacheElements() {
        this.elements = {
            // Navigation
            homeBtn: document.getElementById('homeBtn'),
            gameBtn: document.getElementById('gameBtn'),
            settingsBtn: document.getElementById('settingsBtn'),
            
            // Sections
            homeSection: document.getElementById('homeSection'),
            gameSection: document.getElementById('gameSection'),
            settingsSection: document.getElementById('settingsSection'),
            
            // Game stats
            totalGems: document.getElementById('totalGems'),
            playerLevel: document.getElementById('playerLevel'),
            playerScore: document.getElementById('playerScore'),
            
            // Game controls
            gameGrid: document.getElementById('gameGrid'),
            startBtn: document.getElementById('startBtn'),
            pauseBtn: document.getElementById('pauseBtn'),
            resetBtn: document.getElementById('resetBtn'),
            
            // Settings
            playerName: document.getElementById('playerName'),
            difficulty: document.getElementById('difficulty'),
            soundEnabled: document.getElementById('soundEnabled'),
            saveSettingsBtn: document.getElementById('saveSettingsBtn')
        };
    },

    // Bind event listeners
    bindEvents() {
        // Navigation events
        this.elements.homeBtn.addEventListener('click', () => this.showSection('home'));
        this.elements.gameBtn.addEventListener('click', () => this.showSection('game'));
        this.elements.settingsBtn.addEventListener('click', () => this.showSection('settings'));
        
        // Game control events
        this.elements.startBtn.addEventListener('click', () => this.startGame());
        this.elements.pauseBtn.addEventListener('click', () => this.pauseGame());
        this.elements.resetBtn.addEventListener('click', () => this.resetGame());
        
        // Settings events
        this.elements.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        this.elements.difficulty.addEventListener('change', () => this.updateDifficulty());
        
        // Game grid events
        this.elements.gameGrid.addEventListener('click', (e) => this.handleGridClick(e));
        
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Window events
        window.addEventListener('beforeunload', () => this.saveGameState());
        window.addEventListener('resize', () => this.handleResize());
    },

    // Initialize Firebase
    initializeFirebase() {
        try {
            // Note: In a real application, you would load Firebase SDK here
            // firebase.initializeApp(this.firebaseConfig);
            // this.database = firebase.database();
            // this.auth = firebase.auth();
            
            console.log('Firebase initialized with config:', this.firebaseConfig.projectId);
            this.isFirebaseReady = true;
        } catch (error) {
            console.error('Firebase initialization failed:', error);
            this.isFirebaseReady = false;
        }
    },

    // Show specific section
    showSection(sectionName) {
        // Hide all sections
        Object.values(this.elements).forEach(element => {
            if (element && element.classList && element.classList.contains('section')) {
                element.classList.remove('active');
            }
        });
        
        // Remove active class from nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show target section
        const targetSection = this.elements[sectionName + 'Section'];
        const targetBtn = this.elements[sectionName + 'Btn'];
        
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        if (targetBtn) {
            targetBtn.classList.add('active');
        }
        
        // Section-specific actions
        if (sectionName === 'game') {
            this.renderGameGrid();
        }
    },

    // Start game
    startGame() {
        if (!GameSystems.state.isRunning) {
            GameSystems.startGame();
            this.elements.startBtn.textContent = 'Resume';
            this.elements.pauseBtn.disabled = false;
            this.showNotification(GDD.MESSAGES.gameStart, 'info');
            this.startGameLoop();
        }
    },

    // Pause/Resume game
    pauseGame() {
        GameSystems.pauseGame();
        this.elements.startBtn.textContent = GameSystems.state.isPaused ? 'Resume' : 'Pause';
        
        if (GameSystems.state.isPaused) {
            this.showNotification(GDD.MESSAGES.pauseGame, 'warning');
        }
    },

    // Reset game
    resetGame() {
        if (confirm('Are you sure you want to reset the game?')) {
            GameSystems.resetState();
            GameSystems.generateGrid();
            this.elements.startBtn.textContent = 'Start Game';
            this.elements.pauseBtn.disabled = true;
            this.renderGameGrid();
            this.updateDisplay();
            this.showNotification('Game reset successfully!', 'success');
        }
    },

    // Handle grid clicks
    handleGridClick(event) {
        const cell = event.target.closest('.gem');
        if (!cell) return;
        
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        
        if (isNaN(row) || isNaN(col)) return;
        
        const success = GameSystems.selectGem(row, col);
        
        if (success) {
            this.renderGameGrid();
            this.updateDisplay();
            this.playSound('match');
        } else {
            this.showNotification(GDD.MESSAGES.invalidMove, 'error');
            this.playSound('error');
            cell.classList.add('shake');
            setTimeout(() => cell.classList.remove('shake'), 500);
        }
    },

    // Render the game grid
    renderGameGrid() {
        const grid = GameSystems.state.grid;
        const gridElement = this.elements.gameGrid;
        
        gridElement.innerHTML = '';
        
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                const gemType = grid[row][col];
                const gemElement = document.createElement('div');
                
                gemElement.className = `gem ${gemType}`;
                gemElement.dataset.row = row;
                gemElement.dataset.col = col;
                gemElement.textContent = GDD.GEM_TYPES[gemType].symbol;
                gemElement.title = GDD.GEM_TYPES[gemType].name;
                
                // Highlight selected gem
                if (GameSystems.state.selectedGem && 
                    GameSystems.state.selectedGem.row === row && 
                    GameSystems.state.selectedGem.col === col) {
                    gemElement.classList.add('selected');
                }
                
                gridElement.appendChild(gemElement);
            }
        }
    },

    // Update display elements
    updateDisplay() {
        const stats = GameSystems.getStats();
        
        this.elements.totalGems.textContent = stats.gems;
        this.elements.playerLevel.textContent = stats.level;
        this.elements.playerScore.textContent = stats.score.toLocaleString();
        
        // Update difficulty display
        this.elements.difficulty.value = stats.difficulty;
        
        // Update button states
        if (stats.isRunning) {
            this.elements.startBtn.textContent = stats.isPaused ? 'Resume' : 'Pause';
            this.elements.pauseBtn.disabled = false;
        } else {
            this.elements.startBtn.textContent = 'Start Game';
            this.elements.pauseBtn.disabled = true;
        }
    },

    // Game loop for continuous updates
    startGameLoop() {
        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
        }
        
        this.gameLoopInterval = setInterval(() => {
            if (GameSystems.state.isRunning && !GameSystems.state.isPaused) {
                this.updateDisplay();
                
                // Check for game over
                if (GameSystems.state.timeRemaining <= 0) {
                    this.endGame();
                }
            }
        }, 100);
    },

    // End game
    endGame() {
        GameSystems.endGame();
        clearInterval(this.gameLoopInterval);
        this.showNotification(GDD.MESSAGES.gameOver, 'info');
        this.saveHighScore();
        this.elements.startBtn.textContent = 'Start Game';
        this.elements.pauseBtn.disabled = true;
    },

    // Handle keyboard input
    handleKeyPress(event) {
        switch (event.key) {
            case ' ':
                event.preventDefault();
                if (GameSystems.state.isRunning) {
                    this.pauseGame();
                }
                break;
            case 'r':
            case 'R':
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.resetGame();
                }
                break;
            case 'Escape':
                if (GameSystems.state.isRunning) {
                    this.pauseGame();
                }
                break;
        }
    },

    // Update difficulty setting
    updateDifficulty() {
        const difficulty = this.elements.difficulty.value;
        GameSystems.setDifficulty(difficulty);
        this.showNotification(`Difficulty set to ${difficulty}`, 'success');
    },

    // Save user settings
    saveSettings() {
        const settings = {
            playerName: this.elements.playerName.value,
            difficulty: this.elements.difficulty.value,
            soundEnabled: this.elements.soundEnabled.checked,
            timestamp: Date.now()
        };
        
        // Save to localStorage
        localStorage.setItem('gemGameSettings', JSON.stringify(settings));
        
        // Save to Firebase if available
        if (this.isFirebaseReady) {
            this.saveToFirebase('settings', settings);
        }
        
        this.showNotification(GDD.MESSAGES.settingsSaved, 'success');
    },

    // Load user settings
    loadUserSettings() {
        try {
            const savedSettings = localStorage.getItem('gemGameSettings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                
                this.elements.playerName.value = settings.playerName || '';
                this.elements.difficulty.value = settings.difficulty || 'medium';
                this.elements.soundEnabled.checked = settings.soundEnabled !== false;
                
                GameSystems.setDifficulty(settings.difficulty || 'medium');
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    },

    // Save game state
    saveGameState() {
        const gameState = {
            ...GameSystems.state,
            timestamp: Date.now()
        };
        
        localStorage.setItem('gemGameState', JSON.stringify(gameState));
        
        if (this.isFirebaseReady) {
            this.saveToFirebase('gameState', gameState);
        }
    },

    // Save high score
    saveHighScore() {
        const currentScore = GameSystems.state.score;
        const savedHighScore = localStorage.getItem('gemGameHighScore') || 0;
        
        if (currentScore > savedHighScore) {
            localStorage.setItem('gemGameHighScore', currentScore);
            this.showNotification(GDD.MESSAGES.newHighScore, 'success');
            
            if (this.isFirebaseReady) {
                this.saveToFirebase('highScore', {
                    score: currentScore,
                    timestamp: Date.now(),
                    playerName: this.elements.playerName.value
                });
            }
        }
    },

    // Save data to Firebase
    saveToFirebase(path, data) {
        if (!this.isFirebaseReady) return;
        
        try {
            // this.database.ref(path).set(data);
            console.log(`Would save to Firebase: ${path}`, data);
        } catch (error) {
            console.error('Firebase save failed:', error);
        }
    },

    // Play sound effects
    playSound(soundName) {
        if (!this.elements.soundEnabled.checked) return;
        
        try {
            // In a real implementation, you would load and play audio files
            console.log(`Playing sound: ${soundName}`);
        } catch (error) {
            console.error('Sound playback failed:', error);
        }
    },

    // Show notification to user
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: 'bold',
            zIndex: '10000',
            animation: 'slideIn 0.3s ease-out'
        });
        
        // Set background color based on type
        const colors = {
            info: '#3182ce',
            success: '#38a169',
            warning: '#d69e2e',
            error: '#e53e3e'
        };
        notification.style.background = colors[type] || colors.info;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    },

    // Handle window resize
    handleResize() {
        // Adjust game grid if needed
        if (window.innerWidth < 768) {
            this.elements.gameGrid.classList.add('mobile');
        } else {
            this.elements.gameGrid.classList.remove('mobile');
        }
    },

    // Get user statistics
    getUserStats() {
        return {
            highScore: localStorage.getItem('gemGameHighScore') || 0,
            gamesPlayed: localStorage.getItem('gemGamesPlayed') || 0,
            totalTime: localStorage.getItem('gemTotalTime') || 0,
            achievements: GameSystems.state.achievements.length
        };
    }
};

// Add CSS for notifications
const notificationStyles = `
@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}

.gem.selected {
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
    border: 2px solid #fff;
}

.grid.mobile .gem {
    width: 35px;
    height: 35px;
    font-size: 1rem;
}
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIManager;
} else {
    window.UIManager = UIManager;
}