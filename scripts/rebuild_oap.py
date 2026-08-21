#!/usr/bin/env python3
"""Rebuild JobTest Occupational Ability Profiles from official O*NET 30.3.

Implements UpdateOAP 2011 Appendix E exactly:

    dimension = mean(Importance of linked descriptors)
              + mean(Level of the same descriptors)

Fixed denominators (always divide by the official descriptor count, not by
how many values happen to be present). Scores are rounded half-up to 2
decimals.

O*NET 30.3 remaps two descriptor IDs relative to the 2011 report. This
builder looks up current 30.3 IDs / names:

    English Language knowledge  2.C.7.a   (was 2.C.1.a in older dumps)
    Wrist-Finger Speed          1.A.2.c.2 (1.A.2.c.1 is now Reaction Time)

Skills live in Essential Skills.txt (2.A.*). Transferable Skills.txt is
not used.

FD Level typo in the Appendix E PDF paste ("Manual Dexterity") is
corrected: FD Level is Finger Dexterity. See data/jobtest-oap-30.3-README.md.
"""

from __future__ import annotations

import argparse
import csv
import io
import sys
import urllib.request
import zipfile
from collections import Counter, defaultdict
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path

ONET_ZIP_URL = "https://www.onetcenter.org/dl_files/database/db_30_3_text.zip"
ONET_VINTAGE = "O*NET 30.3"
ZIP_PREFIX = "db_30_3_text/"

# Current O*NET 30.3 Content Model IDs. Looked up by ID, then verified by name.
# Source file is implied by the ID prefix (1.A abilities, 2.A essential skills,
# 2.C knowledge).
DESCRIPTORS: dict[str, tuple[str, str]] = {
    # VA (8)
    "2.A.1.c": ("Writing", "skill"),
    "1.A.1.a.1": ("Oral Comprehension", "ability"),
    "1.A.1.a.3": ("Oral Expression", "ability"),
    "1.A.1.a.4": ("Written Expression", "ability"),
    "2.C.7.a": ("English Language", "knowledge"),
    "2.A.1.a": ("Reading Comprehension", "skill"),
    "2.A.1.d": ("Speaking", "skill"),
    "1.A.1.a.2": ("Written Comprehension", "ability"),
    # AR (3) / CM overlap
    "2.C.4.a": ("Mathematics", "knowledge"),
    "2.A.1.e": ("Mathematics", "skill"),
    "1.A.1.c.1": ("Mathematical Reasoning", "ability"),
    # CM extra
    "1.A.1.c.2": ("Number Facility", "ability"),
    # SA
    "1.A.1.f.2": ("Visualization", "ability"),
    # CP / FP
    "1.A.1.e.3": ("Perceptual Speed", "ability"),
    # MC / MD / FD
    "1.A.2.c.2": ("Wrist-Finger Speed", "ability"),
    "1.A.2.a.2": ("Manual Dexterity", "ability"),
    "1.A.2.a.3": ("Finger Dexterity", "ability"),
}

DIMENSIONS: dict[str, list[str]] = {
    "VA": [
        "2.A.1.c",
        "1.A.1.a.1",
        "1.A.1.a.3",
        "1.A.1.a.4",
        "2.C.7.a",
        "2.A.1.a",
        "2.A.1.d",
        "1.A.1.a.2",
    ],
    "AR": ["2.C.4.a", "2.A.1.e", "1.A.1.c.1"],
    "CM": ["1.A.1.c.2", "2.C.4.a", "2.A.1.e"],
    "SA": ["1.A.1.f.2"],
    "CP": ["1.A.1.e.3"],
    "FP": ["1.A.1.e.3"],  # official: FP == CP on every row
    "MC": ["1.A.2.c.2"],
    "MD": ["1.A.2.a.2", "1.A.2.c.2"],  # NO Control Precision
    "FD": ["1.A.2.a.3", "1.A.2.c.2"],  # Level = Finger Dexterity, not Manual
}

MAIN_COLUMNS = [
    "onetsoc",
    "title",
    "job_zone",
    "job_zone_name",
    "VA",
    "AR",
    "CM",
    "SA",
    "FP",
    "CP",
    "MC",
    "MD",
    "FD",
    "n_descriptors_used",
    "missing_flags",
    "abilities_date",
]

EXCLUDED_COLUMNS = [
    "onetsoc",
    "title",
    "job_zone",
    "job_zone_name",
    "exclude_reason",
]

ACTUARIES = "15-2011.00"
ACTUARIES_EXPECTED = {
    "VA": Decimal("8.26"),
    "AR": Decimal("10.05"),
    "CM": Decimal("9.85"),
    "SA": Decimal("5.00"),
    "FP": Decimal("5.63"),
    "CP": Decimal("5.63"),
    "MC": Decimal("2.00"),
    "MD": Decimal("1.50"),
    "FD": Decimal("2.00"),
}

ZONE_HISTOGRAM = {"1": 0, "2": 324, "3": 204, "4": 215, "5": 151}


def half_up_2(value: Decimal) -> Decimal:
    return value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def dimension_score(values_im: list[Decimal], values_lv: list[Decimal]) -> Decimal:
    """Appendix E: mean(IMP) + mean(LVL) with a fixed denominator."""
    n = len(values_im)
    if n == 0 or n != len(values_lv):
        raise ValueError("descriptor lists must be non-empty and paired")
    mean_im = sum(values_im, Decimal("0")) / Decimal(n)
    mean_lv = sum(values_lv, Decimal("0")) / Decimal(n)
    return half_up_2(mean_im + mean_lv)


def repo_root() -> Path:
    return Path(__file__).resolve().parent.parent


def default_cache_dir() -> Path:
    return repo_root() / ".onet-cache"


def download_zip(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    print(f"Downloading {url}", file=sys.stderr)
    with urllib.request.urlopen(url) as resp, dest.open("wb") as out:
        while True:
            chunk = resp.read(1024 * 256)
            if not chunk:
                break
            out.write(chunk)


def read_zip_table(zf: zipfile.ZipFile, name: str) -> list[dict[str, str]]:
    raw = zf.read(ZIP_PREFIX + name)
    text = io.StringIO(raw.decode("utf-8"))
    return list(csv.DictReader(text, delimiter="\t"))


def load_ratings(rows: list[dict[str, str]], wanted: set[str]) -> dict[str, dict[str, dict[str, dict[str, str]]]]:
    """soc -> element_id -> scale_id -> row."""
    out: dict[str, dict[str, dict[str, dict[str, str]]]] = defaultdict(
        lambda: defaultdict(dict)
    )
    for row in rows:
        eid = row["Element ID"]
        if eid not in wanted:
            continue
        expected_name, _ = DESCRIPTORS[eid]
        if row["Element Name"] != expected_name:
            raise SystemExit(
                f"ID/name mismatch for {eid}: expected {expected_name!r}, "
                f"got {row['Element Name']!r}"
            )
        out[row["O*NET-SOC Code"]][eid][row["Scale ID"]] = row
    return out


def merge_ratings(
    *tables: dict[str, dict[str, dict[str, dict[str, str]]]],
) -> dict[str, dict[str, dict[str, dict[str, str]]]]:
    merged: dict[str, dict[str, dict[str, dict[str, str]]]] = defaultdict(
        lambda: defaultdict(dict)
    )
    for table in tables:
        for soc, elems in table.items():
            for eid, scales in elems.items():
                merged[soc][eid].update(scales)
    return merged


def score_occupation(
    soc: str,
    ratings: dict[str, dict[str, dict[str, str]]],
) -> tuple[dict[str, Decimal], int, str]:
    missing: list[str] = []
    used = 0
    for eid in DESCRIPTORS:
        have_im = "IM" in ratings.get(eid, {})
        have_lv = "LV" in ratings.get(eid, {})
        if have_im and have_lv:
            used += 1
        else:
            if not have_im:
                missing.append(f"{eid}:IM")
            if not have_lv:
                missing.append(f"{eid}:LV")

    scores: dict[str, Decimal] = {}
    for dim, eids in DIMENSIONS.items():
        ims: list[Decimal] = []
        lvs: list[Decimal] = []
        for eid in eids:
            try:
                ims.append(Decimal(ratings[eid]["IM"]["Data Value"]))
                lvs.append(Decimal(ratings[eid]["LV"]["Data Value"]))
            except KeyError as exc:
                raise KeyError(f"{soc} missing {dim} {eid}") from exc
        scores[dim] = dimension_score(ims, lvs)
    return scores, used, ",".join(missing)


def qc_or_die(
    included: list[dict[str, str]],
    excluded: list[dict[str, str]],
) -> list[str]:
    errors: list[str] = []
    socs = [row["onetsoc"] for row in included]
    if len(socs) != 894:
        errors.append(f"main rows {len(socs)} != 894")
    if len(set(socs)) != len(socs):
        errors.append("main CSV has duplicate onetsoc")
    if len(excluded) != 29:
        errors.append(f"excluded rows {len(excluded)} != 29")
    excl_socs = [row["onetsoc"] for row in excluded]
    if len(set(excl_socs)) != len(excl_socs):
        errors.append("excluded CSV has duplicate onetsoc")
    overlap = set(socs) & set(excl_socs)
    if overlap:
        errors.append(f"SOC overlap main/excluded: {sorted(overlap)}")

    hist = Counter(row["job_zone"] for row in included)
    for zone, expected in ZONE_HISTOGRAM.items():
        got = hist.get(zone, 0)
        if got != expected:
            errors.append(f"Job Zone {zone} count {got} != {expected}")

    for row in included:
        if row["CP"] != row["FP"]:
            errors.append(f"{row['onetsoc']} CP {row['CP']} != FP {row['FP']}")
            break
        if row["n_descriptors_used"] != "17":
            errors.append(
                f"{row['onetsoc']} n_descriptors_used={row['n_descriptors_used']}"
            )
            break

    if any(row["onetsoc"] == "15-2051.00" for row in included):
        errors.append("15-2051.00 Data Scientists must be excluded only")
    if not any(row["onetsoc"] == "15-2051.00" for row in excluded):
        errors.append("15-2051.00 missing from excluded")
    for sibling in ("15-2051.01", "15-2051.02"):
        if not any(row["onetsoc"] == sibling for row in included):
            errors.append(f"{sibling} missing from main CSV")
        if any(row["onetsoc"] == sibling for row in excluded):
            errors.append(f"{sibling} must not be excluded")

    act = next((row for row in included if row["onetsoc"] == ACTUARIES), None)
    if act is None:
        errors.append("Actuaries 15-2011.00 missing from main CSV")
    else:
        for dim, expected in ACTUARIES_EXPECTED.items():
            got = Decimal(act[dim])
            if got != expected:
                errors.append(f"Actuaries {dim} {got} != {expected}")

    expected_cols = MAIN_COLUMNS
    if included and list(included[0].keys()) != expected_cols:
        errors.append(f"main columns {list(included[0].keys())} != {expected_cols}")

    if errors:
        print("QC FAILED:", file=sys.stderr)
        for err in errors:
            print(f"  - {err}", file=sys.stderr)
        raise SystemExit(1)
    return [
        "894 unique SOCs in main CSV; 29 in excluded",
        "Job Zone histogram Z1=0 Z2=324 Z3=204 Z4=215 Z5=151",
        "CP == FP on every main row",
        "15-2051.00 excluded only; 15-2051.01 and 15-2051.02 included",
        "Actuaries 15-2011.00 matches Educator lock scores",
        "n_descriptors_used = 17 on every included row",
        "column order matches the Educator lock",
    ]


def write_readme(path: Path, qc_lines: list[str], abilities_socs: int, excluded_n: int) -> None:
    text = f"""# JobTest Occupational Ability Profiles — {ONET_VINTAGE}

Career exploration only. Not hiring. Youth-facing.

Vintage label: **{ONET_VINTAGE}**.

## Educator lock

JobTest ships **Option 3** (Ability Profiler Parts 1–6 only): VA, AR, CM, SA, FP, CP.
Parts 7–11 (psychomotor MC / MD / FD) are not administered. MC, MD, and FD are
stored on each OAP row for completeness and must **not** enter the 6-score
Pearson *r* (2010 AP_Linking.pdf rule 8).

The matcher correlates the person’s GATB **converted scores** (mean 100, SD 20)
with these OAPs. Do not rescale the person vector to 1–9 or 1–12. Do not convert
OAPs to percentiles. *r* is shape-only on the mixed units as-is.

OAPs are rebuilt from **{ONET_VINTAGE}** via UpdateOAP 2011 Appendix E.
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
| `jobtest-oap-30.3.csv` | {abilities_socs} occupations with abilities |
| `jobtest-oap-30.3-excluded.csv` | {excluded_n} hidden occupations (no abilities ratings) |
| `jobtest-oap-30.3-README.md` | this file |

Rebuild (downloads the official zip into `.onet-cache/` if needed):

```bash
python3 scripts/rebuild_oap.py
```

The committed CSVs are the runtime source of truth. The app does not need the
zip.

## QC (this build)

"""
    text += "\n".join(f"- {line}" for line in qc_lines)
    text += """

If QC fails, fix the builder. Do not hand-edit scores.

## License / disclosure

O*NET® is a trademark of USDOL/ETA. Occupation data is CC BY 4.0.
These OAPs are a JobTest modification of the UpdateOAP Appendix E method
applied to O*NET 30.3.

Modifications / disclosure: OAPs rebuilt from O*NET 30.3 via UpdateOAP
Appendix E; FD Level typo corrected (Finger Dexterity, not Manual Dexterity).
"""
    path.write_text(text, encoding="utf-8")


def rebuild(zip_path: Path, data_dir: Path) -> None:
    if not zip_path.is_file():
        download_zip(ONET_ZIP_URL, zip_path)
    with zipfile.ZipFile(zip_path) as zf:
        occ_rows = read_zip_table(zf, "Occupation Data.txt")
        zone_rows = read_zip_table(zf, "Job Zones.txt")
        zone_ref_rows = read_zip_table(zf, "Job Zone Reference.txt")
        abilities = read_zip_table(zf, "Abilities.txt")
        knowledge = read_zip_table(zf, "Knowledge.txt")
        skills = read_zip_table(zf, "Essential Skills.txt")

    titles = {row["O*NET-SOC Code"]: row["Title"] for row in occ_rows}
    zones = {row["O*NET-SOC Code"]: row["Job Zone"] for row in zone_rows}
    zone_names = {row["Job Zone"]: row["Name"] for row in zone_ref_rows}

    ability_ids = {eid for eid, meta in DESCRIPTORS.items() if meta[1] == "ability"}
    knowledge_ids = {eid for eid, meta in DESCRIPTORS.items() if meta[1] == "knowledge"}
    skill_ids = {eid for eid, meta in DESCRIPTORS.items() if meta[1] == "skill"}

    ratings = merge_ratings(
        load_ratings(abilities, ability_ids),
        load_ratings(knowledge, knowledge_ids),
        load_ratings(skills, skill_ids),
    )

    abilities_socs = sorted({row["O*NET-SOC Code"] for row in abilities})
    zone_socs = sorted(zones)
    excluded_socs = [soc for soc in zone_socs if soc not in set(abilities_socs)]
    ability_dates: dict[str, set[str]] = defaultdict(set)
    for row in abilities:
        if row["Element ID"] in ability_ids:
            ability_dates[row["O*NET-SOC Code"]].add(row["Date"])

    included: list[dict[str, str]] = []
    for soc in abilities_socs:
        if soc not in zones:
            raise SystemExit(f"{soc} has abilities but no job zone")
        scores, n_used, missing = score_occupation(soc, ratings[soc])
        dates = ability_dates.get(soc, set())
        date = sorted(dates)[-1] if dates else ""
        zone = zones[soc]
        included.append(
            {
                "onetsoc": soc,
                "title": titles.get(soc, ""),
                "job_zone": zone,
                "job_zone_name": zone_names.get(zone, ""),
                "VA": f"{scores['VA']:.2f}",
                "AR": f"{scores['AR']:.2f}",
                "CM": f"{scores['CM']:.2f}",
                "SA": f"{scores['SA']:.2f}",
                "FP": f"{scores['FP']:.2f}",
                "CP": f"{scores['CP']:.2f}",
                "MC": f"{scores['MC']:.2f}",
                "MD": f"{scores['MD']:.2f}",
                "FD": f"{scores['FD']:.2f}",
                "n_descriptors_used": str(n_used),
                "missing_flags": missing,
                "abilities_date": date,
            }
        )

    excluded = [
        {
            "onetsoc": soc,
            "title": titles.get(soc, ""),
            "job_zone": zones[soc],
            "job_zone_name": zone_names.get(zones[soc], ""),
            "exclude_reason": "no abilities ratings",
        }
        for soc in excluded_socs
    ]

    qc_lines = qc_or_die(included, excluded)

    data_dir.mkdir(parents=True, exist_ok=True)
    main_path = data_dir / "jobtest-oap-30.3.csv"
    excl_path = data_dir / "jobtest-oap-30.3-excluded.csv"
    readme_path = data_dir / "jobtest-oap-30.3-README.md"

    with main_path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=MAIN_COLUMNS, lineterminator="\n")
        writer.writeheader()
        writer.writerows(included)

    with excl_path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=EXCLUDED_COLUMNS, lineterminator="\n")
        writer.writeheader()
        writer.writerows(excluded)

    write_readme(readme_path, qc_lines, len(included), len(excluded))
    print(f"Wrote {main_path} ({len(included)} rows)", file=sys.stderr)
    print(f"Wrote {excl_path} ({len(excluded)} rows)", file=sys.stderr)
    print(f"Wrote {readme_path}", file=sys.stderr)
    print("QC passed.", file=sys.stderr)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--zip",
        type=Path,
        default=default_cache_dir() / "db_30_3_text.zip",
        help="Path to db_30_3_text.zip (downloaded if missing)",
    )
    parser.add_argument(
        "--data-dir",
        type=Path,
        default=repo_root() / "data",
        help="Output directory for CSVs and README",
    )
    args = parser.parse_args()
    rebuild(args.zip, args.data_dir)


if __name__ == "__main__":
    main()
