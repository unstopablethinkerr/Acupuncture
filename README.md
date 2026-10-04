# Cumbam Academy of Acupuncture — new site

Static, mobile-first, app-like website (no build step). Works on GitHub Pages.

## 1. Add your images (folder: `asset/`)
Rename your files to these simple names (no spaces/brackets). Any of
png, jpg, jpeg, webp, avif, jfif is auto-detected.

| Your file               | Rename to                 |
|-------------------------|---------------------------|
| logo                    | `asset/logo.png`          |
| app icon                | `asset/app-icon.png` (square PNG, 512x512 ideal) |
| New_Home                | `asset/new-home.jpg`      |
| Latest_News             | `asset/latest-news.jpg`   |
| Academy Photo.avif      | `asset/academy-photo.avif`|
| Students Group Photos   | `asset/students-group.avif`|
| Testimonials (1) … (5)  | `asset/testimonial-1.jpg` … `testimonial-5.jpg` |

`asset/book-pricelist.png` is already included.
Missing images show a soft placeholder, so the site still works.

## 2. Publish on GitHub Pages
1. Create a repo, upload ALL files from this folder (keep the structure).
2. Settings → Pages → Deploy from branch → `main` / root.
3. Open `https://<user>.github.io/<repo>/` on your phone → "Add to Home Screen".

## 3. Things to confirm / edit
- Phone numbers `97882 23366` / `97863 36611` come from the Puthuyir Pathippagam
  flyer (publisher). Replace in `index.html` (search `919788223366`) and `js/app.js` if the academy uses other numbers.
- Addresses (Cumbum, Coimbatore) come from public listings — please verify.
- 2 & 4 Days class details (dates/fees) are placeholders — send details to add them.
- Video playlists show as "Playlist 1…11" — send titles to name them.
  One link in your list (`PLYXY727u5kXc`) looks incomplete and was left out.
- Course fees/eligibility were not available — see prospectus links on Courses page.
- Tamil/English toggle covers menus, headings, hero, About; other body text is English.
