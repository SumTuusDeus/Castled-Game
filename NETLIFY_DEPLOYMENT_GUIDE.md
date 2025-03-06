# Deploying CASTLED Game to Netlify

This guide will help you successfully deploy your CASTLED game to Netlify.

## Prerequisites

- A GitHub account (recommended for easiest deployment)
- Your CASTLED game files ready for deployment
- A Netlify account (free tier is sufficient)

## Option 1: Deploy from GitHub (Recommended)

### Step 1: Prepare Your Repository

1. Create a new GitHub repository:
   - Go to [GitHub](https://github.com)
   - Click "New repository"
   - Name your repository (e.g., "castled-game")
   - Choose public or private
   - Click "Create repository"

2. Push your code to GitHub:
   ```bash
   # Navigate to your game directory
   cd path/to/Daves_Game
   
   # Initialize git repository (if not already done)
   git init
   
   # Add all files
   git add .
   
   # Commit changes
   git commit -m "Initial commit"
   
   # Add remote repository (replace with your repository URL)
   git remote add origin https://github.com/yourusername/castled-game.git
   
   # Push to GitHub
   git push -u origin main
   ```

### Step 2: Deploy to Netlify

1. Go to [Netlify](https://app.netlify.com/) and log in
2. Click "New site from Git"
3. Select "GitHub" as your Git provider
4. Authorize Netlify to access your GitHub account if prompted
5. Select your CASTLED game repository
6. Configure build settings:
   - Build command: Leave empty (no build required)
   - Publish directory: `.` (root directory)
7. Click "Deploy site"

## Option 2: Deploy via Direct Upload

If you prefer not to use GitHub, you can deploy directly:

1. Go to [Netlify](https://app.netlify.com/) and log in
2. Click "Sites" in the top navigation
3. Drag and drop your entire `Daves_Game` folder onto the designated area
   - **IMPORTANT**: Make sure to include all files, including the newly created `netlify.toml`

## Troubleshooting 404 Errors

If you're still experiencing 404 errors after deployment:

### 1. Check Your Site Structure

Ensure your site structure has:
- `index.html` at the root level
- All JavaScript files properly linked
- All CSS files properly linked
- All paths using relative references (not absolute)

### 2. Verify Netlify Configuration

1. Go to your Netlify dashboard
2. Select your site
3. Go to "Site settings" > "Build & deploy" > "Continuous deployment"
4. Check that:
   - Publish directory is set correctly (should be "." for the root)
   - Build command is empty (or appropriate if you have a build step)

### 3. Check for Case Sensitivity Issues

Netlify's servers are case-sensitive. Ensure that:
- All file references match the exact case of the actual files
- For example, if you reference `styles.css` but the file is named `Styles.css`, it will cause a 404

### 4. Add a _redirects File

If the `netlify.toml` doesn't resolve the issue, try adding a `_redirects` file:

1. Create a file named `_redirects` (no file extension) in your project root
2. Add the following line:
   ```
   /* /index.html 200
   ```
3. Deploy again

### 5. Check Browser Console for Errors

After deployment:
1. Visit your Netlify site
2. Open browser developer tools (F12)
3. Check the Console tab for any 404 errors
4. Fix any missing file references

### 6. Verify Asset Paths

Make sure all your asset paths are relative and correct:
- Use `./styles.css` instead of `/styles.css`
- Use `./js/game.js` instead of `/js/game.js`
- Avoid absolute paths that start with `/`

## After Successful Deployment

Once your site is deployed:
1. Netlify will provide you with a default URL (e.g., `random-name-123456.netlify.app`)
2. You can set up a custom domain in the Netlify settings if desired
3. Any changes pushed to your GitHub repository will automatically trigger a new deployment

## Adding Background Music for Production

For your background music to work in production:
1. Make sure the audio file is included in your deployment
2. Place it in the correct `audio` directory
3. Ensure the path in your HTML is correct: `./audio/background-music.mp3`

## Need More Help?

If you continue to experience issues, you can:
1. Check Netlify's deployment logs for specific errors
2. Use Netlify's support forums
3. Contact Netlify support directly

Remember that the free tier of Netlify has some limitations, but they should be more than sufficient for hosting your CASTLED game.
