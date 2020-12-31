import got, { Method } from 'got';

import { args, SlackPayload } from './args';
import { logError, logWarn } from './log';

export type Body = {
  json: SlackPayload;
};

export function createBody(log: Record<string, unknown>): Body {
  const { unfurlLinks = false, unfurlMedia = false, mrkdwn = false, format } = args;

  const payload: SlackPayload = {
    unfurl_links: unfurlLinks,
    unfurl_media: unfurlMedia,
    mrkdwn: mrkdwn,
    text: `${log.level}: ${log.msg}`,
  };

  if (format && typeof format === 'function') {
    const layout = format(log);

    // Note: Supplying `text` when `blocks` is also supplied will cause `text`
    // to be used as a fallback for clients/surfaces that don't suopport blocks
    payload.text = layout.text ?? undefined;
    payload.attachments = layout.attachments ?? undefined;
    payload.blocks = layout.blocks ?? undefined;
  }

  return { json: payload };
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
