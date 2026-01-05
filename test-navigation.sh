#!/bin/bash

# Navigation Test Script
echo "🚀 Testing Ethiopian Government Website Navigation"
echo "================================================"

# Check if server is running
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ React server is running on http://localhost:3000"
else
    echo "❌ React server is not running. Please start with 'npm start'"
    exit 1
fi

# Check if Java backend is running
if curl -s http://localhost:8080/api/v1/news > /dev/null; then
    echo "✅ Java backend is running on http://localhost:8080"
else
    echo "⚠️  Java backend is not running on http://localhost:8080"
fi

echo ""
echo "📋 Navigation Test Instructions:"
echo "1. Open http://localhost:3000 in your browser"
echo "2. Click on 'አገልግሎቶች / Services' in navigation"
echo "3. Verify the URL changes to /services"
echo "4. Verify the page content changes to Services page"
echo "5. Check browser console for logs:"
echo "   - 'Route changed to: /services'"
echo "   - 'Services component mounting/re-rendering'"
echo "   - 'useApi: Starting API fetch'"

echo ""
echo "🔍 Expected Behavior:"
echo "✅ URL changes immediately"
echo "✅ Page content updates automatically"  
echo "✅ Active link is highlighted in green"
echo "✅ Page scrolls to top"
echo "✅ Console shows component re-rendering logs"

echo ""
echo "❌ If navigation still doesn't work:"
echo "1. Check browser console for JavaScript errors"
echo "2. Verify React Router version compatibility"
echo "3. Check if there are any browser caching issues"
echo "4. Try hard refresh (Cmd+Shift+R on macOS)"

echo ""
echo "🌐 Open browser test:"
echo "http://localhost:3000"
