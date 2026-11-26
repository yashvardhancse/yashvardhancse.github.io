# YashVardhan Gupta - personal website

Live site: <https://yashvardhangupta.com>

A hand-written static website: plain **HTML, CSS and a little vanilla JavaScript**. There is no framework, no build step, no Node.js and no server code, which is exactly what GitHub Pages can host. Every file in this repository is published as it is.

---

## 1. What is in this repository

```text
index.html                  Home page
about/index.html            About page (the page for your name)
contact/index.html          Hire me / contact page
blog/index.html             Blog index
blog/<article>/index.html   One folder per article (5 new articles)
blog/2026/05/04/how-to-start-open-source-contribution/   The old article, same URL as before
learning-log/index.html     Learning log (CSES progress, books, weekly notes)
explorations/               Rides and travel notes (index + two posts, same URLs as before)
404.html                    "Page not found" page (GitHub Pages serves it automatically)
assets/css                  Stylesheets (site.css is shared, the others belong to one kind of page)
assets/js                   The two small JavaScript files (theme switch, menu, copy button, article helpers)
assets/fonts                Self-hosted fonts (no Google Fonts requests)
assets/img                  Photos (web copies without camera or GPS data)
assets/og                   Social-share cards (1200 x 630), one per page
favicon.ico, favicon.svg, apple-touch-icon.png, icon-*.png, manifest.webmanifest   Icons
robots.txt, sitemap.xml, feed.xml                                                  Search engines and feed readers
CNAME                       Tells GitHub Pages the custom domain. Keep it exactly: yashvardhangupta.com
.nojekyll                   Tells GitHub Pages "do not run Jekyll, serve the files as they are"
README.md                   This file
```

Internal links start from the site root (for example `/assets/css/site.css`, `/blog/`). That is why the site must be opened through a small local web server, not by double-clicking a file (see the next section).

---

## 2. Run it on your computer

You need Python (any 3.x) only for the local preview. It is not needed on GitHub.

```powershell
cd "E:\YashVardhanCSE Personal Website github io\yashvardhancse.github.io"
python -m http.server 8080
```

Then open <http://localhost:8080/> in your browser. Stop the server with `Ctrl+C`.

If `python` is not recognised, use `py -m http.server 8080`.

Another option is the VS Code extension **Live Server**: open the repository folder itself in VS Code, right-click `index.html`, choose **Open with Live Server**.

Quick checks before every publish: open the home page, About, Contact, Blog and one article; switch between the dark and light theme (sun/moon button); narrow the window (F12, then the phone icon) and make sure nothing scrolls sideways; click the main buttons.

The local preview shows Python's own plain "404" for missing pages. The styled `404.html` only appears on the live site.

---

## 3. Publish to GitHub Pages, step by step

Run these commands yourself in **PowerShell**. They never delete your old version: the first step bookmarks it, and Git keeps the full history.

**Step 0. Go to the repository folder and look around**

```powershell
cd "E:\YashVardhanCSE Personal Website github io\yashvardhancse.github.io"
git status
git branch --show-current
git remote -v
```

You should see branch `main` and the remote `https://github.com/yashvardhancse/yashvardhancse.github.io.git`. `git status` lists the new site as modified, deleted (the old Jekyll files such as `_posts`, `_layouts`, `Gemfile`) and untracked files. That is expected. Nothing has been committed or uploaded yet.

**Step 1. Bookmark the current live version (only the first time)**

```powershell
git tag pre-revamp
```

**Step 2. Work on a separate branch**

```powershell
git switch -c revamp
```

**Step 3. Preview one last time** (see section 2), then stop the server with `Ctrl+C`.

**Step 4. Stage and commit everything**

```powershell
git add -A
git status
git commit -m "Revamp site: static HTML/CSS/JS, new blog posts, SEO"
```

`git add -A` also records the deleted old Jekyll files, which is intended. Warnings such as `LF will be replaced by CRLF` are harmless.

**Step 5. Upload the branch** (the live site does not change yet)

```powershell
git push -u origin revamp
```

If a browser window opens asking you to sign in to GitHub, sign in there. If Git asks for a password in the terminal, GitHub no longer accepts account passwords: create a Personal Access Token (GitHub, Settings, Developer settings) and paste that instead.

**Step 6. Go live** - choose one way.

*Way A, on GitHub (recommended):* open the link that `git push` printed, or the repository page, click **Compare & pull request**, then **Create pull request**, then **Merge pull request**, then **Confirm merge**.

*Way B, in PowerShell:*

```powershell
git switch main
git pull
git merge revamp
git push origin main
git push origin pre-revamp
```

**Step 7. Check the deployment** (1 to 3 minutes)

1. Repository, **Actions** tab: the run called **pages build and deployment** turns green.
2. Repository, **Settings**, **Pages**: *Source* is **Deploy from a branch**, branch **main**, folder **/ (root)**; *Custom domain* shows `yashvardhangupta.com`; **Enforce HTTPS** is ticked.
3. Open <https://yashvardhangupta.com/>, <https://yashvardhangupta.com/sitemap.xml> and a blog article. Press `Ctrl+F5` if you still see the old site: GitHub Pages caches files for about 10 minutes.

**Later changes** are simply:

```powershell
git add -A
git commit -m "Describe what you changed"
git push
```

**Rolling back.** On GitHub open the merged pull request and click **Revert**, then merge the pull request it creates. In PowerShell, find the commit with `git log --oneline -5` and run `git revert -m 1 <commit>` for a merge commit (Way A) or `git revert <commit>` for a normal commit (Way B), then `git push origin main`. The tag `pre-revamp` marks the old site if you ever want to look at it (`git switch --detach pre-revamp`, then `git switch main` to come back).

---

## 4. After the first launch: help Google find you

Nobody can guarantee a position in Google. These steps are what actually moves the needle.

1. **Google Search Console** (<https://search.google.com/search-console>): add the property `https://yashvardhangupta.com/` (URL prefix). Easiest verification: download the HTML file Google gives you, put it next to `index.html`, commit and push, then click Verify. Open **Sitemaps** and submit `sitemap.xml`. Use **URL inspection** and **Request indexing** for `/`, `/about/`, `/contact/`, `/blog/` and each article.
2. **Bing Webmaster Tools** (<https://www.bing.com/webmasters>): choose **Import from Google Search Console**.
3. **Use the same photo and the website link everywhere:** LinkedIn, GitHub, Instagram, QuantNova and Calendly profile pictures, and `https://yashvardhangupta.com` as the website on each. This is the strongest signal that connects your name, your photo and your site. The photo on the site is the suit portrait; the site also tells Google it belongs to "YashVardhan Gupta" (also written Yash Vardhan Gupta, Yashvardhan Gupta, yashvardhancse).
4. **Earn real links:** the GitHub profile README, LinkedIn featured section, QuantNova's website, hackathon or community pages that mention you.
5. **Check sharing previews:** paste a page URL into the LinkedIn Post Inspector (<https://www.linkedin.com/post-inspector/>) to refresh the card.
6. **Check analytics:** open your GA4 property, Realtime, then visit the live site and scroll. Google Analytics loads after the first scroll or click, and never on localhost.
7. Be patient: new sites usually take days to weeks to be indexed and longer to rank. The name "yash" on its own is extremely competitive; "yashvardhan gupta" and "yashvardhancse" are realistic targets.

---

## 5. Everyday edits

Use VS Code: open the repository folder, press `Ctrl+Shift+F` (search in all files) or `Ctrl+Shift+H` (replace in all files). After every edit preview the site (section 2) and then run the three commands under "Later changes" in section 3.

### 5.1 Change a sentence, a link or a contact detail

1. Open the page file from section 1 (for example `about/index.html`) and press `Ctrl+F` for the old words.
2. Change only the words between the tags. Do not touch tag names, `class="..."` or `id="..."`.
3. Facts that appear on many pages are best changed with `Ctrl+Shift+H` (replace in all files), then look at each hit before you press replace:
   - Email address: search `yashvardhancse@gmail.com` (every page has it in the footer; the contact and about pages also have it in the text).
   - Calendly link: search `calendly.com/yashvardhancse`.
   - Job title or description: search the old words, for example `Quantitative developer` (they are also repeated inside the `<script type="application/ld+json">` blocks, which Google reads, so change those too).
4. Search engines read the `<title>` and `<meta name="description">` near the top of each file. Titles should stay under about 60 characters and descriptions between 110 and 160.

### 5.2 Update the CSES count and the learning log

The count appears as text in several places, so search for `124` (use `Ctrl+Shift+F`) and update each hit that talks about CSES: `index.html`, `about/index.html` and `learning-log/index.html` (the visible score, the `aria-label` of the grid, the chips that say `CSES 124/300` and the meta descriptions).

**Progress grid on `learning-log/index.html`:** it is 300 small boxes (`<span>`) and the solved ones carry the class `pg-learn-on`. To record six more solved problems, find the first box without the class (the 125th) and add `class="pg-learn-on"` to the next six boxes.

**Progress grid on `index.html` (home page):** it is one small drawing, 30 columns by 10 rows, and the solved cells are the shape of this line (search for `id="solved"`):

```html
<clipPath id="solved"><path d="M0 0H600V80H80V100H0z"/></clipPath>
```

For another number of solved problems, let PowerShell write the new path for you (here 130 solved):

```powershell
$n = 130; $r = [math]::Floor($n / 30); $k = $n % 30
"M0 0H600V$(20 * $r)H$(20 * $k)V$(20 * ($r + 1))H0z"
```

It prints `M0 0H600V80H200V100H0z`; paste it into the `d="..."` of the `solved` path. (If the number divides evenly by 30, use `M0 0H600V<20 x rows>H0z` instead.) Also change the score `<b>124</b>`, and the `aria-label` of the grid, which includes the percentage (`124 of 300 ... 41 percent`).

To add a weekly note on `learning-log/index.html`: search `Week 18`, copy that whole `<li class="card pg-learn-week reveal"> ... </li>` block, paste it **above** the original (newest first), and change the week number, dates and numbers. Then in the bar chart (`<ol class="bars">`) add one more `<li>` at the end, copying the last one: change the number, the `--n:` value (the bar height) and the label (for example `W19`).

### 5.3 Replace the photo

The photo files are in `assets/img/` (`yashvardhan-gupta-portrait-400/640/803/1000`, `-square-1200.jpg`, `-avatar-96/192`, `-rider-wide-560/840`). Keep the file names and the sizes, and replace each format (`.avif`, `.webp`, `.jpg`) or delete the formats you do not provide and remove their `<source>` lines in the pages. **Strip camera and GPS data first** (see section 7). The social-share cards `assets/og/home-v1.png` and `assets/og/about-v1.png` contain the photo too; replace them with new 1200 x 630 images. If you want Facebook, LinkedIn or X to forget the old card, name the new file `home-v2.png` and replace `home-v1.png` in the `og:image` and `twitter:image` lines of `index.html`.

### 5.4 Add a new article

The easy way is the generator, a small Python program that builds every page, the footer lists, the sitemap and the feed from one article file. It is not part of this repository (the repository stays plain HTML). If you still have the `site-generator` folder next to this repository, follow `site-generator/GENERATOR.md`. If you do not, you can ask Claude to add the article for you.

By hand it takes about 20 minutes, because every page repeats the list of articles in its footer:

1. Copy the folder `blog/what-is-market-making/` to `blog/<your-new-slug>/` (lowercase words with dashes) and open its `index.html`.
2. Replace the `<title>`, `<meta name="description">`, `<link rel="canonical">`, every `og:` and `twitter:` line, the JSON-LD block (`headline`, `description`, `url`, `datePublished`, `dateModified`), the `<h1>`, the article text and the references. Copy `assets/og/what-is-market-making-v1.png` to `assets/og/<your-new-slug>-v1.png` and replace it with your own 1200 x 630 image (under 300 KB).
3. Add the article to the lists: a card in `blog/index.html` and in the Writing section of `index.html` (copy an existing card), a `<url>` block in `sitemap.xml` and an `<entry>` in `feed.xml`.
4. Add it to the footer of every page. In VS Code press `Ctrl+Shift+H`, switch on the regular-expression button (`.*`), search for
   `(\s*)<li><a href="/blog/solana-mev-bots-explained/">Solana MEV bots explained</a></li>`
   and replace with
   `$0$1<li><a href="/blog/<your-new-slug>/">Your short title</a></li>`
   then review the hits and replace all.

### 5.5 Analytics, colours and fonts

- Google Analytics: the measurement ID is `G-EZNSFMP4V2`. Search for it to find the small script in the `<head>` of every page. To change the ID use replace in all files; to switch analytics off delete that script block from each page.
- Colours: the first lines of `assets/css/site.css` define the palette: `--c-ink`, `--c-cream`, `--c-paper`, `--c-cobalt` (blue), `--c-tangerine` (orange), `--c-sun` (yellow), `--c-mint` (green). Change a value there and every page follows.
- Fonts live in `assets/fonts/` and are declared at the top of `assets/css/site.css` (`@font-face`).
- When you change a page, update its `<lastmod>` date in `sitemap.xml`.

---

## 6. Troubleshooting

| Problem | What to do |
| --- | --- |
| The site looks broken when I open `index.html` by double-click | Use the local server from section 2. |
| `python` is not recognised | Use `py -m http.server 8080`, or install Python from python.org. |
| GitHub still shows the old site | Wait a few minutes, press `Ctrl+F5`, and check the **Actions** tab for a failed run. |
| The custom domain disappeared in Settings, Pages | The `CNAME` file must be in the repository root and contain exactly `yashvardhangupta.com`. |
| HTTPS warning or "not secure" | Settings, Pages, tick **Enforce HTTPS** (it can take up to an hour after DNS or domain changes). |
| `git push` is rejected | Run `git pull`, fix any conflict it reports, then push again. Never use `--force` unless you know why. |
| I want to throw the new files away and get the old site back (only works before `git commit`) | In the repository folder run `git restore .` and then `git clean -fd`. The old site comes back exactly as it was. After a commit use the rollback in section 3. |
| The page looks unstyled online but fine locally | A file name differs in capitals (GitHub is case-sensitive), or a file was not committed: run `git status`. |
| DNS needs to be set again | The apex domain needs the four GitHub Pages `A` records and the `www` name needs a `CNAME` to `yashvardhancse.github.io`; see GitHub's guide "Managing a custom domain for your GitHub Pages site" for the current addresses. |

---

## 7. Credits and notes

- Fonts (SIL Open Font License 1.1): Bricolage Grotesque, DM Sans, DM Mono, self-hosted in `assets/fonts`.
- Icons and illustrations are inline SVG drawn for this site.
- The articles were drafted with AI assistance and checked against the primary sources listed at the end of each one. Read them and verify every number and claim before you publish or update them, because they appear under your name. The disclosure sentence sits in each article's author box. They are educational and are not financial, legal, tax or security advice.
- Photos: web copies were generated without camera or GPS metadata. Never commit original camera photos. On Windows you can strip metadata in File Explorer: right-click the photo, **Properties**, **Details**, **Remove Properties and Personal Information**.
