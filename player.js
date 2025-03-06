/**
 * player.js - Handles player-related functionality
 * 
 * This file contains the Player class which manages player state,
 * including resources, castle pieces, and game actions.
 */

class Player {
    constructor(id) {
        this.id = id;
        this.stone = 0; // Starting with 0 stone as per PRD
        this.castlePieces = 0; // Starting with 0 castle pieces
        this.castleComplete = false;
        this.flagRaised = false;
        this.collectedResourceThisTurn = false;
    }

    /**
     * Add stone resources to the player
     * @param {number} amount - The amount of stone to add
     * @returns {number} The new stone total
     */
    addStone(amount) {
        this.stone += amount;
        return this.stone;
    }

    /**
     * Remove stone resources from the player
     * @param {number} amount - The amount of stone to remove
     * @returns {number} The new stone total
     */
    removeStone(amount) {
        this.stone = Math.max(0, this.stone - amount);
        return this.stone;
    }

    /**
     * Check if the player has enough stone
     * @param {number} amount - The amount of stone to check for
     * @returns {boolean} True if the player has enough stone
     */
    hasEnoughStone(amount) {
        return this.stone >= amount;
    }

    /**
     * Add a castle piece to the player
     * @returns {number} The new castle piece count
     */
    addCastlePiece() {
        if (this.castlePieces < 5) {
            this.castlePieces++;
            
            // Check if castle is complete
            if (this.castlePieces === 5) {
                this.castleComplete = true;
            }
        }
        return this.castlePieces;
    }

    /**
     * Remove a castle piece from the player
     * @returns {number} The new castle piece count
     */
    removeCastlePiece() {
        if (this.castlePieces > 0) {
            this.castlePieces--;
            this.castleComplete = false;
            this.flagRaised = false;
        }
        return this.castlePieces;
    }

    /**
     * Build a castle piece using stone
     * @param {number} stoneCost - The stone cost to build a castle piece
     * @returns {boolean} True if the castle piece was built successfully
     */
    buildCastlePiece(stoneCost) {
        if (this.hasEnoughStone(stoneCost) && this.castlePieces < 5) {
            this.removeStone(stoneCost);
            this.addCastlePiece();
            return true;
        }
        return false;
    }

    /**
     * Raise the flag to win the game
     * @returns {boolean} True if the flag was raised successfully
     */
    raiseFlag() {
        if (this.castleComplete && !this.flagRaised) {
            this.flagRaised = true;
            return true;
        }
        return false;
    }

    /**
     * Check if the player has won the game
     * @returns {boolean} True if the player has won
     */
    hasWon() {
        return this.castleComplete && this.flagRaised;
    }

    /**
     * Reset the collected resource flag for a new turn
     */
    startNewTurn() {
        this.collectedResourceThisTurn = false;
    }

    /**
     * Mark that the player collected a resource this turn
     */
    markResourceCollected() {
        this.collectedResourceThisTurn = true;
    }

    /**
     * Check if the player collected a resource this turn
     * @returns {boolean} True if the player collected a resource this turn
     */
    hasCollectedResourceThisTurn() {
        return this.collectedResourceThisTurn;
    }
}
