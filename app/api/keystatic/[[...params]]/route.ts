import { makeRouteHandler } from '@keystatic/next/route-handler';
import config from '../../../../keystatic.config';
import { adminDisabledReason, adminEnabled } from '@/lib/keystatic-storage';

/**
 * Backs the Keystatic UI.
 *
 * Guarded, because Keystatic's local-storage handler is unauthenticated by
 * design. If GitHub storage isn't fully configured, this route does not exist —
 * it 404s rather than exposing the filesystem API. See lib/keystatic-storage.ts.
 */

export const dynamic = 'force-dynamic';

function disabled() {
  return new Response('Not Found', {
    status: 404,
    headers: { 'x-robots-tag': 'noindex, nofollow' },
  });
}

let handlers: { GET: (req: Request) => Promise<Response>; POST: (req: Request) => Promise<Response> };

if (adminEnabled) {
  handlers = makeRouteHandler({ config });
} else {
  console.warn(`[keystatic] admin API disabled — ${adminDisabledReason()}`);
  handlers = { GET: async () => disabled(), POST: async () => disabled() };
}

export const GET = handlers.GET;
export const POST = handlers.POST;
