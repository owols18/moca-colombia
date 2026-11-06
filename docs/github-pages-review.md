# GitHub Pages: design and content review

Review URL: https://owols18.github.io/moca-colombia/

- `main` contains the original Next.js application and source history.
- `gh-pages` contains only the generated static review. GitHub Pages serves this branch from `/`.
- Run `npm run build:pages` to create an isolated export under `tmp/pages-*/out`.
- The helper prints the exact directory to publish; it does not change the original app, `.next` cache, server routes or proxy.
- The export includes both languages, images, fonts, navigation and scroll animations.
- The root opens English. IP detection is not included. The language selector remains available.
- Contact is visual-only: the submit button is disabled and a bilingual review notice is shown. No API or SMTP credentials are deployed.
- Donation integration remains in its existing provisional state.
- Search crawlers are discouraged via robots.txt; this is not access control. The review URL is publicly accessible.

The export prefixes public asset paths for `/moca-colombia` in its staging copy. Next.js handles the prefix on internal links. Normal `npm run dev` and `npm run build` still use the original server application.

Source updates pushed to `main` do not update the review automatically. Rebuild and publish the new export to `gh-pages` to update it. Do not force-push source history or replace `main` with generated HTML.
