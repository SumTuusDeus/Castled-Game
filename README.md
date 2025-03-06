# CASTLED - Web-Based Board Game

A digital implementation of the CASTLED board game, a 4-player strategy game about building castles and sabotaging opponents.

![CASTLED Game](screenshots/game-preview.png)

## 🎮 Game Overview

CASTLED is a turn-based strategy board game where players compete to be the first to build their castle and raise their flag. Players move around the board, collect resources, battle opponents, and strategically build their castles while attempting to sabotage their rivals.

### Game Objective

Be the first player to complete your castle (5 castle pieces) and raise your flag!

### Key Features

- 🎲 Interactive die rolling and player movement
- 🏰 Castle building mechanics
- ⚔️ Player vs. player battles
- 💎 Resource collection and management
- 🎯 Strategic decision-making
- 🎭 Player sabotage mechanics

## 🛠️ Technical Implementation

### Architecture

The game is built using vanilla HTML, CSS, and JavaScript with a modular, object-oriented approach:

- **HTML**: Defines the game board, player panels, and UI elements
- **CSS**: Handles styling, animations, and responsive design
- **JavaScript**: Implements game logic and user interactions

### Code Structure

The codebase is organized into several key files:

- `index.html` - Main HTML structure and layout
- `styles.css` - Complete styling for the game
- `game.js` - Core game logic and state management
- `board.js` - Board creation and management
- `player.js` - Player state and actions
- `ui.js` - User interface and event handling

### Key Classes

#### Game Class (`game.js`)

The central class that manages the overall game state, turn management, and game mechanics.

```javascript
class Game {
    constructor() { ... }
    startGame() { ... }
    rollDie() { ... }
    moveCurrentPlayer() { ... }
    buildCastlePiece() { ... }
    handleGamble() { ... }
    handleBattle() { ... }
    handleEnemyTerritoryInteraction() { ... }
    endTurn() { ... }
    // ...other methods
}
```

#### Board Class (`board.js`)

Handles the game board creation, space types, and player positions.

```javascript
class Board {
    constructor() { ... }
    createBoard() { ... }
    getSpace(position) { ... }
    movePlayer(playerId, spaces) { ... }
    getPlayerPosition(playerId) { ... }
    updatePlayerPosition(playerId, newPosition) { ... }
    // ...other methods
}
```

#### Player Class (`player.js`)

Manages player state, resources, and castle building.

```javascript
class Player {
    constructor(id) { ... }
    addStone(amount) { ... }
    removeStone(amount) { ... }
    hasEnoughStone(amount) { ... }
    buildCastlePiece(stoneCost) { ... }
    // ...other methods
}
```

#### UI Module (`ui.js`)

Handles all user interface interactions and updates.

```javascript
function initUI() { ... }
function updateUI() { ... }
function updateBoard() { ... }
function updatePlayers() { ... }
// ...other functions
```

## 🎲 Game Mechanics

### Board Layout

The game board consists of 28 spaces (7 spaces in each of the 4 player territories):
- **Castle Spaces**: Exchange 10 stone for 1 castle piece
- **Resource Spaces**: Collect 10 or 20 stone
- **Gamble Spaces**: Gamble to gain or lose 30 stone
- **Battle Spaces**: Challenge other players

### Turn Flow

1. **Roll Die**: Player rolls a die (1-6) to determine movement
2. **Move**: Player moves clockwise around the board
3. **Action**: Player performs an action based on the space they land on:
   - Castle Space: Build a castle piece
   - Resource Space: Collect stone
   - Gamble Space: Gamble stone
   - Battle Space: Challenge another player
4. **End Turn**: Turn passes to the next player

### Special Rules

- **Enemy Territory**: 
  - Starting in enemy territory: Roll odd = lose 10 stone
  - Landing in enemy territory: Roll odd = enemy loses 10 stone or a castle piece
- **Same Space**: Landing on the same space as another player triggers an automatic battle
- **First Turn Protection**: No battles allowed on the first turn
- **Resource Collection**: Cannot attack after collecting resources in enemy territory

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server-side requirements (client-side only)

### Running the Game

1. Clone or download the repository
2. Open `index.html` in your web browser
3. Start playing!

## 🎮 How to Play

1. **Starting the Game**: The game begins with Player 1's turn
2. **Taking a Turn**:
   - Click the "Roll Die" button
   - Your piece will move automatically
   - Follow the prompts to take actions based on where you land
   - End your turn when prompted
3. **Building Your Castle**:
   - Land on a Castle Space
   - Spend 10 stone to build a castle piece
   - First to build 5 pieces wins!

## 🧩 Game Elements

### Players

- **Player 1**: Red
- **Player 2**: Blue
- **Player 3**: Green
- **Player 4**: Orange

Each player starts with:
- 0 stone
- 0 castle pieces
- A starting position in their territory

### Resources

- **Stone**: The primary resource, used to build castle pieces
- **Castle Pieces**: Build 5 to complete your castle and win

## 🛠️ Development

### Future Enhancements

- AI opponents for single-player mode
- Online multiplayer functionality
- Additional game modes and rule variations
- Enhanced animations and visual effects
- Sound effects and background music
- Game state persistence (save/load)

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Original board game concept and rules by Dave's Games
- Digital implementation by [Your Name/Team]
