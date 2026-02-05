# Plan Template

A well-structured plan is essential for successful orchestration. This template ensures all necessary information is provided for automatic execution.

## Template Structure

```markdown
# [Plan Name]

## Overview
Brief description of what this plan accomplishes.

## Prerequisites
- Tools required (e.g., pnpm, TypeScript)
- Files that must exist before starting
- Environment setup needed

## Phase 1: [Name]
**Type**: Sequential

**Requirements**:
- [Specific requirement 1]
- [Specific requirement 2]
- [Specific requirement 3]

**Inputs**:
- Read: [file1.ts, file2.ts]
- Reference: [existing patterns to follow]

**Outputs**:
- Create: [new-file1.ts, new-file2.ts]
- Modify: [existing-file.ts]

**Validation Criteria**:
- Type check: Zero errors
- Build: Success
- All requirements implemented
- [Specific criteria for this phase]

**Dependencies**: None (first phase)

---

## Phase 2: [Name]
**Type**: Sequential

**Requirements**:
- [Specific requirement 1]
- [Specific requirement 2]

**Inputs**:
- Read: [outputs from Phase 1]
- Reference: [patterns]

**Outputs**:
- Create: [files]
- Modify: [files]

**Validation Criteria**:
- [Criteria specific to this phase]

**Dependencies**: Phase 1 must complete successfully

---

## Phase 3: [Name]
**Type**: Parallel

**Sub-tasks**:

### 3.1: [Sub-task A Name]
**Requirements**:
- [Requirement 1]
- [Requirement 2]

**Outputs**:
- Create: [fileA1.ts, fileA2.ts]

**Validation**:
- [Criteria for sub-task A]

### 3.2: [Sub-task B Name]
**Requirements**:
- [Requirement 1]
- [Requirement 2]

**Outputs**:
- Create: [fileB1.ts, fileB2.ts]

**Validation**:
- [Criteria for sub-task B]

### 3.3: [Sub-task C Name]
**Requirements**:
- [Requirement 1]

**Outputs**:
- Create: [fileC1.ts]

**Validation**:
- [Criteria for sub-task C]

**Phase-level Validation**:
- All sub-tasks pass individual validation
- Integration: Sub-tasks work together
- Type check: Zero errors across all files
- Build: Success

**Dependencies**: Phase 2 must complete successfully

---

[Continue for all remaining phases...]

## Success Criteria

Overall success requires:
- All phases complete and validate successfully
- Final build passes
- Final type check passes
- All requirements from all phases met
```

## Example: E-Commerce System

```markdown
# E-Commerce Backend System

## Overview
Build a complete e-commerce backend with database, API layer, and authentication.

## Prerequisites
- pnpm installed
- PostgreSQL running locally
- TypeScript 5.x
- Node.js 20.x

## Phase 1: Database Schema
**Type**: Sequential

**Requirements**:
- Define User table with id, email, password_hash, created_at
- Define Product table with id, name, description, price, stock
- Define Order table with id, user_id, total, status, created_at
- Define OrderItem table with id, order_id, product_id, quantity, price
- All tables have proper foreign keys
- All timestamps default to NOW()

**Inputs**:
- Read: None (first phase)
- Reference: None

**Outputs**:
- Create: src/db/schema.ts

**Validation Criteria**:
- Type check: Zero errors
- Schema exports all table definitions
- Proper Drizzle ORM syntax
- Foreign key relationships defined correctly

**Dependencies**: None

---

## Phase 2: Database Client
**Type**: Sequential

**Requirements**:
- Create database connection pool
- Export typed database client
- Add connection error handling
- Load DATABASE_URL from environment

**Inputs**:
- Read: src/db/schema.ts
- Reference: Drizzle documentation patterns

**Outputs**:
- Create: src/db/client.ts

**Validation Criteria**:
- Type check: Zero errors
- Client properly typed with schema
- Connection pooling configured
- Error handling present

**Dependencies**: Phase 1 must complete

---

## Phase 3: Core Services
**Type**: Parallel

### 3.1: User Service
**Requirements**:
- createUser(email, password) function
- getUserById(id) function
- getUserByEmail(email) function
- Password hashing with bcrypt
- Proper error handling

**Outputs**:
- Create: src/services/user.service.ts

**Validation**:
- All functions properly typed
- Uses db client from Phase 2
- Bcrypt integration working

### 3.2: Product Service
**Requirements**:
- createProduct(name, description, price, stock) function
- getProductById(id) function
- listProducts(limit, offset) function
- updateStock(productId, quantity) function

**Outputs**:
- Create: src/services/product.service.ts

**Validation**:
- All functions properly typed
- Uses db client
- Stock management logic correct

### 3.3: Order Service
**Requirements**:
- createOrder(userId, items[]) function
- getOrderById(id) function
- getUserOrders(userId) function
- Calculate totals correctly
- Handle out-of-stock scenarios

**Outputs**:
- Create: src/services/order.service.ts

**Validation**:
- All functions properly typed
- Transaction handling for order creation
- Stock validation logic

**Phase-level Validation**:
- All services type check
- All services import db client correctly
- Build succeeds
- No circular dependencies

**Dependencies**: Phase 2 must complete

---

## Phase 4: API Routes
**Type**: Sequential

**Requirements**:
- POST /api/users - create user
- GET /api/users/:id - get user
- POST /api/products - create product
- GET /api/products - list products
- GET /api/products/:id - get product
- POST /api/orders - create order
- GET /api/orders/:id - get order
- All routes use services from Phase 3
- Proper request validation
- Error responses with status codes

**Inputs**:
- Read: src/services/*.service.ts
- Reference: Express.js patterns

**Outputs**:
- Create: src/api/routes/users.ts
- Create: src/api/routes/products.ts
- Create: src/api/routes/orders.ts
- Create: src/api/index.ts

**Validation Criteria**:
- Type check: Zero errors
- All routes properly typed
- Request/response types defined
- Error handling middleware present
- Build succeeds

**Dependencies**: Phase 3 must complete

---

## Success Criteria

- All 4 phases complete
- pnpm run check-types: Zero errors
- pnpm run build: Success
- All services integrate correctly
- Database schema properly defined
- API routes functional
```

## Key Elements to Include

### 1. Clear Phase Boundaries
Each phase should be:
- Self-contained where possible
- Have clear inputs and outputs
- Specify exact validation criteria
- List dependencies explicitly

### 2. Specific Requirements
Avoid vague requirements like "make it work" or "implement the feature."

**Bad:**
- Make the API work
- Add authentication

**Good:**
- Implement JWT token generation with 24-hour expiry
- Add middleware that validates Bearer token on protected routes
- Return 401 for invalid/expired tokens

### 3. Explicit Validation
State exactly what "passing" means:

**Bad:**
- Make sure it works

**Good:**
- Type check: Zero errors
- Build: Success
- All functions return correct types
- Error handling for null cases

### 4. File-Level Outputs
List specific files to create or modify:

**Bad:**
- Add the database stuff

**Good:**
- Create: src/db/schema.ts
- Create: src/db/client.ts
- Modify: src/index.ts (add db import)

### 5. Dependencies
Make phase dependencies explicit:
- "Dependencies: None" for first phase
- "Dependencies: Phase 1 must complete" for dependent phases
- "Dependencies: Phases 1, 2, 3 must complete" for later phases

## Anti-Patterns to Avoid

### ❌ Vague Requirements
```
Phase 1: Set up the project
Requirements:
- Make it ready to use
```

### ✓ Specific Requirements
```
Phase 1: Project Initialization
Requirements:
- Initialize pnpm workspace
- Install dependencies: drizzle-orm, postgres, express, zod
- Create tsconfig.json with strict mode enabled
- Create src/ directory structure
- Add type-check and build scripts to package.json
```

### ❌ Missing Validation
```
Phase 2: Create the API
Outputs:
- Create: api.ts
```

### ✓ Complete Validation
```
Phase 2: API Layer
Outputs:
- Create: src/api/routes.ts
- Create: src/api/middleware.ts
- Create: src/api/index.ts

Validation Criteria:
- Type check: Zero errors
- All routes properly typed with Request/Response types
- Middleware properly chains
- Error handler catches and formats errors
- Build produces valid JavaScript
```

### ❌ Implicit Dependencies
```
Phase 3: Use the database
Phase 4: Add API routes
```

### ✓ Explicit Dependencies
```
Phase 3: Database Client
Dependencies: None

Phase 4: API Routes
Dependencies: Phase 3 must complete (requires db client)
```

## Tips for Writing Plans

1. **Start with the end goal** - Know what the final system should do
2. **Work backwards** - Identify what needs to exist at each stage
3. **Group related work** - Phases that can run in parallel should be grouped
4. **Be specific** - The more specific your requirements, the better the implementation
5. **Include validation** - Every phase needs clear pass/fail criteria
6. **Test the plan** - Read through and imagine executing it step by step
