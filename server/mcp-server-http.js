const express = require('express');
const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StreamableHTTPServerTransport } = require('@modelcontextprotocol/sdk/server/streamableHttp.js');
const { z } = require('zod');
const sqlite3 = require('sqlite3').verbose();

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

// Initialize SQLite database
const db = new sqlite3.Database('./movies.db');

// Create movies table if it doesn't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT UNIQUE NOT NULL,
    year INTEGER NOT NULL,
    director TEXT NOT NULL,
    genre TEXT NOT NULL,
    rating REAL NOT NULL
  )`);
  
  // Insert initial movies if table is empty
  const initializeMovies = () => {
    const initialMovies = [
      { title: 'The Matrix', year: 1999, director: 'The Wachowskis', genre: 'Science Fiction', rating: 8.7 },
      { title: 'Inception', year: 2010, director: 'Christopher Nolan', genre: 'Science Fiction', rating: 8.8 },
      { title: 'The Godfather', year: 1972, director: 'Francis Ford Coppola', genre: 'Crime Drama', rating: 9.2 }
    ];
    
    db.get("SELECT COUNT(*) as count FROM movies", (err, row) => {
      if (row.count === 0) {
        const stmt = db.prepare("INSERT INTO movies (title, year, director, genre, rating) VALUES (?, ?, ?, ?, ?)");
        initialMovies.forEach(movie => {
          stmt.run(movie.title, movie.year, movie.director, movie.genre, movie.rating);
        });
        stmt.finalize();
        console.log("Initialized database with default movies");
      }
    });
  };
  
  initializeMovies();
});

// Register a tool to add a new movie
server.registerTool(
  'add_movie',
  {
    description: 'Add a new movie to the database',
    inputSchema: {
      title: z.string().describe('The title of the movie'),
      year: z.number().describe('The release year of the movie'),
      director: z.string().describe('The director of the movie'),
      genre: z.string().describe('The genre of the movie'),
      rating: z.number().describe('The rating of the movie (0-10)'),
    },
  },
  async ({ title, year, director, genre, rating }) => {
    return new Promise((resolve, reject) => {
      // Check if movie already exists
      db.get("SELECT * FROM movies WHERE title = ?", [title], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (row) {
          resolve({
            content: [
              {
                type: 'text',
                text: `Movie "${title}" already exists in the database.`,
              },
            ],
          });
          return;
        }

        // Add the new movie
        db.run(
          "INSERT INTO movies (title, year, director, genre, rating) VALUES (?, ?, ?, ?, ?)",
          [title, year, director, genre, rating],
          function(err) {
            if (err) {
              reject(err);
              return;
            }
            
            resolve({
              content: [
                {
                  type: 'text',
                  text: `Movie "${title}" successfully added to the database.`,
                },
              ],
            });
          }
        );
      });
    });
  }
);

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
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM movies WHERE title = ?", [title], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (row) {
          return resolve({
            content: [
              {
                type: 'text',
                text: JSON.stringify(row, null, 2),
              },
            ],
          });
        } else {
          return resolve({
            content: [
              {
                type: 'text',
                text: `Movie "${title}" not found in the database.`,
              },
            ],
          });
        }
      });
    });
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
    return new Promise((resolve, reject) => {
      db.all("SELECT title FROM movies", [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        
        const movieList = rows.map(row => row.title);
        return resolve({
          content: [
            {
              type: 'text',
              text: JSON.stringify(movieList, null, 2),
            },
          ],
        });
      });
    });
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
const serverInstance = app.listen(PORT, HOST, () => {
  console.log(`MCP Movies Server running on http://${HOST}:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed.');
    }
    serverInstance.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  });
});