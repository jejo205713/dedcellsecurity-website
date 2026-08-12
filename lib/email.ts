/**
 * Strict email address validation, shared by the contact form client and the
 * /api/contact route so both agree on what "valid" means.
 *
 * The old check was /^[^\s@]+@[^\s@]+\.[^\s@]+$/, which accepts anything that
 * has no spaces and one @ - including RFC-legal-but-hostile quoted local parts
 * such as:  "><svg/onload=confirm(1)>"@x.y
 *
 * That value would then be written to the Leads sheet, injected into a
 * notification email, and rendered anywhere leads are displayed. We do not need
 * full RFC 5322 (quoted strings, comments, IP-literal domains); we need the
 * subset that real deliverable addresses actually use. So: a conservative
 * allowlist, and everything else is rejected.
 */

// Local part: dot-separated atoms of a restricted, safe character set.
// No quotes, angle brackets, slashes, parens, semicolons or control chars.
const LOCAL_ATOM = "[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+";
const LOCAL_RE = new RegExp(`^${LOCAL_ATOM}(?:\\.${LOCAL_ATOM})*$`);

// Domain: LDH labels (letters/digits/hyphen, no leading or trailing hyphen),
// at least two labels, alphabetic TLD of 2+ characters.
const LABEL = '[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?';
const DOMAIN_RE = new RegExp(`^(?:${LABEL}\\.)+[A-Za-z]{2,24}$`);

/** Per RFC 5321: 64 octets local, 255 domain, 254 for the whole path. */
const MAX_TOTAL = 254;
const MAX_LOCAL = 64;
const MAX_DOMAIN = 255;

export function isValidEmail(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const email = value.trim();

  if (email.length === 0 || email.length > MAX_TOTAL) return false;

  // Defence in depth against header injection: no CR/LF or other control
  // characters, ever. The allowlists below already exclude them; this makes the
  // intent explicit and survives any future loosening of those patterns.
  // eslint-disable-next-line no-control-regex
  if (/[\x00-\x1f\x7f]/.test(email)) return false;

  const at = email.lastIndexOf('@');
  if (at <= 0 || at === email.length - 1) return false;

  const local = email.slice(0, at);
  const domain = email.slice(at + 1);

  if (local.length > MAX_LOCAL || domain.length > MAX_DOMAIN) return false;
  if (!LOCAL_RE.test(local)) return false;
  if (!DOMAIN_RE.test(domain)) return false;

  return true;
}
