# Using DFARS Dataset in Node.js / TypeScript

## Install

```bash
npm install @cabrillo-club/dfars-dataset
```

## Basic usage

```ts
import clauses from '@cabrillo-club/dfars-dataset'

console.log(`${clauses.length} DFARS clauses loaded`)
console.log(clauses[0].clause, '-', clauses[0].title)
```

## Filter by category

```ts
import clauses from '@cabrillo-club/dfars-dataset'

const cybersecurity = clauses.filter(c => c.category === 'cybersecurity')
const flowdownClauses = clauses.filter(c => c.flowdown)
const highSearch = clauses.filter(c => c.searchTier === 'high')
```

## Find clauses by NIST control

```ts
import clauses from '@cabrillo-club/dfars-dataset'

function findByNistControl(controlId: string) {
  return clauses.filter(c => c.relatedNist.some(n => n.includes(controlId)))
}

const auditClauses = findByNistControl('3.3.1')  // returns clauses citing AU-3.3.1
```

## Type definitions

If you're using TypeScript, copy the type definition from this repo:

```ts
type DFARSCategory = 'cybersecurity' | 'small-business' | 'intellectual-property' | 'supply-chain' | 'general'
type SearchTier = 'high' | 'medium' | 'low'

interface FAQ {
  question: string
  answer: string
}

interface DFARSClause {
  clause: string
  slug: string
  title: string
  category: DFARSCategory
  description: string
  applicability: string
  keyRequirements: string[]
  flowdown: boolean
  relatedNist: string[]
  relatedHubs: string[]
  searchTier: SearchTier
  faq: FAQ[]
  practicalExample?: string
  whyItMatters?: string
  complianceCost?: string
  complianceChecklist?: string[]
  crossReferences?: string
  procurementGuidance?: string
}
```

## Using individual clause files

For per-clause CDN caching or git-friendly storage, use the per-slug files:

```ts
const clause = await fetch(
  `https://raw.githubusercontent.com/cabrillo-club/dfars-dataset/main/data/clauses/252-204-7012.json`
).then(r => r.json())
```

## Building a search index

```ts
import clauses from '@cabrillo-club/dfars-dataset'

const searchIndex = clauses.flatMap(c => [
  { type: 'clause', value: c.clause, slug: c.slug, title: c.title },
  ...c.keyRequirements.map(r => ({ type: 'requirement', value: r, slug: c.slug })),
  ...c.faq.map(f => ({ type: 'faq', value: f.question, slug: c.slug })),
])
```
