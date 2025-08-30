# MCP Movies Server

This is an MCP (Model Context Protocol) server that provides movie information tools, running 24/7 on a Raspberry Pi.

## Server Information

- **IP Address**: 192.168.0.242
- **SSH User**: ay (no password required)
- **Installation Path**: `/home/ay/apps/mcp-movies-server`
- **Port**: 3001
- **Transport**: HTTP Streamable

## SSH Access

To access the Raspberry Pi:
```bash
ssh ay@192.168.0.242
```

No password is required for this connection.

## Components

1. **mcp-server-http.js** - Main HTTP server implementation using Express and MCP SDK
2. **package.json** - Dependencies and scripts
3. **node_modules/** - Installed dependencies

## Starting the Server

The server is configured to run automatically as a background process. To manually start it:

```bash
cd /home/ay/apps/mcp-movies-server
npm start
```

## Server Management

### Check if server is running:
```bash
netstat -tulpn | grep :3001
```

### View server logs:
```bash
cd /home/ay/apps/mcp-movies-server
cat server.log
```

### Restart server:
```bash
cd /home/ay/apps/mcp-movies-server
pkill -f 'mcp-server-http.js'
nohup npm start > server.log 2>&1 &
```

## Tools Provided

1. **list_movies** - Returns a list of all movies in the database
2. **get_movie_info** - Returns detailed information about a specific movie

## Development

To update the server code:
1. Modify mcp-server-http.js
2. Restart the server

## Network Configuration

- Binds to 0.0.0.0:3001 to accept connections from any interface
- Uses HTTP Streamable transport for efficient communication

## GitHub Repository

This code is also available at: https://github.com/andregranberg/mcp-movies-server