/**
 * Tiny demo: run the 2010 matcher on SAMPLE DATA converted scores.
 * Not a real sitting. Do not claim official AP scores or percentiles.
 *
 *   npx tsx scripts/demo_match.ts
 */
import { ONET_VINTAGE, OAP_DISCLOSURE, matchOccupations } from "../lib/occupationMatch.ts";
import { loadCommittedOapTable } from "../lib/oapTable.ts";

/** SAMPLE DATA — invented GATB converted scores (mean 100, SD 20). */
const SAMPLE_DATA = {
  VA: 110,
  AR: 140,
  CM: 135,
  SA: 90,
  FP: 95,
  CP: 95,
};

const table = loadCommittedOapTable();
const result = matchOccupations(SAMPLE_DATA, table);

console.log(`JobTest occupation lists — vintage ${result.vintage}`);
console.log("Career exploration only. Not hiring. SAMPLE DATA, not a real sitting.");
console.log(result.disclosure);
console.log("");
console.log("Person vector (VA AR CM SA FP CP):", Object.values(SAMPLE_DATA).join(", "));
console.log("");

for (const zone of result.zones) {
  console.log(`Job Zone ${zone.label} (${zone.matches.length} occupations${zone.note ? `, ${zone.note}` : ""})`);
  for (const [i, match] of zone.matches.entries()) {
    const r = match.r.toFixed(3);
    console.log(`  ${String(i + 1).padStart(2)}. ${match.onetsoc}  r=${r}  ${match.strength.padEnd(12)}  ${match.title}`);
  }
  console.log("");
}

console.log(`OAP rows loaded: ${table.length}  vintage ${ONET_VINTAGE}`);
console.log(OAP_DISCLOSURE);
