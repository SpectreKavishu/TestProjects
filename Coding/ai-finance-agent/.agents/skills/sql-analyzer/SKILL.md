# Skill: SQL Schema Analyzer
**Goal:** Analyze a provided SQL schema and suggest vector-search optimizations.
**Process:**
1. Read the `schema.sql` file.
2. Identify columns that could benefit from semantic search (e.g., stock descriptions).
3. Suggest the correct `CREATE INDEX` command using pgvector.
