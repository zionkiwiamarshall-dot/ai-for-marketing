/* Illustration library: inline SVG scenes and diagrams that use the theme's CSS variables.
   Used by the site (assets/app.js) and the ebook builder (ebook/build.js). */
(function (root) {
  const P = "var(--primary)", PD = "var(--primary-deep)", G = "var(--gold)", B = "var(--blue)", I = "var(--ink)", W = "#fff";
  const svg = (vb, body, label) => `<svg class="art" viewBox="${vb}" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
  const spark = (x, y, s, c) => `<path d="M${x} ${y - s}C${x + s * .15} ${y - s * .15} ${x + s * .15} ${y - s * .15} ${x + s} ${y}C${x + s * .15} ${y + s * .15} ${x + s * .15} ${y + s * .15} ${x} ${y + s}C${x - s * .15} ${y + s * .15} ${x - s * .15} ${y + s * .15} ${x - s} ${y}C${x - s * .15} ${y - s * .15} ${x - s * .15} ${y - s * .15} ${x} ${y - s}Z" fill="${c}"/>`;
  const blob = (c, o) => `<path d="M42 30C78 4 150 -4 196 24C236 48 246 104 222 140C196 178 128 186 78 170C30 154 2 120 8 84C12 60 22 44 42 30Z" fill="${c}" opacity="${o}"/>`;
  const dots = (x, y) => [0, 1, 2, 3].map((r) => [0, 1, 2, 3].map((c) => `<circle cx="${x + c * 8}" cy="${y + r * 8}" r="1.6" fill="${I}" opacity=".18"/>`).join("")).join("");
  const card = (x, y, w, h, r = 10) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${W}" stroke="${I}" stroke-opacity=".12"/>`;
  const shadowCard = (x, y, w, h, r = 10) => `<rect x="${x + 4}" y="${y + 6}" width="${w}" height="${h}" rx="${r}" fill="${I}" opacity=".08"/>` + card(x, y, w, h, r);
  const line = (x, y, w, c = I, o = .14, h = 5) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${c}" opacity="${o}"/>`;
  const check = (x, y, c = P) => `<circle cx="${x}" cy="${y}" r="9" fill="${c}"/><path d="M${x - 4} ${y}l3 3 5-6" stroke="${W}" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const person = (x, y, s, shirt) => `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="0" cy="-26" r="11" fill="#E8B48F"/><path d="M-11 -30c2-10 20-10 22 0c-4-4-18-4-22 0z" fill="${I}"/><path d="M-20 14c0-18 8-28 20-28s20 10 20 28z" fill="${shirt}"/></g>`;

  const wrap = (x, y, text, max, size, color, lh = 1.3, weight = 500, anchor = "start") => {
    const words = String(text).split(" "); const lines = []; let cur = "";
    words.forEach((w) => { if ((cur + " " + w).trim().length > max) { lines.push(cur.trim()); cur = w; } else cur += " " + w; });
    if (cur.trim()) lines.push(cur.trim());
    return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="DM Sans, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}">` +
      lines.map((l, i) => `<tspan x="${x}" dy="${i ? size * lh : 0}">${l}</tspan>`).join("") + `</text>`;
  };

  const S = {
    /* ---------- heroes ---------- */
    "hero-accounting": () => svg("0 0 420 320", `
      <circle cx="300" cy="90" r="70" fill="${P}" opacity=".18"/><circle cx="110" cy="250" r="54" fill="${G}" opacity=".18"/>
      ${shadowCard(40, 60, 250, 190, 16)}
      <rect x="40" y="60" width="250" height="34" rx="16" fill="${I}"/><rect x="40" y="78" width="250" height="16" fill="${I}"/>
      <circle cx="60" cy="77" r="4" fill="${G}"/><circle cx="74" cy="77" r="4" fill="${W}" opacity=".5"/><circle cx="88" cy="77" r="4" fill="${W}" opacity=".5"/>
      ${[0, 1, 2, 3, 4].map((r) => `<line x1="56" x2="274" y1="${116 + r * 24}" y2="${116 + r * 24}" stroke="${I}" stroke-opacity=".08"/>`).join("")}
      ${[52, 76, 64, 98, 120, 104, 142].map((h, k) => `<rect x="${64 + k * 30}" y="${232 - h}" width="18" height="${h}" rx="5" fill="${k === 6 ? G : P}" opacity="${k === 6 ? 1 : .35 + k * .09}"/>`).join("")}
      <path d="M70 188 L100 168 L130 176 L160 146 L190 134 L220 140 L250 104" stroke="${I}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="250" cy="104" r="6" fill="${G}" stroke="${I}" stroke-width="3"/>
      ${shadowCard(258, 150, 132, 110, 14)}
      <text x="274" y="178" font-family="DM Sans, sans-serif" font-size="11" font-weight="700" fill="${I}" opacity=".55">VARIANCE</text>
      <text x="274" y="204" font-family="Archivo Black, sans-serif" font-size="22" fill="${I}">+12.4%</text>
      ${line(274, 218, 96)}${line(274, 230, 70)}
      ${check(372, 172)}
      <g transform="translate(330 40)"><rect x="-34" y="-20" width="92" height="40" rx="20" fill="${I}"/>${spark(-12, 0, 9, G)}<text x="4" y="5" font-family="DM Sans, sans-serif" font-weight="800" font-size="13" fill="${W}">AI draft</text></g>
      ${spark(28, 40, 10, G)}${spark(392, 290, 8, P)}${dots(330, 270)}`, "A spreadsheet chart with an AI draft badge and a verified variance card"),

    "hero-marketing": () => svg("0 0 420 320", `
      <circle cx="120" cy="90" r="70" fill="${P}" opacity=".18"/><circle cx="330" cy="250" r="56" fill="${G}" opacity=".2"/>
      <rect x="146" y="34" width="132" height="256" rx="24" fill="${I}"/><rect x="154" y="48" width="116" height="228" rx="16" fill="${W}"/>
      <rect x="196" y="40" width="32" height="6" rx="3" fill="${W}" opacity=".3"/>
      <rect x="162" y="58" width="100" height="84" rx="10" fill="${P}" opacity=".9"/>
      <circle cx="188" cy="86" r="10" fill="${G}"/><path d="M162 142 L196 108 L218 128 L234 114 L262 142Z" fill="${PD}"/>
      <circle cx="172" cy="158" r="7" fill="${G}"/>${line(184, 152, 60)}${line(184, 162, 40)}
      ${line(162, 178, 100)}${line(162, 190, 84)}${line(162, 202, 92)}
      <g transform="translate(166 226)"><path d="M8 4c-4-6-12-2-8 5l8 8 8-8c4-7-4-11-8-5z" fill="#E5484D"/><text x="22" y="14" font-family="DM Sans, sans-serif" font-size="11" font-weight="700" fill="${I}">2.4k</text></g>
      <rect x="214" y="226" width="48" height="20" rx="10" fill="${I}"/><text x="223" y="240" font-family="DM Sans, sans-serif" font-size="10" font-weight="800" fill="${W}">Shop</text>
      ${shadowCard(28, 120, 112, 74, 14)}
      <text x="42" y="146" font-family="DM Sans, sans-serif" font-size="10" font-weight="700" fill="${I}" opacity=".55">CLICK-THROUGH</text>
      <text x="42" y="174" font-family="Archivo Black, sans-serif" font-size="22" fill="${I}">3.8%</text>
      <path d="M106 178 l10 -12 8 6 10 -16" stroke="${P}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      ${shadowCard(292, 70, 108, 96, 14)}
      ${[0, 1, 2].map((k) => `<rect x="${304 + k * 30}" y="84" width="24" height="24" rx="6" fill="${[P, G, B][k]}"/>`).join("")}
      ${line(304, 120, 84)}${line(304, 132, 60)}${line(304, 144, 72)}
      <g transform="translate(330 44)"><rect x="-26" y="-16" width="96" height="32" rx="16" fill="${I}"/>${spark(-8, 0, 8, G)}<text x="6" y="5" font-family="DM Sans, sans-serif" font-weight="800" font-size="12" fill="${W}">10 ideas</text></g>
      <g transform="translate(58 250)"><path d="M0 0 L34 -16 L34 24 L0 8Z" fill="${G}"/><rect x="-12" y="-4" width="14" height="16" rx="3" fill="${I}"/><path d="M42 -10 q8 10 0 20 M50 -16 q14 16 0 32" stroke="${I}" stroke-width="3" fill="none" stroke-linecap="round"/></g>
      ${spark(388, 36, 10, G)}${spark(40, 70, 8, P)}${dots(340, 186)}`, "A phone showing a social post with performance cards and a megaphone"),

    /* ---------- module scenes (240 x 180) ---------- */
    "ai-spark": () => svg("0 0 240 180", `${blob(P, .14)}
      ${shadowCard(54, 40, 104, 120, 12)}${line(68, 58, 60, I, .5, 7)}${line(68, 76, 76)}${line(68, 88, 70)}${line(68, 100, 64)}${line(68, 112, 74)}${line(68, 124, 50)}
      <circle cx="166" cy="62" r="30" fill="${I}"/>${spark(166, 62, 16, G)}${spark(188, 38, 6, P)}
      ${check(150, 140)}<text x="164" y="144" font-family="DM Sans, sans-serif" font-size="11" font-weight="800" fill="${I}">verified</text>`, "An AI spark beside a document being verified"),
    "shield": () => svg("0 0 240 180", `${blob(B, .12)}
      <path d="M120 28 L168 46 V92 C168 124 146 146 120 156 C94 146 72 124 72 92 V46Z" fill="${I}"/>
      <path d="M120 40 L158 54 V92 C158 118 141 136 120 144Z" fill="${W}" opacity=".08"/>
      <rect x="100" y="86" width="40" height="32" rx="6" fill="${G}"/><path d="M108 86 v-8 a12 12 0 0 1 24 0 v8" stroke="${G}" stroke-width="5" fill="none"/><circle cx="120" cy="100" r="4" fill="${I}"/>
      <g>${[["#12B886", 36], [G, 60], ["#E5484D", 84]].map(([c, y]) => `<circle cx="196" cy="${y + 20}" r="9" fill="${c}"/>`).join("")}<rect x="184" y="44" width="24" height="84" rx="12" fill="none" stroke="${I}" stroke-opacity=".2" stroke-width="2"/></g>
      ${spark(48, 52, 7, P)}`, "A shield with a padlock and a traffic light"),
    "prompt": () => svg("0 0 240 180", `${blob(P, .14)}
      <rect x="34" y="40" width="120" height="58" rx="14" fill="${I}"/><path d="M58 98 l-8 16 22-16z" fill="${I}"/>
      ${["R", "C", "T", "F", "C"].map((l, k) => `<rect x="${44 + k * 21}" y="56" width="17" height="24" rx="5" fill="${[P, B, G, W, "#E5484D"][k]}"/><text x="${52.5 + k * 21}" y="73" text-anchor="middle" font-family="Archivo Black, sans-serif" font-size="11" fill="${I}">${l}</text>`).join("")}
      ${shadowCard(98, 92, 112, 60, 14)}${spark(116, 112, 7, G)}${line(130, 108, 66)}${line(114, 124, 82)}${line(114, 136, 56)}`, "A prompt bubble made of five building blocks and an AI reply"),
    "spreadsheet": () => svg("0 0 240 180", `${blob(P, .14)}
      ${shadowCard(36, 34, 168, 116, 10)}<rect x="36" y="34" width="168" height="22" rx="10" fill="${I}"/><rect x="36" y="46" width="168" height="10" fill="${I}"/>
      <text x="48" y="50" font-family="Anonymous Pro, monospace" font-size="11" fill="${G}">fx =SUMIFS(D:D,B:B,A2)</text>
      ${[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => `<rect x="${48 + c * 52}" y="${66 + r * 20}" width="44" height="12" rx="3" fill="${r === 1 && c === 2 ? G : I}" opacity="${r === 1 && c === 2 ? 1 : .1}"/>`).join("")).join("")}
      <rect x="148" y="82" width="52" height="20" rx="4" fill="none" stroke="${P}" stroke-width="3"/>${spark(204, 34, 9, G)}`, "A spreadsheet with a formula and a highlighted cell"),
    "reconcile": () => svg("0 0 240 180", `${blob(B, .12)}
      ${shadowCard(30, 34, 76, 116, 10)}${shadowCard(134, 34, 76, 116, 10)}
      <text x="42" y="54" font-family="DM Sans, sans-serif" font-size="10" font-weight="800" fill="${I}" opacity=".55">BANK</text><text x="146" y="54" font-family="DM Sans, sans-serif" font-size="10" font-weight="800" fill="${I}" opacity=".55">LEDGER</text>
      ${[0, 1, 2, 3].map((k) => line(42, 70 + k * 18, 52) + line(146, 70 + k * 18, 52)).join("")}
      ${[0, 1, 2].map((k) => `<path d="M96 ${72 + k * 18} H144" stroke="${P}" stroke-width="2.5" stroke-dasharray="4 4"/>`).join("")}
      <circle cx="120" cy="126" r="14" fill="${G}"/><text x="120" y="131" text-anchor="middle" font-family="Archivo Black, sans-serif" font-size="14" fill="${I}">?</text>
      ${check(206, 40)}`, "Bank and ledger columns being matched with one item flagged"),
    "report": () => svg("0 0 240 180", `${blob(P, .14)}
      ${shadowCard(40, 30, 120, 130, 12)}${line(54, 46, 60, I, .5, 7)}
      ${[30, 50, 38, 64].map((h, k) => `<rect x="${58 + k * 22}" y="${118 - h}" width="14" height="${h}" rx="4" fill="${k === 3 ? G : P}" opacity="${k === 3 ? 1 : .55}"/>`).join("")}
      ${line(54, 128, 92)}${line(54, 140, 70)}
      <circle cx="182" cy="68" r="30" fill="${I}"/><path d="M182 68 V38 A30 30 0 0 1 210 78Z" fill="${G}"/><path d="M182 68 L210 78 A30 30 0 0 1 172 96Z" fill="${P}"/>
      ${spark(200, 140, 8, B)}`, "A management report with bar and pie charts"),
    "audit": () => svg("0 0 240 180", `${blob(G, .16)}
      ${shadowCard(38, 30, 110, 130, 12)}${[0, 1, 2, 3, 4].map((k) => check(56, 52 + k * 22, k === 4 ? "#CBD5E1" : P) + line(72, 50 + k * 22, 60)).join("")}
      <circle cx="160" cy="92" r="32" fill="${W}" fill-opacity=".6" stroke="${I}" stroke-width="7"/><path d="M184 116 L210 142" stroke="${I}" stroke-width="10" stroke-linecap="round"/>
      ${spark(160, 92, 10, G)}`, "An audit checklist under a magnifying glass"),
    "team": () => svg("0 0 240 180", `${blob(P, .14)}
      <path d="M30 150 C70 150 70 110 110 110 S150 70 200 64" stroke="${I}" stroke-width="4" fill="none" stroke-dasharray="2 9" stroke-linecap="round"/>
      ${[[40, 150, P], [110, 110, B], [200, 64, G]].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="10" fill="${c}" stroke="${I}" stroke-width="3"/>`).join("")}
      <path d="M200 64 V24 l22 8 -22 8" fill="${G}" stroke="${I}" stroke-width="3" stroke-linejoin="round"/>
      ${person(70, 104, .9, B)}${person(150, 150, .9, P)}${spark(30, 40, 8, G)}`, "A team path from start to a flag"),
    "customer": () => svg("0 0 240 180", `${blob(B, .12)}
      ${person(72, 136, 1.4, P)}
      <rect x="118" y="30" width="96" height="40" rx="14" fill="${I}"/><path d="M128 70 l-8 12 18-12z" fill="${I}"/>${line(130, 44, 60, W, .7)}${line(130, 54, 44, W, .4)}
      ${shadowCard(130, 90, 84, 56, 14)}${[0, 1, 2, 3, 4].map((k) => `<path d="M${146 + k * 13} 104 l2.5 5 5.5 .8 -4 3.9 1 5.5 -5-2.6 -5 2.6 1-5.5 -4-3.9 5.5-.8z" fill="${k < 4 ? G : "#CBD5E1"}"/>`).join("")}${line(142, 128, 60)}
      ${spark(40, 44, 8, G)}`, "A customer with a speech bubble and a star review"),
    "voice": () => svg("0 0 240 180", `${blob(P, .14)}
      <g transform="translate(60 90)"><path d="M0 -16 L60 -46 L60 46 L0 16Z" fill="${G}"/><rect x="-22" y="-18" width="26" height="36" rx="6" fill="${I}"/><rect x="-10" y="18" width="12" height="26" rx="4" fill="${I}"/>
      <path d="M74 -24 q16 24 0 48 M88 -36 q26 36 0 72" stroke="${I}" stroke-width="5" fill="none" stroke-linecap="round"/></g>
      ${[P, B, "#E5484D"].map((c, k) => `<circle cx="${196}" cy="${48 + k * 30}" r="11" fill="${c}"/>`).join("")}`, "A megaphone with a brand colour palette"),
    "content": () => svg("0 0 240 180", `${blob(G, .16)}
      ${[[30, 70, -8, B], [80, 46, -2, P], [134, 62, 6, G]].map(([x, y, r, c]) => `<g transform="rotate(${r} ${x + 40} ${y + 50})">${shadowCard(x, y, 80, 96, 12)}<rect x="${x + 8}" y="${y + 8}" width="64" height="40" rx="8" fill="${c}"/>${line(x + 8, y + 58, 56)}${line(x + 8, y + 70, 40)}</g>`).join("")}
      <circle cx="120" cy="30" r="16" fill="${I}"/><text x="120" y="35" text-anchor="middle" font-family="Archivo Black, sans-serif" font-size="13" fill="${G}">1</text>`, "One idea fanned out into many content cards"),
    "social": () => svg("0 0 240 180", `${blob(P, .14)}
      <rect x="84" y="20" width="72" height="144" rx="16" fill="${I}"/><rect x="90" y="32" width="60" height="120" rx="10" fill="${W}"/>
      <rect x="96" y="40" width="44" height="18" rx="9" fill="#E9FBF0"/><rect x="104" y="64" width="40" height="18" rx="9" fill="${P}" opacity=".85"/><rect x="96" y="88" width="48" height="18" rx="9" fill="#E9FBF0"/>
      <rect x="108" y="112" width="36" height="18" rx="9" fill="${P}" opacity=".85"/>
      ${[[40, 50, "#E5484D"], [194, 70, B], [44, 126, G], [196, 132, P]].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="16" fill="${c}"/><circle cx="${x}" cy="${y}" r="6" fill="${W}" opacity=".85"/>`).join("")}`, "A phone with a chat thread and social icons around it"),
    "image": () => svg("0 0 240 180", `${blob(B, .12)}
      ${shadowCard(44, 30, 130, 104, 12)}<rect x="54" y="40" width="110" height="84" rx="8" fill="${P}" opacity=".25"/>
      <circle cx="80" cy="64" r="11" fill="${G}"/><path d="M54 124 L94 80 L118 104 L136 88 L164 124Z" fill="${P}"/>
      <g transform="translate(176 120) rotate(35)"><rect x="-6" y="-46" width="12" height="60" rx="4" fill="${I}"/><path d="M-6 14 L0 30 L6 14Z" fill="${G}"/></g>
      ${spark(190, 50, 10, G)}${spark(210, 76, 5, P)}`, "An image frame with an AI pen and sparkles"),
    "funnel": () => svg("0 0 240 180", `${blob(G, .16)}
      ${[[40, 40, 160, P, .35], [60, 72, 120, P, .6], [80, 104, 80, P, .9]].map(([x, y, w, c, o]) => `<path d="M${x} ${y} H${x + w} L${x + w - 18} ${y + 28} H${x + 18}Z" fill="${c}" opacity="${o}"/>`).join("")}
      <rect x="104" y="136" width="32" height="20" rx="6" fill="${I}"/>
      <circle cx="196" cy="140" r="22" fill="${W}" stroke="${I}" stroke-width="4"/><circle cx="196" cy="140" r="12" fill="none" stroke="${G}" stroke-width="5"/><circle cx="196" cy="140" r="4" fill="${I}"/>
      ${spark(40, 140, 8, B)}`, "A marketing funnel and a target"),
    "growth": () => svg("0 0 240 180", `${blob(P, .14)}
      ${shadowCard(36, 34, 168, 118, 12)}
      ${[26, 40, 34, 58, 72].map((h, k) => `<rect x="${54 + k * 28}" y="${136 - h}" width="18" height="${h}" rx="5" fill="${k === 4 ? G : P}" opacity="${k === 4 ? 1 : .4 + k * .12}"/>`).join("")}
      <path d="M58 104 L86 92 L114 98 L142 72 L172 52" stroke="${I}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M160 50 L174 50 L172 64" stroke="${I}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      ${spark(210, 30, 9, G)}`, "A growth chart with an upward arrow"),

    /* ---------- diagrams (wide, 640 wide) ---------- */
    "dg-verify": () => svg("0 0 640 170", `
      ${[["You brief", "Context, task, checks", I, W], ["AI drafts", "Fast first version", P, W], ["You verify", "Numbers, facts, logic, fit", G, I], ["You publish", "Your name, your call", B, W]].map(([t, s, c, tc], k) => `
        <g transform="translate(${20 + k * 158} 30)"><rect width="132" height="104" rx="16" fill="${c}"/><text x="16" y="34" font-family="Archivo Black, sans-serif" font-size="13" fill="${tc}" opacity=".7">0${k + 1}</text>
        <text x="16" y="62" font-family="Archivo Black, sans-serif" font-size="15" fill="${tc}">${t}</text>${wrap(16, 84, s, 19, 11, tc)}</g>
        ${k < 3 ? `<path d="M${156 + k * 158} 82 h18 m-6 -6 l6 6 -6 6" stroke="${I}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` : ""}`).join("")}
      <path d="M402 140 C402 162 110 162 110 140" stroke="${I}" stroke-opacity=".35" stroke-width="2" fill="none" stroke-dasharray="5 5"/><text x="256" y="166" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="11" fill="${I}" opacity=".6">Not right? Refine the brief and go again</text>`, "Brief, AI drafts, you verify, you publish"),
    "dg-rctfc": () => svg("0 0 640 150", `
      ${[["R", "Role", "Who should it act as?"], ["C", "Context", "What is the situation?"], ["T", "Task", "What exactly to do?"], ["F", "Format", "What should it look like?"], ["C", "Checks", "Limits and what to do if unsure"]].map(([l, t, s], k) => `
        <g transform="translate(${16 + k * 124} 20)"><rect width="112" height="112" rx="16" fill="${[I, P, B, G, "#E5484D"][k]}"/><text x="14" y="44" font-family="Archivo Black, sans-serif" font-size="32" fill="${k === 3 ? I : W}">${l}</text>
        <text x="14" y="70" font-family="DM Sans, sans-serif" font-weight="800" font-size="13" fill="${k === 3 ? I : W}">${t}</text>
        ${wrap(14, 88, s, 17, 10.5, k === 3 ? I : W)}</g>`).join("")}`, "The five parts of a prompt: Role, Context, Task, Format, Checks"),
    "dg-traffic": () => svg("0 0 640 150", `
      ${[["#12B886", "GREEN", "Safe", "Public info, made-up data, generic questions"], ["#FFB020", "AMBER", "Anonymise first", "Real records with names and IDs removed"], ["#E5484D", "RED", "Never in public AI", "Personal, financial or confidential identifiers"]].map(([c, t, h, s], k) => `
        <g transform="translate(${16 + k * 208} 20)"><rect width="192" height="112" rx="16" fill="${W}" stroke="${I}" stroke-opacity=".12"/><rect width="10" height="112" rx="5" fill="${c}"/>
        <circle cx="38" cy="34" r="13" fill="${c}"/><text x="60" y="39" font-family="DM Sans, sans-serif" font-weight="800" font-size="11" letter-spacing="1.5" fill="${I}" opacity=".55">${t}</text>
        <text x="24" y="72" font-family="Archivo Black, sans-serif" font-size="15" fill="${I}">${h}</text>
        ${wrap(24, 92, s, 28, 11, "#334155")}</g>`).join("")}`, "Green, amber and red data categories"),
    "dg-sowhat": () => svg("0 0 640 120", `
      ${[["What happened", "Movement in figures and %"], ["Why", "The real cause"], ["So what", "Impact on year, cash, targets"], ["Now what", "Action or decision needed"]].map(([t, s], k) => `
        <g transform="translate(${16 + k * 154} 16)"><path d="M0 0 H130 L148 44 L130 88 H0 L18 44Z" fill="${[I, B, P, G][k]}"/>
        <text x="26" y="40" font-family="Archivo Black, sans-serif" font-size="12.5" fill="${k === 3 ? I : W}">${t}</text>${wrap(28, 60, s, 17, 10.5, k === 3 ? I : W)}</g>`).join("")}`, "What happened, why, so what, now what"),
    "dg-close": () => svg("0 0 640 140", `
      <line x1="30" x2="610" y1="60" y2="60" stroke="${I}" stroke-opacity=".2" stroke-width="4" stroke-linecap="round"/>
      ${[["Day -2", "Cut-off reminders"], ["Day 0", "Bank & mobile money recs"], ["Day +1", "Accruals & payroll"], ["Day +2", "Fixed assets & funds"], ["Day +3", "Review & variances"], ["Day +5", "Pack issued"]].map(([d, s], k) => `
        <g transform="translate(${44 + k * 110} 60)"><circle r="12" fill="${k === 5 ? G : P}" stroke="${I}" stroke-width="3"/><text y="-24" text-anchor="middle" font-family="Archivo Black, sans-serif" font-size="12" fill="${I}">${d}</text>
        ${wrap(0, 38, s, 15, 11, "#334155", 1.3, 500, "middle")}</g>`).join("")}`, "A month-end close timeline from Day -2 to Day +5"),
    "dg-repurpose": () => svg("0 0 640 170", `
      <g transform="translate(40 45)"><rect width="150" height="80" rx="16" fill="${I}"/><text x="18" y="34" font-family="DM Sans, sans-serif" font-size="11" font-weight="800" fill="${G}" letter-spacing="1.2">ONE SOURCE</text><text x="18" y="58" font-family="Archivo Black, sans-serif" font-size="16" fill="${W}">Webinar</text></g>
      ${["5 social posts", "3 short videos", "1 article", "1 email", "5 quote cards"].map((t, k) => `<path d="M190 85 C260 85 260 ${22 + k * 30} 330 ${22 + k * 30}" stroke="${P}" stroke-width="2.5" fill="none"/>
        <g transform="translate(330 ${8 + k * 30})"><rect width="170" height="26" rx="13" fill="${[P, B, G, I, "#E5484D"][k]}"/><text x="14" y="17.5" font-family="DM Sans, sans-serif" font-weight="800" font-size="12" fill="${k === 2 ? I : W}">${t}</text></g>`).join("")}
      ${spark(560, 60, 14, G)}${spark(590, 110, 8, P)}`, "One webinar repurposed into posts, videos, an article, an email and quote cards"),
    "dg-funnel": () => svg("0 0 640 170", `
      ${[["Awareness", "Reach, views", 560], ["Interest", "Clicks, follows", 440], ["Consideration", "Leads, sign-ups", 320], ["Action", "Sales, bookings", 200]].map(([t, s, w], k) => `
        <g transform="translate(${(640 - w) / 2} ${10 + k * 38})"><rect width="${w}" height="32" rx="10" fill="${P}" opacity="${.3 + k * .23}"/>
        <text x="${w / 2}" y="21" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="12.5" fill="${k > 1 ? W : I}"><tspan font-weight="800">${t}</tspan> · ${s}</text></g>`).join("")}`, "A marketing funnel from awareness to action"),
    "dg-brief": () => svg("0 0 640 130", `
      ${["Objective", "Audience", "Insight", "One message", "Proof", "Offer", "Channels", "KPIs"].map((t, k) => `<g transform="translate(${16 + (k % 4) * 154} ${14 + Math.floor(k / 4) * 54})"><rect width="142" height="44" rx="12" fill="${k === 3 ? G : W}" stroke="${I}" stroke-opacity=".14"/><circle cx="22" cy="22" r="10" fill="${k === 3 ? I : P}"/><text x="22" y="26" text-anchor="middle" font-family="Archivo Black, sans-serif" font-size="10" fill="${k === 3 ? G : W}">${k + 1}</text><text x="40" y="27" font-family="DM Sans, sans-serif" font-weight="800" font-size="12.5" fill="${I}">${t}</text></g>`).join("")}`, "The eight parts of a campaign brief")
  };

  root.ART = function (name) { return S[name] ? S[name]() : ""; };
  root.ART_NAMES = Object.keys(S);
})(typeof window !== "undefined" ? window : globalThis);
