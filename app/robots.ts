import type { MetadataRoute } from 'next';
import { isIndexable } from '@/lib/env';
import { absoluteUrl, site } from '@/lib/site';

/**
 * Crawler policy.
 *
 * Three different kinds of bot, which are easy to conflate:
 *
 *  - SEARCH INDEXERS build the index an engine or assistant answers from and
 *    cites (Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot, PerplexityBot).
 *    Blocking one removes us from that product's answers.
 *  - USER-TRIGGERED FETCHERS visit a page because a person asked an assistant
 *    about it right now (ChatGPT-User, Claude-User, Perplexity-User). Their
 *    operators document that robots.txt may not apply to them; they are listed
 *    so our intent is explicit either way.
 *  - TRAINING CRAWLERS collect pages for future model training (GPTBot,
 *    ClaudeBot, CCBot, ...). They do not power live search, and a model trained
 *    on an old snapshot repeats stale facts - which is how assistants ended up
 *    misquoting the CAAPT scholarship. Allowing them is a business decision, so
 *    it is one switch below rather than a side effect of allowing everything.
 *
 * Google-Extended is the exception: besides training, Google documents that it
 * controls *grounding* in Gemini Apps (live answers from the Search index). We
 * want Gemini to answer from our pages, so it is allowed.
 *
 * Sources (checked 2026-11-03): developers.openai.com/api/docs/bots,
 * support.claude.com/en/articles/8896518, docs.perplexity.ai/guides/bots,
 * developers.google.com/search/docs/crawling-indexing/google-common-crawlers.
 */

/** Set to true to let model-training crawlers in as well. */
const ALLOW_AI_TRAINING = false;

/** Tools and private endpoints, never content. Applies to every crawler. */
const PRIVATE = ['/keystatic', '/admin', '/api/'];

const SEARCH_AND_USER_AGENTS = [
  'Googlebot',
  'Bingbot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot',
  'DuckDuckBot',
];

const TRAINING_ONLY_AGENTS = [
  'GPTBot',
  'ClaudeBot',
  'CCBot',
  'Applebot-Extended',
  'meta-externalagent',
  'Bytespider',
];

export default function robots(): MetadataRoute.Robots {
  // Anything not positively identified as the live production deployment is
  // disallowed, so a preview or staging URL can never compete with the real one.
  // See lib/env.ts - this deliberately fails closed.
  if (!isIndexable) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  return {
    rules: [
      { userAgent: SEARCH_AND_USER_AGENTS, allow: '/', disallow: PRIVATE },
      ALLOW_AI_TRAINING
        ? { userAgent: TRAINING_ONLY_AGENTS, allow: '/', disallow: PRIVATE }
        : { userAgent: TRAINING_ONLY_AGENTS, disallow: '/' },
      // Everyone else: public content yes, tools no.
      { userAgent: '*', allow: '/', disallow: PRIVATE },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: site.url,
  };
}
