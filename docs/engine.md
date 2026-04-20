# Especificação do motor de relatórios

> Este é o documento mais importante do kit. Descreva aqui TUDO que seu
> serviço de geração expõe para os templates. Se estiver errado ou incompleto,
> a IA vai inventar APIs.

## O que é este repositório

Repositório de **templates de relatórios** consumidos pelo nosso serviço interno
de geração de relatórios. Cada relatório é composto por:

1. Uma estrutura de dados em JSON `data.json` (normalmente um array gerado por instrução SQL e exportado para JSON)
2. Um **template JSX** `index.jsx` que recebe a estrutura de dados e renderiza o relatório
3. Um **arquivo de template** `template.json` com as definições do relatório
4. Arquivos auxiliares (`jsx`, `css`, etc...)

## Estrutura de pastas

```
/playground
  styles.css - estilos compartilhados
  utils.jsx - componentes React e funções compartilhados
  /<slug-do-relatorio>
    data.json
    data.schema.json
    index.jsx
    styles.css
    template.json
```

## Arquivo template.json

### Definição do arquivo `template.json`

```typescript
export type TemplateEngineType =
  | "eta"
  | "handlebars"
  | "jsx"
  | "liquid"
  | "nunjucks";

export interface Template {
  engine: TemplateEngineType;

  template: {
    source: string | Record<string, string>;
    entry?: string;
  };

  data?: Record<string, any>;

  assets?: {
    snippets?: Record<string, string>;
    scripts?: Record<string, string>;
    styles?: string[];
  };

  i18n?: {
    locale: string;
    fallbackLocale?: string;
    resources: Record<string, Record<string, any> | string>;
  };

  meta?: Record<string, any>;

  options?: Record<string, any>;
}
```

### Exemplo completo do arquivo `template.json`

```json
{
  "engine": "jsx",
  "template": {
    "source": "@file:index.jsx",
  },
  "assets": {
    "scripts": {
      "utils.jsx": "@file:/utils.jsx",
      "script1.jsx": "export const mult = (a, b) => a * b;"
    },
    "styles": ["@file:/styles.css", "@file:styles.css"]
  }
}
```

- Valores que iniciam com "@file:" são injetados a partir dos respectivos arquivos
- Caso a seção `template` não esteja presente, utiliza o arquivo `index.jsx` como padrão
- `snippets` são trechos reutilizáveis referenciáveis por nome dentro dos templates

## Como o template é executado

O serviço recebe:

- O template do relatório `template.json`
- Um objeto `data` (resultado da query SQL convertido em JSON)

E renderiza um relatório exportando o componente default do template:

```jsx
// Assinatura esperada
export default function ({ data = [], meta = {}, t }) {
  const { report = {} } = meta;
  return (
    <div className="report-wrapper">
      <div className="report-container"></div>
    </div>
  );
}
```

- `data` corresponde ao conteúdo de `data.json` (normalmente um array)
- `meta` corresponde ao campo `meta` definido em template.json
- `t` é uma função de tradução (`t("/path/resourceKey")`) que consulta os recursos de i18n.resources

## Estrutura padrão de um relatório

```
.report-wrapper
│
└── .report-container (The "physical" page / Individual document)
    │
    ├── .stamp (Watermark)
    │
    ├── header (Report header)
    │   ├── .brand (Logo / Company info)
    │   ├── h1 (Report title)
    │   └── section.parameters (Parameters - 1 <dl> per parameter)
    │       └── dl (Parameter)
    │           ├── dt (Label)
    │           └── dd (Value)
    │
    ├── .page-header (Page header)
    ├── .page-footer (Page footer)
    │
    ├── main (Report body)
    │   ├── .kpi-grid (Dashboard / Summary metrics)
    │   │   └── dl (Card)
    │   │       ├── div { dt, dd }
    │   │       └── .kpi-trend (trend span)
    │   │
    │   └── section (Group - optional)
    │       ├── header (Group header - optional)
    │       ├── .content (Data - required)
    │       │   ├── Table (Lists)
    │       │   │   └── Column (1 per column)
    │       │   └── section (Nested group)
    │       │       └── ...
    │       └── footer (Group footer - optional)
    │
    └── footer (Final document footer: terms, legal, signatures)
```

### Component Table (exportado por utils.jsx)

```jsx
<Table data={data} visibleColumns={["col1", "col2"]}>
  <Column
    id="col1"
    header={t("/@word/col1")}
    headerClassName="number"
    className="number"
    cellValue={({ row }) => row.id}
    cell={({ row, value }) => utils.formatNumber(value)}
    footerValue={({ data }) => data.length}
    footer={({ data, value }) => utils.formatNumber(value)}
  />
</Table>
```

- `id` identificador da coluna
- `visibleColumns` é opcional. Quando omitido todas as colunas são exibidas
- `cellValue` retorna o valor tipado (ex: Number). Quando omitido, retorna a row[id]
- `cell` recebe o valor retornado por cellValue e retorna o valor formatado ou um jsx
- `footerValue` retorna o valor tipado (ex: Number)
- `footer` retorna o valor formatado ou um jsx

## Helpers de formatação

Importados de `playground/utils.jsx`:

```jsx
import * as utils from "./utils.jsx";

utils.formatCurrency(1234.5); // "R$ 1.234,50"
utils.formatDate("2025-03-15"); // "15/03/2025"
utils.formatNumber(1.23); // "1,23"
```

## Limitações conhecidas

- Templates são renderizados em ambiente isolado; NÃO há acesso a `window`,
  `document`, `fetch` ou filesystem.
- JavaScript moderno é suportado (ES2022), mas evite `async/await` no render.
- Tamanho máximo do JSON de entrada: 50 MB.
- Tempo máximo de renderização: 60 segundos.

## Exemplo básico

Este exemplo demonstra o mínimo necessário: cabeçalho, parâmetros, agrupamento simples e tabela. Para KPIs, watermark (stamp), page-header/footer e totalizadores de grupo, veja os golden examples em `templates`.

### template.json

```json
{
  "engine": "jsx",
  "assets": {
    "scripts": {
      "utils.jsx": "@file:/utils.jsx"
    },
    "styles": ["@file:/styles.css", "@file:styles.css"]
  },
  "meta": {
    "report": {
      "title": "User Report",
      "parameters": {
        "dateStart": "2026-01-01",
        "dateEnd": "2026-01-31"
      }
    }
  }
}
```

### data.json

`data.json` deve conter no máximo 10 registros representativos, cobrindo casos normais e de borda. Volume real, schema completo e casos de borda estão descritos em `data.schema.json`. Ao gerar ou modificar templates, consulte o schema — não assuma estrutura a partir do data.json.

```json
[
  {
    "id": 1001,
    "name": "John Anderson",
    "age": 30,
    "department": "Engineering"
  },
  {
    "id": 1002,
    "name": "Jane Smith",
    "age": 25,
    "department": "Marketing"
  },
  {
    "id": 1003,
    "name": "Alice Johnson",
    "age": 28,
    "department": "Engineering"
  }
]
```

### index.jsx

```jsx
import * as utils from "./utils.jsx";
import { Column, Table } from "./utils.jsx";

export default function ({ data = [], meta = {}, t }) {
  const { report = {} } = meta;

  // map by department
  const groupedData = data.reduce((acc, item) => {
    const dept = item.department || "Unknown";
    if (!acc[dept]) {
      acc[dept] = [];
    }
    acc[dept].push(item);
    return acc;
  }, {});

  return (
    <div className="report-wrapper">
      <div className="report-container">
        <header>
          <h1>{report.title}</h1>
          <section className="parameters">
            <dl>
              <dt>{t("/@word/dateStart")}</dt>
              <dd>{utils.formatDate(report.parameters?.dateStart)}</dd>
            </dl>
            <dl>
              <dt>{t("/@word/dateEnd")}</dt>
              <dd>{utils.formatDate(report.parameters?.dateEnd)}</dd>
            </dl>
          </section>
        </header>
        <main>
          {Object.entries(groupedData).map(([dept, items]) => (
            <section key={dept}>
              <header>
                <h2>{t("/@word/department")}: {dept}</h2>
              </header>
              <div className="content">
                <Table
                  data={items}
                  visibleColumns={["id", "name", "age"]}>
                  <Column id="id" header={t("/@word/id")} className="number" cell={({ value }) => utils.formatNumber(value)} />
                  <Column id="name" header={t("/@word/name")} />
                  <Column id="age" header={t("/@word/age")} className="number" cell={({ value }) => utils.formatNumber(value)} />
                  <Column id="department" header={t("/@word/department")} />
                </Table>
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
```

### styles.css

```css
/* já definido no styles.css global — redefinindo aqui como exemplo */
.number {
  text-align: right;
  font-variant-numeric: tabular-nums;
}
```

## Regras duras

- NUNCA importar bibliotecas externas além de `utils.jsx`.
- NUNCA usar `async`/`await` no componente de render.
- NUNCA definir cores inline — sempre classes de `styles.css`.
- SEMPRE usar `utils.formatCurrency`/`formatDate`/`formatNumber` para valores numéricos e datas.
- SEMPRE dar `id` único a cada `<Column>`.
- SEMPRE usar `key` em elementos dentro de `.map()`.
