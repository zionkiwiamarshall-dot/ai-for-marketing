// Builds ebook/ebook.html from content/course.js. Run from the repo root: node ebook/build.js
// Then render the PDF: python3 ebook/render.py
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, "assets/art.js"), "utf8"), ctx);
vm.runInContext(fs.readFileSync(path.join(root, "content/course.js"), "utf8"), ctx);
const actPath = path.join(root, "content/activities.js");
if (fs.existsSync(actPath)) vm.runInContext(fs.readFileSync(actPath, "utf8"), ctx);
const C = ctx.window.COURSE;
const X = ctx.window.EXTRAS || { figures: {}, compare: {}, art: {}, acts: {} };
const ART = ctx.window.ART || (() => "");
const site = process.env.SITE_URL || "";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const n2 = (i) => String(i + 1).padStart(2, "0");

// Collect prompts for the appendix
const prompts = [];
C.modules.forEach((m, i) => {
  m.lessons.forEach((l) => {
    const re = /<div class="prompt" data-title="([^"]*)"><pre>([\s\S]*?)<\/pre><\/div>/g;
    let mm;
    while ((mm = re.exec(l.html))) prompts.push({ n: i + 1, title: mm[1], body: mm[2] });
  });
});

const css = `
@page { size: A4; margin: 22mm 20mm 24mm 20mm; }
@page cover { margin: 0; }
:root { --primary: ${C.primary}; --primary-deep: ${C.primaryDeep}; --ink: #0F172A; --ink2: #334155; --muted: #64748B; --line: #E2E8F0; --gold: #FFB020; --blue: #4263EB; }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; font-family: "DM Sans", system-ui, sans-serif; font-size: 10.6pt; line-height: 1.6; color: var(--ink2); }
h1, h2, .display { font-family: "Archivo Black", "Arial Black", sans-serif; font-weight: 400; color: var(--ink); letter-spacing: -.005em; }
h3 { font-size: 13pt; color: var(--ink); margin: 18pt 0 4pt; break-after: avoid; }
p { margin: 0 0 8pt; }
ul, ol { margin: 0 0 9pt; padding-left: 16pt; }
li { margin: 2pt 0; }
strong { color: var(--ink); }
code { font-family: "Anonymous Pro", ui-monospace, monospace; font-size: 10pt; background: #F1F5F9; padding: 0 3pt; border-radius: 3pt; }
table { width: 100%; border-collapse: collapse; margin: 8pt 0 12pt; font-size: 9.6pt; break-inside: avoid; }
th { background: var(--ink); color: #fff; text-align: left; padding: 6pt 8pt; font-size: 9pt; }
td { padding: 6pt 8pt; border-bottom: 1px solid var(--line); vertical-align: top; }
tr:nth-child(even) td { background: #F8FAFC; }

/* cover */
.cover { page: cover; height: 297mm; width: 210mm; position: relative; overflow: hidden; background: var(--ink); color: #fff; break-after: page; }
.cover .glow { position: absolute; right: -60mm; top: -60mm; width: 190mm; height: 190mm; border-radius: 50%; background: radial-gradient(circle at 40% 60%, var(--primary), transparent 62%); opacity: .75; }
.cover .glow2 { position: absolute; left: -50mm; bottom: -70mm; width: 150mm; height: 150mm; border-radius: 50%; background: radial-gradient(circle, rgba(255,176,32,.45), transparent 65%); }
.cover .bar { position: absolute; left: 0; right: 0; top: 0; height: 5mm; background: linear-gradient(90deg, var(--primary), var(--blue) 55%, var(--gold)); }
.cover .inner { position: absolute; left: 22mm; right: 22mm; top: 40mm; }
.cover .tag { display: inline-block; background: var(--gold); color: var(--ink); font-weight: 800; font-size: 9pt; letter-spacing: .14em; text-transform: uppercase; padding: 4pt 9pt; border-radius: 20pt; }
.cover h1 { color: #fff; font-size: 52pt; line-height: 1; margin: 16pt 0 14pt; }
.cover .sub { font-size: 15pt; line-height: 1.45; color: #CBD5E1; max-width: 140mm; }
.cover .foot { position: absolute; left: 22mm; right: 22mm; bottom: 22mm; display: flex; justify-content: space-between; align-items: end; font-size: 10pt; color: #94A3B8; }
.cover .foot b { color: #fff; font-size: 12pt; display: block; }

/* front matter */
.front { break-after: page; }
.front h2 { font-size: 24pt; margin: 0 0 12pt; }
.toc { list-style: none; padding: 0; margin: 14pt 0 0; }
.toc li { display: flex; gap: 12pt; align-items: baseline; padding: 8pt 0; border-bottom: 1px solid var(--line); }
.toc .n { font-family: "Archivo Black", sans-serif; color: var(--primary); font-size: 12pt; width: 22pt; }
.toc .t { color: var(--ink); font-weight: 700; font-size: 11.5pt; }
.toc .s { display: block; color: var(--muted); font-weight: 400; font-size: 9.5pt; }
.howbox { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8pt; margin: 14pt 0; }
.howbox div { border: 1px solid var(--line); border-radius: 8pt; padding: 10pt; font-size: 9.6pt; }
.howbox b { display: block; color: var(--ink); font-size: 11pt; margin-bottom: 3pt; }
.path { margin: 10pt 0 0; }
.path div { display: flex; gap: 10pt; padding: 7pt 0; border-bottom: 1px dashed var(--line); }
.path .k { font-family: "Archivo Black", sans-serif; color: var(--primary); width: 62pt; flex: none; font-size: 9pt; padding-top: 2pt; }

/* chapter */
.chapter-open { break-before: page; padding-top: 30mm; }
.chapter-open .num { font-family: "Archivo Black", sans-serif; font-size: 72pt; line-height: 1; color: var(--primary); }
.chapter-open .kicker { font-size: 9pt; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; color: var(--muted); margin-top: 8pt; }
.chapter-open h1 { font-size: 30pt; line-height: 1.08; margin: 6pt 0 12pt; max-width: 105mm; }
.chapter-open .summary { font-size: 13pt; line-height: 1.5; color: var(--ink2); max-width: 105mm; }
.learn { margin: 18pt 0 0; border-left: 3pt solid var(--gold); padding: 6pt 0 6pt 12pt; }
.learn b { display: block; font-size: 9pt; letter-spacing: .14em; text-transform: uppercase; color: var(--ink); margin-bottom: 4pt; }
.lesson { margin-top: 22pt; }
.lesson h2 { font-size: 18pt; line-height: 1.2; margin: 0 0 10pt; padding-top: 10pt; border-top: 2pt solid var(--ink); break-after: avoid; }
.lesson h2 small { display: block; font-family: "DM Sans", sans-serif; font-size: 8.5pt; letter-spacing: .14em; text-transform: uppercase; color: var(--primary-deep); margin-bottom: 3pt; }

.callout { border-radius: 7pt; padding: 9pt 12pt; margin: 10pt 0 12pt; border: 1px solid; break-inside: avoid; font-size: 10pt; }
.callout .label { display: block; font-size: 8pt; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; margin-bottom: 3pt; }
.callout p:last-child { margin-bottom: 0; }
.callout.tip { background: #E6FCF5; border-color: #B2F2DB; } .callout.tip .label { color: #087F5B; }
.callout.warn { background: #FFF8E6; border-color: #FFD98A; } .callout.warn .label { color: #8A5A00; }
.callout.example { background: #EEF2FF; border-color: #C5D0FA; } .callout.example .label { color: #2F49C2; }

.prompt { background: #0F172A; color: #E2E8F0; border-radius: 7pt; margin: 10pt 0 12pt; break-inside: avoid; overflow: hidden; }
.prompt .ph { background: #1E293B; color: var(--gold); font-size: 8pt; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; padding: 5pt 11pt; }
.prompt pre { margin: 0; padding: 9pt 11pt; white-space: pre-wrap; font-family: "Anonymous Pro", ui-monospace, monospace; font-size: 9.4pt; line-height: 1.5; }

.apply { margin-top: 20pt; border: 2pt solid var(--ink); border-radius: 9pt; padding: 13pt 15pt; break-inside: avoid; }
.apply .k { font-size: 8.5pt; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: var(--primary-deep); }
.apply h3 { margin: 3pt 0 5pt; font-size: 14pt; }
.apply .online { margin-top: 8pt; font-size: 9.4pt; color: var(--muted); }

.cover-art { position: absolute; right: 18mm; top: 150mm; width: 120mm; background: #fff; border-radius: 6mm; padding: 5mm; transform: rotate(2deg); box-shadow: 0 10mm 30mm rgba(0,0,0,.35); }
.chapter-open { position: relative; }
.chapter-art { position: absolute; right: 0; top: 24mm; width: 62mm; background: #F1F5F9; border-radius: 6mm; padding: 3mm; }
.figure { margin: 8pt 0 14pt; border: 1px solid var(--line); border-radius: 8pt; padding: 8pt; break-inside: avoid; }
.figure figcaption { font-size: 8.8pt; color: var(--muted); text-align: center; margin-top: 4pt; }
.art { width: 100%; height: auto; display: block; }
.cmp { margin: 12pt 0 14pt; border: 1px solid var(--line); border-radius: 8pt; overflow: hidden; break-inside: avoid; }
.cmp .ch { background: #F1F5F9; padding: 6pt 11pt; font-weight: 800; color: var(--ink); font-size: 10.5pt; }
.cmp .ch span { display: block; font-size: 7.8pt; letter-spacing: .14em; text-transform: uppercase; color: var(--blue); }
.cmp .row { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--line); }
.cmp .row > div { padding: 7pt 11pt; font-size: 9pt; }
.cmp .row > div + div { border-left: 1px solid var(--line); background: #FAFBFC; }
.cmp pre { white-space: pre-wrap; margin: 0; font-family: "Anonymous Pro", monospace; font-size: 8.8pt; line-height: 1.45; }
.cmp .tag { display: inline-block; font-size: 7.5pt; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; padding: 1.5pt 6pt; border-radius: 8pt; margin-bottom: 4pt; color: #fff; }
.cmp .tag.w { background: #E5484D; } .cmp .tag.s { background: #12B886; } .cmp .tag.a { background: var(--ink); color: var(--gold); }
.cmp .verdict { grid-column: 1 / -1; font-size: 9pt; font-weight: 700; padding: 5pt 11pt !important; border-left: 0 !important; }
.cmp .verdict.w { background: #FFF1F1 !important; color: #9B1C1C; } .cmp .verdict.s { background: #E6FCF5 !important; color: #08704F; }
.online-acts { margin-top: 6pt; font-size: 9.2pt; color: var(--ink2); }
.appendix { break-before: page; }
.appendix h1 { font-size: 28pt; margin: 0 0 6pt; }
.appendix .group { font-family: "Archivo Black", sans-serif; color: var(--primary); font-size: 12pt; margin: 18pt 0 4pt; break-after: avoid; }
.back { break-before: page; padding-top: 80mm; text-align: center; }
.back h2 { font-size: 22pt; }
`;

const coverHtml = `
<section class="cover">
  <div class="bar"></div><div class="glow"></div><div class="glow2"></div>
  <div class="inner">
    <span class="tag">${esc(C.org)} · Course book</span>
    <h1>${esc(C.title)}</h1>
    <div class="sub">${esc(C.ebookSubtitle)}</div>
  </div>
  ${X.heroArt ? `<div class="cover-art">${ART(X.heroArt)}</div>` : ""}
  <div class="foot"><div><b>${C.modules.length} modules</b>Lessons, worked examples and ready-to-use prompts</div><div>Edition 1 · ${new Date().getFullYear()}</div></div>
</section>`;

const frontHtml = `
<section class="front">
  <h2>How to use this book</h2>
  <p>${esc(C.lead)}</p>
  <p>${esc(C.audience)}</p>
  <div class="howbox">
    <div><b>Read</b>Each chapter is one module of the course, with short lessons, worked examples and prompts you can copy into ChatGPT, Claude, Gemini or Copilot.</div>
    <div><b>Apply</b>Each chapter ends with a hands-on task from real work. The full task, checklist and quiz are on the learning site.</div>
    <div><b>Keep</b>The appendix collects every prompt in one place. Replace anything in [square brackets] with your own details.</div>
  </div>
  <h3>Your growth path</h3>
  <div class="path">${C.stages.map((s, i) => `<div><span class="k">STAGE ${i + 1}</span><span><strong>${esc(s.name)}.</strong> ${esc(s.desc)}</span></div>`).join("")}</div>
  ${site ? `<p style="margin-top:14pt">Learning site: <strong>${esc(site)}</strong></p>` : ""}
</section>
<section class="front">
  <h2>Contents</h2>
  <ul class="toc">
    ${C.modules.map((m, i) => `<li><span class="n">${n2(i)}</span><span class="t">${esc(m.title)}<span class="s">${esc(m.summary)}</span></span></li>`).join("")}
    <li><span class="n">A</span><span class="t">Prompt library<span class="s">Every prompt in the book, grouped by chapter</span></span></li>
  </ul>
</section>`;

const enhance = (html) => html.replace(/<div class="prompt" data-title="([^"]*)"><pre>/g, '<div class="prompt"><div class="ph">$1</div><pre>');

const chapters = C.modules.map((m, i) => `
<section class="chapter-open">
  ${(X.art || {})[m.id] ? `<div class="chapter-art">${ART(X.art[m.id])}</div>` : ""}
  <div class="num">${n2(i)}</div>
  <div class="kicker">Module ${i + 1} of ${C.modules.length} · about ${m.minutes} minutes</div>
  <h1>${esc(m.title)}</h1>
  <div class="summary">${esc(m.summary)}</div>
  <div class="learn"><b>In this chapter you will learn to</b><ul>${m.outcomes.map((o) => `<li>${esc(o)}</li>`).join("")}</ul></div>
</section>
${m.lessons.map((l, k) => `<section class="lesson"><h2><small>Lesson ${i + 1}.${k + 1}</small>${esc(l.title)}</h2>${figure(m.id + ":" + k)}${enhance(l.html)}${compare(m.id + ":" + k)}</section>`).join("")}
<div class="apply">
  <div class="k">Apply it at work</div>
  <h3>${esc(m.practice.title)}</h3>
  <p>${esc(m.practice.brief)}</p>
  <ol>${m.practice.steps.map((s) => `<li>${s}</li>`).join("")}</ol>
  <div class="online">On the learning site${site ? ` (${esc(site)})` : ""}: the starter prompt and checklist for this task, ${(X.acts[m.id] || []).length} interactive activities, flashcards and the module quiz.</div>
</div>`).join("");

function figure(key) {
  const f = (X.figures || {})[key];
  return f ? `<figure class="figure">${ART(f.art)}${f.caption ? `<figcaption>${esc(f.caption)}</figcaption>` : ""}</figure>` : "";
}
function compare(key) {
  const c = (X.compare || {})[key];
  if (!c) return "";
  const row = (v, t) => `<div class="row"><div><span class="tag ${t}">${v === "weak" ? "Weak prompt" : "Strong prompt"}</span><pre>${esc(c[v].prompt)}</pre></div><div><span class="tag a">AI replies</span><div>${esc(c[v].output).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\n/g, "<br>")}</div></div><div class="verdict ${t}">${esc(c[v].verdict)}</div></div>`;
  return `<div class="cmp"><div class="ch"><span>See the difference</span>${esc(c.title)}</div>${row("weak", "w")}${row("strong", "s")}</div>`;
}
let lastN = 0;
const appendix = `
<section class="appendix">
  <h1>Prompt library</h1>
  <p>Every prompt from the lessons, grouped by chapter. Replace anything in [square brackets] with your own details, and apply the verification habits from Module 1 to every output.</p>
  ${prompts.map((p) => {
    const head = p.n !== lastN ? `<div class="group">${n2(p.n - 1)} · ${esc(C.modules[p.n - 1].title)}</div>` : "";
    lastN = p.n;
    return head + `<div class="prompt"><div class="ph">${p.title}</div><pre>${p.body}</pre></div>`;
  }).join("")}
</section>
<section class="back">
  <h2>${esc(C.title)}</h2>
  <p>${esc(C.org)}</p>
  ${site ? `<p>Continue with the hands-on tasks and quizzes at<br><strong>${esc(site)}</strong></p>` : ""}
</section>`;

const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>${esc(C.title)} | ${esc(C.org)}</title><style>${css}</style></head><body>${coverHtml}${frontHtml}${chapters}${appendix}</body></html>`;
fs.writeFileSync(path.join(__dirname, "ebook.html"), html);
console.log("Wrote ebook/ebook.html with", C.modules.length, "chapters and", prompts.length, "prompts");
