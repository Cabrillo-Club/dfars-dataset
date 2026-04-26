#!/usr/bin/env node
// Lint: trailing newline, 2-space indent, valid JSON.

import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const files = [
  'data/dfars-clauses.json',
  'data/index.json',
  'schema/dfars-clause.schema.json',
]

let issues = 0
for (const f of files) {
  const raw = await readFile(join(ROOT, f), 'utf-8')
  try {
    JSON.parse(raw)
  } catch (e) {
    console.error(`✗ ${f}: invalid JSON — ${e.message}`)
    issues++
    continue
  }
  if (!raw.endsWith('\n')) {
    console.error(`✗ ${f}: missing trailing newline`)
    issues++
  }
}

if (issues > 0) {
  console.error(`\n${issues} lint issue(s) found`)
  process.exit(1)
}
console.log(`✓ Lint passed for ${files.length} files`)
