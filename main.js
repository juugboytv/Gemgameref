// Main.js - Application Entry Point
// This module initializes the application and coordinates all other modules

const App = {
    // Application state
    isInitialized: false,
    version: '1.0.0',
    
    // Initialize the application
    async init() {
        try {
            console.log('🎮 Initializing Gem Game Reference v' + this.version);
            
            // Show loading indicator
            this.showLoadingIndicator();
            
            // Initialize modules in order
            await this.initializeModules();
            
            // Setup error handling
            this.setupErrorHandling();
            
            // Setup analytics (if available)
            this.setupAnalytics();
            
            // Hide loading indicator
            this.hideLoadingIndicator();
            
            // Mark as initialized
            this.isInitialized = true;
            
            console.log('✅ Application initialized successfully');
            
            // Show welcome message
            this.showWelcomeMessage();
            
        } catch (error) {
            console.error('❌ Application initialization failed:', error);
            this.showErrorMessage('Failed to initialize application: ' + error.message);
        }
    },

    // Initialize all modules
    async initializeModules() {
        const modules = [
            { name: 'Game Systems', init: () => GameSystems.init() },
            { name: 'UI Manager', init: () => UIManager.init() }
        ];

        for (const module of modules) {
            try {
                console.log(`Initializing ${module.name}...`);
                await module.init();
                console.log(`✅ ${module.name} initialized`);
            } catch (error) {
                console.error(`❌ Failed to initialize ${module.name}:`, error);
                throw new Error(`${module.name} initialization failed: ${error.message}`);
            }
        }
    },

    // Show loading indicator
    showLoadingIndicator() {
        const loader = document.createElement('div');
        loader.id = 'app-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-spinner"></div>
                <h2>Loading Gem Game Reference</h2>
                <p>Preparing your gaming experience...</p>
            </div>
        `;

        // Add loader styles
        const loaderStyles = `
            #app-loader {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                color: white;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }

            .loader-content {
                text-align: center;
                max-width: 400px;
                padding: 2rem;
            }

            .loader-spinner {
                width: 60px;
                height: 60px;
                border: 4px solid rgba(255, 255, 255, 0.3);
                border-top: 4px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 2rem;
            }

            .loader-content h2 {
                margin-bottom: 1rem;
                font-size: 1.8rem;
            }

            .loader-content p {
                opacity: 0.8;
                font-size: 1.1rem;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = loaderStyles;
        document.head.appendChild(styleSheet);
        document.body.appendChild(loader);
    },

    // Hide loading indicator
    hideLoadingIndicator() {
        const loader = document.getElementById('app-loader');
        if (loader) {
            loader.style.animation = 'fadeOut 0.5s ease-out';
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            }, 500);
        }
    },

    // Setup global error handling
    setupErrorHandling() {
        // Handle uncaught errors
        window.addEventListener('error', (event) => {
            console.error('Uncaught error:', event.error);
            this.logError(event.error, 'uncaught');
        });

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.logError(event.reason, 'promise');
        });

        // Override console.error to log errors
        const originalError = console.error;
        console.error = (...args) => {
            originalError.apply(console, args);
            this.logError(args.join(' '), 'console');
        };
    },

    // Log errors for debugging and analytics
    logError(error, type) {
        const errorInfo = {
            message: error.message || error.toString(),
            stack: error.stack || 'No stack trace',
            type: type,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            gameState: GameSystems.state
        };

        // Save to localStorage for debugging
        const errors = JSON.parse(localStorage.getItem('gemGameErrors') || '[]');
        errors.push(errorInfo);
        
        // Keep only last 10 errors
        if (errors.length > 10) {
            errors.splice(0, errors.length - 10);
        }
        
        localStorage.setItem('gemGameErrors', JSON.stringify(errors));

        // Send to analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: errorInfo.message,
                fatal: false
            });
        }
    },

    // Setup analytics
    setupAnalytics() {
        try {
            // Google Analytics setup (if needed)
            if (typeof gtag !== 'undefined') {
                gtag('config', 'GA_MEASUREMENT_ID', {
                    page_title: 'Gem Game Reference',
                    page_location: window.location.href
                });

                // Track app initialization
                gtag('event', 'app_initialize', {
                    app_name: 'Gem Game Reference',
                    app_version: this.version
                });
            }

            console.log('📊 Analytics setup complete');
        } catch (error) {
            console.warn('Analytics setup failed:', error);
        }
    },

    // Show welcome message
    showWelcomeMessage() {
        setTimeout(() => {
            if (UIManager.showNotification) {
                UIManager.showNotification(GDD.MESSAGES.welcome, 'info');
            }
        }, 1000);
    },

    // Show error message
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #e53e3e;
                color: white;
                padding: 2rem;
                border-radius: 10px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                z-index: 10001;
                max-width: 400px;
                text-align: center;
            ">
                <h3>Application Error</h3>
                <p>${message}</p>
                <button onclick="location.reload()" style="
                    background: white;
                    color: #e53e3e;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 1rem;
                ">Reload Page</button>
            </div>
        `;
        document.body.appendChild(errorDiv);
    },

    // Application lifecycle methods
    onBeforeUnload() {
        if (this.isInitialized) {
            // Save current game state
            UIManager.saveGameState();
            
            // Track app close
            if (typeof gtag !== 'undefined') {
                gtag('event', 'app_close', {
                    engagement_time_msec: Date.now() - this.startTime
                });
            }
        }
    },

    onVisibilityChange() {
        if (document.hidden) {
            // Page became hidden - pause game if running
            if (GameSystems.state.isRunning && !GameSystems.state.isPaused) {
                GameSystems.pauseGame();
                UIManager.showNotification('Game paused - tab not visible', 'warning');
            }
        }
    },

    // Performance monitoring
    monitorPerformance() {
        if ('performance' in window) {
            const perfData = performance.getEntriesByType('navigation')[0];
            
            console.log('📈 Performance metrics:', {
                loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                firstPaint: performance.getEntriesByType('paint').find(p => p.name === 'first-paint')?.startTime,
                firstContentfulPaint: performance.getEntriesByType('paint').find(p => p.name === 'first-contentful-paint')?.startTime
            });
        }
    },

    // Check for updates (for PWA functionality)
    checkForUpdates() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            UIManager.showNotification('New version available! Reload to update.', 'info');
                        }
                    });
                });
            });
        }
    },

    // Development helpers
    debug: {
        getState() {
            return {
                app: App,
                game: GameSystems.state,
                ui: UIManager.elements
            };
        },
        
        resetAll() {
            localStorage.clear();
            location.reload();
        },
        
        simulateError() {
            throw new Error('Test error for debugging');
        },
        
        getPerformance() {
            return performance.getEntriesByType('measure');
        }
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.startTime = Date.now();
    App.init();
});

// Setup lifecycle event listeners
window.addEventListener('beforeunload', () => App.onBeforeUnload());
document.addEventListener('visibilitychange', () => App.onVisibilityChange());

// Monitor performance after load
window.addEventListener('load', () => {
    setTimeout(() => App.monitorPerformance(), 1000);
    App.checkForUpdates();
});

// Add global debug access in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.DEBUG = App.debug;
    console.log('🐛 Debug mode enabled. Use window.DEBUG for debugging tools.');
}

// Add fadeOut animation for loader
const fadeOutStyles = `
@keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
}
`;
const fadeStyleSheet = document.createElement('style');
fadeStyleSheet.textContent = fadeOutStyles;
document.head.appendChild(fadeStyleSheet);

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
} else {
    window.App = App;
}

console.log('🚀 Main.js loaded - Application ready to initialize');