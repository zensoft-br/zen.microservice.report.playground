# Engine spec — Zen ERP report runtime

Copied and adapted from `docs/engine.md` (the upstream Portuguese-language kit spec). Translated to English, trimmed to what's skill-relevant, and extended with APIs the kit doc omitted (`cellHeader`, `GroupSections`, `Badge`, `utils.sort`, `utils.group`, `meta` settings shape). When this file and `docs/engine.md` disagree, **this file wins for skill purposes** — `docs/engine.md` predates conventions the generated output must follow.

## Execution contract

The template engine receives three inputs:

- **`template.json`** — renderer config (engine, assets, i18n fallback).
- **`data`** — the SQL query result, normally an array of row objects.
- **`meta`** — arbitrary metadata, typically `{ report: { parameters, properties: { settings } } }` where `settings` drives columns/sort/groups/visibility.

The template is the default export of `index.jsx`:

```jsx
export default function ({ data = [], meta = {}, t }) {
  const { report = {} } = meta;
  return (
    <div className="report-wrapper">
      <div className="report-container">
        {/* ... */}
      </div>
    </div>
  );
}
```

- `data` — rows (from `data.json`).
- `meta` — `{ report: { parameters?, properties?: { settings?: { columns?, sort?, groups? } } } }`.
- `t(key)` — i18n lookup, returns the translated string or the raw key on miss.

## Runtime limits

- No `window`, `document`, `fetch`, or filesystem access. Sandboxed.
- Max input JSON: 50 MB.
- Max render time: 60 s.
- ES2022 available, but **no `async`/`await`** in the render function.

## template.json

Shape:

```ts
type TemplateEngine = "eta" | "handlebars" | "jsx" | "liquid" | "nunjucks";

interface Template {
  engine: TemplateEngine;
  template?: { source: string | Record<string, string>; entry?: string };
  data?: Record<string, any>;
  assets?: {
    snippets?: Record<string, string>;
    scripts?: Record<string, string>;
    styles?: string[];
  };
  i18n?: {
    locale?: string;
    fallbackLocale?: string;
    resources: Record<string, Record<string, any> | string>;
  };
  meta?: Record<string, any>;
  options?: Record<string, any>;
}
```

Canonical template.json the skill emits:

```json
{
  "engine": "jsx",
  "assets": {
    "scripts": { "utils.jsx": "@file:/utils.jsx" },
    "styles": ["@file:/styles.css", "@file:styles.css"]
  },
  "i18n": {
    "fallbackLocale": "fallback",
    "resources": { "fallback": {} }
  }
}
```

`@file:` values are replaced by file contents at render time. Absent `template` section → `index.jsx` is auto-loaded.

## meta.json

Skill-relevant shape:

```json
{
  "report": {
    "code": "jsx",
    "parameters": {
      "DATE_START": "2026-01-01",
      "DATE_END": "2026-01-31",
      "COMPANY_IDS": [1, 2],
      "COMPANY_IDS_DESC": "Acme, Beta"
    },
    "properties": {
      "settings": {
        "columns": ["invoice_date", "person_nameCalc", "sum_quantity"],
        "sort":    [{ "columnId": "invoice_date", "direction": "desc", "nulls": "last" }],
        "groups":  [{ "columnId": "person_nameCalc" }]
      }
    }
  }
}
```

- `parameters` — raw bind values + paired `<NAME>_DESC` display strings for `_IDS` params.
- `settings.columns` — whitelist + display order passed to `<Table visibleColumns>`.
- `settings.sort` — array of `{ columnId, direction, nulls }` consumed by `utils.sort`.
- `settings.groups` — array of `{ columnId }` consumed by `utils.group` / `<GroupSections>`.

## Layout hierarchy

```
.report-wrapper
└── .report-container                    (Physical page)
    ├── .stamp                            (Watermark, optional)
    ├── header
    │   ├── .brand                        (Logo, optional)
    │   ├── h1                            (Title)
    │   └── section.parameters            (1 <dl> per rendered param)
    │       └── dl
    │           ├── dt                    (Label via t(...))
    │           └── dd                    (Value)
    ├── .page-header                      (Repeats on every page, optional)
    ├── .page-footer                      (Repeats on every page, optional)
    ├── main
    │   ├── .kpi-grid                     (Summary metrics, optional)
    │   └── section                       (Group, optional)
    │       ├── header                    (Group header)
    │       ├── .content                  (Data — required)
    │       │   └── Table
    │       │       └── Column ...
    │       └── footer                    (Group footer)
    └── footer                            (Final document footer)
```

## Components (from `utils.jsx`)

### `<Table>`

```jsx
<Table data={groupData} visibleColumns={visibleColumns}>
  {columns.map((column, index) => <Column key={index} {...column} />)}
</Table>
```

- `data` — rows to render.
- `visibleColumns` — optional string array; when set, filters and orders columns. Omit to show all.
- Children — one `<Column>` per column definition. Skill spreads column objects from the `columns` array.

### `<Column>`

```jsx
<Column
  id="col1"
  header={t("/@word/col1")}
  headerClassName="number"
  className="number"
  width="16ch"
  cellValue={({ row }) => row.col1}
  cell={({ row, value }) => utils.formatNumber(value)}
  footerValue={({ data }) => data.reduce((r, it) => r + it.col1, 0)}
  footer={({ data, value }) => utils.formatNumber(value)}
/>
```

Props:

- `id` — unique column key (matches `data[i][id]`).
- `header` — string or JSX for `<th>`. Skill always passes the result of `utils.cellHeader(...)`.
- `headerClassName` — CSS class on `<th>`. Use `"number"` for right-aligned numeric headers.
- `className` — CSS class on `<td>` cells.
- `width` — CSS width (e.g. `"8ch"`, `"16ch"`, `"24ch"`).
- `cellValue({ row })` — optional; typed value for the cell. Defaults to `row[id]`.
- `cell({ row, value })` — formats `value` to a string or JSX. Omit for plain string default.
- `footerValue({ data })` — **must be a function**. Computes the footer's typed value (e.g. sum, count).
- `footer({ data, value })` — **must be a function**. Formats the typed value to string/JSX.

**Critical:** `footerValue` and `footer` are functions, not bare expressions. Writing `footerValue: data.length` (no arrow) produces an empty `<td>` in `<tfoot>` — wrap: `footerValue: ({ data }) => data.length`.

### `<GroupSections>`

```jsx
<GroupSections
  columns={columns}
  data={data}
  groups={report.properties?.settings?.groups || []}>
  {(groupData) => (
    <div className="content">
      <Table data={groupData} visibleColumns={visibleColumns}>
        {columns.map((column, index) => <Column key={index} {...column} />)}
      </Table>
    </div>
  )}
</GroupSections>
```

Props:

- `data` — ungrouped rows (pass after `utils.sort` + `utils.group`).
- `groups` — array of `{ columnId }`.
- `columns` — full column defs (used to look up headers for group labels).
- `level` — current nesting depth (internal).
- Children — **render-prop function** `(groupData) => JSX`. Called once per leaf group with the sub-array.

Renders a nested `<section>` per group level, each with a `<header><h2>` summarizing the group column (`<header-text>: <value>`).

### `<Badge>`

```jsx
<Column ... cell={({ value }) => <Badge>{value}</Badge>} />
```

Pill-style inline element. Skill uses it for `status` columns.

## Utilities (from `utils.jsx`)

### Formatters

```js
utils.formatCurrency(1234.5)   // "R$ 1.234,50"
utils.formatDate("2025-03-15") // "15/03/2025"
utils.formatDateTime(...)
utils.formatNumber(1.23)       // "1,23"
utils.formatTime(...)
utils.round(1.235, 2)          // 1.24
```

All accept `null` / `undefined` safely, returning `null` (renders as nothing).

### `utils.cellHeader(...args)`

Joins non-null args with `", "`, lowercases all but the first:

```js
utils.cellHeader(t("/catalog/company/company"), t("/@word/fantasyName"))
// → "Company, fantasy name"

utils.cellHeader(t("/@word/quantity"))
// → "Quantity"
```

Signature is variadic. Skill passes 1–3 args (namespace, suffix, optional index).

### `utils.sort(data, criteria)`

```js
data = utils.sort(data, report.properties?.settings?.sort || []);
```

Sorts in place using `Intl.Collator(numeric:true)`. `criteria` = array of `{ columnId, direction = "asc", nulls = "last" }`.

### `utils.group(data, groups)`

```js
data = utils.group(data, report.properties?.settings?.groups || [], columns);
```

Returns a nested `Map` keyed by group-column values. Empty `groups` → single bucket with `null` key. `<GroupSections>` consumes this structure.

## Hard rules

- **No external imports** beyond `./utils.jsx`.
- **No `async` / `await`** in the render function.
- **No inline colors**; use CSS classes in `styles.css` (global) or `styles.scss` (per-report, rare).
- **Always** use `utils.formatCurrency` / `formatDate` / `formatNumber` for values.
- **Always** give each `<Column>` a unique `id`.
- **Always** pass `key` to elements inside `.map()`.
- **Numeric columns** must set both `className="number"` AND `headerClassName="number"` for right-aligned alignment of `<td>` and `<th>`.
- **Footer props are functions.** `footerValue: ({ data }) => ...`, `footer: ({ value }) => ...`. Bare expressions render empty.

## Included helpers NOT in original kit doc

These were missing from `docs/engine.md`; skill-generated templates rely on them:

- `utils.cellHeader(...)` — header composition.
- `<GroupSections>` — group-level rendering with render-prop child.
- `<Badge>` — status pill.
- `utils.sort`, `utils.group` — used before `<GroupSections>` / `<Table>`.
- `meta.properties.settings.{columns,sort,groups}` — drives visibility / ordering / grouping at runtime; not in kit docs but honored by the engine.

If the engine ever diverges from this spec, update this file — it's the skill's source of truth.
