import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  BookMarked,
  BookOpen,
  Bot,
  BrainCircuit,
  CalendarDays,
  Check,
  ClipboardCheck,
  ClipboardList,
  Code2,
  Crosshair,
  FileSearch,
  FileText,
  FlaskConical,
  FolderGit2,
  GraduationCap,
  Info,
  Lock,
  Mail,
  Rocket,
  ScanSearch,
  ScrollText,
  Server,
  ShieldCheck,
  Swords,
  Target,
  Terminal,
  UserCheck,
  Workflow,
} from 'lucide-react';
import { AccordionItem } from '@/components/a-pent/AccordionItem';
import { EnrolForm } from '@/components/a-pent/EnrolForm';
import { SectionHeading } from '@/components/a-pent/SectionHeading';
import { JsonLd } from '@/components/JsonLd';
import {
  audience,
  capstoneSteps,
  curriculum,
  curriculumHighlights,
  deliverables,
  faqs,
  feeLabel,
  format,
  keyFacts,
  labs,
  outcomes,
  prerequisites,
  inr,
  programme,
  progression,
  scholarship,
  scholarshipStatement,
  structure,
} from '@/lib/a-pent';
import { pageMetadata } from '@/lib/metadata';
import { breadcrumbSchema, courseSchema, faqSchema, webPageSchema } from '@/lib/schema';

const TITLE = 'A-PENT - Agentic Penetration Testing Professional';
const DESCRIPTION = `Six-week online course in offensive security and agentic AI by Dedcell Security. Fee ${feeLabel}; scholarships of up to ${scholarship.maxPercent}% for eligible students.`;
/** Longer description for structured data, where length is not truncated. */
const COURSE_DESCRIPTION = `A-PENT (Agentic Penetration Testing Professional) is a six-week online training programme by Dedcell Security covering penetration testing, web application security, AI for cybersecurity and agentic AI, ending with the AutoSec AI penetration-testing copilot capstone. ${scholarshipStatement}`;

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: programme.coursePath,
});

const TOPIC_COUNT = curriculum.reduce((sum, week) => sum + week.topics.length, 0);

const DIFFERENTIATORS = [
  { icon: Crosshair, title: 'Offensive Fundamentals', body: 'Networking, Linux, recon and web security - the ground every pentester stands on.' },
  { icon: FlaskConical, title: 'Practical Labs', body: 'Every concept is practised against deliberately vulnerable targets in your own isolated lab.' },
  { icon: ScanSearch, title: 'AI-Assisted Analysis', body: 'Use LLMs to explain, triage and classify real scan findings - and learn where they get it wrong.' },
  { icon: Workflow, title: 'Functional Automation', body: 'Write Python that turns raw tool output into structured, reportable data.' },
  { icon: Bot, title: 'Agentic AI & Tools', body: 'Function calling, MCP and tool integration for security-focused agents.' },
  { icon: Rocket, title: 'Hands-on Capstone', body: 'Finish by building AutoSec AI, your own penetration testing copilot.' },
];

const GUARDRAILS = [
  { icon: Lock, title: 'Scope-locked', body: 'Acts only on targets you are authorised to test.' },
  { icon: UserCheck, title: 'Human approval', body: 'Consequential actions wait for an analyst to approve.' },
  { icon: ScrollText, title: 'Audit-logged', body: 'Every prompt, tool call and decision is recorded.' },
  { icon: ClipboardCheck, title: 'Evidence-validated', body: 'Findings are checked against evidence, not taken on trust.' },
];

const LAB_ICONS = [Swords, Target, BrainCircuit, ShieldCheck];

const AUDIENCE_ICONS = [GraduationCap, Crosshair, Terminal, Code2, Server, BrainCircuit];

const DELIVERABLE_ICONS = [
  FlaskConical,
  BookOpen,
  ScrollText,
  ClipboardList,
  FileText,
  Code2,
  Bot,
  FolderGit2,
  BookMarked,
  Award,
];

/** Lines for the illustrative capstone session in the hero of section 5. */
const SESSION: Array<{ kind: 'cmd' | 'ok' | 'ask' | 'out'; text: string }> = [
  { kind: 'cmd', text: 'autosec scope load ./scope/lab-network.yaml' },
  { kind: 'ok', text: 'Scope locked: 10.10.0.0/24 (authorised lab)' },
  { kind: 'cmd', text: 'autosec run recon --profile approved' },
  { kind: 'ask', text: 'Run nmap -sV on 10.10.0.0/24? [y/N] y  (approved: analyst)' },
  { kind: 'ok', text: '14 services parsed → findings.json' },
  { kind: 'out', text: 'LLM: explaining and classifying 6 findings…' },
  { kind: 'out', text: '[HIGH] Outdated SSH service on 10.10.0.12' },
  { kind: 'out', text: '[MED]  Directory listing on 10.10.0.20' },
  { kind: 'ok', text: 'report.md generated · audit.log updated' },
];

const SESSION_PREFIX = { cmd: '$', ok: '✓', ask: '?', out: '→' } as const;

const PRIMARY_BTN =
  'w-full sm:w-auto bg-black text-white font-sans font-semibold text-sm px-8 py-3.5 rounded-lg btn-press inline-flex items-center justify-center gap-2 hover:bg-gray-700';
const SECONDARY_BTN =
  'w-full sm:w-auto border border-black/20 bg-transparent text-black font-sans font-medium text-sm px-8 py-3.5 rounded-lg btn-press hover:border-black/50 hover:bg-black/5 transition-all inline-flex items-center justify-center gap-2';
const SECTION = 'py-20 md:py-24 border-t border-black/10';
const CONTAINER = 'max-w-7xl mx-auto px-6';
const TAG = 'font-mono text-[11px] border border-black/10 px-2 py-1 text-gray-500 rounded';
const GRIEVANCE_EMAIL = 'contact@dedcellsecurity.in';

export default function APentPage() {
  const contactHref = `mailto:${programme.contactEmail}?subject=${encodeURIComponent('A-PENT enquiry')}`;

  return (
    <>
      <JsonLd
        data={courseSchema({
          name: `${programme.shortName} - ${programme.name}`,
          alternateName: programme.shortName,
          description: COURSE_DESCRIPTION,
          path: programme.coursePath,
          priceInr: programme.feeInr,
          startDate: programme.batchStart.iso,
          durationWeeks: programme.durationWeeks,
          hoursPerWeek: 10,
          teaches: curriculumHighlights,
          audience: [...audience],
          financialAid: `${scholarship.summary} Supported by ${scholarship.supportedBy}; subject to eligibility review and approval, and not every applicant receives the maximum.`,
        })}
      />
      <JsonLd data={webPageSchema({ path: programme.coursePath, name: TITLE, description: DESCRIPTION, related: [programme.guidePath] })} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', href: '/' },
          { name: 'A-PENT Training', href: programme.coursePath },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      {/* 1. Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden" aria-labelledby="a-pent-title">
        <div
          className="absolute inset-0 z-0"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(0,0,0,0.04) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <div className="hidden md:block absolute top-24 left-12 w-12 h-12 border-t border-l border-black/10" aria-hidden="true" />
        <div className="hidden md:block absolute top-24 right-12 w-12 h-12 border-t border-r border-black/10" aria-hidden="true" />

        <div className={`${CONTAINER} relative z-10 flex flex-col items-center text-center`}>
          <p className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border border-black/10 bg-black/[0.03] text-gray-600 font-mono text-[10px] sm:text-[11px] uppercase tracking-widest px-4 py-1.5 rounded-full mb-8">
            <span className="hidden sm:inline">Training Programme</span>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <span>Next batch {programme.batchStart.label}</span>
          </p>

          <h1 id="a-pent-title" className="text-black tracking-tight">
            <span className="flex items-center justify-center gap-3 sm:gap-5 font-bold text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-none">
              <span className="shrink-0 inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-2xl bg-black text-white">
                <GraduationCap className="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 lg:w-14 lg:h-14" strokeWidth={1.75} aria-hidden="true" />
              </span>
              {programme.shortName}
            </span>
            <span className="block mt-4 md:mt-6 font-bold text-2xl sm:text-3xl md:text-4xl text-gray-500 text-balance">
              {programme.name}
            </span>
          </h1>

          <p className="mt-6 font-mono text-xs sm:text-sm uppercase tracking-widest text-black">
            {programme.tagline}
          </p>

          <p className="mt-6 text-base md:text-lg text-gray-500 max-w-2xl leading-relaxed text-balance">
            Learn offensive security. Build AI-powered security agents. Develop your own penetration
            testing copilot.
          </p>

          <div className="mt-10 w-full flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#apply" className={PRIMARY_BTN}>
              Apply for A-PENT <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
            <a href="#curriculum" className={SECONDARY_BTN}>
              Explore Curriculum
            </a>
          </div>

          {/* Programme facts card (inverted), echoing the home page's telemetry card. */}
          <div className="mt-14 w-full max-w-5xl border border-white/10 rounded-xl bg-black text-white p-5 sm:p-8 text-left">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-5 sm:pb-6 sm:mb-6 border-b border-white/15">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-white/80" aria-hidden="true" />
                <span className="w-3 h-3 rounded-full bg-white/40" aria-hidden="true" />
                <span className="w-3 h-3 rounded-full bg-white/20" aria-hidden="true" />
                <span className="font-mono text-xs text-white/50 ml-2">a-pent://programme</span>
              </div>
              <p className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/20 rounded-full bg-white/10 text-white font-mono text-[11px] sm:text-xs">
                <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
                Registration closes {programme.registrationDeadline.label}
              </p>
            </div>

            <dl className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
              {keyFacts.map((fact, i) => (
                <div
                  key={fact.label}
                  className={`p-3 min-[360px]:p-4 rounded-xl bg-white/[0.06] border border-white/10 ${
                    i === keyFacts.length - 1 ? 'col-span-2 md:col-span-1' : ''
                  }`}
                >
                  <dt className="font-mono text-[11px] text-white/50 mb-1 uppercase tracking-widest">{fact.label}</dt>
                  <dd className="text-sm min-[360px]:text-base sm:text-lg font-bold text-white leading-snug">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* 2. Programme overview */}
      <section className={SECTION} aria-labelledby="overview-title">
        <div className={`${CONTAINER} grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start`}>
          <div>
            <SectionHeading
              id="overview-title"
              eyebrow="Programme Overview"
              title="Penetration Testing,"
              muted="Rebuilt for the AI Era."
            />
            <div className="mt-6 space-y-5 text-base md:text-lg text-gray-500 leading-relaxed">
              <p>
                A-PENT combines traditional penetration testing foundations with modern AI and agentic
                security development. You learn how attackers find and exploit weaknesses, then how to
                automate that work responsibly with language models and AI agents.
              </p>
              <p>
                The emphasis is practical. Each week pairs concepts with hands-on lab work, assignments
                build on one another, and everything comes together in a working capstone project.
              </p>
            </div>
          </div>

          <ol className="hairline-grid grid rounded-xl overflow-hidden" aria-label="Programme progression">
            {progression.map((stage, i) => (
              <li key={stage} className="bg-white px-5 py-4 sm:px-6 sm:py-5 flex items-center gap-4 sm:gap-5">
                <span className="font-mono text-xs text-gray-400 tabular-nums shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-black font-semibold text-sm sm:text-base flex-1 min-w-0">{stage}</span>
                <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-gray-500 shrink-0">
                  Week {String(i + 1).padStart(2, '0')}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 3. Differentiators */}
      <section className={SECTION} aria-labelledby="different-title">
        <div className={CONTAINER}>
          <SectionHeading
            id="different-title"
            eyebrow="Why A-PENT"
            title="What Makes A-PENT"
            muted="Different?"
            className="mb-12 md:mb-16"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 hairline-grid rounded-xl overflow-hidden">
            {DIFFERENTIATORS.map(({ icon: Icon, title, body }, i) => (
              <div key={title} className="p-6 sm:p-8 card-hover">
                <div className="flex justify-between items-start mb-8">
                  <Icon className="w-6 h-6 text-black" aria-hidden="true" />
                  <span className="font-mono text-xs text-gray-400">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="text-lg font-bold text-black mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Curriculum */}
      <section id="curriculum" className={`${SECTION} bg-surfaceDark`} aria-labelledby="curriculum-title">
        <div className={CONTAINER}>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 md:mb-16">
            <SectionHeading
              id="curriculum-title"
              eyebrow="Six-Week Curriculum"
              title="From First Packet"
              muted="to Your Own AI Agent."
            />
            <p className="font-mono text-xs uppercase tracking-widest text-gray-500 shrink-0">
              6 weeks · {TOPIC_COUNT} topics · 48–60 hours
            </p>
          </div>

          <div className="hairline-grid grid rounded-xl overflow-hidden">
            {curriculum.map((week, i) => (
              <AccordionItem
                key={week.number}
                defaultOpen={i === 0}
                summary={
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-6">
                    <span className="font-mono text-xs uppercase tracking-widest text-gray-500 sm:w-20 shrink-0">
                      Week {week.number}
                    </span>
                    <h3 className="text-lg md:text-xl font-bold text-black leading-snug flex-1 min-w-0">
                      {week.title}
                    </h3>
                    <span className="hidden md:inline font-mono text-[11px] uppercase tracking-widest text-gray-500 shrink-0">
                      {week.track} · {week.topics.length} topics
                    </span>
                  </div>
                }
              >
                <div className="border-t border-black/10 pt-6 sm:ml-[6.5rem]">
                  <p className="md:hidden font-mono text-[11px] uppercase tracking-widest text-gray-500 mb-4">
                    {week.track} · {week.topics.length} topics
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                    {week.topics.map((topic) => (
                      <li key={topic} className="flex items-start gap-3 text-sm text-gray-500 leading-relaxed">
                        <Check className="w-4 h-4 text-black shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AccordionItem>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Capstone (inverted) */}
      <section id="capstone" className="py-20 md:py-28 border-t border-black/10 bg-black" aria-labelledby="capstone-title">
        <div className={CONTAINER}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <span className="eyebrow eyebrow-invert block mb-4">Featured Capstone</span>
              <h2 id="capstone-title" className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-none">
                AutoSec AI
              </h2>
              <p className="mt-5 text-xl sm:text-2xl font-display font-bold text-white/50 tracking-tight text-balance">
                Build an AI-powered penetration testing copilot.
              </p>
              <p className="mt-6 text-base text-white/60 leading-relaxed">
                Over the final weeks you bring everything together into a working copilot that runs
                approved scans, processes their output, uses an LLM to explain and classify findings, and
                produces a structured vulnerability report.
              </p>
              <p className="mt-6 border-l-2 border-white/40 pl-4 text-sm text-white leading-relaxed">
                AutoSec AI is about controlled, authorised and accountable security automation - not
                unrestricted autonomous exploitation. It works only inside a defined scope, asks before it
                acts, and records everything it does.
              </p>
            </div>

            {/* Illustrative session - shows the approval gate in action. */}
            <figure className="lg:col-span-7 w-full min-w-0 border border-white/15 rounded-xl bg-white/[0.04] overflow-hidden">
              <div className="flex items-center justify-between gap-4 px-4 sm:px-5 py-3 border-b border-white/15">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/80" aria-hidden="true" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/40" aria-hidden="true" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" aria-hidden="true" />
                  <span className="font-mono text-xs text-white/50 ml-2">autosec-ai</span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">Lab session</span>
              </div>
              <div className="p-4 sm:p-6 font-mono text-[11px] sm:text-xs leading-relaxed space-y-2">
                {SESSION.map((line, i) => (
                  <div key={i} className="flex gap-3">
                    <span className={`shrink-0 w-3 ${line.kind === 'cmd' ? 'text-white/50' : 'text-white/40'}`} aria-hidden="true">
                      {SESSION_PREFIX[line.kind]}
                    </span>
                    <span
                      className={`min-w-0 break-words ${
                        line.kind === 'cmd'
                          ? 'text-white'
                          : line.kind === 'ask'
                            ? 'text-black bg-white px-1.5 rounded-sm'
                            : 'text-white/60'
                      }`}
                    >
                      {line.text}
                    </span>
                  </div>
                ))}
              </div>
              <figcaption className="px-4 sm:px-6 py-3 border-t border-white/15 font-mono text-[10px] uppercase tracking-widest text-white/40">
                Illustrative workflow · isolated lab environment
              </figcaption>
            </figure>
          </div>

          <h3 className="mt-16 md:mt-20 mb-6 font-mono text-xs uppercase tracking-widest text-white/55">
            Project workflow
          </h3>
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 hairline-grid-invert rounded-xl overflow-hidden">
            {capstoneSteps.map((step, i) => (
              <li key={step.title} className="bg-black p-6 sm:p-7 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-xs text-white/50">STEP {String(i + 1).padStart(2, '0')}</span>
                  <ArrowRight className="w-4 h-4 text-white/30 rotate-90 sm:rotate-0" aria-hidden="true" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
                <p className="text-sm text-white/60 leading-relaxed">{step.body}</p>
              </li>
            ))}
            <li className="bg-white p-6 sm:p-7 flex flex-col">
              <span className="font-mono text-xs text-gray-500 mb-6">OUTPUT</span>
              <FileSearch className="w-6 h-6 text-black mb-4" aria-hidden="true" />
              <h4 className="text-lg font-bold text-black mb-2">Structured Report</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                Evidence-backed findings, severity and remediation, ready for human review.
              </p>
            </li>
          </ol>

          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {GUARDRAILS.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.06]">
                <Icon className="w-4 h-4 text-white shrink-0 mt-0.5" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs text-white/60 leading-relaxed mt-1">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. Lab environment */}
      <section className={SECTION} aria-labelledby="labs-title">
        <div className={CONTAINER}>
          <SectionHeading
            id="labs-title"
            eyebrow="Practical Lab Environment"
            title="Real Tools."
            muted="Safe, Isolated Targets."
            intro="Every offensive technique is practised against deliberately vulnerable systems in a lab you build and control - never against systems you are not authorised to test."
            className="mb-12 md:mb-16"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 hairline-grid rounded-xl overflow-hidden">
            {labs.map((lab, i) => {
              const Icon = LAB_ICONS[i];
              return (
                <div key={lab.group} className="p-6 sm:p-8 card-hover flex flex-col">
                  <div className="flex justify-between items-start mb-8">
                    <Icon className="w-6 h-6 text-black" aria-hidden="true" />
                    <span className="font-mono text-xs text-gray-400">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="text-xl font-bold text-black mb-5">{lab.group}</h3>
                  <ul className="flex flex-wrap gap-2 mt-auto">
                    {lab.tools.map((tool) => (
                      <li key={tool} className={TAG}>
                        {tool}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Learning outcomes */}
      <section className={SECTION} aria-labelledby="outcomes-title">
        <div className={CONTAINER}>
          <SectionHeading
            id="outcomes-title"
            eyebrow="Learning Outcomes"
            title="What You Will"
            muted="Be Able to Do."
            intro="By completing the programme, you should be able to:"
            className="mb-12 md:mb-16"
          />
          <ul className="grid grid-cols-1 md:grid-cols-2 hairline-grid rounded-xl overflow-hidden">
            {outcomes.map((outcome, i) => (
              <li key={outcome} className="bg-white p-5 sm:p-6 flex items-start gap-4">
                <span className="w-7 h-7 rounded-full bg-black/10 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-black" aria-hidden="true" />
                </span>
                <span className="text-sm sm:text-base text-black leading-relaxed pt-0.5">
                  <span className="sr-only">{i + 1}. </span>
                  {outcome}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 font-mono text-xs text-gray-600 leading-relaxed max-w-3xl">
            Outcomes describe what the programme is designed to teach. Results depend on individual effort
            and practice; A-PENT does not guarantee employment or professional-level mastery.
          </p>
        </div>
      </section>

      {/* 8. Programme structure */}
      <section className={`${SECTION} bg-surfaceDark`} aria-labelledby="structure-title">
        <div className={CONTAINER}>
          <SectionHeading
            id="structure-title"
            eyebrow="Programme Structure"
            title="Six Weeks,"
            muted="Built Around Your Schedule."
            className="mb-12 md:mb-16"
          />
          <dl className="grid grid-cols-2 lg:grid-cols-4 hairline-grid rounded-xl overflow-hidden">
            {structure.map((item) => (
              <div key={item.label} className="p-5 sm:p-8">
                <dt className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-gray-500 mb-3">
                  {item.label}
                </dt>
                <dd className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-black tracking-tight tabular-nums">
                  {item.value}
                </dd>
              </div>
            ))}
            <div className="col-span-2 lg:col-span-4 p-5 sm:p-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
              <dt className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-gray-500 shrink-0">
                Format
              </dt>
              <dd className="flex flex-wrap items-center gap-2 sm:gap-3">
                {format.map((part, i) => (
                  <span key={part} className="flex items-center gap-2 sm:gap-3">
                    {i > 0 && (
                      <span className="text-gray-400 font-mono" aria-hidden="true">
                        +
                      </span>
                    )}
                    <span className="font-semibold text-sm sm:text-base text-black border border-black/10 rounded-lg px-3 py-1.5 bg-white">
                      {part}
                    </span>
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* 9. Who should join */}
      <section className={SECTION} aria-labelledby="audience-title">
        <div className={CONTAINER}>
          <SectionHeading
            id="audience-title"
            eyebrow="Who Should Join"
            title="Built for Curious Builders,"
            muted="Not Just Professionals."
            className="mb-12 md:mb-16"
          />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            <ul className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 hairline-grid rounded-xl overflow-hidden">
              {audience.map((who, i) => {
                const Icon = AUDIENCE_ICONS[i];
                return (
                  <li key={who} className="bg-white p-5 sm:p-6 flex items-center gap-4">
                    <Icon className="w-5 h-5 text-gray-600 shrink-0" aria-hidden="true" />
                    <span className="text-sm sm:text-base font-semibold text-black">{who}</span>
                  </li>
                );
              })}
            </ul>

            <div className="lg:col-span-5 rounded-xl bg-black text-white p-6 sm:p-8 flex flex-col">
              <h3 className="font-mono text-xs uppercase tracking-widest text-white/55 mb-6">Prerequisites</h3>
              <ul className="space-y-4 mb-8">
                {prerequisites.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm sm:text-base text-white/80">
                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" aria-hidden="true" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-auto border-t border-white/15 pt-6 text-base sm:text-lg font-display font-bold text-white leading-snug">
                No prior professional penetration testing experience required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Deliverables */}
      <section id="deliverables" className={SECTION} aria-labelledby="deliverables-title">
        <div className={CONTAINER}>
          <SectionHeading
            id="deliverables-title"
            eyebrow="What You Receive"
            title="Everything You Need"
            muted="to Learn by Doing."
            className="mb-12 md:mb-16"
          />
          <ul className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-5 hairline-grid rounded-xl overflow-hidden">
            {deliverables.map((item, i) => {
              const Icon = DELIVERABLE_ICONS[i];
              return (
                <li key={item} className="bg-white p-5 sm:p-6 flex min-[480px]:flex-col items-center min-[480px]:items-start gap-4">
                  <Icon className="w-5 h-5 text-black shrink-0" aria-hidden="true" />
                  <span className="text-sm font-semibold text-black leading-snug">{item}</span>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 p-5 sm:p-6 border border-black/10 rounded-xl bg-black/[0.02] flex flex-col sm:flex-row items-start gap-4">
            <div className="p-2.5 bg-black/5 rounded-full shrink-0">
              <Info className="w-5 h-5 text-black" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-black font-bold text-base mb-1">About certification</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                The A-PENT certificate is a programme completion certificate issued by Dedcell Security. CEH
                v13 preparation material is included as study support only - A-PENT does not award the
                EC-Council CEH certification, and does not include the CEH exam or an exam voucher. A-PENT is
                not affiliated with or endorsed by EC-Council.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. About Dedcell */}
      <section className={SECTION} aria-labelledby="about-title">
        <div className={`${CONTAINER} grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end`}>
          <div className="lg:col-span-7">
            <SectionHeading
              id="about-title"
              eyebrow="About Dedcell Security"
              title="Taught from"
              muted="the Offensive Side."
            />
            <div className="mt-6 space-y-5 text-base md:text-lg text-gray-500 leading-relaxed">
              <p>
                Dedcell Security is a cybersecurity company that helps organisations identify and address
                security vulnerabilities through penetration testing and security assessments across web
                applications, APIs, cloud and mobile.
              </p>
              <p>
                A-PENT is designed to connect that practical offensive security knowledge with modern
                AI-powered security development - so learners understand both how vulnerabilities are found
                and how to automate that work responsibly.
              </p>
            </div>
          </div>
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 lg:items-start">
            <Link href="/services" className={SECONDARY_BTN}>
              Our Services <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link href="/about" className={SECONDARY_BTN}>
              About Dedcell
            </Link>
          </div>
        </div>
      </section>

      {/* 12. Pricing & enrolment */}
      <section id="apply" className={`${SECTION} bg-surfaceDark`} aria-labelledby="apply-title">
        <div className={CONTAINER}>
          <SectionHeading
            id="apply-title"
            eyebrow="Pricing & Enrolment"
            title="Join the Next"
            muted="A-PENT Batch."
            intro={`Registrations close on ${programme.registrationDeadline.label}. Apply below and our team will get back to you with the next steps.`}
            className="mb-12 md:mb-16"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="flex flex-col gap-6">
              <div className="rounded-2xl bg-black text-white p-6 sm:p-8 md:p-10">
                <p className="font-mono text-xs uppercase tracking-widest text-white/55">Programme Fee</p>
                <p className="mt-3 text-5xl sm:text-6xl font-display font-bold tracking-tight tabular-nums">
                  {feeLabel}
                </p>
                <p className="mt-3 text-sm text-white/60 leading-relaxed">
                  Apply using the form and our team will share payment details and next steps with you.
                </p>

                <dl className="mt-8 border-t border-white/15 divide-y divide-white/10">
                  {[
                    ['Next batch starts', programme.batchStart.label],
                    ['Last date to register', programme.registrationDeadline.label],
                    ['Duration', '6 weeks · Online'],
                    ['Weekly commitment', '8–10 hours'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4">
                      <dt className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-white/55">{label}</dt>
                      <dd className="text-sm sm:text-base font-semibold text-white">{value}</dd>
                    </div>
                  ))}
                </dl>

                {/* Scholarship. Figures come from lib/a-pent.ts - the same values feed
                    the FAQ, the structured data and /llms.txt. */}
                <div id="scholarship" className="mt-6 rounded-xl border border-white/10 bg-white/[0.06] p-4 scroll-mt-28">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-white/55 mb-2">
                    Scholarship · up to {scholarship.maxPercent}%
                  </p>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {scholarship.summary} Supported by {scholarship.supportedBy}.
                  </p>
                  <dl className="mt-4 divide-y divide-white/10 border-t border-white/10">
                    {[
                      ['Total course fee', feeLabel],
                      [`Maximum scholarship (${scholarship.maxPercent}%)`, inr(scholarship.maxAmountInr)],
                      ['Fee after maximum scholarship', inr(scholarship.minPayableInr)],
                    ].map(([label, value]) => (
                      <div key={label} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3">
                        <dt className="font-mono text-[11px] uppercase tracking-widest text-white/55">{label}</dt>
                        <dd className="text-sm font-semibold text-white tabular-nums">{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-3 text-xs text-white/55 leading-relaxed">
                    Up to {scholarship.maxPercent}%, not an automatic discount. Applications are subject to
                    eligibility review and approval, and the amount awarded depends on each assessment.{' '}
                    <Link href={programme.guidePath} className="text-white underline underline-offset-2">
                      Read the A-PENT scholarship guide
                    </Link>
                    .
                  </p>
                </div>

                <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.06] p-4">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-white/55 mb-2">Refund policy</p>
                  <p className="text-sm text-white/70 leading-relaxed">{programme.refundPolicy}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {programme.registrationUrl && (
                  <a href={programme.registrationUrl} target="_blank" rel="noopener noreferrer" className={PRIMARY_BTN}>
                    Register Now <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                )}
                <a href={contactHref} className={SECONDARY_BTN}>
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  Contact Us
                </a>
              </div>
              <p className="font-mono text-xs text-gray-600 break-words">
                Questions? Email{' '}
                <a href={contactHref} className="text-black underline underline-offset-2">
                  {programme.contactEmail}
                </a>
              </p>
            </div>

            <EnrolForm />
          </div>
        </div>
      </section>

      {/* 13. FAQs */}
      <section className={SECTION} aria-labelledby="faq-title">
        <div className={`${CONTAINER} grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start`}>
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <SectionHeading id="faq-title" eyebrow="FAQs" title="Questions," muted="Answered." />
            <p className="mt-6 text-sm text-gray-500 leading-relaxed">
              Can&rsquo;t find what you&rsquo;re looking for? Email us at{' '}
              <a href={contactHref} className="text-black underline underline-offset-2 break-words">
                {programme.contactEmail}
              </a>
              .
            </p>
          </div>
          <div className="lg:col-span-8 hairline-grid grid rounded-xl overflow-hidden">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.q}
                summary={<h3 className="text-base md:text-lg font-bold text-black leading-snug">{faq.q}</h3>}
              >
                <p className="text-sm md:text-base text-gray-500 leading-relaxed max-w-2xl">{faq.a}</p>
              </AccordionItem>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA (inverted) */}
      <section className="py-20 border-t border-black/10 bg-black text-center">
        <div className="max-w-3xl mx-auto px-6">
          <p className="eyebrow eyebrow-invert mb-4">{programme.shortName} · Next batch {programme.batchStart.label}</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight text-balance">
            {programme.tagline}
          </h2>
          <p className="mt-6 text-white/60 leading-relaxed">
            Registrations close on {programme.registrationDeadline.label}.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#apply"
              className="w-full sm:w-auto bg-white text-black font-sans font-semibold text-sm px-8 py-3.5 rounded-lg btn-press inline-flex items-center justify-center gap-2 hover:bg-white/85"
            >
              Apply for A-PENT <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
            <a
              href="#curriculum"
              className="w-full sm:w-auto border border-white/20 text-white font-sans font-medium text-sm px-8 py-3.5 rounded-lg btn-press inline-flex items-center justify-center hover:border-white/50 hover:bg-white/5 transition-all"
            >
              Explore Curriculum
            </a>
          </div>
        </div>
      </section>

      {/* Grievance redressal - sits directly above the site footer. */}
      <section className="bg-white" aria-labelledby="grievance-title">
        <div className="max-w-7xl mx-auto px-6 pt-16">
          <div className="border border-black/10 rounded-lg bg-black/[0.02] p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-xl">
              <h2 id="grievance-title" className="font-mono text-xs text-black uppercase tracking-widest mb-3">
                Grievance Redressal
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Have a concern about the {programme.shortName} programme, your enrolment, fees or refunds?
                Write to our grievance desk and we will respond within{' '}
                <span className="text-black font-medium">48 hours (business days)</span>.
              </p>
            </div>
            <a
              href={`mailto:${GRIEVANCE_EMAIL}?subject=${encodeURIComponent(`${programme.shortName} grievance`)}`}
              className="inline-flex items-center gap-2 self-start md:self-auto border border-black/10 rounded-lg px-5 py-3 font-mono text-xs text-black hover:border-black/30 transition-all break-all"
            >
              <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
              {GRIEVANCE_EMAIL}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
