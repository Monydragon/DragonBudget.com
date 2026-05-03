# Dragon Budget Email Capture Setup

Goal: collect Early Alpha tester emails from a static site without adding a paid backend.

## Current site path

- Public page: `/alpha/`
- Current signup link: `mailto:alpha@dragonbudget.com`
- Consent language: testing invitations, feedback requests, occasional product updates or promotions, and removal on request.

## Lowest-cost setup

1. In Cloudflare, enable Email Routing for `dragonbudget.com`.
2. Add a custom address: `alpha@dragonbudget.com`.
3. Add a custom address: `support@dragonbudget.com`.
4. Forward both addresses to the owner's normal inbox.
5. Send a test email from the `/alpha/` page and `/support/` page on desktop and mobile.
6. Keep a simple spreadsheet with columns for email, name, source, consent date, notes, and removal date.

## Cleaner form setup

Use a free form tool when you want structured responses instead of inbox collection.

Recommended fields:

- Email address, required.
- Name, optional.
- What do you want to test?, optional.
- Consent checkbox, required: "I agree to receive Dragon Budget testing invitations, feedback requests, and occasional product updates or promotions. I can ask to be removed at any time."

After creating the form, replace the `mailto:alpha@dragonbudget.com` link in `alpha/index.html` with the public form URL. Run:

```bash
python3 tools/check_site.py
```

## Ongoing maintenance

- Export the email list before each testing wave.
- Remove anyone who asks to be removed.
- Do not request bank logins, account numbers, or sensitive financial details through the form.
- Update `privacy/index.html` before adding analytics, accounts, payment, cloud sync, or bank connections.
