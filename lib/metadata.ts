import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import { site } from './site';

/**
 * The default share image: the real company logo. Square, so the Twitter card
 * is `summary` - a `summary_large_image` card with a 300x300 logo renders as a
 * blurry crop.
 */
export const DEFAULT_SHARE_IMAGE = {
  url: '/LOGO-whiteeyes-300X300.png',
  width: 300,
  height: 300,
  alt: `${site.name} logo`,
};

type PageMetaInput = {
  /** Page title; the root template appends "| Dedcell Security" unless `absoluteTitle`. */
  title: string;
  description: string;
  /** Path only, e.g. "/a-pent". Becomes the canonical and og:url. */
  path: string;
  absoluteTitle?: boolean;
  type?: 'website' | 'article';
  image?: { url: string; width?: number; height?: number; alt?: string };
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  noindex?: boolean;
};

/**
 * Complete per-page metadata. Next.js replaces `openGraph` wholesale when a page
 * sets it, so a page that only set title/url silently lost og:site_name, locale
 * and image. Building every page's block here keeps them complete and identical
 * in shape.
 */
export function pageMetadata(input: PageMetaInput): Metadata {
  const image = input.image ?? DEFAULT_SHARE_IMAGE;
  const ogTitle = input.absoluteTitle || input.path === '/' ? input.title : `${input.title} | ${site.name}`;
  const largeImage = (image.width ?? 0) >= 600;

  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description: input.description,
    alternates: { canonical: input.path },
    robots: input.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: input.type ?? 'website',
      siteName: site.name,
      locale: site.locale,
      url: input.path,
      title: ogTitle,
      description: input.description,
      images: [image],
      ...(input.type === 'article'
        ? {
            publishedTime: input.publishedTime || undefined,
            modifiedTime: input.modifiedTime || undefined,
            authors: input.authors,
          }
        : {}),
    },
    twitter: {
      card: largeImage ? 'summary_large_image' : 'summary',
      title: ogTitle,
      description: input.description,
      images: [image.url],
    },
  };
}

/** First Markdown image in a document body, used as the article's main image. */
export function firstImage(body: string): string | undefined {
  const m = /!\[[^\]]*\]\((\/images\/[^)\s]+)/.exec(body);
  return m?.[1];
}

/**
 * Pixel size of a PNG under public/, read from its IHDR header. Other formats
 * return undefined, which simply omits og:image:width/height.
 */
export function pngSize(publicPath: string): { width: number; height: number } | undefined {
  try {
    const fd = fs.openSync(path.join(process.cwd(), 'public', publicPath), 'r');
    const buf = Buffer.alloc(24);
    fs.readSync(fd, buf, 0, 24, 0);
    fs.closeSync(fd);
    if (buf.readUInt32BE(0) !== 0x89504e47) return undefined;
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  } catch {
    return undefined;
  }
}
