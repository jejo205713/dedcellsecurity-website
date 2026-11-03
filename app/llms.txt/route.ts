import { buildLlmsTxt } from '@/lib/llms';

/**
 * /llms.txt - see lib/llms.ts. Prerendered at build time, like the sitemap,
 * so it is rebuilt by the same deploy that publishes a post or term.
 */
export const dynamic = 'force-static';

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
