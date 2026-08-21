# 2010 AP occupation matcher

Career exploration only. Not hiring. Youth-facing.

Vintage: **O*NET 30.3**.

JobTest ships **Option 3** (Parts 1–6: VA, AR, CM, SA, FP, CP). Parts 7–11
(psychomotor) are not administered. Do not claim official Ability Profiler
scores or official percentiles.

## Educator lock

Pearson *r* of the person’s GATB **converted scores** (mean 100, SD 20) versus
Occupational Ability Profiles rebuilt on **O*NET 30.3** via UpdateOAP 2011
Appendix E.

- Person vector order: VA, AR, CM, SA, FP, CP. Do not rescale to 1–9 or 1–12.
- Occupation vector: the same six OAP columns. MC / MD / FD stay on the CSV
  row and do **not** enter *r* (2010 rule 8).
- *r* is shape-only on those mixed units as-is. Do not convert OAPs to percentiles.
- Positive *r* only.
- Six-score thresholds (AP_Linking.pdf Table 2 p. 9): Strong 0.608 (*p* < .10),
  Very Strong 0.729 (*p* < .05).
- At least 10 Very Strong + Strong per Job Zone list; otherwise fill with Good.
  Not the 1999 UG Ch. 5 “min 10 regardless of *r*.”
- Max 25 occupations per Job Zone list.
- Four lists only: Job Zone 2 (official name “1–2 / very little to some prep”),
  Zone 3, Zone 4, Zone 5. Zone 1 is retired in 30.3.
- Ties: occupation-code (`onetsoc`) order only. Do **not** apply Euclidean *d* —
  mixed 100/20 vs ~1–12 scales make *d* invalid.
- Hide the 29 occupations with no abilities ratings (including Data Scientists
  15-2051.00). Do not invent an OAP for them.
- Youth-facing lists omit electrician, wind/solar, auto/HVAC/plumbing,
  dental/surgical, and cosmetology families (Option 3 does not measure hands).
  Those rows stay in the CSV.

## Modifications / disclosure

OAPs rebuilt from O*NET 30.3 via UpdateOAP Appendix E; FD Level typo corrected
(Finger Dexterity, not Manual Dexterity).

USDOL has not approved these modifications.

17.0 OccData.mdb / vintage 903 OAPs are calibration-only. They are not the
youth matcher table.

## Code

| Path | Role |
| --- | --- |
| [`lib/occupationMatch.ts`](lib/occupationMatch.ts) | Pearson *r*, 2010 list rules, youth filter |
| [`lib/oapTable.ts`](lib/oapTable.ts) | Load committed CSVs |
| [`lib/occupationMatch.test.ts`](lib/occupationMatch.test.ts) | Unit + table QC tests |
| [`data/jobtest-oap-30.3.csv`](data/jobtest-oap-30.3.csv) | 894 OAPs |
| [`data/jobtest-oap-30.3-excluded.csv`](data/jobtest-oap-30.3-excluded.csv) | 29 hidden |
| [`data/jobtest-oap-30.3-README.md`](data/jobtest-oap-30.3-README.md) | Builder method + QC |
| [`scripts/rebuild_oap.py`](scripts/rebuild_oap.py) | Appendix E builder |
| [`scripts/demo_match.ts`](scripts/demo_match.ts) | SAMPLE DATA demo |

```bash
python3 scripts/rebuild_oap.py   # regenerate CSVs; QC must pass
npm test
npx tsx scripts/demo_match.ts    # SAMPLE DATA, not a real sitting
```
