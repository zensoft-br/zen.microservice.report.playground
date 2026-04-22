# i18n key lookup

Every i18n key resolution — title, column headers, parameter labels — is delegated to the shipped Node script `assets/lookup-i18n.mjs`. This file documents the script's algorithm and output contract. You don't hand-grep the catalog; you pass aliases in, read emit strings out.

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
  "title": "<report-name>",
  "columns": ["<alias1>", "<alias2>", ...],
  "params": ["<PARAM1>", "<PARAM2>", ...]
}
```

Aliases are the exact strings after `AS "..."` in the SQL. Params are the bind names (minus `SHOW_*`). Title is the output folder name (inferred per SKILL.md).

## Output contract

Each entry carries an `emit` string — paste it verbatim into the JSX:

- `result.title.emit` → `<h1>{<emit>}</h1>` content (after stripping the outer `t(...)` wrapper if needed, or just use as-is since it's already `t("...")`).
- `result.columns.<alias>.emit` → the column's `header:` value.
- `result.params.<NAME>.emit` → the `<dt>{<emit>}</dt>` content.

`result.summary.missingList` → drop straight into the "Reporting back" missing-keys section.

## How the resolver resolves

### Titles

Scans for keys ending in `/report/<name>`. First hit wins. Zero hits → fallback `/@unknown/report/<name>` (recorded as missing; grep-discoverable via the `/@unknown/` convention).

### Columns

1. **Aggregate prefixes** (`sum_`, `count_`, `avg_`, `min_`, `max_`): strip prefix, suffix-only lookup `/@word/<rest>`.
2. **Bare alias** (no underscore): `/@word/<alias>`.
3. **Multi-token aliases** (`<first>_<rest>`):
   - **Properties shortcut**: if token 2 is `properties`, try dotted-key match first (e.g., `product_properties_br_NCM` → `/catalog/product.properties.fiscal_br_NCM`).
   - **Namespace + suffix** (standard): scan keys whose last path segment equals the first token (filtered: no `/@*`, `/plural`, `/report/`, `/tag/`, no dotted segments, no `args*` descriptors). Score candidates: entity-doubled form (`/catalog/company/company`) beats single-segment (`/catalog/company`) beats `/fiscal/invoice`. Pair with `/@word/<rest-joined-by-underscore>`; if that misses and tokens ≥3, try `/@word/<last-token>`.
   - **Dotted-key catchall**: for other aliases, search dotted keys where `<first>.` starts a path segment and remaining tokens appear in order within it.
   - **Namespace-only fallback**: if namespace matched but suffix didn't → emit `utils.cellHeader(t("<ns>"), t("/@unknown/<rest>"))` with `/@unknown/` marking the gap (flagged missing).
   - **Suffix-only fallback**: if suffix matched but no namespace → emit `utils.cellHeader(t("/@word/<rest>"))` (suffix IS resolved, kept as `/@word/`).
   - **Raw fallback**: neither resolved → `utils.cellHeader(t("/@unknown/<full-alias>"))`, flagged missing.

### The `/@unknown/` convention

When a key **cannot be resolved** against the catalog, the resolver emits a `/@unknown/<segment>` key instead of `/@word/<segment>`. This makes unresolved keys stand out at render time (they render as the raw path since `/@unknown/*` is not in any locale) and gives the user a single grep pattern to find every gap: `rg "/@unknown/"`.

Rules:
- `/@word/*` is emitted ONLY when the key exists in the catalog — it's a positive signal.
- `/@unknown/*` is emitted for every miss — positive signal of "please translate this".
- Full namespace paths (e.g. `/fiscal/invoice`, `/catalog/company/company`) are emitted as-is when they resolve; when they don't, the resolver falls back to `/@unknown/<alias>`.

### Parameters

- `_START` / `_END` → `/@word/<camelCase>` (e.g., `DATE_START` → `/@word/dateStart`).
- `_IDS` (incl. numbered `_IDS_N`) → `/<area>/<entity>/plural` preferred, falls back to singular namespace, then `/@word/<entity>`.
- `_LIST` → `/@word/<camelCase>`; if missing, strip `List` suffix and retry (`statusList` → `status`).
- Others → `/@word/<camelCase>`.

## Scoring (namespace ties)

When multiple keys match a prefix, the resolver scores:
- +40 for entity-doubled pattern (`/catalog/person/person`)
- +25 for `/<area>/<entity>` (`/fiscal/invoice`)
- +10 for `/catalog/*` family
- −5 per path segment (shorter is better)

This matches Zen convention: entity-doubled forms are canonical for column headers, direct `/<area>/<entity>` for namespace headers.

## What the resolver does NOT handle

- **Indexed multi-part aliases** (`personCategory_code_1..5`): these need a 3-arg header like `utils.cellHeader(t("/catalog/person/personCategory"), t("/@word/code"), "1")`. The resolver returns them as unresolved fallbacks — you can upgrade to 3-arg manually if needed, or leave as missing and let the user pick.
- **Custom display logic** for JSONB object columns (`*_properties`): see `references/field-mapping.md` for the cell-stringify rule.
- **Monetary vs numeric sums**: the resolver only handles the header. The cell/footer formatter (`formatNumber` vs `formatCurrency`) comes from `field-mapping.md`.

## Troubleshooting

Script exits non-zero → check:
- Catalog path exists and is valid JSON (`node -e "JSON.parse(require('fs').readFileSync(process.argv[1]))"`).
- Input JSON path is readable and well-formed.

Output missing expected keys → inspect the `candidates` array in each entry. If the right key is in candidates but not chosen, the scoring is wrong for your case — record in missing-keys so the user can override.

Output has wrong dotted match → the alias-token-sequence is matching something spurious. Re-run with a tighter test case to reproduce, then adjust `findDottedKey` in the script.
