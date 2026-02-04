# styles.scss

## Basic report structure

```
.report-wrapper
│
└── .report-container (The "physical" page / Individual document)
    │
    ├── .stamp (Absolute)
    │
    ├── header (Report header)
    │   ├── .brand (Logo / Company info)
    │   ├── h1 (Report title)
    │   └── dl (Parameters)
    │       ├── div { dt, dd } (Parameter 1)
    │       └── div { dt, dd } (Parameter 2)
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
    │       ├── .content (Data)
    │       │   ├── table (Lists)
    │       │   │   ├── thead > tr > th
    │       │   │   ├── tbody > tr > td
    │       │   │   └── tfoot > tr > td
    │       │   └── section (Nested group)
    │       │       └── ...
    │       └── footer (Group footer - optional)
    │
    └── footer (Final document footer: terms, legal, signatures)
```