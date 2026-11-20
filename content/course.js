/* AI for Marketing — course content. Used by the learning site (index.html) and the ebook builder (ebook/build.js). */
(function (root) {
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const P = (title, text) => `<div class="prompt" data-title="${title}"><pre>${esc(text.trim())}</pre></div>`;
  const TIP = (h) => `<div class="callout tip"><span class="label">Tip</span>${h}</div>`;
  const WARN = (h) => `<div class="callout warn"><span class="label">Watch out</span>${h}</div>`;
  const EX = (h) => `<div class="callout example"><span class="label">Illustrative example</span>${h}</div>`;

  root.COURSE = {
    id: "ai-for-marketing",
    title: "AI for Marketing",
    org: "AI Training Camp",
    eyebrow: "Self-paced course · 8 modules",
    heroTitle: "Plan, create and measure campaigns <em>in half the time.</em>",
    lead: "A hands-on course for marketers, communications teams and business owners. Use AI to understand customers, write in your brand voice, produce content for every channel and prove what works, without losing quality or trust.",
    audience: "Built for marketing and communications teams in businesses, NGOs and agencies anywhere in the world. No technical background needed.",
    certLine: "Practical use of AI tools in customer research, content creation, campaigns and marketing measurement.",
    primary: "#0C8F6A",
    primaryDeep: "#08704F",
    ebook: "ebook/AI-for-Marketing.pdf",
    ebookSubtitle: "A practical guide to using AI tools for customer insight, content, campaigns and measurement",
    stages: [
      { name: "Foundations", desc: "Understand what AI can do for marketing, and start from real customer insight.", modules: ["m1", "m2"] },
      { name: "Core skills", desc: "Write prompts that sound like your brand, and produce content at scale.", modules: ["m3", "m4"] },
      { name: "Channels and campaigns", desc: "Apply AI to social, messaging, visuals, ads and email.", modules: ["m5", "m6", "m7"] },
      { name: "Lead the change", desc: "Measure results, stay ethical, and build a team routine.", modules: ["m8"] }
    ],
    modules: [
      /* ============================ MODULE 1 ============================ */
      {
        id: "m1",
        title: "AI foundations for marketers",
        summary: "What today's AI tools can do across text, images, video and audio, where they genuinely help marketers, and why your judgement matters more than ever.",
        minutes: 35,
        outcomes: ["Explain how AI tools generate content", "Pick the right tool type for a task", "Spot generic AI-sounding output"],
        lessons: [
          {
            title: "What AI tools are, in plain terms",
            html: `
<p>AI chat tools such as <strong>ChatGPT, Claude, Gemini and Microsoft Copilot</strong> are built on large language models. They have learned patterns from a huge amount of text and predict what words should come next. That is why they write fluent captions, outlines and emails in seconds.</p>
<p>The same idea powers other tools: image generators create pictures from descriptions, and video and voice tools generate clips, edits and voiceovers. Together they can produce a draft of almost any marketing asset.</p>
<h3>What this means for marketers</h3>
<ol>
  <li><strong>Speed is no longer the edge.</strong> Everyone can now produce content quickly. Your advantage is insight, taste and knowing your customer.</li>
  <li><strong>Average in, average out.</strong> A vague prompt gives the most typical answer, and typical is forgettable. Specific input gives distinctive output.</li>
  <li><strong>It can be wrong.</strong> AI tools can invent statistics, quotes, product features and trends. Every claim you publish must be checked.</li>
</ol>
${TIP(`<p>Think of AI as a tireless junior copywriter and researcher. Great at volume and first drafts. You are still the creative director.</p>`)}
<h3>The main tool types</h3>
<table>
<tr><th>Tool type</th><th>Examples</th><th>Good for</th></tr>
<tr><td>AI chat</td><td>ChatGPT, Claude, Gemini, Copilot</td><td>Research summaries, strategy drafts, copy, scripts, ideas</td></tr>
<tr><td>Image generation and editing</td><td>ChatGPT images, Adobe Firefly, Midjourney, Canva AI tools</td><td>Concepts, backgrounds, mock-ups, quick edits</td></tr>
<tr><td>Video and audio</td><td>CapCut, Descript, video generators, AI voice tools</td><td>Editing, captions, short clips, voiceovers</td></tr>
<tr><td>AI in marketing platforms</td><td>Features in Meta, Google Ads, HubSpot, Mailchimp</td><td>Ad variations, audience suggestions, send-time and subject line help</td></tr>
</table>`
          },
          {
            title: "Where AI helps most, and where it hurts",
            html: `
<table>
<tr><th>Strong uses</th><th>Weak or risky uses</th></tr>
<tr><td>Turning one idea into many formats</td><td>Publishing first drafts without editing</td></tr>
<tr><td>Summarising reviews, surveys and comments</td><td>Inventing statistics or customer quotes</td></tr>
<tr><td>Drafting briefs, calendars and outlines</td><td>Copying a competitor's style or content</td></tr>
<tr><td>Writing many ad and subject line variations to test</td><td>Fake reviews or testimonials</td></tr>
<tr><td>Rewriting for a different audience or channel</td><td>Realistic images of real people without consent</td></tr>
<tr><td>Scripts and shot lists for short videos</td><td>Trusting AI for "current trends" without checking</td></tr>
</table>
${EX(`<p>A two-person marketing team at a growing skincare brand used to publish three posts a week. They now hold one 45-minute planning session with AI each Monday, produce a week of drafts in an hour and spend the saved time filming real customer videos. Their engagement rose, and the reason was not the AI copy. It was the real content they finally had time to make.</p>`)}
<h3>The real opportunity</h3>
<p>AI saves the most time on <strong>first drafts, repurposing, research summaries and variations</strong>. Use that time for things AI cannot do: talking to customers, building partnerships, creating original content and making sharp creative decisions.</p>`
          },
          {
            title: "Avoiding the generic AI voice",
            html: `
<p>Audiences are learning to recognise AI-written content, and it costs trust. Common signs:</p>
<ul>
  <li>Openers like "In today's fast-paced world…" or "Are you ready to take your X to the next level?"</li>
  <li>Words such as "unlock", "elevate", "seamless", "game-changer", "dive in"</li>
  <li>Lists of three adjectives, too many emojis, and every sentence the same length</li>
  <li>Claims with no specifics: "high quality", "best in class", "trusted by many"</li>
</ul>
${P("Strip out the AI voice", `
Edit the text below so it sounds like a real person from our brand wrote it.
Remove clichés (e.g. "unlock", "elevate", "game-changer", "in today's world"), cut filler, vary sentence length, and replace vague claims with specific ones, using only the facts I give you.
If a claim has no supporting fact, mark it [NEEDS PROOF].

Facts about our product: [list]
Text: [paste]`)}
${WARN(`<p>Never publish a statistic, award, customer number or quote that AI produced unless you can trace it to a real source. Invented "facts" are the fastest way to lose credibility.</p>`)}`
          }
        ],
        practice: {
          title: "Audit your content week",
          brief: "Find where AI would save you the most time in your actual marketing work.",
          steps: [
            "List every marketing task you did in the last two weeks, including small ones like resizing images or replying to comments.",
            "Run the starter prompt with your list.",
            "Challenge the result. Move anything where AI would be the only source of facts or creativity to the risky column.",
            "Pick three tasks to try during this course and note them."
          ],
          prompt: `
I work in marketing. Below are the tasks I did in the last two weeks.
For each, tell me:
- whether AI could help (yes / partly / no)
- how, in one sentence
- the main risk, in one sentence
- what I must still do or check myself
Then rank the top 3 by time saved and low risk. Present it as a table.

My tasks:
[paste list]`,
          checklist: [
            "My list includes small, repeated tasks, not just big projects",
            "I moved tasks where AI would invent facts or replace real creativity to the risky column",
            "Each of my top three has a clear human check",
            "I wrote my top three in my notes"
          ]
        },
        quiz: [
          { q: "Now that everyone can create content quickly, what is a marketer's main advantage?", options: ["Posting more often than competitors", "Customer insight, taste and judgement", "Using the newest tool", "Longer posts"], answer: 1, why: "Speed is now common. Insight and creative judgement are what make content stand out." },
          { q: "An AI draft says \"Trusted by over 10,000 customers\". What should you do?", options: ["Publish it, it sounds good", "Keep it only if you can verify the number from a real source", "Round it to 9,000", "Ask the AI if it is true"], answer: 1, why: "AI can invent figures. Only publish claims you can back up." },
          { q: "Which is a strong first use of AI in marketing?", options: ["Writing fake testimonials", "Turning one webinar into many posts and emails", "Copying a competitor's campaign", "Publishing drafts unedited"], answer: 1, why: "Repurposing your own material is high value, low risk and easy to check." },
          { q: "Which phrase is a typical sign of generic AI writing?", options: ["\"Order by Friday for delivery Monday\"", "\"Unlock your potential and elevate your journey\"", "\"Our shop opens at 8am\"", "\"Rated 4.6 by 212 buyers on our site\""], answer: 1, why: "Vague, inflated phrases are typical of unedited AI copy. Specific, factual lines read as human." }
        ]
      },

      /* ============================ MODULE 2 ============================ */
      {
        id: "m2",
        title: "Know your customer with AI",
        summary: "Use AI to turn reviews, comments, surveys and interviews into clear customer insight, and build personas grounded in real data, not guesswork.",
        minutes: 40,
        outcomes: ["Mine reviews and comments for insight", "Build data-based personas", "Design better surveys and interviews"],
        lessons: [
          {
            title: "Mining what customers already say",
            html: `
<p>Your customers are already telling you what they want, in reviews, comments, support messages, sales call notes and survey answers. Reading hundreds of them takes days. AI can summarise them in minutes, and you check the conclusions against the raw comments.</p>
${P("Review and comment analysis", `
Below are [number] customer reviews and comments about [product/service] (names removed).
Analyse them and give me:
1. The top 5 things customers value, each with 2 short example quotes copied exactly from the text.
2. The top 5 complaints or frustrations, with example quotes.
3. The exact words customers use to describe the problem we solve (useful for ad copy).
4. Any surprising or unexpected themes.
Only use what is in the text. Do not invent quotes.

[paste comments]`)}
${TIP(`<p>Point 3, the customer's own words, is gold. The phrases real customers use usually make better headlines than anything a copywriter or an AI invents.</p>`)}
${WARN(`<p>Remove names, phone numbers, emails and order numbers before pasting customer data into an AI tool, and follow your organisation's data policy and local data protection law.</p>`)}`
          },
          {
            title: "Personas grounded in real data",
            html: `
<p>AI will happily invent a persona called "Busy Sarah, 34, loves yoga". That is fiction. A useful persona comes from <strong>your</strong> data: interviews, sales notes, analytics and reviews.</p>
${P("Build a data-based persona", `
Using only the research notes below, build up to 3 customer personas.
For each: who they are (role, situation), main goal, biggest frustration, what triggers them to look for a solution, objections before buying, where they look for information, and 3 exact phrases from the notes that capture their voice.
If the data does not support a detail, write "unknown, needs research" rather than guessing.

[paste research notes, survey summaries, sales notes]`)}
${EX(`<p>A training company assumed its buyers were HR managers. Analysis of 60 enquiry emails showed most first contact came from team leaders who had a specific problem and then convinced HR. The company rewrote its ads for team leaders and halved its cost per enquiry.</p>`)}
<h3>Competitor scans</h3>
<p>AI can help structure a competitor review: what they promise, who they target, how they price, what their reviews praise and criticise. Paste in what you collected from their websites and reviews. Do not rely on the AI's memory of a competitor, which may be outdated or wrong.</p>`
          },
          {
            title: "Better surveys and interviews",
            html: `
<p>Bad questions give useless answers. AI is good at spotting leading or confusing questions and suggesting better ones.</p>
${P("Improve a survey", `
Review my customer survey below.
Flag questions that are leading, double-barrelled, confusing or likely to give useless answers, and suggest a better version of each.
Keep it under [number] questions and under 5 minutes to complete. Suggest the best order.

[paste survey]`)}
${P("Customer interview guide", `
Create a 20-minute customer interview guide to understand why customers chose [product] and what nearly stopped them.
Use open questions about past behaviour (what they did), not hypotheticals (what they would do).
Include follow-up probes and a short opening script.`)}
${TIP(`<p>After interviews, paste your notes (anonymised) and ask the AI to compare answers across customers: "Where do these 8 interviews agree, and where do they differ?"</p>`)}`
          }
        ],
        practice: {
          title: "Find your customers' words",
          brief: "Turn real customer feedback into a short insight summary you can use in your next campaign.",
          steps: [
            "Collect 30 to 100 real reviews, comments or survey answers. Remove names and contact details.",
            "Run the starter prompt.",
            "Check 5 of the quotes the AI used against the original text to make sure they are real.",
            "Write down 3 customer phrases you will use in upcoming content."
          ],
          prompt: `
Here are anonymised customer comments about [product/service].
Give me:
1. Top 5 things they value (with exact quotes)
2. Top 5 frustrations (with exact quotes)
3. The words they use to describe their problem
4. 3 headline ideas built only from their own words
Do not invent or reword quotes.

[paste comments]`,
          checklist: [
            "I removed names, contact details and order numbers",
            "I checked at least 5 quotes against the original text",
            "Every insight is backed by real comments",
            "I noted 3 customer phrases to use"
          ]
        },
        quiz: [
          { q: "What makes a persona useful rather than fiction?", options: ["A name and a stock photo", "It is built from real research data, with gaps marked as unknown", "It is long and detailed", "The AI is confident about it"], answer: 1, why: "Personas guide decisions only if they reflect real customers. Marking gaps keeps them honest." },
          { q: "Why ask for exact quotes in review analysis?", options: ["To make the report longer", "So you can check the AI's themes against real text and reuse customer language", "AI cannot summarise", "It is a legal requirement"], answer: 1, why: "Exact quotes make the analysis checkable and give you authentic wording for copy." },
          { q: "Which interview question is best?", options: ["\"Would you buy this if it were cheaper?\"", "\"Tell me about the last time you tried to solve this problem.\"", "\"Don't you think our product is great?\"", "\"Would you recommend us?\""], answer: 1, why: "Questions about past behaviour give real evidence. Hypothetical and leading questions do not." },
          { q: "For a competitor review, what should you feed the AI?", options: ["Nothing, it knows all companies", "Information you collected from their current website and reviews", "Their confidential documents", "Only their logo"], answer: 1, why: "AI memory may be out of date or wrong. Current, public information you collected is reliable." }
        ]
      },

      /* ============================ MODULE 3 ============================ */
      {
        id: "m3",
        title: "Prompting and brand voice",
        summary: "A simple prompt structure for marketing, and a brand voice guide that makes AI drafts sound like you, not like everyone else.",
        minutes: 40,
        outcomes: ["Write prompts with the RCTFC structure", "Create a brand voice guide for AI", "Adapt tone by channel and audience"],
        lessons: [
          {
            title: "The RCTFC prompt structure",
            html: `
<table>
<tr><th>Part</th><th>Question it answers</th><th>Example</th></tr>
<tr><td><strong>R</strong>ole</td><td>Who should the AI act as?</td><td>"Act as a senior copywriter for a premium coffee brand…"</td></tr>
<tr><td><strong>C</strong>ontext</td><td>What is the situation?</td><td>"…we are launching a cold brew to office workers aged 25 to 40…"</td></tr>
<tr><td><strong>T</strong>ask</td><td>What exactly should it produce?</td><td>"…write 5 Instagram captions for launch week…"</td></tr>
<tr><td><strong>F</strong>ormat</td><td>What should it look like?</td><td>"…under 40 words each, one emoji max, end with a question…"</td></tr>
<tr><td><strong>C</strong>hecks</td><td>What rules and limits apply?</td><td>"…use only the product facts below; no health claims; avoid the words 'elevate' and 'unlock'."</td></tr>
</table>
${P("Launch captions (RCTFC)", `
Role: Act as a senior social media copywriter.
Context: We are [brand], selling [product] to [audience]. Key facts: [3 to 5 facts]. Our voice: [3 words, e.g. warm, witty, direct].
Task: Write 5 Instagram captions for launch week, each with a different angle (problem, benefit, behind the scenes, customer, offer).
Format: Under 40 words each, one emoji max, end with a question or a clear call to action.
Checks: Use only the facts given. No claims we cannot prove. Avoid: "elevate", "unlock", "game-changer".`)}
${TIP(`<p>Ask for options with <strong>different angles</strong>, not just "5 captions". Otherwise you get five versions of the same idea.</p>`)}`
          },
          {
            title: "A brand voice guide for AI",
            html: `
<p>The single best way to make AI sound like your brand is to give it a short voice guide <strong>and real examples</strong> every time. Examples beat descriptions.</p>
<h3>What goes in the guide</h3>
<ul>
  <li><strong>Who we are</strong> in two sentences</li>
  <li><strong>Voice in 3 words</strong>, each with "this, not that" (for example: confident, not arrogant)</li>
  <li><strong>Words we use</strong> and <strong>words we never use</strong></li>
  <li><strong>Rules:</strong> sentence length, emoji use, how we address the reader, spelling style</li>
  <li><strong>3 to 5 examples</strong> of our best real posts or emails</li>
</ul>
${P("Create a voice guide from examples", `
Below are 6 pieces of content our audience responded well to.
Analyse them and write a one-page brand voice guide: voice in 3 words (with "this, not that"), typical sentence length, vocabulary we use, words to avoid, how we open and close, emoji and punctuation habits.
Then write one new short post in this voice about [topic] so I can test the guide.

[paste examples]`)}
${EX(`<p>Save the guide in a document and paste it at the top of every content prompt, or save it in your AI tool's custom instructions or project settings if it has them. Consistency comes from using the same guide every time.</p>`)}`
          },
          {
            title: "Iterating and adapting tone",
            html: `
<p>Treat every first draft as a draft. Short, specific follow-ups improve it quickly:</p>
<ul>
  <li><strong>Sharper:</strong> "Make the first line stop the scroll. Give me 5 opening lines only."</li>
  <li><strong>Different reader:</strong> "Rewrite for a busy finance director, not a consumer."</li>
  <li><strong>Different channel:</strong> "Turn this into a LinkedIn post, then a 15-second video script."</li>
  <li><strong>Critique:</strong> "Score this from 1 to 10 for clarity and persuasion, and explain how to reach 9."</li>
  <li><strong>Keep and fix:</strong> "Keep everything except the ending, which is too salesy."</li>
</ul>
${P("Ask before writing", `
Before you write anything, ask me up to 5 questions about the audience, goal, offer and tone that you would need to do this really well. Wait for my answers.

Task: [describe the content]`)}
${P("Same message, many readers", `
Rewrite the message below for 3 audiences: [audience 1], [audience 2], [audience 3].
Keep the core offer identical. Change the angle, examples and tone for each. Under 80 words each.

[paste message]`)}
${WARN(`<p>If a long chat starts producing worse results, start a fresh chat and paste in your voice guide and a complete prompt.</p>`)}`
          }
        ],
        practice: {
          title: "Write your brand voice guide",
          brief: "Create a voice guide you will paste into every content prompt from now on.",
          steps: [
            "Collect 5 to 8 of your best-performing real posts, emails or pages.",
            "Run the starter prompt to draft the voice guide.",
            "Edit it: correct anything that does not feel like your brand and add your banned words.",
            "Test it: write one post with the guide and one without, and compare them."
          ],
          prompt: `
Here are examples of our best content.
Write a one-page brand voice guide with: who we are (2 sentences), voice in 3 words with "this, not that", vocabulary we use, words we never use, sentence and emoji style, how we open and close.
Then write one test post about [topic] using the guide.

[paste examples]`,
          checklist: [
            "The guide is based on real examples, not generic adjectives",
            "It includes a list of words we never use",
            "I compared a post written with the guide against one without it",
            "I saved the guide somewhere I can paste it from quickly"
          ]
        },
        quiz: [
          { q: "What improves brand voice in AI output the most?", options: ["Longer prompts in capital letters", "A short voice guide plus real examples of your content", "Asking for 'professional tone'", "Using more emojis"], answer: 1, why: "Examples show the AI what you mean far better than adjectives do." },
          { q: "Why ask for captions with different angles?", options: ["To use more words", "To avoid five versions of the same idea", "Platforms require it", "To confuse the algorithm"], answer: 1, why: "Different angles give genuinely different options to choose from and test." },
          { q: "What belongs in the Checks part of a marketing prompt?", options: ["The publish date", "Rules such as 'use only these facts' and 'no health claims'", "The AI's name", "Hashtags"], answer: 1, why: "Checks stop invented claims and keep content within brand and legal limits." },
          { q: "A good \"this, not that\" example is…", options: ["Friendly, not unfriendly", "Confident, not arrogant", "Good, not bad", "Short, not long"], answer: 1, why: "It draws a useful line between a quality you want and the version of it that goes too far." }
        ]
      },

      /* ============================ MODULE 4 ============================ */
      {
        id: "m4",
        title: "Content creation at scale",
        summary: "Plan content pillars and calendars, turn one idea into ten pieces, and write blogs and video scripts faster, without flooding your channels with filler.",
        minutes: 45,
        outcomes: ["Plan content pillars and a calendar", "Repurpose one asset into many", "Draft blog posts and video scripts"],
        lessons: [
          {
            title: "Pillars and calendars",
            html: `
<p>Content pillars are the 3 to 5 themes your brand talks about consistently. They keep content focused and make planning easy.</p>
${P("Content pillars", `
We are [brand], helping [audience] with [problem]. Our goals this quarter: [goals].
Suggest 4 content pillars. For each: why it matters to our audience, 5 post ideas, and which format suits it best (carousel, short video, story, article, email).
Base ideas on these customer insights: [paste insights from Module 2].`)}
${P("Monthly calendar", `
Using these pillars [paste], create a content calendar for [month] for [channels].
Posting frequency: [e.g. 3 per week on Instagram, 2 on LinkedIn, 1 email].
Include key dates relevant to our audience and industry: [list any you know].
Columns: date, channel, pillar, idea, format, call to action, owner.
Balance the pillars evenly and avoid repeating the same format back to back.`)}
${WARN(`<p>AI may suggest "awareness days" or holidays that do not exist or fall on different dates. Check every date before you schedule anything.</p>`)}`
          },
          {
            title: "One idea, ten pieces",
            html: `
<p>Repurposing is where AI saves the most time. Start from one strong piece of original content (a webinar, an interview, a report, a case study) and turn it into many.</p>
${P("Repurpose a long piece", `
Below is the transcript of our [webinar / interview / report].
Turn it into:
- 5 short social posts, each built on one specific insight
- 1 LinkedIn article outline
- 3 short video ideas (hook, main point, call to action)
- 1 email newsletter section (under 150 words)
- 5 quote cards: exact quotes from the transcript, under 20 words each
Use only what is in the transcript. Keep our voice: [paste voice guide].

[paste transcript]`)}
${EX(`<p>A 40-minute customer panel recording became a month of content: 12 posts, 4 short clips, 2 emails and a blog post. The team spent one afternoon editing instead of two weeks writing from scratch.</p>`)}
${TIP(`<p>Most video and meeting tools can export a transcript automatically. That transcript is your best raw material.</p>`)}`
          },
          {
            title: "Blogs, SEO basics and video scripts",
            html: `
<h3>Blog posts that are worth reading</h3>
<p>Search engines and readers reward content that is genuinely helpful and shows real experience. Use AI for the structure and first draft, then add what only you have: real examples, data, opinions and expertise.</p>
${P("Blog outline", `
Create an outline for a blog post answering: "[the question your customer types into a search engine]".
Audience: [who]. Goal: [what they should do after reading].
Include: a working title, the questions a reader would want answered (as H2 headings), where to add our own examples or data [ADD OUR EXAMPLE], and a short meta description under 155 characters.`)}
<h3>Short video scripts</h3>
${P("15 to 30 second video script", `
Write 3 short video scripts (15 to 30 seconds) about [topic] for [platform].
Each script: a hook in the first 2 seconds, the main point, and a call to action.
Show it as a table: time, what we see on screen, what is said, on-screen text.
It should be filmable on a phone by one person.`)}
${WARN(`<p>Publishing large volumes of unedited AI content can hurt your brand and your search rankings. Fewer, better pieces beat many generic ones.</p>`)}`
          }
        ],
        practice: {
          title: "Turn one asset into a week of content",
          brief: "Take one real piece of content you already have and repurpose it into a full week of posts.",
          steps: [
            "Pick a real long-form asset: a webinar, presentation, report, interview or long post.",
            "Get a transcript or the full text.",
            "Run the starter prompt with your voice guide.",
            "Edit every piece. Check every quote and fact against the original."
          ],
          prompt: `
Here is our [asset type] and our brand voice guide.
Turn it into a week of content for [channels]: [number] posts, 2 short video ideas and 1 email section.
Each piece must be built on one specific point from the source. Quotes must be exact.
Show it as a table: day, channel, content, call to action.

Voice guide: [paste]
Source: [paste]`,
          checklist: [
            "Every piece is based on a real point from the source",
            "All quotes match the original exactly",
            "I edited every piece for voice and removed AI clichés",
            "I scheduled or saved the week of content"
          ]
        },
        quiz: [
          { q: "What are content pillars?", options: ["Hashtags", "3 to 5 consistent themes your brand talks about", "Paid ads", "Posting times"], answer: 1, why: "Pillars keep content focused and make planning simpler." },
          { q: "What is the best raw material for repurposing?", options: ["A competitor's blog", "Your own strong original content, such as a webinar transcript", "Random AI ideas", "Stock photos"], answer: 1, why: "Original material contains your real expertise. AI multiplies it into new formats." },
          { q: "An AI calendar includes a 'National Marketing Day' on 14 March. What do you do?", options: ["Schedule a big campaign", "Check that the day exists and the date is right first", "Move it to 15 March", "Ignore all dates"], answer: 1, why: "AI can invent or misdate awareness days. Always check them." },
          { q: "What makes a blog post rank and convert better?", options: ["More AI-generated words", "Real examples, data and expertise added to a clear structure", "Keyword repetition", "Longer titles"], answer: 1, why: "Helpful content with real experience serves readers and search engines better than generic volume." }
        ]
      },

      /* ============================ MODULE 5 ============================ */
      {
        id: "m5",
        title: "Social media and messaging marketing",
        summary: "Write for each platform, manage comments and DMs faster, and use AI with WhatsApp and other messaging channels while respecting customers' consent.",
        minutes: 40,
        outcomes: ["Adapt content per platform", "Speed up community replies", "Plan messaging campaigns with consent"],
        lessons: [
          {
            title: "Writing for each platform",
            html: `
<p>Each platform rewards different behaviour. AI can adapt one message to each, if you tell it the rules.</p>
<table>
<tr><th>Platform</th><th>What tends to work</th></tr>
<tr><td>Instagram</td><td>Strong visual, short caption with a hook, carousels that teach, Reels</td></tr>
<tr><td>TikTok</td><td>Native-feeling short video, hook in the first 2 seconds, trends used with your own twist</td></tr>
<tr><td>LinkedIn</td><td>Personal insight and lessons, clear first two lines, professional but human</td></tr>
<tr><td>Facebook</td><td>Community, local groups, events, longer captions are fine</td></tr>
<tr><td>X (Twitter)</td><td>Short, sharp opinions, threads for depth</td></tr>
</table>
${P("Adapt across platforms", `
Adapt this core message for Instagram, LinkedIn, TikTok (as a video idea) and Facebook.
Follow what usually works on each platform. Keep our voice: [paste voice guide].
Core message: [paste]
Call to action: [what we want people to do]`)}
${TIP(`<p>Platform best practice changes often. Check what is working now by looking at your own analytics and at accounts in your niche, not just at the AI's general advice.</p>`)}`
          },
          {
            title: "Comments, DMs and community",
            html: `
<p>Fast, human replies build loyalty. AI can draft replies to common questions so you respond in minutes, not days.</p>
${P("Reply library", `
Here are the 15 most common questions and comments we get on social media and messaging, plus our policies (delivery, returns, prices, opening hours).
Write a friendly, short reply for each in our voice. Where the answer depends on details, ask the customer for them.
For complaints, acknowledge first, then offer a clear next step. Never promise what our policy does not allow.

Questions: [paste]
Policies: [paste]
Voice: [paste]`)}
${WARN(`<p>Do not let AI reply to customers automatically without review unless you have tested it thoroughly and set clear limits. One wrong promise or tone-deaf reply to an angry customer can spread fast. Complaints and sensitive topics always need a human.</p>`)}
${EX(`<p>A restaurant saved its reply library as quick replies in WhatsApp Business and as saved replies on Instagram. Average response time dropped from about five hours to under thirty minutes, and staff still personalised each reply.</p>`)}`
          },
          {
            title: "WhatsApp and messaging campaigns",
            html: `
<p>In many markets, messaging apps like WhatsApp are where customers actually talk to businesses. Tools such as <strong>WhatsApp Business</strong> offer catalogues, labels, quick replies and broadcast features, and larger businesses use the WhatsApp Business Platform through approved providers.</p>
<h3>Consent first</h3>
<p>Messaging is personal. Only message people who have agreed to hear from you, make it easy to opt out, and do not send too often. WhatsApp's own business policies require opt-in, and many countries' laws regulate marketing messages. Spammy messaging gets numbers blocked and reported.</p>
${P("Broadcast message", `
Write 3 versions of a short WhatsApp broadcast message for customers who opted in to hear from us.
Purpose: [e.g. new stock arrived / weekend offer / event reminder].
Rules: under 60 words, friendly, one clear call to action, no more than one emoji, include how to stop receiving messages: "Reply STOP to opt out".`)}
${P("Catalogue descriptions", `
Write short product descriptions for our WhatsApp catalogue (under 40 words each) for the products below.
Lead with the main benefit, include the key detail a buyer needs (size, colour, price, delivery), and keep our voice.

[paste product list with facts]`)}`
          }
        ],
        practice: {
          title: "Build your reply library",
          brief: "Create ready-to-use replies for your most common customer questions.",
          steps: [
            "List your 15 most frequent questions and comments from social media and messaging.",
            "Gather the policies the answers depend on: delivery, returns, prices, hours.",
            "Run the starter prompt with your voice guide.",
            "Check every reply against policy, then save them as quick or saved replies in your tools."
          ],
          prompt: `
Here are our most common customer questions and our policies.
Write a short, friendly reply for each in our brand voice.
Ask for details where needed. For complaints: acknowledge, then give a clear next step.
Never promise anything outside our policies.

Questions: [paste]
Policies: [paste]
Voice: [paste]`,
          checklist: [
            "Every reply matches our real policies",
            "Complaint replies acknowledge the problem before offering a solution",
            "The replies sound like our brand, not like a robot",
            "I saved them as quick replies or saved replies"
          ]
        },
        quiz: [
          { q: "What is the safest way to use AI for customer replies?", options: ["Fully automatic replies to everything", "A reviewed reply library, with humans handling complaints and sensitive topics", "Never reply", "Copy replies from competitors"], answer: 1, why: "Reviewed templates give speed. Human judgement protects you in difficult conversations." },
          { q: "Before sending a WhatsApp broadcast, you must…", options: ["Add many emojis", "Make sure recipients opted in and can easily opt out", "Send it at midnight", "Include every product"], answer: 1, why: "Consent is required by platform policy and often by law, and it protects your number and reputation." },
          { q: "How should you check what works on a platform right now?", options: ["Trust the AI's general advice", "Look at your own analytics and active accounts in your niche", "Post the same thing everywhere", "Ask once a year"], answer: 1, why: "Platforms change often. Your own current data is the most reliable guide." },
          { q: "A good reply to a complaint starts by…", options: ["Explaining your policy", "Acknowledging the customer's problem", "Offering a discount immediately", "Asking them to delete the comment"], answer: 1, why: "Acknowledgement calms the situation and shows you listened before you solve." }
        ]
      },

      /* ============================ MODULE 6 ============================ */
      {
        id: "m6",
        title: "Visuals and video with AI",
        summary: "Brief image and video tools well, keep visuals on-brand, and understand the rights, disclosure and authenticity rules that protect your reputation.",
        minutes: 40,
        outcomes: ["Write effective image prompts", "Keep AI visuals on-brand", "Apply rules on rights and disclosure"],
        lessons: [
          {
            title: "Briefing image tools",
            html: `
<p>Image tools respond to clear, visual descriptions. A good image prompt covers <strong>subject, setting, style, lighting, composition and mood</strong>.</p>
${P("Image prompt structure", `
[Subject]: a ceramic coffee cup with steam rising, on a wooden desk next to an open laptop
[Setting]: bright modern office, morning
[Style]: clean product photography, natural colours
[Lighting]: soft window light from the left
[Composition]: close-up, cup on the left third, blurred background, empty space on the right for text
[Mood]: calm, focused
[Format]: square, 1:1`)}
${P("Let the chat tool write the image prompt", `
I need an image for [purpose, e.g. an Instagram post announcing our new opening hours].
Our brand colours: [colours]. Our style: [e.g. bright, minimal, real people, warm].
Write 3 detailed image-generation prompts in different styles, each with subject, setting, style, lighting, composition, mood and aspect ratio. Leave space for text.`)}
${TIP(`<p>Image tools are still unreliable with text inside images, hands and exact product details. Add text in a design tool like Canva afterwards, and use real photos for your actual products.</p>`)}`
          },
          {
            title: "Staying on-brand",
            html: `
<p>AI visuals can make every brand look the same. Keep yours distinct:</p>
<ul>
  <li><strong>Use real photos where it matters most</strong>: your team, your products, your customers. Authentic images usually build more trust.</li>
  <li><strong>Use AI for the supporting parts</strong>: backgrounds, concepts, mock-ups, removing distractions, extending an image.</li>
  <li><strong>Create a visual style guide</strong>: colours, fonts, photo style, what to avoid. Paste the style parts into image prompts.</li>
  <li><strong>Use templates</strong> in your design tool so layouts stay consistent.</li>
</ul>
${P("Visual style guide", `
Based on our brand description and these colours, draft a one-page visual style guide for social media: colour use, photo style (what to show and avoid), illustration style, text on images, and 5 example image prompts that follow the guide.

Brand: [description]
Colours: [hex codes]
Audience: [who]`)}
${EX(`<p>A fashion retailer uses AI to create seasonal backgrounds and scenes, but always photographs the actual clothes. Customers see exactly what they will receive, and returns stay low.</p>`)}`
          },
          {
            title: "Rights, disclosure and trust",
            html: `
<table>
<tr><th>Rule</th><th>Why it matters</th></tr>
<tr><td>Never create realistic images or videos of real people without their permission</td><td>Deepfakes damage trust and may be illegal</td></tr>
<tr><td>Do not ask for images "in the style of" a living artist or copy brands, logos or characters</td><td>Copyright, trademark and reputation risks</td></tr>
<tr><td>Do not show AI images as real product photos or real results</td><td>Misleading advertising rules in many countries</td></tr>
<tr><td>Follow platform rules on labelling AI content</td><td>Meta, TikTok and YouTube have AI-content labelling policies</td></tr>
<tr><td>Check each tool's terms for commercial use</td><td>Some free plans limit commercial rights</td></tr>
</table>
${WARN(`<p>"Before and after" images, testimonials with faces, and anything showing results (health, beauty, finance) must be real. Using AI here can break advertising law and destroy trust.</p>`)}
${TIP(`<p>When in doubt, disclose. A simple note such as "Image created with AI" rarely hurts performance, and it protects your credibility.</p>`)}`
          }
        ],
        practice: {
          title: "Create an on-brand visual set",
          brief: "Produce three on-brand visuals for an upcoming post, following your style rules.",
          steps: [
            "Write down your brand colours, photo style and what to avoid.",
            "Use the starter prompt to get 3 image prompts.",
            "Generate the images in your tool, and add any text in a design tool.",
            "Check each image against the rights and disclosure table."
          ],
          prompt: `
I need 3 visuals for [purpose] on [platform].
Brand colours: [colours]. Photo style: [style]. Avoid: [list].
Write 3 image-generation prompts in different styles, each with subject, setting, style, lighting, composition, mood and aspect ratio. Leave clear space for text, which I will add separately.`,
          checklist: [
            "No real person is shown without permission",
            "No AI image is presented as a real product photo or a real result",
            "Text was added in a design tool, not generated in the image",
            "I checked the tool's terms allow commercial use"
          ]
        },
        quiz: [
          { q: "Which details make a strong image prompt?", options: ["Just the subject", "Subject, setting, style, lighting, composition and mood", "As many adjectives as possible", "A competitor's image"], answer: 1, why: "Clear visual details give the tool what it needs to produce what you imagine." },
          { q: "Where should you use real photos rather than AI images?", options: ["Backgrounds", "Your actual products, team and customer results", "Concept mock-ups", "Abstract patterns"], answer: 1, why: "Customers need to see what is real. AI images of products or results can mislead." },
          { q: "Why add text in a design tool instead of the image generator?", options: ["Image tools are often unreliable with text", "Design tools are free", "AI images cannot be edited", "Platforms ban AI text"], answer: 0, why: "Generated text is often misspelled or distorted. Design tools give clean, editable text." },
          { q: "Which of these is a serious risk?", options: ["Using AI for a background", "Creating a realistic video of a real person without permission", "Writing an image prompt", "Disclosing AI use"], answer: 1, why: "Deepfakes of real people damage trust and can break the law." }
        ]
      },

      /* ============================ MODULE 7 ============================ */
      {
        id: "m7",
        title: "Campaigns, ads and email",
        summary: "Write sharper campaign briefs, generate ad variations to test, improve landing pages and build email sequences that convert.",
        minutes: 45,
        outcomes: ["Write a campaign brief with AI", "Create ad variations for testing", "Draft landing pages and email sequences"],
        lessons: [
          {
            title: "The campaign brief",
            html: `
<p>A clear brief makes every later step faster, for you, your team, your agency and the AI.</p>
${P("Campaign brief", `
Help me write a one-page campaign brief. Ask me questions first if anything is missing.
Sections: objective (one measurable goal), audience (from our research), key insight, single-minded message, proof points, offer, channels, budget, timeline, KPIs, and mandatory elements (logo, legal lines).
Here is what I know so far: [paste notes]`)}
${P("Stress-test the idea", `
Here is our campaign brief. Act as a sceptical marketing director.
List the 5 weakest points: unclear goals, weak insight, message not believable, wrong channel, unrealistic budget or timeline. For each, suggest a fix.

[paste brief]`)}
${TIP(`<p>"Single-minded message" means one main idea. If the brief has three messages, the campaign will communicate none of them well.</p>`)}`
          },
          {
            title: "Ad copy and testing",
            html: `
<p>AI is excellent at producing many <strong>genuinely different</strong> variations, which is exactly what testing needs.</p>
${P("Ad variations", `
Write ad copy for [platform] promoting [offer] to [audience].
Give me 6 variations, each using a different angle: pain point, benefit, social proof (use only these real facts: [facts]), urgency, curiosity, and a direct offer.
For each: headline (under [x] characters), primary text (under [x] characters), call to action.
Mark which 2 you would test first and why.`)}
<h3>Test properly</h3>
<ul>
  <li>Change <strong>one thing at a time</strong> (headline, image or offer) so you know what made the difference.</li>
  <li>Give each test enough budget and time to reach a meaningful number of results before deciding.</li>
  <li>Record what you learned in a simple test log, so you do not repeat tests.</li>
</ul>
${WARN(`<p>Ads in sensitive categories (health, finance, employment, housing, politics) have extra platform rules and legal requirements. Check them before you write, and never let AI add claims you cannot prove.</p>`)}`
          },
          {
            title: "Landing pages and email sequences",
            html: `
${P("Landing page review", `
Review this landing page copy as a conversion copywriter.
Check: is the main benefit clear in 5 seconds, does the headline match the ad, are objections answered, is there proof, is the call to action clear and repeated?
Give me the top 5 changes in order of likely impact, and a rewritten headline and subheadline (3 options).

Ad that sends traffic here: [paste]
Page copy: [paste]`)}
${P("Welcome email sequence", `
Write a 4-email welcome sequence for new subscribers who signed up for [lead magnet / reason].
Goal: [e.g. first purchase within 14 days].
Email 1 (immediately): deliver what they signed up for and set expectations.
Email 2 (day 2): our story and why we exist.
Email 3 (day 5): a customer story or proof (use only these real facts: [facts]).
Email 4 (day 9): the offer, with a clear reason to act now.
For each: 3 subject line options, preview text, and body under 150 words in our voice: [paste voice guide].`)}
${EX(`<p>A small online bookshop added a four-email welcome sequence written with AI and edited by the owner. First-purchase rate among new subscribers roughly doubled, because new subscribers now got a reason to buy while they were still interested.</p>`)}`
          }
        ],
        practice: {
          title: "Brief and build a mini campaign",
          brief: "Plan one real campaign and produce its ad variations and email.",
          steps: [
            "Choose a real upcoming offer, launch or event.",
            "Write the brief with AI, then stress-test it with the sceptical director prompt.",
            "Produce 6 ad variations and pick 2 to test.",
            "Write one email that supports the campaign."
          ],
          prompt: `
Help me build a mini campaign.
Offer: [what]. Audience: [who, with insight]. Goal: [one measurable goal]. Budget and timeline: [details]. Real proof points: [facts].
Give me:
1. A one-page brief
2. 6 ad variations with different angles (headline, primary text, CTA)
3. One supporting email with 3 subject line options
Use only the facts I gave you. Voice: [paste voice guide].`,
          checklist: [
            "The brief has one measurable objective and one main message",
            "Every claim in the ads is backed by a real fact",
            "I chose 2 variations to test and what single thing differs between them",
            "The email matches the ad's message and offer"
          ]
        },
        quiz: [
          { q: "What does 'single-minded message' mean in a brief?", options: ["A message for one person", "One main idea the campaign communicates", "A message with no visuals", "A one-word slogan"], answer: 1, why: "Campaigns with one clear idea are remembered. Several messages compete with each other." },
          { q: "What is the right way to run an ad test?", options: ["Change everything at once", "Change one thing at a time and give it enough results to decide", "Stop after one day", "Test only the colour"], answer: 1, why: "Isolating one change shows what actually caused the difference." },
          { q: "Why should a landing page headline match the ad?", options: ["For SEO only", "So visitors immediately feel they are in the right place", "It is required by law", "To save writing time"], answer: 1, why: "A mismatch between ad and page makes people leave." },
          { q: "What should email 1 of a welcome sequence do?", options: ["Push the biggest discount", "Deliver what they signed up for and set expectations", "Ask for a review", "Tell the full company history"], answer: 1, why: "Delivering the promise first builds trust for the emails that follow." }
        ]
      },

      /* ============================ MODULE 8 ============================ */
      {
        id: "m8",
        title: "Measurement, ethics and your AI routine",
        summary: "Turn analytics into decisions, use AI honestly and legally, and build a weekly routine and team plan that makes the gains last.",
        minutes: 40,
        outcomes: ["Turn data into clear marketing reports", "Apply core ethical and legal rules", "Plan a 30-day team roll-out"],
        lessons: [
          {
            title: "From analytics to decisions",
            html: `
<p>Most marketing reports list numbers. Good ones say <strong>what worked, why, and what to do next</strong>. Export your data, calculate key figures in a spreadsheet, then use AI to help interpret and write.</p>
${P("Monthly performance summary", `
Act as a marketing analyst. Below are this month's results by channel and campaign, with last month for comparison (percentage changes already calculated).
1. Summarise the 3 most important findings in plain English.
2. Suggest likely reasons for each, and how I could confirm them.
3. Recommend 3 actions for next month, ranked by likely impact.
4. Point out any number that looks suspicious or may be a tracking problem.
Use only the data given. Do not calculate new totals.

[paste data]`)}
${TIP(`<p>Focus on a few metrics tied to business results, such as leads, sales, cost per acquisition and retention. Likes and impressions are useful signals, not goals.</p>`)}
${WARN(`<p>AI explanations for why numbers changed are guesses until you confirm them. Check tracking, seasonality, budget changes and what competitors did.</p>`)}`
          },
          {
            title: "Ethics and the law",
            html: `
<p>Trust is a marketer's most valuable asset. AI makes it easier to cut corners, so the rules matter more.</p>
<table>
<tr><th>Never</th><th>Always</th></tr>
<tr><td>Write fake reviews, testimonials or endorsements</td><td>Use real customer words, with permission</td></tr>
<tr><td>Invent statistics, awards or results</td><td>Check every claim against a source you can show</td></tr>
<tr><td>Paste customer personal data into tools without approval</td><td>Anonymise and follow data protection law</td></tr>
<tr><td>Copy competitors' or creators' work</td><td>Create original work and respect copyright</td></tr>
<tr><td>Hide paid partnerships or mislead with AI images</td><td>Disclose sponsorships and label AI content where required</td></tr>
<tr><td>Target vulnerable groups with manipulative messages</td><td>Market in a way you would be proud to explain publicly</td></tr>
</table>
<p>Consumer protection and advertising regulators in many countries actively act against fake reviews and misleading claims, and data protection laws such as the GDPR in the EU and UK, and similar national laws elsewhere, regulate how you use customer data. Ask your legal or compliance contact when unsure.</p>`
          },
          {
            title: "Your weekly routine and team plan",
            html: `
<table>
<tr><th>When</th><th>Routine</th></tr>
<tr><td>Monday</td><td>Plan the week's content from pillars and calendar; draft with your voice guide.</td></tr>
<tr><td>Daily</td><td>Replies from your library, quick copy edits, caption variations.</td></tr>
<tr><td>Per campaign</td><td>Brief, stress-test, ad variations, email support.</td></tr>
<tr><td>Monthly</td><td>Performance summary and next month's actions; update the test log.</td></tr>
<tr><td>Quarterly</td><td>Refresh customer insight, voice guide and prompt library.</td></tr>
</table>
<h3>A 30-day team roll-out</h3>
<table>
<tr><th>Week</th><th>Focus</th><th>Output</th></tr>
<tr><td>1</td><td>Agree rules: approved tools, data, claims, disclosure</td><td>One-page AI use guideline</td></tr>
<tr><td>2</td><td>Shared voice guide and reply library</td><td>Everyone uses the same foundations</td></tr>
<tr><td>3</td><td>Run one campaign with AI end to end</td><td>Shared prompts for that campaign type</td></tr>
<tr><td>4</td><td>Measure and decide</td><td>Time saved, results, what to scale</td></tr>
</table>
${P("Team AI guideline", `
Draft a one-page AI use guideline for a marketing team of [number] at [type of organisation].
Cover: approved tools, customer data rules, fact-checking claims, rules for AI images and video, disclosure, review before publishing, and who to ask when unsure.
Plain English, practical.`)}
${TIP(`<p>Congratulations on reaching the end. Finish the practice task and quiz to unlock your certificate, and keep the Prompt library open as your daily toolkit.</p>`)}`
          }
        ],
        practice: {
          title: "Report, then plan your next 30 days",
          brief: "Produce a real performance summary and leave with a routine and a team plan.",
          steps: [
            "Export last month's results and calculate the key changes in a spreadsheet.",
            "Run the performance summary prompt and check every reason it suggests.",
            "Write your weekly routine using the table in lesson 3.",
            "Use the starter prompt to draft a 30-day team roll-out plan."
          ],
          prompt: `
Help me plan a 30-day AI adoption plan for my marketing team.
Team: [size and roles]. Organisation: [type]. Channels: [list]. Tools we can use: [list].
Our most time-consuming tasks: [list]. Our main concern: [e.g. quality, brand voice, legal risk].
Give a week-by-week plan with actions, owner, output and 2 to 3 measures of success. Keep it realistic for a busy team.`,
          checklist: [
            "My performance summary uses only verified numbers",
            "Each suggested reason is either confirmed or marked as a guess",
            "My routine names specific days and tasks",
            "The team plan includes rules on data, claims and disclosure"
          ]
        },
        quiz: [
          { q: "Which metric is closest to a business result?", options: ["Impressions", "Likes", "Cost per acquisition", "Follower count"], answer: 2, why: "Cost per acquisition links marketing spend directly to customers won." },
          { q: "The AI says engagement dropped 'because of the algorithm'. What now?", options: ["Accept it", "Treat it as a guess and check tracking, seasonality, budget and content changes", "Post more", "Stop measuring"], answer: 1, why: "AI explanations are hypotheses until confirmed by evidence." },
          { q: "A client asks you to write 20 five-star reviews with AI. You should…", options: ["Write them, but make them varied", "Decline: fake reviews are deceptive and illegal in many places", "Write 10 instead", "Post them from different accounts"], answer: 1, why: "Fake reviews break trust and consumer protection laws. Encourage real customers to review instead." },
          { q: "What should week 1 of a team roll-out cover?", options: ["Automating all posts", "Agreeing rules on tools, data, claims and disclosure", "Buying ads", "Hiring an agency"], answer: 1, why: "Clear rules first prevent brand, legal and data problems later." }
        ]
      }
    ]
  };
})(typeof window !== "undefined" ? window : globalThis);
