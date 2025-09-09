// Systems.js - Core Game Logic
// This module contains all the core game mechanics and systems

const GameSystems = {
    // Game State
    state: {
        grid: [],
        score: 0,
        level: 1,
        gems: 0,
        combo: 0,
        isRunning: false,
        isPaused: false,
        timeRemaining: 0,
        selectedGem: null,
        difficulty: 'medium',
        achievements: [],
        powerUps: [],
        gameStartTime: null,
        lastMoveTime: null
    },

    // Initialize game systems
    init() {
        this.resetState();
        this.generateGrid();
        this.bindEvents();
        console.log('Game systems initialized');
    },

    // Reset game state to defaults
    resetState() {
        this.state = {
            grid: [],
            score: 0,
            level: 1,
            gems: 0,
            combo: 0,
            isRunning: false,
            isPaused: false,
            timeRemaining: GDD.DIFFICULTY_LEVELS.medium.timeLimit,
            selectedGem: null,
            difficulty: 'medium',
            achievements: [],
            powerUps: [],
            gameStartTime: null,
            lastMoveTime: null
        };
    },

    // Generate initial game grid
    generateGrid() {
        const size = GDD.GAME_CONFIG.gridSize;
        this.state.grid = [];
        
        for (let row = 0; row < size; row++) {
            this.state.grid[row] = [];
            for (let col = 0; col < size; col++) {
                this.state.grid[row][col] = this.generateRandomGem();
            }
        }
        
        // Ensure no initial matches
        this.removeInitialMatches();
    },

    // Generate a random gem based on difficulty
    generateRandomGem() {
        const difficulty = GDD.DIFFICULTY_LEVELS[this.state.difficulty];
        const gemTypes = Object.keys(GDD.GEM_TYPES);
        const availableTypes = gemTypes.slice(0, difficulty.gemTypes);
        const randomIndex = Math.floor(Math.random() * availableTypes.length);
        return availableTypes[randomIndex];
    },

    // Remove any initial matches from the grid
    removeInitialMatches() {
        let hasMatches = true;
        let iterations = 0;
        const maxIterations = 100;

        while (hasMatches && iterations < maxIterations) {
            hasMatches = false;
            const matches = this.findAllMatches();
            
            if (matches.length > 0) {
                hasMatches = true;
                // Replace matched gems with new random gems
                matches.forEach(match => {
                    match.forEach(pos => {
                        this.state.grid[pos.row][pos.col] = this.generateRandomGem();
                    });
                });
            }
            iterations++;
        }
    },

    // Start the game
    startGame() {
        this.state.isRunning = true;
        this.state.isPaused = false;
        this.state.gameStartTime = Date.now();
        this.startTimer();
        console.log('Game started');
    },

    // Pause the game
    pauseGame() {
        this.state.isPaused = !this.state.isPaused;
        if (this.state.isPaused) {
            this.stopTimer();
        } else {
            this.startTimer();
        }
        console.log(`Game ${this.state.isPaused ? 'paused' : 'resumed'}`);
    },

    // End the game
    endGame() {
        this.state.isRunning = false;
        this.state.isPaused = false;
        this.stopTimer();
        this.checkAchievements();
        console.log('Game ended with score:', this.state.score);
    },

    // Timer management
    startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        this.timerInterval = setInterval(() => {
            if (!this.state.isPaused && this.state.isRunning) {
                this.state.timeRemaining--;
                
                if (this.state.timeRemaining <= 0) {
                    this.endGame();
                }
            }
        }, 1000);
    },

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    },

    // Handle gem selection and swapping
    selectGem(row, col) {
        if (!this.state.isRunning || this.state.isPaused) return false;

        if (!this.state.selectedGem) {
            // First gem selection
            this.state.selectedGem = { row, col };
            return true;
        } else {
            // Second gem selection - attempt swap
            const canSwap = this.canSwapGems(
                this.state.selectedGem.row, 
                this.state.selectedGem.col, 
                row, 
                col
            );

            if (canSwap) {
                this.swapGems(
                    this.state.selectedGem.row, 
                    this.state.selectedGem.col, 
                    row, 
                    col
                );
                this.processMatches();
                this.state.selectedGem = null;
                this.state.lastMoveTime = Date.now();
                return true;
            } else {
                // Invalid swap, select new gem
                this.state.selectedGem = { row, col };
                return false;
            }
        }
    },

    // Check if two gems can be swapped
    canSwapGems(row1, col1, row2, col2) {
        // Check if gems are adjacent
        const rowDiff = Math.abs(row1 - row2);
        const colDiff = Math.abs(col1 - col2);
        
        if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
            // Temporarily swap and check for matches
            this.swapGems(row1, col1, row2, col2);
            const hasMatches = this.findAllMatches().length > 0;
            // Swap back
            this.swapGems(row1, col1, row2, col2);
            return hasMatches;
        }
        
        return false;
    },

    // Swap two gems in the grid
    swapGems(row1, col1, row2, col2) {
        const temp = this.state.grid[row1][col1];
        this.state.grid[row1][col1] = this.state.grid[row2][col2];
        this.state.grid[row2][col2] = temp;
    },

    // Find all matches on the board
    findAllMatches() {
        const matches = [];
        const size = GDD.GAME_CONFIG.gridSize;
        const visited = Array(size).fill().map(() => Array(size).fill(false));

        // Check horizontal matches
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size - 2; col++) {
                const match = this.findHorizontalMatch(row, col);
                if (match.length >= GDD.GAME_CONFIG.minMatchLength) {
                    matches.push(match);
                    match.forEach(pos => visited[pos.row][pos.col] = true);
                }
            }
        }

        // Check vertical matches
        for (let col = 0; col < size; col++) {
            for (let row = 0; row < size - 2; row++) {
                if (!visited[row][col]) {
                    const match = this.findVerticalMatch(row, col);
                    if (match.length >= GDD.GAME_CONFIG.minMatchLength) {
                        matches.push(match);
                    }
                }
            }
        }

        return matches;
    },

    // Find horizontal match starting at position
    findHorizontalMatch(row, startCol) {
        const gemType = this.state.grid[row][startCol];
        const match = [{ row, col: startCol }];
        
        for (let col = startCol + 1; col < GDD.GAME_CONFIG.gridSize; col++) {
            if (this.state.grid[row][col] === gemType) {
                match.push({ row, col });
            } else {
                break;
            }
        }
        
        return match.length >= GDD.GAME_CONFIG.minMatchLength ? match : [];
    },

    // Find vertical match starting at position
    findVerticalMatch(startRow, col) {
        const gemType = this.state.grid[startRow][col];
        const match = [{ row: startRow, col }];
        
        for (let row = startRow + 1; row < GDD.GAME_CONFIG.gridSize; row++) {
            if (this.state.grid[row][col] === gemType) {
                match.push({ row, col });
            } else {
                break;
            }
        }
        
        return match.length >= GDD.GAME_CONFIG.minMatchLength ? match : [];
    },

    // Process all matches and update score
    processMatches() {
        const matches = this.findAllMatches();
        
        if (matches.length === 0) {
            this.state.combo = 0;
            return false;
        }

        let totalScore = 0;
        let totalGems = 0;

        matches.forEach(match => {
            const matchScore = this.calculateMatchScore(match);
            totalScore += matchScore;
            totalGems += match.length;
            
            // Remove matched gems
            match.forEach(pos => {
                this.state.grid[pos.row][pos.col] = null;
            });
        });

        // Apply combo multiplier
        this.state.combo++;
        const comboMultiplier = GDD.BALANCE.comboMultipliers[
            Math.min(this.state.combo - 1, GDD.BALANCE.comboMultipliers.length - 1)
        ];
        
        totalScore = Math.floor(totalScore * comboMultiplier);
        
        // Update game state
        this.state.score += totalScore;
        this.state.gems += totalGems;
        
        // Drop gems and fill empty spaces
        this.dropGems();
        this.fillEmptySpaces();
        
        // Check for cascading matches
        setTimeout(() => {
            this.processMatches();
        }, GDD.ANIMATIONS.gemFall);

        // Check for level up
        this.checkLevelUp();
        
        return true;
    },

    // Calculate score for a match
    calculateMatchScore(match) {
        const length = match.length;
        let baseScore = 0;
        
        if (length === 3) baseScore = GDD.BALANCE.baseScore.match3;
        else if (length === 4) baseScore = GDD.BALANCE.baseScore.match4;
        else if (length === 5) baseScore = GDD.BALANCE.baseScore.match5;
        else baseScore = GDD.BALANCE.baseScore.match5 * (length - 4);
        
        // Apply gem rarity multipliers
        const gemType = this.state.grid[match[0].row][match[0].col];
        const gemData = GDD.GEM_TYPES[gemType];
        const rarityMultiplier = GDD.BALANCE.rarityMultipliers[gemData.rarity];
        
        return Math.floor(baseScore * rarityMultiplier);
    },

    // Drop gems down to fill empty spaces
    dropGems() {
        const size = GDD.GAME_CONFIG.gridSize;
        
        for (let col = 0; col < size; col++) {
            let writeIndex = size - 1;
            
            for (let row = size - 1; row >= 0; row--) {
                if (this.state.grid[row][col] !== null) {
                    this.state.grid[writeIndex][col] = this.state.grid[row][col];
                    if (writeIndex !== row) {
                        this.state.grid[row][col] = null;
                    }
                    writeIndex--;
                }
            }
        }
    },

    // Fill empty spaces with new random gems
    fillEmptySpaces() {
        const size = GDD.GAME_CONFIG.gridSize;
        
        for (let col = 0; col < size; col++) {
            for (let row = 0; row < size; row++) {
                if (this.state.grid[row][col] === null) {
                    this.state.grid[row][col] = this.generateRandomGem();
                }
            }
        }
    },

    // Check if player should level up
    checkLevelUp() {
        const currentThreshold = GDD.GAME_CONFIG.levelThresholds[this.state.level - 1];
        const nextThreshold = GDD.GAME_CONFIG.levelThresholds[this.state.level];
        
        if (nextThreshold && this.state.score >= nextThreshold) {
            this.state.level++;
            console.log('Level up! New level:', this.state.level);
        }
    },

    // Check for achieved accomplishments
    checkAchievements() {
        Object.values(GDD.ACHIEVEMENTS).forEach(achievement => {
            if (this.state.achievements.includes(achievement.id)) return;
            
            let earned = false;
            
            switch (achievement.type) {
                case 'matches':
                    earned = this.state.gems >= achievement.requirement;
                    break;
                case 'gems_collected':
                    earned = this.state.gems >= achievement.requirement;
                    break;
                case 'combo':
                    earned = this.state.combo >= achievement.requirement;
                    break;
                case 'time_limit':
                    const gameTime = (Date.now() - this.state.gameStartTime) / 1000;
                    earned = gameTime <= achievement.requirement;
                    break;
            }
            
            if (earned) {
                this.state.achievements.push(achievement.id);
                this.state.score += achievement.reward;
                console.log('Achievement unlocked:', achievement.name);
            }
        });
    },

    // Set game difficulty
    setDifficulty(difficulty) {
        if (GDD.DIFFICULTY_LEVELS[difficulty]) {
            this.state.difficulty = difficulty;
            this.state.timeRemaining = GDD.DIFFICULTY_LEVELS[difficulty].timeLimit;
            console.log('Difficulty set to:', difficulty);
        }
    },

    // Get current game statistics
    getStats() {
        return {
            score: this.state.score,
            level: this.state.level,
            gems: this.state.gems,
            combo: this.state.combo,
            timeRemaining: this.state.timeRemaining,
            isRunning: this.state.isRunning,
            isPaused: this.state.isPaused,
            difficulty: this.state.difficulty,
            achievements: this.state.achievements.length
        };
    },

    // Bind event listeners
    bindEvents() {
        // This will be called by managers.js to set up UI interactions
        console.log('Game systems events ready to bind');
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameSystems;
} else {
    window.GameSystems = GameSystems;
}