# MCP Movies Server

This is an MCP (Model Context Protocol) server that provides movie information tools, running 24/7 on a Raspberry Pi.

## Server Information

- IP Address: 192.168.0.242
- Installation Path: `/home/ay/apps/mcp-movies-server`
- Port: 3001
- Transport: HTTP Streamable

## Components

1. **mcp-server-http.js** - Main HTTP server implementation using Express and MCP SDK
2. **package.json** - Dependencies and scripts
3. **node_modules/** - Installed dependencies

## Starting the Server

### Development Mode
```bash
# Install dependencies (first time only)
npm install

# Start server in development mode (localhost only)
npm run dev
```

### Production Mode
```bash
# Start server in production mode (all interfaces)
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
3. **add_movie** - Adds a new movie to the database with title, year, director, genre, and rating

## Data Persistence

Currently, movie data is stored in memory and will be lost when the server restarts. This is suitable for development and testing but would need to be changed for production use.

## Development Workflow

1. **Development**: Make changes locally and test with `npm run dev`
2. **Commit and Push**: Commit changes to GitHub from your main computer
3. **Deploy**: Pull updates on the Raspberry Pi

### Environment Configuration

The server uses environment variables for configuration:
- `PORT`: Port to run the server on (default: 3001)
- `NODE_ENV`: Environment mode (development or production)
- `ENABLE_DNS_REBINDING_PROTECTION`: Enable DNS rebinding protection in production

Copy `.env.example` to `.env` and modify as needed for local development.

## Testing the Server

To test the MCP tools provided by this server:

1. Start the server in development mode:
   ```bash
   npm run dev
   ```

2. From the root of the repository, use the Qwen CLI to test the tools:
   ```bash
   # List all movies
   qwen --prompt "List all movies in the database" --yolo
   
   # Get information about a specific movie
   qwen --prompt "Get information about The Matrix movie" --yolo
   
   # Add a new movie
   qwen --prompt "Add a movie called 'Pulp Fiction' released in 1994, directed by Quentin Tarantino, in the Crime Drama genre, with a rating of 8.9" --yolo
   ```

The Qwen CLI will automatically connect to the server using the configuration in `.qwen/settings.json` and execute the appropriate MCP tools.

## Network Configuration

- In development mode, binds to `localhost` only
- In production mode, binds to `0.0.0.0` to accept connections from any interface
- Uses HTTP Streamable transport for efficient communication