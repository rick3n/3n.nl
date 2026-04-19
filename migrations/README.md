# Database Migrations

This directory contains all versioned SQL migrations for the project.  
Migrations are written for **PostgreSQL 14+** and follow a strict naming and structure convention.

---

## Naming Convention

```
V{version}__{description}.sql
```

| Segment | Rule | Example |
|---|---|---|
| `V{version}` | Monotonically increasing integer | `V1`, `V2`, `V10` |
| `__` | Double underscore separator | — |
| `{description}` | snake_case, imperative verb | `create_users_table` |

---

## File Structure

Each migration file contains **two clearly labelled sections**:

```sql
-- UP MIGRATION   → forward change (CREATE, ALTER, INSERT …)
-- DOWN MIGRATION → full reversal  (DROP, ALTER REVERT …)
```

The DOWN block is commented out by default to prevent accidental execution.  
Uncomment and run it deliberately during a rollback.

---

## Migration History

| Version | File | Description | Issue |
|---|---|---|---|
| V1 | `V1__create_users_table.sql` | Create `users` table for JWT authentication | #2 |

---

## Running Migrations

### Apply (UP)
```bash
psql -U <user> -d <database> -f migrations/V1__create_users_table.sql
```

### Rollback (DOWN)
Extract and uncomment the `-- DOWN MIGRATION` block, then run:
```bash
psql -U <user> -d <database> -c "
  DROP INDEX  IF EXISTS idx_users_is_active;
  DROP INDEX  IF EXISTS idx_users_email;
  DROP TABLE  IF EXISTS users;
"
```

---

## Conventions & Rules

- ✅ All timestamps use `TIMESTAMP WITH TIME ZONE` (UTC-aware)
- ✅ UUIDs generated via `gen_random_uuid()` (requires `pgcrypto`)
- ✅ Foreign key columns are always indexed
- ✅ `IF NOT EXISTS` / `IF EXISTS` guards on all DDL statements
- ✅ Every migration is reviewed via PR before merging to `main`
- ❌ Never modify a migration that has already been applied to production
- ❌ Never store plaintext passwords — `password_hash` only
