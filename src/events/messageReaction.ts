import { MessageReaction, User, PartialMessageReaction, PartialUser } from 'discord.js';

export async function handleReactionAdd(
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser
) {
  // Fetch partial data if needed
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error('Failed to fetch reaction:', error);
      return;
    }
  }

  // Ignore bot reactions
  if (user.bot) return;

  console.log(`[Reaction+] ${user.tag} added ${reaction.emoji.name} to message in ${reaction.message.guild?.name ?? 'DM'}`);

  // TODO: Add reaction-based features here
  // Example: role assignment, polls, etc.
}

export async function handleReactionRemove(
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser
) {
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error('Failed to fetch reaction:', error);
      return;
    }
  }

  if (user.bot) return;

  console.log(`[Reaction-] ${user.tag} removed ${reaction.emoji.name} from message in ${reaction.message.guild?.name ?? 'DM'}`);

  // TODO: Add reaction removal features here
}
