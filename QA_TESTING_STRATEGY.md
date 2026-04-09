# RentEasy QA & Testing Strategy

## 1) Backend Testing (JUnit 5 + Mockito + Spring)

### What is covered
- **Service layer unit tests (Mockito):** business logic in isolation
  - File: `backend/src/test/java/com/renteasy/service/ItemServiceTest.java`
- **Controller layer unit tests (MockMvc standalone):** request/response mapping
  - File: `backend/src/test/java/com/renteasy/controller/ItemControllerTest.java`
- **Repository layer tests (`@DataJpaTest`):** JPA query correctness
  - File: `backend/src/test/java/com/renteasy/repository/ItemRepositoryTest.java`
- **Integration test (`@SpringBootTest`):** full app context + endpoint
  - File: `backend/src/test/java/com/renteasy/integration/ItemApiIntegrationTest.java`

### Test DB (H2 in-memory)
- Profile config:
  - File: `backend/src/test/resources/application-test.properties`
- Uses `jdbc:h2:mem:...` and `ddl-auto=create-drop`.

### Run backend tests
```bash
cd backend
mvn clean test
```

---

## 2) Frontend Testing (Jest + React Testing Library)

### What is covered
- **Component + form test:** login form interactions and validation flow
  - File: `frontend/__tests__/login-page.test.tsx`
- **API call test with mocked backend responses:** auth login success/failure
  - File: `frontend/__tests__/api-client.test.ts`
- **Jest setup/config:**
  - `frontend/jest.config.ts`
  - `frontend/jest.setup.ts`

### Run frontend tests
```bash
cd frontend
npm run test
npm run test:coverage -- --watch=false
```

---

## 3) API Testing (Postman)

### Postman collection
- File: `backend/tests/postman/RentEasy-QA.postman_collection.json`

### Included scenarios
- Create Item
- Get Item by ID
- Update Item
- Delete Item

### Validations included
- HTTP status assertions
- `success` flag assertions
- response body field assertions
- save/reuse `itemId` via collection variables

---

## 4) End-to-End Testing (Playwright)

### Setup
- Config: `frontend/playwright.config.ts`
- Example spec: `frontend/e2e/crud.spec.ts`

### Example E2E flow
- Login
- Create record
- Update record
- Delete record

### Run
```bash
cd frontend
npm run test:e2e
```

---

## 5) CI/CD Integration (GitHub Actions)

### Workflow file
- `.github/workflows/ci.yml`

### Pipeline jobs
- **backend-tests**
  - `mvn -B clean verify`
- **frontend-tests**
  - `npm ci`
  - `npm run test:coverage -- --watch=false`

Build fails automatically if tests fail.

---

## 6) Coverage (80% threshold)

### Backend
- JaCoCo plugin added in `backend/pom.xml`
- Coverage report generated during test/verify
- Coverage check configured with minimum **80% line coverage**

Generate report:
```bash
cd backend
mvn clean verify
# report: backend/target/site/jacoco/index.html
```

### Frontend
- Coverage threshold enforced in `frontend/jest.config.ts` (global 80%)

Generate report:
```bash
cd frontend
npm run test:coverage -- --watch=false
```

---

## Best-practice notes
- Keep **unit tests fast** and isolated (Mockito / standalone MockMvc).
- Keep **integration tests realistic** with Spring context + H2.
- Prefer **deterministic selectors** (`getByRole`, `getByLabelText`) in UI tests.
- Use **API contract checks** in Postman for regression safety.
- Enforce quality gates in CI to stop regressions early.
