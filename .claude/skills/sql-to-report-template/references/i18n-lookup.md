# i18n key lookup

Every i18n key resolution — title, column headers, parameter labels — is delegated to the shipped Node script `assets/lookup-i18n.mjs`. This file documents the script's algorithm and output contract. You don't hand-grep the catalog; you pass aliases in, read emit strings out.

## Determinism guarantee

The resolver only emits a fully-qualified key (`/<area>/<...>` or `/@word/<...>`) when `catalog[key] !== undefined` against the fetched catalog. Every unverified candidate falls back to `/@unknown/<segment>`. Wrong i18n keys are never emitted. This is the single hardest rule in the resolver — every code path either verifies before returning, or explicitly marks `resolved: false`.

## Catalog source

Authoritative catalog is hosted at:
- `https://zenerp.app.br/resources.en-US.json` (~5800 keys, en-US values)
- `https://zenerp.app.br/resources.pt-BR.json` (same keyset, pt-BR values)

Fetch en-US once per skill run via Bash:

```bash
mkdir -p /tmp/zen-i18n
curl -fsS -o /tmp/zen-i18n/resources.en-US.json "https://zenerp.app.br/resources.en-US.json"
```

If the fetch fails, abort the run and tell the user. No offline fallback. Do not re-download mid-run — the catalog doesn't drift within one generation.

## Running the resolver

Single call per run. Produces title + columns + params resolution in one pass.

```bash
node .claude/skills/sql-to-report-template/assets/lookup-i18n.mjs \
  /tmp/zen-i18n/resources.en-US.json \
  /tmp/lookup-input.json > /tmp/lookup-output.json
```

Input (write to `/tmp/lookup-input.json`):

```json
{
  "title":   "<report-name>",
  "area":    "material",
  "entity":  "inventoryManagementItem",
  "columns": ["<alias1>", "<alias2>", ...],
  "params":  ["<PARAM1>", "<PARAM2>", ...]
}
```

- **Aliases** — exact strings after `AS "..."` in the SQL.
- **Params** — bind names (minus `SHOW_*`).
- **Title** — output folder name (inferred per SKILL.md).
- **Area** (optional) — top-level i18n namespace, derived from the FROM table's module prefix via the SKILL.md mapping table. Slash-allowed (e.g. `supply/purchase`). Omit when the prefix is unmapped.
- **Entity** (optional) — lowerCamelCase of FROM table minus module prefix (`MAT_INVENTORY_MANAGEMENT_ITEM` → `inventoryManagementItem`).

When `area` and/or `entity` are omitted, the resolver falls back to non-area paths only — never invents an area.

## Output contract

Each entry carries an `emit` string — paste it verbatim into the JSX:

- `result.title.emit` → `<h1>{<emit>}</h1>` content (after stripping the outer `t(...)` wrapper if needed, or just use as-is since it's already `t("...")`).
- `result.columns.<alias>.emit` → the column's `header:` value.
- `result.params.<NAME>.emit` → the `<dt>{<emit>}</dt>` content.

`result.summary.missingList` → drop straight into the "Reporting back" missing-keys section. Each entry carries a `nearMatches` array of catalog-verified suggestions to surface to the user (suggestions only — never auto-substitute).

## How the resolver resolves

### Titles

Tried in order. First catalog hit wins.

1. **Area-direct**: `/<area>/report/<name>` (only when `area` is provided).
2. **Tail-search single-match**: catalog keys ending in `/report/<name>`, filtered to `/<area>/` when known. **Returns only when exactly one match exists.** Two or more matches → ambiguous → fallback. Zero → fallback.
3. **Fallback**: `/@unknown/report/<name>` (resolved=false). `nearMatches` lists any-area `/report/<name>` keys for the user to consider.

### Columns

The resolver branches on alias shape:

#### Aggregate prefixes (`sum_`, `count_`, `avg_`, `min_`, `max_`)

Tried in order — first catalog hit wins:

1. **Two-arg with namespace + aggregate word.** When `<rest>` matches a namespace candidate AND `/@word/<aggregate>` (e.g. `/@word/count`, `/@word/sum`) exists, emit `cellHeader(t("<namespace>"), t("/@word/<aggregate>"))`. Example: `count_invoice` → `cellHeader(t("/fiscal/invoice"), t("/@word/count"))`.
2. `/@word/<rest>` (snake form). Example: `sum_quantity` → `cellHeader(t("/@word/quantity"))`.
3. `/@word/<camelCase(rest)>` when `<rest>` contains underscore. Example: `sum_quantity_units` → `cellHeader(t("/@word/quantityUnits"))`.
4. `/@word/<stripped>` when `<rest>` ends in `List`.
5. Area-scoped tail-search single-match on `<rest>`.
6. Fallback `/@unknown/<alias>`.

#### Bare alias (no underscore)

1. `/@word/<alias>`.
2. `/<area>/<entity>.<alias>` (only when area + entity given).
3. **CamelCase single-valid-split into 2-arg.** Try every camelCase boundary (uppercase letter preceded by lowercase). For each split `<lhs>|<rhs>`, check both `/@word/<lhs>` and `/@word/<rhsCamel>` exist. **Only emit when EXACTLY ONE split is valid.** Example: `salesCommissionBaseValue` → `cellHeader(t("/@word/salesCommission"), t("/@word/baseValue"))` (only valid split). 0 or 2+ valid splits → fallback to next step.
4. **Area-scoped tail-search single-match**: catalog keys ending in `.<alias>` (or `/<alias>`) within `/<area>/`. Single match → use. 0 or 2+ → skip.
5. Fallback `/@unknown/<alias>`.

#### Numbered category alias (`<base>Category_<suffix>_<N>`)

Tried before multi-token. Emits 3-arg `cellHeader(<entityNamespace>, <dottedCategoryKey>, <suffixWord>)`. All three pieces must verify.

1. **First arg** — pick in order:
   - Best namespace candidate where last segment equals `<base>` (e.g. `person` → `/catalog/person/person`).
   - Else `/@word/<base>` if present.
   - Else **catalog rename rescue**: single `/@word/X` where `X.toLowerCase().endsWith(<base>.toLowerCase())` and `X !== <base>`. Example: `salesperson` → `/@word/personSalesperson` (only catalog `/@word/*` ending in `salesperson`). 0 or 2+ matches → fallback.

2. **Second arg** — tail-search for keys ending `.category<N>`. Filter to those whose dotted-segment prefix (text before the first `.`) is a SUFFIX of `<base>` (case-insensitive). Single match → use; otherwise fallback. This handles both exact `personCategory_id_1` → `person.category1` and rename inheritance `salespersonCategory_id_1` → `person.category1` (because `salesperson` ends with `person`).

3. **Third arg** — `/@word/<suffix>` (must exist).

If any piece is unverified, returns null and the alias falls through to multi-token resolution.

#### Multi-token alias (`<first>_<rest>`)

1. **Properties shortcut**: if 3+ tokens and second token is `properties`, dotted-key match (e.g. `product_properties_br_NCM` → `/catalog/product.properties.fiscal_br_NCM`).
2. **Two-arg with left-trim suffix**: namespace candidates from the first token (filtered: no `/@*`, no `/plural`, no `/report/`, no `/tag/`, no dotted segments, no `args*`). Suffix candidates produced by **left-trimming tokens one at a time**:
   - tokens=[stock, quantity, regular, free] →
     - i=1: `/@word/quantity_regular_free`
     - i=2: `/@word/regular_free`
     - i=3: `/@word/free`
   - First catalog hit wins. Pair with the best-scored namespace candidate.
3. **Dotted-key catchall** (entity.property.subprop patterns).
4. **Namespace present, suffix missing** → emit `cellHeader(<ns>, /@unknown/<rest>)` flagged missing.
5. **Suffix present, namespace missing** → emit single-arg `cellHeader(/@word/<rest>)`.
6. **Area-scoped tail-search single-match** on the full alias before fallback.
7. Fallback `/@unknown/<alias>`.

The left-trim step is the deterministic fix for composite aliases like `stock_quantity_external` (resolves to `cellHeader(t("/material/stock"), t("/@word/external"))` because `/@word/quantity_external` is missing but `/@word/external` exists).

### Parameters

Tried in order. First catalog hit wins.

#### `_START` / `_END` (date)

`/<area>/<camel>` → `/@word/<camel>` → area-scoped tail-search single-match → `/@unknown/<camel>`.

#### `<ENTITY>_CATEGORY_IDS_<N>` (numbered category)

Tail-search: catalog keys ending in `.category<N>` whose dotted segment starts with `<entityCamel>.`. Single match → use.

Example: `PRODUCT_CATEGORY_IDS_1` → look for `.category1` keys with dotted segment starting `product.` → `/catalog/product/product.category1` (single match) → resolves.

When 0 or 2+ tight matches, fall through to generic `_IDS` handling.

#### `_IDS` (entity selector, including unnumbered or non-tight numbered)

1. Plural lookup: `.../<entityCamel>/plural`.
2. Singular namespace lookup: best-scored `<entityCamel>` namespace candidate.
3. `/@word/<entityCamel>`.
4. Area-scoped tail-search single-match on `<entityCamel>`.
5. `/@unknown/<entityCamel>`.

#### `_LIST`

1. `/@word/<camel>`.
2. `/@word/<stripped>` (drop `List` suffix).
3. `/<area>/<stripped>` direct.
4. Area-scoped tail-search single-match on `<stripped>`.
5. `/@unknown/<camel>`.

#### Other (bare CAPS_PARAM)

1. `/<area>/<camel>` direct.
2. `/@word/<camel>`.
3. Area-scoped tail-search single-match on `<camel>`.
4. `/@unknown/<camel>`.

### The `/@unknown/` convention

When a key cannot be resolved against the catalog, the resolver emits `/@unknown/<segment>` instead of `/@word/<segment>`. This makes unresolved keys stand out at render time (they render as the raw path since `/@unknown/*` is in no locale) and gives the user a single grep pattern: `rg "/@unknown/"`.

Rules:
- `/<area>/<...>` and `/@word/<...>` are emitted **only when verified** in the catalog.
- `/@unknown/<...>` is emitted for every miss — positive signal of "needs translation or manual edit".

### Area-scoped tail-search single-match (the deterministic rescue)

Used as the last verified candidate before `/@unknown/` in nearly every resolver path. Algorithm:

1. Filter catalog keys to those starting with `/<area>/`.
2. Of those, keep the ones ending in `.<word>` or `/<word>`.
3. **If exactly one match** → emit it. Otherwise (0 or 2+) → skip.

This rescues domain renames (DB table is `MAT_INVENTORY_MANAGEMENT_ITEM` but catalog uses `stockManagementItem`) without ever guessing: the single-match constraint guarantees no ambiguity, and the area filter prevents cross-domain accidents (e.g. `/finance/account.minimumStock` won't be picked when area is `material`).

## Scoring (namespace ties)

When multiple keys match a prefix, the resolver scores:
- +40 for entity-doubled pattern (`/catalog/person/person`)
- +25 for `/<area>/<entity>` (`/fiscal/invoice`)
- +10 for `/catalog/*` family
- −5 per path segment (shorter is better)

This matches Zen convention: entity-doubled forms are canonical for column headers, direct `/<area>/<entity>` for namespace headers.

## Near-match suggestions

Every fallback entry (`resolved: false`) carries a `nearMatches` array — keys ending in the same word across the full catalog (not area-restricted). This helps the user see candidates worth considering. Surface in the missing-keys report as suggestions only. Never auto-substitute.

## What the resolver does NOT handle

- **Custom display logic** for JSONB object columns (`*_properties`): see `references/field-mapping.md` for the cell-stringify rule.
- **Monetary vs numeric sums**: resolver only handles the header. `formatNumber` vs `formatCurrency` cell/footer comes from `field-mapping.md`.
- **Numeric inference for measurement aliases** (`minimumStock`, `replenishmentBatch`, etc.): resolver returns the header key, but does NOT infer numeric formatting. Those columns emit as plain text unless the alias matches an explicit token rule from `field-mapping.md`. The user adds `className: "number"` + `formatNumber` cell on review when warranted.
- **Domain renames where no rescue path applies**: e.g. `INVENTORY_MANAGEMENT` param resolving to `/material/stockManagement` — neither area-direct nor tail-search finds the rename. Falls back to `/@unknown/inventoryManagement`. The user supplies the correct key on review.

## Troubleshooting

Script exits non-zero → check:
- Catalog path exists and is valid JSON (`node -e "JSON.parse(require('fs').readFileSync(process.argv[1]))"`).
- Input JSON path is readable and well-formed.

Output missing expected keys → inspect the entry:
- `resolution` field tells you which path matched (e.g. `area-direct`, `tail-search-single`, `two-arg`).
- `candidates` (when present) shows the top picks the resolver considered.
- For unresolved entries, `nearMatches` shows what existed in the catalog with a similar tail — review for renames or schema drift.
