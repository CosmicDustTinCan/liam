---
"@liam-hq/db-structure": patch
"@liam-hq/erd-core": patch
---

♻️ Refactor SQL chunk processing to reduce memory errors.

Increases the likelihood of processing larger `.sql` files without encountering memory errors.
