# pino-slack-webhook

🌲 Send message to Slack via webhook

## Installation

```console
npm i pino-slack-webhook
```

## Usage

```console
$ pino-slack-webhook --help
pino-slack-webhook [options]

Sending
  -m, --method
             [string] [choices: "POST", "PUT", "PATCH", "GET"] [default: "POST"]
      --url      url to send logs to                         [string] [required]
  -t, --timeout  timeout (in ms) to send logs in bucket that are not filled
                                                        [number] [default: 5000]

Basic Auth
  -u, --username  basic auth username                                   [string]
  -p, --password  basic auth password                                   [string]

Retry
  -r, --retries   number of retries to do if failure       [number] [default: 5]
  -i, --interval  interval (in ms) to retry sending if failure
                                                        [number] [default: 1000]

Slack
      --unfurlLinks  Enables or disables link unfurling
                                                      [boolean] [default: false]
      --unfurlMedia  Enables or disables media unfurling
                                                      [boolean] [default: false]
  -m, --mrkdwn       Enables or disables mrkdwn formatting
                                                       [string] [default: false]

Options:
      --help     Show help                                             [boolean]
      --version  Show version number                                   [boolean]
  -l, --log      log to console as well               [boolean] [default: false]
      --silent   silence pino-slack-webhook logs for failures and retries
                                                      [boolean] [default: false]
  -c, --config   path to json config                                    [string]
```

## Environment Variables

All options can be defined in the environment and are prefixed with `PINO_SLACK_WEBHOOK_`. All
camel-cased options are parsed with delimiters of `_`.

_e.g. The option `unfurlLinks` as an env var would be `PINO_SLACK_WEBHOOK_UNFURL_LINKS`._

## URL

**Example**

```console
node . | pino-slack-webhook --url=https://hooks.slack.com/services/xxx/xxx/xxx
```

## Body Type

- `ndjson` - New-line delimited JSON. See [ndjson](https://github.com/ndjson/ndjson-spec)
- `json` - Standard JSON sending of data. Logs are sent in the format of

  ```json
  {
    "logs": [...logs]
  }
  ```

## Auth

Currently only basic auth is implemented for the CLI usage. For header usage, you can see the API usage.

## API

You can also use this module as a [pino destination](https://github.com/pinojs/pino/blob/master/docs/api.md#destination).

This will use the same batching function like the CLI usage. If the batch length
is not reached within a certain time (`timeout`), it will auto "flush".

### `createWriteStream`

The options passed to this follow the same values as the CLI defined above.

| Property    | Type                    | Required/Default |
| ----------- | ----------------------- | ---------------- |
| url         | `string`                | REQUIRED         |
| log         | `boolean`               | false            |
| silent      | `boolean`               | false            |
| method      | `string`                | "POST"           |
| username    | `string`                |                  |
| password    | `string`                |                  |
| headers     | `Record<string,string>` |                  |
| retries     | `number`                | 5                |
| interval    | `number`                | 1000             |
| timeout     | `number`                | 5000             |
| unfurlLinks | `boolean`               | false            |
| unfurlMedia | `boolean`               | false            |
| mrkdwn      | `boolean`               | false            |
| config      | `string`                |                  |

```ts
import { createWriteStream } from 'pino-slack-webhook';

const stream = createWriteStream({
  url: 'https://hooks.slack.com/services/xxx/xxx/xxx',
});

const logger = pino(
  {
    level: 'info',
  },
  stream,
);

logger.info('test log!');
```
