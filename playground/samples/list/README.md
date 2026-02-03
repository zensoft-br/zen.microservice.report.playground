## Basic report structure

```
.report-container
├── .status-stamp (absolute)
├── header (main report header)
│   ├── .brand (logo/company info)
│   ├── h1 (report title)
│   └── dl (parameters)
│       └── div { dt, dd }
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
│   └── section (recursive groups)
│       ├── header (group label)
│       ├── .group-content
│       │   ├── table
│       │   │   ├── thead > tr > th
│       │   │   ├── tbody > tr > td
│       │   │   └── tfoot > tr > td (columnar totals)
│       │   └── section (nested level)
│       └── footer (group summaries/sign-off)
│
└── footer (final document footer: terms, legal, signatures)
```