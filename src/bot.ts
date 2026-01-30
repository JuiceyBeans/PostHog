import { Client, GatewayIntentBits, Events, Partials } from 'discord.js';
import { handleMessageCreate } from './events/messageCreate.js';
import { handleReactionAdd, handleReactionRemove } from './events/messageReaction.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
  ],
});

export function startBot() {
  const token = process.env.DISCORD_TOKEN;

  if (!token) {
    console.error('DISCORD_TOKEN environment variable is not set!');
    process.exit(1);
  }

  // Ready event
  client.once(Events.ClientReady, (c) => {
    console.log(`Bot logged in as ${c.user.tag}`);
    console.log(`Serving ${c.guilds.cache.size} guild(s)`);
  });

  // Message events
  client.on(Events.MessageCreate, handleMessageCreate);

  // Reaction events
  client.on(Events.MessageReactionAdd, handleReactionAdd);
  client.on(Events.MessageReactionRemove, handleReactionRemove);

  // Error handling
  client.on('error', (error) => {
    console.error('Discord client error:', error);
  });

  process.on('unhandledRejection', (error) => {
    console.error('Unhandled rejection:', error);
  });

  // Login
  client.login(token);
}

export { client };
