# Technical standard: Report internationalization (i18n)

## Overview

To ensure scalability and consistency across the Zen ecosystem, all reporting engines now support native internationalization (i18n). This system allows templates to decouple UI text from the reporting logic, enabling multi-language support and centralized terminology management.

## Configuration schema

The `i18n` object can be defined within the report template metadata.

```json
{
  "engine": "jsx",
  "i18n": {
    "locale": "pt-BR",
    "fallbackLocale": "fallback",
    "resources": {
      "pt-BR": "https://zenerp.app.br/resources.pt-BR.json",
      "fallback": {
        "/@word/example": "Example Text"
      }
    }
  }
}
```

### Property definitions:

* **`locale`**: The primary language for the report (default: `pt-BR`).
* **`fallbackLocale`**: The locale used if a key is missing from the primary resource.
* **`resources`**: A dictionary where keys are locale names and values are either a **Remote URI** (JSON) or an **Inline Object** (key-value pairs).

## Implementation in templates

The rendering engine automatically injects a translation helper function, `t`, into the template's entry point.

### JSX example

Destructure the `t` function from the props object:

```javascript
export default function({ data = [], t }) {
  return (
    <dl>
      <dt>{t("/@word/date")}</dt>
      <dd>{data.date}</dd>
      
      <dt>{t("/@word/status")}</dt>
      <dd>{data.status}</dd>
    </dl>
  );
}
```

## Resource Management Strategy

### Using Official Resources

The centralized Zen terminology can be referenced via the official resource URL. You can browse all available keys here:
👉 [Zen Official Resources (pt-BR)](https://zenerp.app.br/resources.pt-BR.json)

### Handling Missing Keys

If a required term (e.g., *"Quantidade produzida"*) is not yet present in the official Zen resource file, follow these steps:

1. **Define a Fallback Key**: Add the temporary key and translation to the `fallback` object within the template's `i18n` configuration.
2. **Naming Convention**: New keys must follow Zen naming standards (e.g., `/catalog/person/person`, `/@word/quantity`).
3. **Consultation**: **Consult the Lead Architect** before "inventing" new keys to ensure they align with future official updates.

## Development Policies

| Report Type | Requirement | Recommendation |
| --- | --- | --- |
| **Standard Zen Reports** | **Mandatory i18n** | Hardcoded strings are strictly prohibited. All labels must use `t()`. |
| **Custom Client Reports** | **Optional** | Developers may use hardcoded Portuguese text for speed if preferred. |

> [!IMPORTANT]
> Standard Zen reports will not be merged or accepted if they contain hardcoded strings. The use of resource keys is the only approved method for these files.
