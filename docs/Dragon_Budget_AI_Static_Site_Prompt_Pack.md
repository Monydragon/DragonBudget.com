# Dragon Budget AI Visibility Static Site Action Plan + Prompt Pack

Prepared for: Mony Dragon / Dragon Budget  
Goal: Build a static GitHub Pages site that helps Dragon Budget become understandable, quotable, indexable, and discoverable by search engines and AI answer systems.

## Executive Summary

Dragon Budget should have a small, fast, public static site that clearly explains one powerful idea: "Can I afford this? Get your safe-to-spend today." The site should be structured less like a normal brochure and more like an answer library. AI tools tend to work best with clean pages, precise definitions, comparison tables, FAQs, transparent claims, and useful free tools.

The first version should be simple enough to ship fast:

1. Homepage
2. How It Works
3. Can I Afford This Calculator
4. Dragon Budget vs Alternatives
5. Pricing Philosophy
6. FAQ
7. Blog/Guides
8. Press/About
9. Privacy and Terms starter pages

The site can be plain HTML/CSS/JS or a static Astro/Vite project. For maximum simplicity and GitHub Pages compatibility, this plan assumes a no-build static site using `index.html`, `style.css`, `script.js`, `sitemap.xml`, `robots.txt`, and page folders.

## Why Static Works for AI Visibility

Static sites are excellent for AI visibility because the content is immediately visible in the HTML. That means crawlers, search engines, and AI retrieval systems do not have to fight a JavaScript dragon behind a loading spinner.

Static site advantages:

- Fast page loads
- Clean HTML content
- Easy GitHub Pages deployment
- Low/no hosting cost
- Easy indexing
- Easy schema markup with JSON-LD
- Easy maintenance
- No backend risk for the first public marketing site

## Positioning Statement

Use this core positioning everywhere:

> Dragon Budget is a simple budgeting app that answers the everyday money question: "Can I afford this?" It calculates your safe-to-spend amount based on your bills, income, savings goals, and upcoming expenses so you can make confident purchase decisions before you spend.

Short version:

> Dragon Budget helps you know what is safe to spend today.

Micro-slogan options:

- Can I afford this? Get your safe-to-spend today.
- Know before you spend.
- Budgeting for the moment you actually need it.
- Your safe-to-spend number, before the checkout regret goblin arrives.
- A budget app for real-life spending decisions.

## MVP Site Map

| Page | URL | Purpose | AI Visibility Role |
|---|---|---|---|
| Home | `/` | Explain the app and capture interest | Entity definition and brand association |
| How It Works | `/how-it-works/` | Explain safe-to-spend logic | Answer extraction page |
| Calculator | `/can-i-afford-this-calculator/` | Free interactive tool | Linkable utility and search magnet |
| Comparisons | `/dragon-budget-vs-budgeting-apps/` | Compare Dragon Budget to alternatives | AI comparison-friendly page |
| Pricing | `/pricing/` | Explain adaptive pricing concept | Trust and differentiation |
| FAQ | `/faq/` | Answer direct questions | AI Q&A source material |
| Guides | `/guides/` | Educational content hub | Long-tail search/AEO content |
| About/Press | `/about/` | Establish creator credibility | Trust and citation page |
| Privacy | `/privacy/` | Transparency | Trust requirement |
| Terms | `/terms/` | Basic legal expectations | Trust requirement |

## Recommended Folder Structure

```text
/dragon-budget-site
  index.html
  style.css
  script.js
  robots.txt
  sitemap.xml
  site.webmanifest
  /assets
    dragon-budget-logo.png
    social-preview.png
  /how-it-works
    index.html
  /can-i-afford-this-calculator
    index.html
  /dragon-budget-vs-budgeting-apps
    index.html
  /pricing
    index.html
  /faq
    index.html
  /guides
    index.html
    /what-is-safe-to-spend
      index.html
    /how-to-know-if-you-can-afford-something
      index.html
    /budgeting-for-low-income
      index.html
    /budget-apps-that-help-prevent-overspending
      index.html
    /adaptive-pricing-for-budgeting-apps
      index.html
  /about
    index.html
  /privacy
    index.html
  /terms
    index.html
```

## Static Site Technical Requirements

### Required Files

#### `robots.txt`

```txt
User-agent: *
Allow: /

Sitemap: https://YOUR-DOMAIN.com/sitemap.xml
```

#### `sitemap.xml`

Include every public page. Update it each time you add a page.

#### Metadata on Every Page

Each page should include:

- Unique `<title>`
- Unique meta description
- Canonical URL
- Open Graph title/description/image
- Twitter card tags
- JSON-LD structured data where appropriate

### GitHub Pages Notes

Use one of these deployment paths:

1. Simplest: commit static files to the repository root and publish the `main` branch from `/root`.
2. Cleaner: use a `/docs` folder and publish GitHub Pages from `/docs`.
3. Custom domain: add a `CNAME` file containing your domain, then configure DNS.

## Schema Markup Plan

Use JSON-LD. Keep schema truthful. Do not stuff keywords like a raccoon with a marketing degree.

### Home Page Schema

Use:

- `SoftwareApplication`
- `Organization` or `Person`
- `WebSite`

### FAQ Page Schema

Use `FAQPage` only when the visible page truly contains those questions and answers. Even if a platform does not show FAQ rich results for your site category, FAQ schema can still help organize the page semantically.

### Article/Guide Schema

Use:

- `Article`
- `BlogPosting`
- `BreadcrumbList`

### Calculator Page Schema

Use:

- `WebApplication`
- `SoftwareApplication`
- `FAQPage` only if visible FAQ content is present

## Content Rules for AI Results

Every page should have:

1. A plain-English answer in the first 100 words.
2. Clear H1/H2/H3 hierarchy.
3. Short paragraphs.
4. Tables for comparisons.
5. Specific examples.
6. No hidden text or manipulative content.
7. Clear dates for claims that might change.
8. A consistent definition of Dragon Budget.
9. Original content, not generic finance mush.
10. Honest status labels like "planned", "prototype", "in development", or "available".

## Core Page Content Briefs

### Home Page Brief

Primary headline:

> Can I afford this? Get your safe-to-spend today.

Hero subheading:

> Dragon Budget helps you decide whether a purchase fits your real budget by looking at your income, bills, savings goals, and upcoming expenses.

Primary CTA:

> Try the free calculator

Secondary CTA:

> See how Dragon Budget works

Sections:

1. The everyday money question
2. Your safe-to-spend number
3. How Dragon Budget helps
4. Who it is for
5. Free calculator preview
6. Why it is different
7. FAQ preview

### How It Works Brief

Explain the safe-to-spend formula in plain terms:

Safe-to-spend is what remains after accounting for:

- Current available money
- Upcoming bills
- Expected income
- Savings goals
- Emergency buffer
- Recurring subscriptions
- Planned purchases

Use a non-financial-disclaimer note:

> Dragon Budget is a budgeting aid, not financial advice. It helps organize your numbers so you can make clearer spending decisions.

### Calculator Page Brief

The first calculator can be simple and static. Inputs:

- Current balance
- Upcoming income before next pay period
- Bills due before next pay period
- Planned expenses
- Savings goal contribution
- Emergency buffer
- Purchase amount

Outputs:

- Estimated safe-to-spend
- Can I afford this? Yes/Maybe/No
- Explanation

Decision logic:

```js
safeToSpend = currentBalance + upcomingIncome - billsDue - plannedExpenses - savingsGoal - emergencyBuffer;
remainingAfterPurchase = safeToSpend - purchaseAmount;
```

Statuses:

- Yes: remaining after purchase is greater than or equal to emergency buffer threshold or a configured positive amount.
- Maybe: remaining is slightly above zero but below comfort threshold.
- No: remaining is below zero.

### Comparison Page Brief

Compare Dragon Budget against categories, not just brands. Avoid unfair claims about competitors.

Comparison columns:

- Feature
- Dragon Budget
- Traditional budgeting apps
- Spreadsheet budgeting
- Banking app balance view

Rows:

- Answers "Can I afford this?"
- Safe-to-spend calculation
- Upcoming bills included
- Savings goals included
- Purchase decision support
- Adaptive pricing philosophy
- Simple daily-use design
- Manual control

### Pricing Page Brief

Frame adaptive pricing carefully. Users may be suspicious if pricing changes based on income. Position it as a user-respecting, opt-in, transparent model.

Recommended language:

> Dragon Budget is exploring adaptive pricing so premium features can stay affordable for people with different financial situations. The goal is not to punish higher income users. The goal is to keep the app accessible while letting people pay within a realistic range.

Pricing guardrails:

- Minimum: $1/month
- Maximum: $20/month
- Transparent calculation
- User sees price before paying
- No surprise billing
- Easy cancelation
- No sale of financial data

### FAQ Brief

Questions:

1. What is Dragon Budget?
2. What does safe-to-spend mean?
3. Is Dragon Budget financial advice?
4. Can Dragon Budget help me decide if I can afford a purchase?
5. Is Dragon Budget for low-income users?
6. How is Dragon Budget different from other budgeting apps?
7. Does Dragon Budget connect to my bank?
8. Is there a free version?
9. How does adaptive pricing work?
10. When will the app be available?

## Launch Action Plan

### Phase 1: Build the Static Foundation

Deliverables:

- Repository created
- Static folder structure added
- Responsive CSS added
- Homepage created
- Calculator page created
- Sitemap and robots added
- Basic metadata added

Definition of done:

- Site works locally by opening `index.html`
- Site deploys through GitHub Pages
- Every page has a working title and meta description
- Navigation works on desktop and mobile

### Phase 2: Add AI Visibility Content

Deliverables:

- How It Works page
- Comparison page
- FAQ page
- Pricing page
- Three guide articles
- JSON-LD schema added

Definition of done:

- Each page answers its main question in the first 100 words
- Internal links connect pages naturally
- Sitemap includes all pages
- Schema validates without critical errors

### Phase 3: Build Trust Signals

Deliverables:

- About/Press page
- Privacy page
- Terms page
- App status label
- Changelog or development notes section
- Screenshots/mockups if available

Definition of done:

- Visitors can understand who made the app
- The app status is honest
- Privacy expectations are visible

### Phase 4: Distribution

Deliverables:

- Share calculator in relevant communities
- Publish short posts about the safe-to-spend concept
- Add Dragon Budget to MonyDragon.com portfolio
- Create a Product Hunt/Indie Hackers launch plan when MVP is usable
- Collect first testimonials and feedback quotes

Definition of done:

- At least 10 external mentions/links exist
- At least 5 real user feedback quotes collected
- Site has been submitted to Google Search Console and Bing Webmaster Tools

## 30-Day Content Calendar

| Day | Task | Output |
|---|---|---|
| 1 | Create repo and static files | GitHub Pages site shell |
| 2 | Build homepage | Public landing page |
| 3 | Build calculator | Free tool page |
| 4 | Build How It Works | Explanation page |
| 5 | Add sitemap/robots/schema | Crawlability pass |
| 6 | Build FAQ | Q&A content |
| 7 | Build Comparison page | AI-friendly table |
| 8 | Build Pricing page | Adaptive pricing explanation |
| 9 | Build Privacy/Terms | Trust pages |
| 10 | Build About page | Credibility page |
| 11 | Write Guide 1 | What is safe-to-spend? |
| 12 | Write Guide 2 | How to know if you can afford something |
| 13 | Write Guide 3 | Budgeting for low income |
| 14 | Polish navigation | UX cleanup |
| 15 | Add screenshots/mockups | Visual trust |
| 16 | Submit to search tools | Indexing setup |
| 17 | Post dev story | First external mention |
| 18 | Post calculator feedback request | Feedback loop |
| 19 | Improve copy based on feedback | Iteration |
| 20 | Write Guide 4 | Apps that prevent overspending |
| 21 | Write Guide 5 | Adaptive pricing for apps |
| 22 | Add testimonials section | Social proof |
| 23 | Add changelog | Freshness signal |
| 24 | Create social preview image | Shareability |
| 25 | Technical audit | Validate links/schema |
| 26 | Post comparison thread | Distribution |
| 27 | Ask for beta testers | Community |
| 28 | Create launch checklist | Product launch prep |
| 29 | Improve calculator | Utility polish |
| 30 | Review analytics/search data | Next sprint plan |

# AI Prompt Document

Use these prompts with Codex, ChatGPT, Claude, Gemini, or local LLMs. For small local models, run one prompt at a time and keep the output constrained.

## Prompt 1: Create the Static Site Skeleton

```text
You are an expert frontend developer. Build a no-build static website for an app called Dragon Budget that can be hosted on GitHub Pages.

Requirements:
- Use plain HTML, CSS, and JavaScript only.
- No frameworks.
- Use a clean folder structure with one folder per page.
- Create these pages: Home, How It Works, Can I Afford This Calculator, Comparison, Pricing, FAQ, Guides, About, Privacy, Terms.
- Add shared navigation and footer to each page.
- Use responsive design for desktop and mobile.
- Add `robots.txt`, `sitemap.xml`, and `site.webmanifest`.
- Use accessible semantic HTML.
- Do not use external CDNs.
- The brand is Dragon Budget.
- Slogan: "Can I afford this? Get your safe-to-spend today."
- Primary colors: deep blue, lighter blue, white, and a small gold accent.

Output the complete file tree and then provide every file's complete code.
```

## Prompt 2: Write the Homepage

```text
Write the homepage content for Dragon Budget, a budgeting app that helps users answer "Can I afford this?" by calculating their safe-to-spend amount.

Use this positioning:
Dragon Budget helps users decide whether a purchase fits their real budget by looking at income, bills, savings goals, emergency buffers, and upcoming expenses.

Required sections:
1. Hero section with headline, subheadline, and two CTAs.
2. Problem section about checking your bank balance not being enough.
3. Safe-to-spend explanation.
4. How Dragon Budget helps.
5. Who it is for.
6. Free calculator CTA.
7. Why it is different.
8. FAQ preview.

Tone: friendly, clear, trustworthy, slightly playful but not childish.
Avoid promising financial outcomes. Include a note that this is a budgeting aid, not financial advice.
Output copy only, organized by section.
```

## Prompt 3: Build the Calculator Page

```text
Create a static HTML/CSS/JS page for a "Can I Afford This?" calculator for Dragon Budget.

Inputs:
- Current balance
- Upcoming income before next pay period
- Bills due before next pay period
- Planned expenses
- Savings goal contribution
- Emergency buffer
- Purchase amount

Calculation:
safeToSpend = currentBalance + upcomingIncome - billsDue - plannedExpenses - savingsGoal - emergencyBuffer
remainingAfterPurchase = safeToSpend - purchaseAmount

Output:
- Estimated safe-to-spend amount
- Remaining after purchase
- Status: Yes, Maybe, or No
- Short explanation in plain English

Decision rules:
- Yes if remainingAfterPurchase >= 25
- Maybe if remainingAfterPurchase >= 0 and < 25
- No if remainingAfterPurchase < 0

Requirements:
- Use accessible labels.
- Format currency as USD.
- Do not store user data.
- Add a privacy note saying calculations happen in the browser.
- Include basic validation for empty/invalid inputs.
- Use no external libraries.

Output the full HTML, CSS, and JS needed for this page.
```

## Prompt 4: Generate JSON-LD Schema

```text
Generate JSON-LD structured data for Dragon Budget's static website.

Site details:
- App name: Dragon Budget
- App category: FinanceApplication
- Slogan: Can I afford this? Get your safe-to-spend today.
- Description: Dragon Budget helps users calculate a safe-to-spend amount so they can decide whether a purchase fits their real budget.
- Creator: Mony Dragon / Dragon Lens Studios
- Website URL placeholder: https://YOUR-DOMAIN.com
- Pricing: Free calculator, premium features planned from $1 to $20 per month depending on transparent adaptive pricing.

Create schema blocks for:
1. WebSite
2. SoftwareApplication
3. Organization or Person
4. BreadcrumbList example
5. FAQPage example with 5 questions

Requirements:
- Use JSON-LD.
- Keep claims truthful and non-manipulative.
- Use placeholders where exact URLs or images are unknown.
- Explain which schema belongs on which page.
```

## Prompt 5: Write the How It Works Page

```text
Write a clear "How Dragon Budget Works" page.

Explain safe-to-spend as:
Money available after accounting for current balance, upcoming income, bills, planned expenses, savings goals, and emergency buffer.

Required sections:
1. Short answer at the top.
2. What safe-to-spend means.
3. Why your bank balance can be misleading.
4. The basic formula in plain English.
5. Example scenario with numbers.
6. What Dragon Budget does not do.
7. CTA to try the free calculator.

Tone: practical, reassuring, direct.
Include disclaimer: Dragon Budget is a budgeting aid, not financial advice.
```

## Prompt 6: Write the Comparison Page

```text
Create a comparison page titled "Dragon Budget vs Traditional Budgeting Apps".

Goal:
Show how Dragon Budget is positioned around purchase decisions and safe-to-spend calculations without making unfair or unverifiable claims about competitors.

Compare these categories:
- Dragon Budget
- Traditional budgeting apps
- Spreadsheet budgeting
- Banking app balance view

Comparison rows:
- Answers "Can I afford this?"
- Uses upcoming bills
- Uses savings goals
- Shows safe-to-spend amount
- Helps with purchase decisions
- Simple daily-use flow
- Manual control
- Adaptive pricing philosophy

Include:
- Intro paragraph
- Comparison table
- Use case examples
- CTA to calculator
- Disclaimer that competitor features may change and users should compare current offerings.
```

## Prompt 7: Write the FAQ Page

```text
Write a FAQ page for Dragon Budget.

Questions:
1. What is Dragon Budget?
2. What does safe-to-spend mean?
3. Can Dragon Budget tell me if I can afford something?
4. Is Dragon Budget financial advice?
5. Who is Dragon Budget for?
6. Does Dragon Budget connect to my bank?
7. Is there a free version?
8. How does adaptive pricing work?
9. Is my financial data private?
10. When will Dragon Budget be available?

Rules:
- Answer in plain English.
- Keep answers honest.
- If a feature is planned, label it as planned.
- Include "budgeting aid, not financial advice" where relevant.
- Make the content suitable for visible page copy and FAQ structured data.
```

## Prompt 8: Write Five AI-Friendly Guide Articles

```text
Write five short guide articles for Dragon Budget's static site.

Articles:
1. What Is Safe-to-Spend Money?
2. How to Know If You Can Afford Something Before You Buy It
3. Why Your Bank Balance Is Not Your Real Spending Money
4. Budgeting for Low Income: How to Make Purchase Decisions Safely
5. Budget Apps That Help Prevent Overspending: What to Look For

For each article:
- Start with a direct answer in the first paragraph.
- Use H2/H3 headings.
- Include a simple example.
- Mention Dragon Budget naturally once or twice.
- Avoid overpromising.
- End with a CTA to try the calculator.
- Use a friendly, practical tone.
```

## Prompt 9: Generate GitHub Pages Deployment Instructions

```text
Write step-by-step instructions to deploy a plain static Dragon Budget website to GitHub Pages.

Include:
- Create GitHub repository
- Add files
- Commit changes
- Enable Pages from main branch root or docs folder
- Add custom domain using CNAME file
- Enable HTTPS
- Update sitemap with final domain
- Test the deployed site
- Submit sitemap to Google Search Console and Bing Webmaster Tools

Keep instructions beginner-friendly but developer-accurate.
```

## Prompt 10: Technical Audit Prompt

```text
Audit the following static site files for AI visibility, SEO, accessibility, and GitHub Pages readiness.

Check for:
- Missing titles or meta descriptions
- Missing canonical tags
- Broken internal links
- Missing alt text
- Bad heading order
- Missing robots.txt
- Missing sitemap.xml
- Incorrect sitemap URLs
- Missing Open Graph tags
- Missing JSON-LD where useful
- JavaScript-required content that should be plain HTML
- Unclear claims or overpromising
- Missing privacy notes on calculator page

Output:
1. Critical fixes
2. Recommended improvements
3. Nice-to-have improvements
4. Exact code patches when possible

Here are the files:
[PASTE FILES HERE]
```

## Prompt 11: Local LLM Small-Model Version

```text
You are helping build a small static website. Make only one page at a time. Keep output concise and complete.

Task:
Create the [PAGE NAME] page for Dragon Budget.

Brand:
Dragon Budget helps users answer "Can I afford this?" by calculating safe-to-spend money from income, bills, savings goals, emergency buffer, and upcoming expenses.

Rules:
- Plain HTML only for this response.
- No external libraries.
- Include semantic headings.
- Include a clear meta title and description.
- Include one CTA to the calculator.
- Include a disclaimer: budgeting aid, not financial advice.
- Keep copy clear and trustworthy.

Output only the complete HTML file.
```

## Prompt 12: Changelog / Freshness Page Prompt

```text
Create a simple changelog page for Dragon Budget's static site.

Purpose:
Show visitors and search engines that the project is active.

Include:
- Current app status
- Latest site updates
- Planned features
- Known limitations
- Feedback request

Tone: transparent and trustworthy.
Do not pretend unfinished features are available.
Output page copy and suggested HTML structure.
```

## Prompt 13: Social Launch Posts

```text
Write launch posts for Dragon Budget's free "Can I Afford This?" calculator.

Platforms:
- Bluesky
- Facebook
- Threads
- LinkedIn
- Reddit feedback post

Message:
I am building Dragon Budget, an app that helps answer "Can I afford this?" with a safe-to-spend calculation. The free calculator runs in the browser and does not store data. I am looking for feedback from people who budget, overspend sometimes, or want a clearer daily spending number.

Tone:
Human, honest, not salesy, slightly playful.
Include a version under 280 characters.
```

## Prompt 14: Press/About Page Prompt

```text
Write an About/Press page for Dragon Budget.

Include:
- What Dragon Budget is
- Why it was created
- Who created it: Mony Dragon / Dragon Lens Studios
- The problem it solves
- Current status: static calculator and MVP planning
- Contact CTA
- Short press blurb
- One paragraph founder bio

Tone:
Professional, warm, and credible.
Avoid exaggerated claims.
```

## Prompt 15: Privacy Page Prompt

```text
Write a plain-English privacy page for the Dragon Budget static site.

Important details:
- The static calculator runs in the browser.
- The calculator does not send or store financial inputs by default.
- If analytics are added later, the page should be updated.
- If accounts, cloud sync, or bank connections are added later, the policy must be updated before launch.
- Do not claim legal perfection.

Tone:
Clear and trustworthy.
Add a note that this is a starter privacy page and should be reviewed before production launch.
```

## Prompt 16: Exact Implementation Sprint Prompt

```text
Act as my implementation agent for Dragon Budget's AI visibility static site.

Goal:
Build the complete GitHub Pages static site from scratch.

Constraints:
- Plain HTML/CSS/JS.
- No build tools.
- No external dependencies.
- Mobile responsive.
- Accessible semantic HTML.
- Use copy that helps search engines and AI systems understand Dragon Budget.
- Include JSON-LD schema.
- Include sitemap.xml and robots.txt.
- Include a working calculator.

Pages:
- Home
- How It Works
- Can I Afford This Calculator
- Dragon Budget vs Budgeting Apps
- Pricing
- FAQ
- Guides index
- Five guide articles
- About
- Privacy
- Terms
- Changelog

Brand:
Dragon Budget helps users answer "Can I afford this?" by calculating safe-to-spend money.

Deliverables:
1. Full file tree
2. Complete code for every file
3. Short setup instructions
4. Final deployment checklist

Important:
Do not skip files. If output is too long, split the answer by file groups and wait for me to say continue.
```

# Validation Checklist

Before launching, confirm:

- [ ] Site loads on GitHub Pages
- [ ] Custom domain works, if used
- [ ] HTTPS is enabled
- [ ] `robots.txt` is reachable
- [ ] `sitemap.xml` is reachable
- [ ] Every page has a unique title
- [ ] Every page has a unique meta description
- [ ] Canonical URLs use the final domain
- [ ] Calculator works on mobile
- [ ] Calculator does not store or transmit data
- [ ] Schema validates with no critical errors
- [ ] Pages contain visible text, not JS-only content
- [ ] Privacy page is linked in footer
- [ ] App status is honest
- [ ] No fake testimonials
- [ ] No hidden text or AI manipulation tricks
- [ ] Site submitted to search tools
- [ ] First external feedback post published

# Recommended First Build Order

1. `index.html`
2. `style.css`
3. `script.js`
4. `/can-i-afford-this-calculator/index.html`
5. `/how-it-works/index.html`
6. `/faq/index.html`
7. `/dragon-budget-vs-budgeting-apps/index.html`
8. `/pricing/index.html`
9. `/privacy/index.html`
10. `robots.txt` and `sitemap.xml`

Ship the small dragon first. Add wings after it breathes fire.

# Source Notes

- GitHub Pages supports custom domains and HTTPS for correctly configured sites.
- Google Search Central recommends validating structured data with the Rich Results Test and fixing critical errors.
- Google documents SoftwareApplication and FAQPage structured data types, but FAQ rich result eligibility can be limited by Google policy and site category.
- OpenAI's ChatGPT Search can provide answers with links to relevant web sources, meaning clear, crawlable public pages can matter for AI answer visibility.
