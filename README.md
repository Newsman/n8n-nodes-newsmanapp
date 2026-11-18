# n8n-nodes-newsmanapp

NewsMAN community node for n8n.

Use this node to manage subscribers and segments, send transactional emails, and send SMS through NewsMAN API v2.

## Features

- Lists: get available email and SMS lists
- Subscribers: get by email, create or update, add tags
- Segments: get segments, add subscriber to segment
- Transactional: send one message to many recipients in a single API call
- SMS: subscribe contacts and send one-off SMS messages
- Feeds: product groups and products for draft Handlebars
- Drafts: get info and parse Handlebars HTML
- Newsletters: create, schedule, confirm / send confirm, set segments
- Composite **Schedule Automated Newsletter**: product groups map + subjects + optional CDN image rewrite + schedule

## Compatibility

- n8n: tested on self-hosted n8n 2.x
- Node.js: 22+ recommended for local development and publishing
- NewsMAN API: `https://api.newsman.app/v2/` (Bearer auth: `{userId}-{apiKey}`)
- Docs: https://api.newsman.app/docs/en

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

- `Get Lists` -> `GET /v2/list/all`
- `Get SMS Lists` -> `GET /v2/sms/lists`

### Subscribers

- `Get Subscriber` -> `GET /v2/subscriber/getByEmail`
- `Create or Update Subscriber` -> `POST /v2/subscriber/saveSubscribe`
- `Add Tag to Subscriber` -> `POST /v2/subscriber/addTag`
- `Create or Update SMS Subscriber` -> `POST /v2/sms/saveSubscribe`

### Segments

- `Get Segments` -> `GET /v2/segment/all`
- `Add Subscriber to Segment` -> `POST /v2/segment/addSubscriber`
- `Add Subscriber to Segment by Email` -> `GET /v2/subscriber/getByEmail` + `POST /v2/segment/addSubscriber`

### Messaging

- `Send Transactional Message` -> `POST /v2/transactional/messageSend`
- `Send SMS` -> `POST /v2/sms/sendone`

### Feeds / drafts / newsletters

- `Get Product Groups` -> `GET /v2/feeds/getProductGroups`
- `Get Product Group` -> `GET /v2/feeds/getProductGroup`
- `Get Product Group Products` -> `GET /v2/feeds/getProductGroupProducts`
- `Get Draft Info` -> `GET /v2/draft/getDraftInfo`
- `Parse Draft Handlebars` -> `POST /v2/draft/getParseDraftHTMLHandlebars`
- `Create Newsletter` -> `POST /v2/newsletter/create`
- `Schedule Newsletter` -> `POST /v2/newsletter/schedule`
- `Confirm Newsletter` -> `POST /v2/newsletter/confirm`
- `Send Newsletter Confirm` -> `POST /v2/newsletter/sendConfirm`
- `Send Newsletter Test` -> `POST /v2/newsletter/sendTest`
- `Set Newsletter Segments` -> `POST /v2/newsletter/setSegments`
- `Schedule Automated Newsletter` -> product groups + draft parse + create + schedule (+ optional confirm)

### Schedule Automated Newsletter

Typical setup:

1. `Get Lists` to pick a `list_id`
2. Configure **Product Groups Map JSON** (Handlebars key → product group / sub-feed id):

```json
{
  "noutati": "GROUP_ID_1",
  "recompense": "GROUP_ID_2"
}
```

3. Provide **Subjects JSON** (one subject is chosen at random)
4. Optional: website + CDN base URL (default `http://cdn.nzmt.eu/nzi`) and resize mode for product/banner images
5. Choose **Mode**:
   - **Preview HTML Only** (default): builds products + parses the draft and returns `html` / `subject` — no create, schedule, or confirm
   - **Preview & Send Test**: same as preview, then `newsletter.sendTest` to **Test Emails** (comma-separated; uses this node's client credentials)
   - **Schedule Newsletter**: full create + schedule + optional confirm
6. For schedule mode, choose **Post-Schedule Action**: None / Send Confirm Email / Confirm via API
7. Banner: None, Manual (`banner_src` / `banner_url`), or Brandfetch stub

`Shuffle Products` is optional (default off). `Max Products Per Group` defaults to 6; use `0` for no limit.

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

MIT

