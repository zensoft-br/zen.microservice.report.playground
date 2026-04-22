---
name: sql-to-report-template
description: Generate a Zen ERP report template (index.jsx + template.json) from a SQL query and a sample data.json. Use when the user provides a .sql file (often alongside a data.json) and asks to scaffold, create, or generate a report template / JSX report / report skeleton for it. Also use when the user says "create a template from this SQL", "generate index.jsx for this query", or points at a SQL file in Downloads or elsewhere and asks for a report. The skill parses the SELECT aliases, skips internal SHOW_* control fields, maps every remaining field to the correct column definition (width, className, cell formatter, footer aggregator, i18n header namespace) and emits a complete index.jsx plus template.json that slots into playground/<area>/report/<name>/.
---

# sql-to-report-template

Scaffold a Zen ERP JSX report (template.json + index.jsx + meta.json + optional data.json) from a SQL query plus a sample data.json. The output must follow the **current** engine conventions documented in `docs/engine_enUS_changes.md` — these include `headerClassName` on numeric columns and `utils.formatCurrency` for monetary fields, which supersede the older shape seen in `playground/zen/supply/production/report/productionOrderConsumptionList/` (that reference predates the new rules; treat its structure / order / i18n-key style as authoritative, but update numeric columns and monetary formatting per the new rules).

## Inputs

The user will point at:

1. **A SQL file** (required) — e.g. `C:\Users\Theo\Downloads\template.sql`. Contains a `SELECT` with aliased output columns (`... AS "fieldName"`) and SQL bind parameters (`:PARAM_NAME`).
2. **A data.json file** (optional but strongly preferred) — an array of rows matching the SQL output shape. Use it to double-check that every alias extracted from SQL appears in a row (minus SHOW_* fields).
3. **An output folder** (optional).

**Default output location: `playground/ai/<name>/`** — pick `<name>` by trying these in order:

1. **Infer from main FROM table.** Parse the outermost `FROM <SCHEMA>.<TABLE>` in the SQL (the first real table after the top-level SELECT, skipping CTEs). Strip the `PS_ERP.` schema prefix and the leading module code (the `FIS_`/`PRD_`/`CAT_`/`SAL_`/etc. before the first underscore), then lowerCamelCase the rest. Examples:
   - `PS_ERP.PRD_PRODUCTION_ORDER` → `productionOrder`
   - `PS_ERP.FIS_INVOICE` → `invoice`
   - `PS_ERP.SAL_SALE` → `sale`
   - `PS_ERP.CAT_PRODUCT` → `product`
   Prefer this over the SQL filename because filenames are often generic (`template.sql`, `query.sql`, `sql2.sql`) while the table name always reflects the report's subject.

2. **Use the SQL filename** (without `.sql` extension) when it is descriptive — anything NOT in the generic list: `template`, `query`, `sql`, `sql[0-9]+`, `sample`, `test`, `report`, `data`, `test[0-9]+`, `tmp`, `temp`.

3. **Fallback to the current date** in `YYYY-MM-DD` form (e.g. `playground/ai/2026-04-21/`) when neither the table nor the filename yields a clean name. If the folder already exists, suffix `-HHmm` for uniqueness.

**Collision rule.** If the chosen folder already exists and already contains a `template.json`, append `-2`, `-3`, … until a fresh path is found — do not overwrite without explicit user permission.

**Reserved namespace.** The `playground/ai/` directory is for AI-generated templates only. Do not write into `playground/zen/...` or any other hand-maintained folder unless the user explicitly asks. This keeps AI output clearly separated from reviewed human work and avoids clobbering the golden examples.

**Explicit override wins.** If the user names a different output folder, honor it — skip the inference entirely.

## What to produce

Create these files in the output folder:

```
<output>/
  template.json    # engine config, asset links, fallback i18n (verbatim skeleton)
  index.jsx        # React component rendering the report
  meta.json        # sample/empty meta — driver for parameters + settings
  data.json        # ONLY when the user provides a sample — copy it in verbatim
```

Rules:

- **`template.json`** — always write. Verbatim copy of `assets/template.json` (no customization).
- **`index.jsx`** — always write. Generated from the SQL + the column mapping rules.
- **`meta.json`** — always write. Use the skeleton in `assets/meta.json.skeleton`: empty `columns` array, empty `sort`, empty `groups`, parameters object populated with the non-SHOW params extracted from the SQL (all set to `null` / empty so the user can fill them). This gives the playground watcher something testable immediately; the user tunes values afterward.
- **`data.json`** — only when the user points at a sample data file. Copy its contents unchanged to the output folder. Do not generate synthetic data — if no sample is provided, omit the file.

Do NOT create styles.css, styles.scss, or build.json. The playground watcher produces `build.json`; styles come from the global `playground/styles.css`.

## Performance contract

A correct run takes **~10-20 tool calls and <2 minutes** for a typical 30-150 column SQL. Hard rules to stay fast:

- **Do NOT write ad-hoc helper scripts** (no Python / Node one-offs for SQL parsing). Pattern-match the SELECT list inline with Grep/Read — Zen SQL aliases follow `AS "name"` and that's extractable in one pass.
- **Do use the shipped i18n resolver.** Every i18n key (title + columns + params) is resolved by `assets/lookup-i18n.mjs` via a single `node` invocation. Do NOT grep the catalog yourself. See the "i18n resolver" section below.
- **No repeated file reads.** Read SKILL.md + references + assets once per run, then operate from memory.

Budget: ~1 curl (catalog fetch) + ~1 node call (full i18n resolution) + ~3 file reads (SQL + data.json + references) + ~4 writes (template, index, meta, data). Everything else is reasoning.

## Core workflow

0. **Fetch the live i18n catalog** before anything else:

   ```bash
   mkdir -p /tmp/zen-i18n
   curl -fsS -o /tmp/zen-i18n/resources.en-US.json "https://zenerp.app.br/resources.en-US.json"
   ```

   If curl fails (non-2xx or network error), abort and tell the user: "Unable to fetch i18n catalog from https://zenerp.app.br/resources.en-US.json — check network, then retry." Do NOT proceed when the catalog is unreachable — every header key would end up in the missing-keys list.

   On success this pulls the current production catalog (~5800 keys, ~345 KB).

1. **Read the SQL file.** Strip line comments (`-- ...`) and block comments (`/* ... */`) before parsing.
2. **Locate the outermost `SELECT ... FROM` block.** When the query uses `WITH ... AS (...)` CTEs, skip past all CTE bodies and parse only the final top-level SELECT list. Inner subqueries do NOT contribute columns.
3. **Extract aliases.** Every expression ending in `AS "alias"` (double-quoted) in the outer SELECT list is a column. Preserve casing — alias becomes column `id`.
4. **Drop SHOW_\* aliases.** Never emit them as columns.
5. **Extract SQL bind parameters** from WHERE / WITH clauses: every `:NAME` token. Drop `:SHOW_*` binds. Remainder drives the header parameters block.
6. **Resolve all i18n keys in one `node` call** (see "i18n resolver" below). This produces the `emit` strings for every column header, every parameter label, and the title — plus the missing-keys list. Do NOT grep the catalog yourself.
7. **Map each alias to a column definition** using `references/field-mapping.md` (width / className / cell / footer). The header string comes from the resolver output — do NOT reconstruct it manually.
8. **Render parameters** in the header using `references/parameter-rendering.md`.
9. **Assemble index.jsx** from `assets/index.jsx.skeleton`, substituting the title, parameters block, and columns array.
10. **Write template.json** from the exact skeleton in `assets/template.json` (same for every report — no customization).
11. **Write meta.json** from `assets/meta.json.skeleton` — pre-fill non-SHOW params (values `null`) and every non-SHOW alias in `settings.columns`.
12. **Copy data.json** verbatim if the user supplied one. Otherwise skip.
13. **Validate** against the Self-check list before reporting done.

## i18n resolver (`assets/lookup-i18n.mjs`)

The skill ships a Node script that resolves title + columns + params against the cached catalog in a single call. This replaces per-key grepping.

### Invocation

1. Build an input JSON with the aliases and params you extracted from the SQL, and the inferred title name. Write to a temp file (Git Bash path like `/tmp/lookup-input.json` works on Windows — the watcher is not involved here).

   ```json
   {
     "title": "invoiceCube",
     "columns": ["id", "company_fantasyName", "invoice_id", "product_properties_br_NCM", "sum_quantity"],
     "params": ["DATE_START", "COMPANY_IDS", "STATUS_LIST"]
   }
   ```

2. Run the resolver:

   ```bash
   node .claude/skills/sql-to-report-template/assets/lookup-i18n.mjs \
     /tmp/zen-i18n/resources.en-US.json \
     /tmp/lookup-input.json > /tmp/lookup-output.json
   ```

3. Read the output. Each column / param / title entry carries an `emit` string you drop into index.jsx verbatim. Example:

   ```json
   {
     "title": { "resolved": false, "emit": "t(\"/@unknown/report/invoiceCube\")", "missing": ["/@unknown/report/invoiceCube"] },
     "columns": {
       "invoice_id": {
         "resolved": true,
         "resolution": "two-arg",
         "emit": "utils.cellHeader(t(\"/fiscal/invoice\"), t(\"/@word/id\"))"
       },
       "product_properties_br_NCM": {
         "resolved": true,
         "resolution": "single-arg-dotted",
         "emit": "utils.cellHeader(t(\"/catalog/product.properties.fiscal_br_NCM\"))"
       }
     },
     "params": {
       "STATUS_LIST": {
         "resolved": true,
         "emit": "t(\"/@word/status\")",
         "note": "stripped List suffix"
       }
     },
     "summary": {
       "total": 5, "resolved": 4, "missing": 1,
       "missingList": [{ "kind": "title", "name": "invoiceCube", "attempted": "/@unknown/report/invoiceCube" }]
     }
   }
   ```

### Rules

- Use each entry's `emit` string as-is for the column's `header:` / parameter's `<dt>{...}</dt>` / title's `<h1>{...}</h1>`. Do not re-derive headers from the alias.
- Everything in `summary.missingList` goes into the "Reporting back" missing-keys report. Do not drop entries — the user needs the gap list.
- A resolved entry with `resolution: "two-arg-missing-suffix"` or `"single-arg-suffix-no-namespace"` is still listed as missing in `missingList` when applicable. Trust the resolver's `resolved` flag.
- If the script exits non-zero, abort and surface the error — do not guess headers manually.

The resolver handles: pre-computed entity namespaces (company, person, product...), single-segment areas (`/fiscal/invoice`, `/supply/productionOrder`), dotted property keys (`/catalog/product.properties.fiscal_br_NCM`), `_LIST` strip-suffix fallback, `_IDS` plural lookup, and numbered param variants (`PERSON_CATEGORY_IDS_1..5`). Full algorithm in `references/i18n-lookup.md`.

## Column mapping — key rules (full table in `references/field-mapping.md`)

Alias shape determines every property. Two axes: the **namespace prefix** (before `_`) sets the i18n header path; the **suffix** (after `_`, or the whole name if no underscore) sets width / className / cell / footer.

**Namespace prefix → header path** (read `references/field-mapping.md` for the complete, authoritative table):

| Prefix         | First arg to `cellHeader`                        |
|----------------|--------------------------------------------------|
| (none)         | `t("/@word/<alias>")`                             |
| `sum`          | `t("/@word/<suffix>")` (single arg, no namespace) |
| `company`      | `t("/catalog/company/company")`                   |
| `person`       | `t("/catalog/person/person")`                     |
| `product`      | `t("/catalog/product/product")`                   |
| `productProfile` | `t("/catalog/product/productProfile")`         |
| `productPacking` | `t("/catalog/product/productPacking")`         |
| `productVariant` | `t("/catalog/product/productVariant")`         |
| `unit`         | `t("/catalog/product/unit")`                      |

For prefixed aliases: second arg is `t("/@word/<suffix>")`. For `sum_*`: no namespace, just `t("/@word/<suffix>")`.

**Suffix → column props** (summary; full table including `headerClassName` and monetary rule in `references/field-mapping.md`):

| Suffix / name       | width   | numeric? | cell                              | footer                                                        |
|---------------------|---------|----------|-----------------------------------|---------------------------------------------------------------|
| `id` (standalone)   | `8ch`   | yes      | `formatNumber`                    | **count** — `({ data }) => data.length`                                     |
| `*_id` (prefixed, incl. `*_id_\d+`) | `8ch` | yes | `formatNumber`          | **count** — `({ data }) => data.length`                                     |
| `*_code`, `code`    | `16ch`  | no       | —                                 | —                                                             |
| `unit_code`         | `8ch`   | no       | —                                 | —                                                             |
| `*_description`     | `24ch`  | no       | —                                 | —                                                             |
| `*_complement`      | `16ch`  | no       | —                                 | —                                                             |
| `*_name`, `*_fantasyName`, `*_nameCalc` | `24ch` | no | — | —                                        |
| `*_units`           | `8ch`   | yes      | `formatNumber`                    | **sum** — `reduce(+item.<alias>)`, `formatNumber`             |
| `status`            | `16ch`  | no       | `<Badge>{value}</Badge>`          | —                                                             |
| `date`, `*Date`     | `10ch`  | no       | `formatDate`                      | —                                                             |
| quantity/value token match (see below) | `16ch` | yes | `formatNumber` or `formatCurrency` | **sum** — `reduce(+item.<alias>)`, matching formatter |

**Footer eligibility is suffix-driven, not alias-prefix driven.** Trigger tokens (case-insensitive substring):

- **Count footer**: alias === `id`, OR ends with `_id`, OR matches `*_id_\d+`.
- **Sum footer**: suffix / alias contains any of `quantity`, `qty`, `served`, `balance`, `excess`, `adjusted`, `units`, `weight`, `kg`, `volume`, `margin` (quantity-like → `formatNumber`) OR `value`, `price`, `cost`, `amount`, `commission`+`value` (monetary → `formatCurrency`). Also explicit `sum_*`, `count_*` prefixes.
- **Applies regardless of SQL aggregate type.** A `SUM()` aliased without `sum_` prefix (e.g. `invoiceItem_totalValue`, `salesCommissionBaseValue`) gets a sum footer. A `MAX()` aliased with a value token (e.g. `invoiceItem_unitValue`) also gets a sum footer — the user trims in meta if semantically wrong.
- **Null-safe reducer mandatory** for Zen cube SQL (`CASE WHEN :SHOW_X THEN ... ELSE NULL END` patterns). `footerValue` must be a **function** `({ data }) => ...`, not a bare expression:

  ```jsx
  footerValue: ({ data }) => data.reduce((red, item) => red + (Number(item.<alias>) || 0), 0),
  footer: ({ value }) => utils.formatNumber(value),
  ```

  Writing `footerValue: data.reduce(...)` without the `({ data }) =>` wrapper breaks rendering — the footer tds come out empty. Always wrap.

**"Numeric" columns get BOTH `className: "number"` AND `headerClassName: "number"`** (per `docs/engine_enUS_changes.md` — the header must also align right). Non-numeric columns get neither.

Emit columns in the **same order** they appear in the SQL SELECT list. Preserve the exact alias casing as the column `id`.

**i18n keys come from the resolver, not manual lookup.** The `emit` string for every column header is produced by `assets/lookup-i18n.mjs` (see "i18n resolver" section). Paste it verbatim into the `header:` property. Do NOT reconstruct `t("...")` calls by hand — the resolver handles namespace + suffix + dotted-key patterns the hand rules miss.

## JSX skeleton — non-negotiable shape

Every output index.jsx has this exact top-level structure (no variations, no creative rewrites):

```jsx
import * as utils from "./utils.jsx";
import { Badge, Column, GroupSections, Table } from "./utils.jsx";

export default function ({ data = [], meta = {}, t }) {
  const { report = {} } = meta;

  const columns = [
    /* one entry per non-SHOW alias, in SQL order */
  ];

  data = utils.sort(data, report.properties?.settings?.sort || []);
  data = utils.group(data, report.properties?.settings?.groups || [], columns);
  const visibleColumns = report?.properties?.settings?.columns ?? report?.properties?.showColumns?.split(",");

  return (
    <div className="report-wrapper">
      <div className="report-container">
        <header>
          <h1>{t("<TITLE_KEY>")}</h1>
          <section className="parameters">
            {/* one conditional <dl> per rendered parameter */}
          </section>
        </header>
        <main>
          <GroupSections
            columns={columns}
            data={data}
            groups={report.properties?.settings?.groups || []}>
            {(groupData) => (
              <div className="content">
                <Table data={groupData} visibleColumns={visibleColumns}>
                  {columns.map((column, index) => (
                    <Column key={index} {...column} />
                  ))}
                </Table>
              </div>
            )}
          </GroupSections>
        </main>
      </div>
    </div>
  );
}
```

Rules:
- Import list is exactly those two lines. Even if a feature (e.g. Badge) is not needed, keep both lines — the reference does, and consistency beats micro-optimization here.
- `<TITLE_KEY>` comes from the resolver output (`result.title.emit`). Pass the report `<name>` (output folder name) to the resolver as `input.title`. If the resolver returns `resolved: false`, the fallback `/@unknown/report/<name>` is already baked into the emit string and the title is recorded in `missingList` — surface it in the "Reporting back" missing-keys section so the user adds a translation.
- Column objects use trailing commas after each property, matching the reference style.
- Do not hardcode CSS; do not emit styles.css; do not import anything beyond `./utils.jsx`.

Full field-by-field example and edge cases live in `references/reference-example.md`.

## meta.json — per-report scaffold with sensible defaults

Write a companion `meta.json` next to every index.jsx. Pre-fill parameters + a **curated** column subset + default sort + default group so the rendered preview is immediately useful (not 150 columns wide). The user trims further from there.

### Parameters

Every non-SHOW SQL bind parameter, values set to `null`. Paired `_IDS_DESC` for every `_IDS` param. Key order = SQL first-appearance order.

### Columns — curated default view (TARGET 6-10 COLUMNS)

**Hard cap: 10 columns in `settings.columns`. Target: 6-10.** More than that causes horizontal squish that makes the preview unreadable. The full column list still lives in `index.jsx` — meta just filters.

Pick columns using this priority order. Stop when you hit 10 (aim for 6-10):

**Tier 1 — always include every measurement** (the point of the report):
- Every `sum_*` column.
- Every `count_*` column.

**Tier 2 — minimal dimensions** (add in this order until cap is reached):
1. Primary date: first alias matching bare `date`, `*_date`, or `*Date` camelCase (`availabilityDate`, `issueDate`).
2. Status: first alias matching `status` (bare) or `*_status`.
3. Primary entity identifier: `<mainEntity>_number` if present (e.g. `invoice_number`), else first `*_code` from the main entity (main = the FROM-table alias used to infer the output folder name), else bare `code`.
4. Primary subject name: first `*_nameCalc` in priority order `person > company > <first-remaining>`, else `*_fantasyName`, else `*_name`.
5. Secondary entity: `product_code` if present and not already added.
6. Secondary description: `product_description` if present.

**Tier 3 — only if still under 10 after Tiers 1+2**:
- `_properties_<subkey>` text-extracted columns that carry user-relevant data (e.g. `product_properties_br_NCM`, `invoice_properties_volumes`).
- First `*_complement` column.

**Never include in the default view**:
- Any `*_id` column (prefixed ids — the name/code column already identifies the entity).
- `*_day`, `*_month`, `*_year` (redundant next to date).
- Control aliases: `flow`, `returned`, `sign`.
- Raw JSONB object columns (bare `_properties` terminus).
- Legacy duplicates (aliases preceded by `-- LEGACY` in SQL).
- Numbered category variants: `personCategory_*_\d+`, `productCategory_*_\d+`, `salespersonCategory_*_\d+` (all indexes).
- Secondary-entity id/name families beyond the first two (e.g. once `person` is in, skip `personGroup`, `city`, `state`, `country`, `shipping`, `salesperson`, etc. unless you still have headroom).

**If Tier 1 alone exceeds 10** (reports with many aggregated measurements): keep only the top 6 `sum_*` + up to 2 `count_*`, ordered by SQL appearance, and include at most 2 dimensions from Tier 2 (date + primary entity name). Aim for ≤10 total.

**Degenerate fallback**: If the curated set ends up empty (no sums, no dimensions detected), include bare `id`, `code`, and first 5 columns in SQL order.

### Default sort

Pick one column, descending for dates / ascending otherwise:

1. First bare `date` or `<entity>_date` column → `direction: "desc"`, `nulls: "last"`.
2. Else first `*Date` camelCase column → `desc`, `nulls: "last"`.
3. Else first `_code` or bare `code` column → `asc`, `nulls: "last"`.
4. Else empty array.

### Default group

Pick one grouping column to demonstrate grouping visually:

1. First `<entity>_nameCalc` column (typically person or the main subject of the report).
2. Else first `<entity>_fantasyName` or `<entity>_name`.
3. Else first bare `date` column (group-by-date is common in cube reports).
4. Else empty array.

### Example — invoice cube SQL

```json
{
  "report": {
    "code": "jsx",
    "parameters": {
      "DATE_START": null,
      "DATE_END": null,
      "COMPANY_IDS": null,
      "COMPANY_IDS_DESC": null,
      "PERSON_IDS": null,
      "PERSON_IDS_DESC": null,
      "STATUS_LIST": null
    },
    "properties": {
      "settings": {
        "columns": [
          "invoice_date",
          "invoice_status",
          "invoice_number",
          "person_nameCalc",
          "product_code",
          "product_description",
          "sum_quantity",
          "sum_productValue",
          "sum_totalValue",
          "count_invoice"
        ],
        "sort": [
          { "columnId": "invoice_date", "direction": "desc", "nulls": "last" }
        ],
        "groups": [
          { "columnId": "person_nameCalc" }
        ]
      }
    }
  }
}
```

### Example — simple list SQL

Aliases `id`, `code`, `sum_quantity`, params `:DATE_START`, `:DATE_END`, `:COMPANY_IDS`, `:STATUS_LIST`:

```json
{
  "report": {
    "code": "jsx",
    "parameters": {
      "DATE_START": null,
      "DATE_END": null,
      "COMPANY_IDS": null,
      "COMPANY_IDS_DESC": null,
      "STATUS_LIST": null
    },
    "properties": {
      "settings": {
        "columns": ["id", "code", "sum_quantity"],
        "sort": [{ "columnId": "code", "direction": "asc", "nulls": "last" }],
        "groups": []
      }
    }
  }
}
```

Rationale: the user asked for immediate visual testability. Default view = essentials + one sort + one group. The full column list lives in index.jsx; meta just filters/orders what's visible. User can replace the settings manually when the report's real intent is known.

## data.json — copy through, don't synthesize

If the user supplied a sample data file (e.g. `--data playground/zen/.../data.json`), copy it verbatim to `<output>/data.json`. Do not edit, prune, or regenerate its contents — the playground watcher uses it as-is to drive the preview, and the user has already curated the sample rows to cover edge cases.

If no data file was supplied, omit `data.json` entirely. Do not invent rows — wrong types will cause silent render bugs.

## template.json — fixed skeleton

Write this verbatim — no customization per report:

```json
{
  "engine": "jsx",
  "assets": {
    "scripts": {
      "utils.jsx": "@file:/utils.jsx"
    },
    "styles": [
      "@file:/styles.css",
      "@file:styles.css"
    ]
  },
  "i18n": {
    "fallbackLocale": "fallback",
    "resources": {
      "fallback": {}
    }
  }
}
```

This exact content is in `assets/template.json`. Copy it as-is.

## Parameter rendering rules (details in `references/parameter-rendering.md`)

Render a `<dl>` inside `<section className="parameters">` for each extracted SQL bind parameter, in the order they first appear in the SQL source. Skip any `SHOW_*`. Formatting depends on parameter name shape:

- Ends with `_START` / `_END` → treat as date: `{utils.formatDate(report.parameters.PARAM)}`, label `t("/@word/<camelCase(PARAM)>")` (e.g. `DATE_START` → `/@word/dateStart`).
- Ends with `_IDS` → render the paired `_IDS_DESC` string value plainly, label = plural of the entity: e.g. `COMPANY_IDS` → `{report.parameters.COMPANY_IDS_DESC}`, label `t("/catalog/company/company/plural")`.
- Ends with `_LIST` / others → render plainly with `t("/@word/<camelCase(PARAM)>")` label, raw value.

Each `<dl>` must be wrapped in a conditional so empty params are omitted at runtime. The guarded key matches the *rendered* value key, not the input parameter name:

- Date params: guard on `PARAM` directly — `{report.parameters?.DATE_START && <dl>...</dl>}`.
- `_IDS` params: guard on `PARAM_DESC` (because the rendered value reads from `_DESC`) — `{report.parameters?.COMPANY_IDS_DESC && <dl>...</dl>}`.
- Others: guard on `PARAM` directly.

**Label keys come from the resolver.** Each param's `<dt>{...}</dt>` uses the `emit` string returned by `lookup-i18n.mjs` under `result.params.<NAME>.emit`. The resolver handles date camelCasing, `_IDS` plural lookup, `_LIST` strip-suffix fallback, and numbered variants (`PERSON_CATEGORY_IDS_1..5`) automatically. Do not hand-craft `t("/@word/<camelCase>")` paths.

**Ordering in the rendered JSX** follows a fixed type order (NOT SQL first-appearance order — Zen convention puts dates first):

1. All `_START` / `_END` date params (pair `_START` with its matching `_END`).
2. All `_IDS` params (preserve SQL first-appearance order within this group).
3. All `_LIST` params.
4. All other params.

See `references/parameter-rendering.md` for the camelCase rule, the entity-to-namespace plural lookup, and the exhaustive example.

## Self-check (run before declaring done)

Read the output files back and verify:

1. **Column count = non-SHOW alias count** from the SQL. No missing, no extras.
2. **Column order = SQL SELECT order.** First alias first, last alias last.
3. **Every column has `id`, `header`, `width`**; plus `className` + `headerClassName` + `cell` when the suffix rules above require them. Every numeric column has BOTH `className: "number"` and `headerClassName: "number"`.
4. **Footers are suffix-driven, not prefix-driven.**
   - Every `id` column (bare `id`, `*_id`, `*_id_\d+`) has a count footer: `footerValue: ({ data }) => data.length`, `footer: ({ value }) => utils.formatNumber(value)`. **Both must be functions** — not bare `data.length` or string `formatNumber`.
   - Every column whose suffix contains a quantity token (`quantity`, `qty`, `served`, `balance`, `excess`, `adjusted`, `units`, `weight`, `kg`, `volume`, `margin`) or monetary token (`value`, `price`, `cost`, `amount`, `commission`+`Value`) has a sum footer with null-safe reducer.
   - Applies even when the alias does NOT carry a `sum_` / `count_` prefix (e.g. `invoiceItem_totalValue`, `invoiceItem_quantity`, `salesCommissionBaseValue` — all get sum footers despite the legacy-style alias).
   - Other columns (strings, dates, status, code, description, name, `*_day`/`*_month`/`*_year`, `invoice_number`) have NO footer.
5. **Monetary columns use `formatCurrency`** for both cell and footer; quantity columns use `formatNumber`. Monetary detection = suffix contains `Value`/`Price`/`Cost`/`Amount`. See full rule in `references/field-mapping.md`.
6. **All i18n keys emitted by the template are the resolver's `emit` strings.** The resolver already verified each against `/tmp/zen-i18n/resources.en-US.json`. The missing-keys list comes from `result.summary.missingList` verbatim — nothing added, nothing dropped.

6a. **Title key** = `result.title.emit`. If `result.title.resolved` is `false`, the missing-keys list already includes the title entry.
7. **Imports match reference exactly:** `import * as utils from "./utils.jsx";` and `import { Badge, Column, GroupSections, Table } from "./utils.jsx";`.
8. **Title key** matches the output folder path convention.
9. **template.json is the verbatim skeleton** — engine jsx, scripts/styles assets, fallback i18n. No `template` section (index.jsx is auto-loaded).
10. **meta.json exists** with: non-SHOW SQL params pre-filled (values `null`, `_IDS` params paired with `_IDS_DESC`); `settings.columns` populated with the **curated essentials subset** (see "meta.json — per-report scaffold" section); `settings.sort` set to one sensible default (date desc or code asc); `settings.groups` set to one sensible default (first `_nameCalc` / `_fantasyName` / bare `date`) or empty if none apply.
11. **data.json** — copied verbatim when the user provided one; absent otherwise.
12. **No external imports**, no inline styles, no `async`/`await`, no `window`/`document` access (engine constraints from `docs/engine_enUS_changes.md`).
13. **Parameter block in index.jsx** contains only non-SHOW params, each guarded appropriately (on `PARAM` for dates/lists, on `PARAM_DESC` for `_IDS`), ordered: dates → `_IDS` → `_LIST` → others.
14. If data.json was provided: **spot-check** that a couple of non-SHOW aliases exist as keys in the first data row. Mismatch = parsing went wrong.

If any check fails, fix before reporting done.

## Reporting back

After writing the files, output:

```
Created:
- <output>/template.json
- <output>/index.jsx
- <output>/meta.json
- <output>/data.json    (only if copied from a user-provided sample)

Columns: <N> (dropped <M> SHOW_* aliases, <K> commented-out aliases)
Parameters rendered: <list>
Title key: t("<TITLE_KEY>")   (<resolved | NOT FOUND — please edit>)

Missing i18n keys (need translation or manual edit):
- title "<TITLE_KEY>" → no /report/<name> match found; fallback "/@unknown/report/<name>" used
- column <alias> → "<fallback_key>" (no /@word/<suffix> or namespace match)
- parameter <PARAM> → "<fallback_key>" (no label key found)
(or "none — all keys resolved" when the list is empty)
```

Group the missing-keys section by kind (title first, then columns, then parameters). If the list is empty, say "All i18n keys resolved." explicitly so the user has a clean confirmation.

No narration beyond that. The user can diff against the reference themselves.

## What NOT to do

- Do not invent columns that aren't in the SQL.
- Do not reorder columns alphabetically or by type.
- Do not add "nice-to-have" columns like `createdAt`, `updatedAt` unless they're in the SQL.
- Do not translate header labels into Portuguese or English — always use `t(...)` keys; i18n resolution happens at render time.
- Do not add a `styles.css` or touch `utils.jsx`.
- Do not add inline comments explaining what columns do. The reference has none.
- Do not wrap values like `row.company_code` — cells for string columns use the default (no `cell` prop).
