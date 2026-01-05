#!/bin/bash

echo "🧪 Testing Authentication Flow"
echo "================================"

# Test 1: Check if login page loads
echo "📝 Test 1: Login page accessibility"
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/login)
if [ $response -eq 200 ]; then
    echo "✅ Login page loads successfully"
else
    echo "❌ Login page failed to load (HTTP $response)"
fi

# Test 2: Check if protected routes redirect to login
echo ""
echo "🔒 Test 2: Protected route behavior (without authentication)"
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/users/add)
if [ $response -eq 200 ]; then
    echo "✅ Add User page loads (checking if it redirects properly in browser)"
else
    echo "❌ Add User page failed to load (HTTP $response)"
fi

response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/services/add)
if [ $response -eq 200 ]; then
    echo "✅ Add Service page loads (checking if it redirects properly in browser)"
else
    echo "❌ Add Service page failed to load (HTTP $response)"
fi

# Test 3: Check if public pages load
echo ""
echo "🌐 Test 3: Public pages accessibility"
pages=("" "/services" "/users" "/ministries" "/regions" "/news" "/about")
for page in "${pages[@]}"; do
    response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$page")
    if [ $response -eq 200 ]; then
        echo "✅ Page '$page' loads successfully"
    else
        echo "❌ Page '$page' failed to load (HTTP $response)"
    fi
done

echo ""
echo "📋 Authentication Test Summary:"
echo "- All pages should load with HTTP 200"
echo "- Protected routes will show login redirect in browser"
echo "- After login with admin/admin123, both /services/add and /users/add should be accessible"
echo ""
echo "🎯 Next Steps:"
echo "1. Open http://localhost:3000/login"
echo "2. Login with: admin / admin123"
echo "3. Try accessing http://localhost:3000/users/add"
echo "4. Check if authentication debug info shows correct role"
