# Using DFARS Dataset with jq

`jq` is the easiest way to slice and dice JSON datasets at the command line.

## Quick queries

```bash
# Count clauses
jq 'length' data/dfars-clauses.json

# List all clause numbers
jq -r '.[].clause' data/dfars-clauses.json

# All cybersecurity clauses
jq '.[] | select(.category == "cybersecurity") | .clause' data/dfars-clauses.json

# Clauses requiring flow-down
jq '.[] | select(.flowdown) | {clause, title}' data/dfars-clauses.json

# Clauses with NIST 800-171 mappings
jq '.[] | select(.relatedNist | length > 0) | {clause, nist: .relatedNist}' data/dfars-clauses.json
```

## Cross-referencing

```bash
# Which clauses cite 3.13.1 (boundary protection)?
jq '.[] | select(.relatedNist | any(test("3.13.1"))) | .clause' data/dfars-clauses.json

# Build a NIST → clauses inverted index
jq '[.[] | . as $c | .relatedNist[] | {nist: ., clause: $c.clause}] | group_by(.nist) | map({nist: .[0].nist, clauses: [.[].clause]})' data/dfars-clauses.json
```

## Export subsets

```bash
# Export only cybersecurity clauses
jq '[.[] | select(.category == "cybersecurity")]' data/dfars-clauses.json > cyber.json

# Export FAQ-only digest
jq '[.[] | {clause, title, faq}]' data/dfars-clauses.json > dfars-faqs.json

# Compliance checklist (markdown-friendly)
jq -r '.[] | "\n## \(.clause) — \(.title)\n" + (.keyRequirements[] | "- [ ] " + .)' data/dfars-clauses.json
```

## Statistics

```bash
# Counts by category
jq -r 'group_by(.category) | .[] | "\(length)\t\(.[0].category)"' data/dfars-clauses.json

# Average # of key requirements per clause
jq '[.[].keyRequirements | length] | add / length' data/dfars-clauses.json

# Clauses with most FAQs
jq '[.[] | {clause, faqs: (.faq | length)}] | sort_by(-.faqs) | .[0:5]' data/dfars-clauses.json
```
