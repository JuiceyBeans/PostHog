import { Message } from 'discord.js';
import { findMatchingTrigger, getRandomResponse } from '../config/triggers.js';

export async function handleMessageCreate(message: Message) {
  // Ignore bot messages
  if (message.author.bot) return;

  // Log messages (for monitoring)
  const guildName = message.guild?.name ?? 'DM';
  console.log(`[${guildName}] ${message.author.tag}: ${message.content}`);

  // Check for substring triggers
  const trigger = findMatchingTrigger(message.content, message.channelId);
  if (trigger) {
    const response = getRandomResponse(trigger);
    console.log(`[Trigger] Matched "${trigger.id}" - responding with: ${response}`);
    await message.reply(response);
  }
}
