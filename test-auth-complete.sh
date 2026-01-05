#!/bin/bash

echo "🎯 COMPREHENSIVE AUTHENTICATION TEST"
echo "===================================="
echo ""

# Function to test the authentication flow
test_auth_flow() {
    echo "🔍 Testing Authentication Flow..."
    
    # First, let's test the login page is accessible
    echo "📋 Step 1: Testing login page access"
    curl -s -o /dev/null -w "Login page: %{http_code}" http://localhost:3000/login
    echo ""
    
    # Test protected routes without authentication
    echo "📋 Step 2: Testing protected routes without auth"
    curl -s -o /dev/null -w "Add User (no auth): %{http_code}" http://localhost:3000/users/add
    echo ""
    curl -s -o /dev/null -w "Add Service (no auth): %{http_code}" http://localhost:3000/services/add
    echo ""
    
    # Test public routes
    echo "📋 Step 3: Testing public routes"
    curl -s -o /dev/null -w "Home page: %{http_code}" http://localhost:3000/
    echo ""
    curl -s -o /dev/null -w "Users list: %{http_code}" http://localhost:3000/users
    echo ""
    curl -s -o /dev/null -w "Services list: %{http_code}" http://localhost:3000/services
    echo ""
    
    # Test debug pages
    echo "📋 Step 4: Testing debug pages"
    curl -s -o /dev/null -w "Role Access Test: %{http_code}" http://localhost:3000/role-access-test
    echo ""
    curl -s -o /dev/null -w "Auth Flow Test: %{http_code}" http://localhost:3000/auth-flow-test
    echo ""
    
    echo "✅ All HTTP tests completed"
    echo ""
}

# Run the test
test_auth_flow

echo "🚀 MANUAL TESTING INSTRUCTIONS:"
echo "==============================="
echo ""
echo "1. Open: http://localhost:3000/role-access-test"
echo "2. Click 'Setup Admin Auth' button"
echo "3. Click 'Test Role Access' button"
echo "4. Click 'Navigate to /users/add' button"
echo "5. Verify you can access the Add User page"
echo ""
echo "If step 5 works, the authentication issue is FIXED! 🎉"
echo ""
echo "🔧 DEBUG URLS:"
echo "- Role Access Test: http://localhost:3000/role-access-test"
echo "- Auth Flow Test: http://localhost:3000/auth-flow-test"
echo "- Login Page: http://localhost:3000/login"
echo "- Add User (Protected): http://localhost:3000/users/add"
echo "- Add Service (Protected): http://localhost:3000/services/add"
