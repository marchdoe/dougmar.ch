---
type: knowledge
tags: [glossary, area/core]
created: 2026-09-03
updated: 2026-09-03
aliases: []
sources: []
status: living
---

# The nightly redesign

Every night an agent swarm redesigns doug-march.com and archives what it shipped. This glossary fixes the words for how a night is built, checked, repaired and recorded.

## Language

**Night**:
One date's redesign as it shipped and was archived. There is one night per date.
_Avoid_: Build (that is one compile of the site), day

**Run**:
One execution of the swarm attempting to produce a night. A run either ships a night or fails and rolls the checkout back.
_Avoid_: Job, pipeline run, attempt

**Gate**:
A check a run must pass before it ships: the build, the static checks, the security scan, the surface measurements, the critics. A gate that fails names the errors a repair or revision must fix.
_Avoid_: Validation, check, test

**Repair attempt**:
One call to the React Engineer after a gate fails the build, bounded to three per run. Each attempt gets a repair brief and answers with a patch reply.
_Avoid_: Retry, regeneration

**Revision**:
One call to the React Engineer after the build passes but the screenshot critic or the surface gate asks for a change. It gets the same brief as a repair, with the critic's feedback as the errors. A revision that fails to rebuild is rolled back to the state that passed.
_Avoid_: Retry, post-critic fix

**Repair brief**:
What the engineer is told for a repair attempt or a revision: the files it owns on disk this run, the errors verbatim, and the rule to return only what must change.

**Patch reply**:
The engineer's answer to a repair brief: only the files that must change, each complete, plus any new file a fix needs. A file the reply omits stays as it is. An empty file block deletes that file.
_Avoid_: Regeneration, full reply

**Slate**:
The set of files the engineer owns on disk at a given moment of a run. A patch reply is merged over the slate; the merged slate is what ships and what the archive records.
_Avoid_: Working set, output
