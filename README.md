# AI for Marketing

A self-paced learning site and downloadable course ebook from **AI Training Camp**.

- **Learning site:** 8 illustrated modules. Each lesson has a hands-on activity (sort it, spot the problem, what would you do, put it in order, quick check, build a prompt), plus before/after prompt comparisons, flashcards, a practice task, and a quiz (75% pass mark).
- **Tools:** a Prompt Builder that scores prompts live, a searchable prompt library, and a printable certificate.
- **Motivation:** XP, levels, a daily streak, stage badges and a celebration when a module is completed. Progress is saved in the learner's browser.
- **Ebook:** `ebook/AI-for-Marketing.pdf`. This is a course-style book with no quizzes. The hands-on practice lives on the site.

Live site (once GitHub Pages is on): https://zionkiwiamarshall-dot.github.io/ai-for-marketing/

## Publish with GitHub Pages
Settings → Pages → Source: *Deploy from a branch* → Branch: `main`, folder `/ (root)` → Save.

## Edit the course
- `content/course.js`: modules, lessons, practice tasks and quizzes
- `content/activities.js`: in-lesson activities, flashcards, diagrams, before/after examples and Prompt Builder presets
- `assets/art.js`: the SVG illustration library (it picks up the course colours automatically)

The site and the ebook read the same files, so they stay in sync.

## Rebuild the ebook after editing
```bash
SITE_URL="https://zionkiwiamarshall-dot.github.io/ai-for-marketing/" node ebook/build.js   # writes ebook/ebook.html
python3 ebook/render.py                                                        # writes the PDF (needs: pip install playwright && playwright install chromium)
```

## Structure
```
index.html          learning site entry
assets/style.css    theme
assets/app.js       site engine (dashboard, lessons, activities, flashcards, builder, quiz, library, certificate)
assets/art.js       SVG illustrations and diagrams
content/activities.js  interactive layer
content/course.js   all course content
ebook/build.js      builds the ebook HTML from the content
ebook/render.py     renders the PDF
ebook/*.pdf         the downloadable ebook
```
