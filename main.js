/**
 * main.js - Entry point for CASTLED board game
 * 
 * This file initializes the game and provides a loading mechanism
 * to ensure all required scripts are loaded before starting the game.
 */

// Create a loading screen
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, setting up loading screen');
    
    // Create loading screen if it doesn't exist
    if (!document.getElementById('loading-screen')) {
        const loadingScreen = document.createElement('div');
        loadingScreen.id = 'loading-screen';
        loadingScreen.innerHTML = `
            <div class="loading-content">
                <h1>CASTLED</h1>
                <p>Loading game...</p>
                <div class="loading-spinner"></div>
            </div>
        `;
        
        // Add loading screen styles
        const style = document.createElement('style');
        style.textContent = `
            #loading-screen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: #34495e;
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                transition: opacity 0.5s ease;
            }
            
            #loading-screen.fade-out {
                opacity: 0;
            }
            
            .loading-content {
                text-align: center;
                color: white;
            }
            
            .loading-content h1 {
                font-size: 3rem;
                margin-bottom: 1rem;
                text-transform: uppercase;
                letter-spacing: 3px;
            }
            
            .loading-spinner {
                width: 40px;
                height: 40px;
                margin: 20px auto;
                border: 4px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                border-top: 4px solid white;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(loadingScreen);
    }
});

// Initialize the game when window is fully loaded
window.addEventListener('load', () => {
    console.log('Window loaded, initializing game');
    
    // Short delay to ensure all scripts are processed
    setTimeout(() => {
        // Check if all required objects are available
        if (typeof Board !== 'undefined' && 
            typeof Player !== 'undefined' && 
            typeof Game !== 'undefined' && 
            typeof initUI !== 'undefined') {
            
            console.log('All scripts loaded, initializing game');
            
            // Initialize the game UI
            initUI();
            
            // Remove loading screen
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        } else {
            console.error('Some scripts failed to load properly:');
            console.error('Board:', typeof Board !== 'undefined' ? 'Loaded' : 'Missing');
            console.error('Player:', typeof Player !== 'undefined' ? 'Loaded' : 'Missing');
            console.error('Game:', typeof Game !== 'undefined' ? 'Loaded' : 'Missing');
            console.error('initUI:', typeof initUI !== 'undefined' ? 'Loaded' : 'Missing');
            
            // Force remove loading screen after error
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.innerHTML = `
                    <div class="loading-content">
                        <h1>CASTLED</h1>
                        <p>Error loading game components. Please refresh the page.</p>
                    </div>
                `;
                
                // Auto-refresh after 3 seconds
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }
        }
    }, 1000);
});
