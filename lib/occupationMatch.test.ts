import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  JOB_ZONES,
  MATCH_VECTOR,
  ONET_VINTAGE,
  OAP_DISCLOSURE,
  STRONG_R,
  VERY_STRONG_R,
  ZONE_LABELS,
  isHandsOnFamily,
  loadOapTable,
  matchOccupations,
  matchStrength,
  occupationVector,
  pearsonR,
  type ConvertedScores,
  type OccupationRow,
} from "./occupationMatch.ts";
import { loadCommittedExcludedTable, loadCommittedOapTable } from "./oapTable.ts";

function scores(values: number[]): ConvertedScores {
  return {
    VA: values[0],
    AR: values[1],
    CM: values[2],
    SA: values[3],
    FP: values[4],
    CP: values[5],
  };
}

function row(partial: Partial<OccupationRow> & Pick<OccupationRow, "onetsoc" | "title">): OccupationRow {
  return {
    job_zone: 4,
    job_zone_name: "Job Zone Four: Considerable Preparation Needed",
    VA: 5,
    AR: 5,
    CM: 5,
    SA: 5,
    FP: 5,
    CP: 5,
    MC: 1,
    MD: 1,
    FD: 1,
    n_descriptors_used: 17,
    missing_flags: "",
    abilities_date: "08/2023",
    ...partial,
  };
}

/** SAMPLE DATA — invented converted scores, not a real sitting. */
const SAMPLE_MATH: ConvertedScores = scores([110, 140, 135, 90, 95, 95]);

describe("pearsonR", () => {
  it("is 1 for a perfect same-shape pair on mixed units", () => {
    const person = [120, 80, 80, 100, 100, 100];
    const oap = [6, 2, 2, 4, 4, 4];
        assert.equal(pearsonR(person, oap), 1); // clamped off 1+eps float noise
  });

  it("is -1 for a reversed pair", () => {
    assert.equal(pearsonR([1, 2, 3, 4, 5, 6], [6, 5, 4, 3, 2, 1]), -1);
  });

  it("returns null when the person vector has zero variance", () => {
    assert.equal(pearsonR([100, 100, 100, 100, 100, 100], [8, 6, 5, 4, 3, 3]), null);
  });

  it("does not use MC/MD/FD — identical 6-scores yield identical r", () => {
    const person = [110, 140, 135, 90, 95, 95];
    const a = row({
      onetsoc: "99-0001.00",
      title: "A",
      VA: 8,
      AR: 10,
      CM: 10,
      SA: 5,
      FP: 6,
      CP: 6,
      MC: 1,
      MD: 1,
      FD: 1,
    });
    const b = row({
      onetsoc: "99-0002.00",
      title: "B",
      VA: 8,
      AR: 10,
      CM: 10,
      SA: 5,
      FP: 6,
      CP: 6,
      MC: 9,
      MD: 9,
      FD: 9,
    });
    assert.equal(pearsonR(person, occupationVector(a)), pearsonR(person, occupationVector(b)));
    assert.equal(occupationVector(a).length, 6);
    assert.deepEqual(occupationVector(a), [8, 10, 10, 5, 6, 6]);
  });
});

describe("matchStrength / Table 2", () => {
  it("uses the six-score 2010 cutoffs, inclusive", () => {
    assert.equal(matchStrength(0), null);
    assert.equal(matchStrength(-0.2), null);
    assert.equal(matchStrength(0.607), "good");
    assert.equal(matchStrength(STRONG_R), "strong");
    assert.equal(matchStrength(0.728), "strong");
    assert.equal(matchStrength(VERY_STRONG_R), "very_strong");
    assert.equal(STRONG_R, 0.608);
    assert.equal(VERY_STRONG_R, 0.729);
  });
});

describe("matchOccupations rules", () => {
  it("keeps positive r only and never invents Zone 1", () => {
    const occs = [
      row({
        onetsoc: "11-0001.00",
        title: "Opposite",
        job_zone: 4,
        VA: 2,
        AR: 10,
        CM: 10,
        SA: 2,
        FP: 2,
        CP: 2,
      }),
      row({
        onetsoc: "11-0002.00",
        title: "Same shape",
        job_zone: 4,
        VA: 8,
        AR: 3,
        CM: 3,
        SA: 8,
        FP: 8,
        CP: 8,
      }),
    ];
    // High VA / SA / FP / CP, low AR / CM — matches Same shape, opposes Opposite.
    const result = matchOccupations(scores([130, 80, 80, 130, 125, 125]), occs);
    assert.deepEqual(
      result.zones.map((z) => z.job_zone),
      [2, 3, 4, 5],
    );
    const zone4 = result.zones.find((z) => z.job_zone === 4);
    assert.ok(zone4);
    assert.deepEqual(
      zone4.matches.map((m) => m.onetsoc),
      ["11-0002.00"],
    );
    assert.ok(zone4.matches[0].r > 0);
  });

  it("fills Good only when Very Strong + Strong is under 10, and caps at 25", () => {
    const occs: OccupationRow[] = [];
    for (let i = 0; i < 8; i++) {
      occs.push(
        row({
          onetsoc: `22-000${i}.00`,
          title: `Strong ${i}`,
          job_zone: 3,
          VA: 8 + i * 0.01,
          AR: 3,
          CM: 3,
          SA: 8,
          FP: 8,
          CP: 8,
        }),
      );
    }
    for (let i = 0; i < 30; i++) {
      const n = String(i).padStart(2, "0");
      // Mild tilt only — r stays in the Good band for this person vector.
      occs.push(
        row({
          onetsoc: `33-00${n}.00`,
          title: `Good ${i}`,
          job_zone: 3,
          VA: 5.4,
          AR: 5.2 + i * 0.01,
          CM: 5.15,
          SA: 5.25,
          FP: 5.2,
          CP: 5.2,
        }),
      );
    }
    const person = scores([130, 80, 80, 130, 125, 125]);
    const zone3 = matchOccupations(person, occs).zones.find((z) => z.job_zone === 3);
    assert.ok(zone3);
    const strong = zone3.matches.filter((m) => m.strength !== "good");
    const good = zone3.matches.filter((m) => m.strength === "good");
    assert.ok(strong.length < 10);
    assert.equal(zone3.matches.length, 10);
    assert.equal(good.length, 10 - strong.length);

    const manyStrong: OccupationRow[] = [];
    for (let i = 0; i < 30; i++) {
      const n = String(i).padStart(2, "0");
      manyStrong.push(
        row({
          onetsoc: `44-00${n}.00`,
          title: `VS ${i}`,
          job_zone: 5,
          VA: 9,
          AR: 3,
          CM: 3,
          SA: 9,
          FP: 8.5 + i * 0.001,
          CP: 8.5 + i * 0.001,
        }),
      );
    }
    const zone5 = matchOccupations(person, manyStrong).zones.find((z) => z.job_zone === 5);
    assert.ok(zone5);
    assert.equal(zone5.matches.length, 25);
    assert.ok(zone5.matches.every((m) => m.strength !== "good"));
  });

  it("breaks r ties by onetsoc only — never Euclidean d", () => {
    const person = scores([120, 80, 80, 100, 100, 100]);
    // Same shape (r = 1). Different levels would reverse if d were used
    // (99-0002 is closer to a 1–12 person vector; we do not rescale or use d).
    const occs = [
      row({
        onetsoc: "99-0002.00",
        title: "Closer if d were valid",
        job_zone: 2,
        VA: 6,
        AR: 2,
        CM: 2,
        SA: 4,
        FP: 4,
        CP: 4,
      }),
      row({
        onetsoc: "99-0001.00",
        title: "Farther if d were valid",
        job_zone: 2,
        VA: 12,
        AR: 4,
        CM: 4,
        SA: 8,
        FP: 8,
        CP: 8,
      }),
    ];
    const zone2 = matchOccupations(person, occs).zones.find((z) => z.job_zone === 2);
    assert.ok(zone2);
    assert.equal(zone2.matches[0].r, 1);
    assert.equal(zone2.matches[1].r, 1);
    assert.deepEqual(
      zone2.matches.map((m) => m.onetsoc),
      ["99-0001.00", "99-0002.00"],
    );
  });

  it("filters hands-on families from youth lists but can keep them when asked", () => {
    const occs = [
      row({ onetsoc: "47-2111.00", title: "Electricians", job_zone: 3, VA: 8, AR: 3, CM: 3, SA: 8, FP: 8, CP: 8 }),
      row({
        onetsoc: "13-2011.00",
        title: "Accountants and Auditors",
        job_zone: 3,
        VA: 8,
        AR: 3,
        CM: 3,
        SA: 8,
        FP: 8,
        CP: 8,
      }),
    ];
    const person = scores([130, 80, 80, 130, 125, 125]);
    const youth = matchOccupations(person, occs);
    const research = matchOccupations(person, occs, { includeHandsOnFamilies: true });
    const youth3 = youth.zones.find((z) => z.job_zone === 3);
    const research3 = research.zones.find((z) => z.job_zone === 3);
    assert.ok(youth3 && research3);
    assert.deepEqual(
      youth3.matches.map((m) => m.onetsoc),
      ["13-2011.00"],
    );
    assert.ok(research3.matches.some((m) => m.onetsoc === "47-2111.00"));
    assert.equal(isHandsOnFamily("47-2111.00", "Electricians"), true);
    assert.equal(isHandsOnFamily("17-2071.00", "Electrical Engineers"), false);
  });

  it("labels vintage O*NET 30.3 and the Appendix E disclosure", () => {
    const result = matchOccupations(SAMPLE_MATH, []);
    assert.equal(result.vintage, "O*NET 30.3");
    assert.equal(result.disclosure, OAP_DISCLOSURE);
    assert.match(result.disclosure, /FD Level typo corrected/);
    assert.equal(ZONE_LABELS[2], "1–2 / very little to some prep");
    assert.deepEqual([...JOB_ZONES], [2, 3, 4, 5]);
    assert.deepEqual([...MATCH_VECTOR], ["VA", "AR", "CM", "SA", "FP", "CP"]);
  });
});

describe("committed O*NET 30.3 OAP table QC", () => {
  const table = loadCommittedOapTable();
  const excluded = loadCommittedExcludedTable();

  it("has 894 unique SOCs, 29 excluded, and the locked columns", () => {
    const socs = table.map((r) => r.onetsoc);
    assert.equal(socs.length, 894);
    assert.equal(new Set(socs).size, 894);
    assert.equal(excluded.length, 29);
    assert.equal(new Set(excluded.map((r) => r.onetsoc)).size, 29);
  });

  it("matches the Job Zone histogram and never ships Zone 1", () => {
    const hist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const r of table) hist[r.job_zone] += 1;
    assert.deepEqual(hist, { 1: 0, 2: 324, 3: 204, 4: 215, 5: 151 });
  });

  it("has CP == FP and n_descriptors_used = 17 on every row", () => {
    for (const r of table) {
      assert.equal(r.CP, r.FP, r.onetsoc);
      assert.equal(r.n_descriptors_used, 17, r.onetsoc);
    }
  });

  it("hides Data Scientists 15-2051.00 and keeps the siblings", () => {
    assert.equal(
      table.some((r) => r.onetsoc === "15-2051.00"),
      false,
    );
    assert.ok(excluded.some((r) => r.onetsoc === "15-2051.00"));
    assert.ok(table.some((r) => r.onetsoc === "15-2051.01"));
    assert.ok(table.some((r) => r.onetsoc === "15-2051.02"));
  });

  it("locks Actuaries 15-2011.00 Appendix E scores", () => {
    const act = table.find((r) => r.onetsoc === "15-2011.00");
    assert.ok(act);
    assert.equal(act.title, "Actuaries");
    assert.equal(act.VA, 8.26);
    assert.equal(act.AR, 10.05);
    assert.equal(act.CM, 9.85);
    assert.equal(act.SA, 5.0);
    assert.equal(act.FP, 5.63);
    assert.equal(act.CP, 5.63);
    assert.equal(act.MC, 2.0);
    assert.equal(act.MD, 1.5);
    assert.equal(act.FD, 2.0);
  });

  it("rejects a Zone 1 row if someone pastes one into the CSV", () => {
    const header =
      "onetsoc,title,job_zone,job_zone_name,VA,AR,CM,SA,FP,CP,MC,MD,FD,n_descriptors_used,missing_flags,abilities_date\n";
    const line =
      "99-0000.00,Retired,1,Job Zone One,1,1,1,1,1,1,1,1,1,17,,08/2023\n";
    assert.throws(() => loadOapTable(header + line), /Zone 1 is retired/);
  });

  it("matches SAMPLE DATA against the real 30.3 table without hands-on trades", () => {
    const result = matchOccupations(SAMPLE_MATH, table);
    assert.equal(result.vintage, ONET_VINTAGE);
    for (const zone of result.zones) {
      assert.ok(zone.matches.length <= 25);
      assert.ok(zone.matches.every((m) => m.r > 0));
      assert.ok(zone.matches.every((m) => !isHandsOnFamily(m.onetsoc, m.title)));
      for (let i = 1; i < zone.matches.length; i++) {
        const prev = zone.matches[i - 1];
        const cur = zone.matches[i];
        assert.ok(prev.r + 1e-12 >= cur.r);
        if (Math.abs(prev.r - cur.r) < 1e-6) {
          assert.ok(prev.onetsoc < cur.onetsoc);
        }
      }
    }
    const zone4 = result.zones.find((z) => z.job_zone === 4);
    assert.ok(zone4);
    const actuaries = zone4.matches.find((m) => m.onetsoc === "15-2011.00");
    assert.ok(actuaries, "SAMPLE DATA math-high profile should surface Actuaries in Zone 4");
    assert.ok(actuaries.r >= STRONG_R);
  });
});
