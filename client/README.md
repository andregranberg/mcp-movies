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

## Usage

### Production Usage
To use the tools with the production server, simply use the Qwen CLI:

```bash
# List all movies
/list_movies

# Get information about a specific movie
/get_movie_info "The Matrix"
```

### Development Usage
For local development:

1. Start the server locally: `cd ../server && npm run dev`
2. Use the Qwen CLI with the local settings in the root `.qwen/settings.json`:
   ```bash
   # List all movies
   /list_movies
   
   # Get information about a specific movie
   /get_movie_info "The Matrix"
   ```

## Documentation

For detailed information:
- See [MCP_CLIENT.md](MCP_CLIENT.md) for client configuration
- See [MCP_SERVER.md](MCP_SERVER.md) for server setup and management