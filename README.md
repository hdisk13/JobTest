# JobTest

Career exploration only. Not hiring. Youth-facing.

This pull request ships the **O\*NET 30.3** Occupational Ability Profiles and
the official **2010** six-score occupation matcher (Option 3: Parts 1–6).

It does **not** include the archive-only materials or the first-pages UI.

## Vintage

Occupation lists are built from **O\*NET 30.3**.

Modifications / disclosure: OAPs rebuilt from O\*NET 30.3 via UpdateOAP
Appendix E; FD Level typo corrected (Finger Dexterity, not Manual Dexterity).

Do not claim official Ability Profiler scores or official percentiles.

## Educator lock

Pearson *r* of the person’s GATB converted scores (mean 100, SD 20) versus
OAPs rebuilt on O\*NET 30.3 via UpdateOAP 2011 Appendix E. See
[`MATCHER.md`](MATCHER.md) and [`data/jobtest-oap-30.3-README.md`](data/jobtest-oap-30.3-README.md).

## Quick start

```bash
npm install
npm test
npx tsx scripts/demo_match.ts   # SAMPLE DATA
```
