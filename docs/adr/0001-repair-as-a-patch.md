# A repair is a patch, not a regeneration

Date: 2026-09-03
Status: accepted

## Context

When the nightly build fails after the React Engineer has written its files, the swarm runs up to three repair attempts. Until now each attempt handed the engineer its whole original task again with the build error appended, and every reply was a complete regeneration of everything the engineer owns, 17 to 32 files. The post-critic revision worked the same way with the critic's feedback in place of the error.

Three production runs on 2026-09-02 and 2026-09-03 lost the night this way, and the loop's own comment had predicted it: a regeneration that large trades the error it was given for a new one.

The first run fixed a token error in `og.tsx` on repair 1, then failed `tsc` on every attempt after that, regenerating 24, 27, 30 and 30 files, each pass trading old errors for new ones. The second run (33751361449, $4.54, 12 calls, 5 retries) returned 24, 24 and 26 files across its three attempts and left 32, 12 and 10 type errors behind; from attempt 2 on, every error lived in a file an earlier attempt had written and the current reply had dropped, and the attempt's own files were clean. The third run (33756500843, $4.26, 12 calls, 5 retries) fixed the stale-file problem with a slate reset and then failed a different gate at every attempt, with replies of 27, 17 and 19 files. A local run the same day showed the mirror image on the revision path: the revision that fixed a 719px overflow failed the static checks, the loop rolled back to the passing state, and the shipped night kept the overflow.

## Decision

A repair is a patch. The engineer receives a repair brief instead of its original task: the files it owns on disk this run, each printed in full, the Art Director's preset read-only, the complete error report verbatim, and the instruction to return only the files that must change, each complete, in the same `===FILE:path===` format. A file the reply omits stays on disk. A new file is allowed when a fix needs one. A file to delete is an empty `===FILE:path===` block, honored only for a file the engineer owns this run. The engineer's model, timeout and budget do not change; the system prompt's required-files section and gate line do (#447) — a patch call states the patch contract there instead of the full-generation one that used to contradict the brief.

The swarm merges the reply over the files on disk and checks the merged set, not the reply, for the required files and the shell posture. It writes the reply's files, deletes the emptied ones, and leaves the rest. The archive records the merged set, which is what shipped. The post-critic revision uses the same brief with the critic's feedback and the measured faults as the report, and merges the same way; its rollback to the passing state when the rebuild fails stays.

A problem with the engineer's first reply takes the same path (#577): a required file missing, a `<nav>` under `shell_posture: none`, a path outside the allowlist. The reply is written as it arrived, the problem is the report, and the patch is merged and checked the same way, for up to two rounds. Until then the swarm resent the whole task and took a second complete generation, 52.8k output tokens on 2026-09-18 to restore one file. A reply that leaves no engineer file on disk is still asked for again in full: there is nothing to patch, and the brief carries no mockup.

## Consequences

Each attempt sends and receives far fewer files, so there is less surface for a new slip and less to pay for. The error report is the whole task, so the engineer has to read it rather than rebuild around it.

The engineer must reason about files it did not write in this call. It sees them in full in the brief, and an error that names one of them is still its to fix. The brief says so.

The brief first listed the owned files by path and size. The engineer runs with no tools and one turn, so it could not open them, and on 2026-09-06 (#460) it patched the index route three times with three different guesses at its components' props, each contradicted by a file it could not read. Twenty-odd files of TSX cost far less than a lost night, so the brief carries their contents.

Nothing runs on the engineer's files between the failed build and the first repair. The restore of the engineer's files from the pre-run backup, and the slate reset that dropped whatever a regeneration omitted, both assumed a reply replaces everything; with a patch, Phase 3's files are the base, so both are gone. The pre-run backup is still what the swarm restores when the repairs run out.

An empty block now means something. The delimiter parser keeps one only when a caller asks; a full generation still drops it as the slip it always was.

## Alternatives considered

Keep the regeneration and tighten the prompt. Three runs with prompts that already asked for care showed the engineer cannot regenerate 20 files without one new error. The size of the reply, not its wording, was the fault.

Patch the repairs but leave the revision as a regeneration. The local run showed the revision failing for the same reason; a revision that touches one component to fix an overflow should not rewrite the other 20 files. One contract for both keeps one code path.
