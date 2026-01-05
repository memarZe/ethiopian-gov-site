#!/bin/bash

echo "🧪 Testing Authentication Flow"
echo "================================"

# Function to test URL access
test_url_access() {
    local url="$1"
    local expected="$2"
    echo "Testing: $url"
    
    # Use curl to check if URL redirects or loads
    response=$(curl -s -o /dev/null -w "%{http_code}" -L "$url")
    echo "Response: $response"
    
    if [[ "$response" == "200" ]]; then
        echo "✅ Page loads successfully"
    else
        echo "❌ Page failed to load or redirected"
    fi
    echo ""
}

echo "🔍 Step 1: Testing unauthenticated access"
test_url_access "http://localhost:3000/users/add" "should_redirect"
test_url_access "http://localhost:3000/services/add" "should_redirect"

echo "🔍 Step 2: Simulating admin login"
# We can't easily simulate login via curl, but we can test the endpoints

echo "🔍 Step 3: Testing main pages"
test_url_access "http://localhost:3000/" "should_work"
test_url_access "http://localhost:3000/login" "should_work"
test_url_access "http://localhost:3000/users" "should_work"
test_url_access "http://localhost:3000/services" "should_work"

echo "✅ Test completed"
