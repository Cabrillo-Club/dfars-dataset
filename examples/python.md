# Using DFARS Dataset in Python

## Load the dataset

```python
import json
import urllib.request

# From local clone
with open('data/dfars-clauses.json') as f:
    clauses = json.load(f)

# From GitHub raw
url = 'https://raw.githubusercontent.com/cabrillo-club/dfars-dataset/main/data/dfars-clauses.min.json'
with urllib.request.urlopen(url) as r:
    clauses = json.loads(r.read())
```

## Filter

```python
cybersecurity = [c for c in clauses if c['category'] == 'cybersecurity']
flowdown = [c for c in clauses if c['flowdown']]
high_search = [c for c in clauses if c['searchTier'] == 'high']
```

## Cross-reference NIST controls

```python
from collections import defaultdict

nist_to_clauses = defaultdict(list)
for c in clauses:
    for control in c.get('relatedNist', []):
        nist_to_clauses[control].append(c['clause'])

# Which DFARS clauses invoke audit logging (AU)?
audit_clauses = {k: v for k, v in nist_to_clauses.items() if 'AU' in k or '3.3' in k}
```

## Use with pandas

```python
import pandas as pd

df = pd.DataFrame(clauses)

# Counts by category
print(df['category'].value_counts())

# Flowdown vs non-flowdown by category
print(df.groupby(['category', 'flowdown']).size())

# Average key requirement count
df['n_requirements'] = df['keyRequirements'].apply(len)
print(df.groupby('category')['n_requirements'].mean())
```

## Generate a compliance checklist for a project

```python
def compliance_checklist(applicable_clauses):
    """Generate a flat checklist for a contract that includes the given clauses."""
    items = []
    for c in clauses:
        if c['clause'] in applicable_clauses:
            items.append(f"## {c['clause']} — {c['title']}")
            for req in c.get('complianceChecklist') or c['keyRequirements']:
                items.append(f"- [ ] {req}")
            items.append('')
    return '\n'.join(items)

# Example: contract with CMMC + CDI clauses
checklist = compliance_checklist(['252.204-7012', '252.204-7019', '252.204-7020', '252.204-7021'])
print(checklist)
```
