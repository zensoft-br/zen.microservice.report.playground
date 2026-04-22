#!/usr/bin/env node
// lookup-i18n.mjs — fuzzy i18n key resolver for sql-to-report-template skill.
//
// Usage:
//   node lookup-i18n.mjs <catalog-path> <input-json-path>
//
// Input JSON shape:
//   {
//     "title":   "<reportName>",                // optional
//     "columns": ["id", "company_fantasyName", "product_properties_br_NCM", ...],
//     "params":  ["DATE_START", "COMPANY_IDS", "STATUS_LIST", ...]
//   }
//
// Output JSON shape (to stdout):
//   {
//     "title":   { resolved, key, candidates[], emit, missing[] },
//     "columns": { "<alias>": { resolved, resolution, namespace?, suffix?, key?, emit, candidates?, missing[] } },
//     "params":  { "<NAME>": { resolved, type, labelKey, emit, missing[], note? } },
//     "summary": { total, resolved, missing, missingList: [{kind, name/alias, attempted}] }
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

const out = {
  title: null,
  columns: {},
  params: {},
  summary: { total: 0, resolved: 0, missing: 0, missingList: [] },
};

// ---- title ----
if (input.title) {
  out.title = resolveTitle(input.title);
  out.summary.total++;
  if (out.title.resolved) out.summary.resolved++;
  else {
    out.summary.missing++;
    out.summary.missingList.push({ kind: "title", name: input.title, attempted: out.title.key });
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
    });
  }
}

process.stdout.write(JSON.stringify(out, null, 2) + "\n");

// ================================================================
// Resolvers
// ================================================================

function resolveTitle(name) {
  const target = `/report/${name}`;
  const hits = keys.filter((k) => k.endsWith(target));
  if (hits.length > 0) {
    const key = hits[0];
    return {
      resolved: true,
      key,
      value: catalog[key],
      candidates: hits,
      multiple: hits.length > 1,
      emit: `t("${key}")`,
    };
  }
  const key = `/@unknown/report/${name}`;
  return { resolved: false, key, candidates: [], emit: `t("${key}")`, missing: [key] };
}

function resolveColumn(alias) {
  // Aggregate prefixes (sum_/count_/avg_/min_/max_) → no namespace
  const aggMatch = alias.match(/^(sum|count|avg|min|max)_(.+)$/);
  if (aggMatch) return resolveSuffixOnly(alias, aggMatch[2]);

  // Bare alias (no underscore)
  if (!alias.includes("_")) return resolveSuffixOnly(alias, alias);

  // Multi-token alias
  return resolveMultiToken(alias);
}

function resolveSuffixOnly(alias, suffix) {
  const key = `/@word/${suffix}`;
  if (catalog[key] !== undefined) {
    return {
      resolved: true,
      resolution: "single-arg-suffix",
      suffix: key,
      value: catalog[key],
      emit: `utils.cellHeader(t("${key}"))`,
    };
  }
  // Strip "List"
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
  return columnFallback(alias);
}

function resolveMultiToken(alias) {
  const tokens = alias.split("_");
  const first = tokens[0];
  const rest = tokens.slice(1).join("_");
  const lastToken = tokens[tokens.length - 1];

  const nsCandidates = findNamespaceCandidates(first);
  const suffixKey = `/@word/${rest}`;
  const suffixHit = catalog[suffixKey] !== undefined;
  const lastKey = `/@word/${lastToken}`;
  const lastHit = tokens.length > 2 && catalog[lastKey] !== undefined;

  // 1. Properties-pattern shortcut: 3+ tokens with "properties" as 2nd token.
  //    Matches /catalog/product.properties.fiscal_br_NCM shape BEFORE namespace.
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

  // 2. Standard two-arg lookup (namespace + suffix) — the common case.
  if (nsCandidates.length > 0 && (suffixHit || lastHit)) {
    const ns = pickBestNamespace(nsCandidates, first);
    const chosenSuffix = suffixHit ? suffixKey : lastKey;
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
    if (lastHit && !suffixHit) result.note = `fell back to last-token /@word/${lastToken}`;
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
  if (nsCandidates.length > 0) {
    const ns = pickBestNamespace(nsCandidates, first);
    const unknownSuffix = `/@unknown/${rest}`;
    return {
      resolved: false,
      resolution: "two-arg-missing-suffix",
      namespace: ns,
      namespaceValue: catalog[ns],
      namespaceCandidates: nsCandidates.slice(0, 5),
      suffix: unknownSuffix,
      emit: `utils.cellHeader(t("${ns}"), t("${unknownSuffix}"))`,
      missing: [unknownSuffix],
    };
  }

  // 5. Suffix present, namespace missing → single-arg.
  if (suffixHit) {
    return {
      resolved: true,
      resolution: "single-arg-suffix-no-namespace",
      suffix: suffixKey,
      value: catalog[suffixKey],
      emit: `utils.cellHeader(t("${suffixKey}"))`,
      missingNamespace: first,
      note: `no namespace key found for "${first}" — used suffix alone`,
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
  };
}

// ---- namespace scan ----
// Returns keys whose last path segment equals prefix (case-sensitive),
// filtered to entity-namespace shapes only. Rejects /@*, /plural, /report/*,
// /tag/*, dotted segments, arg-descriptor segments.
function findNamespaceCandidates(prefix) {
  const hits = [];
  for (const k of keys) {
    if (k.startsWith("/@")) continue; // /@word/*, /@error/*, /@meta/*
    if (k.endsWith("/plural")) continue;
    if (k.includes("/report/")) continue;
    if (k.includes("/tag/")) continue;
    const segs = k.split("/").filter(Boolean);
    if (segs.length === 0) continue;
    if (segs.some((s) => s.includes("."))) continue; // dotted paths handled elsewhere
    if (segs.some((s) => /^args[A-Z]/.test(s))) continue; // arg descriptors
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
  // Penalize depth (shorter paths preferred)
  score -= segs.length * 5;
  // Entity-doubled bonus: /catalog/company/company — conventional for column headers
  if (segs.length === 3 && segs[1] === prefix && segs[2] === prefix) score += 40;
  // Short /<area>/<entity> form: /fiscal/invoice
  if (segs.length === 2 && segs[1] === prefix) score += 25;
  // /catalog/* family bonus
  if (segs[0] === "catalog") score += 10;
  return score;
}

// ---- dotted-key scan ----
// For aliases like product_properties_br_NCM: find keys where the dotted segment
// STARTS with `<first_token>.` and remaining tokens appear in order within it.
// Scoped match prevents matching spurious keys like /fiscal/argsOutgoingInvoice.addressId
// for alias `invoice_id`.
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
    // Dotted segment must start with `<first_token>.`
    if (!dotSegLower.startsWith(firstLower + ".")) continue;
    // Remaining tokens must appear in order within the dotted segment.
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
// Parameter resolution
// ================================================================

function resolveParam(name) {
  // Date params: _START / _END
  if (/_START$|_END$/.test(name)) {
    return resolveWordParam(name, "date");
  }
  // _IDS (incl. numbered variants like PERSON_CATEGORY_IDS_1..5)
  const idsMatch = name.match(/^(.+?)_IDS(?:_\d+)?$/);
  if (idsMatch) {
    const entity = snakeToCamel(idsMatch[1]);
    const pluralCandidates = findPluralKey(entity);
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
    // Fallback: singular namespace for the entity
    const nsCandidates = findNamespaceCandidates(entity);
    if (nsCandidates.length > 0) {
      const ns = pickBestNamespace(nsCandidates, entity);
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
    // Last-ditch: /@word/<entity>
    const wordKey = `/@word/${entity}`;
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
    const unknownKey = `/@unknown/${entity}`;
    return { resolved: false, type: "ids", labelKey: unknownKey, emit: `t("${unknownKey}")`, missing: [unknownKey] };
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
    const unknownKey = `/@unknown/${camel}`;
    return { resolved: false, type: "list", labelKey: unknownKey, emit: `t("${unknownKey}")`, missing: [unknownKey] };
  }
  // Other
  return resolveWordParam(name, "other");
}

function resolveWordParam(name, type) {
  const camel = snakeToCamel(name);
  const key = `/@word/${camel}`;
  if (catalog[key] !== undefined) {
    return { resolved: true, type, labelKey: key, value: catalog[key], emit: `t("${key}")` };
  }
  const unknownKey = `/@unknown/${camel}`;
  return { resolved: false, type, labelKey: unknownKey, emit: `t("${unknownKey}")`, missing: [unknownKey] };
}

function findPluralKey(entity) {
  const hits = [];
  for (const k of keys) {
    if (!k.endsWith("/plural")) continue;
    const segs = k.split("/").filter(Boolean);
    // /.../<entity>/plural
    if (segs.length >= 2 && segs[segs.length - 2] === entity) hits.push(k);
  }
  hits.sort((a, b) => a.length - b.length);
  return hits;
}

function snakeToCamel(s) {
  const lower = s.toLowerCase();
  return lower.replace(/_([a-z0-9])/g, (_m, c) => c.toUpperCase());
}
