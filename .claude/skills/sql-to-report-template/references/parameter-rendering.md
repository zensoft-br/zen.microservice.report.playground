# Parameter rendering

Each SQL bind parameter `:NAME` can appear as a `<dl>` in the report header's `<section className="parameters">`. This file defines the exact rendering rules.

## Extraction

Scan the full SQL (CTEs + final SELECT + WHERE clauses) for `:NAME` tokens. Deduplicate. Preserve first-appearance order.

**Drop:**
- Any param whose name starts with `SHOW_` (case-insensitive).
- Any param whose name is pure internal plumbing: `MULT`, `MAX_RECORDS`, `PRICE_LIST_ID` (IDs used as join keys, not user-facing filters). These are implementation details. When in doubt, include.

## camelCase conversion

Parameter names in SQL are UPPER_SNAKE_CASE. For the label i18n key, convert to lowerCamelCase:

- `DATE_START` → `dateStart`
- `AVAILABILITY_DATE_END` → `availabilityDateEnd`
- `COMPANY_IDS` → `companyIds`
- `STATUS_LIST` → `statusList`

Conversion: lowercase the first word, capitalize subsequent words, drop underscores.

## Rendering rules by suffix

### Ends with `_START` or `_END` (date range)

```jsx
{report.parameters?.DATE_START && <dl>
  <dt>{t("/@word/dateStart")}</dt>
  <dd>{utils.formatDate(report.parameters.DATE_START)}</dd>
</dl>}
```

### Ends with `_IDS` (multi-select of entity ids)

The SQL binding is a `BIGINT[]` of ids, but the human-readable version is delivered separately as `<PARAM>_DESC`. Render `_DESC`:

```jsx
{report.parameters?.COMPANY_IDS_DESC && <dl>
  <dt>{t("/catalog/company/company/plural")}</dt>
  <dd>{report.parameters.COMPANY_IDS_DESC}</dd>
</dl>}
```

**Label lookup** (entity prefix → plural key):

| Param           | Entity           | Label key                                  |
|-----------------|------------------|---------------------------------------------|
| `COMPANY_IDS`   | company          | `t("/catalog/company/company/plural")`      |
| `PERSON_IDS`    | person           | `t("/catalog/person/person/plural")`        |
| `PRODUCT_IDS`   | product          | `t("/catalog/product/product/plural")`      |
| `PRODUCT_PROFILE_IDS` | productProfile | `t("/catalog/product/productProfile/plural")` |
| `PRODUCT_PACKING_IDS` | productPacking | `t("/catalog/product/productPacking/plural")` |
| `PRODUCT_VARIANT_IDS` | productVariant | `t("/catalog/product/productVariant/plural")` |
| `SOCIETY_IDS`   | society          | `t("/catalog/company/society/plural")`      |
| `SALESPERSON_IDS` | salesperson    | `t("/catalog/person/person/plural")`        |

Unknown `_IDS` param: fall back to `t("/@word/<camelCase>")` as the label.

### Ends with `_LIST` (enum list / string array)

Render the raw array value, comma-joined at render time (the playground runtime handles arrays as strings via `.toString()`):

```jsx
{report.parameters?.STATUS_LIST && <dl>
  <dt>{t("/@word/statusList")}</dt>
  <dd>{report.parameters.STATUS_LIST}</dd>
</dl>}
```

### Other params (flags, enums, single values)

```jsx
{report.parameters?.FLOW && <dl>
  <dt>{t("/@word/flow")}</dt>
  <dd>{report.parameters.FLOW}</dd>
</dl>}
```

## Assembly — ordering

Parameters in the header follow a **fixed type order**, not SQL-appearance order. This matches the convention used across existing Zen templates (dates come first because they're the most universally relevant filter; IDs next; enums / flags last):

1. **Date range params** — names ending in `_START` or `_END`. Pair `_START` immediately before its matching `_END` (e.g. `DATE_START`, `DATE_END`, `AVAILABILITY_DATE_START`, `AVAILABILITY_DATE_END`).
2. **Entity ID params** — names ending in `_IDS`. Preserve SQL first-appearance order within this group.
3. **List / enum params** — names ending in `_LIST`.
4. **Other params** — anything else.

Within each group, preserve SQL first-appearance order.

The entire block sits inside `<section className="parameters">`:

```jsx
<section className="parameters">
  {report.parameters?.DATE_START && <dl>
    <dt>{t("/@word/dateStart")}</dt>
    <dd>{utils.formatDate(report.parameters.DATE_START)}</dd>
  </dl>}
  {report.parameters?.DATE_END && <dl>
    <dt>{t("/@word/dateEnd")}</dt>
    <dd>{utils.formatDate(report.parameters.DATE_END)}</dd>
  </dl>}
  {/* ... one per param ... */}
</section>
```

Every `<dl>` is wrapped in `{report.parameters?.PARAM && ...}` so omitted params don't render.

## Reference (from productionOrderConsumptionList)

The reference renders exactly six: `DATE_START`, `DATE_END`, `AVAILABILITY_DATE_START`, `AVAILABILITY_DATE_END`, `COMPANY_IDS` (as `_DESC`), `PERSON_IDS` (as `_DESC`). That matches the SQL's non-SHOW params that are commonly user-facing. Include all non-SHOW params from the SQL — the conditional guards mean unused ones stay invisible at render time.
