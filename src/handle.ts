import { TransformCallback } from 'through2';

import { send } from './send';

/**
 * Handles a log in the stream pipeline.
 * @param log
 * @param callback
 */
export function handleLog(log: Record<string, unknown>, callback?: TransformCallback): void {
  send(log);

  callback?.();
}
