# Field mapping — authoritative lookup

Every SQL alias maps to one column object. This file owns the lookup tables. When SKILL.md says "see field-mapping.md", this is the source of truth.

## How to read this file

An alias has the shape `<prefix>_<suffix>` or is a bare word. Examples:

- `id` → bare
- `status` → bare
- `availabilityDate` → bare
- `company_name` → prefix `company`, suffix `name`
- `productPacking_units` → prefix `productPacking`, suffix `units`
- `sum_quantity` → prefix `sum`, suffix `quantity` (special — no i18n namespace)

Two independent lookups:

1. **Namespace lookup** (prefix → first arg to `cellHeader`) determines the i18n header path.
2. **Shape lookup** (suffix / bare name → width, className, cell, footer) determines every other column property.

Combine them to produce the final column object.

## Namespace lookup (prefix → i18n path)

Use the prefix verbatim (camelCase preserved). Second arg is always `t("/@word/<suffix>")` for two-arg calls.

| Prefix              | `cellHeader` call                                                       |
|---------------------|--------------------------------------------------------------------------|
| (bare, no prefix)   | `utils.cellHeader(t("/@word/<alias>"))`                                  |
| `sum`               | `utils.cellHeader(t("/@word/<suffix>"))`                                 |
| `company`           | `utils.cellHeader(t("/catalog/company/company"), t("/@word/<suffix>"))`  |
| `person`            | `utils.cellHeader(t("/catalog/person/person"), t("/@word/<suffix>"))`    |
| `product`           | `utils.cellHeader(t("/catalog/product/product"), t("/@word/<suffix>"))`  |
| `productProfile`    | `utils.cellHeader(t("/catalog/product/productProfile"), t("/@word/<suffix>"))`  |
| `productPacking`    | `utils.cellHeader(t("/catalog/product/productPacking"), t("/@word/<suffix>"))`  |
| `productVariant`    | `utils.cellHeader(t("/catalog/product/productVariant"), t("/@word/<suffix>"))`  |
| `unit`              | `utils.cellHeader(t("/catalog/product/unit"), t("/@word/<suffix>"))`     |

**Unknown prefix fallback:** If a prefix is not in this table, emit `utils.cellHeader(t("/@word/<alias>"))` with the full alias (including underscore) as the suffix. Prefer this over guessing a path — user can correct afterward.

**Note on `sum` prefix:** Never wrap in a namespace. `sum_quantity` → `cellHeader(t("/@word/quantity"))`, not `cellHeader(t("/@word/sum"), ...)`.

## Shape lookup (suffix / bare name → column props)

Match suffix first. If the alias is bare, match the whole alias against the "Standalone" column.

**Every numeric column gets BOTH `className: "number"` AND `headerClassName: "number"`** (per `docs/engine_enUS_changes.md` key rules — the header must align right too). "Numeric column" = anything whose suffix matches `id`, `*_id`, `*_units`, or `sum_*`, or any column formatted with `formatNumber` / `formatCurrency`.

| Suffix / bare name     | `width`  | `className` + `headerClassName` | `cell`                                  | `footerValue` / `footer`                                                                                                |
|------------------------|----------|--------------------------------|------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| `id` (bare)            | `"8ch"`  | `"number"` / `"number"`        | `({ value }) => utils.formatNumber(value)` | **count** — `footerValue: ({ data }) => data.length`, `footer: ({ value }) => utils.formatNumber(value)`                |
| `*_id` (prefixed)      | `"8ch"`  | `"number"` / `"number"`        | `({ value }) => utils.formatNumber(value)` | **count** — same as bare `id` (applies to numbered variants too: `personCategory_id_1..5`)                              |
| `status` (bare)        | `"16ch"` | — / —                          | `({ value }) => <Badge>{value}</Badge>`  | —                                                                                                                        |
| `code` (bare)          | `"16ch"` | — / —                          | —                                         | —                                                                                                                        |
| `*_code` (prefixed)    | `"16ch"` | — / —                          | —                                         | —                                                                                                                        |
| `unit_code` (exception)| `"8ch"`  | — / —                          | —                                         | —                                                                                                                        |
| `*_description`        | `"24ch"` | — / —                          | —                                         | —                                                                                                                        |
| `*_complement`         | `"16ch"` | — / —                          | —                                         | —                                                                                                                        |
| `*_name`               | `"24ch"` | — / —                          | —                                         | —                                                                                                                        |
| `*_fantasyName`        | `"24ch"` | — / —                          | —                                         | —                                                                                                                        |
| `*_nameCalc`           | `"24ch"` | — / —                          | —                                         | —                                                                                                                        |
| `*_units`              | `"8ch"`  | `"number"` / `"number"`        | `({ value }) => utils.formatNumber(value)` | **sum** — see quantity/value footer rule below                                                                           |
| `date` (bare)          | `"10ch"` | — / —                          | `({ value }) => utils.formatDate(value)` | —                                                                                                                        |
| `*Date` (bare camelCase, ends in "Date") | `"10ch"` | — / — | `({ value }) => utils.formatDate(value)` | —                                                                                                              |
| any quantity/value token (see below) | `"16ch"` | `"number"` / `"number"`  | `formatNumber` OR `formatCurrency` per monetary match | **sum** — `footerValue: ({data}) => data.reduce((red, item) => red + item.<alias>, 0)`, `footer:` matching formatter |

### Footer rule (sum vs count vs none)

Footer eligibility is **suffix-driven**, not alias-prefix driven. Three-way decision per alias:

**1. Count footer** — column counts rows.
- Triggers: alias === `id` (bare), OR alias ends in `_id`, OR alias matches `*_id_\d+` (numbered variants like `personCategory_id_1..5`).
- Emit:
  ```jsx
  footerValue: ({ data }) => data.length,
  footer: ({ value }) => utils.formatNumber(value),
  ```

**2. Sum footer** — column sums its values.
- Triggers (case-insensitive substring match on suffix / alias):
  - Quantity-like: `quantity`, `qty`, `served`, `balance`, `excess`, `adjusted`, `units`, `weight`, `kg`, `volume`, `margin`
  - Monetary: `value`, `price`, `cost`, `amount`, `commission` (only when paired with `Value`/`Base`)
  - Explicit aggregate aliases: `sum_*`, `count_*`
- Applies regardless of SQL expression — a `SUM()` aggregate aliased without `sum_` prefix (e.g. `invoiceItem_totalValue`, `salesCommissionBaseValue`) still gets a sum footer. Conversely a `MAX()` aggregate aliased with a value token (e.g. `invoiceItem_unitValue`) also gets a sum footer; the rendered total may be semantically meaningless for intensive quantities but the rule is consistent and the user can trim in meta.json.
- Formatter: use `formatCurrency` if monetary token matches; else `formatNumber`. See "Monetary detection rule" for exact token list.
- Emit:
  ```jsx
  footerValue: ({ data }) => data.reduce((red, item) => red + item.<alias>, 0),
  footer: ({ value }) => utils.formatNumber(value),    // or formatCurrency
  ```

**3. No footer** — everything else.
- Columns not matching count or sum triggers (strings, dates, status, code, description, name, boolean, `*_day`/`*_month`/`*_year`, raw numbers like `invoice_number`).

**Null-safe footer reducer:** When an alias may contain nulls (common for `CASE WHEN :SHOW_X THEN ... ELSE NULL END`), the reduce may NaN. Always guard:

```jsx
footerValue: ({ data }) => data.reduce((red, item) => red + (Number(item.<alias>) || 0), 0),
```

Apply this defensive form whenever the SQL has `CASE WHEN ... ELSE NULL END` wrapping the aggregate, which is most Zen cube reports.

### Monetary detection rule

A `sum_*` (or any numeric) column is **monetary** — i.e. renders via `utils.formatCurrency` — when its suffix contains any of these tokens (case-insensitive substring match):

- `Value` (e.g. `sum_productValue`, `sum_totalValue`, `sum_effectiveValue`, `sum_unitValue`, `sum_grossProductValue`, `sum_discountValue`, `sum_freightValue`, `sum_insuranceValue`, `sum_otherValue`, `sum_operationValue`, `sum_insideTaxValue`, `sum_outsideTaxValue`, `sum_contributionMarginValue`, `salesCommissionBaseValue`, `salesCommissionValue`)
- `Price`
- `Cost` (e.g. `costTotalValue`, `costUnitValue`)
- `Amount`
- `Balance` when paired with `Due` / `Receivable` / `Payable` (e.g. `balanceDue`). Bare `sum_balance` is quantity, not money — stay with `formatNumber`.

Non-monetary `sum_*` (quantity, count, weight, margin percentage): use `formatNumber`. Examples from the reference SQL: `sum_quantity`, `sum_served`, `sum_balance`, `sum_excess`, `sum_servedAdjusted`, `sum_balanceAdjusted`, `sum_netWeightKg`, `sum_grossWeightKg` → all `formatNumber`.

Non-`sum_` monetary fields (e.g. `invoiceItem_unitValue`, `salesCommission`): also use `formatCurrency` when the name matches a monetary token.

When uncertain, default to `formatNumber` — it's visually fine either way and `formatCurrency` applied to a non-money value looks wrong.

**Unknown suffix fallback:** If a suffix is not in this table, emit a minimal column — `id`, `header`, `width: "16ch"` — with no className / cell / footer. The user can tune after seeing the output.

### JSON / object columns — mandatory `cell` stringify

A column whose SQL expression returns a raw JSONB object (without `->>` text extraction) renders as an object in JavaScript. React crashes with `Objects are not valid as a React child` when such a value hits the default cell renderer.

Detect these at SQL-parse time:

- Alias ends in `_properties` **with no subkey suffix** (e.g. `salesperson_properties`, `sale_properties`, `invoice_properties`) — the full JSONB is returned.
- SQL expression for the alias contains `<table>.PROPERTIES` as a bare projection (e.g. `MAX(E1.PROPERTIES)`, subquery selecting `.PROPERTIES` directly) — no `->>` operator narrowing to a text field.

When detected, emit the column with a defensive stringify cell regardless of what other suffix rules would apply:

```jsx
{ id: "<alias>",
  header: utils.cellHeader(...),
  width: "24ch",
  cell: ({ value }) => value != null ? JSON.stringify(value) : null,
},
```

**Counter-examples — these stay as plain text, no stringify needed:**

- `invoice_properties_volumes` — SQL uses `E1.PROPERTIES ->> 'volumes'` which returns text.
- `product_properties_br_NCM`, `product_properties_br_CEST` — `->> 'fiscal_br_NCM'` returns text.

Rule of thumb: `_properties_<subkey>` (has a second underscore-separated part after `_properties`) = text, default rendering is safe. Bare `_properties` terminus = object, must stringify.

## Field-by-field emission

For every alias, emit one object in the columns array using this template (omit keys that are "—" in the table above):

```jsx
{ id: "<alias>",
  header: <namespace-lookup result>,
  width: "<width>",
  className: "<className>",           // only if set
  cell: <cell fn>,                    // only if set
  footerValue: <footerValue fn>,      // only if set
  footer: <footer fn>,                // only if set (paired with footerValue)
},
```

Match the reference's formatting: property per line, trailing comma after each, `id:` on the same line as the opening brace. Example from the reference:

```jsx
{ id: "company_code", 
  header: utils.cellHeader(t("/catalog/company/company"), t("/@word/code")),
  width: "16ch",
},
```

## Worked examples (from the reference SQL)

Input SQL alias → Output column object:

**`id`** (bare, has `id` shape with count footer):
```jsx
{ id: "id",
  header: utils.cellHeader(t("/@word/id")),
  width: "8ch",
  className: "number",
  headerClassName: "number",
  cell: ({ value }) => utils.formatNumber(value), 
  footerValue: ({ data }) => data.length, 
  footer: ({ value }) => utils.formatNumber(value),
},
```

**`status`** (bare, Badge wrapper):
```jsx
{ id: "status", 
  header: utils.cellHeader(t("/@word/status")),
  width: "16ch",
  cell: ({ value }) => <Badge>{value}</Badge>,
},
```

**`availabilityDate`** (bare, ends in `Date`):
```jsx
{ id: "availabilityDate", 
  header: utils.cellHeader(t("/@word/availabilityDate")), 
  width: "10ch",
  cell: ({ value }) => utils.formatDate(value),
},
```

**`company_id`** (prefix `company`, suffix `id`):
```jsx
{ id: "company_id", 
  header: utils.cellHeader(t("/catalog/company/company"), t("/@word/id")), 
  width: "8ch",
  className: "number",
  headerClassName: "number",
  cell: ({ value }) => utils.formatNumber(value),
},
```

**`productPacking_units`** (prefix `productPacking`, suffix `units`):
```jsx
{ id: "productPacking_units", 
  header: utils.cellHeader(t("/catalog/product/productPacking"), t("/@word/units")), 
  width: "8ch",
  className: "number",
  headerClassName: "number",
  cell: ({ value }) => utils.formatNumber(value),
},
```

**`unit_code`** (prefix `unit`, suffix `code` — exception: width 8ch not 16ch):
```jsx
{ id: "unit_code", 
  header: utils.cellHeader(t("/catalog/product/unit"), t("/@word/code")),
  width: "8ch",
},
```

**`sum_quantity`** (sum aggregator, non-monetary):
```jsx
{ id: "sum_quantity", 
  header: utils.cellHeader(t("/@word/quantity")), 
  width: "16ch",
  className: "number",
  headerClassName: "number",
  cell: ({ value }) => utils.formatNumber(value),
  footerValue: ({data}) => data.reduce((red, item) => red + item.sum_quantity, 0),
  footer: ({value}) => utils.formatNumber(value),
},
```

**`sum_productValue`** (sum aggregator, monetary — name contains `Value`):
```jsx
{ id: "sum_productValue",
  header: utils.cellHeader(t("/@word/productValue")),
  width: "16ch",
  className: "number",
  headerClassName: "number",
  cell: ({ value }) => utils.formatCurrency(value),
  footerValue: ({data}) => data.reduce((red, item) => red + item.sum_productValue, 0),
  footer: ({value}) => utils.formatCurrency(value),
},
```

## Rule precedence when multiple match

If an alias fits more than one rule, apply the most specific. Concretely:

- `unit_code` matches both `*_code` (width 16ch) and `unit_code` (width 8ch) — use 8ch.
- `id` matches both "id (bare)" and would hypothetically match `*_id` — bare `id` wins and carries the count footer.
- `productPacking_id` matches `*_id` — no count footer (only bare `id` gets that).

## When the SQL has alias casing you don't recognize

Keep the alias exactly as written — do not normalize to snake_case or camelCase. The SQL author chose it deliberately; downstream code (meta.json `columns` array, frontend selection) references it by that exact string.
