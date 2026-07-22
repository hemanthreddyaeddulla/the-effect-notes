# Note template

Copy this skeleton for every episode. `build.mjs` parses `## SECTION` headers
against a fixed registry — **the header text must match exactly** (uppercase,
no trailing punctuation). An unrecognised header is silently dropped.

Sections render in registry order regardless of the order you write them, and any
section may be omitted if the episode genuinely has nothing for it. In practice
`ONE SENTENCE`, `THE 30-SECOND VERSION`, `WHY THIS EXISTS`, `IDEAS`, `SAY IT OUT
LOUD`, and `RECALL` should appear on every page.

---

## Skeleton

````markdown
---
ep: 7
title: Line-Fitting
chapter: 4
runtime: "11:42"
---

## ONE SENTENCE

One sentence. The whole episode. If they remember nothing else, this.
Write it as a claim, not a topic — "X is Y because Z", never "this episode covers X".

## THE 30-SECOND VERSION

- Three to five bullets. The skeleton the detail hangs on.
- Each bullet is a complete thought, readable alone.
- Ordered the way the video orders them.

## WHY THIS EXISTS

One or two short paragraphs. What problem does this solve? What goes wrong without
it? Use the concrete situation Nick opens with. Motivation before mechanism — a tool
whose purpose you don't feel is a tool you won't recall.

## IDEAS

### Name of the first concept

**Plain English.** Say it the way you'd say it to a smart friend who has no stats
background. No jargon. If you can't, you don't understand it yet.

**Precisely.** Now say it correctly, with the real terminology and any notation Nick
used. This is the version they'd give in an exam or an interview.

**Anchor image.** One vivid, concrete analogy. This is the memory hook and it is the
highest-value line on the page — spend real effort here. Make it physical and
slightly surprising. One image per idea, never two.

**Worked example.** Actual numbers or an actual diagram. Prefer the example from the
video. Show the mechanism running, don't describe it running.

**Where it breaks.** The boundary condition. Knowing when a tool *fails* is what
separates recall from understanding.

### Name of the second concept

Same five layers. Two to four ideas per episode is typical; more than five means the
episode should be summarised more aggressively, not split.

## TRAPS

- The thing that sounds right → **Actually,** the correction.
- Written as `wrong → right`. The build splits on the arrow and colours the halves.
- Only include misconceptions the video actually addresses or implies.

## SAY IT OUT LOUD

> A verbatim script, ~45–75 seconds spoken, that explains this episode's core idea to
> another person. Second person, conversational, no jargon that isn't defined inline.
> It must be readable start to finish without stopping to think.
>
> This is the section that buys the owner's stated goal. Write it last, after the
> ideas are settled, and read it back to yourself as speech — if a sentence is hard
> to say aloud, rewrite it.

## RECALL

Q: A question that forces retrieval, not recognition.
A: The answer, one or two sentences. Complete enough to be right, short enough to check.

Q: Six to ten cards per episode.
A: Mix definitional ("what is a collider?") with applied ("you control for X and the
effect flips sign — what happened?"). At least two applied cards per episode.

## CONNECTIONS

- Builds on **Ep 5 · Identification** — this is that idea made concrete.
- Sets up **Ep 8 · Control Variables** — where the same fit gets a second variable.
- Book: Chapter 4, *Describing Relationships*.

## GLOSSARY

- **Term** — one-line definition, self-contained.
- **Another term** — every term you used in bold-jargon anywhere on the page.
````

---

## The `dag` block

Causal diagrams are written as a fenced ```dag block and rendered to inline SVG.
Grid coordinates: `col` increases right, `row` increases down. Fractions are fine.

````
```dag
node X 0 1 "Treatment" treat
node Y 2 1 "Outcome" out
node W 1 0 "Confounder"
edge X Y
edge W X
edge W Y
edge X Y curve "back door"
note 1 1.9 "W opens a back door from X to Y"
```
````

- `node ID col row "Label" [class]` — classes: `treat` (teal), `out` (gold),
  `bad` (rose, for colliders/bad controls), `unobs` (dashed outline, unobserved).
- `edge A B [dashed] [curve] [curve-] [both] ["label"]` — `curve` arcs one way,
  `curve-` the other, `dashed` for hypothesised/blocked paths, `both` for a
  double-headed arc.
- `note col row "text"` — free-floating italic caption.

Keep diagrams small. Three to six nodes reads instantly; nine does not.

## Style rules

- **Second person.** "You control for W" beats "one controls for W."
- **Present tense, active voice.**
- **No filler.** Cut "it's important to note that", "essentially", "basically".
- **Bold sparingly** — only for the layer labels and genuine key terms. Bold
  everywhere is bold nowhere.
- **Numbers over adjectives.** "the estimate falls from 0.8 to 0.3" beats
  "the estimate drops substantially."
- Transcripts are auto-captions: lowercase, no punctuation, and they mangle proper
  nouns and symbols. Fix names and notation silently. If a passage is garbled beyond
  reconstruction, skip it rather than guess.
