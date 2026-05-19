#!/usr/bin/env node
// extract-binds.mjs — deterministic SQL bind parameter extractor.
//
// Usage: node extract-binds.mjs <sql-path>
//
// Lexes the SQL for `:NAME` tokens. Strips /* */ and -- comments first.
// Drops SHOW_* and the hard-coded internal-plumbing list.
// Output: JSON array of param names in first-appearance order.
//
// Reserved-keyword names like LIMIT and OFFSET are STILL extracted —
// they're real binds when prefixed with `:`. Skill must render them.

import fs from "node:fs";

const sqlPath = process.argv[2];
if (!sqlPath) {
  process.stderr.write("Usage: node extract-binds.mjs <sql-path>\n");
  process.exit(1);
}

const DROP_EXACT = new Set(["MULT", "MAX_RECORDS", "PRICE_LIST_ID"]);

let sql = fs.readFileSync(sqlPath, "utf8");
sql = sql.replace(/\/\*[\s\S]*?\*\//g, "");
sql = sql.replace(/--[^\n]*/g, "");

// Match a single `:` (not preceded by another `:` — that's a `::TYPE` cast)
// followed by an UPPER_SNAKE_CASE identifier.
const seen = new Set();
const result = [];
for (const m of sql.matchAll(/(?<!:):([A-Z_][A-Z0-9_]*)/g)) {
  const name = m[1];
  if (seen.has(name)) continue;
  if (name.startsWith("SHOW_")) continue;
  if (DROP_EXACT.has(name)) continue;
  seen.add(name);
  result.push(name);
}

process.stdout.write(JSON.stringify(result) + "\n");
