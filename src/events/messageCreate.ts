import { Message } from 'discord.js';

export async function handleMessageCreate(message: Message) {
  // Ignore bot messages
  if (message.author.bot) return;

  // Log messages (for monitoring)
  const guildName = message.guild?.name ?? 'DM';
  console.log(`[${guildName}] ${message.author.tag}: ${message.content}`);

  // TODO: Add message-based features here
  // Example: respond to specific keywords, process commands, etc.
}
