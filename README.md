# @umami/api-client

API client for Umami Analytics

### Getting started

More detailed usage information can be found at https://umami.is/docs/api/api-client

### Installation

```shell
yarn add @umami/api-client
```

### Usage

```javascript
import { client } from '@umami/api-client';

const { ok, data, status, error } = await client.getWebsites();
```

# License

MIT
