// Game Design Document - Static Game Data
// This module contains all static game configuration and data

const GDD = {
    // Game Constants
    GAME_CONFIG: {
        name: "Gem Game Reference",
        version: "1.0.0",
        gridSize: 8,
        minMatchLength: 3,
        scoreMultiplier: 10,
        levelThresholds: [0, 100, 250, 500, 1000, 2000, 4000, 8000],
        maxLevel: 7
    },

    // Gem Types and Properties
    GEM_TYPES: {
        ruby: {
            name: "Ruby",
            color: "#e53e3e",
            symbol: "💎",
            value: 10,
            rarity: "common",
            description: "A brilliant red gem that sparkles with fire"
        },
        emerald: {
            name: "Emerald", 
            color: "#38a169",
            symbol: "💚",
            value: 15,
            rarity: "common",
            description: "A vibrant green gem of nature's beauty"
        },
        sapphire: {
            name: "Sapphire",
            color: "#3182ce", 
            symbol: "💙",
            value: 20,
            rarity: "uncommon",
            description: "A deep blue gem as vast as the ocean"
        },
        diamond: {
            name: "Diamond",
            color: "#e2e8f0",
            symbol: "💎",
            value: 50,
            rarity: "rare",
            description: "The most precious and hardest of all gems"
        },
        amethyst: {
            name: "Amethyst",
            color: "#805ad5",
            symbol: "🔮",
            value: 25,
            rarity: "uncommon", 
            description: "A mystical purple gem with magical properties"
        }
    },

    // Difficulty Settings
    DIFFICULTY_LEVELS: {
        easy: {
            name: "Easy",
            gemTypes: 3,
            timeLimit: 120,
            fallSpeed: 1000,
            bonusMultiplier: 1.0,
            description: "Perfect for beginners"
        },
        medium: {
            name: "Medium", 
            gemTypes: 4,
            timeLimit: 90,
            fallSpeed: 750,
            bonusMultiplier: 1.5,
            description: "Balanced challenge"
        },
        hard: {
            name: "Hard",
            gemTypes: 5,
            timeLimit: 60,
            fallSpeed: 500,
            bonusMultiplier: 2.0,
            description: "For gem masters only"
        }
    },

    // Power-ups and Special Items
    POWER_UPS: {
        bomb: {
            name: "Gem Bomb",
            symbol: "💥",
            effect: "Destroys all gems in a 3x3 area",
            duration: 0,
            cost: 50
        },
        multiplier: {
            name: "Score Multiplier",
            symbol: "✨",
            effect: "Doubles score for 30 seconds",
            duration: 30000,
            cost: 100
        },
        timeFreeze: {
            name: "Time Freeze",
            symbol: "❄️",
            effect: "Stops time for 10 seconds",
            duration: 10000,
            cost: 75
        },
        magnet: {
            name: "Gem Magnet",
            symbol: "🧲",
            effect: "Attracts rare gems for 20 seconds",
            duration: 20000,
            cost: 80
        }
    },

    // Achievement System
    ACHIEVEMENTS: {
        firstMatch: {
            id: "first_match",
            name: "First Match",
            description: "Make your first gem match",
            requirement: 1,
            type: "matches",
            reward: 10,
            icon: "🎯"
        },
        gemCollector: {
            id: "gem_collector",
            name: "Gem Collector",
            description: "Collect 100 gems",
            requirement: 100,
            type: "gems_collected",
            reward: 50,
            icon: "💎"
        },
        speedDemon: {
            id: "speed_demon",
            name: "Speed Demon",
            description: "Complete a level in under 30 seconds",
            requirement: 30,
            type: "time_limit",
            reward: 100,
            icon: "⚡"
        },
        comboMaster: {
            id: "combo_master",
            name: "Combo Master",
            description: "Achieve a 5x combo",
            requirement: 5,
            type: "combo",
            reward: 75,
            icon: "🔥"
        },
        perfectionist: {
            id: "perfectionist",
            name: "Perfectionist",
            description: "Complete a level without any invalid moves",
            requirement: 1,
            type: "perfect_level",
            reward: 150,
            icon: "⭐"
        }
    },

    // Sound Effects Configuration
    SOUNDS: {
        match: {
            file: "match.mp3",
            volume: 0.7,
            description: "Played when gems match"
        },
        levelUp: {
            file: "levelup.mp3", 
            volume: 0.8,
            description: "Played when leveling up"
        },
        powerUp: {
            file: "powerup.mp3",
            volume: 0.9,
            description: "Played when activating power-ups"
        },
        background: {
            file: "ambient.mp3",
            volume: 0.3,
            loop: true,
            description: "Background ambient music"
        },
        gameOver: {
            file: "gameover.mp3",
            volume: 0.6,
            description: "Played when game ends"
        }
    },

    // UI Messages and Text
    MESSAGES: {
        welcome: "Welcome to Gem Game Reference! Match gems to score points.",
        gameStart: "Game started! Match 3 or more gems of the same type.",
        levelUp: "Level up! Your gem-matching skills are improving!",
        gameOver: "Game Over! Great job playing!",
        newHighScore: "New High Score! You're a gem master!",
        achievementUnlocked: "Achievement Unlocked!",
        settingsSaved: "Settings saved successfully!",
        invalidMove: "Invalid move! Try matching different gems.",
        comboBonus: "Combo bonus! Keep the chain going!",
        timeWarning: "Time is running out! Match quickly!",
        pauseGame: "Game Paused. Click to resume.",
        loadingGame: "Loading gem database...",
        connectionError: "Connection error. Check your internet connection."
    },

    // Game Balancing
    BALANCE: {
        baseScore: {
            match3: 30,
            match4: 60,
            match5: 120,
            matchL: 200,
            matchT: 250
        },
        comboMultipliers: [1.0, 1.2, 1.5, 2.0, 2.5, 3.0, 4.0, 5.0],
        cascadeBonus: 0.1,
        timeBonus: {
            fast: 1.5,     // < 5 seconds per move
            medium: 1.2,   // < 10 seconds per move  
            slow: 1.0      // > 10 seconds per move
        },
        rarityMultipliers: {
            common: 1.0,
            uncommon: 1.5,
            rare: 2.0,
            legendary: 3.0
        }
    },

    // Animation Timings (in milliseconds)
    ANIMATIONS: {
        gemFall: 300,
        gemMatch: 500,
        gemDestroy: 200,
        levelTransition: 1000,
        scorePopup: 800,
        comboIndicator: 600,
        powerUpActivation: 400,
        gridShake: 300
    },

    // Tutorial Steps
    TUTORIAL: {
        steps: [
            {
                id: "welcome",
                title: "Welcome!",
                content: "Welcome to Gem Game Reference! Let's learn how to play.",
                target: null,
                action: "next"
            },
            {
                id: "objective",
                title: "Game Objective", 
                content: "Match 3 or more gems of the same type to score points.",
                target: "#gameGrid",
                action: "highlight"
            },
            {
                id: "controls",
                title: "Controls",
                content: "Click on gems to select them, then click an adjacent gem to swap.",
                target: ".game-controls",
                action: "highlight"
            },
            {
                id: "scoring",
                title: "Scoring",
                content: "Longer matches and combos give more points!",
                target: "#playerScore",
                action: "highlight"
            },
            {
                id: "ready",
                title: "Ready to Play!",
                content: "You're ready to start your gem-matching adventure!",
                target: "#startBtn",
                action: "pulse"
            }
        ]
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GDD;
} else {
    window.GDD = GDD;
}