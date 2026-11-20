# AI for Marketing

A self-paced learning site and downloadable course ebook from **AI Training Camp**.

- **Learning site:** 8 modules with lessons, hands-on practice tasks, quizzes (75% pass mark), a searchable prompt library and a printable completion certificate. Progress is saved in the learner's browser.
- **Ebook:** `ebook/AI-for-Marketing.pdf`. This is a course-style book with no quizzes. The hands-on practice lives on the site.

Live site (once GitHub Pages is on): https://zionkiwiamarshall-dot.github.io/ai-for-marketing/

## Publish with GitHub Pages
Settings → Pages → Source: *Deploy from a branch* → Branch: `main`, folder `/ (root)` → Save.

## Edit the course
All content is in `content/course.js`: modules, lessons, practice tasks and quizzes. The site and the ebook both read from this file, so they stay in sync.

## Rebuild the ebook after editing
```bash
SITE_URL="https://zionkiwiamarshall-dot.github.io/ai-for-marketing/" node ebook/build.js   # writes ebook/ebook.html
python3 ebook/render.py                                                        # writes the PDF (needs: pip install playwright && playwright install chromium)
```

## Structure
```
index.html          learning site entry
assets/style.css    theme
assets/app.js       site engine (dashboard, lessons, practice, quiz, prompt library, certificate)
content/course.js   all course content
ebook/build.js      builds the ebook HTML from the content
ebook/render.py     renders the PDF
ebook/*.pdf         the downloadable ebook
```
