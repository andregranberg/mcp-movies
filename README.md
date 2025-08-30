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

## SSH Access

To access the Raspberry Pi server:
```bash
ssh ay@192.168.0.242
```

No password is required for this connection.

## Available Tools

1. **list_movies** - Lists all movies in the database
2. **get_movie_info** - Gets detailed information about a specific movie

## Usage

To use the tools, simply use the Qwen CLI:

```bash
# List all movies
/list_movies

# Get information about a specific movie
/get_movie_info "The Matrix"
```

## Deployment

To deploy updates to the Raspberry Pi:

1. Make changes on your local machine
2. Commit and push to GitHub
3. SSH into the Raspberry Pi and pull the latest changes
4. Restart the server if needed

```bash
# On the Raspberry Pi
cd /path/to/mcp-movies
git pull origin main
cd server
pkill -f 'mcp-server-http.js'
npm start
```