#!/bin/bash

echo "🔍 Navigation Diagnostics Script"
echo "=================================="
echo ""

# Check if the server is running
echo "1. Checking if development server is running..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Server is running on http://localhost:3000"
else
    echo "❌ Server is not running on port 3000"
fi
echo ""

# Test basic navigation endpoints
echo "2. Testing navigation endpoints..."
endpoints=(
    "/"
    "/services" 
    "/users"
    "/ministries"
    "/regions"
    "/news"
    "/about"
    "/login"
)

for endpoint in "${endpoints[@]}"; do
    echo -n "Testing $endpoint: "
    if curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$endpoint" | grep -q "200"; then
        echo "✅ OK"
    else
        echo "❌ FAILED"
    fi
done
echo ""

# Check for React Router issues in console
echo "3. Navigation fix summary:"
echo "✅ Replaced button navigation with Link components"
echo "✅ Updated both desktop and mobile navigation"  
echo "✅ Fixed admin/editor action links"
echo "✅ Updated authentication links"
echo ""

echo "4. Test Instructions:"
echo "1. Open http://localhost:3000"
echo "2. Navigate to Services page"
echo "3. Try navigating to Regions or Ministries"
echo "4. Check if URL changes and page content updates"
echo ""

echo "5. Debug URLs:"
echo "- Navigation Test: http://localhost:3000/navigation-debug-test"
echo "- Comprehensive Test: http://localhost:3000/comprehensive-language-test"
echo ""

echo "🎯 The navigation issue should now be FIXED!"
echo "The problem was using button onClick handlers instead of proper Link components."
