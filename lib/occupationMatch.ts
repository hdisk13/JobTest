/**
 * 2010 O*NET Ability Profiler occupation linker (Option 3: six scores).
 *
 * Person vector: GATB converted scores, mean 100 / SD 20, order
 * VA, AR, CM, SA, FP, CP. Do not rescale to 1–9 or 1–12.
 * Occupation vector: the six OAP columns from the O*NET 30.3 table.
 * MC / MD / FD stay on the row and never enter r (AP_Linking.pdf rule 8).
 *
 * Pearson r is shape-only on those mixed units as-is. Positive r only.
 * Ties: occupation-code order only. Euclidean d is invalid on mixed scales
 * and is not implemented.
 *
 * Vintage: O*NET 30.3.
 */

export const ONET_VINTAGE = "O*NET 30.3";

export const MATCH_VECTOR = ["VA", "AR", "CM", "SA", "FP", "CP"] as const;
export type MatchDimension = (typeof MATCH_VECTOR)[number];

/** 2010 AP_Linking.pdf Table 2, six scores, one-tailed. */
export const STRONG_R = 0.608; // p < .10
export const VERY_STRONG_R = 0.729; // p < .05

export const MIN_STRONG_OR_VERY_STRONG = 10;
export const MAX_PER_ZONE = 25;

export const JOB_ZONES = [2, 3, 4, 5] as const;
export type JobZone = (typeof JOB_ZONES)[number];

/** Youth-facing list labels. Zone 1 is retired in O*NET 30.3. */
export const ZONE_LABELS: Record<JobZone, string> = {
  2: "1–2 / very little to some prep",
  3: "3 / medium prep",
  4: "4 / considerable prep",
  5: "5 / extensive prep",
};

export const OAP_DISCLOSURE =
  "OAPs rebuilt from O*NET 30.3 via UpdateOAP Appendix E; FD Level typo corrected (Finger Dexterity, not Manual Dexterity).";

export type ConvertedScores = Record<MatchDimension, number>;

export type OccupationRow = {
  onetsoc: string;
  title: string;
  job_zone: JobZone;
  job_zone_name: string;
  VA: number;
  AR: number;
  CM: number;
  SA: number;
  FP: number;
  CP: number;
  MC: number;
  MD: number;
  FD: number;
  n_descriptors_used: number;
  missing_flags: string;
  abilities_date: string;
};

export type MatchStrength = "very_strong" | "strong" | "good";

export type OccupationMatch = {
  onetsoc: string;
  title: string;
  job_zone: JobZone;
  job_zone_name: string;
  r: number;
  strength: MatchStrength;
};

export type ZoneList = {
  job_zone: JobZone;
  label: string;
  matches: OccupationMatch[];
  /** 2010 rules 9–10: fewer than 7, or none, after positive-r filtering. */
  note?: "few" | "none";
};

export type MatchOptions = {
  /**
   * Youth-facing lists omit electrician, wind/solar, auto/HVAC/plumbing,
   * dental/surgical, and cosmetology families (Option 3 does not measure
   * hands). Rows stay in the CSV. Set true only for research dumps.
   */
  includeHandsOnFamilies?: boolean;
};

export type MatchResult = {
  vintage: typeof ONET_VINTAGE;
  disclosure: typeof OAP_DISCLOSURE;
  zones: ZoneList[];
};

/**
 * Hands-on families Option 3 cannot fairly match. Keep these in the OAP CSV;
 * drop them from youth-facing lists only.
 */
const HANDS_ON_PREFIXES = [
  "47-2111", // Electricians
  "47-3013", // Helpers--Electricians
  "47-2231", // Solar Photovoltaic Installers
  "47-2151", // Pipelayers
  "47-2152", // Plumbers / Solar Thermal Installers
  "47-3015", // Helpers--Pipelayers, Plumbers
  "47-1011.03", // Solar Energy Installation Managers
  "49-9081", // Wind Turbine Service Technicians
  "49-302", // Automotive body / glass / service
  "49-9021", // HVAC
  "53-6031", // Automotive and Watercraft Service Attendants
  "29-102", // Dentists, orthodontists, oral surgeons
  "29-1292", // Dental Hygienists
  "31-9091", // Dental Assistants
  "51-9081", // Dental Laboratory Technicians
  "29-124", // Surgeons / ophthalmologists
  "29-2055", // Surgical Technologists
  "29-9093", // Surgical Assistants
  "39-501", // Barbers, hairdressers, cosmetologists
  "39-509", // Makeup, manicurists, shampooers, skincare
] as const;

const HANDS_ON_TITLE =
  /\b(electrician|electricians|solar photovoltaic|solar thermal installer|wind turbine|automotive (body|glass|service|and watercraft)|heating, air conditioning|plumber|plumbers|pipefitter|pipefitters|pipelayer|pipelayers|steamfitter|dentist|dentists|dental|orthodontist|prosthodontist|surgeon|surgeons|surgical|barber|barbers|hairdresser|hairstylist|cosmetologist|manicurist|pedicurist|shampooer|skincare specialist|makeup artist)/i;

export function isHandsOnFamily(onetsoc: string, title: string): boolean {
  if (HANDS_ON_PREFIXES.some((prefix) => onetsoc.startsWith(prefix))) {
    return true;
  }
  return HANDS_ON_TITLE.test(title);
}

/**
 * Pearson product-moment r using N (AP_Linking.pdf: sample σ divisor is N).
 * Equivalent to the usual mean-centered formula. Null if either vector has
 * zero variance (r undefined).
 */
export function pearsonR(x: readonly number[], y: readonly number[]): number | null {
  if (x.length !== y.length || x.length < 2) return null;
  const n = x.length;
  let sumX = 0;
  let sumY = 0;
  for (let i = 0; i < n; i++) {
    sumX += x[i];
    sumY += y[i];
  }
  const meanX = sumX / n;
  const meanY = sumY / n;
  let ssX = 0;
  let ssY = 0;
  let cxy = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    ssX += dx * dx;
    ssY += dy * dy;
    cxy += dx * dy;
  }
  if (ssX === 0 || ssY === 0) return null;
  const r = cxy / Math.sqrt(ssX * ssY);
  if (r > 1) return 1;
  if (r < -1) return -1;
  return r;
}

export function matchStrength(r: number): MatchStrength | null {
  if (!(r > 0)) return null;
  if (r >= VERY_STRONG_R) return "very_strong";
  if (r >= STRONG_R) return "strong";
  return "good";
}

export function personVector(scores: ConvertedScores): number[] {
  return MATCH_VECTOR.map((key) => scores[key]);
}

export function occupationVector(row: OccupationRow): number[] {
  return MATCH_VECTOR.map((key) => row[key]);
}

function round6(value: number): number {
  return Math.round(value * 1e6) / 1e6;
}

function compareMatches(a: OccupationMatch, b: OccupationMatch): number {
  const rb = round6(b.r);
  const ra = round6(a.r);
  if (rb !== ra) return rb < ra ? -1 : 1;
  if (a.onetsoc < b.onetsoc) return -1;
  if (a.onetsoc > b.onetsoc) return 1;
  return 0;
}

function selectForZone(ranked: OccupationMatch[]): OccupationMatch[] {
  const strongish = ranked.filter(
    (row) => row.strength === "very_strong" || row.strength === "strong",
  );
  if (strongish.length >= MIN_STRONG_OR_VERY_STRONG) {
    return strongish.slice(0, MAX_PER_ZONE);
  }
  return ranked.slice(0, Math.min(MAX_PER_ZONE, Math.max(MIN_STRONG_OR_VERY_STRONG, strongish.length)));
}

export function matchOccupations(
  person: ConvertedScores,
  occupations: readonly OccupationRow[],
  options: MatchOptions = {},
): MatchResult {
  const x = personVector(person);
  const zones: ZoneList[] = JOB_ZONES.map((job_zone) => {
    const ranked: OccupationMatch[] = [];
    for (const row of occupations) {
      if (row.job_zone !== job_zone) continue;
      if (!options.includeHandsOnFamilies && isHandsOnFamily(row.onetsoc, row.title)) {
        continue;
      }
      const r = pearsonR(x, occupationVector(row));
      if (r === null) continue;
      const strength = matchStrength(r);
      if (strength === null) continue;
      ranked.push({
        onetsoc: row.onetsoc,
        title: row.title,
        job_zone: row.job_zone,
        job_zone_name: row.job_zone_name,
        r,
        strength,
      });
    }
    ranked.sort(compareMatches);
    const matches = selectForZone(ranked);
    const list: ZoneList = {
      job_zone,
      label: ZONE_LABELS[job_zone],
      matches,
    };
    if (matches.length === 0) list.note = "none";
    else if (matches.length < 7) list.note = "few";
    return list;
  });

  return {
    vintage: ONET_VINTAGE,
    disclosure: OAP_DISCLOSURE,
    zones,
  };
}

const MAIN_COLUMNS = [
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
] as const;

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  const src = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += ch;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  if (rows.length > 0 && rows[rows.length - 1].length === 1 && rows[rows.length - 1][0] === "") {
    rows.pop();
  }
  return rows;
}

export function loadOapTable(csvText: string): OccupationRow[] {
  const rows = parseCsv(csvText);
  if (rows.length === 0) throw new Error("empty OAP CSV");
  const header = rows[0];
  if (header.length !== MAIN_COLUMNS.length || MAIN_COLUMNS.some((col, i) => header[i] !== col)) {
    throw new Error(`unexpected OAP columns: ${header.join(",")}`);
  }
  const out: OccupationRow[] = [];
  for (const cells of rows.slice(1)) {
    const rec: Record<string, string> = {};
    MAIN_COLUMNS.forEach((col, i) => {
      rec[col] = cells[i] ?? "";
    });
    const zone = Number(rec.job_zone);
    if (zone === 1) {
      throw new Error(`Zone 1 is retired in ${ONET_VINTAGE}: ${rec.onetsoc}`);
    }
    if (zone !== 2 && zone !== 3 && zone !== 4 && zone !== 5) {
      throw new Error(`invalid job_zone ${rec.job_zone} for ${rec.onetsoc}`);
    }
    out.push({
      onetsoc: rec.onetsoc,
      title: rec.title,
      job_zone: zone,
      job_zone_name: rec.job_zone_name,
      VA: Number(rec.VA),
      AR: Number(rec.AR),
      CM: Number(rec.CM),
      SA: Number(rec.SA),
      FP: Number(rec.FP),
      CP: Number(rec.CP),
      MC: Number(rec.MC),
      MD: Number(rec.MD),
      FD: Number(rec.FD),
      n_descriptors_used: Number(rec.n_descriptors_used),
      missing_flags: rec.missing_flags,
      abilities_date: rec.abilities_date,
    });
  }
  return out;
}

export function loadExcludedTable(csvText: string): { onetsoc: string; title: string }[] {
  const rows = parseCsv(csvText);
  return rows.slice(1).map((cells) => ({ onetsoc: cells[0], title: cells[1] }));
}
