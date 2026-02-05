# Workflow Patterns

Common patterns for orchestrating sequential and parallel phases in multi-phase development workflows.

**IMPORTANT**: You (the orchestrator agent) execute these patterns through natural language by dispatching subagents. There is NO code that runs this orchestration - you make decisions and dispatch implementers/validators/fixers through conversation. The "Agent Execution Flow" sections describe what YOU do, not what code does.

## Sequential Workflow

Execute phases one at a time, each depending on the previous.

### Pattern

```
Phase 1 → Validate → Pass
    ↓
Phase 2 → Validate → Pass
    ↓
Phase 3 → Validate → Pass
    ↓
Complete
```

### When to Use

Use sequential workflow when:
- Each phase depends on outputs from the previous phase
- Order matters significantly
- Parallel execution would create conflicts
- Testing must happen in sequence

### Example: API Development

```
Phase 1: Database Schema
├─ Implementer: Create schema.ts
├─ Validator: Check types, verify exports
└─ Result: schema.ts ✓

Phase 2: Database Client
├─ Implementer: Create client.ts (uses schema.ts)
├─ Validator: Check connection, verify types
└─ Result: client.ts ✓

Phase 3: Service Layer
├─ Implementer: Create services/*.ts (uses client.ts)
├─ Validator: Check business logic, verify types
└─ Result: services/*.ts ✓

Phase 4: API Routes
├─ Implementer: Create routes/*.ts (uses services/*.ts)
├─ Validator: Check endpoints, verify types
└─ Result: routes/*.ts ✓
```

### Agent Execution Flow

As the orchestrator agent, you:
1. Execute Phase 1 → dispatch implementer → wait for completion
2. Dispatch validator → wait for PASS/FAIL
3. If FAIL → dispatch fixer → re-validate (repeat up to 3 attempts)
4. If PASS → move to Phase 2
5. Repeat for each phase in sequence

No code runs this - YOU execute each step by dispatching subagents through conversation.

## Parallel Workflow

Execute multiple independent tasks simultaneously, then validate each.

### Pattern

```
Phase 3: Parallel Execution
├─ Task A → Validate A → Pass
├─ Task B → Validate B → Pass
└─ Task C → Validate C → Pass
    ↓
All Pass → Continue
```

### When to Use

Use parallel workflow when:
- Tasks are independent (no shared file edits)
- Order doesn't matter within the phase
- Can speed up execution significantly
- Each task can be validated separately

### Example: Service Layer

```
Phase 3: Core Services (Parallel)

Task 3.1: User Service
├─ Implementer A: Create user.service.ts
├─ Validator A: Check user operations
└─ Result: user.service.ts ✓

Task 3.2: Product Service
├─ Implementer B: Create product.service.ts
├─ Validator B: Check product operations
└─ Result: product.service.ts ✓

Task 3.3: Order Service
├─ Implementer C: Create order.service.ts
├─ Validator C: Check order operations
└─ Result: order.service.ts ✓

Integration Validation:
├─ Check: All services work together
├─ Check: Type check passes for all
├─ Check: Build succeeds
└─ Result: Phase 3 complete ✓
```

### Agent Execution Flow

As the orchestrator agent, you:
1. Dispatch all 3 implementers simultaneously (in same message or separate)
2. Wait for all 3 to report completion
3. Dispatch validator for Task 3.1 → get result
4. Dispatch validator for Task 3.2 → get result  
5. Dispatch validator for Task 3.3 → get result
6. For any that FAIL → dispatch fixer for that specific task → re-validate
7. Once ALL pass → run integration check (type check + build for all files together)
8. If integration PASS → move to Phase 4

You're making decisions and dispatching subagents, not running code.

## Mixed Sequential + Parallel

Combine both patterns for complex workflows.

### Pattern

```
Phase 1 (Sequential)
    ↓
Phase 2 (Sequential)
    ↓
Phase 3 (Parallel)
├─ Task A
├─ Task B
└─ Task C
    ↓
Phase 4 (Sequential)
    ↓
Phase 5 (Parallel)
├─ Task D
└─ Task E
    ↓
Complete
```

### Example: Full-Stack Application

```
Phase 1: Database Setup (Sequential)
└─ Create schema, migrations, client

Phase 2: Environment Config (Sequential)
└─ Set up .env, config loader, validation

Phase 3: Backend Services (Parallel)
├─ Auth service
├─ User service
├─ Product service
└─ Order service

Phase 4: API Layer (Sequential)
└─ Create Express app, routes, middleware

Phase 5: Frontend Components (Parallel)
├─ Auth components
├─ Product list component
├─ Cart component
└─ Checkout component

Phase 6: Integration (Sequential)
└─ Wire frontend to backend, test flows
```

### Agent Execution Flow

As the orchestrator agent, you execute each phase in order by dispatching the appropriate subagents:

**Phase 1**: Dispatch implementer for database setup → validate → fix if needed → pass → continue

**Phase 2**: Dispatch implementer for environment config → validate → fix if needed → pass → continue

**Phase 3** (Parallel): 
- Dispatch implementers for all 4 services simultaneously
- Validate each service independently
- Fix any that fail
- Run integration check once all pass
- Continue

**Phase 4**: Dispatch implementer for API layer → validate → fix if needed → pass → continue

**Phase 5** (Parallel):
- Dispatch implementers for all 4 components simultaneously
- Validate each component
- Fix any that fail
- Run integration check
- Continue

**Phase 6**: Dispatch implementer for integration work → validate → fix if needed → pass → complete

You execute this flow through agent dispatching, not code.

## Dependency Patterns

### Linear Dependencies

Each phase depends on the immediately previous one.

```
Phase 1 ──> Phase 2 ──> Phase 3 ──> Phase 4
```

Example:
```
Schema ──> Client ──> Services ──> API
```

### Multi-Level Dependencies

Later phases depend on multiple earlier phases.

```
Phase 1 ──┐
          ├──> Phase 3
Phase 2 ──┘
```

Example:
```
Database Schema ──┐
                  ├──> Service Layer
Auth Setup ───────┘
```

### Diamond Dependencies

Converge and diverge.

```
      Phase 1
         ↓
    ┌────┴────┐
    ↓         ↓
Phase 2A  Phase 2B
    ↓         ↓
    └────┬────┘
         ↓
      Phase 3
```

Example:
```
      Database
         ↓
    ┌────┴────┐
    ↓         ↓
  Users    Products
    ↓         ↓
    └────┬────┘
         ↓
      Orders
```

## Error Recovery Patterns

### Retry with Backoff

```
Attempt 1: Implementer → Validator → FAIL
    ↓
Attempt 2: Fixer → Validator → FAIL
    ↓
Attempt 3: Fixer → Validator → FAIL
    ↓
HALT and report
```

### Partial Success

When some parallel tasks succeed and others fail:

```
Phase 3 (Parallel)
├─ Task A → ✓ PASS
├─ Task B → ✗ FAIL → Fix → ✓ PASS
└─ Task C → ✓ PASS
    ↓
All Pass → Continue
```

### Cascading Failure

If one task in a parallel phase fails after max attempts:

```
Phase 3 (Parallel)
├─ Task A → ✓ PASS
├─ Task B → ✗ FAIL (max attempts)
└─ Task C → ✓ PASS (but phase fails)
    ↓
HALT entire phase
Report: "Phase 3 failed: Task B could not pass validation"
```

## Integration Patterns

### Post-Phase Integration Check

After all tasks in a parallel phase complete:

```
Phase 3 (Parallel)
├─ Task A → ✓
├─ Task B → ✓
└─ Task C → ✓
    ↓
Integration Check:
├─ Type check all files together → ✓
├─ Build entire project → ✓
└─ Check imports/exports → ✓
    ↓
Continue
```

### Cross-Phase Integration

Check integration between phases:

```
Phase 2 complete
Phase 3 complete
    ↓
Integration Check:
├─ Does Phase 3 correctly use Phase 2 outputs?
├─ Are all imports correct?
└─ Do types align?
    ↓
If FAIL → Fix cross-phase issues
```

## Complete Workflow Example

### E-Commerce Platform

```
========================================
Phase 1: Foundation (Sequential)
========================================
Task: Database Schema
├─ Implementer: Create tables
├─ Validator: Verify schema
└─ Status: ✓ PASS

========================================
Phase 2: Database Client (Sequential)
========================================
Task: Connection & ORM
├─ Implementer: Create client
├─ Validator: Test connection
└─ Status: ✓ PASS

========================================
Phase 3: Core Services (Parallel)
========================================
Task 3.1: User Service
├─ Implementer A: Create user CRUD
├─ Validator A: Check operations
└─ Status: ✓ PASS

Task 3.2: Product Service
├─ Implementer B: Create product CRUD
├─ Validator B: Check operations
└─ Status: ✗ FAIL
    ├─ Fixer B: Fix type issues
    ├─ Validator B: Re-check
    └─ Status: ✓ PASS

Task 3.3: Order Service
├─ Implementer C: Create order logic
├─ Validator C: Check operations
└─ Status: ✓ PASS

Integration Check:
├─ Type check: ✓
├─ Build: ✓
└─ Status: ✓ ALL PASS

========================================
Phase 4: API Routes (Sequential)
========================================
Task: Express Routes
├─ Implementer: Create endpoints
├─ Validator: Check routes
└─ Status: ✓ PASS

========================================
Phase 5: Frontend (Parallel)
========================================
Task 5.1: Product List Component
├─ Implementer A: Create component
├─ Validator A: Check rendering
└─ Status: ✓ PASS

Task 5.2: Cart Component
├─ Implementer B: Create component
├─ Validator B: Check state mgmt
└─ Status: ✓ PASS

Integration Check:
├─ Build: ✓
└─ Status: ✓ ALL PASS

========================================
Execution Complete
========================================
Total Phases: 5
Total Tasks: 8
Fix Iterations: 1
Status: ✓ SUCCESS
```

## Best Practices

### Planning Parallel Phases

✓ **DO**:
- Ensure tasks are truly independent
- Check for file conflicts before parallel dispatch
- Validate each task independently
- Run integration check after all complete

✗ **DON'T**:
- Let parallel tasks modify the same file
- Skip integration validation
- Assume parallel = faster without checking dependencies

### Planning Sequential Phases

✓ **DO**:
- Make dependencies explicit
- Pass outputs clearly to next phase
- Validate before proceeding
- Stop immediately on failure

✗ **DON'T**:
- Continue with missing dependencies
- Skip phases assuming "it'll work"
- Let phases be too large (break them down)

### Mixing Patterns

✓ **DO**:
- Use sequential for foundation/setup phases
- Use parallel for independent feature work
- Return to sequential for integration
- Document why each pattern is chosen

✗ **DON'T**:
- Over-parallelize (diminishing returns)
- Under-parallelize (missing optimization opportunities)
- Mix patterns without clear reasoning
