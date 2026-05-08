---
name: sql-to-report-template
description: Generate a Zen ERP report template (index.jsx + template.json) from a SQL query and a sample data.json. Use when the user provides a .sql file (often alongside a data.json) and asks to scaffold, create, or generate a report template / JSX report / report skeleton for it. Also use when the user says "create a template from this SQL", "generate index.jsx for this query", or points at a SQL file in Downloads or elsewhere and asks for a report. The skill parses the SELECT aliases, skips internal SHOW_* control fields, maps every remaining field to the correct column definition (width, className, cell formatter, footer aggregator, i18n header namespace) and emits a complete index.jsx plus template.json that slots into playground/<area>/report/<name>/.
---

# sql-to-report-template

Scaffold a Zen ERP JSX report (template.json + index.jsx + meta.json + optional data.json) from a SQL query plus a sample data.json. Authoritative tables live in references — read them during the run:

- `references/engine-spec.md` — engine conventions (sandboxing, formatters, classNames).
- `references/field-mapping.md` — alias → column shape (width / className / cell / footer).
- `references/i18n-lookup.md` — resolver algorithm.
- `references/parameter-rendering.md` — `<dl>` rules for the parameters block.
- `references/reference-example.md` — full worked example.

## Determinism principle (load-bearing)

Every i18n key emitted by index.jsx must exist in the fetched catalog `/tmp/zen-i18n/resources.en-US.json`. When a candidate cannot be verified, fall back to `/@unknown/<segment>` — never guess a path. Wrong keys render as silent mistranslations; `/@unknown/` is grep-discoverable and surfaces in the missing-keys report. The resolver enforces this — it only returns `resolved: true` when `catalog[key] !== undefined`.

Same principle for column shape: numeric formatting, footer aggregators, and class names emit only when the alias matches an explicit token rule from `references/field-mapping.md`. Ambiguous aliases (`minimumStock`, `replenishmentBatch`, etc.) emit as plain text — the user adds `className: "number"` + `formatNumber` cell on review when warranted.

## Inputs

1. **SQL file** (required) — aliased SELECT (`AS "fieldName"`) plus bind params (`:PARAM_NAME`).
2. **data.json** (optional but preferred) — used to spot-check alias coverage.
3. **Output folder** (optional, see below).

## Output folder

Default `playground/ai/<name>/`. Pick `<name>` in this order:

1. **From main FROM table.** Strip `PS_ERP.` schema and module prefix (`MAT_`/`FIS_`/etc.), lowerCamelCase the rest. `MAT_INVENTORY_MANAGEMENT_ITEM` → `inventoryManagementItem`. Prefer this over filename — filenames are often generic. **DB↔app name drift is normal** (e.g. DB `inventoryManagementItem` ↔ catalog `stockManagementItem`). Folder name stays DB-derived; the user renames after seeing the output. Never rename via heuristics.
2. **From SQL filename** (without `.sql`) when descriptive — anything NOT in `template`/`query`/`sql[N]`/`sample`/`test[N]`/`report`/`data`/`tmp`/`temp`.
3. **Fallback** to today's date `YYYY-MM-DD`. Suffix `-HHmm` on collision.

**Collision rule:** if the chosen folder already has a `template.json`, append `-2`, `-3`, … — never overwrite without explicit permission.

**Reserved namespace:** `playground/ai/` is for AI output only. Do not write into `playground/zen/...` or any other hand-maintained folder unless the user explicitly asks.

**Explicit user-named folder wins** — skip inference.

## Module-prefix → area mapping (for i18n)

Drives every area-scoped resolver lookup (titles, dotted entity keys, parameter labels):

| Prefix | Area              | | Prefix | Area          |
|--------|-------------------|-|--------|---------------|
| `MAT_` | `material`        | | `FIN_` | `finance`     |
| `CAT_` | `catalog`         | | `INT_` | `integration` |
| `FIS_` | `fiscal`          | | `SEC_` | `security`    |
| `SAL_` | `sale`            | | `AUD_` | `audit`       |
| `PUR_` | `supply/purchase` | | `BIL_` | `billing`     |
| `PRD_` | `supply/production` | | `RPT_` | `report`    |

Unmapped prefix → omit `area` from resolver input. **Never invent area names.**

**Entity** = lowerCamelCase of FROM table minus module prefix (same value as the folder name).

## What to produce

```
<output>/
  template.json    # verbatim copy of assets/template.json
  index.jsx        # generated React component
  meta.json        # assets/meta.json.skeleton + extracted params + curated columns
  data.json        # ONLY when user supplied a sample (verbatim copy)
```

Do NOT create styles.css, styles.scss, or build.json. The playground watcher handles build.json; styles come from the global `playground/styles.css`.

## Performance contract

Target: ~10-20 tool calls, <2 minutes, 30-150 column SQL.

- **No ad-hoc helper scripts.** Pattern-match `AS "name"` inline with Grep/Read.
- **One catalog fetch + one resolver invocation** per run.
- **No repeated file reads.** Read SKILL.md + references + assets once, then operate from memory.

Budget: 1 curl + 1 node call + ~3 reads + ~4 writes. Everything else is reasoning.

## Core workflow

0. **Fetch the live i18n catalog** before anything else:

   ```bash
   mkdir -p /tmp/zen-i18n
   curl -fsS -o /tmp/zen-i18n/resources.en-US.json "https://zenerp.app.br/resources.en-US.json"
   ```

   On failure (non-2xx or network error), abort and tell the user. No offline fallback — without the catalog, every header would land in missing-keys.

1. **Read SQL**, strip `--` line comments and `/* */` block comments.
2. **Locate the outermost SELECT.** With `WITH ... AS (...)` CTEs, parse only the final top-level SELECT — inner subqueries don't contribute columns.
3. **Extract aliases** from `AS "alias"` (preserve casing). Drop `SHOW_*`.
4. **Extract bind params** via shipped helper:

   ```bash
   node .claude/skills/sql-to-report-template/assets/extract-binds.mjs <sql> > /tmp/binds.json
   ```

   The helper handles comment stripping, dedup, drop-list. Use the JSON array as input to the resolver. **Do not hand-curate the param list** — if a bind seems missing, fix the helper, never silently skip in the prompt. Reserved-keyword binds (`:LIMIT`, `:OFFSET`) are still real binds; the helper preserves them.
5. **Resolve i18n keys** in one resolver call (next section).
5b. **Type-check sample data** (when supplied):

   ```bash
   node .claude/skills/sql-to-report-template/assets/sample-types.mjs <data.json> > /tmp/sample-types.json
   ```

   Used as a hard signal for column shaping in step 6 — sample types override alias-suffix rules when they conflict. See `references/field-mapping.md` § Sample-driven overrides. Skip when no sample provided.
6. **Map each alias to a column** using `references/field-mapping.md`. Header comes from the resolver — never reconstruct. Apply sample-driven overrides from `/tmp/sample-types.json` when present.
7. **Render parameters** using `references/parameter-rendering.md`.
8. **Assemble index.jsx** from `assets/index.jsx.skeleton`. Substitute `__TITLE_KEY__`, `__COLUMNS__`, `__PARAMETERS__`.
9. **Write template.json** verbatim from `assets/template.json`.
10. **Write meta.json** from `assets/meta.json.skeleton` + extracted params + curated column subset (see meta.json scaffold below).
11. **Copy data.json** verbatim if supplied; otherwise omit.
12. **Validate** against Self-check. Findings go into the final report — never halt mid-run.

## i18n resolver

The shipped Node script `assets/lookup-i18n.mjs` resolves title + columns + params against the cached catalog in one pass. Don't grep the catalog yourself.

### Invocation

Build `/tmp/lookup-input.json`:

```json
{
  "title":   "<report-name>",
  "area":    "<from-mapping-table>",
  "entity":  "<lowerCamelCase-FROM-table>",
  "columns": ["<alias1>", "<alias2>", ...],
  "params":  ["<PARAM1>", "<PARAM2>", ...]
}
```

`area` and `entity` are optional but unlock area-direct lookups (`/<area>/report/<title>`, `/<area>/<entity>.<alias>`, `/<area>/<paramCamel>`) and area-scoped tail-search single-match. Omit when the module prefix is unmapped — never guess.

Run:

```bash
node .claude/skills/sql-to-report-template/assets/lookup-i18n.mjs \
  /tmp/zen-i18n/resources.en-US.json \
  /tmp/lookup-input.json > /tmp/lookup-output.json
```

### Output contract

- `result.title.emit` → `<h1>{<emit>}</h1>` content (already `t("...")`).
- `result.columns.<alias>.emit` → column's `header:` value.
- `result.params.<NAME>.emit` → `<dt>{<emit>}</dt>` content.
- `result.summary.missingList` → drop verbatim into the missing-keys report. Each entry has a `nearMatches` array — surface as suggestions only, never auto-substitute.

Use `emit` strings as-is. Never reconstruct `t("...")` calls by hand. If the script exits non-zero, abort and surface the error. Full algorithm — including multi-token left-trim, area-scoped tail-search, numbered-category params, and the verified-emit guarantee — in `references/i18n-lookup.md`.

## Column mapping

`references/field-mapping.md` owns the lookup tables. Read once per run. It covers:

- Namespace prefix → first arg to `cellHeader` (`product`/`company`/`unit`/etc., plus `sum`/`count`/`avg`/`min`/`max` aggregate prefixes).
- Suffix → `width`, `className`, `cell`, `footer` (`id` / `*_id` / `*_code` / `*_description` / `*_units` / `status` / `date` / quantity-or-monetary tokens / `_properties_*`).
- Footer rule (count for ids, sum for quantity/monetary tokens, none otherwise — suffix-driven, not prefix-driven).
- Monetary detection (suffix contains `Value`/`Price`/`Cost`/`Amount` → `formatCurrency`; else `formatNumber`).
- JSONB object stringify rule (bare `_properties` terminus).

**Hard rules to preserve when emitting columns:**

- Emit columns in **SQL SELECT order**. Preserve alias casing as `id`.
- **Numeric columns get BOTH `className: "number"` AND `headerClassName: "number"`.**
- **`footerValue` MUST be a function**: `({ data }) => data.reduce(...)`. Bare expressions break footer rendering.
- **Null-safe reducer mandatory** for cube SQL (`CASE WHEN :SHOW_X THEN ... ELSE NULL END`):
  ```jsx
  footerValue: ({ data }) => data.reduce((red, item) => red + (Number(item.<alias>) || 0), 0),
  footer: ({ value }) => utils.formatNumber(value),   // or formatCurrency
  ```
- Headers come from the resolver `emit`. Never reconstruct `t("...")` by hand.

## index.jsx skeleton

Authoritative skeleton: `assets/index.jsx.skeleton`. Substitute three placeholders:

- `__TITLE_KEY__` → resolver's `result.title.emit` strips out the outer `t("...")` wrapper — use the inner key.
- `__COLUMNS__` → comma-separated column objects, in SQL order, shaped per `references/field-mapping.md`.
- `__PARAMETERS__` → conditional `<dl>` blocks per `references/parameter-rendering.md`.

The skeleton's import list (`import * as utils ...` + the named imports) is fixed — keep both lines verbatim even when a feature like `Badge` is unused. No external imports beyond `./utils.jsx`. No inline styles. No `async`/`await`. No `window`/`document`.

## meta.json scaffold

Fill `assets/meta.json.skeleton` with extracted params + curated columns + sensible defaults so the playground preview is immediately readable.

### Parameters

Every non-SHOW SQL bind param, value `null`. Pair every `_IDS` with its `_IDS_DESC`. Order = SQL first-appearance.

### Columns — curated default view (target 6-10, hard cap 10)

Pick by tier. Stop at 10:

**Tier 1 — always include:** every `sum_*` and `count_*` column.

**Tier 2 — in order, until cap:**
1. Primary date: bare `date`, `*_date`, or camelCase `*Date`.
2. Status: bare `status` or `*_status`.
3. Primary entity: `<mainEntity>_number`, else first `*_code`, else bare `code`.
4. Primary subject name: first `*_nameCalc` (priority `person > company > rest`), else `*_fantasyName`, else `*_name`.
5. `product_code` if not yet added.
6. `product_description` if not yet added.

**Tier 3 — only if still under cap:** `_properties_<subkey>` text columns; first `*_complement`.

**Never include:** `*_id` columns; `*_day`/`*_month`/`*_year`; control aliases (`flow`, `returned`, `sign`); raw JSONB (`_properties` terminus); `-- LEGACY` aliases; numbered category variants (`personCategory_*_\d+` etc.); secondary-entity families beyond the first two.

**If Tier 1 alone exceeds 10:** keep top 6 `sum_*` + 2 `count_*` + ≤2 dimensions (date + name).

**Empty result:** include bare `id`, `code`, and first 5 SQL columns.

### Default sort (one column)

1. Bare `date` / `<entity>_date` → `desc`, `nulls: "last"`.
2. Else `*Date` camelCase → `desc`, `nulls: "last"`.
3. Else `_code` / bare `code` → `asc`, `nulls: "last"`.
4. Else empty.

### Default group (one column)

1. First `<entity>_nameCalc`.
2. Else `<entity>_fantasyName` / `<entity>_name`.
3. Else bare `date`.
4. Else empty.

### Example

```json
{
  "report": {
    "code": "jsx",
    "parameters": {
      "DATE_START": null, "DATE_END": null,
      "COMPANY_IDS": null, "COMPANY_IDS_DESC": null,
      "STATUS_LIST": null
    },
    "properties": {
      "settings": {
        "columns": [
          "invoice_date", "invoice_status", "invoice_number",
          "person_nameCalc", "product_code", "product_description",
          "sum_quantity", "sum_totalValue", "count_invoice"
        ],
        "sort": [{"columnId": "invoice_date", "direction": "desc", "nulls": "last"}],
        "groups": [{"columnId": "person_nameCalc"}]
      }
    }
  }
}
```

The full column list still lives in index.jsx; meta just filters/orders the visible subset.

## data.json — copy through, don't synthesize

Copy the user's sample verbatim to `<output>/data.json`. Never edit, prune, or invent rows — wrong types cause silent render bugs, and the user has already curated the sample to cover edge cases. If no sample, omit the file.

## template.json

Verbatim copy of `assets/template.json`. No per-report customization.

## Parameter rendering — quick reference

Render one `<dl>` per non-SHOW param inside `<section className="parameters">`. Full rules in `references/parameter-rendering.md`.

| Suffix          | `<dd>` value                              | Conditional guard       | Label         |
|-----------------|-------------------------------------------|-------------------------|---------------|
| `_START`/`_END` | `utils.formatDate(report.parameters.PARAM)` | on `PARAM`            | resolver `emit` |
| `_IDS`          | `report.parameters.PARAM_DESC` (string)   | on `PARAM_DESC`         | resolver `emit` |
| `_LIST`/other   | `report.parameters.PARAM` (raw)           | on `PARAM`              | resolver `emit` |

**Order in JSX (NOT SQL order):** dates → `_IDS` → `_LIST` → others. Preserve SQL first-appearance order within each group.

## Self-check (run before reporting back, never halt)

The skill **never interrupts mid-run** for these checks. Run them after writing all files; surface every finding in the final report under a `Validation` block. When unsure → emit `/@unknown/<segment>` and surface in the report. Don't second-guess in-place; don't re-emit; don't ask the user.

1. **Columns:** count = non-SHOW alias count from SQL; order = SQL SELECT order; alias casing preserved as `id`.
2. **Column shape:** every column matches its `references/field-mapping.md` rule — width, paired `className`/`headerClassName` on numerics, `cell` formatter, footer (count/sum/none). Sample-driven overrides applied where `/tmp/sample-types.json` disagrees with suffix rule.
3. **Footers:** suffix-driven, not prefix-driven. `footerValue` is a function `({ data }) => ...` (not bare). Null-safe reducer for cube SQL. Monetary tokens use `formatCurrency`; quantity tokens use `formatNumber`.
4. **i18n keys:** all output keys are resolver `emit` strings — none hand-crafted. Missing-keys report mirrors `summary.missingList` verbatim plus `nearMatches`.
5. **JSX:** imports match `assets/index.jsx.skeleton` exactly. No external imports, no inline styles, no `async`/`await`, no `window`/`document`.
6. **template.json:** byte-for-byte equal to `assets/template.json`.
7. **meta.json:** non-SHOW params filled (`_IDS` paired with `_IDS_DESC`); `settings.columns` is the curated subset; one default sort; one default group or empty.
8. **Parameter `<dl>` blocks:** only non-SHOW params; ordered dates → `_IDS` → `_LIST` → others; each guarded.
9. **data.json:** copied verbatim when provided; absent otherwise. Spot-check a couple of non-SHOW aliases as keys in row 0.
10. **Param completeness:** every name in `/tmp/binds.json` appears in `meta.json.parameters` (or as `<NAME>_DESC` for `_IDS`) AND in `index.jsx` `<dl>` block. Cross-check command:

    ```bash
    node -e '
    const binds = JSON.parse(require("fs").readFileSync("/tmp/binds.json", "utf8"));
    const meta = JSON.parse(require("fs").readFileSync("<output>/meta.json", "utf8"));
    const jsx = require("fs").readFileSync("<output>/index.jsx", "utf8");
    const metaKeys = new Set(Object.keys(meta.report.parameters));
    for (const p of binds) {
      const inMeta = metaKeys.has(p) || metaKeys.has(p + "_DESC");
      const inJsx = jsx.includes("report.parameters?." + p) || jsx.includes("report.parameters?." + p + "_DESC");
      if (!inMeta || !inJsx) console.log("MISSING:", p, "meta:", inMeta, "jsx:", inJsx);
    }
    '
    ```

    Any `MISSING:` line → list under `Validation: missing params` in the final report. Do not halt.

11. **Sample-driven overrides:** if `/tmp/sample-types.json` exists, list every alias whose sample type drove a deviation from the suffix rule (UUID dropping numeric formatting, datetime adding `formatDateTime`, integer adding `formatNumber`, mixed dropping all formatters). Surface under `Validation: sample overrides` in the final report so the reviewer sees what the sample changed.

Findings populate the final report. The skill writes once and reports — no in-place rewrites and no user prompts.

## Reporting back

```
Created:
- <output>/template.json
- <output>/index.jsx
- <output>/meta.json
- <output>/data.json    (only if copied from a user-provided sample)

Columns: <N> (dropped <M> SHOW_* aliases)
Parameters rendered: <list>
Title key: t("<TITLE_KEY>")   (<resolved | NOT FOUND — please edit>)
Area: <areaInput> → <areaResolved>   (only when resolver remapped, e.g. "audit" → "system/audit")

Missing i18n keys (need translation or manual edit):
- title "<TITLE_KEY>" → "<fallback_key>" (no /report/<name> match)
  Possible matches: <comma-separated nearMatches if any>
- column <alias> → "<fallback_key>"
  Possible matches: ...
- parameter <PARAM> → "<fallback_key>"
  Possible matches: ...

Validation: sample overrides (data.json type beat alias-suffix rule):
- <alias>: suffix rule → <expected>; sample type → <type> → emitted as <actual>. Verify.
- (omit block when no overrides applied)

Validation: missing params (binds in SQL not rendered):
- <PARAM_NAME> — missing from <meta.json | index.jsx | both>
- (omit block when complete)
```

Group missing list by kind (title → columns → params). Omit the "Possible matches" line when `nearMatches` is empty. Suggestions are not auto-substituted — the user picks. If the missing-keys list is empty, say "All i18n keys resolved." explicitly. Omit Validation blocks when empty. Surface `Area:` line only when resolver remapped (i.e. `areaResolved !== areaInput`).

No narration beyond that block. The skill does not halt or prompt — every uncertainty surfaces here.

## What NOT to do

- Don't invent columns the SQL does not select. If the team needs an extra column, they add it during review.
- Don't reorder columns alphabetically or by type — preserve SQL SELECT order.
- Don't add "nice-to-have" columns like `createdAt`/`updatedAt` unless they're in the SQL.
- Don't translate header labels into Portuguese / English — always use `t(...)` keys.
- Don't add a `styles.css` or touch `utils.jsx`.
- Don't add inline comments explaining what columns do.
- Don't wrap string-column cells (no `cell` prop for plain strings).
- Don't normalize bind param names. `:INVENTORY_MANAGEMENT` stays `INVENTORY_MANAGEMENT`.
- Don't infer numeric formatting from domain knowledge — only the explicit token rules from `references/field-mapping.md`. When uncertain, plain text.
