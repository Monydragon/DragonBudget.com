# DragonBudget.com Cloudflare HTTPS Setup

Last checked: 2026-05-02

## Current Repo State

- `CNAME` is present at the repository root and contains `dragonbudget.com`.
- Canonical URLs, Open Graph URLs, `robots.txt`, and `sitemap.xml` use `https://dragonbudget.com`.
- No page, CSS, or JavaScript file references site assets over `http://`.
- The only `http://` string currently expected in the repo is the sitemap XML namespace.

## Current DNS Check

The apex domain is pointed at GitHub Pages:

```text
dragonbudget.com A
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153

dragonbudget.com AAAA
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```

The `www` subdomain points to the GitHub Pages user host:

```text
www.dragonbudget.com CNAME monydragon.github.io
```

## Current Certificate Check

HTTPS certificate validation is working.

```text
Subject: dragonbudget.com
Issuer: Let's Encrypt R12
SAN: dragonbudget.com, www.dragonbudget.com
Valid: 2026-05-02 through 2026-07-31
```

## Remaining Required Action

Plain HTTP is still serving a `200 OK` response instead of redirecting to HTTPS. Before treating launch as finished, enable one of these:

1. Preferred if Cloudflare DNS records are DNS-only:
   - GitHub repo `Settings` -> `Pages`
   - Confirm custom domain is `dragonbudget.com`
   - Wait for the DNS/certificate checkmark
   - Enable `Enforce HTTPS`

2. Preferred if Cloudflare records are proxied through Cloudflare:
   - Cloudflare `SSL/TLS` -> `Overview`
   - Set encryption mode to `Full (strict)`
   - Cloudflare `SSL/TLS` -> `Edge Certificates`
   - Turn on `Always Use HTTPS`

## If GitHub Says Certificate Has Not Been Issued

The public certificate currently resolves correctly from outside GitHub, so this message usually means the GitHub Pages settings screen has not refreshed its certificate job yet.

Try this sequence:

1. In Cloudflare DNS, temporarily set the GitHub Pages records to DNS-only, not proxied.
2. Confirm the apex records are only GitHub Pages:
   - `A @ 185.199.108.153`
   - `A @ 185.199.109.153`
   - `A @ 185.199.110.153`
   - `A @ 185.199.111.153`
   - `AAAA @ 2606:50c0:8000::153`
   - `AAAA @ 2606:50c0:8001::153`
   - `AAAA @ 2606:50c0:8002::153`
   - `AAAA @ 2606:50c0:8003::153`
3. Confirm `www` is `CNAME monydragon.github.io`.
4. In GitHub repo `Settings` -> `Pages`, make sure the custom domain is exactly `dragonbudget.com`.
5. If the certificate message is still stuck after several minutes, remove the custom domain in GitHub Pages, save, then re-enter `dragonbudget.com` and save again. GitHub documents this as the way to restart certificate provisioning.
6. Wait for the DNS/certificate checkmark, then enable `Enforce HTTPS`.

Do not set Cloudflare SSL/TLS mode to `Flexible` for this setup. Use GitHub Pages HTTPS enforcement directly, or use Cloudflare `Full (strict)` plus `Always Use HTTPS` after GitHub's certificate state is clean.

## Post-Push Verification Commands

Run these after pushing and waiting for GitHub Pages to deploy:

```bash
dig +short A dragonbudget.com
dig +short AAAA dragonbudget.com
dig +short CNAME www.dragonbudget.com

curl -I http://dragonbudget.com/index.html
curl -I https://dragonbudget.com/index.html
curl -I http://www.dragonbudget.com/index.html
curl -I https://www.dragonbudget.com/index.html
```

Expected final behavior:

- `https://dragonbudget.com/index.html` returns `200`.
- `http://dragonbudget.com/index.html` redirects to `https://dragonbudget.com/index.html`.
- `www.dragonbudget.com` redirects to `dragonbudget.com`.
- Browser lock icon is present with no mixed-content warning.

## Official References

- GitHub Pages HTTPS enforcement: https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https
- GitHub Pages custom domains: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages
- Cloudflare Full strict mode: https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/
- Cloudflare Always Use HTTPS: https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/
