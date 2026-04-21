# n8n-nodes-newsmanapp

NewsMAN community node for n8n.

Use this node to manage subscribers and segments, send transactional emails, and send SMS through NewsMAN API v1.2.

## Features

- Lists: get available email and SMS lists
- Subscribers: get by email, create or update, add tags
- Segments: get segments, add subscriber to segment
- Transactional: send one message to many recipients in a single API call
- SMS: subscribe contacts and send one-off SMS messages

## Compatibility

- n8n: tested on self-hosted n8n 2.x
- Node.js: 22+ recommended for local development and publishing
- NewsMAN API: `https://ssl.newsman.app/api/1.2/rest/{userId}/{apiKey}/`

## Install

### n8n Community Nodes UI

Install package:

`n8n-nodes-newsmanapp`

### Manual / self-hosted

```bash
npm install n8n-nodes-newsmanapp
```

Then restart n8n.

## Credentials

Create **NewsMAN API** credentials in n8n:

- `User ID`
- `API Key`

## Quick Start

Example flow for transactional email:

1. Prepare recipient rows in a previous node (for example Edit Fields), one recipient per item:
   - `email` (required)
   - `name` (optional)
   - `params` (optional object)
2. Add **NewsMAN** node and choose **Send Transactional Message**.
3. Set **Recipients Source** to **From Previous Items (Single API Call)**.
4. Configure sender fields, subject, and HTML.
5. Execute the node.

## Transactional Recipients Modes

For **Send Transactional Message**, choose one mode:

- **From Previous Items (Single API Call)**: use all incoming items as recipients in one API call
- **From Expression (JSON Array)**: provide an expression that resolves to an array
- **Manual JSON**: provide the recipients array directly in the field

Recipient object format:

```json
{
  "email": "recipient@example.com",
  "name": "Recipient Name",
  "params": {
    "name": "Recipient Name"
  }
}
```

## Operations

### Lists

- `Get Lists` -> `list.all`
- `Get SMS Lists` -> `sms.lists`

### Subscribers

- `Get Subscriber` -> `subscriber.getByEmail`
- `Create or Update Subscriber` -> `subscriber.saveSubscribe`
- `Add Tag to Subscriber` -> `subscriber.addTag`
- `Create or Update SMS Subscriber` -> `sms.saveSubscribe`

### Segments

- `Get Segments` -> `segment.all`
- `Add Subscriber to Segment` -> `segment.addSubscriber`
- `Add Subscriber to Segment by Email` -> `subscriber.getByEmail` + `segment.addSubscriber`

### Messaging

- `Send Transactional Message` -> `transactional.messageSend`
- `Send SMS` -> `sms.sendone`

## Output Notes

- `Create or Update Subscriber` and `Create or Update SMS Subscriber` normalize scalar responses to:
  - `{ "subscriber_id": <id> }`
- `Add Tag to Subscriber` normalizes boolean responses to:
  - `{ "success": true | false }`

This helps downstream expressions like:

`{{$json.subscriber_id}}`

## Development

```bash
npm install
npm run lint
npm run build
```

## License

ISC

