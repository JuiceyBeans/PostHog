# PostHog Discord Bot

## Project Overview

This is a TypeScript Discord bot developed **entirely by Claude** (AI). There is no human code contribution to this project - the human role is limited to PR review only.

## Development Workflow

1. **Claude** is the lead developer and writes all code
2. **All changes** must go through a Pull Request
3. **Human** reviews and merges PRs - no direct commits
4. Use **beads** (`bd`) for task/feature tracking

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Discord Library**: discord.js
- **Task Tracking**: beads (`bd`)
- **Hosting**: Render (free tier)
- **CI/CD**: GitHub Actions + Render auto-deploy

## Environment Variables

Required in `.env` (never commit this file):

```
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_application_client_id
```

Optional:
```
PORT=3000  # Health server port for Render keep-alive
```

## Running Locally

```bash
# Install dependencies
npm install

# Development mode (with hot reload)
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

## Beads Commands

```bash
# See tasks ready to work on
bd ready

# Create a new task
bd create "Task title" -p 1

# Show task details
bd show <task-id>
```

## Project Structure

```
PostHog/
├── .beads/           # Task tracking data
├── .github/workflows # CI/CD
├── docs/             # Documentation
├── src/
│   ├── index.ts      # Entry point
│   ├── bot.ts        # Discord client
│   ├── events/       # Event handlers
│   ├── commands/     # Slash commands
│   └── utils/        # Utilities
├── .env              # Secrets (gitignored)
├── .env.example      # Template
├── render.yaml       # Deployment config
└── tsconfig.json     # TypeScript config
```

## Discord Developer Console Setup

Before the bot works, enable these in Discord Developer Portal:

1. Go to https://discord.com/developers/applications
2. Select your application → Bot tab
3. Enable **MESSAGE CONTENT INTENT**
4. Enable **SERVER MEMBERS INTENT** (if needed)

## PR Guidelines

When creating PRs:

1. Reference the bead ID if applicable
2. Include a clear summary of changes
3. Add test plan or verification steps
4. Keep PRs focused on single features/fixes
