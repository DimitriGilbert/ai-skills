# Error Handling

Comprehensive guide to handling errors and failures during orchestrated workflows.

## Error Categories

### 1. Implementation Errors

**What**: Implementer fails to complete the task

**Causes**:
- Missing files referenced in plan
- Unclear requirements
- Technical blockers (missing dependencies, environment issues)
- Implementer confusion about what to do

**Detection**:
- Implementer reports "cannot complete"
- Implementer asks questions (shouldn't happen in auto-execution)
- Timeout waiting for implementer
- Implementer creates wrong files

**Response**:
```
1. Log the failure reason
2. Retry implementer dispatch with clarified instructions (up to 2 retries)
3. If still failing after 2 retries:
   - HALT execution
   - Report to user: "Phase X implementation failed"
   - Provide implementer's error messages
   - Suggest plan revision
```

### 2. Validation Errors

**What**: Validator finds issues with implementation

**Causes**:
- Requirements not fully met
- Type errors
- Build failures
- Code quality issues
- Missing exports or incorrect patterns

**Detection**:
- Validator returns FAIL status
- Type check errors reported
- Build errors reported
- Code review identifies issues

**Response**:
```
1. This is NORMAL - expected part of workflow
2. Enter fix loop:
   a. Dispatch fixer with validator report
   b. Dispatch validator again
   c. Repeat up to 3 total validation attempts
3. If still failing after 3 attempts:
   - HALT execution
   - Report detailed failure to user
```

**Example**:
```
Validation Attempt 1: FAIL
├─ Issues: Missing type, incorrect export
├─ Fixer: Adds type, fixes export
└─ Validation Attempt 2: PASS ✓

Outcome: Continue to next phase
```

### 3. Fixer Errors

**What**: Fixer fails to resolve validation issues

**Causes**:
- Misunderstood the validator report
- Introduced new bugs while fixing
- Incomplete fixes (fixed some but not all issues)
- Fixed wrong things

**Detection**:
- Re-validation after fix still shows same errors
- Re-validation shows NEW errors that didn't exist before
- Fixer reports inability to fix

**Response**:
```
1. Count this as one attempt
2. Dispatch fixer again with more explicit instructions
3. After 3 total attempts (original validation + 2 fix attempts):
   - HALT execution
   - Report that fixes were unsuccessful
   - Show original issues and attempted fixes
```

**Example**:
```
Validation 1: FAIL (Issue: missing type on user_id)
Fix Attempt 1: Fixer adds type but creates new error
Validation 2: FAIL (Original issue fixed, new issue: wrong type)
Fix Attempt 2: Fixer fixes type correctly
Validation 3: PASS ✓

Outcome: Took 3 attempts but succeeded
```

### 4. Dependency Errors

**What**: Required files from previous phases don't exist or are incorrect

**Causes**:
- Previous phase didn't actually complete
- Previous phase created wrong files
- Files were created in wrong location
- Orchestration bug (skipped a phase)

**Detection**:
- Implementer reports "file X not found"
- Type errors about missing imports
- Build fails due to missing modules

**Response**:
```
1. HALT immediately - don't try to continue
2. Identify which phase was supposed to create the file
3. Check if that phase reported success
4. Report to user:
   - "Phase X requires file Y from Phase Z"
   - "Phase Z reported success but file not found"
   - "Possible orchestration error - review plan"
```

**Example**:
```
Phase 3 requires: src/db/client.ts (from Phase 2)
Phase 2 reported: ✓ Complete
Reality: File doesn't exist

Action: HALT
Report: "Dependency error - Phase 2 claimed success but output missing"
```

### 5. Integration Errors

**What**: Individual tasks pass validation but don't work together

**Causes**:
- Type mismatches between modules
- Circular dependencies
- Import/export issues
- Parallel tasks conflicted

**Detection**:
- Integration type check fails (individual checks passed)
- Integration build fails (individual builds passed)
- Runtime errors when components interact

**Response**:
```
1. Identify the conflicting modules
2. Dispatch specialized "integration fixer"
3. Re-run integration validation
4. If still failing:
   - Report which modules conflict
   - Suggest sequential execution instead of parallel
```

**Example**:
```
Phase 3 (Parallel):
├─ Task A: user.service.ts → ✓ Types pass
├─ Task B: order.service.ts → ✓ Types pass
└─ Task C: product.service.ts → ✓ Types pass

Integration Check: ✗ FAIL
Error: order.service imports User type but user.service doesn't export it

Action: Dispatch integration fixer
Fix: Add export to user.service.ts
Integration Check: ✓ PASS
```

### 6. Environment Errors

**What**: Build tools, dependencies, or environment not set up correctly

**Causes**:
- Missing npm packages
- Wrong Node.js version
- Database not running
- Build scripts not configured

**Detection**:
- Commands fail (pnpm not found, etc.)
- Type check command doesn't exist
- Build command errors immediately
- Import errors for known packages

**Response**:
```
1. Check if error is environmental vs code issue
2. If environmental:
   - HALT execution
   - Report: "Environment not ready"
   - List missing prerequisites
   - Don't try to fix code
3. User must fix environment, then restart
```

**Example**:
```
Validation runs: pnpm run check-types
Error: "pnpm: command not found"

Action: HALT
Report: "Environment error - pnpm not installed"
Suggestion: "Install pnpm and retry execution"
```

## Recovery Strategies

### Strategy 1: Retry with Clarification

**When**: First failure of implementer

**How**:
```
1. Analyze what went wrong
2. Enhance the dispatch with:
   - More explicit requirements
   - Additional examples
   - Specific file paths
   - Clearer expected outputs
3. Retry implementer
4. Max 2 retries total
```

**Example**:
```
Attempt 1 Failed: "Implementer confused about schema format"

Attempt 2 Enhanced Dispatch:
- Added: "Use Drizzle pgTable syntax"
- Added: "Example: export const users = pgTable('users', {...})"
- Added: "Reference existing file: src/db/example-schema.ts"

Attempt 2: ✓ Success
```

### Strategy 2: Fix Loop

**When**: Validation failures

**How**:
```
1. Validator identifies issues
2. Fixer attempts to resolve
3. Re-validate
4. Repeat up to 3 total validation attempts
5. Each attempt should show progress
```

**Example**:
```
Validation 1: FAIL (5 issues)
Fix 1: Resolves 4 issues
Validation 2: FAIL (1 issue remaining)
Fix 2: Resolves last issue
Validation 3: PASS ✓

Took 3 attempts but made progress each time
```

### Strategy 3: Isolated Testing

**When**: Integration failures after parallel execution

**How**:
```
1. Re-validate each parallel task individually
2. Identify which task(s) cause the integration failure
3. Fix only the problematic tasks
4. Re-run integration check
```

**Example**:
```
Integration FAIL: Type conflicts

Individual Re-checks:
├─ Task A alone: ✓ PASS
├─ Task B alone: ✓ PASS
└─ Task C alone: ✓ PASS

A + B together: ✓ PASS
A + C together: ✗ FAIL → Found the conflict!
B + C together: ✓ PASS

Fix: Adjust Task C exports
Integration: ✓ PASS
```

### Strategy 4: Graceful Degradation

**When**: Non-critical failures in low-priority tasks

**How**:
```
1. Mark task as "partial success"
2. Continue with remaining phases
3. Report at end: "Phase X had warnings but continued"
4. Let user decide if acceptable
```

**Example**:
```
Phase 3, Task B: Code works but has style warnings

Decision: Mark as partial success
Continue: Phases 4, 5, 6
Final Report: "All phases complete, Phase 3 Task B has style warnings"

User can decide to:
- Accept as-is
- Go back and clean up
```

### Strategy 5: Rollback

**When**: Fix attempts make things worse

**How**:
```
1. Detect that validation errors increased after fix
2. Restore previous version
3. Try different fix approach
4. Track fix attempts separately
```

**Example**:
```
Validation 1: FAIL (2 type errors)
Fix Attempt: Changes types
Validation 2: FAIL (5 type errors) ← WORSE!

Action: Rollback to Validation 1 state
Fix Attempt 2: Different approach
Validation 3: FAIL (1 type error) → Progress!
Fix Attempt 3: Fix last error
Validation 4: PASS ✓
```

## Error Messages

### Clear Error Reports

**Bad Error Report**:
```
Phase 3 failed
```

**Good Error Report**:
```
EXECUTION FAILED AT PHASE 3

Phase: Core Services (Parallel)
Task: User Service (3.1)
Failure Type: Validation failure after max fix attempts

VALIDATOR REPORT (Final Attempt):
Status: FAIL

Critical Issues:
1. src/services/user.service.ts:42
   - Type error: Cannot assign string to number
   - Expected: userId as number
   - Received: userId as string

2. src/services/user.service.ts:67
   - Missing export: createUser function not exported
   - Required by: API routes

FIX ATTEMPTS:
- Attempt 1: Fixed type error, but didn't fix export
- Attempt 2: Fixed export, but broke type again
- Attempt 3: Fixed type, but export still wrong

SUGGESTION:
Review user.service.ts type definitions and exports.
Consider updating plan to be more explicit about:
- Expected types for userId (number vs string)
- Which functions must be exported
```

### Diagnostic Information

Always include:
- Phase number and name
- Task number (if parallel)
- Failure type
- Specific files and line numbers
- What was attempted
- What the expected outcome was
- What actually happened
- Number of attempts made
- Suggestion for next steps

## Debugging Failed Executions

### Step 1: Identify Failure Point

```
Review execution log:
- Which phase failed?
- Was it implementation, validation, or integration?
- First failure or after retries?
```

### Step 2: Check Dependencies

```
Verify:
- Did all previous phases complete successfully?
- Do required input files exist?
- Are imports/exports correct from earlier phases?
```

### Step 3: Examine Validation Reports

```
Look at:
- What specific errors were reported?
- Did errors change between attempts?
- Did fixes make things better or worse?
```

### Step 4: Review Plan Requirements

```
Check if:
- Requirements were clear enough
- Requirements were achievable
- Requirements conflicted with each other
- Requirements assumed knowledge not provided
```

### Step 5: Determine Root Cause

```
Common root causes:
- Vague requirements → Update plan
- Missing dependencies → Fix environment
- Integration conflicts → Reorder phases
- Too ambitious → Break into smaller phases
```

## Prevention

### Write Better Plans

✓ **DO**:
- Be extremely specific in requirements
- List exact file paths
- Provide examples and references
- Specify validation criteria clearly
- Break large phases into smaller ones

✗ **DON'T**:
- Use vague terms like "make it work"
- Assume knowledge of patterns
- Skip validation criteria
- Make phases too large

### Set Realistic Expectations

✓ **DO**:
- Estimate phase complexity realistically
- Plan for 1-2 fix attempts per phase
- Allow time for integration testing
- Expect some failures (normal)

✗ **DON'T**:
- Expect perfect first-time success
- Rush through phases
- Skip integration checks
- Blame tools when plan was unclear

### Monitor Progress

✓ **DO**:
- Log each step
- Track fix attempt counts
- Note patterns in failures
- Learn from successful phases

✗ **DON'T**:
- Only check at the end
- Ignore warning signs
- Continue blindly after failures
- Skip post-execution review

## Summary

Error handling is not about avoiding errors (impossible) but about:

1. **Detecting** errors quickly and accurately
2. **Diagnosing** root causes correctly
3. **Recovering** with appropriate strategies
4. **Reporting** clearly for user action
5. **Learning** to prevent similar errors

The orchestrator's job is to handle expected errors gracefully (validation failures, simple fixes) and report unexpected errors clearly (environment issues, plan problems, dependency failures).

Remember: Validation failures are NORMAL. Integration issues are NORMAL. The system should handle these automatically. Only HALT for unexpected issues that require user intervention.
