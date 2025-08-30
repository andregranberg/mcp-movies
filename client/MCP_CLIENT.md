# MCP Movies Client Configuration

This document explains how to configure and use the MCP Movies server from your local machine.

## Configuration

### Production Configuration
The production client configuration is stored in `client/.qwen/settings.json` and specifies how to connect to the remote MCP server on the Raspberry Pi:

```json
{
  "mcpServers": {
    "myMoviesAI": {
      "httpUrl": "http://192.168.0.242:3001/mcp",
      "timeout": 30000,
      "trust": true
    }
  }
}
```

### Development Configuration
For local development, a separate configuration exists in the root `.qwen/settings.json` that connects to a locally running server:

```json
{
  "mcpServers": {
    "myMoviesAI": {
      "httpUrl": "http://localhost:3001/mcp",
      "timeout": 30000,
      "trust": true
    }
  }
}
```

## Connection Details

### Production
- **Server Address**: http://192.168.0.242:3001/mcp
- **Transport Type**: HTTP Streamable
- **Timeout**: 30 seconds
- **Trust**: Enabled (no confirmation prompts)

### Development
- **Server Address**: http://localhost:3001/mcp
- **Transport Type**: HTTP Streamable
- **Timeout**: 30 seconds
- **Trust**: Enabled (no confirmation prompts)

## Raspberry Pi Access

The MCP server runs on a Raspberry Pi that is accessible via SSH:

- **IP Address**: 192.168.0.242
- **SSH User**: ay
- **Authentication**: No password required (key-based authentication)

To access the Raspberry Pi:
```bash
ssh ay@192.168.0.242
```

Server files are located at: `/home/ay/apps/mcp-movies-server`

## Available Tools

Once connected, the following tools are available:

1. **list_movies** - Lists all movies in the database
   - Usage: `/list_movies`

2. **get_movie_info** - Gets detailed information about a specific movie
   - Usage: `/get_movie_info "Movie Title"`

## Testing the Connection

### Production Testing
You can verify the production connection using the Qwen CLI:

```bash
# Navigate to client directory
cd client

# List all configured MCP servers and their status
qwen mcp list

# Test the list_movies tool
echo "/list_movies" | qwen

# Test the get_movie_info tool
echo "/get_movie_info The Matrix" | qwen
```

### Development Testing
For local development testing:

```bash
# Start the server in development mode (in another terminal)
cd ../server && npm run dev

# Test from the root directory (uses local settings)
/list_movies
/get_movie_info "The Matrix"
```

## Troubleshooting

### Server Not Connected
- Verify the Raspberry Pi is powered on and connected to the network
- Check if the server is running: `ssh ay@192.168.0.242 "netstat -tulpn | grep :3001"`
- Restart the server if needed

### Tools Not Responding
- Check server logs: `ssh ay@192.168.0.242 "cd /home/ay/apps/mcp-movies-server && cat server.log"`
- Verify network connectivity: `ping 192.168.0.242`

## Security Notes

- The server is configured as trusted, so all tool calls are executed without confirmation
- This is acceptable for local network access but should be reviewed for other environments