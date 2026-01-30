# Discord API Reference

This document compiles Discord API information, code examples, and best practices for the PostHog bot project.

## Table of Contents
- [Library: discord.js](#library-discordjs)
- [Discord Developer Portal Setup](#discord-developer-portal-setup)
- [Gateway Intents](#gateway-intents)
- [Code Examples](#code-examples)
- [Best Practices](#best-practices)
- [Useful Links](#useful-links)

---

## Library: discord.js

**discord.js** is the primary library for building Discord bots with Node.js/TypeScript.

### Installation
```bash
npm install discord.js
npm install dotenv  # for environment variables
```

### Key Features
- Object-oriented API
- Full TypeScript support
- Supports all Discord API features
- Active community and maintenance

### Documentation
- Official docs: https://discord.js.org/
- Guide: https://discordjs.guide/

---

## Discord Developer Portal Setup

### Creating a Bot Application

1. Go to https://discord.com/developers/applications
2. Click "New Application" and name it
3. Go to **Bot** tab → Click "Add Bot"
4. Click "Reset Token" to get your bot token
5. **Store token securely** - never commit to git!

### Enabling Privileged Intents

In the Bot tab, enable these under "Privileged Gateway Intents":

| Intent | Purpose | Required For |
|--------|---------|--------------|
| MESSAGE CONTENT | Read message text | Message monitoring |
| SERVER MEMBERS | Access member info | Member tracking |
| PRESENCE | See user online status | Status features |

### Generating Invite URL

1. Go to **OAuth2** → **URL Generator**
2. Select scopes: `bot`, `applications.commands`
3. Select bot permissions:
   - Send Messages
   - Read Message History
   - Add Reactions
   - Use Slash Commands
   - Embed Links
   - Attach Files
4. Copy URL and visit to invite bot

---

## Gateway Intents

Intents control what events your bot receives. Only enable what you need.

### Required for PostHog Bot
```typescript
import { GatewayIntentBits } from 'discord.js';

const intents = [
  GatewayIntentBits.Guilds,              // Server info
  GatewayIntentBits.GuildMessages,       // Message events
  GatewayIntentBits.MessageContent,      // Read message content (PRIVILEGED)
  GatewayIntentBits.GuildMessageReactions, // Reaction events
  GatewayIntentBits.DirectMessages,      // DM support
];
```

### Partials (for reaction events on uncached messages)
```typescript
import { Partials } from 'discord.js';

const partials = [
  Partials.Message,
  Partials.Channel,
  Partials.Reaction,
];
```

---

## Code Examples

### Basic Bot Setup
```typescript
import { Client, GatewayIntentBits, Events } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

client.once(Events.ClientReady, (c) => {
  console.log(`Bot logged in as ${c.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
```

### Message Monitoring
```typescript
client.on(Events.MessageCreate, async (message) => {
  // Ignore bot messages
  if (message.author.bot) return;

  // Log message
  console.log(`[${message.guild?.name}] ${message.author.tag}: ${message.content}`);

  // Respond to specific content
  if (message.content.toLowerCase().includes('hello bot')) {
    await message.reply('Hello!');
  }
});
```

### Sending Messages
```typescript
// Reply to a message
await message.reply('This is a reply!');

// Send to specific channel
const channel = await client.channels.fetch('CHANNEL_ID');
if (channel?.isTextBased()) {
  await channel.send('Hello channel!');
}

// Send with embed
import { EmbedBuilder } from 'discord.js';

const embed = new EmbedBuilder()
  .setColor(0x0099ff)
  .setTitle('Embed Title')
  .setDescription('Embed description')
  .addFields(
    { name: 'Field 1', value: 'Value 1', inline: true },
    { name: 'Field 2', value: 'Value 2', inline: true },
  )
  .setTimestamp();

await message.reply({ embeds: [embed] });
```

### Adding Reactions
```typescript
// Add emoji reactions
await message.react('👍');
await message.react('❤️');

// Add custom emoji (by ID)
const emoji = message.guild?.emojis.cache.get('EMOJI_ID');
if (emoji) await message.react(emoji);
```

### Handling Reaction Events
```typescript
import { Partials } from 'discord.js';

// Enable partials in client config for uncached messages
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.on(Events.MessageReactionAdd, async (reaction, user) => {
  // Fetch partial data if needed
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error('Failed to fetch reaction:', error);
      return;
    }
  }

  console.log(`${user.tag} reacted with ${reaction.emoji.name}`);
});

client.on(Events.MessageReactionRemove, async (reaction, user) => {
  if (reaction.partial) await reaction.fetch();
  console.log(`${user.tag} removed ${reaction.emoji.name}`);
});
```

### Awaiting Reactions (Polls/Confirmations)
```typescript
const filter = (reaction, user) => {
  return ['👍', '👎'].includes(reaction.emoji.name) &&
         user.id === message.author.id;
};

try {
  const collected = await message.awaitReactions({
    filter,
    max: 1,
    time: 60000, // 60 seconds
    errors: ['time'],
  });

  const reaction = collected.first();
  if (reaction?.emoji.name === '👍') {
    await message.reply('You voted yes!');
  } else {
    await message.reply('You voted no!');
  }
} catch {
  await message.reply('No reaction received in time.');
}
```

### Slash Commands
```typescript
import { SlashCommandBuilder, REST, Routes } from 'discord.js';

// Define command
const pingCommand = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with Pong!');

// Register commands (run once)
const rest = new REST().setToken(process.env.DISCORD_TOKEN!);
await rest.put(
  Routes.applicationCommands(process.env.CLIENT_ID!),
  { body: [pingCommand.toJSON()] }
);

// Handle command
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});
```

---

## Best Practices

### Security
- **Never hardcode tokens** - Use environment variables
- **gitignore .env files** - Prevent accidental commits
- **Minimize permissions** - Request only what you need
- **Validate user input** - Sanitize before using

### Performance
- **Enable only needed intents** - Reduces bandwidth
- **Use partials wisely** - Only for required features
- **Cache appropriately** - Avoid excessive API calls
- **Use slash commands** - Better than prefix commands for rate limits

### Code Quality
- **Handle errors** - Wrap API calls in try-catch
- **Use TypeScript** - Better type safety
- **Modular structure** - Separate events, commands, utils
- **Don't block** - Use async/await properly

### Rate Limits
- Discord rate limits API calls
- Group operations when possible
- Add delays between bulk operations
- discord.js handles most limits automatically

### Interaction Timing
- Initial response within 3 seconds
- Use `deferReply()` for long operations
- Deferred replies valid for 15 minutes
- Use `ephemeral: true` for private responses

---

## Useful Links

### Official Resources
- Discord.js Documentation: https://discord.js.org/
- Discord.js Guide: https://discordjs.guide/
- Discord Developer Portal: https://discord.com/developers/applications
- Discord API Documentation: https://discord.com/developers/docs

### GitHub Repositories
- discord.js: https://github.com/discordjs/discord.js
- discordx (decorators): https://github.com/discordx-ts/discordx
- TypeScript Template: https://github.com/KevinNovak/Discord-Bot-TypeScript-Template

### Community
- Discord.js Discord Server: https://discord.gg/djs
- Discord Developers Server: https://discord.gg/discord-developers
