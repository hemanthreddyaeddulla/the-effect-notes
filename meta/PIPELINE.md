# Pipeline — how to produce one episode

Follow this exactly. It exists so any future session produces notes indistinguishable
from the first batch.

## Before the batch

1. Read `CLAUDE.md` (locked decisions) and `meta/NOTE_TEMPLATE.md` (skeleton + style).
2. Open `meta/PROGRESS.md`, pick the next unstarted batch.
3. Open one already-written episode in `content/` as a reference for tone and density.
   `content/ep-01.md` is the reference implementation.

## Per episode

### 1 · Read the source

Read `transcripts/epNN.txt` **in full**. It is already cleaned and committed — no
download needed, no network needed.

The header block gives you episode number, title, chapter, video URL, and word count.

Auto-caption quirks to expect: all lowercase, no punctuation, "d.a.g." for DAG,
mangled surnames, numbers spelled out. Reconstruct silently.

### 2 · Extract the spine

Before writing anything, answer these four on scratch:

- What is the single claim of this video?
- What are the 2–4 distinct ideas in it, in the order Nick presents them?
- Which concrete examples does he use? (Write them down — you must reuse them.)
- What does he explicitly warn against?

If you can't answer the first question in one sentence, re-read the transcript.
Everything downstream is wrong if that sentence is wrong.

### 3 · Write `content/ep-NN.md`

Follow the skeleton. Order of writing that works best:

1. `IDEAS` first — the substance.
2. `WHY THIS EXISTS` — now that you know what the ideas are.
3. `ONE SENTENCE` and `THE 30-SECOND VERSION` — compress downward from the ideas.
4. `TRAPS`, `CONNECTIONS`, `GLOSSARY`.
5. `SAY IT OUT LOUD` last. Read it aloud in your head as speech.
6. `RECALL` last of all — write questions against the *finished* page, so every
   answer is actually on it.

**Length.** Batch A (eps 1–11) landed at **1,700–2,500 words per file**, and that is the
house size — match it. Roughly:

| Section | Share |
|---|---|
| ONE SENTENCE + 30-SECOND + WHY THIS EXISTS | ~250 words |
| IDEAS | ~800–1,100 words — the bulk |
| TRAPS | ~150 words |
| SAY IT OUT LOUD | ~350 words |
| RECALL | ~400 words (8–11 cards) |
| CONNECTIONS + GLOSSARY | ~200 words |

**Scale the ceiling to the video.** The house range above fits a 10–14 minute episode.
Longer or denser videos legitimately run longer — eps 33 and 34 land near 2,900 because
those videos cover three failure modes and a full estimation method respectively. Judge
by content, not by the counter:

- Under 1,400 → you dropped something the video covered.
- Over 2,900 → check honestly whether you imported book material (against the locked
  depth decision) or padded. If every paragraph traces to the transcript, it's fine.

"Video-faithful" constrains *what goes in*, not how thoroughly you explain it. A
2,400-word note covering only what the video said is correct; a 2,400-word note that
reaches into the book is not.

A genuinely thin episode gets a genuinely short note. Ep 3 is the shortest in batch A
because the video is a taxonomy with little mechanism. Don't inflate it.

### 4 · Verify

Non-negotiable check before moving on. Re-scan the transcript and confirm:

- [ ] Every claim in the notes traces to something in the transcript.
- [ ] Nothing in the notes contradicts the transcript.
- [ ] Nick's own examples are the ones used.
- [ ] No method, caveat, or term was imported from outside the video.
- [ ] Every bolded term appears in `GLOSSARY`.
- [ ] Every `RECALL` answer is findable on the page.
- [ ] `SAY IT OUT LOUD` is self-contained — it defines any term it uses.

The failure mode this catches: writing fluent, correct-sounding causal inference that
the video never said. That produces notes the owner can't map onto what they watched,
which defeats the entire purpose.

## After the batch

```bash
node build.mjs
```

Confirm the printed count went up by the number of episodes you wrote, and that no
episode you wrote is still listed as pending.

Preview if anything structural changed:

```bash
python -m http.server 8080 -d docs
```

Check: DAGs render, recall cards open, dark mode is intact, nothing overflows on a
narrow window.

Update `meta/PROGRESS.md` — mark the episodes done, set the date, note anything a
future session should know.

```bash
git add -A
git commit -m "notes: Ch 6-7 (eps 12-15)"
git push
```

Pages redeploys from `docs/` on `main` automatically, ~1 minute.

## Adding or changing a section type

Content format is defined in two places that must stay in sync:

- the `SECTIONS` registry at the top of `build.mjs`
- the skeleton in `meta/NOTE_TEMPLATE.md`

Change both, then rebuild and check an existing page still renders correctly.
