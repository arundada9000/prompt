# Security Policy

## Supported versions

Prompt Architect has no backend and no release train. The current published version is always the supported one.

| Version | Supported |
| --- | --- |
| Live site (https://sajiloprompt.vercel.app) | Yes |
| Anything older | No |

## Reporting a vulnerability

Do not open a public issue for a security problem. Send details privately to [Arun Neupane](https://github.com/arundada9000) via GitHub direct message, or open the security page on the repository for the recommended channel.

Please include:

1. The affected page or file.
2. Steps to reproduce.
3. Impact and a suggested fix if you have one.

You should get an acknowledgement within 48 hours and a fix or workaround plan as soon as it is assessed.

## Security notes for this project

- The app is fully static. There is no server-side processing of user data.
- All user state (selections, presets, history) lives in `localStorage` in the visitor's own browser. Nothing is transmitted anywhere at runtime.
- The service worker is restricted by scope to the same origin only. Third-party requests are never cached or proxied.
- No analytics, tracking libraries, or third-party scripts are included. A future change that adds any of those is a release-blocking security review item.
- Keep dependencies at zero. Every new dependency is a new attack surface; anything added must clear a review before merge.