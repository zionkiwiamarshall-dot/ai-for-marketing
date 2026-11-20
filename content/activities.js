/* AI for Marketing — interactive layer: activities, flashcards, diagrams, before/after examples, builder presets. */
(function (root) {
  root.EXTRAS = {
    heroArt: "hero-marketing",
    art: { m1: "ai-spark", m2: "customer", m3: "voice", m4: "content", m5: "social", m6: "image", m7: "funnel", m8: "growth" },

    figures: {
      "m1:1": { art: "dg-verify", caption: "AI makes the first draft. Your judgement makes it publishable." },
      "m3:0": { art: "dg-rctfc", caption: "Five parts of a prompt that sounds like your brand." },
      "m4:1": { art: "dg-repurpose", caption: "One strong source can feed a month of content." },
      "m7:0": { art: "dg-brief", caption: "The eight parts of a campaign brief. Number 4 matters most." },
      "m8:0": { art: "dg-funnel", caption: "Match each metric to the stage it measures." }
    },

    compare: {
      "m1:2": {
        title: "A product post: generic vs specific",
        weak: {
          prompt: "Write an Instagram post for our new coffee.",
          output: "☕✨ Elevate your mornings with our game-changing new blend! Crafted with passion and bursting with flavour, it's the perfect way to unlock your potential every day. Are you ready to take your coffee experience to the next level? 🚀🔥 #coffee #morningvibes",
          verdict: "Every cliché in the book. It could be any brand and sounds unmistakably like AI."
        },
        strong: {
          prompt: "Write an Instagram caption for our new cold brew.\nFacts: steeped 18 hours, single-origin beans from one farm, 330ml bottle, launches Monday, sold in our 3 shops.\nAudience: office workers 25–40. Voice: warm, dry humour, short sentences.\nUnder 40 words, one emoji max. Avoid: elevate, unlock, game-changer.",
          output: "18 hours in the making. About 4 seconds to finish. ☕\nOur single-origin cold brew lands in all three shops on Monday. Grab one before your 9am. What's your go-to coffee order?",
          verdict: "Specific, believable and on-voice. The facts do the persuading."
        }
      },
      "m3:1": {
        title: "Same request, with and without a voice guide",
        weak: {
          prompt: "Write a short email announcing our Saturday workshop.",
          output: "Dear Valued Customer,\n\nWe are excited to announce an exciting upcoming workshop this Saturday! This is a fantastic opportunity to learn new skills in a fun and engaging environment. Don't miss out on this amazing event!\n\nBest regards,\nThe Team",
          verdict: "Formal, empty and over-excited. Nobody would reply to this."
        },
        strong: {
          prompt: "Voice guide: friendly, practical, no hype. We say 'you', not 'valued customer'. Short sentences. Never use 'exciting' or 'amazing'.\nExample of our style: 'New stock in. Same great beans, slightly better price.'\nTask: email announcing a 2-hour home-barista workshop, Saturday 10am, 12 seats, $15.",
          output: "Subject: Make café-quality coffee at home (Saturday, 12 seats)\n\nHi,\n\nThis Saturday at 10am we're running a 2-hour home-barista workshop. You'll learn grind size, ratios and milk texture on real machines.\n\n12 seats, $15 each. Reply to this email to book yours.\n\nSee you there,\nAmina at Bean Street",
          verdict: "Sounds like a real person, gives every detail and has one clear action."
        }
      },
      "m7:1": {
        title: "Ad variations for testing",
        weak: {
          prompt: "Write 5 Facebook ads for our accounting software.",
          output: "1. Simplify your accounting today!\n2. Make accounting easy with our software!\n3. Accounting made simple!\n4. The easy way to do your accounts!\n5. Say goodbye to accounting stress!",
          verdict: "Five versions of one idea. Testing these teaches you nothing."
        },
        strong: {
          prompt: "Write 4 Facebook ads for invoicing software for small business owners.\nUse a different angle for each: pain point, time saved, social proof (real fact: 2,300 businesses use it), direct offer (30-day free trial).\nHeadline under 40 characters, primary text under 125.",
          output: "PAIN: \"Still chasing unpaid invoices?\" / Automatic reminders go out so you don't have to.\nTIME: \"Invoices done in 60 seconds\" / Create, send and track from your phone.\nPROOF: \"2,300 businesses get paid faster\" / Join owners who stopped chasing payments.\nOFFER: \"Try it free for 30 days\" / No card needed. Send your first invoice today.",
          verdict: "Genuinely different angles, so a test tells you which message your market responds to."
        }
      }
    },

    acts: {
      m1: [
        { type: "check", q: "Why does a vague prompt usually produce forgettable marketing copy?", options: ["AI tools are bad at writing", "The model falls back on the most typical, average answer", "Vague prompts are blocked", "It only uses old data"], answer: 1, why: "With little to go on, the model predicts the most common pattern, and common is exactly what doesn't stand out." },
        { type: "sort", prompt: "Strong use of AI, or risky?", bins: ["Strong use", "Risky"], items: [
          ["Summarising 300 product reviews into themes", 0], ["Writing 'customer testimonials' for the website", 1, "Fake testimonials are deceptive and often illegal."],
          ["Turning a webinar transcript into 10 posts", 0], ["Asking AI for 'current TikTok trends' and posting straight away", 1, "AI trend knowledge may be outdated. Check the platform itself."],
          ["Writing 8 subject line options to A/B test", 0], ["Generating a realistic photo of a famous person using your product", 1, "Using someone's likeness without consent is a legal and trust risk."]] },
        { type: "spot", prompt: "This AI caption has classic AI-voice problems. Find them.", lines: [
          ["In today's fast-paced world, finding time for yourself is harder than ever.", true, "Cliché opener that every AI uses. Start with something specific."],
          ["Our 20-minute yoga classes run at 7am and 6pm, Monday to Friday.", false],
          ["Unlock your inner peace and elevate your wellness journey!", true, "'Unlock' and 'elevate' are AI tells. They say nothing."],
          ["Your first class is free. Just bring water.", false],
          ["Join over 50,000 happy members worldwide!", true, "A suspicious statistic. Only use it if it's true and you can prove it."]] }
      ],
      m2: [
        { type: "spot", prompt: "Check this AI review analysis against the reviews. Which lines can't be trusted?", context: "The AI was given 40 reviews of a meal-kit service.", lines: [
          ["Customers most value how fast they can cook: 'dinner in 20 minutes' appears in 11 reviews.", false],
          ["One customer said: 'This changed my life and saved my marriage.'", true, "Check it. If this quote isn't in the reviews word for word, it's invented."],
          ["The most common complaint is too much plastic packaging.", false],
          ["Around 85% of customers are working parents.", true, "Reviews don't contain this data. It's a guess presented as a fact."],
          ["Several customers describe the problem as 'the 6pm panic'.", false]] },
        { type: "scenario", art: "customer", situation: "You ask AI for a persona. It returns 'Busy Sarah, 34, yoga lover, drinks oat lattes, earns 60k'. You have 25 interview notes it didn't see.", choices: [
          ["Use Sarah. She feels real.", 0, "She's fiction. Decisions based on her could target the wrong people."],
          ["Paste the interview notes and ask for personas built only from them, with gaps marked 'unknown'.", 2, "Grounded in your data, and honest about what you don't know."],
          ["Ask for 5 more personas to choose from.", 0, "More fiction doesn't make it more accurate."],
          ["Skip personas entirely.", 1, "Personas built from data are genuinely useful. Build them properly."]] },
        { type: "sort", prompt: "Good interview question, or one to fix?", bins: ["Good", "Fix it"], items: [
          ["Tell me about the last time you tried to solve this problem.", 0],
          ["Wouldn't you agree our app is easier than the others?", 1, "Leading. It pushes for a yes."],
          ["Would you pay more for premium features?", 1, "Hypothetical. People are bad at predicting their own behaviour."],
          ["What nearly stopped you from buying?", 0],
          ["How do you choose and compare options, and what do you look at?", 1, "Double-barrelled. Split it into two questions."],
          ["Walk me through what happened right before you signed up.", 0]] }
      ],
      m3: [
        { type: "builder", prompt: "Build a launch caption prompt.", template: "Role: Act as {role}.\nContext: We are {brand}, selling {product} to {audience}. Key facts: {facts}. Our voice: {voice}.\nTask: Write 5 Instagram captions for launch week, each with a different angle.\nFormat: Under 40 words each, one emoji max, end with a question or clear call to action.\nChecks: Use only the facts given. Avoid: elevate, unlock, game-changer.", fields: [
          { key: "role", label: "Role", placeholder: "a senior social media copywriter", example: "a senior social media copywriter" },
          { key: "brand", label: "Brand", placeholder: "your brand name", example: "Bean Street Coffee" },
          { key: "product", label: "Product", placeholder: "what you're launching", example: "a single-origin cold brew" },
          { key: "audience", label: "Audience", placeholder: "who it's for", example: "office workers aged 25 to 40" },
          { key: "facts", label: "Key facts", placeholder: "3 to 5 true facts", example: "steeped 18 hours, 330ml bottle, launches Monday, in all 3 shops" },
          { key: "voice", label: "Voice (3 words)", placeholder: "e.g. warm, witty, direct", example: "warm, dry humour, direct" }] },
        { type: "check", q: "What makes AI sound most like your brand?", options: ["Telling it to be 'on brand'", "A short voice guide plus 3 to 5 real examples of your best content", "Using lots of emojis", "Choosing the most expensive AI tool"], answer: 1, why: "Examples show the AI what you mean. Adjectives alone are too vague." },
        { type: "scenario", art: "voice", situation: "After 40 messages in one chat, the AI's captions have drifted: more emojis, more clichés, less like your brand.", choices: [
          ["Keep correcting it in the same chat.", 1, "It may help a little, but long chats keep drifting."],
          ["Start a fresh chat and paste your voice guide and a complete prompt.", 2, "A clean start with the guide resets quality."],
          ["Accept it. AI just writes like that.", 0, "It doesn't have to. The setup is the problem."],
          ["Switch tools and type 'be better'.", 0, "Without better input, any tool will drift the same way."]] }
      ],
      m4: [
        { type: "spot", prompt: "Check this AI-generated content calendar. Which entries need fixing before you schedule?", lines: [
          ["Mon 3: Carousel: '5 mistakes when choosing running shoes' (Education pillar)", false],
          ["Wed 5: Post for 'International Running Shoe Day'", true, "Check that this day exists. AI often invents awareness days."],
          ["Fri 7: Customer story video with Jo, who ran her first 10K", false],
          ["Sat 8: Carousel: '5 mistakes when choosing running socks' (Education pillar)", true, "Same format and angle twice in one week. Vary it."],
          ["Mon 10: Post: 'Studies show 90% of runners wear the wrong size'", true, "An unsourced statistic. Find the real study or cut it."]] },
        { type: "order", prompt: "Put the repurposing workflow in order.", steps: ["Record or pick one strong original piece (e.g. a webinar)", "Export the transcript", "Ask AI to turn it into posts, clips, an email and quote cards", "Check every quote and fact against the source", "Edit for voice and schedule across the month"], why: "Source → transcript → drafts → fact check → edit. The checking step is the one people skip." },
        { type: "check", q: "Which blog post is most likely to rank and convert?", options: ["2,000 words of AI text on 'Benefits of accounting software'", "A clear answer to a real customer question, with your own examples and data added to an AI outline", "The same article posted on 5 sites", "A post repeating the keyword 40 times"], answer: 1, why: "Helpful content with real experience serves readers and search engines better than volume." }
      ],
      m5: [
        { type: "sort", prompt: "Which platform does each idea suit best?", bins: ["Instagram", "LinkedIn", "TikTok"], items: [
          ["A 4-slide carousel: 'How to style one jacket 4 ways'", 0], ["Founder post: 3 lessons from our first failed product", 1],
          ["15-second phone video: packing an order in fast motion", 2], ["Behind-the-scenes Reel of the shop setting up", 0],
          ["Article on hiring your first marketing person", 1], ["Our take on a trending sound, showing a product fail", 2]] },
        { type: "scenario", art: "social", situation: "An angry public comment: 'Ordered 2 weeks ago, still nothing, and nobody answers. Scam?' Your AI tool offers to auto-reply.", choices: [
          ["Let the AI auto-reply with the standard delivery policy.", 0, "A policy paste to an angry customer looks robotic and can escalate."],
          ["Reply quickly yourself: acknowledge, apologise, move to DM to check the order, then follow up publicly once it's solved.", 2, "Human, fast and visible. Use AI to draft it if you like, but you send it."],
          ["Delete the comment.", 0, "Deleting complaints usually makes things worse when people notice."],
          ["Ignore it until Monday.", 0, "Slow replies to public complaints damage trust with everyone reading."]] },
        { type: "spot", prompt: "This WhatsApp broadcast draft breaks some rules. Find the problems.", lines: [
          ["Hi! New arrivals just landed in store: linen shirts in 6 colours.", false],
          ["🔥🔥🔥 HUGE SALE!!! 🔥🔥🔥 DON'T MISS OUT!!!", true, "Shouty, emoji-heavy and spammy. It gets numbers blocked."],
          ["Show this message for 10% off until Sunday.", false],
          ["We're sending this to everyone in our phone contacts.", true, "Only message people who opted in. Platform policy and often the law require it."],
          ["There's no way to stop these messages.", true, "Always include an opt-out, such as 'Reply STOP to opt out'."]] }
      ],
      m6: [
        { type: "builder", prompt: "Build an image prompt.", template: "{subject}, in {setting}. Style: {style}. Lighting: {lighting}. Composition: {composition}. Mood: {mood}. Aspect ratio {ratio}.", fields: [
          { key: "subject", label: "Subject", placeholder: "what is in the image", example: "A ceramic coffee cup with steam rising, next to an open notebook" },
          { key: "setting", label: "Setting", placeholder: "where", example: "a bright minimal café table in the morning" },
          { key: "style", label: "Style", placeholder: "e.g. clean product photography", example: "clean product photography, natural colours" },
          { key: "lighting", label: "Lighting", placeholder: "e.g. soft window light", example: "soft window light from the left" },
          { key: "composition", label: "Composition", placeholder: "framing and space for text", example: "close-up, cup on left third, empty space on the right for text" },
          { key: "mood", label: "Mood", placeholder: "e.g. calm, focused", example: "calm and focused" },
          { key: "ratio", label: "Aspect ratio", placeholder: "1:1, 4:5, 9:16", example: "4:5" }] },
        { type: "sort", prompt: "Is an AI image okay here, or should you use a real photo?", bins: ["AI is fine", "Use a real photo"], items: [
          ["Abstract background for a quote card", 0], ["The actual dress customers will receive", 1, "Customers must see what they'll get."],
          ["Concept mock-up for an internal campaign pitch", 0], ["'Before and after' skin results", 1, "Results must be real, or the ad misleads and may break the law."],
          ["Seasonal scene behind a real product photo", 0], ["Photo of 'our team' on the About page", 1, "Fake team photos destroy trust when discovered."]] },
        { type: "scenario", art: "image", situation: "Your agency suggests an AI video of a well-known local celebrity 'recommending' your product. 'It's cheaper than paying her,' they say.", choices: [
          ["Go ahead. It's only AI.", 0, "A deepfake endorsement without consent is deceptive, damages trust and can be illegal."],
          ["Refuse. Either approach her for a real paid partnership, or use real customers instead.", 2, "Real endorsements with consent and disclosure are the only safe route."],
          ["Do it but add 'AI-generated' in small text.", 0, "Disclosure doesn't fix using someone's likeness without consent."],
          ["Use a celebrity from another country instead.", 0, "Same problem, different person."]] }
      ],
      m7: [
        { type: "order", prompt: "Order the first steps of a campaign brief.", steps: ["Set one measurable objective", "Define the audience from research", "Find the key customer insight", "Write the single-minded message", "List proof points and the offer"], why: "Objective and audience shape the insight, which shapes the message." },
        { type: "scenario", art: "funnel", situation: "Your A/B test changed the headline, image and offer at the same time. Version B got 40% more clicks.", ask: "What can you conclude?", choices: [
          ["The new headline works better.", 0, "You can't know. Three things changed at once."],
          ["Version B as a whole did better, but you don't know why. Next test should change one thing at a time.", 2, "Exactly right. Keep B, then isolate the variables."],
          ["Testing doesn't work for us.", 0, "It does when it's set up properly."],
          ["The image caused the improvement.", 0, "It might have, or not. This test can't tell you."]] },
        { type: "spot", prompt: "Review this landing page against the ad that sends traffic to it. Find the problems.", context: "Ad: '30-day free trial, no card needed: invoicing for freelancers'.", lines: [
          ["Headline: 'Enterprise financial management for growing companies'", true, "Doesn't match the ad. Freelancers will think they're in the wrong place."],
          ["Sub-headline: 'Create and send invoices in 60 seconds from your phone.'", false],
          ["Button: 'Start your free trial: no card needed'", false],
          ["Section: 'Rated #1 by experts'", true, "Vague, unsourced claim. Name the source or remove it."],
          ["FAQ answers: 'Can I cancel anytime?' and 'Is my data safe?'", false],
          ["Pricing: 'Contact sales for a quote'", true, "Contradicts the self-serve free trial promise in the ad."]] }
      ],
      m8: [
        { type: "sort", prompt: "Business result, or just a signal?", bins: ["Business result", "Signal"], items: [
          ["Cost per acquisition", 0], ["Impressions", 1], ["Sales from email campaigns", 0],
          ["Likes on a post", 1], ["Qualified leads", 0], ["Follower growth", 1, "Useful, but only if those followers become customers."]] },
        { type: "scenario", art: "shield", situation: "A client asks you to use AI to write 20 five-star Google reviews 'to get started', posted from different accounts.", choices: [
          ["Write them, but make them varied so they look real.", 0, "Still fake reviews: deceptive, against platform rules and illegal in many countries."],
          ["Decline, and set up a simple system to ask real customers for reviews after purchase.", 2, "Honest, sustainable and it actually works."],
          ["Write 5 instead of 20.", 0, "Fewer fake reviews are still fake reviews."],
          ["Write them for the client's friends to post.", 0, "Reviews from people who aren't customers are still deceptive."]] },
        { type: "order", prompt: "Order the 30-day team roll-out.", steps: ["Agree rules on tools, customer data, claims and disclosure", "Build a shared voice guide and reply library", "Run one campaign with AI from start to finish", "Measure time saved and results, then decide what to scale"], why: "Rules, then shared foundations, then real work, then evidence." }
      ]
    },

    terms: {
      m1: [["Large language model (LLM)", "The technology behind AI chat tools: it predicts likely next words from patterns in huge amounts of text."], ["Generative AI", "AI that creates new content: text, images, video or audio."], ["Hallucination", "When AI confidently states something false, like a fake statistic or quote."], ["AI voice", "The generic, cliché-heavy style of unedited AI writing."], ["Human in the loop", "A person reviews and decides before anything AI-made is published."]],
      m2: [["Persona", "A profile of a customer type, built from real research data."], ["Voice of customer", "The exact words customers use about their problems and your product."], ["Leading question", "A question that pushes people towards a particular answer."], ["Review mining", "Analysing reviews and comments for themes, praise and complaints."], ["Competitor scan", "A structured review of competitors' promises, audiences, prices and reviews."]],
      m3: [["RCTFC", "Role, Context, Task, Format, Checks: the five-part prompt structure."], ["Brand voice guide", "A short guide to how your brand sounds, with real examples."], ["Angle", "The specific lens for a message: pain point, benefit, proof, urgency, curiosity."], ["Iteration", "Improving AI output with short, specific follow-ups."], ["Custom instructions", "Saved settings in an AI tool that apply to every chat, such as your voice guide."]],
      m4: [["Content pillar", "One of 3 to 5 recurring themes your brand talks about."], ["Repurposing", "Turning one piece of content into many formats."], ["Content calendar", "A schedule of what goes out, where, when and who owns it."], ["Hook", "The first line or first 2 seconds that make someone stop scrolling."], ["Meta description", "The short summary shown under a page title in search results."]],
      m5: [["Opt-in", "A customer's clear permission to receive your messages."], ["Broadcast list", "A WhatsApp Business feature for sending one message to many opted-in contacts."], ["Reply library", "Pre-written, reviewed replies to common questions."], ["Native content", "Content made to feel natural on a specific platform."], ["Community management", "Responding to comments and messages to build relationships."]],
      m6: [["Image prompt", "A description of subject, setting, style, lighting, composition and mood."], ["Aspect ratio", "Image shape, such as 1:1 square, 4:5 portrait or 9:16 vertical video."], ["Deepfake", "Realistic AI-generated media showing a real person doing or saying something they didn't."], ["AI disclosure", "Telling audiences content was AI-generated, as many platforms require."], ["Visual style guide", "Rules for colours, photo style and layouts that keep visuals on-brand."]],
      m7: [["Campaign brief", "A one-page plan: objective, audience, insight, message, proof, offer, channels, KPIs."], ["Single-minded message", "The one main idea a campaign communicates."], ["A/B test", "Comparing two versions that differ in one thing to see which performs better."], ["Landing page", "The page an ad or email sends people to, built for one action."], ["Welcome sequence", "A series of automated emails sent to new subscribers."]],
      m8: [["CPA", "Cost per acquisition: marketing spend divided by customers won."], ["Vanity metric", "A number that looks good but doesn't show business results, like likes."], ["Funnel", "The journey from awareness to interest to consideration to action."], ["Fake reviews", "Reviews not from genuine customers: deceptive and often illegal."], ["Test log", "A record of what you tested, the result and what you learned."]]
    },

    presets: [
      { name: "Launch captions", role: "a senior social media copywriter", context: "We are Bean Street Coffee, launching a single-origin cold brew to office workers aged 25 to 40. Facts: steeped 18 hours, 330ml, launches Monday in our 3 shops. Voice: warm, dry humour, direct.", task: "Write 5 Instagram captions for launch week, each from a different angle (problem, benefit, behind the scenes, customer, offer).", format: "Under 40 words each, max one emoji, end with a question or call to action.", checks: "Use only the facts given. No claims we can't prove. Avoid: elevate, unlock, game-changer.", ask: false },
      { name: "Review analysis", role: "a customer insight analyst", context: "Below are 80 anonymised reviews of our meal-kit service, from customers in several cities.", task: "Find the top 5 things customers value, the top 5 complaints, and the exact words they use for the problem we solve.", format: "Tables with 2 exact quotes per theme, then 3 headline ideas built from customer words.", checks: "Quote only text that appears word for word. Do not invent statistics. Mark weak themes as 'low evidence'.", ask: false },
      { name: "Welcome emails", role: "an email marketing specialist", context: "New subscribers signed up for our free guide '10 easy weeknight dinners'. Goal: first meal-kit order within 14 days. Voice: friendly, practical, no hype.", task: "Write a 4-email welcome sequence.", format: "For each email: 3 subject lines, preview text, body under 150 words, one call to action.", checks: "Use only real offers I give you: first box 30% off. No fake urgency. Ask me if anything is unclear.", ask: true }
    ]
  };
})(typeof window !== "undefined" ? window : globalThis);
