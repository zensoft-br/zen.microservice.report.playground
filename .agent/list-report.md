# Skill: List report generation
**Context** Use this skill whenever the user asks to "create a report" or "create a list report"

## Instructions
* There is a report template in templates/jsx/list. You should inspect `template.json`, `index.jsx`, `meta.json` and `data.json` files to learn from this template
* User must provide a folder with a `data.json` file, and the report must be generated in this folder
* Usually `data.json` contains a json array. You do not need to load all elements in context, you can use a sample with 20 elements
* Each property present in `data.json` elements should be added as a report column
