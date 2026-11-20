/* Learning site engine. Reads window.COURSE (content/course.js), window.EXTRAS (content/activities.js)
   and window.ART (assets/art.js). No build step, no dependencies. */
(function () {
  "use strict";
  const C = window.COURSE;
  const X = window.EXTRAS || { terms: {}, acts: {}, art: {}, figures: {}, presets: [], compare: {} };
  const ART = window.ART || (() => "");
  if (!C) { document.body.innerHTML = "<p style='padding:40px'>Course content failed to load.</p>"; return; }

  const PASS = 0.75;
  const KEY = C.id + ":progress:v1";
  const XP = { lesson: 10, act: 15, practice: 30, quiz: 40, cards: 10 };
  const LEVELS = [[0, "Explorer"], [150, "Practitioner"], [400, "Skilled user"], [750, "Advanced user"], [1100, "AI champion"]];
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- storage (may be unavailable) ---------- */
  let memory = { name: "", modules: {}, acts: {}, cards: {}, days: [], celebrated: {}, builder: {} };
  function load() {
    try { const raw = localStorage.getItem(KEY); if (raw) memory = Object.assign(memory, JSON.parse(raw)); } catch (e) { /* in-memory only */ }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(memory)); } catch (e) { /* ignore */ } }
  function mstate(id) {
    if (!memory.modules[id]) memory.modules[id] = { read: [], notes: "", checks: [], practiceDone: false, answers: {}, best: null };
    return memory.modules[id];
  }
  function today() { const d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }
  function markDay() { const t = today(); if (!memory.days.includes(t)) { memory.days.push(t); memory.days = memory.days.slice(-120); save(); } }
  function streak() {
    let n = 0; const d = new Date();
    for (;;) {
      const k = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      if (memory.days.includes(k)) { n++; d.setDate(d.getDate() - 1); } else break;
    }
    return n;
  }

  /* ---------- progress maths ---------- */
  function modParts(m) {
    const s = mstate(m.id);
    const lessonsRead = m.lessons.filter((_, i) => s.read.includes(i)).length;
    const quizPassed = s.best !== null && s.best >= PASS;
    const done = lessonsRead + (s.practiceDone ? 1 : 0) + (quizPassed ? 1 : 0);
    const total = m.lessons.length + 2;
    const acts = (X.acts[m.id] || []).filter((_, i) => memory.acts[m.id + ":" + i]).length;
    return { lessonsRead, quizPassed, done, total, acts, complete: done === total, started: done > 0 || !!s.notes || acts > 0 };
  }
  function overall() {
    let d = 0, t = 0, complete = 0;
    C.modules.forEach((m) => { const p = modParts(m); d += p.done; t += p.total; if (p.complete) complete++; });
    return { pct: t ? Math.round((d / t) * 100) : 0, complete, total: C.modules.length };
  }
  function xp() {
    let n = 0;
    C.modules.forEach((m) => {
      const p = modParts(m), s = mstate(m.id);
      n += p.lessonsRead * XP.lesson + p.acts * XP.act + (s.practiceDone ? XP.practice : 0) + (p.quizPassed ? XP.quiz : 0) + (memory.cards[m.id] ? XP.cards : 0);
    });
    return n;
  }
  function level(n) {
    let i = 0; LEVELS.forEach((l, k) => { if (n >= l[0]) i = k; });
    const next = LEVELS[i + 1];
    return { name: LEVELS[i][1], idx: i + 1, next: next ? next[0] : null, base: LEVELS[i][0] };
  }
  function badges() {
    const b = C.stages.map((st) => ({ name: st.name, got: st.modules.every((id) => modParts(C.modules.find((m) => m.id === id)).complete) }));
    const allActs = C.modules.every((m) => (X.acts[m.id] || []).every((_, i) => memory.acts[m.id + ":" + i]));
    b.push({ name: "Hands-on", got: allActs && C.modules.length > 0 });
    b.push({ name: "7-day streak", got: streak() >= 7 });
    return b;
  }
  function nextModule() { return C.modules.find((m) => !modParts(m).complete) || C.modules[C.modules.length - 1]; }

  /* ---------- toast, copy, confetti ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 1900);
  }
  function copy(text, label) {
    const done = () => toast(label || "Copied");
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback); else fallback();
    function fallback() {
      const ta = document.createElement("textarea"); ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (e) { toast("Select the text and copy it manually"); }
      ta.remove();
    }
  }
  function confetti() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cv = document.createElement("canvas"); cv.className = "confetti"; document.body.appendChild(cv);
    const ctx = cv.getContext("2d"); cv.width = innerWidth; cv.height = innerHeight;
    const cols = [getComputedStyle(document.documentElement).getPropertyValue("--primary"), "#FFB020", "#4263EB", "#0F172A", "#12B886"];
    const ps = Array.from({ length: 140 }, () => ({ x: innerWidth / 2 + (Math.random() - .5) * 200, y: innerHeight * .35, vx: (Math.random() - .5) * 14, vy: -Math.random() * 14 - 4, r: Math.random() * 6 + 4, c: cols[Math.floor(Math.random() * cols.length)], a: Math.random() * 6 }));
    let f = 0;
    (function tick() {
      ctx.clearRect(0, 0, cv.width, cv.height);
      ps.forEach((p) => { p.vy += .35; p.x += p.vx; p.y += p.vy; p.a += .2; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c.trim(); ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); ctx.restore(); });
      if (++f < 150) requestAnimationFrame(tick); else cv.remove();
    })();
  }
  function maybeCelebrate(m) {
    if (modParts(m).complete && !memory.celebrated[m.id]) {
      memory.celebrated[m.id] = true; save(); confetti();
      toast("Module " + (C.modules.indexOf(m) + 1) + " complete! +" + (XP.quiz) + " XP");
    }
  }

  /* ---------- prompt blocks + figures ---------- */
  function enhancePrompts(root) {
    $$(".prompt:not([data-ready])", root).forEach((p) => {
      p.dataset.ready = "1";
      const pre = $("pre", p);
      const head = document.createElement("div");
      head.className = "phead";
      head.innerHTML = "<span>" + esc(p.dataset.title || "Prompt") + "</span><span class='pbtns'><button class='copybtn tobuilder' type='button' title='Open in Prompt Builder'>Edit in builder</button><button class='copybtn' data-copy type='button'>Copy</button></span>";
      p.insertBefore(head, pre);
      $("[data-copy]", head).addEventListener("click", () => copy(pre.textContent, "Prompt copied"));
      $(".tobuilder", head).addEventListener("click", () => { memory.builder = { free: pre.textContent }; save(); location.hash = "#/builder"; });
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
      "<a href='#/builder' data-nav='builder'>Prompt builder</a>" +
      "<a href='#/prompts' data-nav='prompts'>Prompt library</a>" +
      "<a href='#/certificate' data-nav='certificate'>Certificate</a>" +
      "<a href='" + esc(C.ebook) + "' download>Ebook</a>" +
      "</div><div class='xpchip' id='xpchip' title='Your XP'></div></div></nav>" +
      "<main id='view'></main>" +
      "<footer class='foot'><div class='foot-inner'><span class='brand-mark small' aria-hidden='true'></span><span>" + esc(C.title) + " · " + esc(C.org) + "</span><span class='muted'>Progress is saved in this browser only.</span></div></footer>" +
      "<div class='toast' id='toast' role='status' aria-live='polite'></div>";
  }
  function setNav(which) {
    $$("[data-nav]").forEach((a) => a.classList.toggle("active", a.dataset.nav === which));
    const n = xp(), s = streak();
    $("#xpchip").innerHTML = "<b>" + n + "</b> XP" + (s > 0 ? " · <span class='flame'>●</span> " + s + "d" : "");
  }

  /* ---------- dashboard ---------- */
  function viewHome() {
    setNav("home");
    const o = overall(), nm = nextModule(), name = memory.name;
    const n = xp(), lv = level(n), st = streak();
    const startLabel = o.pct === 0 ? "Start module 1" : o.complete === o.total ? "Review the course" : "Continue: Module " + (C.modules.indexOf(nm) + 1);
    const lvPct = lv.next ? Math.round(((n - lv.base) / (lv.next - lv.base)) * 100) : 100;

    const stages = C.stages.map((stg, i) => {
      const mods = stg.modules.map((id) => C.modules.find((m) => m.id === id));
      let d = 0, t = 0; mods.forEach((m) => { const p = modParts(m); d += p.done; t += p.total; });
      const pct = t ? Math.round((d / t) * 100) : 0;
      return "<div class='stage" + (pct === 100 ? " done" : "") + "'><div class='num'>STAGE " + (i + 1) + "</div><h4>" + esc(stg.name) + "</h4><p>" + esc(stg.desc) + "</p><div class='bar'><i style='width:" + pct + "%'></i></div><div class='stage-mods'>" + mods.map((m) => "<a href='#/module/" + m.id + "/lessons/0'>M" + (C.modules.indexOf(m) + 1) + "</a>").join("") + "</div></div>";
    }).join("");

    const cards = C.modules.map((m, i) => {
      const p = modParts(m);
      const cls = p.complete ? "complete" : p.started ? "started" : "";
      const label = p.complete ? "Complete" : p.started ? p.done + "/" + p.total + " done" : "Not started";
      return "<a class='modcard " + cls + "' href='#/module/" + m.id + "/lessons/0'>" +
        "<div class='modart'>" + ART((X.art || {})[m.id]) + "<span class='num'>" + String(i + 1).padStart(2, "0") + "</span></div>" +
        "<div class='modbody'><div class='meta'><span>" + m.minutes + " min · " + m.lessons.length + " lessons · " + (X.acts[m.id] || []).length + " activities</span><span class='status " + cls + "'>" + label + "</span></div>" +
        "<h3>" + esc(m.title) + "</h3><p>" + esc(m.summary) + "</p>" +
        "<div class='minibar'><i style='width:" + Math.round((p.done / p.total) * 100) + "%'></i></div></div></a>";
    }).join("");

    const bdg = badges().map((b) => "<div class='badge" + (b.got ? " got" : "") + "'><span class='medal'>" + (b.got ? "★" : "☆") + "</span><span>" + esc(b.name) + "</span></div>").join("");

    $("#view").innerHTML =
      "<section class='hero'>" +
      "<div class='hero-copy'><span class='eyebrow'>" + esc(C.eyebrow) + "</span>" +
      "<h1>" + C.heroTitle + "</h1>" +
      "<p class='lead'>" + esc(C.lead) + "</p>" +
      "<div class='hero-actions'><a class='btn btn-gold' href='#/module/" + nm.id + "/lessons/0'>" + startLabel + " →</a>" +
      "<a class='btn btn-ghost' href='#/builder'>Try the prompt builder</a></div>" +
      (name ? "<p class='hello'>Welcome back, <b>" + esc(name) + "</b>.</p>" : "<form class='namebox' id='nameform'><input id='nameinput' placeholder='Your name (for your certificate)' aria-label='Your name' maxlength='60'><button class='btn btn-primary btn-sm' type='submit'>Save</button></form>") +
      "</div><div class='hero-art'>" + ART(X.heroArt) + "</div></section>" +

      "<section class='stats'>" +
      "<div class='stat'><div class='ring' style='--p:" + o.pct + "'><div><strong>" + o.pct + "%</strong></div></div><div><b>Course progress</b><span>" + o.complete + " of " + o.total + " modules complete</span></div></div>" +
      "<div class='stat'><div class='bignum'>" + n + "</div><div><b>XP · Level " + lv.idx + ": " + esc(lv.name) + "</b><div class='lvbar'><i style='width:" + lvPct + "%'></i></div><span>" + (lv.next ? (lv.next - n) + " XP to next level" : "Top level reached") + "</span></div></div>" +
      "<div class='stat'><div class='bignum'>" + st + "<small>d</small></div><div><b>Learning streak</b><span>" + (st ? "Come back tomorrow to keep it going" : "Do one activity today to start a streak") + "</span></div></div>" +
      "</section>" +

      "<section class='section'><div class='section-head'><div><h2>How it works</h2><p>" + esc(C.audience) + "</p></div></div>" +
      "<div class='howto'>" +
      "<div><span class='hnum'>1</span><b>Learn</b><p>Short lessons with diagrams, real examples and before-and-after prompts.</p></div>" +
      "<div><span class='hnum'>2</span><b>Do</b><p>An activity in every lesson: sort, spot the error, choose what to do, build a prompt.</p></div>" +
      "<div><span class='hnum'>3</span><b>Apply</b><p>A practice task from real work with a checklist, then a quiz. Pass mark " + Math.round(PASS * 100) + "%.</p></div>" +
      "<div><span class='hnum'>4</span><b>Earn</b><p>Collect XP, badges and your certificate as you go.</p></div>" +
      "</div></section>" +

      "<section class='section'><div class='section-head'><div><h2>Your growth path</h2><p>Four stages from first prompt to a working AI routine.</p></div></div><div class='path'>" + stages + "</div>" +
      "<div class='badges'>" + bdg + "</div></section>" +
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
      $("#yesreset").addEventListener("click", () => { memory = { name: memory.name, modules: {}, acts: {}, cards: {}, days: [], celebrated: {}, builder: {} }; save(); viewHome(); toast("Progress cleared"); });
      $("#noreset").addEventListener("click", viewHome);
    });
  }

  /* ---------- module ---------- */
  function viewModule(id, tab, idx) {
    setNav("");
    const m = C.modules.find((x) => x.id === id);
    if (!m) return viewHome();
    const i = C.modules.indexOf(m), s = mstate(id), p = modParts(m);
    tab = tab || "lessons";
    const hasCards = (X.terms[m.id] || []).length > 0;

    const tabs = [
      ["lessons", "Lessons", p.lessonsRead === m.lessons.length],
      hasCards ? ["cards", "Flashcards", !!memory.cards[m.id]] : null,
      ["practice", "Practice task", s.practiceDone],
      ["quiz", "Quiz", p.quizPassed]
    ].filter(Boolean).map(([k, label, ok]) => "<button class='tab" + (tab === k ? " active" : "") + "' data-tab='" + k + "' type='button'><span class='dot" + (ok ? " ok" : "") + "'></span>" + label + "</button>").join("");

    $("#view").innerHTML =
      "<div class='crumbs'><a href='#/'>Dashboard</a> / Module " + (i + 1) + "</div>" +
      "<header class='modhead'><div><span class='eyebrow'>Module " + (i + 1) + " of " + C.modules.length + " · " + m.minutes + " min</span>" +
      "<h1>" + esc(m.title) + "</h1><p>" + esc(m.summary) + "</p>" +
      "<ul class='outcomes'>" + m.outcomes.map((o) => "<li>" + esc(o) + "</li>").join("") + "</ul>" +
      "<div class='modprogress'><div class='minibar'><i style='width:" + Math.round((p.done / p.total) * 100) + "%'></i></div><span>" + (p.complete ? "Module complete" : p.done + " of " + p.total + " steps") + "</span></div></div>" +
      "<div class='modhead-art'>" + ART((X.art || {})[m.id]) + "</div></header>" +
      "<div class='tabs' role='tablist'>" + tabs + "</div><div id='tabbody'></div>" +
      "<nav class='modnav'>" + (i > 0 ? "<a href='#/module/" + C.modules[i - 1].id + "/lessons/0'>← Module " + i + "</a>" : "<span></span>") + (i < C.modules.length - 1 ? "<a href='#/module/" + C.modules[i + 1].id + "/lessons/0'>Module " + (i + 2) + " →</a>" : "") + "</nav>";

    $$(".tab").forEach((b) => b.addEventListener("click", () => {
      location.hash = "#/module/" + id + "/" + b.dataset.tab + (b.dataset.tab === "lessons" ? "/0" : "");
    }));

    const body = $("#tabbody");
    if (tab === "lessons") renderLesson(m, body, Math.min(Math.max(parseInt(idx, 10) || 0, 0), m.lessons.length - 1));
    else if (tab === "cards" && hasCards) renderCards(m, body);
    else if (tab === "practice") renderPractice(m, body);
    else renderQuiz(m, body);
    window.scrollTo({ top: 0 });
  }

  function figureHtml(m, li) {
    const f = (X.figures || {})[m.id + ":" + li];
    return f ? "<figure class='figure'>" + ART(f.art) + (f.caption ? "<figcaption>" + esc(f.caption) + "</figcaption>" : "") + "</figure>" : "";
  }
  function compareHtml(m, li) {
    const c = (X.compare || {})[m.id + ":" + li];
    if (!c) return "";
    return "<div class='compare' data-cmp>" +
      "<div class='cmp-head'><span class='label'>See the difference</span><h4>" + esc(c.title) + "</h4>" +
      "<div class='seg'><button type='button' class='on' data-v='weak'>Weak prompt</button><button type='button' data-v='strong'>Strong prompt</button></div></div>" +
      ["weak", "strong"].map((v) => "<div class='cmp-body' data-body='" + v + "'" + (v === "strong" ? " hidden" : "") + ">" +
        "<div class='cmp-col'><div class='cmp-tag " + v + "'>" + (v === "weak" ? "You type" : "You type") + "</div><pre>" + esc(c[v].prompt) + "</pre></div>" +
        "<div class='cmp-col'><div class='cmp-tag ai'>AI replies</div><div class='cmp-out'>" + esc(c[v].output).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\n/g, "<br>") + "</div></div>" +
        "<div class='cmp-verdict " + v + "'>" + esc(c[v].verdict) + "</div></div>").join("") +
      "</div>";
  }
  function wireCompare(root) {
    $$("[data-cmp]", root).forEach((box) => {
      $$(".seg button", box).forEach((b) => b.addEventListener("click", () => {
        $$(".seg button", box).forEach((x) => x.classList.toggle("on", x === b));
        $$(".cmp-body", box).forEach((x) => { x.hidden = x.dataset.body !== b.dataset.v; });
      }));
    });
  }

  function renderLesson(m, body, li) {
    const s = mstate(m.id), l = m.lessons[li];
    const act = (X.acts[m.id] || [])[li];
    const toc = m.lessons.map((x, k) =>
      "<button type='button' data-l='" + k + "' class='" + (k === li ? "active " : "") + (s.read.includes(k) ? "read" : "") + "'><span class='check'>" + (s.read.includes(k) ? "✓" : k + 1) + "</span><span>" + esc(x.title) + ((X.acts[m.id] || [])[k] ? "<small>" + (memory.acts[m.id + ":" + k] ? "Activity done" : "Includes activity") + "</small>" : "") + "</span></button>"
    ).join("");
    const isLast = li === m.lessons.length - 1;
    body.innerHTML =
      "<div class='layout'><aside class='toc'>" + toc + "</aside>" +
      "<article class='prose'><div class='lesson-kicker'>Lesson " + (li + 1) + " of " + m.lessons.length + "</div><h2>" + esc(l.title) + "</h2>" + figureHtml(m, li) + l.html + compareHtml(m, li) +
      (act ? "<section class='activity' id='act'></section>" : "") +
      "<div class='lesson-foot'>" +
      (li > 0 ? "<a class='btn btn-ghost btn-sm' href='#/module/" + m.id + "/lessons/" + (li - 1) + "'>← Previous lesson</a>" : "<span></span>") +
      "<button class='btn btn-primary' id='markread' type='button'>" + (isLast ? "Mark read and go to " + ((X.terms[m.id] || []).length ? "flashcards" : "the practice task") + " →" : "Mark read and continue →") + "</button>" +
      "</div></article></div>";
    enhancePrompts(body);
    wireCompare(body);
    if (act) renderActivity($("#act"), act, m.id + ":" + li);
    $$(".toc button", body).forEach((b) => b.addEventListener("click", () => { location.hash = "#/module/" + m.id + "/lessons/" + b.dataset.l; }));
    $("#markread").addEventListener("click", () => {
      const fresh = !s.read.includes(li);
      if (fresh) { s.read.push(li); toast("+" + XP.lesson + " XP · lesson read"); }
      markDay(); save(); maybeCelebrate(m);
      location.hash = isLast ? "#/module/" + m.id + "/" + ((X.terms[m.id] || []).length ? "cards" : "practice") : "#/module/" + m.id + "/lessons/" + (li + 1);
    });
  }

  /* ---------- activities ---------- */
  const ACT_LABEL = { check: "Quick check", sort: "Sort it", spot: "Spot the problem", scenario: "What would you do?", order: "Put it in order", builder: "Build it" };
  function actDone(key, already) {
    if (!memory.acts[key]) { memory.acts[key] = true; markDay(); save(); toast("+" + XP.act + " XP · activity complete"); setNav(""); }
    else if (!already) save();
  }
  function shuffled(arr, seedStr) {
    let h = 2166136261; for (let k = 0; k < seedStr.length; k++) { h ^= seedStr.charCodeAt(k); h = Math.imul(h, 16777619) >>> 0; }
    const a = arr.map((x, i) => i);
    for (let k = a.length - 1; k > 0; k--) { h = Math.imul(h ^ (h >>> 15), 2246822519) >>> 0; const j = h % (k + 1); [a[k], a[j]] = [a[j], a[k]]; }
    return a;
  }

  function renderActivity(box, a, key) {
    const head = "<div class='act-head'><span class='act-type'>" + esc(ACT_LABEL[a.type] || "Activity") + "</span><span class='act-xp'>" + (memory.acts[key] ? "✓ Done" : "+" + XP.act + " XP") + "</span></div>";
    const fns = { check: actCheck, sort: actSort, spot: actSpot, scenario: actScenario, order: actOrder, builder: actBuilder };
    (fns[a.type] || actCheck)(box, a, key, head);
  }

  function actCheck(box, a, key, head) {
    const ord = shuffled(a.options, key);
    let picked = null;
    function draw() {
      box.innerHTML = head + "<h4>" + esc(a.q) + "</h4><div class='opts'>" + ord.map((oi, pos) => {
        let cls = "opt"; if (picked !== null) { if (oi === a.answer) cls += " right"; else if (oi === picked) cls += " wrong"; }
        return "<button type='button' class='" + cls + "' data-o='" + oi + "'" + (picked !== null ? " disabled" : "") + "><span class='key'>" + "ABCD"[pos] + "</span><span>" + esc(a.options[oi]) + "</span></button>";
      }).join("") + "</div>" + (picked !== null ? "<div class='why'><strong>" + (picked === a.answer ? "Correct. " : "Not quite. ") + "</strong>" + esc(a.why) + "</div><button class='btn btn-ghost btn-sm again' type='button'>Try again</button>" : "");
      $$(".opt:not([disabled])", box).forEach((b) => b.addEventListener("click", () => { picked = +b.dataset.o; actDone(key); draw(); }));
      const ag = $(".again", box); if (ag) ag.addEventListener("click", () => { picked = null; draw(); });
    }
    draw();
  }

  function actSort(box, a, key, head) {
    const ord = shuffled(a.items, key);
    const choice = {}; let checked = false;
    function draw() {
      const score = checked ? a.items.filter((it, i) => choice[i] === it[1]).length : 0;
      box.innerHTML = head + "<h4>" + esc(a.prompt) + "</h4><p class='act-sub'>Tap a category for each item, then check your answers.</p>" +
        "<div class='bins-legend'>" + a.bins.map((b, k) => "<span class='bin-tag b" + k + "'>" + esc(b) + "</span>").join("") + "</div>" +
        "<div class='sortlist'>" + ord.map((i) => {
          const it = a.items[i]; const st = checked ? (choice[i] === it[1] ? " ok" : " bad") : "";
          return "<div class='sortrow" + st + "'><span class='sorttext'>" + esc(it[0]) + (checked && choice[i] !== it[1] ? "<small>Answer: " + esc(a.bins[it[1]]) + (it[2] ? ". " + esc(it[2]) : "") + "</small>" : (checked && it[2] ? "<small>" + esc(it[2]) + "</small>" : "")) + "</span>" +
            "<span class='binbtns'>" + a.bins.map((b, k) => "<button type='button' class='binbtn b" + k + (choice[i] === k ? " on" : "") + "' data-i='" + i + "' data-k='" + k + "'" + (checked ? " disabled" : "") + ">" + esc(b) + "</button>").join("") + "</span></div>";
        }).join("") + "</div>" +
        (checked ? "<div class='act-result'><b>" + score + " / " + a.items.length + "</b> correct. " + (score === a.items.length ? "Perfect sorting." : "Read the answers above, then try again.") + " <button class='btn btn-ghost btn-sm again' type='button'>Try again</button></div>"
          : "<button class='btn btn-primary btn-sm checkbtn' type='button'" + (Object.keys(choice).length < a.items.length ? " disabled" : "") + ">Check answers</button>");
      $$(".binbtn:not([disabled])", box).forEach((b) => b.addEventListener("click", () => { choice[+b.dataset.i] = +b.dataset.k; draw(); }));
      const cb = $(".checkbtn", box); if (cb) cb.addEventListener("click", () => { checked = true; actDone(key); draw(); });
      const ag = $(".again", box); if (ag) ag.addEventListener("click", () => { checked = false; Object.keys(choice).forEach((k) => delete choice[k]); draw(); });
    }
    draw();
  }

  function actSpot(box, a, key, head) {
    const sel = new Set(); let checked = false;
    const flaws = a.lines.filter((l) => l[1]).length;
    function draw() {
      const hit = a.lines.filter((l, i) => l[1] && sel.has(i)).length;
      const wrong = a.lines.filter((l, i) => !l[1] && sel.has(i)).length;
      box.innerHTML = head + "<h4>" + esc(a.prompt) + "</h4><p class='act-sub'>Tap every line you think has a problem. There are " + flaws + ".</p>" +
        (a.context ? "<div class='spot-ctx'>" + esc(a.context) + "</div>" : "") +
        "<div class='spotdoc'>" + a.lines.map((l, i) => {
          let cls = "spotline" + (sel.has(i) ? " on" : "");
          if (checked) cls += l[1] ? (sel.has(i) ? " hit" : " miss") : (sel.has(i) ? " false" : "");
          return "<button type='button' class='" + cls + "' data-i='" + i + "'" + (checked ? " disabled" : "") + ">" + esc(l[0]) + (checked && l[1] ? "<small>" + esc(l[2]) + "</small>" : "") + "</button>";
        }).join("") + "</div>" +
        (checked ? "<div class='act-result'>You found <b>" + hit + " of " + flaws + "</b> problems" + (wrong ? " and flagged " + wrong + " line" + (wrong > 1 ? "s" : "") + " that were fine" : "") + ". <button class='btn btn-ghost btn-sm again' type='button'>Try again</button></div>"
          : "<button class='btn btn-primary btn-sm checkbtn' type='button'" + (sel.size ? "" : " disabled") + ">Reveal problems</button>");
      $$(".spotline:not([disabled])", box).forEach((b) => b.addEventListener("click", () => { const i = +b.dataset.i; sel.has(i) ? sel.delete(i) : sel.add(i); draw(); }));
      const cb = $(".checkbtn", box); if (cb) cb.addEventListener("click", () => { checked = true; actDone(key); draw(); });
      const ag = $(".again", box); if (ag) ag.addEventListener("click", () => { checked = false; sel.clear(); draw(); });
    }
    draw();
  }

  function actScenario(box, a, key, head) {
    const ord = shuffled(a.choices, key);
    let picked = null;
    const tags = ["Risky", "Okay", "Best choice"];
    function draw() {
      box.innerHTML = head + "<div class='scene'><div class='scene-ill'>" + ART(a.art || "") + "</div><div><h4>" + esc(a.situation) + "</h4><p class='act-sub'>" + esc(a.ask || "What would you do?") + "</p></div></div>" +
        "<div class='opts'>" + ord.map((ci) => {
          const c = a.choices[ci]; let cls = "opt";
          if (picked !== null && (ci === picked || c[1] === 2)) cls += c[1] === 2 ? " right" : c[1] === 1 ? " meh" : " wrong";
          return "<button type='button' class='" + cls + "' data-c='" + ci + "'" + (picked !== null ? " disabled" : "") + "><span>" + esc(c[0]) + (picked !== null && (ci === picked || c[1] === 2) ? "<small class='tag t" + c[1] + "'>" + tags[c[1]] + "</small><small>" + esc(c[2]) + "</small>" : "") + "</span></button>";
        }).join("") + "</div>" +
        (picked !== null ? "<button class='btn btn-ghost btn-sm again' type='button'>Try another choice</button>" : "");
      $$(".opt:not([disabled])", box).forEach((b) => b.addEventListener("click", () => { picked = +b.dataset.c; actDone(key); draw(); }));
      const ag = $(".again", box); if (ag) ag.addEventListener("click", () => { picked = null; draw(); });
    }
    draw();
  }

  function actOrder(box, a, key, head) {
    let cur = shuffled(a.steps, key); let checked = false;
    if (cur.every((v, i) => v === i)) cur = cur.slice().reverse();
    function draw() {
      const right = cur.filter((v, i) => v === i).length;
      box.innerHTML = head + "<h4>" + esc(a.prompt) + "</h4><p class='act-sub'>Use the arrows to put the steps in the right order.</p><ol class='orderlist'>" +
        cur.map((v, i) => "<li class='" + (checked ? (v === i ? "ok" : "bad") : "") + "'><span class='onum'>" + (i + 1) + "</span><span class='otext'>" + esc(a.steps[v]) + "</span>" +
          (checked ? "" : "<span class='omove'><button type='button' data-u='" + i + "' aria-label='Move up'" + (i === 0 ? " disabled" : "") + ">↑</button><button type='button' data-d='" + i + "' aria-label='Move down'" + (i === cur.length - 1 ? " disabled" : "") + ">↓</button></span>") + "</li>").join("") + "</ol>" +
        (checked ? "<div class='act-result'><b>" + right + " / " + cur.length + "</b> in the right place. " + (right === cur.length ? esc(a.why || "Spot on.") : "Correct order: " + a.steps.map((s, i) => (i + 1) + ". " + esc(s)).join(" → ")) + " <button class='btn btn-ghost btn-sm again' type='button'>Try again</button></div>"
          : "<button class='btn btn-primary btn-sm checkbtn' type='button'>Check order</button>");
      $$("[data-u]", box).forEach((b) => b.addEventListener("click", () => { const i = +b.dataset.u; [cur[i - 1], cur[i]] = [cur[i], cur[i - 1]]; draw(); }));
      $$("[data-d]", box).forEach((b) => b.addEventListener("click", () => { const i = +b.dataset.d; [cur[i + 1], cur[i]] = [cur[i], cur[i + 1]]; draw(); }));
      const cb = $(".checkbtn", box); if (cb) cb.addEventListener("click", () => { checked = true; actDone(key); draw(); });
      const ag = $(".again", box); if (ag) ag.addEventListener("click", () => { checked = false; cur = shuffled(a.steps, key + Date.now()); draw(); });
    }
    draw();
  }

  function actBuilder(box, a, key, head) {
    const vals = {};
    function out() { return a.template.replace(/\{(\w+)\}/g, (_, k) => (vals[k] && vals[k].trim()) ? vals[k].trim() : "[" + (a.fields.find((f) => f.key === k) || { label: k }).label + "]"); }
    box.innerHTML = head + "<h4>" + esc(a.prompt) + "</h4><p class='act-sub'>Fill in the fields. Your prompt builds itself on the right.</p>" +
      "<div class='builder2'><div class='bfields'>" + a.fields.map((f) => "<label><span>" + esc(f.label) + "</span><input data-k='" + f.key + "' placeholder='" + esc(f.placeholder) + "'></label>").join("") +
      "<button class='btn btn-ghost btn-sm' id='bex-" + key.replace(":", "-") + "' type='button'>Fill with an example</button></div>" +
      "<div class='prompt live'><div class='phead'><span>Your prompt</span><button class='copybtn' type='button'>Copy</button></div><pre></pre></div></div>";
    const pre = $("pre", box);
    const sync = () => { pre.textContent = out(); const filled = a.fields.every((f) => vals[f.key] && vals[f.key].trim()); if (filled) actDone(key, true); };
    $$("input", box).forEach((inp) => inp.addEventListener("input", () => { vals[inp.dataset.k] = inp.value; sync(); }));
    $(".copybtn", box).addEventListener("click", () => copy(pre.textContent, "Prompt copied"));
    $("#bex-" + key.replace(":", "-"), box).addEventListener("click", () => { $$("input", box).forEach((inp) => { const f = a.fields.find((x) => x.key === inp.dataset.k); inp.value = f.example || f.placeholder; vals[f.key] = inp.value; }); sync(); });
    sync();
  }

  /* ---------- flashcards ---------- */
  function renderCards(m, body) {
    const terms = X.terms[m.id] || [];
    let i = 0, flipped = false; const known = new Set();
    function draw() {
      const t = terms[i];
      body.innerHTML = "<div class='cards-wrap'><div class='cards-top'><h2>Key terms</h2><span>" + (i + 1) + " / " + terms.length + " · " + known.size + " known</span></div>" +
        "<button type='button' class='flashcard" + (flipped ? " flipped" : "") + "' id='fc' aria-label='Flip card'><span class='fc-inner'>" +
        "<span class='fc-face fc-front'><small>TERM</small><b>" + esc(t[0]) + "</b><em>Tap to reveal</em></span>" +
        "<span class='fc-face fc-back'><small>MEANING</small><span>" + esc(t[1]) + "</span></span></span></button>" +
        "<div class='fc-dots'>" + terms.map((_, k) => "<i class='" + (k === i ? "cur " : "") + (known.has(k) ? "known" : "") + "'></i>").join("") + "</div>" +
        "<div class='fc-actions'><button class='btn btn-ghost btn-sm' id='fprev' type='button'" + (i === 0 ? " disabled" : "") + ">←</button>" +
        "<button class='btn btn-ghost btn-sm' id='fagain' type='button'>Review again</button><button class='btn btn-primary btn-sm' id='fknow' type='button'>I know this ✓</button>" +
        "<button class='btn btn-ghost btn-sm' id='fnext' type='button'" + (i === terms.length - 1 ? " disabled" : "") + ">→</button></div>" +
        "<div class='lesson-foot'><span class='muted'>Mark every card as known to earn +" + XP.cards + " XP.</span><a class='btn btn-primary' href='#/module/" + m.id + "/practice'>Go to the practice task →</a></div></div>";
      $("#fc").addEventListener("click", () => { flipped = !flipped; $("#fc").classList.toggle("flipped", flipped); });
      $("#fprev").addEventListener("click", () => { i--; flipped = false; draw(); });
      $("#fnext").addEventListener("click", () => { i++; flipped = false; draw(); });
      $("#fagain").addEventListener("click", () => { known.delete(i); i = (i + 1) % terms.length; flipped = false; draw(); });
      $("#fknow").addEventListener("click", () => {
        known.add(i);
        if (known.size === terms.length && !memory.cards[m.id]) { memory.cards[m.id] = true; markDay(); save(); toast("+" + XP.cards + " XP · all terms known"); setNav(""); }
        const nxt = terms.findIndex((_, k) => !known.has(k) && k > i); const any = terms.findIndex((_, k) => !known.has(k));
        i = nxt >= 0 ? nxt : any >= 0 ? any : i; flipped = false; draw();
      });
    }
    draw();
  }

  /* ---------- practice ---------- */
  function renderPractice(m, body) {
    const s = mstate(m.id), pr = m.practice;
    body.innerHTML =
      "<div class='panel'><span class='eyebrow soft'>Apply it at work · +" + XP.practice + " XP</span><h2>" + esc(pr.title) + "</h2><p class='sub'>" + esc(pr.brief) + "</p>" +
      "<ol class='steps'>" + pr.steps.map((x) => "<li>" + x + "</li>").join("") + "</ol>" +
      "<div class='prompt' data-title='Starter prompt'><pre>" + esc(pr.prompt) + "</pre></div>" +
      "<h3>Your working notes</h3><p class='savehint'>Paste the AI's output and your corrections here. Saved automatically in this browser.</p>" +
      "<textarea id='notes' placeholder='Paste the AI output, then note what you changed and why…'>" + esc(s.notes) + "</textarea>" +
      "<h3>Check your work before you call it done</h3><div class='checkmeter'><i id='cm'></i></div><ul class='checklist'>" +
      pr.checklist.map((c, k) => "<li><label><input type='checkbox' data-k='" + k + "'" + (s.checks.includes(k) ? " checked" : "") + "> <span>" + esc(c) + "</span></label></li>").join("") +
      "</ul><div class='lesson-foot'><a class='btn btn-ghost btn-sm' href='#/module/" + m.id + "/lessons/" + (m.lessons.length - 1) + "'>← Back to lessons</a>" +
      "<button class='btn btn-primary' id='pdone' type='button'>Mark task complete and take the quiz →</button></div></div>";
    enhancePrompts(body);
    let t;
    $("#notes").addEventListener("input", (e) => { clearTimeout(t); t = setTimeout(() => { s.notes = e.target.value; save(); }, 300); });
    $$(".checklist input", body).forEach((cb) => cb.addEventListener("change", () => {
      const k = +cb.dataset.k;
      s.checks = cb.checked ? Array.from(new Set(s.checks.concat(k))) : s.checks.filter((x) => x !== k);
      save(); syncBtn();
    }));
    function syncBtn() {
      const n = s.checks.filter((k) => k < pr.checklist.length).length;
      $("#cm").style.width = Math.round((n / pr.checklist.length) * 100) + "%";
      const all = n >= pr.checklist.length; const b = $("#pdone"); b.disabled = !all; b.title = all ? "" : "Tick every checklist item first";
    }
    syncBtn();
    $("#pdone").addEventListener("click", () => {
      s.notes = $("#notes").value;
      if (!s.practiceDone) toast("+" + XP.practice + " XP · task complete");
      s.practiceDone = true; markDay(); save(); maybeCelebrate(m);
      location.hash = "#/module/" + m.id + "/quiz";
    });
  }

  /* ---------- quiz ---------- */
  function renderQuiz(m, body) {
    const s = mstate(m.id), qs = m.quiz;
    function draw() {
      const answered = Object.keys(s.answers).length;
      let html = "<div class='panel'><span class='eyebrow soft'>Pass to earn +" + XP.quiz + " XP</span><h2>Check your understanding</h2><p class='sub'>" + qs.length + " questions. You need " + Math.ceil(qs.length * PASS) + " correct to pass. Each answer shows an explanation.</p>" +
        "<div class='qprogress'>" + qs.map((q, qi) => "<i class='" + (s.answers[qi] === undefined ? "" : s.answers[qi] === q.answer ? "ok" : "bad") + "'></i>").join("") + "</div>";
      qs.forEach((q, qi) => {
        const a = s.answers[qi], ord = shuffled(q.options, C.id + m.id + ":" + qi);
        html += "<div class='q'><h4>" + (qi + 1) + ". " + esc(q.q) + "</h4><div class='opts'>" +
          ord.map((oi, pos) => {
            let cls = "opt";
            if (a !== undefined) { if (oi === q.answer) cls += " right"; else if (oi === a) cls += " wrong"; }
            return "<button type='button' class='" + cls + "' data-q='" + qi + "' data-o='" + oi + "'" + (a !== undefined ? " disabled" : "") + "><span class='key'>" + "ABCD"[pos] + "</span><span>" + esc(q.options[oi]) + "</span></button>";
          }).join("") + "</div>" +
          (a !== undefined ? "<div class='why'><strong>" + (a === q.answer ? "Correct. " : "Not quite. ") + "</strong>" + esc(q.why) + "</div>" : "") + "</div>";
      });
      if (answered === qs.length) {
        const correct = qs.filter((q, qi) => s.answers[qi] === q.answer).length, ratio = correct / qs.length;
        const firstPass = ratio >= PASS && (s.best === null || s.best < PASS);
        if (s.best === null || ratio > s.best) { s.best = ratio; save(); }
        if (firstPass) { toast("+" + XP.quiz + " XP · quiz passed"); markDay(); setTimeout(() => maybeCelebrate(m), 300); }
        const passed = ratio >= PASS, idx = C.modules.indexOf(m), next = C.modules[idx + 1], p = modParts(m);
        html += "<div class='score'><strong>" + correct + "/" + qs.length + "</strong><div style='flex:1;min-width:200px'>" +
          (passed ? (p.complete ? "Passed. Module complete." : "Passed. Finish any unread lessons and the practice task to complete the module.") : "Not yet. Re-read the lessons and try again.") +
          "</div><button class='btn btn-ghost btn-sm' id='retry' type='button'>Retry quiz</button>" +
          (passed && next ? "<a class='btn btn-gold btn-sm' href='#/module/" + next.id + "/lessons/0'>Next module →</a>" : "") +
          (passed && !next ? "<a class='btn btn-gold btn-sm' href='#/certificate'>View certificate →</a>" : "") + "</div>";
      }
      html += "</div>";
      body.innerHTML = html;
      $$(".opt:not([disabled])", body).forEach((b) => b.addEventListener("click", () => { s.answers[+b.dataset.q] = +b.dataset.o; save(); draw(); }));
      const r = $("#retry"); if (r) r.addEventListener("click", () => { s.answers = {}; save(); draw(); });
    }
    draw();
  }

  /* ---------- prompt builder ---------- */
  const BFIELDS = [
    ["role", "Role", "Who should the AI act as?"],
    ["context", "Context", "Your situation, audience and the facts it needs"],
    ["task", "Task", "Exactly what it should produce"],
    ["format", "Format", "Length, structure, tone, layout"],
    ["checks", "Checks", "Limits, and what to do when information is missing"]
  ];
  function scorePrompt(v) {
    const tips = []; let sc = 0;
    BFIELDS.forEach(([k, l]) => { if ((v[k] || "").trim().length > 8) sc += 12; else tips.push("Add a " + l + "."); });
    const all = BFIELDS.map(([k]) => v[k] || "").join(" ").toLowerCase();
    if ((v.context || "").length > 60) sc += 8; else tips.push("Give more context: who it is for and the key facts.");
    if (/\d/.test(v.format || "")) sc += 8; else tips.push("Put a number in the format, such as a word limit or how many options.");
    if (/(missing|unsure|not sure|don't know|do not know|unclear|confirm|\[)/.test(v.checks || "")) sc += 12; else tips.push("Tell it what to do when it doesn't know, for example write [CONFIRM] instead of guessing.");
    if (/(only|do not|don't|never|avoid)/.test(all)) sc += 6; else tips.push("Add at least one clear limit, such as 'use only the facts I give you'.");
    if (/(ask me|questions first)/.test(all)) sc += 6;
    return { score: Math.min(100, sc), tips: tips.slice(0, 3) };
  }
  function viewBuilder() {
    setNav("builder");
    const v = memory.builder || {};
    const presets = X.presets || [];
    $("#view").innerHTML =
      "<header class='pagehead'><div><span class='eyebrow'>Tool</span><h1>Prompt builder</h1><p>Build a prompt with the five-part structure from the course. It scores itself as you type and tells you what to improve.</p></div><div class='pagehead-art'>" + ART("prompt") + "</div></header>" +
      (v.free ? "<div class='callout example'><span class='label'>From the course</span><p>You opened a course prompt. Copy it into the fields below, or edit it here:</p><textarea id='freetext' style='min-height:140px'>" + esc(v.free) + "</textarea><div style='margin-top:8px;display:flex;gap:8px'><button class='btn btn-primary btn-sm' id='copyfree' type='button'>Copy</button><button class='btn btn-ghost btn-sm' id='clearfree' type='button'>Start a fresh build instead</button></div></div>" : "") +
      "<div class='bpresets'><span>Start from an example:</span>" + presets.map((p, i) => "<button class='chip' data-p='" + i + "' type='button'>" + esc(p.name) + "</button>").join("") + "<button class='chip' data-p='clear' type='button'>Clear</button></div>" +
      "<div class='builder'><div class='bform'>" + BFIELDS.map(([k, l, h], i) => "<label class='bfield'><span class='bl'><i style='background:" + ["var(--ink)", "var(--primary)", "var(--blue)", "var(--gold)", "#E5484D"][i] + "'>" + l[0] + "</i>" + l + "<small>" + h + "</small></span><textarea data-k='" + k + "' rows='" + (k === "context" ? 4 : 2) + "'>" + esc(v[k] || "") + "</textarea></label>").join("") +
      "<label class='bfield inline'><input type='checkbox' id='askfirst'" + (v.ask ? " checked" : "") + "> Ask me up to 5 questions before answering</label></div>" +
      "<div class='bside'><div class='scorecard'><div class='ring' id='sring'><div><strong id='snum'>0</strong></div></div><div><b>Prompt strength</b><ul id='stips'></ul></div></div>" +
      "<div class='prompt live'><div class='phead'><span>Your prompt</span><button class='copybtn' id='bcopy' type='button'>Copy</button></div><pre id='bout'></pre></div></div></div>";
    function compose() {
      const parts = BFIELDS.filter(([k]) => (v[k] || "").trim()).map(([k, l]) => l + ": " + v[k].trim());
      if (v.ask) parts.push("Before you answer, ask me up to 5 questions about anything you need to know. Wait for my answers.");
      return parts.join("\n") || "Start typing in the fields to build your prompt.";
    }
    function sync() {
      $("#bout").textContent = compose();
      const r = scorePrompt(v);
      $("#snum").textContent = r.score;
      $("#sring").style.setProperty("--p", r.score);
      $("#sring").className = "ring " + (r.score >= 80 ? "good" : r.score >= 50 ? "mid" : "low");
      $("#stips").innerHTML = r.tips.length ? r.tips.map((t) => "<li>" + esc(t) + "</li>").join("") : "<li>Strong prompt. Run it, then iterate with short follow-ups.</li>";
      memory.builder = v; save();
    }
    $$(".bform textarea").forEach((t) => t.addEventListener("input", () => { v[t.dataset.k] = t.value; sync(); }));
    $("#askfirst").addEventListener("change", (e) => { v.ask = e.target.checked; sync(); });
    $("#bcopy").addEventListener("click", () => copy($("#bout").textContent, "Prompt copied"));
    $$(".bpresets .chip").forEach((c) => c.addEventListener("click", () => {
      if (c.dataset.p === "clear") memory.builder = {}; else memory.builder = Object.assign({}, presets[+c.dataset.p]);
      save(); viewBuilder();
    }));
    const cf = $("#copyfree"); if (cf) cf.addEventListener("click", () => copy($("#freetext").value, "Prompt copied"));
    const cl = $("#clearfree"); if (cl) cl.addEventListener("click", () => { delete v.free; memory.builder = v; save(); viewBuilder(); });
    sync();
  }

  /* ---------- prompt library ---------- */
  let libFilter = "all", libQuery = "";
  function collectPrompts() {
    const out = [], tmp = document.createElement("div");
    C.modules.forEach((m, i) => {
      m.lessons.forEach((l) => {
        tmp.innerHTML = l.html;
        $$(".prompt", tmp).forEach((p) => out.push({ mod: m.id, n: i + 1, title: p.dataset.title || "Prompt", text: $("pre", p).textContent, from: l.title }));
      });
      out.push({ mod: m.id, n: i + 1, title: m.practice.title, text: m.practice.prompt.trim(), from: "Practice task" });
    });
    return out;
  }
  function viewPrompts() {
    setNav("prompts");
    const all = collectPrompts();
    $("#view").innerHTML =
      "<header class='pagehead'><div><span class='eyebrow'>Toolkit</span><h1>Prompt library</h1><p>Every prompt in the course, ready to copy or open in the builder. Replace anything in [square brackets] with your own details.</p>" +
      "<input class='search' id='q' placeholder='Search " + all.length + " prompts…' value='" + esc(libQuery) + "' aria-label='Search prompts'></div><div class='pagehead-art'>" + ART("content") + "</div></header>" +
      "<div class='filters'><button class='chip" + (libFilter === "all" ? " active" : "") + "' data-f='all' type='button'>All (" + all.length + ")</button>" +
      C.modules.map((m, i) => "<button class='chip" + (libFilter === m.id ? " active" : "") + "' data-f='" + m.id + "' type='button' title='" + esc(m.title) + "'>M" + (i + 1) + " · " + esc(m.title.split(/[,:]| and /)[0]) + "</button>").join("") + "</div>" +
      "<div class='libgrid' id='lib'></div>";
    function draw() {
      const q = libQuery.toLowerCase();
      const list = all.filter((p) => (libFilter === "all" || p.mod === libFilter) && (!q || (p.title + " " + p.text).toLowerCase().includes(q)));
      $("#lib").innerHTML = list.length ? list.map((p) =>
        "<div class='prompt' data-title='M" + p.n + " · " + esc(p.title) + "'><pre>" + esc(p.text) + "</pre><div class='from'>From: " + esc(p.from) + "</div></div>").join("")
        : "<p class='muted'>No prompts match that search.</p>";
      enhancePrompts($("#lib"));
    }
    draw();
    $("#q").addEventListener("input", (e) => { libQuery = e.target.value; draw(); });
    $$(".chip[data-f]").forEach((c) => c.addEventListener("click", () => { libFilter = c.dataset.f; viewPrompts(); }));
  }

  /* ---------- certificate ---------- */
  function viewCert() {
    setNav("certificate");
    const o = overall();
    if (o.complete < o.total) {
      $("#view").innerHTML = "<div class='panel locked' style='margin:0 auto'><div class='lock-art'>" + ART("audit") + "</div><h2>Certificate locked</h2><p>Complete all " + o.total + " modules to unlock it. You have " + o.complete + " complete so far.</p><div class='minibar' style='max-width:320px;margin:0 auto 20px'><i style='width:" + o.pct + "%'></i></div><a class='btn btn-primary' href='#/module/" + nextModule().id + "/lessons/0'>Keep going →</a></div>";
      return;
    }
    const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    $("#view").innerHTML =
      "<div class='cert'><span class='eyebrow'>" + esc(C.org) + "</span><h1>Certificate of Completion</h1><p>This certifies that</p>" +
      "<div class='name' id='certname'>" + esc(memory.name || "Your Name") + "</div>" +
      "<p>has completed all " + o.total + " modules of</p><h2 style='margin:6px 0'>" + esc(C.title) + "</h2>" +
      "<p class='muted'>" + esc(C.certLine) + "</p><div class='rule'></div><p>" + date + " · " + xp() + " XP earned</p></div>" +
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
    else if (parts[0] === "builder") viewBuilder();
    else if (parts[0] === "certificate") viewCert();
    else viewHome();
  }

  load();
  shell();
  window.addEventListener("hashchange", route);
  route();
})();
