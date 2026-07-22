# The Effect — notes

Notes for all **72 videos** in Nick Huntington-Klein's series accompanying
*[The Effect: An Introduction to Research Design and Causality](https://theeffectbook.net)*.

**→ [Read the notes](https://hemanthreddyaeddulla.github.io/the-effect-notes)**

**Status: complete.** All 72 episodes are written, covering Chapters 1–23 — research
design and causality, regression, matching, simulation, fixed effects, event studies,
difference-in-differences, instrumental variables, regression discontinuity, and the
second edition's new chapter on partial identification.

Built to be read *right after* watching an episode, and to leave you able to explain
the idea out loud without rehearsing. Every page has the same shape:

| | |
|---|---|
| **In one sentence** | The whole episode as a single claim |
| **The 30-second version** | The spine you hang detail on |
| **Why this exists** | The problem it solves, before the mechanism |
| **The ideas** | Plain English → precise → anchor image → worked example → where it breaks |
| **Traps** | Sounds right, is actually wrong |
| **Say it out loud** | A ~60-second script for explaining it to someone else |
| **Recall drill** | Click-to-reveal questions — retrieval, not re-reading |
| **Connections** | What it builds on, what it sets up |
| **Glossary** | Every term, self-contained |

Plus a site-wide [review deck](https://hemanthreddyaeddulla.github.io/the-effect-notes/review.html)
that pools every recall question and schedules it by how well you knew it.

## Keyboard

`/` search · `j` / `k` next / previous episode · `space` reveal answer (review deck) ·
`1` `2` `3` grade a card

## Building

No dependencies. Node 18+.

```bash
node build.mjs                        # content/*.md → docs/
python -m http.server 8080 -d docs    # preview
```

`docs/` is generated — never hand-edit it. Write notes in `content/`, then rebuild.

## Repo

```
content/         the notes, one markdown file per episode
transcripts/     cleaned auto-caption transcript of all 72 videos
data/            episode manifest (titles, video IDs, chapter mapping)
site/assets/     css + js
build.mjs        the generator
meta/            pipeline, note template, progress checklist
docs/            generated site (GitHub Pages)
```

## Credit

All content is derived from Nick Huntington-Klein's
[video series](https://nickchk.com/theeffectvideos.html) and book, both of which are
free to read online. These are study notes, not a substitute — go
[buy the book](https://theeffectbook.net).
