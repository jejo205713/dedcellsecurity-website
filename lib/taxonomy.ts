/**
 * The ONE controlled vocabulary, per docs/seo/02-IA-AND-ROUTING.md §4.
 * Glossary terms, guides, blog posts and resources all reference these slugs.
 *
 * Rule from the plan: "Never free-type category names."
 * This array is what feeds the Keystatic category dropdown, so an editor
 * physically cannot invent a category in the CMS.
 *
 * Adding a category = adding an entry here. Never anywhere else.
 */
export const CATEGORIES = [
  { slug: 'network-security', name: 'Network Security', blurb: 'External/internal pentest, firewalls, VPN, Active Directory.' },
  { slug: 'web-application-security', name: 'Web Application Security', blurb: 'OWASP, logic flaws, secure SDLC.' },
  { slug: 'api-security', name: 'API Security', blurb: 'REST/GraphQL/SOAP, OAuth, JWT.' },
  { slug: 'cloud-security', name: 'Cloud Security', blurb: 'AWS/Azure/GCP, IAM, misconfiguration.' },
  { slug: 'mobile-security', name: 'Mobile Security', blurb: 'Android/iOS, cert pinning, reverse engineering.' },
  { slug: 'digital-forensics', name: 'Digital Forensics', blurb: 'Memory, disk, network and mobile forensics.' },
  { slug: 'incident-response', name: 'Incident Response', blurb: 'Detection, containment, playbooks.' },
  { slug: 'threat-intelligence', name: 'Threat Intelligence', blurb: 'CTI, IOCs, MITRE ATT&CK mapping.' },
  { slug: 'malware-analysis', name: 'Malware Analysis', blurb: 'Static/dynamic analysis, sandboxing, reversing.' },
  { slug: 'soc-operations', name: 'SOC Operations', blurb: 'SOC analyst, SIEM/EDR/XDR, monitoring.' },
  { slug: 'red-team', name: 'Red Team & Adversary Emulation', blurb: 'TTPs, C2, pivoting.' },
  { slug: 'blue-team', name: 'Blue Team & Defensive Security', blurb: 'Hunting, hardening, defensive controls.' },
  { slug: 'vulnerability-management', name: 'Vulnerability Management', blurb: 'VAPT, CVSS, patching, prioritisation.' },
  { slug: 'compliance', name: 'Compliance & Standards', blurb: 'ISO 27001, SOC 2, PCI DSS, NIST CSF.' },
  { slug: 'zero-trust', name: 'Zero Trust', blurb: 'Architecture, identity, microsegmentation.' },
  { slug: 'security-engineering', name: 'Security Engineering', blurb: 'DevSecOps, SAST/DAST, threat modelling.' },
  { slug: 'careers', name: 'Cybersecurity Careers', blurb: 'SOC analyst path, OSCP prep, salary.' },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]['slug'];

/** Shape Keystatic's `fields.select` / `fields.multiselect` expect. */
export const CATEGORY_OPTIONS = CATEGORIES.map((c) => ({
  label: c.name,
  value: c.slug,
}));

const BY_SLUG = new Map(CATEGORIES.map((c) => [c.slug as string, c]));

export function getCategory(slug: string) {
  return BY_SLUG.get(slug);
}

export function categoryName(slug: string): string {
  return BY_SLUG.get(slug)?.name ?? slug;
}

export function isCategorySlug(slug: string): slug is CategorySlug {
  return BY_SLUG.has(slug);
}
