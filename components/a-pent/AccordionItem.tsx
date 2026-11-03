import { Plus } from 'lucide-react';

/**
 * Native <details>/<summary>: keyboard, touch and screen-reader support with no
 * client JavaScript, and the content stays in the HTML for crawlers. The
 * default disclosure triangle is hidden in favour of the rotating plus.
 */
type Props = {
  summary: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
};

export function AccordionItem({ summary, children, defaultOpen = false, className = '' }: Props) {
  return (
    <details className={`group bg-white ${className}`} open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-5 sm:px-8 sm:py-6 select-none transition-colors hover:bg-black/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-black/40 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0 flex-1">{summary}</div>
        <span
          aria-hidden="true"
          className="shrink-0 w-9 h-9 rounded-full border border-black/10 flex items-center justify-center text-black transition-colors group-open:bg-black group-open:text-white group-open:border-black"
        >
          <Plus className="w-4 h-4 transition-transform duration-300 group-open:rotate-45" />
        </span>
      </summary>
      <div className="px-5 pb-6 sm:px-8 sm:pb-8">{children}</div>
    </details>
  );
}
