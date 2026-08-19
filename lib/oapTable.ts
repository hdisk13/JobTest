import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  loadExcludedTable,
  loadOapTable,
  type OccupationRow,
} from "./occupationMatch.ts";

const here = dirname(fileURLToPath(import.meta.url));
export const OAP_CSV_PATH = join(here, "..", "data", "jobtest-oap-30.3.csv");
export const OAP_EXCLUDED_CSV_PATH = join(here, "..", "data", "jobtest-oap-30.3-excluded.csv");

export function loadCommittedOapTable(): OccupationRow[] {
  return loadOapTable(readFileSync(OAP_CSV_PATH, "utf8"));
}

export function loadCommittedExcludedTable(): { onetsoc: string; title: string }[] {
  return loadExcludedTable(readFileSync(OAP_EXCLUDED_CSV_PATH, "utf8"));
}
