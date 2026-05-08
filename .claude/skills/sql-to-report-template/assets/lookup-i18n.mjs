#!/usr/bin/env node
// lookup-i18n.mjs — deterministic i18n key resolver for sql-to-report-template skill.
//
// Hard rule: every emitted /<area>/<...> or /@word/<...> key MUST exist in the catalog.
// When a candidate is not present, fall back to /@unknown/<...> — never guess.
//
// Usage:
//   node lookup-i18n.mjs <catalog-path> <input-json-path>
//
// Input JSON shape:
//   {
//     "title":   "<reportName>",                   // optional — title key search
//     "area":    "material",                       // optional — slash-allowed: "supply/purchase"
//     "entity":  "inventoryManagementItem",        // optional — lowerCamelCase of main FROM table (minus module prefix)
//     "columns": ["id", "company_fantasyName", "minimumStock", ...],
//     "params":  ["DATE_START", "COMPANY_IDS", "PRODUCT_CATEGORY_IDS_1", ...]
//   }
//
// Output JSON shape (to stdout):
//   {
//     "title":   { resolved, key, candidates[], emit, missing[], nearMatches? },
//     "columns": { "<alias>": { resolved, resolution, ..., emit, missing?, nearMatches? } },
//     "params":  { "<NAME>": { resolved, type, labelKey, emit, missing?, nearMatches? } },
//     "summary": { total, resolved, missing, missingList: [{kind, name/alias, attempted, nearMatches?}] }
//   }

import fs from "node:fs";

const [, , catalogPath, inputPath] = process.argv;
if (!catalogPath || !inputPath) {
  process.stderr.write("Usage: node lookup-i18n.mjs <catalog.json> <input.json>\n");
  process.exit(1);
}

const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const input = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const keys = Object.keys(catalog);

let area = (input.area || "").replace(/^\/+|\/+$/g, "");
const areaInput = area;

// Auto-detect catalog placement: <area> at top level vs nested under system/.
// Pure key-count comparison, no heuristics. Catalog is authoritative.
if (area && !area.includes("/")) {
  const direct = keys.filter(k => k.startsWith(`/${area}/`)).length;
  const system = keys.filter(k => k.startsWith(`/system/${area}/`)).length;
  if (system > direct) area = `system/${area}`;
}

const entity = input.entity || "";
const areaPrefix = area ? `/${area}/` : null;

const out = {
  title: null,
  columns: {},
  params: {},
  summary: {
    total: 0,
    resolved: 0,
    missing: 0,
    missingList: [],
    areaInput,
    areaResolved: area,
  },
};

// ---- title ----
if (input.title) {
  out.title = resolveTitle(input.title);
  out.summary.total++;
  if (out.title.resolved) out.summary.resolved++;
  else {
    out.summary.missing++;
    out.summary.missingList.push({
      kind: "title",
      name: input.title,
      attempted: out.title.key,
      nearMatches: out.title.nearMatches || [],
    });
  }
}

// ---- columns ----
for (const alias of input.columns || []) {
  const r = resolveColumn(alias);
  out.columns[alias] = r;
  out.summary.total++;
  if (r.resolved) out.summary.resolved++;
  else {
    out.summary.missing++;
    out.summary.missingList.push({
      kind: "column",
      alias,
      attempted: r.suffix || r.key,
      fallback: r.emit,
      nearMatches: r.nearMatches || [],
    });
  }
}

// ---- params ----
for (const name of input.params || []) {
  const r = resolveParam(name);
  out.params[name] = r;
  out.summary.total++;
  if (r.resolved) out.summary.resolved++;
  else {
    out.summary.missing++;
    out.summary.missingList.push({
      kind: "param",
      name,
      attempted: r.labelKey,
      fallback: r.emit,
      nearMatches: r.nearMatches || [],
    });
  }
}

process.stdout.write(JSON.stringify(out, null, 2) + "\n");

// ================================================================
// Title
// ================================================================

function resolveTitle(name) {
  // 1. Direct: /<area>/report/<name>
  if (area) {
    const k = `/${area}/report/${name}`;
    if (catalog[k] !== undefined) {
      return {
        resolved: true,
        key: k,
        value: catalog[k],
        resolution: "area-direct",
        emit: `t("${k}")`,
      };
    }
  }
  // 2. Tail-search single-match: keys ending /report/<name>, filtered to area when known.
  const target = `/report/${name}`;
  let hits = keys.filter((k) => k.endsWith(target));
  if (areaPrefix) hits = hits.filter((k) => k.startsWith(areaPrefix));
  if (hits.length === 1) {
    return {
      resolved: true,
      key: hits[0],
      value: catalog[hits[0]],
      resolution: "tail-search-single",
      emit: `t("${hits[0]}")`,
    };
  }
  // 3. Fallback. Surface near matches (any-area) for the user.
  const fallback = `/@unknown/report/${name}`;
  const nearMatches = keys.filter((k) => k.endsWith(target)).slice(0, 10);
  return {
    resolved: false,
    key: fallback,
    candidates: hits,
    nearMatches,
    emit: `t("${fallback}")`,
    missing: [fallback],
  };
}

// ================================================================
// Columns
// ================================================================

function resolveColumn(alias) {
  // Aggregate prefixes (sum_/count_/avg_/min_/max_) — no namespace, suffix-only lookup.
  const aggMatch = alias.match(/^(sum|count|avg|min|max)_(.+)$/);
  if (aggMatch) return resolveAggregate(alias, aggMatch[1], aggMatch[2]);

  // Bare alias (no underscore).
  if (!alias.includes("_")) return resolveBare(alias);

  // Numbered category aliases: <base>Category_<suffix>_<N>.
  // Three-arg cellHeader form. Returns null if not a clean fit so we fall through to multi-token.
  const catMatch = alias.match(/^(\w+?)Category_(\w+)_(\d+)$/);
  if (catMatch) {
    const r = resolveNumberedCategory(alias, catMatch[1], catMatch[2], catMatch[3]);
    if (r) return r;
  }

  // Multi-token alias.
  return resolveMultiToken(alias);
}

// Aggregate column (sum_*/count_*/avg_*/min_*/max_*).
// Tries — in order:
//   1. Two-arg form when rest matches a namespace AND /@word/<aggregate> exists.
//      e.g. count_invoice → cellHeader(t("/fiscal/invoice"), t("/@word/count")).
//   2. /@word/<suffix> (snake form).
//   3. /@word/<camelCase(suffix)> when suffix has underscores.
//   4. /@word/<stripped> when suffix ends "List".
//   5. Area-scoped tail-search single-match.
//   6. Fallback.
function resolveAggregate(alias, aggregate, suffix) {
  const aggKey = `/@word/${aggregate}`;
  const aggExists = catalog[aggKey] !== undefined;

  // 1. Two-arg with namespace + aggregate word.
  if (aggExists) {
    const nsCandidates = findNamespaceCandidates(suffix);
    if (nsCandidates.length > 0) {
      const ns = pickBestNamespace(nsCandidates, suffix);
      return {
        resolved: true,
        resolution: "two-arg-aggregate",
        namespace: ns,
        namespaceValue: catalog[ns],
        suffix: aggKey,
        emit: `utils.cellHeader(t("${ns}"), t("${aggKey}"))`,
      };
    }
  }

  // 2. /@word/<suffix> (snake).
  const wkey = `/@word/${suffix}`;
  if (catalog[wkey] !== undefined) {
    return {
      resolved: true,
      resolution: "single-arg-suffix",
      suffix: wkey,
      value: catalog[wkey],
      emit: `utils.cellHeader(t("${wkey}"))`,
    };
  }

  // 3. /@word/<camelCase(suffix)> when suffix contains underscore.
  if (suffix.includes("_")) {
    const camel = snakeToCamel(suffix);
    const ck = `/@word/${camel}`;
    if (catalog[ck] !== undefined) {
      return {
        resolved: true,
        resolution: "single-arg-suffix-camel",
        suffix: ck,
        value: catalog[ck],
        emit: `utils.cellHeader(t("${ck}"))`,
      };
    }
  }

  // 4. Strip "List".
  if (suffix.endsWith("List")) {
    const k2 = `/@word/${suffix.slice(0, -4)}`;
    if (catalog[k2] !== undefined) {
      return {
        resolved: true,
        resolution: "single-arg-suffix-stripped-list",
        suffix: k2,
        value: catalog[k2],
        emit: `utils.cellHeader(t("${k2}"))`,
      };
    }
  }

  // 5. Area-scoped tail-search.
  const ts = areaScopedTailSearch(suffix);
  if (ts) {
    return {
      resolved: true,
      resolution: "single-arg-tail-search",
      key: ts,
      value: catalog[ts],
      emit: `utils.cellHeader(t("${ts}"))`,
    };
  }

  return columnFallback(alias);
}

// Numbered category alias: <base>Category_<suffix>_<N>.
// Emits 3-arg cellHeader: [<base>-namespace, .category<N> dotted key, /@word/<suffix>].
// Returns null when any of the three pieces cannot be verified — caller falls through.
function resolveNumberedCategory(alias, base, suffix, n) {
  // First arg: best namespace candidate for <base>, else /@word/<base>, else single-match
  // /@word/X where X (case-insensitive) ends with <base> — rescues renames like
  // `salesperson` → `/@word/personSalesperson`. Else null.
  let firstArg = null;
  const nsCandidates = findNamespaceCandidates(base);
  if (nsCandidates.length > 0) {
    firstArg = pickBestNamespace(nsCandidates, base);
  } else {
    const wbase = `/@word/${base}`;
    if (catalog[wbase] !== undefined) {
      firstArg = wbase;
    } else {
      const baseLower = base.toLowerCase();
      const wordKeys = keys.filter((k) =>
        k.startsWith("/@word/") && k.toLowerCase().endsWith(baseLower) && k !== `/@word/${base}`
      );
      if (wordKeys.length === 1) firstArg = wordKeys[0];
    }
  }
  if (!firstArg) return null;

  // Second arg: tail-search for `.category<N>` keys whose dotted-segment prefix
  // (the part before the first `.`) is a SUFFIX of <base> (case-insensitive).
  // Matches base==prefix (e.g. person → person.category1) and rename inheritance
  // (e.g. salesperson → person.category1, since "salesperson" ends with "person").
  const target = `.category${n}`;
  const hits = keys.filter((k) => k.endsWith(target));
  const baseLower = base.toLowerCase();
  const tight = hits.filter((k) => {
    const segs = k.split("/").filter(Boolean);
    const dot = segs.find((s) => s.includes("."));
    if (!dot) return false;
    const prefix = dot.split(".")[0].toLowerCase();
    return baseLower.endsWith(prefix);
  });
  if (tight.length !== 1) return null;
  const secondArg = tight[0];

  // Third arg: /@word/<suffix>.
  const thirdArg = `/@word/${suffix}`;
  if (catalog[thirdArg] === undefined) return null;

  return {
    resolved: true,
    resolution: "three-arg-numbered-category",
    namespace: firstArg,
    category: secondArg,
    suffix: thirdArg,
    emit: `utils.cellHeader(t("${firstArg}"), t("${secondArg}"), t("${thirdArg}"))`,
  };
}

function resolveBare(alias) {
  // 1. /@word/<alias>
  const wkey = `/@word/${alias}`;
  if (catalog[wkey] !== undefined) {
    return {
      resolved: true,
      resolution: "single-arg-suffix",
      suffix: wkey,
      value: catalog[wkey],
      emit: `utils.cellHeader(t("${wkey}"))`,
    };
  }
  // 2. /<area>/<entity>.<alias> direct.
  if (area && entity) {
    const dkey = `/${area}/${entity}.${alias}`;
    if (catalog[dkey] !== undefined) {
      return {
        resolved: true,
        resolution: "single-arg-area-entity-dotted",
        key: dkey,
        value: catalog[dkey],
        emit: `utils.cellHeader(t("${dkey}"))`,
      };
    }
  }
  // 3. Bare camelCase split into 2-arg cellHeader. Try every camelCase boundary.
  //    Emit only when EXACTLY ONE split has both halves verified in /@word/.
  //    e.g. salesCommissionBaseValue → "salesCommission" + "baseValue" (both verified).
  const splitResult = camelCaseSingleValidSplit(alias);
  if (splitResult) {
    return {
      resolved: true,
      resolution: "two-arg-camel-split",
      lhs: splitResult.lhsKey,
      rhs: splitResult.rhsKey,
      emit: `utils.cellHeader(t("${splitResult.lhsKey}"), t("${splitResult.rhsKey}"))`,
    };
  }
  // 4. Area-scoped tail-search single-match: keys ending in `.<alias>` within /<area>/.
  const ts = areaScopedTailSearch(alias);
  if (ts) {
    return {
      resolved: true,
      resolution: "single-arg-tail-search",
      key: ts,
      value: catalog[ts],
      emit: `utils.cellHeader(t("${ts}"))`,
    };
  }
  return columnFallback(alias);
}

// Try every camelCase boundary in `alias`. Return { lhsKey, rhsKey } when exactly one split has
// both /@word/<lhs> and /@word/<rhs> in the catalog. Otherwise null. Boundaries are positions
// where an uppercase letter follows a lowercase letter.
function camelCaseSingleValidSplit(alias) {
  const valid = [];
  for (let i = 1; i < alias.length; i++) {
    const c = alias.charCodeAt(i);
    const p = alias.charCodeAt(i - 1);
    const isUpper = c >= 65 && c <= 90;
    const prevLower = p >= 97 && p <= 122;
    if (!isUpper || !prevLower) continue;
    const lhs = alias.slice(0, i);
    const rhs = alias[i].toLowerCase() + alias.slice(i + 1);
    const lhsKey = `/@word/${lhs}`;
    const rhsKey = `/@word/${rhs}`;
    if (catalog[lhsKey] !== undefined && catalog[rhsKey] !== undefined) {
      valid.push({ lhsKey, rhsKey });
    }
  }
  return valid.length === 1 ? valid[0] : null;
}

function resolveMultiToken(alias) {
  const tokens = alias.split("_");
  const first = tokens[0];

  // 1. Properties-pattern shortcut (3+ tokens, second token === "properties").
  if (tokens.length >= 3 && tokens[1].toLowerCase() === "properties") {
    const dotted = findDottedKey(tokens);
    if (dotted.length > 0) {
      return {
        resolved: true,
        resolution: "single-arg-dotted",
        key: dotted[0],
        value: catalog[dotted[0]],
        emit: `utils.cellHeader(t("${dotted[0]}"))`,
        candidates: dotted.slice(0, 5),
      };
    }
  }

  // 2. Standard two-arg lookup: namespace + suffix.
  // Suffix candidates are produced by left-trimming tokens one at a time:
  //   tokens=[stock, quantity, regular, free] →
  //     i=1: "quantity_regular_free"
  //     i=2: "regular_free"
  //     i=3: "free"
  // Take the first /@word/<candidate> that exists.
  const nsCandidates = findNamespaceCandidates(first);
  let chosenSuffix = null;
  let suffixResolution = null;
  for (let i = 1; i < tokens.length; i++) {
    const s = tokens.slice(i).join("_");
    const k = `/@word/${s}`;
    if (catalog[k] !== undefined) {
      chosenSuffix = k;
      suffixResolution = i === 1 ? "full-rest" : i === tokens.length - 1 ? "last-token" : "left-trimmed";
      break;
    }
  }

  if (nsCandidates.length > 0 && chosenSuffix) {
    const ns = pickBestNamespace(nsCandidates, first);
    const result = {
      resolved: true,
      resolution: "two-arg",
      namespace: ns,
      namespaceValue: catalog[ns],
      namespaceCandidates: nsCandidates.slice(0, 5),
      suffix: chosenSuffix,
      suffixValue: catalog[chosenSuffix],
      emit: `utils.cellHeader(t("${ns}"), t("${chosenSuffix}"))`,
    };
    if (suffixResolution !== "full-rest") result.note = `suffix matched via ${suffixResolution}`;
    return result;
  }

  // 3. Dotted-key catchall (covers entity.property.subprop patterns not caught above).
  const dotted = findDottedKey(tokens);
  if (dotted.length > 0) {
    return {
      resolved: true,
      resolution: "single-arg-dotted",
      key: dotted[0],
      value: catalog[dotted[0]],
      emit: `utils.cellHeader(t("${dotted[0]}"))`,
      candidates: dotted.slice(0, 5),
    };
  }

  // 4. Namespace present, suffix missing → two-arg with /@unknown suffix (flagged missing).
  const restJoined = tokens.slice(1).join("_");
  if (nsCandidates.length > 0) {
    const ns = pickBestNamespace(nsCandidates, first);
    const unknownSuffix = `/@unknown/${restJoined}`;
    return {
      resolved: false,
      resolution: "two-arg-missing-suffix",
      namespace: ns,
      namespaceValue: catalog[ns],
      namespaceCandidates: nsCandidates.slice(0, 5),
      suffix: unknownSuffix,
      emit: `utils.cellHeader(t("${ns}"), t("${unknownSuffix}"))`,
      missing: [unknownSuffix],
      nearMatches: nearMatchesForWord(restJoined),
    };
  }

  // 5. Suffix present (caught above as `chosenSuffix`), namespace missing → single-arg.
  if (chosenSuffix) {
    return {
      resolved: true,
      resolution: "single-arg-suffix-no-namespace",
      suffix: chosenSuffix,
      value: catalog[chosenSuffix],
      emit: `utils.cellHeader(t("${chosenSuffix}"))`,
      missingNamespace: first,
      note: `no namespace key found for "${first}" — used suffix alone`,
    };
  }

  // 6. Area-scoped tail-search single-match on the full alias and its trims.
  const ts = areaScopedTailSearch(alias);
  if (ts) {
    return {
      resolved: true,
      resolution: "single-arg-tail-search",
      key: ts,
      value: catalog[ts],
      emit: `utils.cellHeader(t("${ts}"))`,
    };
  }

  return columnFallback(alias);
}

function columnFallback(alias) {
  const key = `/@unknown/${alias}`;
  return {
    resolved: false,
    resolution: "fallback-unknown",
    suffix: key,
    emit: `utils.cellHeader(t("${key}"))`,
    missing: [key],
    nearMatches: nearMatchesForWord(alias),
  };
}

// ================================================================
// Namespace + dotted-key scans (shared)
// ================================================================

function findNamespaceCandidates(prefix) {
  const hits = [];
  for (const k of keys) {
    if (k.startsWith("/@")) continue;
    if (k.endsWith("/plural")) continue;
    if (k.includes("/report/")) continue;
    if (k.includes("/tag/")) continue;
    const segs = k.split("/").filter(Boolean);
    if (segs.length === 0) continue;
    if (segs.some((s) => s.includes("."))) continue;
    if (segs.some((s) => /^args[A-Z]/.test(s))) continue;
    const last = segs[segs.length - 1];
    if (last === prefix) hits.push(k);
  }
  return hits;
}

function pickBestNamespace(candidates, prefix) {
  return candidates
    .slice()
    .sort((a, b) => scoreNamespace(b, prefix) - scoreNamespace(a, prefix))[0];
}

function scoreNamespace(k, prefix) {
  const segs = k.split("/").filter(Boolean);
  let score = 100;
  score -= segs.length * 5;
  if (segs.length === 3 && segs[1] === prefix && segs[2] === prefix) score += 40;
  if (segs.length === 2 && segs[1] === prefix) score += 25;
  if (segs[0] === "catalog") score += 10;
  return score;
}

function findDottedKey(tokens) {
  if (tokens.length < 2) return [];
  const hits = [];
  const firstLower = tokens[0].toLowerCase();
  const restLower = tokens.slice(1).map((t) => t.toLowerCase());
  for (const k of keys) {
    if (!k.includes(".")) continue;
    const segs = k.split("/").filter(Boolean);
    const dotSeg = segs.find((s) => s.includes("."));
    if (!dotSeg) continue;
    const dotSegLower = dotSeg.toLowerCase();
    if (!dotSegLower.startsWith(firstLower + ".")) continue;
    let pos = firstLower.length + 1;
    let allMatch = true;
    for (const tok of restLower) {
      const idx = dotSegLower.indexOf(tok, pos);
      if (idx === -1) {
        allMatch = false;
        break;
      }
      pos = idx + tok.length;
    }
    if (allMatch) hits.push(k);
  }
  hits.sort((a, b) => a.length - b.length);
  return hits;
}

// ================================================================
// Area-scoped tail-search
// ================================================================
//
// Find catalog keys ending in `.<word>` (or `/<word>`) restricted to /<area>/.
// Return single-match key or null. Two or more matches → ambiguous → null.
// Zero matches → null.

function areaScopedTailSearch(word) {
  if (!areaPrefix || !word) return null;
  const dotTail = `.${word}`;
  const slashTail = `/${word}`;
  const hits = [];
  for (const k of keys) {
    if (!k.startsWith(areaPrefix)) continue;
    if (k.endsWith(dotTail) || k.endsWith(slashTail)) hits.push(k);
  }
  return hits.length === 1 ? hits[0] : null;
}

function nearMatchesForWord(word) {
  if (!word) return [];
  const dotTail = `.${word}`;
  const slashTail = `/${word}`;
  const hits = [];
  for (const k of keys) {
    if (k.endsWith(dotTail) || k.endsWith(slashTail)) hits.push(k);
  }
  return hits.slice(0, 10);
}

// ================================================================
// Parameter resolution
// ================================================================

function resolveParam(name) {
  // Date params: _START / _END
  if (/_START$|_END$/.test(name)) {
    return resolveWordParam(name, "date");
  }

  // Numbered category params: <ENTITY>_CATEGORY_IDS_<N>
  const catN = name.match(/^(.+?)_CATEGORY_IDS_(\d+)$/);
  if (catN) {
    const entCamel = snakeToCamel(catN[1]);
    const n = catN[2];
    // Tail-search: keys ending `.category<n>` whose dotted segment starts with `<entCamel>.`.
    const target = `.category${n}`;
    const hits = keys.filter((k) => k.endsWith(target));
    const tight = hits.filter((k) => {
      const segs = k.split("/").filter(Boolean);
      const dot = segs.find((s) => s.includes("."));
      return dot && dot.toLowerCase().startsWith(entCamel.toLowerCase() + ".");
    });
    if (tight.length === 1) {
      return {
        resolved: true,
        type: "ids-numbered-category",
        labelKey: tight[0],
        value: catalog[tight[0]],
        emit: `t("${tight[0]}")`,
        resolution: "tail-search-single",
      };
    }
    // Fall through to generic _IDS handling if no unique match.
  }

  // _IDS (incl. numbered _IDS_N variants not handled above)
  const idsMatch = name.match(/^(.+?)_IDS(?:_\d+)?$/);
  if (idsMatch) {
    const ent = snakeToCamel(idsMatch[1]);
    const pluralCandidates = findPluralKey(ent);
    if (pluralCandidates.length > 0) {
      const key = pluralCandidates[0];
      return {
        resolved: true,
        type: "ids",
        labelKey: key,
        value: catalog[key],
        emit: `t("${key}")`,
        candidates: pluralCandidates,
      };
    }
    const nsCandidates = findNamespaceCandidates(ent);
    if (nsCandidates.length > 0) {
      const ns = pickBestNamespace(nsCandidates, ent);
      return {
        resolved: true,
        type: "ids",
        labelKey: ns,
        value: catalog[ns],
        emit: `t("${ns}")`,
        note: "singular used (no /plural variant)",
        candidates: nsCandidates.slice(0, 5),
      };
    }
    const wordKey = `/@word/${ent}`;
    if (catalog[wordKey] !== undefined) {
      return {
        resolved: true,
        type: "ids",
        labelKey: wordKey,
        value: catalog[wordKey],
        emit: `t("${wordKey}")`,
        note: "/@word/ fallback",
      };
    }
    // Area-scoped tail-search for the entity word.
    const ts = areaScopedTailSearch(ent);
    if (ts) {
      return {
        resolved: true,
        type: "ids",
        labelKey: ts,
        value: catalog[ts],
        emit: `t("${ts}")`,
        resolution: "tail-search-single",
      };
    }
    const unknownKey = `/@unknown/${ent}`;
    return {
      resolved: false,
      type: "ids",
      labelKey: unknownKey,
      emit: `t("${unknownKey}")`,
      missing: [unknownKey],
      nearMatches: nearMatchesForWord(ent),
    };
  }

  // _LIST
  if (/_LIST$/.test(name)) {
    const camel = snakeToCamel(name);
    const key1 = `/@word/${camel}`;
    if (catalog[key1] !== undefined) {
      return { resolved: true, type: "list", labelKey: key1, value: catalog[key1], emit: `t("${key1}")` };
    }
    const stripped = camel.replace(/List$/, "");
    const key2 = `/@word/${stripped}`;
    if (catalog[key2] !== undefined) {
      return {
        resolved: true,
        type: "list",
        labelKey: key2,
        value: catalog[key2],
        emit: `t("${key2}")`,
        note: "stripped List suffix",
      };
    }
    // Area-direct on stripped form: /<area>/<stripped>
    if (area) {
      const k3 = `/${area}/${stripped}`;
      if (catalog[k3] !== undefined) {
        return {
          resolved: true,
          type: "list",
          labelKey: k3,
          value: catalog[k3],
          emit: `t("${k3}")`,
          resolution: "area-direct",
        };
      }
    }
    const ts = areaScopedTailSearch(stripped);
    if (ts) {
      return {
        resolved: true,
        type: "list",
        labelKey: ts,
        value: catalog[ts],
        emit: `t("${ts}")`,
        resolution: "tail-search-single",
      };
    }
    const unknownKey = `/@unknown/${camel}`;
    return {
      resolved: false,
      type: "list",
      labelKey: unknownKey,
      emit: `t("${unknownKey}")`,
      missing: [unknownKey],
      nearMatches: nearMatchesForWord(stripped),
    };
  }

  // Other (bare CAPS_PARAM, single-value)
  return resolveWordParam(name, "other");
}

function resolveWordParam(name, type) {
  const camel = snakeToCamel(name);
  // 1. /<area>/<camel> direct.
  if (area) {
    const k = `/${area}/${camel}`;
    if (catalog[k] !== undefined) {
      return {
        resolved: true,
        type,
        labelKey: k,
        value: catalog[k],
        emit: `t("${k}")`,
        resolution: "area-direct",
      };
    }
  }
  // 2. /@word/<camel>.
  const wkey = `/@word/${camel}`;
  if (catalog[wkey] !== undefined) {
    return { resolved: true, type, labelKey: wkey, value: catalog[wkey], emit: `t("${wkey}")` };
  }
  // 3. Area-scoped tail-search for the camelCase form.
  const ts = areaScopedTailSearch(camel);
  if (ts) {
    return {
      resolved: true,
      type,
      labelKey: ts,
      value: catalog[ts],
      emit: `t("${ts}")`,
      resolution: "tail-search-single",
    };
  }
  const unknownKey = `/@unknown/${camel}`;
  return {
    resolved: false,
    type,
    labelKey: unknownKey,
    emit: `t("${unknownKey}")`,
    missing: [unknownKey],
    nearMatches: nearMatchesForWord(camel),
  };
}

function findPluralKey(ent) {
  const hits = [];
  for (const k of keys) {
    if (!k.endsWith("/plural")) continue;
    const segs = k.split("/").filter(Boolean);
    if (segs.length >= 2 && segs[segs.length - 2] === ent) hits.push(k);
  }
  hits.sort((a, b) => a.length - b.length);
  return hits;
}

function snakeToCamel(s) {
  const lower = s.toLowerCase();
  return lower.replace(/_([a-z0-9])/g, (_m, c) => c.toUpperCase());
}
