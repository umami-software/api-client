# @umami/api-client

TypeScript API client for [Umami Analytics](https://umami.is). Version 3.x of this package tracks the
Umami 3.x API and exposes a typed method for every endpoint.

Full documentation: https://umami.is/docs/api/api-client

## Requirements

- Node.js 18 or newer (uses the built-in `fetch`)

## Installation

```shell
pnpm add @umami/api-client
# or
npm install @umami/api-client
```

## Usage

```ts
import { getClient } from '@umami/api-client';

const client = getClient();

const { ok, status, data, error } = await client.getWebsites();
```

Every method returns the same envelope and never throws:

```ts
{
  ok: boolean;
  status: number;   // HTTP status, 0 on network failure
  data?: T;         // response body on success
  error?: { message: string; code?: string; status?: number };
}
```

## Authentication

`getClient()` reads its configuration from environment variables; you can also pass the same options
directly to `getClient({...})` or `new UmamiApiClient({...})`.

### Self-hosted: user id + app secret

The client mints an auth token exactly as Umami does, so the secret must match the server's `APP_SECRET`.

```dotenv
UMAMI_API_CLIENT_USER_ID=<user uuid>
UMAMI_API_CLIENT_SECRET=<APP_SECRET of your umami instance>
UMAMI_API_CLIENT_ENDPOINT=https://your-umami.example.com/api
```

### Umami Cloud: API key

```dotenv
UMAMI_API_KEY=<api key>
UMAMI_API_CLIENT_ENDPOINT=https://api.umami.is/v1
```

See [API key](https://umami.is/docs/cloud/api-key) for details.

### Username + password

```ts
const client = getClient({ apiEndpoint: 'https://your-umami.example.com/api' });

const login = await client.login({ username, password });

if (login.data?.requiresTwoFactor) {
  const verified = await client.verifyTwoFactor({ token: '123456' }, login.data.partialToken);
  client.setToken(verified.data.token);
} else {
  client.setToken(login.data.token);
}
```

## Examples

```ts
const websiteId = '...';
const endAt = Date.now();
const startAt = endAt - 7 * 24 * 60 * 60 * 1000;

// Overview stats
const stats = await client.getWebsiteStats(websiteId, { startAt, endAt });

// Top pages (note: metric type is `path`, not `url`)
const pages = await client.getWebsiteMetrics(websiteId, { startAt, endAt, type: 'path', limit: 10 });

// Pageview series
const series = await client.getWebsitePageviews(websiteId, {
  startAt,
  endAt,
  unit: 'day',
  timezone: 'America/Los_Angeles',
});

// Breakdown report
const breakdown = await client.runBreakdownReport({
  websiteId,
  type: 'breakdown',
  filters: { startAt, endAt, timezone: 'UTC' },
  parameters: {
    startDate: new Date(startAt).toISOString(),
    endDate: new Date(endAt).toISOString(),
    fields: ['path', 'browser'],
  },
});
```

## Notes

- Dates in responses are ISO strings. Most query params take `startAt` / `endAt` as epoch milliseconds;
  routes that accept `withDateRange` also accept `startDate` / `endDate`.
- `sortDescending` is sent as the string `'true'` / `'false'` (as Umami expects); pass a boolean.
- `getWebsitesCharts`, `getLinksCharts`, `getPixelsCharts` take `ids: string[]` and join them with commas
  (max 20).
- Filter params accept any extra keys and pass them through unchanged, e.g. `browser1`, `pf_plan`,
  `epf0`, `spf0`.
- Report runners send `{ websiteId, type, filters, parameters }`. `filters.startAt/endAt` are epoch ms;
  `parameters.startDate/endDate` are ISO strings.
- Umami Cloud returns 404 for `2fa/*` routes and blocks `me/password` and `users/*`.
- Token helpers (`createSecureToken`, `parseSecureToken`, `hash`) are exported for proxies that need
  to mint or verify Umami tokens.

## Migrating from 0.x

Version 3.x is a clean break to match Umami 3.x. Highlights:

| 0.x | 3.x |
|---|---|
| `getUsers()` | `getAdminUsers()` |
| `getUserUsage()` | removed |
| `getShare(id)` | `getShareBySlug(slug)` (public) / `getShare(shareId)` |
| `getReports()` | `getReports({ websiteId })` |
| `getSessionActivity()` | `getWebsiteSessionActivity()` |
| `getSessionData()` | `getWebsiteSessionProperties()` |
| `getEventMetrics()` | `getWebsiteEventSeries()` |
| metrics `type: 'url'`, filter `host` | `type: 'path'`, `hostname` |
| `createTeam({ name, domain })` | `createTeam({ name, ownerId? })` |
| `updateTeamMember()` | `updateTeamUser()` |
| `createTeamWebsite()` / `deleteTeamWebsite()` | `createWebsite({ teamId })` / `deleteWebsite()` |
| `login(username, password)` | `login({ username, password })` |
| `getRealtime(id, { startAt })` | `getRealtime(id, params?)` |
| `runUTMReport()` / `runGoalsReport()` | `runUtmReport()` / `runGoalReport()` |
| `runInsightsReport()` | `runBreakdownReport()` |
| `executeRoute()`, `put()` | removed |
| `next-basics` / `cross-fetch` dependency | native `fetch`; Node 18+ |

New in 3.x: boards, links, pixels, segments, annotations, shares, session replays, revenue, session
data, event data pivots, expanded metrics, 2FA, admin routes, and all report types (attribution,
breakdown, funnel, goal, heatmap, journey, performance, retention, revenue, utm).

## License

MIT
