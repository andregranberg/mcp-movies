const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { z } = require('zod');

// Create the server
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

// Set up the transport
async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

runServer().catch(console.error);