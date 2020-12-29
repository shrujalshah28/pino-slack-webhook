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
  --method, -m
             [string] [choices: "POST", "PUT", "PATCH", "GET"] [default: "POST"]
  --bodyType, -b   type of body to send
                          [string] [choices: "json", "ndjson"] [default: "json"]
  --url            url to send logs to                       [string] [required]
  --timeout, -t    timeout (in ms) to send logs in bucket that are not filled
                                                        [number] [default: 5000]

Basic Auth
  --username, -u  basic auth username                                   [string]
  --password, -p  basic auth password                                   [string]

Retry
  --retries, -r   number of retries to do if failure       [number] [default: 5]
  --interval, -i  interval (in ms) to retry sending if failure
                                                        [number] [default: 1000]

Options:
  --help        Show help                                              [boolean]
  --version     Show version number                                    [boolean]
  --log, -l     log to console as well                [boolean] [default: false]
  --silent      silence pino-slack-webhook logs for failures and retries
                                                      [boolean] [default: false]
  --config, -c  path to json config                                     [string]
```

## Environment Variables

All options can be defined in the environment and are prefixed with `PINO_SLACK_WEBHOOK_`. All
camel-cased options are parsed with delimiters of `_`.

_e.g. The option `bodyType` as an env var would be `PINO_SLACK_WEBHOOK_BODY_TYPE`._

## URL

**Example**

```console
node . | pino-slack-webhook --url=http://localhost:8080
```

You can also do https...

```console
node . | pino-slack-webhook --url=https://myserver.com:8080
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

| Property | Type                    | Required/Default |
| -------- | ----------------------- | ---------------- |
| url      | `string`                | REQUIRED         |
| log      | `boolean`               | false            |
| silent   | `boolean`               | false            |
| method   | `string`                | "POST"           |
| bodyType | `string`                | "json"           |
| username | `string`                |                  |
| password | `string`                |                  |
| headers  | `Record<string,string>` |                  |
| retries  | `number`                | 5                |
| interval | `number`                | 1000             |
| timeout  | `number`                | 5000             |
| config   | `string`                |                  |

```ts
import { createWriteStream } from 'pino-slack-webhook';

const stream = createWriteStream({
  url: 'http://localhost:8080',
});

const logger = pino(
  {
    level: 'info',
  },
  stream,
);

logger.info('test log!');
```
