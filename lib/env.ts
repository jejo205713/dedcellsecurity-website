/**
 * Deployment-environment signals, in one place, and deliberately **fail-closed**.
 *
 * The previous rule was `VERCEL_ENV !== 'production'`, which inverts the moment
 * `VERCEL_ENV` is absent: a plain `next build && next start`, a Docker image, a
 * self-hosted node - every one of those publishes every draft. Caught by running
 * a production build outside Vercel, where an unpublished post appeared in the
 * sitemap.
 *
 * The rule now: a production build hides drafts **unless** something positively
 * identifies the deployment as a preview.
 */

/** True for any optimised build, wherever it runs. */
export const isProductionBuild = process.env.NODE_ENV === 'production';

/** True only on a Vercel preview/branch deployment. */
export const isPreviewDeployment =
  process.env.VERCEL_ENV === 'preview' || process.env.VERCEL_ENV === 'development';

/**
 * Drafts are visible while developing and on preview deployments, and nowhere
 * else. Any environment we cannot positively identify is treated as live.
 */
export const showDrafts = !isProductionBuild || isPreviewDeployment;

/**
 * Whether search engines may index this deployment. Only a real production
 * build that is not a preview gets crawled; everything else is disallowed, so
 * a staging URL can never outrank the live site.
 */
export const isIndexable = isProductionBuild && !isPreviewDeployment;
