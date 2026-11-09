# Pages CMS setup and editing guide

The code integration is ready. Content lives in `content/*.json`; the editor schema is `.pages.yml` at the **Git repository root**, alongside `package.json`. Existing layouts, palettes, particles, and GSAP animations stay in code.

## Connect your account (one time)

1. Commit and push these changes to `mysilence1408/digital-sustainability-website` on GitHub.
2. Open https://app.pagescms.org/ and sign in with GitHub.
3. Install/authorize the Pages CMS GitHub App for that repository.
4. Select the repository and the branch your website deploys from. Pages CMS reads `.pages.yml` from that branch.
5. You should see **Home page**, **About / Team**, **Project page**, **Contact page**, and **Site / Navigation / Footer**, plus media libraries.

No Pages CMS API key, database, or Next.js CMS server is needed. Your account authorization must be completed by you; it has not been performed by the code integration.

Official setup: https://pagescms.org/docs/quick-start/

## What you can edit

| Editor | Editable content |
| --- | --- |
| Home page | Hero title lines and copy; About, Challenge, Solution, and Features copy; illustrated card images, three steps and messages; illustration labels; feature captions |
| About / Team | Page headings, member names, roles, biographies, and head portraits; add/reorder/remove members |
| Project page | Title/subtitle, three gallery images and alt text, any number of story paragraphs, video upload or direct hosted video URL, poster, overlay text, and metadata |
| Contact page | Headings, form labels/placeholders/messages, image, decorative SVG lettering, and captions |
| Site / Navigation / Footer | Global title/description, four navigation labels/paths, menu text, footer text, and university link |

Lists that belong to a fixed layout have an enforced size: three hero lines, three steps per illustrated card, four feature cards, and four navigation items. Keep navigation paths pointed at existing routes: `/`, `/about`, `/project`, `/contact`.

The SVG art, colors, typography, and animation settings are intentionally not exposed as layout controls. Longer headings may wrap differently; check the mobile page after editing.

## Images and video

Upload images through **Images** (`public/images` → `/images`) and clips through **Videos** (`public/videos` → `/videos`). Choose them in the relevant image/file field. Do not include `public` in a web URL. Existing media is already selectable; replacing content does not require renaming files or editing TSX.

For a team member, use a closely cropped **transparent PNG/WebP head portrait**. The GPU effect uses the uploaded pixels directly. Keep the background removed to preserve the floating-head appearance. The member list and particle image list use the same source, so names and photos stay in sync after reordering.

The project video has an optional **URL**. If provided, it overrides the uploaded **Src** file. Use a direct HTTPS `.mp4`/`.webm` media URL, not a YouTube/Vimeo watch-page URL. Leave URL blank to use the local file. For large films, use an external video host/CDN to avoid growing the Git repository.

Image fields use local uploads so Next.js image optimization needs no new remote-domain configuration. Team images are also local so WebGL texture sampling works without cross-origin image restrictions.

## Long project text

Each item in **Paragraphs** is one paragraph. Add a new item for a new paragraph. Use plain text rather than HTML; React escapes it safely. The word-opacity animation automatically follows each paragraph's length and remeasures text wrapping.

## Publishing and local development

Saving in Pages CMS writes commits to the selected GitHub branch. Your public website changes only after that commit is deployed.

- If using Vercel, import/connect this GitHub repository, choose **Next.js**, and select your production branch. The repository root is the app root; the outer Windows `website` directory is not part of the repository.
- Use the existing `npm run build` command. It validates CMS content before building.
- Keep EmailJS environment values in your host's environment settings, not in CMS content. The CMS does not configure email delivery.
- With a different host, enable its GitHub deployment integration or run your usual build/deploy process after a CMS save.
- For local development, save or commit your local work, then `git pull` the CMS changes and run `npm run dev`. Local edits do not automatically upload to Pages CMS; CMS changes do not automatically appear in an unpulled local checkout.

Run `npm run validate:content` to check JSON against the editor schema and verify every referenced local image/video exists. This also runs automatically before production builds, catching missing files, blank required fields, invalid URLs, and malformed fixed-size lists.

Your Pages CMS account and hosting connection still need the manual setup above. No repository push, account installation, or deployment was performed as part of this integration.

Configuration reference: https://pagescms.org/docs/configuration/
