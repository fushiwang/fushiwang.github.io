# Shared game tallies

From this directory, run `npx wrangler login` and `npx wrangler deploy` with a Cloudflare account that supports SQLite-backed Durable Objects. Copy the resulting HTTPS workers.dev URL into `tallyURL` in `../other/tally-config.js`, then publish the GitHub Pages changes normally. If the website uses a custom domain, set SITE_ORIGIN in wrangler.jsonc to that exact origin and redeploy.

For local integration testing, set SITE_ORIGIN to the local static server origin with `npx wrangler dev --var SITE_ORIGIN:http://localhost:8000` and point tallyURL to the local Worker URL.

The Worker stores a random browser ID for each game. For the first preference round it records transitivity. For the first coin round it records the verdict, whether it was correct, and the number of flips. Retried submissions never overwrite that first vote. Clearing browser storage or changing browsers allows another entry. The percentages describe participating browsers and are an informal game statistic.
