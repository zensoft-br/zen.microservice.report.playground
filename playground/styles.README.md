# styles.scss

## Basic report structure

```
.report-container
│
├── .status-stamp (absolute)
│
├── header (main report header)
│   ├── .brand (logo/company info)
│   ├── h1 (report title)
│   └── dl (parameters)
│       ├── div { dt, dd } (parameter 1)
│       └── div { dt, dd } (parameter 2)
│
├── .page-header
├── .page-footer
│
├── main (body)
│   ├── .kpi-grid (dashboard/summary metrics)
│   │   └── dl (the card)
│   │       ├── div { dt, dd }
│   │       └── .kpi-trend (trend span)
│   │
│   └── section (group)
│       ├── header (group header)
│       ├── .group-content
│       │   ├── table
│       │   │   ├── thead > tr > th
│       │   │   ├── tbody > tr > td
│       │   │   └── tfoot > tr > td
│       │   └── section (nested group)
│       └── footer (group footer)
│
└── footer (final document footer: terms, legal, signatures)
```