#!/usr/bin/env node
// Verify aggregate JSON, min JSON, and per-clause files agree.

import { readFile, readdir } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const aggregate = JSON.parse(await readFile(join(ROOT, 'data/dfars-clauses.json'), 'utf-8'))
const min = JSON.parse(await readFile(join(ROOT, 'data/dfars-clauses.min.json'), 'utf-8'))
const index = JSON.parse(await readFile(join(ROOT, 'data/index.json'), 'utf-8'))

if (aggregate.length !== min.length) {
  console.error(`✗ Aggregate has ${aggregate.length}, min has ${min.length}`)
  process.exit(1)
}
if (aggregate.length !== index.length) {
  console.error(`✗ Aggregate has ${aggregate.length}, index has ${index.length}`)
  process.exit(1)
}

const perClauseFiles = await readdir(join(ROOT, 'data/clauses'))
const jsonFiles = perClauseFiles.filter(f => f.endsWith('.json'))
if (jsonFiles.length !== aggregate.length) {
  console.error(`✗ Aggregate has ${aggregate.length}, per-clause dir has ${jsonFiles.length}`)
  process.exit(1)
}

let mismatches = 0
for (const c of aggregate) {
  const perClause = JSON.parse(await readFile(join(ROOT, 'data/clauses', `${c.slug}.json`), 'utf-8'))
  if (JSON.stringify(perClause) !== JSON.stringify(c)) {
    mismatches++
    console.error(`✗ ${c.slug}.json does not match aggregate entry`)
  }
}
if (mismatches > 0) {
  console.error(`\n${mismatches} per-clause files diverge from aggregate`)
  process.exit(1)
}

const slugSet = new Set(aggregate.map(c => c.slug))
if (slugSet.size !== aggregate.length) {
  console.error(`✗ Duplicate slugs in dataset`)
  process.exit(1)
}

const clauseSet = new Set(aggregate.map(c => c.clause))
if (clauseSet.size !== aggregate.length) {
  console.error(`✗ Duplicate clause numbers in dataset`)
  process.exit(1)
}

console.log(`✓ All ${aggregate.length} clauses consistent across aggregate / min / index / per-clause`)
