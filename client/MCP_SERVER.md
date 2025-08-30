# MCP Movies Server

This is an MCP (Model Context Protocol) server that provides movie information tools, running on a Raspberry Pi 24/7.

## Server Setup

The server is installed on a Raspberry Pi with the following specifications:
- IP Address: 192.168.0.242
- Installation Path: `/home/ay/apps/mcp-movies-server`
- Port: 3001
- Transport: HTTP Streamable

## Server Components

1. **mcp-server-http.js** - Main HTTP server implementation using Express and MCP SDK
2. **package.json** - Dependencies and scripts
3. **node_modules/** - Installed dependencies

## Deployment

The server runs as a background process on the Raspberry Pi:

```bash
# SSH into the Raspberry Pi
ssh ay@192.168.0.242

# Navigate to the server directory
cd /home/ay/apps/mcp-movies-server

# Start the server (already configured to run in background)
# Server logs are in server.log
```

## Server Management

### Check if server is running:
```bash
ssh ay@192.168.0.242 "netstat -tulpn | grep :3001"
```

### View server logs:
```bash
ssh ay@192.168.0.242 "cd /home/ay/apps/mcp-movies-server && cat server.log"
```

### Restart server:
```bash
ssh ay@192.168.0.242 "cd /home/ay/apps/mcp-movies-server && pkill -f 'mcp-server-http.js' && nohup npm start > server.log 2>&1 &"
```

## Tools Provided

1. **list_movies** - Returns a list of all movies in the database
2. **get_movie_info** - Returns detailed information about a specific movie

## Security

- The server is configured with trust=true, bypassing confirmation prompts
- DNS rebinding protection is disabled for local network access
- No authentication required for local network access

## Network Configuration

- Binds to 0.0.0.0:3001 to accept connections from any interface
- Uses HTTP Streamable transport for efficient communication