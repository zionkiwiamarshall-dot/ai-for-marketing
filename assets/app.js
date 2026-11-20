/* Learning site engine. Reads window.COURSE (content/course.js). No build step, no dependencies. */
(function () {
  "use strict";
  const C = window.COURSE;
  if (!C) { document.body.innerHTML = "<p style='padding:40px'>Course content failed to load.</p>"; return; }

  const PASS = 0.75;
  const KEY = C.id + ":progress:v1";
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- storage (may be unavailable) ---------- */
  let memory = { name: "", modules: {} };
  function load() {
    try { const raw = localStorage.getItem(KEY); if (raw) memory = Object.assign(memory, JSON.parse(raw)); } catch (e) { /* in-memory only */ }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(memory)); } catch (e) { /* ignore */ } }
  function mstate(id) {
    if (!memory.modules[id]) memory.modules[id] = { read: [], notes: "", checks: [], practiceDone: false, answers: {}, best: null };
    return memory.modules[id];
  }

  /* ---------- progress maths ---------- */
  function modParts(m) {
    const s = mstate(m.id);
    const lessonsRead = m.lessons.filter((_, i) => s.read.includes(i)).length;
    const quizPassed = s.best !== null && s.best >= PASS;
    const done = lessonsRead + (s.practiceDone ? 1 : 0) + (quizPassed ? 1 : 0);
    const total = m.lessons.length + 2;
    return { lessonsRead, quizPassed, done, total, complete: done === total, started: done > 0 || !!s.notes };
  }
  function overall() {
    let d = 0, t = 0, complete = 0;
    C.modules.forEach((m) => { const p = modParts(m); d += p.done; t += p.total; if (p.complete) complete++; });
    return { pct: t ? Math.round((d / t) * 100) : 0, complete, total: C.modules.length };
  }
  function nextModule() {
    return C.modules.find((m) => !modParts(m).complete) || C.modules[C.modules.length - 1];
  }

  /* ---------- toast ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
  }
  function copy(text) {
    const done = () => toast("Prompt copied");
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback); else fallback();
    function fallback() {
      const ta = document.createElement("textarea"); ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (e) { toast("Select the text and copy it manually"); }
      ta.remove();
    }
  }

  /* ---------- prompt blocks: add header + copy ---------- */
  function enhancePrompts(root) {
    root.querySelectorAll(".prompt:not([data-ready])").forEach((p) => {
      p.dataset.ready = "1";
      const pre = $("pre", p);
      const head = document.createElement("div");
      head.className = "phead";
      head.innerHTML = "<span>" + esc(p.dataset.title || "Prompt") + "</span><button class='copybtn' type='button'>Copy</button>";
      p.insertBefore(head, pre);
      $(".copybtn", head).addEventListener("click", () => copy(pre.textContent));
    });
  }

  /* ---------- shell ---------- */
  function shell() {
    document.title = C.title + " | " + C.org;
    document.documentElement.style.setProperty("--primary", C.primary);
    document.documentElement.style.setProperty("--primary-deep", C.primaryDeep);
    document.body.innerHTML =
      "<div class='topbar'></div>" +
      "<nav class='topnav'><div class='inner'>" +
      "<a class='brand' href='#/'><span class='brand-mark' aria-hidden='true'></span><span class='brand-name'>" + esc(C.title) + "<small>" + esc(C.org) + "</small></span></a>" +
      "<div class='navlinks'>" +
      "<a href='#/' data-nav='home'>Dashboard</a>" +
      "<a href='#/prompts' data-nav='prompts'>Prompt library</a>" +
      "<a href='#/certificate' data-nav='certificate'>Certificate</a>" +
      "<a href='" + esc(C.ebook) + "' download>Ebook (PDF)</a>" +
      "</div></div></nav>" +
      "<main id='view'></main>" +
      "<footer class='foot'>" + esc(C.title) + " · " + esc(C.org) + " · Your progress is saved in this browser only.</footer>" +
      "<div class='toast' id='toast' role='status' aria-live='polite'></div>";
  }
  function setNav(which) {
    document.querySelectorAll("[data-nav]").forEach((a) => a.classList.toggle("active", a.dataset.nav === which));
  }

  /* ---------- dashboard ---------- */
  function viewHome() {
    setNav("home");
    const o = overall();
    const nm = nextModule();
    const name = memory.name;
    const startLabel = o.pct === 0 ? "Start module 1" : o.complete === o.total ? "Review the course" : "Continue: Module " + (C.modules.indexOf(nm) + 1);

    const stages = C.stages.map((st, i) => {
      const mods = st.modules.map((id) => C.modules.find((m) => m.id === id));
      let d = 0, t = 0; mods.forEach((m) => { const p = modParts(m); d += p.done; t += p.total; });
      const pct = t ? Math.round((d / t) * 100) : 0;
      return "<div class='stage" + (pct === 100 ? " done" : "") + "'><div class='num'>STAGE " + (i + 1) + "</div><h4>" + esc(st.name) + "</h4><p>" + esc(st.desc) + "</p><div class='bar'><i style='width:" + pct + "%'></i></div></div>";
    }).join("");

    const cards = C.modules.map((m, i) => {
      const p = modParts(m);
      const cls = p.complete ? "complete" : p.started ? "started" : "";
      const label = p.complete ? "Complete" : p.started ? p.done + "/" + p.total + " done" : "Not started";
      return "<a class='modcard " + cls + "' href='#/module/" + m.id + "/lessons/0'>" +
        "<div class='meta'><span class='num'>" + String(i + 1).padStart(2, "0") + "</span><span>" + m.minutes + " min · " + m.lessons.length + " lessons</span><span class='status " + cls + "'>" + label + "</span></div>" +
        "<h3>" + esc(m.title) + "</h3><p>" + esc(m.summary) + "</p></a>";
    }).join("");

    $("#view").innerHTML =
      "<section class='hero'>" +
      "<div><span class='eyebrow'>" + esc(C.eyebrow) + "</span>" +
      "<h1>" + C.heroTitle + "</h1>" +
      "<p class='lead'>" + esc(C.lead) + "</p>" +
      "<div class='hero-actions'><a class='btn btn-gold' href='#/module/" + nm.id + "/lessons/0'>" + startLabel + " →</a>" +
      "<a class='btn btn-ghost' href='" + esc(C.ebook) + "' download>Download the ebook</a></div>" +
      (name ? "" : "<form class='namebox' id='nameform'><input id='nameinput' placeholder='Your name (for your certificate)' aria-label='Your name' maxlength='60'><button class='btn btn-primary btn-sm' type='submit'>Save</button></form>") +
      "</div>" +
      "<div class='progress-card'><div class='ring' style='--p:" + o.pct + "'><div><div><strong>" + o.pct + "%</strong><span>done</span></div></div></div>" +
      "<div><h3>" + (name ? "Welcome back, " + esc(name) + "." : "Your progress") + "</h3><p>" + o.complete + " of " + o.total + " modules complete. Each module has lessons, a hands-on task and a short quiz. Pass mark is " + Math.round(PASS * 100) + "%.</p></div></div>" +
      "</section>" +

      "<section class='section'><div class='section-head'><div><h2>How this works</h2><p>" + esc(C.audience) + "</p></div></div>" +
      "<div class='howto'>" +
      "<div><b>1. Read</b><p>Short lessons with real examples and prompts you can copy straight into ChatGPT, Claude, Gemini or Copilot.</p></div>" +
      "<div><b>2. Practise</b><p>Each module ends with a task from real work. Do it with an AI tool, then check your output against the checklist.</p></div>" +
      "<div><b>3. Prove it</b><p>Pass the quiz for each module. Finish all modules to unlock your certificate.</p></div>" +
      "</div></section>" +

      "<section class='section'><div class='section-head'><div><h2>Your growth path</h2><p>Four stages from first prompt to a working AI routine.</p></div></div><div class='path'>" + stages + "</div></section>" +
      "<section class='section'><div class='section-head'><div><h2>Modules</h2><p>Go in order the first time. Later, jump to whatever you need.</p></div>" +
      "<div class='confirm-row noprint' id='resetwrap'><button class='btn btn-ghost btn-sm' id='resetbtn' type='button'>Reset progress</button></div></div>" +
      "<div class='modgrid'>" + cards + "</div></section>";

    const f = $("#nameform");
    if (f) f.addEventListener("submit", (e) => {
      e.preventDefault(); const v = $("#nameinput").value.trim();
      if (v) { memory.name = v; save(); toast("Saved"); viewHome(); }
    });
    $("#resetbtn").addEventListener("click", () => {
      $("#resetwrap").innerHTML = "<span>Clear all progress?</span><button class='btn btn-dark btn-sm' id='yesreset' type='button'>Yes, clear</button><button class='btn btn-ghost btn-sm' id='noreset' type='button'>Cancel</button>";
      $("#yesreset").addEventListener("click", () => { memory = { name: memory.name, modules: {} }; save(); viewHome(); toast("Progress cleared"); });
      $("#noreset").addEventListener("click", viewHome);
    });
  }

  /* ---------- module ---------- */
  function viewModule(id, tab, idx) {
    setNav("");
    const m = C.modules.find((x) => x.id === id);
    if (!m) return viewHome();
    const i = C.modules.indexOf(m);
    const s = mstate(id);
    const p = modParts(m);
    tab = tab || "lessons";

    const tabs = [
      ["lessons", "Lessons", p.lessonsRead === m.lessons.length],
      ["practice", "Practice task", s.practiceDone],
      ["quiz", "Quiz", p.quizPassed]
    ].map(([k, label, ok]) => "<button class='tab" + (tab === k ? " active" : "") + "' data-tab='" + k + "' type='button'><span class='dot" + (ok ? " ok" : "") + "'></span>" + label + "</button>").join("");

    $("#view").innerHTML =
      "<div class='crumbs'><a href='#/'>Dashboard</a> / Module " + (i + 1) + "</div>" +
      "<header class='modhead'><div><span class='eyebrow'>Module " + (i + 1) + " of " + C.modules.length + " · " + m.minutes + " min</span>" +
      "<h1>" + esc(m.title) + "</h1><p>" + esc(m.summary) + "</p>" +
      "<ul class='outcomes'>" + m.outcomes.map((o) => "<li>" + esc(o) + "</li>").join("") + "</ul></div>" +
      "<div class='status " + (p.complete ? "complete" : p.started ? "started" : "") + "'>" + (p.complete ? "Module complete" : p.done + " of " + p.total + " steps") + "</div></header>" +
      "<div class='tabs' role='tablist'>" + tabs + "</div><div id='tabbody'></div>";

    document.querySelectorAll(".tab").forEach((b) => b.addEventListener("click", () => {
      location.hash = "#/module/" + id + "/" + b.dataset.tab + (b.dataset.tab === "lessons" ? "/0" : "");
    }));

    const body = $("#tabbody");
    if (tab === "lessons") renderLesson(m, body, Math.min(Math.max(parseInt(idx, 10) || 0, 0), m.lessons.length - 1));
    else if (tab === "practice") renderPractice(m, body);
    else renderQuiz(m, body);
    window.scrollTo({ top: 0 });
  }

  function renderLesson(m, body, li) {
    const s = mstate(m.id);
    const l = m.lessons[li];
    const toc = m.lessons.map((x, k) =>
      "<button type='button' data-l='" + k + "' class='" + (k === li ? "active " : "") + (s.read.includes(k) ? "read" : "") + "'><span class='check'>" + (s.read.includes(k) ? "✓" : "") + "</span>" + esc(x.title) + "</button>"
    ).join("");
    const isLast = li === m.lessons.length - 1;
    body.innerHTML =
      "<div class='layout'><aside class='toc'>" + toc + "</aside>" +
      "<article class='prose'><h2>" + esc(l.title) + "</h2>" + l.html +
      "<div class='lesson-foot'>" +
      (li > 0 ? "<a class='btn btn-ghost btn-sm' href='#/module/" + m.id + "/lessons/" + (li - 1) + "'>← Previous lesson</a>" : "<span></span>") +
      "<button class='btn btn-primary' id='markread' type='button'>" + (isLast ? "Mark read and go to the practice task →" : "Mark read and continue →") + "</button>" +
      "</div></article></div>";
    enhancePrompts(body);
    body.querySelectorAll(".toc button").forEach((b) => b.addEventListener("click", () => { location.hash = "#/module/" + m.id + "/lessons/" + b.dataset.l; }));
    $("#markread").addEventListener("click", () => {
      if (!s.read.includes(li)) s.read.push(li);
      save();
      location.hash = isLast ? "#/module/" + m.id + "/practice" : "#/module/" + m.id + "/lessons/" + (li + 1);
    });
  }

  function renderPractice(m, body) {
    const s = mstate(m.id);
    const pr = m.practice;
    body.innerHTML =
      "<div class='panel'><h2>" + esc(pr.title) + "</h2><p class='sub'>" + esc(pr.brief) + "</p>" +
      "<ol class='steps'>" + pr.steps.map((x) => "<li>" + x + "</li>").join("") + "</ol>" +
      "<div class='prompt' data-title='Starter prompt'><pre>" + esc(pr.prompt) + "</pre></div>" +
      "<h3>Your working notes</h3><p class='savehint'>Paste the AI's output and your corrections here. Saved automatically in this browser.</p>" +
      "<textarea id='notes' placeholder='Paste the AI output, then note what you changed and why…'>" + esc(s.notes) + "</textarea>" +
      "<h3>Check your work before you call it done</h3><ul class='checklist'>" +
      pr.checklist.map((c, k) => "<li><label><input type='checkbox' data-k='" + k + "'" + (s.checks.includes(k) ? " checked" : "") + "> <span>" + esc(c) + "</span></label></li>").join("") +
      "</ul><div class='lesson-foot'><a class='btn btn-ghost btn-sm' href='#/module/" + m.id + "/lessons/" + (m.lessons.length - 1) + "'>← Back to lessons</a>" +
      "<button class='btn btn-primary' id='pdone' type='button'>Mark task complete and take the quiz →</button></div></div>";
    enhancePrompts(body);
    let t;
    $("#notes").addEventListener("input", (e) => { clearTimeout(t); t = setTimeout(() => { s.notes = e.target.value; save(); }, 300); });
    body.querySelectorAll(".checklist input").forEach((cb) => cb.addEventListener("change", () => {
      const k = +cb.dataset.k;
      s.checks = cb.checked ? Array.from(new Set(s.checks.concat(k))) : s.checks.filter((x) => x !== k);
      save(); syncBtn();
    }));
    function syncBtn() {
      const all = s.checks.length >= pr.checklist.length;
      const b = $("#pdone"); b.disabled = !all;
      b.title = all ? "" : "Tick every checklist item first";
    }
    syncBtn();
    $("#pdone").addEventListener("click", () => {
      s.notes = $("#notes").value; s.practiceDone = true; save();
      location.hash = "#/module/" + m.id + "/quiz";
    });
  }

  /* deterministic option order per question, so the right answer is not always in the same slot */
  function order(mid, qi, n) {
    let h = 2166136261;
    const str = C.id + mid + ":" + qi;
    for (let k = 0; k < str.length; k++) { h ^= str.charCodeAt(k); h = Math.imul(h, 16777619) >>> 0; }
    const a = Array.from({ length: n }, (_, k) => k);
    for (let k = n - 1; k > 0; k--) { h = Math.imul(h ^ (h >>> 15), 2246822519) >>> 0; const j = h % (k + 1); [a[k], a[j]] = [a[j], a[k]]; }
    return a;
  }

  function renderQuiz(m, body) {
    const s = mstate(m.id);
    const qs = m.quiz;
    const letters = "ABCD";
    function draw() {
      const answered = Object.keys(s.answers).length;
      let html = "<div class='panel'><h2>Check your understanding</h2><p class='sub'>" + qs.length + " questions. You need " + Math.ceil(qs.length * PASS) + " correct to pass. Each answer shows an explanation.</p>";
      qs.forEach((q, qi) => {
        const a = s.answers[qi];
        html += "<div class='q'><h4>" + (qi + 1) + ". " + esc(q.q) + "</h4><div class='opts'>" +
          order(m.id, qi, q.options.length).map((oi) => {
            const o = q.options[oi];
            const pos = order(m.id, qi, q.options.length).indexOf(oi);
            let cls = "opt";
            if (a !== undefined) { if (oi === q.answer) cls += " right"; else if (oi === a) cls += " wrong"; }
            return "<button type='button' class='" + cls + "' data-q='" + qi + "' data-o='" + oi + "'" + (a !== undefined ? " disabled" : "") + "><span class='key'>" + letters[pos] + "</span><span>" + esc(o) + "</span></button>";
          }).join("") + "</div>" +
          (a !== undefined ? "<div class='why'><strong>" + (a === q.answer ? "Correct. " : "Not quite. ") + "</strong>" + esc(q.why) + "</div>" : "") + "</div>";
      });
      if (answered === qs.length) {
        const correct = qs.filter((q, qi) => s.answers[qi] === q.answer).length;
        const ratio = correct / qs.length;
        if (s.best === null || ratio > s.best) { s.best = ratio; save(); }
        const passed = ratio >= PASS;
        const idx = C.modules.indexOf(m);
        const next = C.modules[idx + 1];
        const p = modParts(m);
        html += "<div class='score'><strong>" + correct + "/" + qs.length + "</strong><div style='flex:1;min-width:200px'>" +
          (passed ? (p.complete ? "Passed. Module complete." : "Passed. Finish any unread lessons and the practice task to complete the module.") : "Not yet. Re-read the lessons and try again.") +
          "</div><button class='btn btn-ghost btn-sm' id='retry' type='button'>Retry quiz</button>" +
          (passed && next ? "<a class='btn btn-gold btn-sm' href='#/module/" + next.id + "/lessons/0'>Next module →</a>" : "") +
          (passed && !next ? "<a class='btn btn-gold btn-sm' href='#/certificate'>View certificate →</a>" : "") +
          "</div>";
      }
      html += "</div>";
      body.innerHTML = html;
      body.querySelectorAll(".opt:not([disabled])").forEach((b) => b.addEventListener("click", () => {
        s.answers[+b.dataset.q] = +b.dataset.o; save(); draw();
      }));
      const r = $("#retry"); if (r) r.addEventListener("click", () => { s.answers = {}; save(); draw(); });
    }
    draw();
  }

  /* ---------- prompt library ---------- */
  let libFilter = "all", libQuery = "";
  function collectPrompts() {
    const out = [];
    const tmp = document.createElement("div");
    C.modules.forEach((m, i) => {
      m.lessons.forEach((l) => {
        tmp.innerHTML = l.html;
        tmp.querySelectorAll(".prompt").forEach((p) => out.push({ mod: m.id, n: i + 1, title: p.dataset.title || "Prompt", text: $("pre", p).textContent, from: l.title }));
      });
      out.push({ mod: m.id, n: i + 1, title: m.practice.title, text: m.practice.prompt, from: "Practice task" });
    });
    return out;
  }
  function viewPrompts() {
    setNav("prompts");
    const all = collectPrompts();
    $("#view").innerHTML =
      "<div class='section-head'><div><h2 style='font-family:var(--display);font-weight:400;font-size:40px;margin:0'>Prompt library</h2><p>Every prompt in the course, ready to copy. Replace anything in [square brackets] with your own details.</p></div>" +
      "<input class='search' id='q' placeholder='Search prompts…' value='" + esc(libQuery) + "' aria-label='Search prompts'></div>" +
      "<div class='filters'><button class='chip" + (libFilter === "all" ? " active" : "") + "' data-f='all' type='button'>All (" + all.length + ")</button>" +
      C.modules.map((m, i) => "<button class='chip" + (libFilter === m.id ? " active" : "") + "' data-f='" + m.id + "' type='button'>M" + (i + 1) + "</button>").join("") + "</div>" +
      "<div class='libgrid' id='lib'></div>";
    function draw() {
      const q = libQuery.toLowerCase();
      const list = all.filter((p) => (libFilter === "all" || p.mod === libFilter) && (!q || (p.title + " " + p.text).toLowerCase().includes(q)));
      $("#lib").innerHTML = list.length ? list.map((p) =>
        "<div class='prompt' data-title='M" + p.n + " · " + esc(p.title) + "'><pre>" + esc(p.text) + "</pre><div class='from'>From: " + esc(p.from) + "</div></div>").join("")
        : "<p style='color:var(--muted)'>No prompts match that search.</p>";
      enhancePrompts($("#lib"));
    }
    draw();
    $("#q").addEventListener("input", (e) => { libQuery = e.target.value; draw(); });
    document.querySelectorAll(".chip").forEach((c) => c.addEventListener("click", () => { libFilter = c.dataset.f; viewPrompts(); }));
  }

  /* ---------- certificate ---------- */
  function viewCert() {
    setNav("certificate");
    const o = overall();
    if (o.complete < o.total) {
      $("#view").innerHTML = "<div class='panel locked' style='margin:0 auto'><h2>Certificate locked</h2><p>Complete all " + o.total + " modules to unlock it. You have " + o.complete + " complete so far.</p><a class='btn btn-primary' href='#/module/" + nextModule().id + "/lessons/0'>Keep going →</a></div>";
      return;
    }
    const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    $("#view").innerHTML =
      "<div class='cert'><span class='eyebrow'>" + esc(C.org) + "</span><h1>Certificate of Completion</h1><p>This certifies that</p>" +
      "<div class='name' id='certname'>" + esc(memory.name || "Your Name") + "</div>" +
      "<p>has completed all " + o.total + " modules of</p><h2 style='margin:6px 0'>" + esc(C.title) + "</h2>" +
      "<p style='color:var(--muted)'>" + esc(C.certLine) + "</p><div class='rule'></div><p>" + date + "</p></div>" +
      "<div class='noprint' style='text-align:center;margin-top:20px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap'>" +
      "<input class='search' id='cn' placeholder='Name on certificate' value='" + esc(memory.name) + "' style='max-width:280px'>" +
      "<button class='btn btn-ghost btn-sm' id='savecn' type='button'>Update name</button>" +
      "<button class='btn btn-primary btn-sm' id='printc' type='button'>Print or save as PDF</button></div>";
    $("#savecn").addEventListener("click", () => { memory.name = $("#cn").value.trim(); save(); $("#certname").textContent = memory.name || "Your Name"; toast("Name updated"); });
    $("#printc").addEventListener("click", () => window.print());
  }

  /* ---------- router ---------- */
  function route() {
    const parts = location.hash.replace(/^#\/?/, "").split("/");
    if (parts[0] === "module") viewModule(parts[1], parts[2], parts[3]);
    else if (parts[0] === "prompts") viewPrompts();
    else if (parts[0] === "certificate") viewCert();
    else viewHome();
  }

  load();
  shell();
  window.addEventListener("hashchange", route);
  route();
})();
