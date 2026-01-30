import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

export interface Trigger {
  id: string;
  enabled: boolean;
  channelIds: string[];  // Empty array = all channels
  substring: string;
  caseSensitive: boolean;
  responses: string[];
}

interface TriggersConfig {
  triggers: Trigger[];
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let triggersConfig: TriggersConfig | null = null;

export function loadTriggers(): Trigger[] {
  if (!triggersConfig) {
    const configPath = join(__dirname, 'triggers.json');
    const raw = readFileSync(configPath, 'utf-8');
    triggersConfig = JSON.parse(raw) as TriggersConfig;
  }
  return triggersConfig.triggers;
}

export function findMatchingTrigger(
  content: string,
  channelId: string
): Trigger | null {
  const triggers = loadTriggers();

  for (const trigger of triggers) {
    if (!trigger.enabled) continue;

    // Check channel restriction (empty array = all channels)
    if (trigger.channelIds.length > 0 && !trigger.channelIds.includes(channelId)) {
      continue;
    }

    // Check substring match
    const haystack = trigger.caseSensitive ? content : content.toLowerCase();
    const needle = trigger.caseSensitive ? trigger.substring : trigger.substring.toLowerCase();

    if (haystack.includes(needle)) {
      return trigger;
    }
  }

  return null;
}

export function getRandomResponse(trigger: Trigger): string {
  const index = Math.floor(Math.random() * trigger.responses.length);
  return trigger.responses[index];
}
