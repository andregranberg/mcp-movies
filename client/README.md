# My Movies AI - MCP Client

This repository contains the client configuration for the MCP (Model Context Protocol) Movies server.

## Overview

This project uses the Qwen CLI with an MCP server to provide movie information tools. The MCP server can run either locally for development or on a Raspberry Pi for production.

## Repository Structure

- **MCP_CLIENT.md** - Documentation for client configuration and usage
- **MCP_SERVER.md** - Documentation for the remote server setup
- **.qwen/settings.json** - MCP server configuration (connects to Raspberry Pi)

## Server Locations

### Production Server
The MCP server runs on a Raspberry Pi with the following specifications:
- **IP Address**: 192.168.0.242
- **SSH User**: ay (no password required)
- **Port**: 3001
- **Path**: `/home/ay/apps/mcp-movies-server`

### Development Server
For local development, you can run the server on your local machine:
- **Address**: localhost
- **Port**: 3001

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

To use the MCP tools, you need to use the Qwen CLI with natural language prompts that will trigger the appropriate tools:

### Production Usage
To use the tools with the production server:

```bash
# Navigate to the client directory to use production settings
cd client

# List all movies (this will use the list_movies MCP tool)
qwen --prompt "List all movies in the database" --yolo

# Get information about a specific movie (this will use the get_movie_info MCP tool)
qwen --prompt "Get information about The Matrix movie" --yolo
```

### Development Usage
For local development:

1. Start the server locally: `cd ../server && npm run dev`
2. Use the Qwen CLI from the root directory (uses local settings):
   ```bash
   # List all movies
   qwen --prompt "List all movies in the database" --yolo
   
   # Get information about a specific movie
   qwen --prompt "Get information about The Matrix movie" --yolo
   
   # Add a new movie
   qwen --prompt "Add a movie called 'Pulp Fiction' released in 1994, directed by Quentin Tarantino, in the Crime Drama genre, with a rating of 8.9" --yolo
   ```

### How it works

When you use the Qwen CLI with prompts:
1. The CLI connects to the MCP server configured in `.qwen/settings.json`
2. The MCP server exposes the `list_movies` and `get_movie_info` tools
3. The Qwen model determines which tool to use based on your prompt
4. The tool is executed on the MCP server
5. Results are returned to the Qwen CLI and displayed

Note: The `--yolo` flag automatically accepts tool execution without confirmation. For interactive use, you can run `qwen` without flags and ask questions naturally.

## Documentation

For detailed information:
- See [MCP_CLIENT.md](MCP_CLIENT.md) for client configuration
- See [MCP_SERVER.md](MCP_SERVER.md) for server setup and management