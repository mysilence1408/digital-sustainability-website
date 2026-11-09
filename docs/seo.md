# SEO setup and publishing

## Already configured

- Unique CMS-editable title and description for Home, About, Project, and Contact.
- An absolute canonical URL for each route, using the production address in **Site / Navigation / Footer → Production website address** (`content/site.json`, `url`).
- Page-specific Open Graph and X/Twitter metadata, with the existing 1200 × 630 `src/app/opengraph-image.png` sharing image.
- `/robots.txt`, pointing crawlers to `/sitemap.xml`; the sitemap lists the four public routes without invented modification dates.
- WebSite JSON-LD on the home page and WebPage/AboutPage/ContactPage JSON-LD on the corresponding pages, using the real visible titles and descriptions. No fabricated reviews, organization details, or software ratings.
- A main content landmark, keyboard skip link, English document language, and no-JavaScript fallback for the project's image/title reveal.
- Production pages permit indexing. Local development and Vercel preview deployments emit `noindex`; previews return an empty sitemap. Canonical URLs always use the configured production domain.

Layouts, GSAP animations, particle rendering, and CMS editing remain intact.

## After deploying

1. Check that the production address in Pages CMS is correct. Use the HTTPS origin only, without a page path. Update it if you move to a custom domain, then redeploy.
2. Open `/robots.txt` and `/sitemap.xml` on that public domain. They should return successfully without authentication. The production pages and `/opengraph-image.png` also need to be publicly accessible.
3. Add the domain or URL-prefix property in [Google Search Console](https://search.google.com/search-console/). Complete its ownership-verification process with your own account.
4. Submit `sitemap.xml` in Search Console's Sitemaps section. Use URL Inspection to check the home and project pages and request indexing when they are ready.
5. Review search performance and Core Web Vitals after Google has collected real production data. This code setup does not submit your site, verify ownership, or guarantee indexing/rankings.

## Ongoing editing

Edit each page's **Search / browser title** fields in Pages CMS. Use concise, descriptive titles and distinct descriptions that match the visible page. Keep image alt text descriptive. If you replace the share image, keep the filename `opengraph-image.png`, commit it, and redeploy. Social apps may retain an older cached preview until they fetch the URL again.

References: [Google SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [site-name structured data](https://developers.google.com/search/docs/appearance/site-names).
