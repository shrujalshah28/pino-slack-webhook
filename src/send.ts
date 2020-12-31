import got, { Method } from 'got';

import { args } from './args';
import { logError, logWarn } from './log';

export type Body = {
  json: {
    // eslint-disable-next-line camelcase
    unfurl_links: boolean;
    // eslint-disable-next-line camelcase
    unfurl_media: boolean;
    mrkdwn: boolean;
    text: string | unknown;
  };
};

export function createBody(log: Record<string, unknown>): Body {
  const { unfurlLinks = false, unfurlMedia = false, mrkdwn = false } = args;

  const json = {
    unfurl_links: unfurlLinks,
    unfurl_media: unfurlMedia,
    mrkdwn: mrkdwn,
    text: log.msg,
  };

  return { json };
}

export function send(log: Record<string, unknown>, numRetries = 0): void {
  const {
    url,
    method,
    username,
    password,
    headers = {},
    retries = 5,
    interval = 1000,
    silent = false,
  } = args;

  const limitHit = numRetries === retries;

  // fire and forget so we don't await or anything
  got(url, {
    method: method as Method,
    username,
    password,
    headers,
    allowGetBody: true,
    ...createBody(log),
  })
    .then()
    .catch(err => {
      if (!silent) {
        logError(err, limitHit ? null : `...retrying in ${interval}ms`);
      }

      if (limitHit) {
        if (!silent) {
          // make sure to stringify to get the whole thing, e.g. don't want
          // cutoffs on deep objects...
          logWarn(`max retries hit (${retries}). dropping logs:`, JSON.stringify(log));
        }

        return;
      }

      numRetries++;

      setTimeout(() => send(log, numRetries), interval);
    });
}
