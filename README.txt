A LITTLE WORLD FOR AFNAN — WEBSITE
==================================

How to preview
--------------
1. Unzip the folder.
2. Double-click index.html.
3. For the most reliable preview, you can also run a tiny local server:
   python -m http.server 8000
   Then open http://localhost:8000

How to publish
--------------
Netlify (easiest):
- Go to Netlify Drop and drag the unzipped folder there.
- Netlify will give you a shareable link.

GitHub Pages:
- Create a repository and upload index.html, styles.css, script.js, and the assets folder.
- In Settings > Pages, deploy from the main branch.

Vercel:
- Import the folder/repository as a static site. No build command is required.

Notes
-----
- No backend, database, API key, or external library is required.
- Photos are already optimized for the web.
- Music starts only after the visitor taps the music button (browser requirement).
- Horizontal swipes navigate pages on mobile; arrow keys work on desktop.
- The playful “No” button moves a few times, then becomes a normal “Not now” option.
