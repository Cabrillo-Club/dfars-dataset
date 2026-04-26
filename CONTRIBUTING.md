# Contributing to DFARS Dataset

Thanks for your interest in improving the dataset. Contributions are welcome from anyone — contracting officers, primes, subs, attorneys, compliance professionals, and researchers.

## Ways to contribute

1. **Fix factual errors** — applicability, requirements, NIST mappings, or flow-down status
2. **Add missing clauses** — open an issue first so we can discuss inclusion (we try to keep this list focused on the most-cited clauses, not exhaustive)
3. **Improve FAQs** — answer common confusion points contractors actually hit in practice
4. **Add cross-references** — to FAR, related DFARS, or NIST controls
5. **Translate to other formats** — Excel templates, RDF, OpenAPI, etc.

## Development setup

```bash
git clone https://github.com/Cabrillo-Club/dfars-dataset.git
cd dfars-dataset
npm install
npm test
```

## Editing a clause

1. Edit `data/clauses/{slug}.json` — that's the canonical per-clause file
2. Run `npm run rebuild-aggregate` (script TBD — until then, edit `data/dfars-clauses.json`, `data/dfars-clauses.min.json`, `data/dfars-clauses.csv`, and `data/index.json` to match)
3. Run `npm test` to validate
4. Commit with a clear message — `fix(252.204-7012): correct flow-down clarification`

## Adding a clause

1. Open an issue first — describe the clause and why it should be added
2. Wait for maintainer signal before opening a PR — we may already be tracking it
3. New clause record must:
   - Match `schema/dfars-clause.schema.json`
   - Cite official sources for any non-obvious claims
   - Include at least 3 FAQs covering common confusion points
4. Add the clause to `data/clauses/{slug}.json`, update aggregate files, run `npm test`

## Validation

Every PR runs:

- `npm run validate` — JSON Schema validation
- `npm run check-consistency` — verify aggregate / min / per-clause / index agree
- `npm run lint` — JSON formatting and trailing newlines

## What we won't accept

- Legal interpretation or "advice" framing — this dataset is reference material, not legal counsel. Keep language neutral and factual.
- Unsourced changes to applicability or flow-down status.
- Clauses outside DFARS scope (FAR-only, agency-specific supplements like AFARS/NMCARS).

## Maintainer response time

Maintainers triage issues weekly. PRs that pass CI typically merge within 5 business days.

## License

By contributing, you agree your contributions will be licensed under [CC-BY-4.0](LICENSE).
