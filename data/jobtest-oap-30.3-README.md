# JobTest Occupational Ability Profiles — O*NET 30.3

Career exploration only. Not hiring. Youth-facing.

Vintage label: **O*NET 30.3**.

## Educator lock

JobTest ships **Option 3** (Ability Profiler Parts 1–6 only): VA, AR, CM, SA, FP, CP.
Parts 7–11 (psychomotor MC / MD / FD) are not administered. MC, MD, and FD are
stored on each OAP row for completeness and must **not** enter the 6-score
Pearson *r* (2010 AP_Linking.pdf rule 8).

The matcher correlates the person’s GATB **converted scores** (mean 100, SD 20)
with these OAPs. Do not rescale the person vector to 1–9 or 1–12. Do not convert
OAPs to percentiles. *r* is shape-only on the mixed units as-is.

OAPs are rebuilt from **O*NET 30.3** via UpdateOAP 2011 Appendix E.
**FD Level typo corrected (Finger Dexterity, not Manual Dexterity).**

Do not claim official Ability Profiler scores or official percentiles.
USDOL has not approved these modifications.

17.0 OccData.mdb / vintage 903 OAPs are calibration-only and are not this table.

## Method

Source database: official O*NET 30.3 text dump
[`db_30_3_text.zip`](https://www.onetcenter.org/dl_files/database/db_30_3_text.zip).

Builder: [`scripts/rebuild_oap.py`](../scripts/rebuild_oap.py).

Appendix E formula (do not invent):

    Dimension = mean(Importance of linked descriptors)
              + mean(Level of the same descriptors)

Fixed denominators. Scores rounded half-up to 2 decimals.

| Dimension | Linked descriptors (Importance and Level) |
| --- | --- |
| AR | Mathematics (Knowledge 2.C.4.a), Mathematics (Skill 2.A.1.e), Mathematical Reasoning (1.A.1.c.1) |
| VA | Writing skill, Oral Comprehension, Oral Expression, Written Expression, English Language knowledge, Reading Comprehension skill, Speaking skill, Written Comprehension |
| SA | Visualization (1.A.1.f.2) |
| CM | Number Facility, Mathematics Knowledge, Mathematics Skill |
| CP | Perceptual Speed (1.A.1.e.3) |
| FP | Same as CP (official; CP == FP on every row) |
| MC | Wrist-Finger Speed (stored; unused in Option 3 *r*) |
| MD | Manual Dexterity + Wrist-Finger Speed. **No Control Precision.** |
| FD | Finger Dexterity (1.A.2.a.3) + Wrist-Finger Speed. **FD Level is Finger Dexterity**, not the Appendix E PDF paste of Manual Dexterity. |

17 unique descriptors are used on every included row (`n_descriptors_used = 17`).

O*NET 30.3 split `Skills.txt` into `Essential Skills.txt` (2.A.*) and
`Transferable Skills.txt`. Skill descriptors come from Essential Skills.

Two Content Model IDs moved since the 2011 report. The builder uses 30.3 IDs:

- English Language knowledge = `2.C.7.a` (not `2.C.1.a`, which is now Administration and Management)
- Wrist-Finger Speed = `1.A.2.c.2` (not `1.A.2.c.1`, which is now Reaction Time)

Occupations with no Abilities ratings (29 in 30.3, including Data Scientists
15-2051.00) are hidden. No OAP is invented for them. Siblings 15-2051.01
(Business Intelligence Analysts) and 15-2051.02 (Clinical Data Managers) have
abilities and are included.

Job Zone 1 is retired in 30.3. Zone 2’s official name is
“Job Zone 1-2: Very Little to Some Preparation Needed.”

## Files

| File | Contents |
| --- | --- |
| `jobtest-oap-30.3.csv` | 894 occupations with abilities |
| `jobtest-oap-30.3-excluded.csv` | 29 hidden occupations (no abilities ratings) |
| `jobtest-oap-30.3-README.md` | this file |

Rebuild (downloads the official zip into `.onet-cache/` if needed):

```bash
python3 scripts/rebuild_oap.py
```

The committed CSVs are the runtime source of truth. The app does not need the
zip.

## QC (this build)

- 894 unique SOCs in main CSV; 29 in excluded
- Job Zone histogram Z1=0 Z2=324 Z3=204 Z4=215 Z5=151
- CP == FP on every main row
- 15-2051.00 excluded only; 15-2051.01 and 15-2051.02 included
- Actuaries 15-2011.00 matches Educator lock scores
- n_descriptors_used = 17 on every included row
- column order matches the Educator lock

If QC fails, fix the builder. Do not hand-edit scores.

## License / disclosure

O*NET® is a trademark of USDOL/ETA. Occupation data is CC BY 4.0.
These OAPs are a JobTest modification of the UpdateOAP Appendix E method
applied to O*NET 30.3.

Modifications / disclosure: OAPs rebuilt from O*NET 30.3 via UpdateOAP
Appendix E; FD Level typo corrected (Finger Dexterity, not Manual Dexterity).
