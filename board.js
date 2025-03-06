/**
 * board.js - Handles the game board creation and management
 * 
 * This file contains the logic for creating the game board, defining space types,
 * and managing player positions on the board.
 */

class Board {
    constructor() {
        this.spaces = [];
        this.playerPositions = {
            1: 0, // Player 1 starts at position 0
            2: 7, // Player 2 starts at position 7
            3: 14, // Player 3 starts at position 14
            4: 21  // Player 4 starts at position 21
        };
        this.territories = {
            1: { start: 0, end: 6 },   // Player 1 territory
            2: { start: 7, end: 13 },  // Player 2 territory
            3: { start: 14, end: 20 }, // Player 3 territory
            4: { start: 21, end: 27 }  // Player 4 territory
        };
        this.createBoard();
    }

    /**
     * Creates the game board with different space types
     */
    createBoard() {
        // Define space types for each territory
        // Each territory has 7 spaces: 2 Castle, 2 Resource, 2 Battle, 1 Gamble
        const territorySpaceTypes = [
            // Player 1 territory
            [
                { type: 'castle', value: 10 },
                { type: 'resource', value: 10 },
                { type: 'battle', value: 0 },
                { type: 'resource', value: 20 },
                { type: 'battle', value: 0 },
                { type: 'gamble', value: 30 },
                { type: 'castle', value: 10 }
            ],
            // Player 2 territory
            [
                { type: 'castle', value: 10 },
                { type: 'resource', value: 10 },
                { type: 'battle', value: 0 },
                { type: 'resource', value: 20 },
                { type: 'battle', value: 0 },
                { type: 'gamble', value: 30 },
                { type: 'castle', value: 10 }
            ],
            // Player 3 territory
            [
                { type: 'castle', value: 10 },
                { type: 'resource', value: 10 },
                { type: 'battle', value: 0 },
                { type: 'resource', value: 20 },
                { type: 'battle', value: 0 },
                { type: 'gamble', value: 30 },
                { type: 'castle', value: 10 }
            ],
            // Player 4 territory
            [
                { type: 'castle', value: 10 },
                { type: 'resource', value: 10 },
                { type: 'battle', value: 0 },
                { type: 'resource', value: 20 },
                { type: 'battle', value: 0 },
                { type: 'gamble', value: 30 },
                { type: 'castle', value: 10 }
            ]
        ];

        // Create all spaces for the board
        for (let territory = 0; territory < 4; territory++) {
            const territoryId = territory + 1;
            const spaceTypes = territorySpaceTypes[territory];
            
            for (let i = 0; i < spaceTypes.length; i++) {
                const position = territory * spaceTypes.length + i;
                const space = {
                    id: position,
                    type: spaceTypes[i].type,
                    value: spaceTypes[i].value,
                    territory: territoryId,
                    playersPresent: []
                };
                this.spaces.push(space);
            }
        }

        // Initialize player positions
        for (let playerId = 1; playerId <= 4; playerId++) {
            this.updatePlayerPosition(playerId, this.playerPositions[playerId]);
        }
    }

    /**
     * Get a space by its position on the board
     * @param {number} position - The position on the board
     * @returns {Object} The space at the given position
     */
    getSpace(position) {
        // Ensure position is within bounds (wrap around if needed)
        const normalizedPosition = position % this.spaces.length;
        return this.spaces[normalizedPosition];
    }

    /**
     * Get the current position of a player
     * @param {number} playerId - The ID of the player
     * @returns {number} The current position of the player
     */
    getPlayerPosition(playerId) {
        return this.playerPositions[playerId];
    }

    /**
     * Update a player's position on the board
     * @param {number} playerId - The ID of the player
     * @param {number} newPosition - The new position for the player
     */
    updatePlayerPosition(playerId, newPosition) {
        // Remove player from current position
        const currentPosition = this.playerPositions[playerId];
        const currentSpace = this.getSpace(currentPosition);
        
        if (currentSpace.playersPresent.includes(playerId)) {
            currentSpace.playersPresent = currentSpace.playersPresent.filter(id => id !== playerId);
        }

        // Normalize new position to ensure it's within board bounds
        const normalizedPosition = newPosition % this.spaces.length;
        this.playerPositions[playerId] = normalizedPosition;

        // Add player to new position
        const newSpace = this.getSpace(normalizedPosition);
        if (!newSpace.playersPresent.includes(playerId)) {
            newSpace.playersPresent.push(playerId);
        }

        return newSpace;
    }

    /**
     * Move a player by a number of spaces
     * @param {number} playerId - The ID of the player
     * @param {number} spaces - The number of spaces to move
     * @returns {Object} The new space the player landed on
     */
    movePlayer(playerId, spaces) {
        const currentPosition = this.playerPositions[playerId];
        const newPosition = (currentPosition + spaces) % this.spaces.length;
        return this.updatePlayerPosition(playerId, newPosition);
    }

    /**
     * Check if a position is within a player's territory
     * @param {number} position - The position to check
     * @param {number} playerId - The ID of the player
     * @returns {boolean} True if the position is in the player's territory
     */
    isInTerritory(position, playerId) {
        const territory = this.territories[playerId];
        const normalizedPosition = position % this.spaces.length;
        return normalizedPosition >= territory.start && normalizedPosition <= territory.end;
    }

    /**
     * Get the owner of the territory containing a position
     * @param {number} position - The position to check
     * @returns {number} The ID of the player who owns the territory
     */
    getTerritoryOwner(position) {
        const normalizedPosition = position % this.spaces.length;
        for (let playerId = 1; playerId <= 4; playerId++) {
            if (this.isInTerritory(normalizedPosition, playerId)) {
                return playerId;
            }
        }
        return null; // Should never happen with our board layout
    }

    /**
     * Get all players present at a specific position
     * @param {number} position - The position to check
     * @returns {Array} Array of player IDs present at the position
     */
    getPlayersAtPosition(position) {
        const space = this.getSpace(position);
        return space.playersPresent;
    }

    /**
     * Check if a player is in an enemy territory
     * @param {number} playerId - The ID of the player
     * @returns {boolean} True if the player is in an enemy territory
     */
    isPlayerInEnemyTerritory(playerId) {
        const position = this.playerPositions[playerId];
        const territoryOwner = this.getTerritoryOwner(position);
        return territoryOwner !== playerId;
    }

    /**
     * Get the grid position for rendering a space
     * @param {number} position - The position on the board
     * @returns {Object} The row and column for the grid
     */
    getGridPosition(position) {
        // Board layout is a 7x7 grid with spaces around the perimeter
        // The spaces go around clockwise starting from the top-left corner
        const normalizedPosition = position % this.spaces.length;
        
        // Calculate which side of the board this position is on
        // Each side has 7 spaces
        const side = Math.floor(normalizedPosition / 7);
        const indexOnSide = normalizedPosition % 7;
        
        // Top row (Player 1 territory)
        if (side === 0) {
            return { row: 0, col: indexOnSide };
        }
        // Right column (Player 2 territory)
        else if (side === 1) {
            return { row: indexOnSide, col: 6 };
        }
        // Bottom row (Player 3 territory)
        else if (side === 2) {
            return { row: 6, col: 6 - indexOnSide };
        }
        // Left column (Player 4 territory)
        else {
            return { row: 6 - indexOnSide, col: 0 };
        }
    }
}
