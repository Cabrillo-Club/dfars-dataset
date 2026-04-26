#!/usr/bin/env node
// Validate every clause against schema/dfars-clause.schema.json

import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import Ajv from 'ajv'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const schema = JSON.parse(await readFile(join(ROOT, 'schema/dfars-clause.schema.json'), 'utf-8'))
const clauses = JSON.parse(await readFile(join(ROOT, 'data/dfars-clauses.json'), 'utf-8'))

const ajv = new Ajv({ allErrors: true })
const validate = ajv.compile(schema)

let failed = 0
clauses.forEach((c, i) => {
  if (!validate(c)) {
    failed++
    console.error(`✗ ${c.clause || `[${i}]`}`)
    for (const err of validate.errors) {
      console.error(`    ${err.instancePath} ${err.message}`)
    }
  }
})

if (failed > 0) {
  console.error(`\n${failed}/${clauses.length} clauses failed schema validation`)
  process.exit(1)
}
console.log(`✓ All ${clauses.length} clauses pass schema validation`)
