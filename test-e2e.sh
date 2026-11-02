#!/bin/bash
# GoLoanMe End-to-End Test Automation Script
# Run this script to verify all critical functionality

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_TOTAL=0

# Helper functions
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_test() {
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    echo -e "${YELLOW}[TEST $TESTS_TOTAL]${NC} $1"
}

print_pass() {
    TESTS_PASSED=$((TESTS_PASSED + 1))
    echo -e "${GREEN}✓ PASS${NC} $1\n"
}

print_fail() {
    TESTS_FAILED=$((TESTS_FAILED + 1))
    echo -e "${RED}✗ FAIL${NC} $1\n"
}

print_warning() {
    echo -e "${YELLOW}⚠ WARNING${NC} $1\n"
}

# Check if server is running
check_server() {
    if ! curl -s http://localhost:3000/api/health > /dev/null; then
        echo -e "${RED}ERROR: Dev server is not running!${NC}"
        echo "Please start the server with: npm run dev"
        exit 1
    fi
}

# ======================================
# PHASE 1: PRE-FLIGHT CHECKS
# ======================================
print_header "PHASE 1: PRE-FLIGHT CHECKS"

print_test "Checking Node.js version"
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -ge 18 ]; then
    print_pass "Node.js version $NODE_VERSION >= 18"
else
    print_fail "Node.js version $NODE_VERSION < 18 (required: >=18)"
fi

print_test "Checking npm installation"
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    print_pass "npm version $NPM_VERSION installed"
else
    print_fail "npm not found"
fi

print_test "Checking environment file"
if [ -f ".env.local" ]; then
    print_pass ".env.local file exists"
    
    # Check for required variables
    REQUIRED_VARS=("AUTH0_CLIENT_ID" "DATABASE_URL" "OPENROUTER_API_KEY" "CLOUDINARY_CLOUD_NAME")
    for VAR in "${REQUIRED_VARS[@]}"; do
        if grep -q "^$VAR=" .env.local; then
            print_pass "  - $VAR is set"
        else
            print_fail "  - $VAR is missing"
        fi
    done
else
    print_fail ".env.local file not found"
fi

print_test "Checking package.json"
if [ -f "package.json" ]; then
    print_pass "package.json exists"
else
    print_fail "package.json not found"
fi

print_test "Checking node_modules"
if [ -d "node_modules" ]; then
    print_pass "node_modules directory exists"
else
    print_warning "node_modules not found - run 'npm install'"
fi

print_test "Checking Prisma schema"
if [ -f "prisma/schema.prisma" ]; then
    print_pass "Prisma schema exists"
else
    print_fail "Prisma schema not found"
fi

# ======================================
# PHASE 2: SERVER HEALTH
# ======================================
print_header "PHASE 2: SERVER HEALTH CHECKS"

print_test "Checking if dev server is running"
check_server
print_pass "Dev server is running on http://localhost:3000"

print_test "Testing /api/health endpoint"
HEALTH_RESPONSE=$(curl -s http://localhost:3000/api/health)
if echo "$HEALTH_RESPONSE" | grep -q '"status":"ok"'; then
    print_pass "Health endpoint returns OK"
else
    print_fail "Health endpoint failed: $HEALTH_RESPONSE"
fi

# ======================================
# PHASE 3: API ENDPOINTS
# ======================================
print_header "PHASE 3: API ENDPOINT TESTS"

print_test "GET /api/posts (public)"
POSTS_RESPONSE=$(curl -s -w "%{http_code}" http://localhost:3000/api/posts)
HTTP_CODE="${POSTS_RESPONSE: -3}"
if [ "$HTTP_CODE" = "200" ]; then
    print_pass "Posts endpoint returns 200"
else
    print_fail "Posts endpoint returned $HTTP_CODE"
fi

print_test "GET /api/users/carmen (public)"
USER_RESPONSE=$(curl -s -w "%{http_code}" http://localhost:3000/api/users/carmen)
HTTP_CODE="${USER_RESPONSE: -3}"
if [ "$HTTP_CODE" = "200" ]; then
    print_pass "User profile endpoint returns 200"
else
    print_fail "User profile endpoint returned $HTTP_CODE"
fi

print_test "GET /api/me (protected - should fail without auth)"
ME_RESPONSE=$(curl -s -w "%{http_code}" http://localhost:3000/api/me)
HTTP_CODE="${ME_RESPONSE: -3}"
if [ "$HTTP_CODE" = "401" ]; then
    print_pass "Protected endpoint correctly returns 401 without auth"
else
    print_fail "Protected endpoint returned $HTTP_CODE (expected 401)"
fi

print_test "POST /api/posts (protected - should fail without auth)"
CREATE_POST_RESPONSE=$(curl -s -w "%{http_code}" -X POST http://localhost:3000/api/posts \
    -H "Content-Type: application/json" \
    -d '{"title":"Test","description":"Test","category":"education","goal":100}')
HTTP_CODE="${CREATE_POST_RESPONSE: -3}"
if [ "$HTTP_CODE" = "401" ]; then
    print_pass "Create post endpoint correctly returns 401 without auth"
else
    print_fail "Create post endpoint returned $HTTP_CODE (expected 401)"
fi

# ======================================
# PHASE 4: DATABASE CONNECTIVITY
# ======================================
print_header "PHASE 4: DATABASE CONNECTIVITY"

print_test "Checking Prisma Client"
if [ -d "node_modules/.prisma/client" ]; then
    print_pass "Prisma Client is generated"
else
    print_warning "Prisma Client not generated - run 'npm run prisma:generate'"
fi

print_test "Testing database connection via API"
# If posts endpoint works, database is connected
if echo "$POSTS_RESPONSE" | grep -q "200"; then
    print_pass "Database is accessible via API"
else
    print_fail "Database connection failed"
fi

# ======================================
# PHASE 5: FILE STRUCTURE
# ======================================
print_header "PHASE 5: FILE STRUCTURE VALIDATION"

CRITICAL_FILES=(
    "src/app/page.tsx"
    "src/app/layout.tsx"
    "src/app/explore/page.tsx"
    "src/app/posts/new/page.tsx"
    "src/app/wallet/page.tsx"
    "src/app/terms/page.tsx"
    "src/app/api/health/route.ts"
    "src/app/api/posts/route.ts"
    "src/app/api/me/route.ts"
    "src/lib/api-client.ts"
    "src/lib/db.ts"
    "src/lib/auth.ts"
    "src/lib/ledger.ts"
    "src/lib/llm.ts"
    "src/components/ui/Button.tsx"
    "src/components/layout/AuthHeader.tsx"
)

for FILE in "${CRITICAL_FILES[@]}"; do
    print_test "Checking $FILE"
    if [ -f "$FILE" ]; then
        print_pass "$FILE exists"
    else
        print_fail "$FILE not found"
    fi
done

# ======================================
# PHASE 6: FRONTEND PAGES
# ======================================
print_header "PHASE 6: FRONTEND PAGE ACCESSIBILITY"

PAGES=(
    "/"
    "/explore"
    "/posts/new"
    "/wallet"
    "/terms"
)

for PAGE in "${PAGES[@]}"; do
    print_test "Testing page: $PAGE"
    PAGE_RESPONSE=$(curl -s -w "%{http_code}" http://localhost:3000"$PAGE")
    HTTP_CODE="${PAGE_RESPONSE: -3}"
    if [ "$HTTP_CODE" = "200" ]; then
        print_pass "Page $PAGE returns 200"
    elif [ "$HTTP_CODE" = "307" ] || [ "$HTTP_CODE" = "302" ]; then
        print_warning "Page $PAGE redirects (probably requires auth)"
    else
        print_fail "Page $PAGE returned $HTTP_CODE"
    fi
done

# ======================================
# PHASE 7: BUILD TEST
# ======================================
print_header "PHASE 7: BUILD VERIFICATION"

print_test "Running TypeScript type check"
if npm run type-check > /dev/null 2>&1; then
    print_pass "No TypeScript errors"
else
    print_fail "TypeScript errors found - run 'npm run type-check'"
fi

print_test "Running ESLint"
if npm run lint > /dev/null 2>&1; then
    print_pass "No linting errors"
else
    print_warning "Linting errors found - run 'npm run lint'"
fi

# ======================================
# SUMMARY
# ======================================
print_header "TEST SUMMARY"

echo -e "Total Tests:  ${BLUE}$TESTS_TOTAL${NC}"
echo -e "Passed:       ${GREEN}$TESTS_PASSED${NC}"
echo -e "Failed:       ${RED}$TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}✓ ALL TESTS PASSED!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo "The application is ready for demo!"
    echo ""
    echo "Next steps:"
    echo "1. Test authentication by logging in via browser"
    echo "2. Create a post and make a pledge"
    echo "3. Generate contract terms via LLM"
    echo "4. Run full E2E tests per E2E_TEST_PLAN.md"
    exit 0
else
    echo -e "${RED}========================================${NC}"
    echo -e "${RED}✗ SOME TESTS FAILED${NC}"
    echo -e "${RED}========================================${NC}"
    echo ""
    echo "Please fix the failing tests before proceeding."
    echo "See E2E_TEST_PLAN.md for detailed troubleshooting."
    exit 1
fi

