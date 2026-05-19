#!/usr/bin/env node
// sample-types.mjs — deterministic per-alias type detection from sample data.
//
// Usage: node sample-types.mjs <data.json-path>
//
// Reads data.json (array of row objects). For each alias, scans values across
// rows and classifies. Output: { "<alias>": { type, sampleCount, [conflict, types] } }.
//
// Types (regex/typeof — no fuzzy):
//   uuid       — every non-null value matches /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
//   datetime   — every non-null value matches /^\d{4}-\d{2}-\d{2}T/
//   date       — every non-null value matches /^\d{4}-\d{2}-\d{2}$/
//   integer    — every non-null value typeof === "number" AND Number.isInteger
//   number     — every non-null value typeof === "number"
//   object     — every non-null value typeof === "object" (incl arrays)
//   string     — every non-null value typeof === "string", no other regex hit
//   boolean    — every non-null value typeof === "boolean"
//   mixed      — values disagree across rows → conflict=true
//   empty      — all values null/undefined → no signal

import fs from "node:fs";

const path = process.argv[2];
if (!path) {
  process.stderr.write("Usage: node sample-types.mjs <data.json>\n");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(path, "utf8"));
if (!Array.isArray(data) || data.length === 0) {
  process.stdout.write("{}\n");
  process.exit(0);
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DATETIME = /^\d{4}-\d{2}-\d{2}T/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

function classify(v) {
  if (v === null || v === undefined) return null;
  if (typeof v === "object") return "object";
  if (typeof v === "number") return Number.isInteger(v) ? "integer" : "number";
  if (typeof v === "boolean") return "boolean";
  if (typeof v === "string") {
    if (UUID.test(v)) return "uuid";
    if (DATETIME.test(v)) return "datetime";
    if (DATE.test(v)) return "date";
    return "string";
  }
  return "string";
}

const aliases = new Set();
for (const row of data) {
  if (row && typeof row === "object") {
    for (const k of Object.keys(row)) aliases.add(k);
  }
}

const out = {};
for (const alias of aliases) {
  const types = new Set();
  let count = 0;
  for (const row of data) {
    const t = classify(row[alias]);
    if (t === null) continue;
    types.add(t);
    count++;
  }
  if (count === 0) {
    out[alias] = { type: "empty", sampleCount: 0 };
    continue;
  }
  if (types.size === 1) {
    out[alias] = { type: [...types][0], sampleCount: count };
    continue;
  }
  // Allow integer/number coexistence as "number".
  if (types.size === 2 && types.has("integer") && types.has("number")) {
    out[alias] = { type: "number", sampleCount: count };
    continue;
  }
  out[alias] = {
    type: "mixed",
    types: [...types],
    sampleCount: count,
    conflict: true,
  };
}

process.stdout.write(JSON.stringify(out, null, 2) + "\n");
