/**
 * Eyebrow + two-tone heading: the opening of every marketing section
 * (DESIGN_SPEC.md §2). `muted` is the second clause, set in gray.
 */
type Props = {
  eyebrow: string;
  title: string;
  muted?: string;
  intro?: string;
  invert?: boolean;
  /** Matches the `id` an `aria-labelledby` on the section points at. */
  id?: string;
  className?: string;
};

export function SectionHeading({ eyebrow, title, muted, intro, invert = false, id, className = '' }: Props) {
  return (
    <div className={className}>
      <span className={`eyebrow block mb-4 ${invert ? 'eyebrow-invert' : ''}`}>{eyebrow}</span>
      <h2
        id={id}
        className={`text-[2rem] leading-[1.1] sm:text-4xl md:text-5xl font-extrabold tracking-tight text-balance ${
          invert ? 'text-white' : 'text-black'
        }`}
      >
        {title}
        {muted && (
          <>
            {' '}
            <span className={invert ? 'text-white/50' : 'text-gray-500'}>{muted}</span>
          </>
        )}
      </h2>
      {intro && (
        <p
          className={`mt-6 text-base md:text-lg leading-relaxed max-w-3xl ${
            invert ? 'text-white/60' : 'text-gray-500'
          }`}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
