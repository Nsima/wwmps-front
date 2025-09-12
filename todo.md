# TODO — What Would My Pastor Say (WWMPS)

A prioritized backlog of upgrades for speed, relevance, safety, and Naija-aware UX.

---

## P0 — Reliability & Data Hygiene (must-have)

- [ ] **One-row-per-turn constraint**
  - Add `UNIQUE (user_query_id)` to `chat_responses` to prevent duplicates from older code paths.
  - Backfill: delete dupes keeping the latest `id` per `user_query_id`.
  - Files: `database.sql` (migration).

- [ ] **Indexes for fast history & retrieval logging**
  - `CREATE INDEX IF NOT EXISTS idx_user_queries_session ON user_queries(session_id, pastor_slug, id DESC);`
  - `CREATE INDEX IF NOT EXISTS idx_chat_responses_uq ON chat_responses(user_query_id);`
  - Files: `database.sql`.

- [ ] **Failure reason & provider tags**
  - Persist `provider` (`openai|ollama`) and `failure_reason` (`no_hits|timeout|provider_error`) with each turn.
  - Files: `chat.controller.js`, `userQueries.model.js`.

- [ ] **Secure keys & logs**
  - Rotate `OPENAI_API_KEY` if ever shared; ensure no tokens appear in logs.
  - Files: `.env`, logging config.

---

## P1 — Personas: **Developer** & **Creator** (support + “talk to the builder”)

- [ ] **Persona registry**
  - Add entries to `pastors.model.js` for `developer` (“The Developer”) and `creator` (“The Creator”).
  - Files: `pastors.model.js`.

- [ ] **System prompts**
  - `buildDeveloperPrompt()`: app support, usage, troubleshooting; **never** theology/prayer; no secrets.
  - `buildCreatorPrompt()`: motivation, workflow, lessons learned, light public bio; deflect to Developer for deep tech, to Pastors for counsel.
  - Files: `pastors.model.js`.

- [ ] **Routing in RAG**
  - If `pastor_slug === "developer"` or `"creator"`, search only their KB (see ingestion below).
  - Guardrails: doctrinal → ask user to switch to a Pastor; deep tech → suggest Developer.
  - Files: `rag.service.js`.

- [ ] **Honorific short-circuit scope**
  - Keep “Papa/Daddy/Mummy” greeting short-circuit **disabled** for `developer`/`creator` personas.
  - Files: `chat.controller.js`.

- [ ] **Intent hint (optional)**
  - If question matches “who built this / tech stack / privacy / bug / slow / pm2 / postgres / cors / sse”, suggest switching to **Developer** or **Creator**.
  - Files: `chat.controller.js`.

- [ ] **UI**
  - Add Developer & Creator to persona selector (distinct avatars) + persona badge in chat header.
  - Files: frontend (Chatbot UI).

- [ ] **Observability**
  - Log `persona` and an `intent` heuristic for analytics.
  - Files: controller logs/metrics.

---

## P1 — Developer/Creator **KB ingestion** (curated from `diary.md`)

- [ ] **Diary split & redact**
  - Create `/kb/developer/` and `/kb/creator/`; redact private data (emails/phones/tokens).
  - Keep raw diary out of runtime index; ingest only curated excerpts.
  - Files: KB folder + ingestion script.

- [ ] **Curated files**
  - Developer: `faq.md`, `troubleshooting.md`, `architecture.md`, `config.md` (safe flags only), `privacy.md`.
  - Creator: `why.md`, `journey.md` (struggles → solutions), `workflow.md`, `bio.md` (light).
  - 200–400 words per section; chunk by headings.

- [ ] **Metadata & ranking**
  - Store: `pastor_slug` (`developer|creator`), `doc_type`, `date`, `stability=high`, `public=true`.
  - Optionally downweight `doc_type=bio`.
  - Files: ingestion script, schema (JSONB metadata if needed).

- [ ] **Quote-friendly chunks**
  - Include headings/breadcrumbs in chunk text/metadata for nicer citations.
  - Files: ingestion job.

---

## P1 — Product & UX Enhancements

- [ ] **Optional Sign-up/Login**
  - Add sign-up/login (Chat-GPT style) after about 6 uses.
  - Add chat history on the right ["`Pastor - Title of the chat`"].
  - Settings button should only be visible on login.

- [ ] **Prayer mode**
  - Add `mode=prayer` → return only a short prayer (≤80 words), no citations.
  - Add `include_prayer=1` → normal answer + `---` + short prayer (≤60 words).
  - Files: `chat.controller.js`, `rag.service.js`, Chatbot UI (toggle/button).

- [ ] **Copy Prayer & Share to WhatsApp**
  - Extract prayer text (split on `---` if present), copy to clipboard, open `wa.me/?text=...`.
  - Files: Chatbot UI.

- [ ] **Sunday awareness (Lagos TZ)**
  - If Sunday, prepend a gentle “Happy Sunday” line; weekdays stay neutral.
  - Files: `rag.service.js` (style hint) or UI preface.

- [ ] **Verse-first toggle**
  - When intent is “Which verse…?”, show key Scripture first in UI and pass that chunk early in context.
  - Files: Chatbot UI, `rag.service.js` (ordering).

- [ ] **Feedback loop**
  - “Helpful / Not helpful” with tags (Off-topic, Too long, Not pastoral, Wrong verse); store with `user_query_id`.
  - Files: UI + small endpoint/table.

- [ ] **Save & resume**
  - Magic link (session_id continuation) + “Export chat as PDF”.
  - Files: controller + small UI.

- [ ] **Accessibility & bandwidth**
  - Large tap targets, reduced-motion, defer heavy assets, cap streamed chunk size for low data plans.
  - Files: UI.

---

## P1 — Bible Corpus & Verse Handling

- [ ] **Bible ingestion (KJV first)**
  - Table `bible_verses(book_osis, book_name, chapter, verse, text)`.
  - Embed chunks of 3–5 verses with metadata `{ pastor_slug: "bible", title, verse_start/end }`.
  - Files: migration + ingestion script.

- [ ] **Retrieval policy**
  - Detect verse intent; retrieve **Bible top-3** + **Sermons top-3**, fuse via **RRF**; proceed with top-3 overall.
  - Files: `search.service.js`, `rag.service.js`.

- [ ] **Verse reference parser/normalizer**
  - Parse `Book Chap:Verse[-Verse]`; validate before quoting; if unknown, ask brief clarifier.
  - Files: small utility + used in `rag.service.js`.

- [ ] **Multi-version quoting**
  - Keep canonical ref; quote in user’s preferred version (NKJV/KJV/NIV/ESV); license NKJV later.
  - Files: settings + `rag.service.js`.

- [ ] **Verse-first display & citation style**
  - Show verse (book chap:verse) prominently; keep Scripture text clean (no slang).
  - Files: UI.

---

## P1 — Retrieval Quality (bigger wins with small code)

- [ ] **Hybrid retrieval (Dense FAISS + BM25)**
  - Add BM25 (pg_trgm or Meilisearch/Elastic) over title + transcript.
  - Fuse candidates with **RRF**; return top-3.
  - Files: `search.service.js`.

- [ ] **Nano re-rank (cheap LLM rescoring)**
  - Re-rank top-6 → top-3 using `gpt-5-nano` scoring 0–5 “directly answers the user”.
  - Files: `rag.service.js` (after `retrieve()`), `llm.service.js` (reuse).

- [ ] **Query rewriting**
  - Expand short asks with synonyms (e.g., “fear” → “anxiety, worry, courage”) before FAISS/BM25.
  - Files: `rag.service.js`.

- [ ] **Section-aware boost**
  - Keep heading text in metadata; boost when heading matches query.
  - Files: ingestion + `search.service.js`.

- [ ] **Context budgeter & anti-drift**
  - Summarize extra chunks to bullets if long; add guardrail: “Do not invent verses or facts not in context.”
  - Files: `rag.service.js`.

- [ ] **Smarter chunking**
  - Chunk by **heading + paragraph** (keep section title in metadata).
  - Files: ingestion script, embeddings job.

---

## P1 — Naija-aware UX & Tone

- [ ] **Honorifics & greetings**
  - You already short-circuit “Papa/Daddy/Mummy/My Papa…”.
  - Extend with `good morning/afternoon/evening Daddy` (regex union).
  - Files: `chat.controller.js`.

- [ ] **Lingo auto-sprinkle (guardrails)**
  - If user uses Pidgin, lightly sprinkle 1–2 phrases (“no wahala”, “small small”) but **never** inside Scripture.
  - Files: `rag.service.js` (system hint).

- [ ] **Scripture version preference**
  - Add optional `verse_version` (NKJV/KJV/NIV/ESV) in request → tweak system hint.
  - Files: `Chatbot.tsx` (future setting pass-through), `rag.service.js`.

---

## P1 — Performance & Cost

- [ ] **Token cap & stop sequences**
  - Set `OPENAI_MAX_TOKENS=220`; add stop sequences (e.g., `\n\n---`) to encourage early stops.
  - Files: `.env`, `llm.service.js`.

- [ ] **Retrieval cache**
  - Cache `{session_id, hash(last2_user_msgs)}` → top-k hits for 10–30 min to skip FAISS on quick follow-ups.
  - Files: `cache.service.js`, `rag.service.js`.

- [ ] **Warm paths**
  - Warm selected OpenAI model(s) and last 3 active pastor sessions on boot and periodically.
  - Files: `llm.service.js`, bootstrap.

- [ ] **Auto fast/quality routing tuning**
  - Log prompts where `OAI_FAST` under-performed; adjust thresholds (score ≥ 0.32 → maybe 0.28).
  - Files: `rag.service.js`, `llm.service.js`.

---

## P2 — Settings (deferred but planned)

- [ ] **User Settings panel**
  - Model pref (`auto|fast|quality`), topK (1–6), response length, lingo (`auto|naija|standard`), honorific mode, include prayer, scripture version.
  - Persist in `localStorage`; attach to requests as query/body flags.
  - Files: `Chatbot.tsx`.

- [ ] **Backend preferences pass-through**
  - Read flags and add small style lines to the system prompt; keep behavior optional and backward compatible.
  - Files: `chat.controller.js`, `rag.service.js`.

---

## P2 — Observability & Admin

- [ ] **Metrics table or /metrics route**
  - Track: TTFT, total latency, retrieval_ms, provider/model, cache hits, failure_reason, **persona**.
  - Simple HTML or Grafana/Metabase.
  - Files: new `metrics.controller.js`, minor inserts in controller.

- [ ] **Zero-hit analyzer**
  - Log queries with `hits.length=0` and surface in admin to improve data/ingestion.
  - Files: controller + small admin page (optional).

- [ ] **Trace IDs**
  - Generate a `trace_id` per request and include in all logs/events.
  - Files: `index.js`, `chat.controller.js`, `llm.service.js`.

---

## P2 — Safety & Care

- [ ] **Crisis pattern detection**
  - Keyword list (suicidal ideation, abuse). Short, caring template + Nigeria helplines/church guidance.
  - Files: `chat.controller.js` short-circuit + `rag.service.js` style hint.

- [ ] **Medical/legal caution**
  - Single-sentence disclaimer and “seek professional help” guidance for those domains.
  - Files: `rag.service.js`.

---

## P3 — Data & Ingestion

- [ ] **Tagging**
  - Per-chunk tags: `topic`, `series`, `scripture_refs`, `date`, `pastor_slug`. Use during retrieval filters.
  - Files: ingestion pipeline, schema (JSONB column if not present).

- [ ] **Scripture reference extraction**
  - Heuristic or small LLM pass to detect verse citations; store normalized refs.
  - Files: ingestion.

- [ ] **Deduplication**
  - Deduplicate near-identical chunks per sermon to reduce noise and cost.
  - Files: ingestion.

---

## P3 — Testing & QA

- [ ] **Unit tests**
  - Honorific & greeting regexes; controller short-circuit paths; retrieval map/shapes.
  - Files: `__tests__/`.

- [ ] **Contract tests**
  - Ensure exactly **one** `chat_responses` row per `user_query_id`.
  - Files: tests + DB constraints.

- [ ] **E2E smoke**
  - Start a session → ask → greet (“Papa”) → follow-up → cached path → verify citations render.
  - Include Developer and Creator flows.

---

## P3 — Infra & Ops

- [ ] **PM2 ecosystem + health checks**
  - `/healthz` endpoint; pm2 config with autorestart and log rotation.
  - Files: `index.js`, pm2 config.

- [ ] **Error monitoring**
  - Hook Sentry (or similar) for unhandled rejections and API errors.
  - Files: bootstrap.

- [ ] **Backups**
  - Nightly DB backup; verify restore procedure in a staging env.

---

## Stretch — Product polish

- [ ] **Quick-reply chips** (“Pray with me”, “Scripture for anxiety”, “On forgiveness”).
- [ ] **Mobile-first sermon cards** with title/date/verse chips.
- [ ] **A/B test** thresholds for fast vs quality model selection.
- [ ] **Multilingual seeds**: basic Yoruba/Igbo terms glossary for gentle clarifications.

---

## Notes

- Keep `top_k=3` default unless a user overrides.
- Keep Naija lingo **light** and never inside Scripture quotes.
- Ensure OpenAI usage shows `provider=openai` in logs when enabled.
- Keep **Developer/Creator** answers free of doctrine/prayer and free of secrets/PII.
