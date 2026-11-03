/**
 * Content for the CAAPT training programme page (app/(site)/caapt).
 *
 * Every fact that changes between batches - fee, dates, registration link,
 * refund wording - lives in `programme` at the top, so a new batch is a
 * one-object edit rather than a hunt through JSX.
 */

export const programme = {
  shortName: 'CAAPT',
  name: 'Certified Agentic AI Penetration Tester',
  tagline: 'Build. Automate. Test. Secure.',
  contactEmail: 'contact@dedcellsecurity.in',

  /** In rupees. Drives both the displayed price and the Course structured data. */
  feeInr: 21500,
  /** ISO dates drive the structured data; the labels are what readers see. */
  batchStart: { iso: '2026-12-01', label: '1 December 2026' },
  registrationDeadline: { iso: '2026-11-27', label: '27 November 2026' },
  /**
   * External registration/payment link. Leave empty to route every "Apply"
   * button to the on-page application form; set it to add a "Register Now"
   * button beside the form.
   */
  registrationUrl: '',
  refundPolicy:
    'Fees are refundable only if you request a refund before attending your second live session. After you have attended two sessions, the fee is non-refundable.',
} as const;

export const feeLabel = `₹${programme.feeInr.toLocaleString('en-IN')}`;

export const keyFacts = [
  { label: 'Duration', value: '6 Weeks' },
  { label: 'Mode', value: 'Online Programme' },
  { label: 'Learning Hours', value: '48–60 Hours' },
  { label: 'Hands-on', value: 'Practical Labs' },
  { label: 'Final Project', value: 'Hands-on Capstone' },
];

export const progression = [
  'Cybersecurity fundamentals',
  'Offensive security methodologies',
  'Vulnerability discovery and assessment',
  'Exploitation fundamentals',
  'AI-assisted security automation',
  'Agentic AI development for security workflows',
];

export type Week = { number: string; title: string; track: string; topics: string[] };

export const curriculum: Week[] = [
  {
    number: '01',
    title: 'Cybersecurity & Lab Foundations',
    track: 'Foundations',
    topics: [
      'Cybersecurity fundamentals and the CIA triad',
      'Networking fundamentals',
      'TCP/IP, DNS, HTTP and common protocols',
      'Linux fundamentals and terminal usage',
      'Kali Linux environment setup',
      'Building an isolated penetration testing lab',
    ],
  },
  {
    number: '02',
    title: 'Reconnaissance & Enumeration',
    track: 'Offensive Security',
    topics: [
      'Passive and active reconnaissance',
      'OSINT fundamentals',
      'Nmap scanning and service discovery',
      'Service and version enumeration',
      'Web technology fingerprinting',
      'SMB, SSH and HTTP enumeration',
    ],
  },
  {
    number: '03',
    title: 'Vulnerability Assessment & Web Security',
    track: 'Offensive Security',
    topics: [
      'OWASP Top 10',
      'HTTP request and response analysis',
      'Burp Suite',
      'SQL injection fundamentals',
      'Cross-site scripting',
      'Authentication and access-control issues',
      'Vulnerability scanning',
      'CVE, CVSS and vulnerability reporting',
    ],
  },
  {
    number: '04',
    title: 'Exploitation & Blue Team Fundamentals',
    track: 'Offensive + Defensive',
    topics: [
      'Metasploit fundamentals in isolated labs',
      'Exploitation concepts',
      'Privilege escalation fundamentals',
      'Misconfiguration identification',
      'System hardening',
      'Security logs and indicators of compromise',
      'SIEM fundamentals',
      'Incident response and MITRE ATT&CK',
    ],
  },
  {
    number: '05',
    title: 'AI, LLMs & Security Automation',
    track: 'AI Security',
    topics: [
      'Large language model fundamentals',
      'Prompt engineering',
      'Local LLM deployment using Ollama',
      'AI-assisted security workflows',
      'Python-based scan output processing',
      'Automated vulnerability analysis',
      'AI-assisted report generation',
      'Understanding LLM hallucinations and limitations',
    ],
  },
  {
    number: '06',
    title: 'Agentic AI & Autonomous Security Systems',
    track: 'Agentic AI',
    topics: [
      'AI agents and agent architecture',
      'Planning, tools and memory',
      'Function calling and API integration',
      'Model Context Protocol (MCP)',
      'Building security-focused AI agents',
      'Permission management',
      'Sandboxing and approval workflows',
      'Human-in-the-loop security automation',
      'Audit logging and evidence validation',
    ],
  },
];

export const capstoneSteps = [
  { title: 'Define Scope', body: 'Load an authorised testing scope. Anything outside it is refused.' },
  { title: 'Recon & Scan', body: 'Run approved reconnaissance and scanning workflows only.' },
  { title: 'Process Output', body: 'Parse raw scan output into structured, machine-readable data.' },
  { title: 'Explain & Classify', body: 'Use an LLM to explain each finding and classify it.' },
  { title: 'Assess Severity', body: 'Rate severity and organise the supporting evidence.' },
  { title: 'Generate Report', body: 'Produce a structured vulnerability report for review.' },
  { title: 'Govern Every Action', body: 'Permissions, human approval and an audit log throughout.' },
];

export const labs = [
  { group: 'Attack', tools: ['Kali Linux', 'Nmap', 'Burp Suite', 'Wireshark', 'Metasploit'] },
  { group: 'Target', tools: ['OWASP Juice Shop', 'WebGoat', 'DVWA', 'Isolated virtual machines'] },
  { group: 'Automate', tools: ['Ollama', 'LLMs', 'Python', 'AI agents'] },
  { group: 'Defend', tools: ['Security logs', 'Packet captures', 'Lightweight SIEM'] },
];

export const outcomes = [
  'Understand core networking and cybersecurity concepts.',
  'Perform structured reconnaissance and enumeration.',
  'Identify common web application vulnerabilities.',
  'Understand exploitation and defensive security fundamentals.',
  'Use AI models in security workflows.',
  'Process vulnerability scan outputs using Python.',
  'Build basic agentic AI security workflows.',
  'Develop an AI-assisted penetration testing copilot.',
];

export const structure = [
  { label: 'Duration', value: '6 Weeks' },
  { label: 'Mode', value: 'Online' },
  { label: 'Weekly Commitment', value: '8–10 Hours' },
  { label: 'Total Learning Time', value: '48–60 Hours' },
];

export const format = ['Guided Learning', 'Practical Labs', 'Assignments', 'Capstone'];

export const audience = [
  'College students',
  'Aspiring cybersecurity professionals',
  'Ethical hacking enthusiasts',
  'Developers and software engineers',
  'IT professionals',
  'Anyone interested in AI-powered cybersecurity',
];

export const prerequisites = [
  'Basic computer literacy',
  'A laptop capable of running the lab environment',
  'An interest in cybersecurity and AI',
  'Commitment to 8–10 hours per week',
];

export const deliverables = [
  'Guided practical labs',
  'Lab setup documentation',
  'Security tool cheat sheets',
  'Practical assignments',
  'Vulnerability assessment report templates',
  'AI and LLM starter code',
  'Agentic AI starter code',
  'AutoSec AI capstone resources',
  'CEH v13 preparation study material',
  'CAAPT programme completion certificate',
];

/** Recommended lab machine. Shown in the FAQ; confirm before each batch. */
export const laptopSpec =
  'A 64-bit laptop with hardware virtualisation (Intel VT-x or AMD-V) enabled, 16 GB RAM recommended (8 GB minimum), around 100 GB of free storage and a quad-core processor. Windows, macOS or Linux all work. A dedicated GPU is optional; small local models run on CPU, just more slowly.';

export const faqs = [
  {
    q: 'What is CAAPT?',
    a: 'CAAPT (Certified Agentic AI Penetration Tester) is a six-week online training programme by Dedcell Security. It takes you from offensive security fundamentals through to building AI-powered security automation and your own penetration testing copilot.',
  },
  {
    q: 'How long is the programme?',
    a: 'Six weeks, with 8–10 hours of learning per week - roughly 48–60 hours in total across guided learning, labs, assignments and the capstone project.',
  },
  {
    q: 'Is this programme suitable for beginners?',
    a: 'Yes. Week 1 starts with cybersecurity, networking and Linux fundamentals, and every later week builds on it. You need basic computer literacy and the commitment to practise each week.',
  },
  {
    q: 'Do I need prior penetration testing experience?',
    a: 'No. No professional penetration testing experience is required. Some familiarity with programming helps in Weeks 5 and 6, but the starter code and guided labs are designed so you can follow along.',
  },
  {
    q: 'What laptop configuration do I need?',
    a: laptopSpec,
  },
  {
    q: 'Is the programme conducted online?',
    a: 'Yes. CAAPT is fully online. Labs run in an isolated environment on your own machine, set up with our lab documentation in Week 1.',
  },
  {
    q: 'Will I build a real AI security project?',
    a: 'Yes. The capstone is AutoSec AI - a working AI-assisted penetration testing copilot that processes scan output, explains and classifies findings, and generates structured reports, with scope controls, human approval and audit logging built in.',
  },
  {
    q: 'Will I receive a certificate?',
    a: 'Yes. Learners who complete the programme requirements receive a CAAPT programme completion certificate issued by Dedcell Security. It is a certificate of programme completion, not an accreditation from any external certification body.',
  },
  {
    q: 'Does this programme include the CEH certification exam?',
    a: 'No. CAAPT includes CEH v13 preparation study material only. It does not include the CEH exam, an exam voucher or the CEH certification, which are administered separately by EC-Council. CAAPT is not affiliated with or endorsed by EC-Council.',
  },
];
