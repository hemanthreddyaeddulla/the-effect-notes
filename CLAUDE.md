# The Effect — notes site

Retention-first HTML notes for all **72 videos** in Nick Huntington-Klein's series
accompanying *The Effect: An Introduction to Research Design and Causality*.

**Live site:** https://hemanthreddyaeddulla.github.io/the-effect-notes
**Repo:** https://github.com/hemanthreddyaeddulla/the-effect-notes

---

## The one thing that matters

The owner's stated goal, verbatim:

> "I will watch the video and read your notes and when I read it I should understand
> everything and I could be able to explain the concept to anyone without thinking for
> a sec — it should be like a strong memory to me."

Every decision in this repo serves that. Notes are **not summaries**. A summary is
re-readable and forgettable. These notes are built for *encoding* (anchor images,
worked examples, motivation-before-mechanism) and *retrieval* (recall drills, the
spoken script, spaced repetition).

If you are ever choosing between "more complete" and "more memorable", pick
**more memorable**.

---

## Locked decisions

Do not revisit these without the owner asking.

| Decision | Value | Why |
|---|---|---|
| Depth | **Video-faithful only** | Owner chose this over deep book coverage. Cover what the *video* covers. ~700–1,000 words per episode. |
| Repo | `the-effect-notes`, public | GitHub Pages needs public on the free plan. |
| Output | Static HTML in `docs/`, served by GitHub Pages | No CI, no Actions, no build server. |
| Build | `node build.mjs`, zero npm dependencies | Must still build years from now with no network. |
| Diagrams | Custom ```dag blocks → inline SVG | No Mermaid, no CDN. Theme-aware and offline-safe. |
| Math | Unicode characters (β, ε, Σ, ŷ, E[Y\|X]) | No KaTeX/MathJax dependency. |

**Video-faithful means:** if the video doesn't say it, it doesn't go in the notes.
You may clarify, restructure, and add an anchor image or a worked example that makes
the video's own point land — but do not import extra material from the book, and do
not add methods or caveats Nick didn't raise in that episode. If the video is
genuinely thin, the note is short. That is correct, not a failure.

---

## Layout

```
build.mjs              the whole generator (read it before changing content format)
data/episodes.json     all 72 episodes: ep, title, videoId, url, chapter, chapterTitle, slug
transcripts/ep01.txt   auto-caption transcript of every video, already cleaned  ← YOUR SOURCE
content/ep-01.md       the notes you write, one file per episode
site/assets/           styles.css + app.js, copied verbatim into docs/assets/
docs/                  GENERATED. Never hand-edit. `node build.mjs` rewrites it.
meta/PIPELINE.md       exact per-episode procedure — follow it
meta/NOTE_TEMPLATE.md  the section skeleton + a full worked example
meta/PROGRESS.md       72-row checklist. Update it in the same commit as the notes.
```

`transcripts/` is committed on purpose. All 72 were fetched with `yt-dlp` in the
first session (173,498 words total, ~2,400 per episode). **You never need to
re-download them, and you should not need network access to write notes.**

---

## Working rules

1. **Read the transcript before writing.** `transcripts/epNN.txt`. Never write an
   episode's notes from background knowledge of causal inference — the point is that
   the notes match the video the owner just watched, in the same order, using the
   same examples Nick used.
2. **Use Nick's own examples.** If he explains collider bias with a Hollywood
   talent/looks example, that example goes in the notes. The owner will have just
   seen it; reusing it is free memory. Inventing a different one costs memory.
3. **One file per episode**, named `content/ep-NN.md` (zero-padded), following
   `meta/NOTE_TEMPLATE.md` exactly. Section headers are parsed by `build.mjs` —
   they must match the registry in that file character for character.
4. **Build before committing:** `node build.mjs`. It prints how many pages were
   written. A content file with a malformed section header silently drops that
   section, so check the word count looks sane.
5. **Update `meta/PROGRESS.md`** in the same commit.
6. **Commit per batch**, message like `notes: Ch 6-7 (eps 12-15)`.

## Batch order

Work in chapter-sized batches, in episode order. A batch is done when every episode
in it is written, built, and committed. Suggested batches:

Ch 1–5 (ep 1–11) · Ch 6–8 (12–18) · Ch 9–11 (19–24) · Ch 13 (25–34) ·
Ch 14 (35–41) · Ch 15–16 (42–47) · Ch 17 (48–50) · Ch 18 (51–56) ·
Ch 19 (57–60) · Ch 20 (61–64) · Ch 22–23 (65–69) · Ch 21 (70–72)

Note: **Chapter 12 has no videos.** Chapter 21's videos are episodes 70–72, which is
why they come last despite the chapter number.

## Commands

```bash
node build.mjs                    # regenerate docs/
python -m http.server 8080 -d docs   # preview at localhost:8080
git add -A && git commit -m "notes: ..." && git push
```
