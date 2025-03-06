# Product Requirements Document (PRD)
# CASTLED: Web-Based Board Game

## Document Version: 1.1
## Last Updated: March 6, 2025

## 1. Introduction

### 1.1 Purpose
This document outlines the requirements for developing a web-based version of CASTLED, a 4-player board game focused on castle building and sabotage. The implementation will use HTML, CSS, and JavaScript to create an interactive digital version that remains faithful to the original board game rules.

### 1.2 Product Overview
CASTLED is a turn-based strategy game where players compete to be the first to build their castle and raise their flag. Players move around a board collecting resources (stone), engaging in battles, and sabotaging opponents while working to construct their own castle.

### 1.3 Target Audience
- Casual gamers
- Board game enthusiasts
- Players ages 8+
- Groups of friends looking for multiplayer experiences

## 2. User Experience

### 2.1 Game Board Layout
The game board will feature:
- A circular or square layout divided into 4 distinct territories (one per player)
- Visual differentiation between territories using colors or themes
- Clearly marked spaces of different types:
  - Castle Spaces: Where players can build castle pieces
  - Resource Spaces: Where players collect stone (10 or 20)
  - Gamble Spaces: Marked with stars, where players can gamble their stone
  - Battle Spaces: Where players can challenge others

### 2.2 Player Interface
Each player will have:
- A game piece/avatar that moves around the board
- A resource counter displaying their current stone amount
- A castle construction area showing completed castle pieces
- A flag that can be raised upon castle completion

### 2.3 Game Flow
1. Players take turns in clockwise order
2. On each turn, a player:
   - Rolls a die
   - Moves their piece clockwise according to the roll
   - Performs actions based on the space they land on
   - Interacts with other players when applicable
3. Play continues until a player completes their castle and raises their flag

## 3. Functional Requirements

### 3.1 Game Setup
- Allow for 4 players (option for AI opponents if fewer human players)
- Assign each player a territory on the board
- **All players start with 0 stone**
- Position all player pieces at their starting locations
- Ensure all players' castle areas show no progress initially

### 3.2 Movement Mechanics
- Implement die rolling (1-6) with animated visual feedback
- Allow players to move clockwise around the board
- Provide option to stay within player's own territory or travel through others
- Enforce movement rules when traveling through enemy territories

### 3.3 Space Actions
- **Castle Spaces:**
  - Allow players to exchange 10 stone for 1 castle piece
  - Track and visualize castle construction progress
  - **A complete castle consists of 5 castle pieces**
  - Enable flag raising when the castle is complete (all 5 pieces built)
  
- **Resource Spaces:**
  - Automatically award 10 or 20 stone when a player lands on these spaces
  - Provide visual and textual confirmation of resource collection
  
- **Gamble Spaces:**
  - Offer gambling option when a player has 30+ stone
  - Implement die roll to determine outcome (even: gain 30 stone, odd: lose 30 stone)
  - Provide visual feedback of gambling results
  
- **Battle Spaces:**
  - Allow player to choose an opponent to challenge
  - Implement simultaneous die rolls for both players
  - Award winner with 10 stone or a castle piece from the loser
  - Animate battle results

### 3.4 Player Interactions
- **Enemy Territory Interactions:**
  - If starting turn in enemy territory, implement die roll with odd number resulting in 10 stone loss
  - If landing on enemy space, offer option to roll for chance to make enemy lose 10 stone or a castle piece

- **Same Space Interactions:**
  - Trigger automatic battle when landing on the same space as another player
  - Implement die rolls to determine winner
  - Transfer resources or castle pieces per the rules

### 3.5 Special Rules
- Prevent player attacks during the first turn of the game
- Block attacking an enemy player in the same turn as collecting stone in their territory

### 3.6 Win Condition
- Track castle completion for all players (5 castle pieces = complete castle)
- Recognize and announce winner when a player completes their castle and raises their flag
- Provide option to start a new game after completion

## 4. Technical Requirements

### 4.1 Platform & Compatibility
- Web browser-based implementation
- Compatible with modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design for desktop and tablet play
- Minimum screen size requirements: 768px width

### 4.2 Technologies
- **Frontend:**
  - HTML5 for structure
  - CSS3 for styling and animations
  - JavaScript for game logic and interactivity
  - Canvas or SVG for board visualization (if appropriate)

- **Optional Backend (for multiplayer):**
  - WebSockets for real-time communication
  - Simple database for game state persistence

### 4.3 Performance Requirements
- Game should load within 5 seconds on standard connections
- Die rolls and animations should complete within 2 seconds
- Game state updates should be reflected immediately after actions

## 5. User Interface Design

### 5.1 Game Board
- Circular or square layout divided into 4 color-coded territories
- Clear visual distinction between space types:
  - Castle Spaces: Blank/neutral appearance
  - Resource Spaces: Stone/resource imagery with amount indicators (10/20)
  - Gamble Spaces: Star symbols with distinctive styling
  - Battle Spaces: Combat-themed imagery

### 5.2 Player Information
- Player panels showing:
  - Player name/identifier
  - Current stone count (starting at 0)
  - Castle construction progress (0/5 pieces initially)
  - Turn indicator when active

### 5.3 Controls
- Prominent "Roll Die" button during movement phase
- Action buttons that appear contextually based on current game state
- Castle building option when on Castle Space with sufficient resources
- Gamble option when on Gamble Space with sufficient resources

### 5.4 Notifications & Feedback
- Toast notifications for game events
- Dialog boxes for player decisions
- Animations for:
  - Die rolling
  - Piece movement
  - Resource collection
  - Castle building
  - Battles between players

### 5.5 Visual Style
- Medieval castle-building theme
- Distinct visual identity for each player (colors, castle styles)
- Animations that enhance but don't distract from gameplay
- Sound effects for key actions (optional, with mute capability)

## 6. Development Phases

### 6.1 Phase 1: Core Mechanics
- Basic board layout and visualization
- Player movement and turn management
- Space type implementation
- Resource collection and management

### 6.2 Phase 2: Player Interaction
- Battle mechanics
- Enemy territory interactions
- Castle building functionality
- Win condition detection

### 6.3 Phase 3: Polish & Enhancement
- Animations and visual effects
- Sound design
- UI/UX improvements
- Responsive design implementation

### 6.4 Phase 4: Testing & Refinement
- Balance testing
- Browser compatibility testing
- User experience testing
- Bug fixes and refinements

## 7. Future Enhancements (Post-MVP)

### 7.1 Potential Features
- Online multiplayer support
- AI opponents with adjustable difficulty
- Custom board layouts
- Achievement system
- Game statistics tracking
- Customizable game rules

## 8. Success Metrics

### 8.1 User Engagement
- Average session duration: 15+ minutes
- Game completion rate: >80%
- Return player rate: >40%

### 8.2 Technical Performance
- Load time under 3 seconds for 95% of users
- No game-breaking bugs
- Compatible across specified browsers and devices

## 9. Appendix

### 9.1 Original Game Rules Reference
The digital implementation must strictly adhere to the original board game rules as outlined in the rules document, including:
- Movement mechanics
- Resource collection values
- Castle building costs (10 stone per castle piece)
- Battle and gamble mechanics
- Win conditions (first to complete 5-piece castle and raise flag)

### 9.2 Glossary
- **Stone:** The primary resource collected by players
- **Castle Piece:** Components built using stone that make up a player's castle
- **Territory:** Board section belonging to a specific player
- **Battle:** Contest between players decided by die rolls