import { TransformCallback } from 'through2';

// import { args } from './args';
import { send } from './send';

// let batch: Record<string, unknown>[] = [];
// let timeoutId: number;

/**
 * Sends the batch and then clears it.
 */
// function sendAndClear() {
//   send([...batch]);

//   batch = [];
// }

/**
 * Handles a log in the stream pipeline. It manages a timeout to "flush" logs
 * that haven't filled up the batch size to send.
 * @param log
 * @param callback
 */
export function handleLog(log: Record<string, unknown>, callback?: TransformCallback): void {
  send([log]);

  callback?.();

  // clearTimeout(timeoutId);

  // batch.push(log);

  // if (batch.length === args.batchSize) {
  //   sendAndClear();

  //   callback?.();
  // } else {
  //   timeoutId = setTimeout(sendAndClear, args.timeout);

  //   callback?.();
  // }
}
