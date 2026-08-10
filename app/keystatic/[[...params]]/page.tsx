import { notFound } from 'next/navigation';
import KeystaticApp from '../keystatic-app';
import { EditorToolbar } from '../editor-toolbar';
import { adminEnabled } from '@/lib/keystatic-storage';

/** The CMS is an editor tool, never a search result. */
export const metadata = {
  title: 'Content admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function KeystaticPage() {
  // Mirrors the API guard: no authenticated storage, no admin UI.
  if (!adminEnabled) notFound();
  return (
    <>
      {/* Renders itself away on every route except an entry editor. */}
      <EditorToolbar />
      <KeystaticApp />
    </>
  );
}
