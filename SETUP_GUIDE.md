# CASTLED Game - Setup and Running Guide

This guide provides detailed instructions for setting up and running the CASTLED board game on your local machine.

## Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Basic familiarity with command line/terminal
- Optional: A local web server (but we'll cover alternatives)

## Setup Options

There are multiple ways to run the CASTLED game locally. Choose the method that works best for you:

## Option 1: Direct File Opening (Simplest)

This is the simplest method but has some limitations with certain browsers' security policies.

### Steps:

1. Navigate to the game directory:
   ```
   cd path/to/Daves_Game
   ```

2. Open the index.html file directly in your browser:
   - Windows:
     ```
     start index.html
     ```
   - macOS:
     ```
     open index.html
     ```
   - Linux:
     ```
     xdg-open index.html
     ```

**Note**: Some browsers may restrict certain features (like localStorage for saving preferences) when running from a file:// URL.

## Option 2: Using Python's Built-in HTTP Server (Recommended)

Python includes a simple HTTP server that works well for local development.

### Steps:

1. Check if Python is installed:
   ```
   python --version
   ```
   or
   ```
   python3 --version
   ```

2. Navigate to the game directory:
   ```
   cd path/to/Daves_Game
   ```

3. Start the Python HTTP server:
   - Python 3:
     ```
     python -m http.server 8000
     ```
   - Python 2 (legacy):
     ```
     python -m SimpleHTTPServer 8000
     ```

4. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

5. To stop the server when finished, press `Ctrl+C` in the terminal.

## Option 3: Using Node.js http-server

If you have Node.js installed, you can use the http-server package.

### Steps:

1. Install http-server globally (if not already installed):
   ```
   npm install -g http-server
   ```

2. Navigate to the game directory:
   ```
   cd path/to/Daves_Game
   ```

3. Start the server:
   ```
   http-server -p 8000
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

5. To stop the server when finished, press `Ctrl+C` in the terminal.

## Option 4: Using Visual Studio Code Live Server

If you use Visual Studio Code, the Live Server extension provides an excellent development experience.

### Steps:

1. Install the "Live Server" extension in VS Code:
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "Live Server"
   - Click "Install"

2. Open the CASTLED game folder in VS Code:
   ```
   code path/to/Daves_Game
   ```

3. Right-click on `index.html` in the file explorer and select "Open with Live Server"

4. Your browser will automatically open with the game running

5. The server will automatically stop when you close VS Code or click the "Port: 5500" button in the status bar.

## Adding Background Music

To add background music to enhance your gaming experience:

1. Obtain a suitable MP3 file (medieval/fantasy themed music works best)

2. Rename it to `background-music.mp3`

3. Place it in the `audio` directory:
   ```
   cp your-music-file.mp3 path/to/Daves_Game/audio/background-music.mp3
   ```

## Troubleshooting

### Music Not Playing

- Some browsers block autoplay of audio until user interaction
- Click the sound icon (🔊) to start the music manually
- Check browser console for errors (F12 > Console)

### Game Not Loading Properly

- Try a different browser
- Ensure all files are in the correct directory structure
- Check browser console for JavaScript errors

### Server Port Already in Use

If you see an error like "port 8000 already in use":

1. Choose a different port number:
   ```
   python -m http.server 8080
   ```
   or
   ```
   http-server -p 8080
   ```

2. Then access the game at `http://localhost:8080`

## Conclusion

You should now have the CASTLED game running locally on your machine! Enjoy building your castle and competing against other players.

If you encounter any issues not covered in this guide, please refer to the README.md file for additional information or contact the development team.
