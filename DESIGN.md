# PulseMind — design system

The visual and behavioural rules for the clinician-facing UI. Tokens live in
`src/index.css`; this file says why they are what they are.

**If a colour, font size or radius is not in this document, it does not go in the
product.** The previous prototype had no token layer at all — 70 hardcoded hex values,
21 distinct font sizes and 6 border radii — and that absence, not any individual
choice, is what made it read as unconsidered.

---

## 1. The direction

PulseMind is an instrument, not a dashboard. The register is a clinical record rendered
at screen resolution: hairline rules instead of cards, background value instead of
shadow, colour reserved entirely for state, and density treated as a feature rather
than something to apologise for.

Two facts about the product drive everything else, and both are about **epistemic
status** — how much is actually known, and from where.

**Most of what is on screen was never measured on this patient.** Four of the eleven
parameters are majority cohort default; end-tidal CO₂ is substituted with a population
value in 82.6% of readings, both I:E ratios in about 79%, peak flow in 61%. The data
dictionary is blunt about the consequence: *"any consumer that renders `value` without
`source` is stating a cohort statistic in a clinical voice."*

**Every score is computed independently.** The model has no trend inputs. A claim about
change over time is a named safety violation (`TREND_CLAIM`), not a wording preference.

So the signature is provenance, and the constraint became the design rather than
something worked around.

### The two signature elements

**`≈` on every population default.** A cohort default renders as `≈36`, not `36`. It is
literally an approximation drawn from a population rather than a measurement of the
patient, and unlike colour the glyph survives greyscale, every form of colour-vision
deficiency, and a photocopy. Value and source are one inseparable unit
(`ProvenanceValue`), never a number with a tooltip.

**The observation strip.** Assessment history is four band lanes with discrete marks on
equal-width categorical slots — a log, not a curve. Nothing connects two marks, only the
band is plotted (never the underlying score), and the slots are categorical so there is
no continuous axis for a slope to exist on. A line would assert values *between*
observations, which is exactly what the model cannot support.

---

## 2. Colour

### The rules

1. **Muted for area, saturated for ink.** A band tint fills a cell and must not compete
   with the number on it. A band's ink is small and must read across a room. The
   previous prototype used mid-saturation for both, which is precisely why it read flat.
2. **Colour is reserved for state.** Four bands, one neutral ramp, one interactive
   accent. Flight-deck practice caps the working vocabulary at six colours, and this
   spends exactly that. `--accent` means "you can act on this" and never signals
   clinical state.
3. **Nothing depends on hue alone.** Every band carries its name as text and a
   four-segment meter. Tints are luminance-monotonic, so severity order survives
   greyscale, deuteranopia and protanopia.
4. **Red is reserved globally.** No red destructive buttons, no red form errors, no red
   chart series. Escalate is weighted, not coloured. The only red in the product is the
   CRITICAL band.

### Where the band ramp comes from

Tints follow the luminance ladder of the RCP NEWS2 observation chart — the one national
early-warning chart redesigned specifically so colour-blind clinicians could read it.
Its relative luminances run 1.000 → 0.901 → 0.618 → 0.386, strictly monotonic, with all
text staying black at every step. Chroma is pushed past the NEWS2 values; the ladder is
not.

Two published severity palettes were rejected after measuring them. IBM Carbon's alert
set (`#198038` green / `#da1e28` red) differs by **0.001** in relative luminance — the
two most consequential states are the same grey. The NHS.UK status set fails the same
way at 0.002. Neither is safe for an ordinal scale.

**LOW is neutral, not green.** On a bedside monitor green already means "this lead is
live", not "this patient is well", and a point-in-time score with disclosed staleness
cannot support a "verified fine" claim.

### On borrowing alarm colours

IEC 60601-1 clause 7.8.1 notes that *"dot-matrix and other alphanumeric displays are not
considered to be indicator lights"* — the alarm colour and flash rules attach to physical
indicator lamps, and screen content is carved out. There is no clause violated by using
red on a screen, so the question is human factors, not compliance.

The resolution: **borrow the hue, break the form and the behaviour.**

- **Never flash, at any rate.** 1.4–2.8 Hz is the high-priority alarm rate and 0.4–0.8 Hz
  the medium. A static indicator is pre-attentively not an alarm. The previous
  prototype's pulsing dots are gone for this reason, not for taste.
- **Never fill a large field at alarm chroma.** Tinted chips and rules on a neutral
  surface, never a saturated ground.
- **Never emit sound.** No auditory anything, ever.
- **Never offer silence, pause or reset.** The disposition buttons record a *clinical
  review* and close a prompt; they do not silence anything and the band does not change
  when they are pressed. The banner says so.
- **A permanent categorical label.** "Not an alarm" is in the header at every viewport
  width — it shortens on a phone rather than disappearing.

A useful structural argument for the design record: 60601-1-8 has **three** priorities
and PulseMind has **four** bands. The mapping is not isomorphic, which is a documentable
reason to sit *adjacent to* the alarm palette rather than claim conformity with it.

### Tokens

Neutrals carry a deliberate cool cast at low chroma rather than a stock grey ramp, and
`--ink-950` is a desaturated blue-black rather than pure black — pure black on pure white
is harsh on a screen open for a twelve-hour shift.

---

## 3. Type

Three faces, three jobs, no overlap. A number read as an *amount* and a number read as a
*name* should not look the same.

| Role | Face | Used for |
|---|---|---|
| Language | **Public Sans** | Labels, prose, buttons, headings |
| Quantity | **Atkinson Hyperlegible** | Vitals, scores, percentages, axis ticks |
| Machine identity | **JetBrains Mono** | Patient IDs, bed codes, timestamps, device tags |

**Atkinson Hyperlegible is the load-bearing choice.** It was drawn by the Braille
Institute with letterform differentiation as the explicit design goal — the 0/O, 1/l/I,
5/S and 6/8 confusions this screen is exposed to. That makes it a decision defensible in
a safety review rather than a taste claim. All three are OFL or free for commercial use.

IBM Plex Sans was replaced, not because it is bad — it is safe and correct — but because
its `1` is a bare stroke that reads weakly in a column of respiratory rates at 12–13px,
its x-height is modest at the sizes a dense table needs, and it reads as a template
default. Plex Mono would have been fine to keep; JetBrains Mono has a taller x-height and
a less ambiguous zero.

`font-variant-numeric: tabular-nums lining-nums` is applied globally to both numeric
faces, so decimal points form a real column and a value updating in place never shifts
its neighbours.

### Scale

Ten steps at roughly 1.15, and **nothing may sit between them**. The floor is **11px** —
the previous prototype set live labels at 8.5px.

`11 · 12 · 13 · 14 · 16 · 18 · 22 · 28 · 34 · 44`

13px is the dense-data default. 16px is reserved for the AI explanation and nothing else,
so prose is typographically marked as prose without spending a fourth typeface on it.

**Size and colour interact.** Display guidance puts the floor for reading at 16 arc
minutes but requires ~20 arc minutes before the *colour* of an alphanumeric string can be
reliably discriminated — roughly 17px at a 560mm workstation distance. So a band name
never appears as small coloured text: it is dark text on a tint (`BandTag`), which also
satisfies the rule that either foreground or background be achromatic. Where a small
label needs a state signal, the colour goes on an adjacent **shape** and the words stay
achromatic.

---

## 4. Structure and density

- **Rules, not cards.** 1px hairlines. Radius 2–3px maximum, never more.
- **Elevation is background value, not shadow.** `--surface` / `--surface-sunken` /
  `--page`. There are no box-shadows in the product except the drawer.
- **No side accent bars.** A thick coloured border on one edge of a card is the single
  most recognisable tell of generated UI. Selection is a 3px accent edge on a flat row —
  a "you are here" marker, deliberately not a severity signal.
- **Rows, not tiles.** Patients are ruled rows in one panel so any column can be scanned
  vertically, not eight floating cards.
- **Deliberate density variation.** Tight within a group, generous between groups.

### Responsive

Verified with a real viewport over CDP at 375 / 768 / 1024px: `scrollWidth` equals
`innerWidth` and no element overflows at any of them. The previous prototype had **zero**
media queries and relied entirely on flex reflow.

---

## 5. Behavioural rules

Every glance at this screen is a **resumption**, not a continuation — ICU nurses are
interrupted on the order of 14 times an hour. So:

- **Nothing transient.** No toasts, no auto-dismissing banners, no hover-only content, no
  state that expires. If it matters it is persistent and on the surface.
- **No motion that conveys state.** Motion is both an interruption cue and an alarm cue.
- **Three degraded states, three different appearances.** Below the sufficiency floor
  (no score, no band, no prompt); explanation attempted and failed (everything else still
  renders, fixed string shown verbatim); explanation never attempted. A refusal must never
  read as LOW, and must never look like a loading state or an error — it is a *result*.
- **Age is disclosed, never gated.** Staleness is shown as a timestamp and never as
  fading: a faded value reads as disabled, and a stale CRITICAL reading is not less
  important.
- **The band is never re-derived from the score.** It arrives already decided by the
  hysteresis machine. The band scale explains a band; it never computes one.

### Banned vocabulary

`rising · climbing · trending · trajectory · deteriorating · improving · worsening ·
escalating · heading toward`, and any delta, arrow or slope. This applies to visible
copy, `aria-label`s and exports alike.

The tense rule is precise: *"risk of deterioration"* is the band's meaning and is always
fine. *"has been deteriorating"* is a claim about the past that nothing in the model
supports.

---

## 6. Code conventions

Plain React. `useState` and `useEffect`, props down, one component per file named for
what it is. No custom abstraction layers, no defensive noise, no logging telemetry.

- **One component, one job.** Variants come from the maps in `src/lib/bandStyles.ts`, so
  restyling a state is an edit in one place.
- **Screens depend on the contract, never on the mock.** All data access goes through
  `src/data/feed.ts`. Swapping in a real transport is a one-file change and no component
  needs to know it happened.
- Tailwind class names are written out in full — the scanner reads source text
  statically, so a template like `bg-band-${band}-tint` produces no CSS.

---

## 7. Sources

- RCP NEWS2 observation chart (colour operators read from the published PDF) ·
  <https://www.rcp.ac.uk/resources/national-early-warning-score-news-2/>
- IEC 60601-1 §7.8.1 indicator-light note, via the MECA alarm standards cross-reference ·
  <https://60601-1.com/wp-content/uploads/2019/04/meca-alarm-standards-cross-reference-2015-04-01.pdf>
- ANSI/HFES 100-2007 §7.2.5–7.2.6, display legibility and colour
- WCAG 2.1 SC 1.4.1 / 1.4.3 / 1.4.11 · <https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html>
- NHS.UK Design System · <https://service-manual.nhs.uk/design-system/styles/colour>
- IBM Carbon colour tokens · <https://carbondesignsystem.com/elements/color/tokens/>
- Atkinson Hyperlegible · <https://www.brailleinstitute.org/freefont/>
- PulseMind data dictionary and frontend data contract, in `planning/`

**Unverified, and treated as such:** IEC 60601-1-8 flash frequencies and duty cycles are
paywalled and corroborated only by secondary sources; AAMI HE75:2025 numeric
recommendations could not be obtained. Neither is relied on for a hard rule above.
