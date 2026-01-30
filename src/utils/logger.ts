// Simple logger utility
// Can be expanded with more sophisticated logging (winston, pino, etc.)

export function log(message: string, level: 'info' | 'warn' | 'error' = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

  switch (level) {
    case 'error':
      console.error(`${prefix} ${message}`);
      break;
    case 'warn':
      console.warn(`${prefix} ${message}`);
      break;
    default:
      console.log(`${prefix} ${message}`);
  }
}

export function logInfo(message: string) {
  log(message, 'info');
}

export function logWarn(message: string) {
  log(message, 'warn');
}

export function logError(message: string) {
  log(message, 'error');
}
