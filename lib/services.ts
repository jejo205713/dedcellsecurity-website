/**
 * The services offered, as listed on /services. Read by /llms.txt and
 * /llms-full.txt. If you add or rename a service card on the services page,
 * update this list in the same commit.
 */
export const services = [
  {
    name: 'Web Application Penetration Testing',
    description:
      'Black-box assessment of web applications - authentication, authorization, business logic and the full OWASP Top 10.',
  },
  {
    name: 'API Security Assessment',
    description: 'REST, GraphQL and SOAP testing - auth, rate limiting, business logic and API abuse.',
  },
  {
    name: 'External Network Penetration Testing',
    description:
      'Internet-facing infrastructure - firewalls, VPNs, public servers and critical service misconfigurations.',
  },
  {
    name: 'Internal Network Assessment',
    description:
      'Internal infrastructure - Windows domains, Linux servers, privilege escalation and lateral movement simulations.',
  },
  {
    name: 'Cloud Security Assessment',
    description:
      'AWS, Azure and GCP architecture review - IAM policies, storage security, security groups and misconfigurations.',
  },
  {
    name: 'Mobile Application Security',
    description:
      'Android and iOS - secure storage, certificate pinning bypass, auth flaws, backend API linking and reverse engineering.',
  },
  {
    name: 'Secure Code Review',
    description:
      'Manual and static review across Java, Python, Node, Go, PHP and C# - secrets, auth handling and architecture.',
  },
  {
    name: 'Remediation Support',
    description:
      'Help fixing vulnerable code, securing APIs and hardening cloud, with remediation verified before deploy.',
  },
] as const;
