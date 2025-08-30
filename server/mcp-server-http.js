const express = require('express');
const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StreamableHTTPServerTransport } = require('@modelcontextprotocol/sdk/server/streamableHttp.js');
const { z } = require('zod');

// Load environment variables
require('dotenv').config();

// Create Express app
const app = express();
app.use(express.json());

// Create the MCP server
const server = new McpServer({
  name: 'my-movies-ai-mcp-server',
  version: '1.0.0',
});

// Register a simple tool to get movie information
server.registerTool(
  'get_movie_info',
  {
    description: 'Get information about a movie',
    inputSchema: {
      title: z.string().describe('The title of the movie'),
    },
  },
  async ({ title }) => {
    // This is a mock implementation - in a real server, you would connect to a database or API
    const movies = {
      'The Matrix': {
        title: 'The Matrix',
        year: 1999,
        director: 'The Wachowskis',
        genre: 'Science Fiction',
        rating: 8.7,
      },
      'Inception': {
        title: 'Inception',
        year: 2010,
        director: 'Christopher Nolan',
        genre: 'Science Fiction',
        rating: 8.8,
      },
      'The Godfather': {
        title: 'The Godfather',
        year: 1972,
        director: 'Francis Ford Coppola',
        genre: 'Crime Drama',
        rating: 9.2,
      },
    };

    const movie = movies[title];
    if (movie) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(movie, null, 2),
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: 'text',
            text: `Movie "${title}" not found in the database.`,
          },
        ],
      };
    }
  }
);

// Register another tool to list all movies
server.registerTool(
  'list_movies',
  {
    description: 'List all movies in the database',
    inputSchema: {},
  },
  async () => {
    const movieList = [
      'The Matrix',
      'Inception',
      'The Godfather',
    ];
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(movieList, null, 2),
        },
      ],
    };
  }
);

// Store transports for session management
const transports = {};

// Handle MCP requests
app.all('/mcp', async (req, res) => {
  // Check for existing session ID
  const sessionId = req.headers['mcp-session-id'];
  let transport;

  if (sessionId && transports[sessionId]) {
    // Reuse existing transport
    transport = transports[sessionId];
  } else {
    // Create new transport
    transport = new StreamableHTTPServerTransport({
      onsessioninitialized: (newSessionId) => {
        transports[newSessionId] = transport;
      },
      enableDnsRebindingProtection: process.env.ENABLE_DNS_REBINDING_PROTECTION === 'true',
    });

    // Clean up transport when closed
    transport.onclose = () => {
      if (transport.sessionId) {
        delete transports[transport.sessionId];
      }
    };

    // Connect the MCP server to the transport
    await server.connect(transport);
  }

  // Handle the request
  await transport.handleRequest(req, res, req.body);
});

const PORT = process.env.PORT || 3001;
const HOST = process.env.NODE_ENV === 'development' ? 'localhost' : '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`MCP Movies Server running on http://${HOST}:${PORT}`);
});