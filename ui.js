/**
 * ui.js - Handles all user interface interactions and updates
 * 
 * This file sets up event listeners, updates the UI based on game state,
 * and coordinates interactions between the game logic (Game class) and the DOM.
 */

// Global game instance
let game;

// Initialize UI and game
function initUI() {
    console.log('Initializing UI and game');
    
    // Create new game instance
    game = new Game();
    
    // Start a new game
    game.startGame();

    // Initial UI update
    updateUI();

    // Setup event listener for the Roll Die button
    const rollButton = document.getElementById('roll-button');
    rollButton.addEventListener('click', () => {
        // Check if we need to restart the game
        if (game.gameOver) {
            resetGame();
            return;
        }
        
        // Disable the roll button during the roll/move
        rollButton.disabled = true;

        // Indicate die rolling animation
        const dieElement = document.querySelector('.die');
        dieElement.textContent = '?';
        dieElement.classList.add('rolling');

        // Simulate die rolling animation
        setTimeout(() => {
            // Roll the die and update the result
            const result = game.rollDie();
            dieElement.classList.remove('rolling');
            dieElement.textContent = result;

            // Move the current player based on the die result
            const landedSpace = game.moveCurrentPlayer();

            // Update UI elements based on action
            updateUI();
            
            // Handle actions based on the current game state
            handleGameStateActions(landedSpace);
        }, 1000); // 1 second delay for rolling animation
    });

    // Setup music toggle button
    const musicToggle = document.getElementById('music-toggle');
    const backgroundMusic = document.getElementById('background-music');
    
    // Check if music preference is stored in localStorage
    const musicMuted = localStorage.getItem('castled_music_muted') === 'true';
    
    // Set initial music state
    if (musicMuted) {
        backgroundMusic.pause();
        musicToggle.textContent = '🔇';
        musicToggle.classList.add('muted');
    } else {
        // Try to play music (may be blocked by browser autoplay policy)
        const playPromise = backgroundMusic.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Autoplay prevented by browser. User must interact first.');
                // Don't update UI as the user will need to click the button anyway
            });
        }
    }
    
    // Add event listener for music toggle
    musicToggle.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            musicToggle.textContent = '🔊';
            musicToggle.classList.remove('muted');
            localStorage.setItem('castled_music_muted', 'false');
        } else {
            backgroundMusic.pause();
            musicToggle.textContent = '🔇';
            musicToggle.classList.add('muted');
            localStorage.setItem('castled_music_muted', 'true');
        }
    });

    // Setup help button event listener
    const helpButton = document.getElementById('help-button');
    const helpModal = document.getElementById('help-modal');
    const closeButtons = document.querySelectorAll('.close-button');
    
    helpButton.addEventListener('click', () => {
        helpModal.style.display = 'flex';
    });
    
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.modal').style.display = 'none';
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
    
    console.log('UI initialization complete');
}

/**
 * Update the overall UI elements based on the current game state
 */
function updateUI() {
    updateBoard();
    updatePlayers();
    updateDie();
    updateLog();
    updateGameStatus();
    updateActionArea();
    
    // Make sure roll button is enabled when in READY state
    const rollButton = document.getElementById('roll-button');
    if (game.gameState === 'READY') {
        rollButton.disabled = false;
    }
}

/**
 * Update the game board UI based on the board state
 */
function updateBoard() {
    const boardContainer = document.getElementById('game-board');
    // Clear current board
    boardContainer.innerHTML = '';

    // Render each space in the board
    game.board.spaces.forEach((space, index) => {
        const spaceDiv = document.createElement('div');
        spaceDiv.classList.add('board-space');
        
        // Add type based class
        spaceDiv.classList.add(space.type + '-space');
        
        // Add territory border
        spaceDiv.classList.add('territory-' + space.territory);

        // Get grid position based on board layout
        const gridPos = game.board.getGridPosition(index);
        spaceDiv.style.gridRowStart = gridPos.row + 1;
        spaceDiv.style.gridColumnStart = gridPos.col + 1;

        // Show space type or value
        switch (space.type) {
            case 'castle':
                spaceDiv.textContent = 'C';
                break;
            case 'resource':
                spaceDiv.textContent = space.value;
                break;
            case 'gamble':
                spaceDiv.textContent = '★';
                break;
            case 'battle':
                spaceDiv.textContent = '⚔';
                break;
            default:
                spaceDiv.textContent = '';
        }

        // Render player pieces if any
        space.playersPresent.forEach(playerId => {
            const piece = document.createElement('div');
            piece.classList.add('player-piece', 'player-piece-' + playerId);
            
            // Center positioning with slight offset based on player ID for multiple players
            // This ensures pieces are always visible and centered
            if (space.playersPresent.length > 1) {
                // Calculate position based on how many players are on the space
                const angle = (playerId - 1) * (360 / space.playersPresent.length);
                const radius = 10; // Distance from center in pixels
                const offsetX = radius * Math.cos(angle * Math.PI / 180);
                const offsetY = radius * Math.sin(angle * Math.PI / 180);
                
                piece.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
            } else {
                // If only one player, center exactly
                piece.style.transform = 'translate(-50%, -50%)';
            }
            
            spaceDiv.appendChild(piece);
        });

        boardContainer.appendChild(spaceDiv);
    });
}

/**
 * Update player panels with current player states
 */
function updatePlayers() {
    for (let playerId = 1; playerId <= 4; playerId++) {
        const playerPanel = document.getElementById('player' + playerId);
        const playerData = game.getGameState().players[playerId];

        // Update stone count
        playerPanel.querySelector('.stone-count').textContent = playerData.stone;

        // Update castle progress
        const castlePieces = playerPanel.querySelectorAll('.castle-piece');
        castlePieces.forEach((piece, index) => {
            if (index < playerData.castlePieces) {
                piece.classList.add('built');
            } else {
                piece.classList.remove('built');
            }
        });

        // Highlight current player's panel
        if (game.currentPlayer === playerId) {
            playerPanel.classList.add('active');
        } else {
            playerPanel.classList.remove('active');
        }
    }
}

/**
 * Update the die display
 */
function updateDie() {
    const dieElement = document.querySelector('.die');
    if (game.dieResult !== null) {
        dieElement.textContent = game.dieResult;
    } else {
        dieElement.textContent = '?';
    }
}

/**
 * Update the event log in the UI
 */
function updateLog() {
    const logContainer = document.getElementById('log-entries');
    logContainer.innerHTML = '';
    const events = game.getEventLog();
    events.forEach(event => {
        const logEntry = document.createElement('div');
        logEntry.classList.add('log-entry');
        logEntry.textContent = `[${event.timestamp}] ${event.message}`;
        logContainer.appendChild(logEntry);
    });
}

/**
 * Update the game status header
 */
function updateGameStatus() {
    const statusElement = document.getElementById('game-status');
    const rollButton = document.getElementById('roll-button');
    
    if (game.gameOver) {
        statusElement.textContent = `Game Over! Player ${game.winner} wins!`;
        rollButton.textContent = 'New Game';
    } else {
        statusElement.textContent = `Player ${game.currentPlayer}'s Turn`;
        statusElement.style.backgroundColor = getPlayerColor(game.currentPlayer);
        rollButton.textContent = 'Roll Die';
    }
}

/**
 * Get player color based on player ID
 */
function getPlayerColor(playerId) {
    const colors = {
        1: 'var(--player1-color)',
        2: 'var(--player2-color)',
        3: 'var(--player3-color)',
        4: 'var(--player4-color)'
    };
    return colors[playerId] || colors[1];
}

/**
 * Update the action area based on current game state
 */
function updateActionArea() {
    const actionArea = document.getElementById('action-area');
    actionArea.innerHTML = '';
    
    // Don't show actions if game is over or waiting for roll
    if (game.gameOver || game.gameState === 'READY') {
        return;
    }
    
    // Create appropriate buttons based on game state
    if (game.gameState === 'ACTION') {
        if (game.lastAction) {
            switch (game.lastAction.type) {
                case 'castle':
                    if (game.players[game.currentPlayer].hasEnoughStone(game.lastAction.cost)) {
                        const buildButton = createActionButton('Build Castle Piece', () => {
                            if (game.buildCastlePiece()) {
                                updateUI();
                                
                                if (game.gameOver) {
                                    showWinnerModal(game.winner);
                                } else {
                                    const skipButton = createActionButton('End Turn', () => {
                                        game.endTurn();
                                        updateUI();
                                    });
                                    actionArea.innerHTML = '';
                                    actionArea.appendChild(skipButton);
                                }
                            }
                        });
                        
                        const skipButton = createActionButton('Skip Building', () => {
                            game.endTurn();
                            updateUI();
                        }, 'neutral');
                        
                        actionArea.appendChild(buildButton);
                        actionArea.appendChild(skipButton);
                    } else {
                        const skipButton = createActionButton('End Turn', () => {
                            game.endTurn();
                            updateUI();
                        });
                        actionArea.appendChild(skipButton);
                    }
                    break;
                
                case 'resource_collected':
                case 'blocked_resource':
                case 'insufficient_stone_for_gamble':
                case 'first_turn_no_battle':
                    const continueButton = createActionButton('End Turn', () => {
                        game.endTurn();
                        updateUI();
                    });
                    actionArea.appendChild(continueButton);
                    break;
            }
            
            // Handle enemy territory interaction
            if (game.lastAction.enemyInteraction) {
                const enemy = game.lastAction.enemyInteraction.owner;
                const attackStoneButton = createActionButton(`Attack Stone (Player ${enemy})`, () => {
                    const result = game.handleEnemyTerritoryInteraction(enemy, 'stone');
                    updateUI();
                    
                    if (!game.gameOver) {
                        const endTurnButton = createActionButton('End Turn', () => {
                            game.endTurn();
                            updateUI();
                        });
                        actionArea.innerHTML = '';
                        actionArea.appendChild(endTurnButton);
                    }
                });
                
                const attackCastleButton = createActionButton(`Attack Castle (Player ${enemy})`, () => {
                    const result = game.handleEnemyTerritoryInteraction(enemy, 'castle');
                    updateUI();
                    
                    if (!game.gameOver) {
                        const endTurnButton = createActionButton('End Turn', () => {
                            game.endTurn();
                            updateUI();
                        });
                        actionArea.innerHTML = '';
                        actionArea.appendChild(endTurnButton);
                    }
                });
                
                const skipAttackButton = createActionButton('Skip Attack', () => {
                    game.endTurn();
                    updateUI();
                }, 'neutral');
                
                actionArea.innerHTML = '';
                actionArea.appendChild(attackStoneButton);
                actionArea.appendChild(attackCastleButton);
                actionArea.appendChild(skipAttackButton);
            }
        }
    } else if (game.gameState === 'BATTLE') {
        if (game.lastAction) {
            if (game.lastAction.type === 'automatic_battle') {
                // Show battle options against the player in the same space
                const opponent = game.lastAction.opponents[0];
                
                const battleStoneButton = createActionButton(`Battle for Stone (Player ${opponent})`, () => {
                    const result = game.handleBattle(opponent, 'stone');
                    updateUI();
                    showBattleResultModal(result);
                    
                    setTimeout(() => {
                        game.endTurn();
                        updateUI();
                        document.getElementById('game-modal').classList.remove('show');
                    }, 2000);
                });
                
                const battleCastleButton = createActionButton(`Battle for Castle (Player ${opponent})`, () => {
                    const result = game.handleBattle(opponent, 'castle');
                    updateUI();
                    showBattleResultModal(result);
                    
                    setTimeout(() => {
                        game.endTurn();
                        updateUI();
                        document.getElementById('game-modal').classList.remove('show');
                    }, 2000);
                });
                
                actionArea.appendChild(battleStoneButton);
                actionArea.appendChild(battleCastleButton);
            } else if (game.lastAction.type === 'battle_space') {
                // Show buttons to choose opponent
                for (let playerId = 1; playerId <= 4; playerId++) {
                    if (playerId !== game.currentPlayer) {
                        const battleButton = createActionButton(`Battle Player ${playerId}`, () => {
                            // Show stone/castle choice
                            actionArea.innerHTML = '';
                            
                            const battleStoneButton = createActionButton(`Battle for Stone`, () => {
                                const result = game.handleBattle(playerId, 'stone');
                                updateUI();
                                showBattleResultModal(result);
                                
                                setTimeout(() => {
                                    game.endTurn();
                                    updateUI();
                                    document.getElementById('game-modal').classList.remove('show');
                                }, 2000);
                            });
                            
                            const battleCastleButton = createActionButton(`Battle for Castle`, () => {
                                const result = game.handleBattle(playerId, 'castle');
                                updateUI();
                                showBattleResultModal(result);
                                
                                setTimeout(() => {
                                    game.endTurn();
                                    updateUI();
                                    document.getElementById('game-modal').classList.remove('show');
                                }, 2000);
                            });
                            
                            actionArea.appendChild(battleStoneButton);
                            actionArea.appendChild(battleCastleButton);
                        });
                        
                        actionArea.appendChild(battleButton);
                    }
                }
                
                const skipBattleButton = createActionButton('Skip Battle', () => {
                    game.endTurn();
                    updateUI();
                }, 'neutral');
                
                actionArea.appendChild(skipBattleButton);
            }
        }
    } else if (game.gameState === 'GAMBLE') {
        const gambleButton = createActionButton('Gamble 30 Stone', () => {
            const result = game.handleGamble();
            updateUI();
            
            showNotification(result.won ? 
                `Gamble successful! Won 30 stone with a roll of ${result.roll}.` : 
                `Gamble failed! Lost 30 stone with a roll of ${result.roll}.`);
            
            setTimeout(() => {
                game.endTurn();
                updateUI();
            }, 1500);
        });
        
        const skipGambleButton = createActionButton('Skip Gamble', () => {
            game.endTurn();
            updateUI();
        }, 'neutral');
        
        actionArea.appendChild(gambleButton);
        actionArea.appendChild(skipGambleButton);
    }
}

/**
 * Create an action button with text and click handler
 */
function createActionButton(text, clickHandler, type = '') {
    const button = document.createElement('button');
    button.classList.add('action-button');
    if (type) {
        button.classList.add(type);
    }
    button.textContent = text;
    button.addEventListener('click', clickHandler);
    return button;
}

/**
 * Show a notification message
 */
function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    
    notificationText.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

/**
 * Show battle result in a modal
 */
function showBattleResultModal(result) {
    const modal = document.getElementById('game-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    modalTitle.textContent = 'Battle Result';
    
    if (result.winner === game.currentPlayer) {
        modalBody.textContent = `You won the battle! You rolled ${result.currentPlayerRoll} vs opponent's ${result.opponentRoll}.`;
    } else if (result.winner === 'tie') {
        modalBody.textContent = `The battle ended in a tie! Both rolled ${result.currentPlayerRoll}.`;
    } else {
        modalBody.textContent = `You lost the battle! You rolled ${result.currentPlayerRoll} vs opponent's ${result.opponentRoll}.`;
    }
    
    modal.classList.add('show');
}

/**
 * Show winner celebration in a modal
 */
function showWinnerModal(winner) {
    const modal = document.getElementById('game-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    modalTitle.textContent = 'Game Over!';
    modalBody.textContent = `Player ${winner} has completed their castle, raised their flag, and won the game!`;
    
    modal.classList.add('show');
}

/**
 * Reset the game
 */
function resetGame() {
    game.startGame();
    updateUI();
    showNotification('New game started!');
}

/**
 * Handle actions based on current game state
 */
function handleGameStateActions(landedSpace) {
    const rollButton = document.getElementById('roll-button');
    
    // Show appropriate UI elements based on game state
    if (game.gameState === 'ACTION' || game.gameState === 'BATTLE' || game.gameState === 'GAMBLE') {
        rollButton.disabled = true;
        updateActionArea();
    } else {
        rollButton.disabled = false;
    }
}
