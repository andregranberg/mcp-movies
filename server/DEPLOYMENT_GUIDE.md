# Deployment Guide

This document explains how to deploy updates to the MCP Movies Server running on the Raspberry Pi.

## Overview

The MCP Movies Server runs on a Raspberry Pi at `192.168.0.242`. All development should be done on your main computer, and updates should be deployed by pulling changes from GitHub.

## Development Workflow

1. **Development**: Make changes on your main computer
2. **Commit and Push**: Commit changes to GitHub from your main computer
3. **Deploy**: Pull updates on the Raspberry Pi

## Deploying Updates

To deploy updates to the Raspberry Pi:

```bash
# SSH into the Raspberry Pi
ssh ay@192.168.0.242

# Navigate to the server directory
cd /home/ay/apps/mcp-movies-server

# Pull the latest changes
git pull origin main

# Restart the server if needed
pkill -f 'mcp-server-http.js'
nohup npm start > server.log 2>&1 &
```

## SSH Key Authentication

The Raspberry Pi uses SSH key authentication to pull from GitHub:
- SSH key: `~/.ssh/id_ed25519`
- GitHub repository: `git@github.com:andregranberg/mcp-movies-server.git`
- The key is read-only, which prevents accidental pushes from the Raspberry Pi

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

## Troubleshooting

### If git pull fails:
```bash
# Reset to match remote repository
git fetch origin
git reset --hard origin/main
```

### If server won't start:
1. Check logs: `cat server.log`
2. Check dependencies: `npm install`
3. Check port availability: `netstat -tulpn | grep :3001`