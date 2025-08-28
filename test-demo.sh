#!/bin/bash

# JazzX Platform - Demo Test Runner
# This script runs essential tests to ensure every link and button works for demo

echo "🎯 JazzX Platform - Demo Readiness Tests"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if dev server is running
check_dev_server() {
    print_status "Checking development server..."
    
    if curl -s http://localhost:3000 > /dev/null; then
        print_success "Development server is running ✅"
        return 0
    else
        print_error "Development server is not running"
        print_status "Please start the development server with: npm run dev"
        return 1
    fi
}

# Run demo readiness tests
test_demo_readiness() {
    print_status "🎯 Testing Demo Readiness..."
    echo "   • Landing page loads correctly"
    echo "   • All buttons work properly"
    echo "   • All links are functional"
    echo "   • Forms are interactive"
    echo "   • Pages are responsive"
    echo "   • No JavaScript errors"
    echo ""

    if npx playwright test tests/demo-ready.spec.ts --project=chromium --reporter=line; then
        print_success "Demo readiness tests passed ✅"
        return 0
    else
        print_error "Demo readiness tests failed ❌"
        return 1
    fi
}

# Run complete flow tests
test_complete_flow() {
    print_status "🚀 Testing Complete Application Flow..."
    echo "   • All buttons and links functionality"
    echo "   • Complete borrower journey"
    echo "   • Complete broker journey"
    echo "   • Navigation and routing"
    echo "   • Form interactions"
    echo ""
    
    if npx playwright test tests/complete-flow.spec.ts --reporter=line; then
        print_success "Complete flow tests passed ✅"
        return 0
    else
        print_error "Complete flow tests failed ❌"
        return 1
    fi
}

# Main execution
main() {
    echo "🎯 Demo Requirements:"
    echo "   ✅ Every link must work"
    echo "   ✅ Every button must be functional"
    echo "   ✅ Login/logout must work with hardcoded credentials"
    echo "   ✅ Navigation must be seamless"
    echo "   ✅ No broken pages or dead ends"
    echo ""
    
    # Check prerequisites
    if ! command -v npx &> /dev/null; then
        print_error "npx is not installed. Please install Node.js"
        exit 1
    fi
    
    if ! command -v curl &> /dev/null; then
        print_error "curl is not installed. Please install curl"
        exit 1
    fi
    
    # Check dev server
    if ! check_dev_server; then
        exit 1
    fi
    
    # Wait for app to be ready
    print_status "Waiting for application to be ready..."
    sleep 3
    
    # Initialize results
    TOTAL_TESTS=0
    PASSED_TESTS=0
    FAILED_TESTS=0
    
    echo ""
    echo "🧪 Running Demo Readiness Tests..."
    echo "=================================="
    
    # Test 1: Demo Readiness
    echo ""
    if test_demo_readiness; then
        ((PASSED_TESTS++))
    else
        ((FAILED_TESTS++))
    fi
    ((TOTAL_TESTS++))
    
    # Test 2: Complete Flow
    echo ""
    if test_complete_flow; then
        ((PASSED_TESTS++))
    else
        ((FAILED_TESTS++))
    fi
    ((TOTAL_TESTS++))
    
    # Results
    echo ""
    echo "=================================="
    echo "🎯 DEMO READINESS RESULTS"
    echo "=================================="
    echo ""
    echo "📊 Test Summary:"
    echo "   Total Tests: $TOTAL_TESTS"
    echo "   Passed: $PASSED_TESTS ✅"
    echo "   Failed: $FAILED_TESTS ❌"
    echo ""
    
    if [ $FAILED_TESTS -eq 0 ]; then
        print_success "🎉 DEMO READY! All tests passed."
        echo ""
        echo "✅ Landing page loads correctly"
        echo "✅ All links and buttons are functional"
        echo "✅ Navigation works seamlessly"
        echo "✅ Forms are interactive"
        echo "✅ Responsive design works on all devices"
        echo "✅ No broken pages or dead ends"
        echo ""
        echo "🚀 Your JazzX Platform is ready for demonstration!"
        echo ""
        echo "📋 Demo Credentials:"
        echo "   Borrower: demo@borrower.com / Demo123!"
        echo "   Broker: broker@company.com / Broker123!"
        echo ""
        exit 0
    else
        print_error "❌ DEMO NOT READY - Some tests failed"
        echo ""
        echo "📋 Next Steps:"
        echo "   1. Review failed tests above"
        echo "   2. Fix any broken links or buttons"
        echo "   3. Re-run tests: ./test-demo.sh"
        echo ""
        exit 1
    fi
}

# Handle interruption
cleanup() {
    echo ""
    print_error "Test execution interrupted"
    exit 1
}

trap cleanup INT TERM

# Run main function
main "$@"
