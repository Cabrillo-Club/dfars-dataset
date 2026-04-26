# DFARS Dataset

**Open dataset of Defense Federal Acquisition Regulation Supplement (DFARS) clauses for government contractors.**

[![License](https://img.shields.io/badge/license-CC--BY--4.0-blue.svg)](LICENSE)
[![Dataset Validation](https://github.com/Cabrillo-Club/dfars-dataset/actions/workflows/validate.yml/badge.svg)](https://github.com/Cabrillo-Club/dfars-dataset/actions/workflows/validate.yml)
[![Schema](https://img.shields.io/badge/schema-JSON%20Schema%20Draft%2007-green.svg)](schema/dfars-clause.schema.json)

A free, machine-readable dataset of 30 of the most frequently-cited DFARS clauses, with structured metadata covering applicability, key requirements, NIST 800-171 cross-references, flowdown obligations, and contractor-grade FAQs. Maintained by [Cabrillo Club](https://cabrilloclub.com) — built originally for our DFARS clause guides, now released for the GovCon community.

## What's in the dataset

30 DFARS clauses across 5 categories:

| Category | Count | Notable clauses |
|---|---:|---|
| Cybersecurity | 7 | 252.204-7012, 252.204-7019, 252.204-7020, 252.204-7021 |
| Supply chain | 7 | 252.225-7001, 252.246-7007 |
| General | 7 | 252.232-7003, 252.247-7023 |
| Intellectual property | 6 | 252.227-7013, 252.227-7014 |
| Small business | 3 | 252.219-7003, 252.219-7004 |

Every clause record contains:

```jsonc
{
  "clause": "252.204-7012",                  // FAR/DFARS clause number
  "slug": "252-204-7012",                    // URL-safe slug
  "title": "Safeguarding Covered Defense Information…",
  "category": "cybersecurity",
  "description": "…",                        // 2-4 sentence plain-English summary
  "applicability": "…",                      // when this clause is included in solicitations
  "keyRequirements": [...],                  // bullet list of contractor obligations
  "flowdown": true,                          // does this flow down to subcontractors?
  "relatedNist": ["AC-3.1.1", "…"],         // NIST 800-171 controls this clause invokes
  "relatedHubs": ["cmmc-2-0", "cui"],       // domain hubs this clause relates to
  "searchTier": "high",                      // search-volume tier (high|medium|low)
  "faq": [{ "question": "…", "answer": "…" }],
  "practicalExample": "…",                   // optional — real-world scenario
  "whyItMatters": "…",                       // optional — business impact
  "complianceCost": "…",                     // optional — typical implementation cost band
  "complianceChecklist": [...],              // optional — actionable steps
  "crossReferences": "…",                    // optional — related FAR/DFARS clauses
  "procurementGuidance": "…"                 // optional — RFP-language guidance
}
```

## Files

| File | Purpose |
|---|---|
| `data/dfars-clauses.json` | Full dataset, pretty-printed (recommended for browsing) |
| `data/dfars-clauses.min.json` | Compact single-file (recommended for runtime use) |
| `data/dfars-clauses.csv` | Tabular export — open in Excel/Sheets |
| `data/index.json` | Lightweight `{slug, clause, title, category, flowdown, searchTier}` index |
| `data/clauses/{slug}.json` | One file per clause — friendly for git diffs and per-clause CDN caching |
| `schema/dfars-clause.schema.json` | JSON Schema (Draft 07) for the clause record shape |

## Usage

### Node.js / TypeScript

```ts
import clauses from './data/dfars-clauses.min.json' assert { type: 'json' }

const cybersecurity = clauses.filter(c => c.category === 'cybersecurity')
const flowdown = clauses.filter(c => c.flowdown)
```

### Python

```python
import json
with open('data/dfars-clauses.json') as f:
    clauses = json.load(f)

# All clauses with NIST 800-171 mappings
nist_mapped = [c for c in clauses if c.get('relatedNist')]
```

### Shell (jq)

```bash
# List all cybersecurity clauses
jq '.[] | select(.category == "cybersecurity") | .clause' data/dfars-clauses.json

# Find clauses related to a specific NIST control
jq '.[] | select(.relatedNist | contains(["3.1.1"])) | .clause' data/dfars-clauses.json
```

### Direct fetch from GitHub raw

```js
const r = await fetch('https://raw.githubusercontent.com/Cabrillo-Club/dfars-dataset/main/data/dfars-clauses.min.json')
const clauses = await r.json()
```

## Why this dataset exists

DFARS clauses determine eligibility, compliance cost, and risk for every defense contract. But machine-readable, contractor-friendly versions don't exist publicly:

- The official DFARS at [acquisition.gov](https://www.acquisition.gov/dfars) is HTML/PDF only.
- Existing aggregators are paywalled or not open data.
- Most published clause databases lack cross-references to NIST 800-171, which is essential for CMMC compliance scoping.

This dataset solves all three: structured JSON, free under CC-BY-4.0, and hand-curated cross-references to NIST controls and CMMC requirements.

## Validation

Every PR runs schema validation against `schema/dfars-clause.schema.json` via GitHub Actions. Run locally:

```bash
npm install
npm test
```

## Data quality notes

- **Authority:** Clause text is summarized from the [official DFARS](https://www.acquisition.gov/dfars) — always consult the official source for legal interpretation. This dataset is reference material, not legal advice.
- **NIST mappings:** Curated from publicly available CMMC scoping guidance and the NIST 800-171 control catalog. Minor revisions occur per [NIST SP 800-171 Rev. 3](https://csrc.nist.gov/publications/detail/sp/800-171/rev-3/final).
- **Last review:** See `CHANGELOG.md` for per-clause update dates.

## Contributing

Pull requests welcome — see [CONTRIBUTING.md](CONTRIBUTING.md). The repo is canonical-source for our [DFARS clause guides](https://cabrilloclub.com/insights/dfars-clauses), so changes here ship to production.

## Citation

If you use this dataset in research or public analysis, please cite:

```
Cabrillo Club (2026). DFARS Dataset: Open dataset of Defense Federal Acquisition
Regulation Supplement clauses with NIST 800-171 cross-references. v1.0.
https://github.com/Cabrillo-Club/dfars-dataset
```

## License

Released under [Creative Commons Attribution 4.0 International (CC-BY-4.0)](LICENSE).

You're free to use, share, and adapt this dataset for any purpose, including commercial — please credit "Cabrillo Club" with a link to https://github.com/Cabrillo-Club/dfars-dataset.

## About Cabrillo Club

[Cabrillo Club](https://cabrilloclub.com) builds private AI tooling for defense contractors — opportunity intelligence, proposal automation, and CMMC-ready compliance workflows. Our [Signals](https://cabrilloclub.com/signals) product surfaces relevant federal opportunities; [ProposalOS](https://cabrilloclub.com/proposal-os) automates compliant proposal production.

Questions? File an issue or reach us at [cabrilloclub.com/contact](https://cabrilloclub.com/contact).
