/**
 * game.js - Core game logic and state management
 * 
 * This file contains the Game class which manages the overall game state,
 * turn management, and game mechanics.
 */

class Game {
    constructor() {
        this.board = new Board();
        this.players = {
            1: new Player(1),
            2: new Player(2),
            3: new Player(3),
            4: new Player(4)
        };
        this.currentPlayer = 1;
        this.gameStarted = false;
        this.gameOver = false;
        this.winner = null;
        this.turnCount = 0;
        this.dieResult = null;
        this.gameState = 'READY'; // READY, ROLLING, MOVING, ACTION, BATTLE, GAMBLE, GAME_OVER
        this.lastAction = null;
        this.eventLog = [];
    }

    /**
     * Start a new game
     */
    startGame() {
        this.gameStarted = true;
        this.turnCount = 0;
        this.gameState = 'READY';
        this.logEvent('Game started! Player 1 goes first.');
    }

    /**
     * Roll the die for the current player
     * @returns {number} The die result (1-6)
     */
    rollDie() {
        this.dieResult = Math.floor(Math.random() * 6) + 1;
        this.gameState = 'MOVING';
        this.logEvent(`Player ${this.currentPlayer} rolled a ${this.dieResult}.`);
        return this.dieResult;
    }

    /**
     * Move the current player based on the die roll
     * @returns {Object} The space the player landed on
     */
    moveCurrentPlayer() {
        if (this.dieResult === null) {
            return null;
        }

        const player = this.players[this.currentPlayer];
        const startingPosition = this.board.getPlayerPosition(this.currentPlayer);
        const startingInEnemyTerritory = this.board.isPlayerInEnemyTerritory(this.currentPlayer);

        // If starting in enemy territory, check for penalty
        if (startingInEnemyTerritory && this.turnCount > 0) {
            const penaltyRoll = Math.floor(Math.random() * 6) + 1;
            if (penaltyRoll % 2 === 1) { // Odd roll
                player.removeStone(10);
                this.logEvent(`Player ${this.currentPlayer} started in enemy territory and rolled an odd number (${penaltyRoll}). Lost 10 stone.`);
            } else {
                this.logEvent(`Player ${this.currentPlayer} started in enemy territory but rolled an even number (${penaltyRoll}). No penalty.`);
            }
        }

        // Move the player
        const newSpace = this.board.movePlayer(this.currentPlayer, this.dieResult);
        this.logEvent(`Player ${this.currentPlayer} moved to a ${newSpace.type} space.`);

        // Check for other players at the same position (automatic battle)
        const otherPlayers = newSpace.playersPresent.filter(id => id !== this.currentPlayer);
        if (otherPlayers.length > 0 && this.turnCount > 0) {
            this.gameState = 'BATTLE';
            this.lastAction = {
                type: 'automatic_battle',
                opponents: otherPlayers
            };
            this.logEvent(`Player ${this.currentPlayer} landed on the same space as Player ${otherPlayers[0]}. Battle initiated!`);
            return newSpace;
        }

        // Set game state based on space type
        switch (newSpace.type) {
            case 'castle':
                this.gameState = 'ACTION';
                this.lastAction = {
                    type: 'castle',
                    cost: newSpace.value
                };
                break;
            case 'resource':
                // Check if player is in enemy territory and already collected resources
                const inEnemyTerritory = this.board.isPlayerInEnemyTerritory(this.currentPlayer);
                if (inEnemyTerritory && player.hasCollectedResourceThisTurn()) {
                    this.logEvent(`Player ${this.currentPlayer} cannot collect resources in enemy territory after already collecting resources this turn.`);
                    this.gameState = 'ACTION';
                    this.lastAction = {
                        type: 'blocked_resource',
                        value: newSpace.value
                    };
                } else {
                    player.addStone(newSpace.value);
                    player.markResourceCollected();
                    this.logEvent(`Player ${this.currentPlayer} collected ${newSpace.value} stone.`);
                    this.gameState = 'ACTION';
                    this.lastAction = {
                        type: 'resource_collected',
                        value: newSpace.value
                    };
                }
                break;
            case 'gamble':
                if (player.hasEnoughStone(30)) {
                    this.gameState = 'GAMBLE';
                    this.lastAction = {
                        type: 'gamble',
                        value: 30
                    };
                } else {
                    this.logEvent(`Player ${this.currentPlayer} doesn't have enough stone to gamble.`);
                    this.gameState = 'ACTION';
                    this.lastAction = {
                        type: 'insufficient_stone_for_gamble'
                    };
                }
                break;
            case 'battle':
                if (this.turnCount > 0) { // No battles on first turn
                    this.gameState = 'BATTLE';
                    this.lastAction = {
                        type: 'battle_space'
                    };
                } else {
                    this.logEvent(`No battles allowed on the first turn.`);
                    this.gameState = 'ACTION';
                    this.lastAction = {
                        type: 'first_turn_no_battle'
                    };
                }
                break;
        }

        // Check for enemy territory interaction
        if (this.board.isPlayerInEnemyTerritory(this.currentPlayer) && 
            this.turnCount > 0 && 
            newSpace.type !== 'resource' &&
            !player.hasCollectedResourceThisTurn()) {
            
            const territoryOwner = this.board.getTerritoryOwner(this.board.getPlayerPosition(this.currentPlayer));
            this.lastAction.enemyInteraction = {
                type: 'enemy_territory',
                owner: territoryOwner
            };
        }

        return newSpace;
    }

    /**
     * Build a castle piece for the current player
     * @returns {boolean} True if the castle piece was built successfully
     */
    buildCastlePiece() {
        const player = this.players[this.currentPlayer];
        const space = this.board.getSpace(this.board.getPlayerPosition(this.currentPlayer));
        
        if (space.type === 'castle' && player.buildCastlePiece(space.value)) {
            this.logEvent(`Player ${this.currentPlayer} built a castle piece for ${space.value} stone.`);
            
            // Check if the castle is complete
            if (player.castleComplete) {
                this.logEvent(`Player ${this.currentPlayer} completed their castle!`);
                player.raiseFlag();
                this.gameOver = true;
                this.winner = this.currentPlayer;
                this.gameState = 'GAME_OVER';
                this.logEvent(`Player ${this.currentPlayer} raised their flag and won the game!`);
            }
            
            return true;
        }
        
        return false;
    }

    /**
     * Handle the gamble action for the current player
     * @returns {Object} The result of the gamble
     */
    handleGamble() {
        const player = this.players[this.currentPlayer];
        
        if (player.hasEnoughStone(30)) {
            const roll = Math.floor(Math.random() * 6) + 1;
            const isEven = roll % 2 === 0;
            
            if (isEven) {
                player.addStone(30);
                this.logEvent(`Player ${this.currentPlayer} gambled and won! Rolled ${roll} (even) and gained 30 stone.`);
                return { success: true, roll, won: true, amount: 30 };
            } else {
                player.removeStone(30);
                this.logEvent(`Player ${this.currentPlayer} gambled and lost! Rolled ${roll} (odd) and lost 30 stone.`);
                return { success: true, roll, won: false, amount: 30 };
            }
        }
        
        this.logEvent(`Player ${this.currentPlayer} doesn't have enough stone to gamble.`);
        return { success: false, reason: 'insufficient_stone' };
    }

    /**
     * Handle a battle between the current player and an opponent
     * @param {number} opponentId - The ID of the opponent
     * @param {string} prize - The prize to take if won ('stone' or 'castle')
     * @returns {Object} The result of the battle
     */
    handleBattle(opponentId, prize = 'stone') {
        if (this.turnCount === 0) {
            this.logEvent(`No battles allowed on the first turn.`);
            return { success: false, reason: 'first_turn' };
        }

        const currentPlayer = this.players[this.currentPlayer];
        const opponent = this.players[opponentId];
        
        // Roll dice for both players
        const currentPlayerRoll = Math.floor(Math.random() * 6) + 1;
        const opponentRoll = Math.floor(Math.random() * 6) + 1;
        
        let result = {
            success: true,
            currentPlayerRoll,
            opponentRoll,
            winner: null,
            prize
        };
        
        if (currentPlayerRoll > opponentRoll) {
            result.winner = this.currentPlayer;
            
            if (prize === 'stone') {
                if (opponent.hasEnoughStone(10)) {
                    opponent.removeStone(10);
                    currentPlayer.addStone(10);
                    this.logEvent(`Player ${this.currentPlayer} won the battle against Player ${opponentId}! Took 10 stone.`);
                } else {
                    this.logEvent(`Player ${this.currentPlayer} won the battle against Player ${opponentId}, but they had no stone to take.`);
                }
            } else if (prize === 'castle') {
                if (opponent.castlePieces > 0) {
                    opponent.removeCastlePiece();
                    this.logEvent(`Player ${this.currentPlayer} won the battle against Player ${opponentId}! Destroyed one of their castle pieces.`);
                } else {
                    this.logEvent(`Player ${this.currentPlayer} won the battle against Player ${opponentId}, but they had no castle pieces to destroy.`);
                }
            }
        } else if (opponentRoll > currentPlayerRoll) {
            result.winner = opponentId;
            
            if (prize === 'stone') {
                if (currentPlayer.hasEnoughStone(10)) {
                    currentPlayer.removeStone(10);
                    opponent.addStone(10);
                    this.logEvent(`Player ${opponentId} won the battle against Player ${this.currentPlayer}! Took 10 stone.`);
                } else {
                    this.logEvent(`Player ${opponentId} won the battle against Player ${this.currentPlayer}, but they had no stone to take.`);
                }
            } else if (prize === 'castle') {
                if (currentPlayer.castlePieces > 0) {
                    currentPlayer.removeCastlePiece();
                    this.logEvent(`Player ${opponentId} won the battle against Player ${this.currentPlayer}! Destroyed one of their castle pieces.`);
                } else {
                    this.logEvent(`Player ${opponentId} won the battle against Player ${this.currentPlayer}, but they had no castle pieces to destroy.`);
                }
            }
        } else {
            result.winner = 'tie';
            this.logEvent(`The battle between Player ${this.currentPlayer} and Player ${opponentId} ended in a tie!`);
        }
        
        return result;
    }

    /**
     * Handle enemy territory interaction
     * @param {number} enemyId - The ID of the enemy player
     * @param {string} action - The action to take ('stone' or 'castle')
     * @returns {Object} The result of the interaction
     */
    handleEnemyTerritoryInteraction(enemyId, action = 'stone') {
        const roll = Math.floor(Math.random() * 6) + 1;
        const isEven = roll % 2 === 0;
        const enemy = this.players[enemyId];
        
        let result = {
            success: true,
            roll,
            isEven,
            action
        };
        
        if (isEven) {
            this.logEvent(`Player ${this.currentPlayer} rolled ${roll} (even) in Player ${enemyId}'s territory. No effect.`);
        } else {
            if (action === 'stone') {
                if (enemy.hasEnoughStone(10)) {
                    enemy.removeStone(10);
                    this.logEvent(`Player ${this.currentPlayer} rolled ${roll} (odd) in Player ${enemyId}'s territory. Player ${enemyId} lost 10 stone.`);
                } else {
                    this.logEvent(`Player ${this.currentPlayer} rolled ${roll} (odd) in Player ${enemyId}'s territory, but Player ${enemyId} had no stone to lose.`);
                }
            } else if (action === 'castle') {
                if (enemy.castlePieces > 0) {
                    enemy.removeCastlePiece();
                    this.logEvent(`Player ${this.currentPlayer} rolled ${roll} (odd) in Player ${enemyId}'s territory. Player ${enemyId} lost a castle piece.`);
                } else {
                    this.logEvent(`Player ${this.currentPlayer} rolled ${roll} (odd) in Player ${enemyId}'s territory, but Player ${enemyId} had no castle pieces to lose.`);
                }
            }
        }
        
        return result;
    }

    /**
     * End the current player's turn and move to the next player
     */
    endTurn() {
        // Reset state for next turn
        this.dieResult = null;
        this.lastAction = null;
        
        // Move to next player
        this.currentPlayer = (this.currentPlayer % 4) + 1;
        this.players[this.currentPlayer].startNewTurn();
        this.turnCount++;
        
        this.gameState = 'READY';
        this.logEvent(`It's now Player ${this.currentPlayer}'s turn.`);
    }

    /**
     * Get the current game state
     * @returns {Object} The current game state
     */
    getGameState() {
        return {
            currentPlayer: this.currentPlayer,
            gameStarted: this.gameStarted,
            gameOver: this.gameOver,
            winner: this.winner,
            turnCount: this.turnCount,
            dieResult: this.dieResult,
            state: this.gameState,
            lastAction: this.lastAction,
            players: {
                1: {
                    stone: this.players[1].stone,
                    castlePieces: this.players[1].castlePieces,
                    castleComplete: this.players[1].castleComplete,
                    flagRaised: this.players[1].flagRaised,
                    position: this.board.getPlayerPosition(1)
                },
                2: {
                    stone: this.players[2].stone,
                    castlePieces: this.players[2].castlePieces,
                    castleComplete: this.players[2].castleComplete,
                    flagRaised: this.players[2].flagRaised,
                    position: this.board.getPlayerPosition(2)
                },
                3: {
                    stone: this.players[3].stone,
                    castlePieces: this.players[3].castlePieces,
                    castleComplete: this.players[3].castleComplete,
                    flagRaised: this.players[3].flagRaised,
                    position: this.board.getPlayerPosition(3)
                },
                4: {
                    stone: this.players[4].stone,
                    castlePieces: this.players[4].castlePieces,
                    castleComplete: this.players[4].castleComplete,
                    flagRaised: this.players[4].flagRaised,
                    position: this.board.getPlayerPosition(4)
                }
            },
            board: this.board.spaces
        };
    }

    /**
     * Log an event to the game event log
     * @param {string} message - The event message
     */
    logEvent(message) {
        const timestamp = new Date().toLocaleTimeString();
        this.eventLog.push({ timestamp, message });
        
        // Keep log at a reasonable size
        if (this.eventLog.length > 50) {
            this.eventLog.shift();
        }
    }

    /**
     * Get the game event log
     * @returns {Array} The game event log
     */
    getEventLog() {
        return this.eventLog;
    }
}
