# Security Policy

## Supported Deployment Model

This project is deployed as a static site on GitHub Pages.

- No private server runtime is available on GitHub Pages.
- Never place private API keys in frontend build variables.
- Access control must be enforced by Firebase Authentication + Firestore Rules.

## Reporting a Vulnerability

If you discover a security issue, please do not open a public issue with exploit details.

1. Contact the repository owner privately.
2. Include impact, reproduction steps, and suggested mitigation.
3. Allow time for patch and coordinated disclosure.

## Security Baseline Checklist

- [x] Firestore default deny + owner-only access rules
- [x] GitHub Pages deploy without embedding repository secrets
- [x] Dependabot for dependency updates
- [x] GitHub Actions security checks (CodeQL + npm audit)
- [x] CSP and browser hardening headers in index.html

## Firebase Hardening Recommendations

1. Keep Google sign-in provider only (disable unused providers).
2. Restrict Firebase Authentication authorized domains to your production domains.
3. Enforce Firestore indexes and avoid overly broad queries.
4. Enable App Check for web clients when feasible.
5. Enable Firestore backups and audit logs in production.
