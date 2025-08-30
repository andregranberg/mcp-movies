# Development Guide

This document explains how to develop and test the MCP Movies server locally before deploying to the Raspberry Pi.

## Development Workflow

1. **Local Development**: Develop and test locally using `npm run dev`
2. **Testing**: Test with the Qwen CLI using the local configuration
3. **Commit**: Commit changes to Git
4. **Deploy**: Push to GitHub and deploy to the Raspberry Pi

## Local Development Setup

1. Install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Start the server in development mode:
   ```bash
   npm run dev
   ```
   
   This will:
   - Run the server on `localhost:3001`
   - Disable DNS rebinding protection
   - Use development environment settings

3. Test with the Qwen CLI:
   ```bash
   # From the root directory
   /list_movies
   /get_movie_info "The Matrix"
   ```

## Environment Variables

The server uses the following environment variables:

- `PORT`: Port to run the server on (default: 3001)
- `NODE_ENV`: Environment mode (`development` or `production`)
- `ENABLE_DNS_REBINDING_PROTECTION`: Enable DNS rebinding protection (default: false)

For local development, these are set in `server/.env`:
```bash
PORT=3001
NODE_ENV=development
ENABLE_DNS_REBINDING_PROTECTION=false
```

## Making Changes

1. Modify `server/mcp-server-http.js` to add new tools or modify existing ones
2. Test locally with `npm run dev`
3. Commit and push changes when ready

## Testing Tools

You can test your tools using the Qwen CLI:

```bash
# List all movies
/list_movies

# Get information about a specific movie
/get_movie_info "The Matrix"

# Test with a movie that doesn't exist
/get_movie_info "Non-existent Movie"
```

## Debugging

To view server logs during development:

```bash
# Start the server with logging
cd server
npm run dev 2>&1 | tee server.log
```

Or check the `server.log` file if running in the background.

## Deploying to Production

Once you've tested your changes locally:

1. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```

2. SSH into the Raspberry Pi and deploy:
   ```bash
   ssh ay@192.168.0.242
   cd /home/ay/apps/mcp-movies-server
   git pull origin main
   pkill -f 'mcp-server-http.js'
   nohup npm start > server.log 2>&1 &
   ```

## Best Practices

1. Always test locally before deploying
2. Use environment variables for configuration
3. Keep tools simple and focused
4. Handle errors gracefully
5. Log important events for debugging