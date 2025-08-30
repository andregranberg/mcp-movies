# MCP Movies

This repository contains both the client and server components for the MCP Movies system.

## Overview

This project uses the Qwen CLI with an MCP server to provide movie information tools. The MCP server runs on a Raspberry Pi 24/7.

## Repository Structure

- **client/** - Client configuration and documentation
- **server/** - Server implementation and deployment files

## Setup

### Client Setup

1. Clone this repository to your local machine
2. Configure the MCP server connection in `client/.qwen/settings.json`
3. Use the Qwen CLI to interact with the tools

### Server Setup

1. Clone this repository to your Raspberry Pi
2. Install dependencies: `cd server && npm install`
3. Start the server: `npm start`
4. The server will run on port 3001

## Development Workflow

For local development and testing:

1. Install dependencies: `cd server && npm install`
2. Start the server in development mode: `npm run dev`
3. Test locally using the Qwen CLI with the local settings in `.qwen/settings.json`
4. Make changes and test iteratively
5. Commit and push to GitHub when ready
6. Deploy to the Raspberry Pi

## SSH Access

To access the Raspberry Pi server:
```bash
ssh ay@192.168.0.242
```

No password is required for this connection.

## Available Tools

1. **list_movies** - Lists all movies in the database
2. **get_movie_info** - Gets detailed information about a specific movie
3. **add_movie** - Adds a new movie to the database (Note: Data is stored in memory and will be lost when the server restarts)

## Usage

To use the tools, you need to use the Qwen CLI with prompts that will trigger the MCP tools:

```bash
# List all movies (using the list_movies MCP tool)
qwen --prompt "List all movies in the database" --yolo

# Get information about a specific movie (using the get_movie_info MCP tool)
qwen --prompt "Get information about The Matrix movie" --yolo

# Add a new movie (using the add_movie MCP tool)
qwen --prompt "Add a movie called 'Pulp Fiction' released in 1994, directed by Quentin Tarantino, in the Crime Drama genre, with a rating of 8.9" --yolo
```

Note: The `--yolo` flag automatically accepts tool execution without confirmation. For interactive use, you can run `qwen` without flags and ask questions naturally.

Note: The `--yolo` flag automatically accepts tool execution without confirmation. For interactive use, you can run `qwen` without flags and ask questions naturally.

### Data Persistence

Currently, movie data is stored in memory and will be lost when the server restarts. This is suitable for development and testing but would need to be changed for production use.

### How it works

When you use the Qwen CLI with prompts:
1. The CLI connects to the MCP server configured in `.qwen/settings.json`
2. The MCP server exposes the `list_movies` and `get_movie_info` tools
3. The Qwen model determines which tool to use based on your prompt
4. The tool is executed on the MCP server
5. Results are returned to the Qwen CLI and displayed

## Deployment

To deploy updates to the Raspberry Pi:

1. Make changes on your local machine
2. Test locally with `npm run dev`
3. Commit and push to GitHub
4. SSH into the Raspberry Pi and pull the latest changes
5. Restart the server if needed

```bash
# On the Raspberry Pi
cd /path/to/mcp-movies
git pull origin main
cd server
pkill -f 'mcp-server-http.js'
npm start
```