import { readFileSync } from 'fs';
import yargs from 'yargs';

export type Args = {
  url: string;
  unfurlLinks?: boolean;
  unfurlMedia?: boolean;
  mrkdwn?: boolean;
  log?: boolean;
  silent?: boolean;
  method?: string;
  username?: string;
  password?: string;
  headers?: Record<string, string>;
  retries?: number;
  interval?: number;
  timeout?: number;
  config?: string;
};

/**
 * Used with API and not with CLI...
 */
const defaultArgs: Args = {
  log: false,
  silent: true,
  method: 'POST',
  url: '',
  retries: 5,
  interval: 1000,
  timeout: 5000,
  unfurlLinks: false,
  unfurlMedia: false,
  mrkdwn: false,
};

export let args: Args;

/**
 * On demand loading of args since CLI would conflict with the loading of these.
 */
export function loadArgs(): Args {
  args = yargs
    .usage('pino-slack-webhook [options]')
    .env('PINO_SLACK_WEBHOOK')
    .option('log', {
      alias: 'l',
      type: 'boolean',
      desc: 'log to console as well',
      default: false,
    })
    .option('silent', {
      type: 'boolean',
      desc: 'silence pino-slack-webhook logs for failures and retries',
      default: false,
    })
    .option('method', {
      alias: 'm',
      type: 'string',
      choices: ['POST', 'PUT', 'PATCH', 'GET'],
      group: 'Sending',
      default: 'POST',
    })
    .option('url', {
      type: 'string',
      require: true,
      group: 'Sending',
      desc: 'url to send logs to',
    })
    .option('username', {
      alias: 'u',
      type: 'string',
      desc: 'basic auth username',
      group: 'Basic Auth',
    })
    .option('password', {
      alias: 'p',
      type: 'string',
      desc: 'basic auth password',
      group: 'Basic Auth',
    })
    .option('retries', {
      alias: 'r',
      type: 'number',
      desc: 'number of retries to do if failure',
      group: 'Retry',
      default: 5,
    })
    .option('interval', {
      alias: 'i',
      type: 'number',
      desc: 'interval (in ms) to retry sending if failure',
      group: 'Retry',
      default: 1000,
    })
    .option('timeout', {
      alias: 't',
      type: 'number',
      desc: 'timeout (in ms) to send logs in bucket that are not filled',
      group: 'Sending',
      default: 5000,
    })
    .option('unfurlLinks', {
      type: 'boolean',
      desc: 'Enables or disables link unfurling',
      group: 'Slack',
      default: false,
    })
    .option('unfurlMedia', {
      type: 'boolean',
      desc: 'Enables or disables media unfurling',
      group: 'Slack',
      default: false,
    })
    .option('mrkdwn', {
      alias: 'm',
      type: 'boolean',
      desc: 'Enables or disables mrkdwn formatting',
      group: 'Slack',
      default: false,
    })
    .option('config', {
      alias: 'c',
      type: 'string',
      desc: 'path to json config',
      config: true,
      configParser: path => JSON.parse(readFileSync(path, 'utf8')),
    })
    .parse();

  return args;
}

/**
 * Sets args to passed in values defaulting to above defaults.
 * Used in CLI ONLY.
 * @param newArgs
 */
export function setArgs(newArgs: Partial<Args>): void {
  args = {
    ...defaultArgs,
    ...newArgs,
  };
}
