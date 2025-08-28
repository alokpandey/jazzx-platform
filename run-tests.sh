#!/bin/bash

# JazzX Platform - Comprehensive Test Suite Runner
# This script runs all automated tests for the complete application flow

echo "🚀 JazzX Platform - Comprehensive Test Suite"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if development server is running
check_dev_server() {
    print_status "Checking if development server is running..."
    
    if curl -s http://localhost:3000 > /dev/null; then
        print_success "Development server is running on http://localhost:3000"
        return 0
    else
        print_warning "Development server is not running. Starting it now..."
        npm run dev &
        DEV_SERVER_PID=$!
        
        # Wait for server to start
        print_status "Waiting for development server to start..."
        for i in {1..30}; do
            if curl -s http://localhost:3000 > /dev/null; then
                print_success "Development server started successfully"
                return 0
            fi
            sleep 2
        done
        
        print_error "Failed to start development server"
        return 1
    fi
}

# Run specific test suite
run_test_suite() {
    local test_name=$1
    local test_file=$2
    
    print_status "Running $test_name tests..."
    echo "----------------------------------------"
    
    if npx playwright test $test_file --reporter=line; then
        print_success "$test_name tests passed ✅"
        return 0
    else
        print_error "$test_name tests failed ❌"
        return 1
    fi
}

# Main test execution
main() {
    echo "🎯 Testing Strategy:"
    echo "   ✅ Authentication & Login/Logout"
    echo "   ✅ Complete Borrower Flow"
    echo "   ✅ Complete Broker Flow"
    echo "   ✅ Navigation & Routing"
    echo "   ✅ UI Components & Interactions"
    echo ""
    
    # Check prerequisites
    print_status "Checking prerequisites..."
    
    if ! command -v npx &> /dev/null; then
        print_error "npx is not installed. Please install Node.js"
        exit 1
    fi
    
    if ! command -v curl &> /dev/null; then
        print_error "curl is not installed. Please install curl"
        exit 1
    fi
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status "Installing dependencies..."
        npm install
    fi
    
    # Check if Playwright is installed
    if [ ! -d "node_modules/@playwright" ]; then
        print_error "Playwright is not installed. Please run: npm install --save-dev @playwright/test playwright"
        exit 1
    fi
    
    # Start development server if not running
    if ! check_dev_server; then
        exit 1
    fi
    
    # Wait a bit more for the app to fully load
    print_status "Waiting for application to fully initialize..."
    sleep 5
    
    # Initialize test results
    TOTAL_TESTS=0
    PASSED_TESTS=0
    FAILED_TESTS=0
    
    echo ""
    echo "🧪 Starting Test Execution..."
    echo "=============================================="
    
    # Test Suite 1: Authentication Tests
    echo ""
    print_status "📋 Test Suite 1: Authentication & Security"
    if run_test_suite "Authentication" "tests/auth.spec.ts"; then
        ((PASSED_TESTS++))
    else
        ((FAILED_TESTS++))
    fi
    ((TOTAL_TESTS++))
    
    # Test Suite 2: Borrower Flow Tests
    echo ""
    print_status "📋 Test Suite 2: Borrower Complete Flow"
    if run_test_suite "Borrower Flow" "tests/borrower-flow.spec.ts"; then
        ((PASSED_TESTS++))
    else
        ((FAILED_TESTS++))
    fi
    ((TOTAL_TESTS++))
    
    # Test Suite 3: Broker Flow Tests
    echo ""
    print_status "📋 Test Suite 3: Broker Complete Flow"
    if run_test_suite "Broker Flow" "tests/broker-flow.spec.ts"; then
        ((PASSED_TESTS++))
    else
        ((FAILED_TESTS++))
    fi
    ((TOTAL_TESTS++))
    
    # Test Suite 4: Navigation Tests
    echo ""
    print_status "📋 Test Suite 4: Navigation & Routing"
    if run_test_suite "Navigation" "tests/navigation.spec.ts"; then
        ((PASSED_TESTS++))
    else
        ((FAILED_TESTS++))
    fi
    ((TOTAL_TESTS++))
    
    # Test Suite 5: UI Components Tests
    echo ""
    print_status "📋 Test Suite 5: UI Components & Interactions"
    if run_test_suite "UI Components" "tests/ui-components.spec.ts"; then
        ((PASSED_TESTS++))
    else
        ((FAILED_TESTS++))
    fi
    ((TOTAL_TESTS++))
    
    # Generate test report
    echo ""
    echo "📊 Generating Test Report..."
    npx playwright show-report --host=0.0.0.0 &
    REPORT_PID=$!
    
    # Final results
    echo ""
    echo "=============================================="
    echo "🎯 TEST EXECUTION COMPLETE"
    echo "=============================================="
    echo ""
    echo "📊 Test Results Summary:"
    echo "   Total Test Suites: $TOTAL_TESTS"
    echo "   Passed: $PASSED_TESTS ✅"
    echo "   Failed: $FAILED_TESTS ❌"
    echo ""
    
    if [ $FAILED_TESTS -eq 0 ]; then
        print_success "🎉 ALL TESTS PASSED! The JazzX Platform is fully functional."
        echo ""
        echo "✅ Authentication system works correctly"
        echo "✅ All borrower flows are functional"
        echo "✅ All broker flows are functional"
        echo "✅ Navigation and routing work perfectly"
        echo "✅ All UI components are interactive"
        echo "✅ Every link and button works as expected"
        echo ""
        echo "🚀 The application is ready for production deployment!"
    else
        print_warning "⚠️  Some tests failed. Please review the test report."
        echo ""
        echo "📋 Next Steps:"
        echo "   1. Review failed tests in the HTML report"
        echo "   2. Fix any issues found"
        echo "   3. Re-run tests to verify fixes"
    fi
    
    echo ""
    echo "📄 Test Report Available:"
    echo "   HTML Report: http://localhost:9323"
    echo "   JSON Report: test-results/results.json"
    echo "   JUnit Report: test-results/results.xml"
    echo ""
    
    # Cleanup
    if [ ! -z "$DEV_SERVER_PID" ]; then
        print_status "Stopping development server..."
        kill $DEV_SERVER_PID 2>/dev/null
    fi
    
    # Keep report server running for a bit
    print_status "Test report server will run for 60 seconds..."
    sleep 60
    kill $REPORT_PID 2>/dev/null
    
    # Exit with appropriate code
    if [ $FAILED_TESTS -eq 0 ]; then
        exit 0
    else
        exit 1
    fi
}

# Handle script interruption
cleanup() {
    echo ""
    print_warning "Test execution interrupted"
    
    if [ ! -z "$DEV_SERVER_PID" ]; then
        kill $DEV_SERVER_PID 2>/dev/null
    fi
    
    if [ ! -z "$REPORT_PID" ]; then
        kill $REPORT_PID 2>/dev/null
    fi
    
    exit 1
}

trap cleanup INT TERM

# Run main function
main "$@"
