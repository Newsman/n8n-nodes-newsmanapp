# n8n-nodes-newsmanapp

NewsMAN community node for n8n.

This package adds NewsMAN operations for subscriber management, segments, transactional email, and SMS.

## Compatibility

- n8n: tested on self-hosted n8n 2.x
- Node.js: 20+ recommended for development/publishing
- NewsMAN API: v1.2 REST (`ssl.newsman.app/api/1.2/rest`)

## Install

### In n8n (Community Nodes)

Install package:

`n8n-nodes-newsmanapp`

### Manual / self-hosted

```bash
npm install n8n-nodes-newsmanapp
```

Then restart n8n.

## Credentials

Create **NewsMAN API** credentials in n8n and set:

- `User ID`
- `API Key`

Base API format used by this node:

`https://ssl.newsman.app/api/1.2/rest/{userId}/{apiKey}/`

## Operations

### Subscriber

- `Get already existing subscriber by Email` -> `subscriber.getByEmail`
- `Save Subscriber to List` -> `subscriber.saveSubscribe`
- `Subscriber - Add Tag` -> `subscriber.addTag`

### Segment

- `Get Segments (by List)` -> `segment.all`
- `Add Subscriber to Segment` -> `segment.addSubscriber`
- `Add Subscriber to Segment (by Email)` -> `subscriber.getByEmail` + `segment.addSubscriber`

### List

- `Get Lists` -> `list.all`

### Transactional

- `Transactional - Message Send` -> `transactional.messageSend`

### SMS

- `SMS - Get Lists` -> `sms.lists`
- `SMS - Save Subscribe` -> `sms.saveSubscribe`
- `SMS - Send One` -> `sms.sendone`

## Output notes

- `saveSubscribe` and `sms.saveSubscribe` map scalar API results to:
  - `{ "subscriber_id": <id> }`
- `subscriber.addTag` maps boolean result to:
  - `{ "success": true|false }`

This makes downstream n8n expressions easier, for example:

`{{$json.subscriber_id}}`

## Development

```bash
npm install
npm run build
npm run lint
```

## Local Docker test

Mount this package into your n8n custom extensions path and restart n8n.

## Release (npm)

1. Update `version` in `package.json`
2. Run:
   - `npm run build`
   - `npm run lint`
   - `npm pack` (optional verification)
3. Publish:
   - `npm login`
   - `npm publish --access public`

## Community submission checklist

- Public npm package with `n8n-community-node-package` keyword
- Public GitHub repository with README and license
- Clear operation docs and credential setup
- Working icon and sensible output structure
- CI checks for build/lint

## License

ISC

