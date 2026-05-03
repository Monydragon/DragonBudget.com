# DragonBudget.com

Static GitHub Pages site for Dragon Budget.

- Site files live in the repository root.
- Main page: [index.html](/home/monydragon/Projects/Github/Web/DragonBudget.com/index.html).
- Planning documents live in [docs](/home/monydragon/Projects/Github/Web/DragonBudget.com/docs).
- Email capture setup lives in [docs/Email Capture Setup.md](</home/monydragon/Projects/Github/Web/DragonBudget.com/docs/Email Capture Setup.md>).
- The static site currently has 63 public HTML pages across product, guide, trust, demo, launch, support, and QA sections.
- Key planning/polish pages include [advisor](/home/monydragon/Projects/Github/Web/DragonBudget.com/advisor/index.html), [features](/home/monydragon/Projects/Github/Web/DragonBudget.com/features/index.html), [roadmap](/home/monydragon/Projects/Github/Web/DragonBudget.com/roadmap/index.html), [site map](/home/monydragon/Projects/Github/Web/DragonBudget.com/site-map/index.html), [design direction](/home/monydragon/Projects/Github/Web/DragonBudget.com/design-direction/index.html), and [launch plan](/home/monydragon/Projects/Github/Web/DragonBudget.com/launch-plan/index.html).
- Internal page links point directly to `index.html` files so local `file://` navigation opens pages instead of directory listings.
- Latest polish pass: blue dragon-head PNG for the icon, mascot, and advisor mark; one top navigation menu; no negative currency displays in calculator/demo results; and public copy cleaned of internal build labels.

To publish on GitHub Pages, set Pages to deploy from the `main` branch and repository root. The root `CNAME` file is set for `dragonbudget.com`. The Cloudflare/GitHub HTTPS checklist lives in [docs/Cloudflare HTTPS Setup.md](/home/monydragon/Projects/Github/Web/DragonBudget.com/docs/Cloudflare%20HTTPS%20Setup.md).

## Site Checks

Run the local quality gate before publishing:

```bash
python3 tools/check_site.py
```

The check verifies public HTML copy, local links and assets, sitemap/canonical sync, JSON-LD parsing, and the Early Alpha signup path. GitHub Actions runs the same check on pushes and pull requests.
