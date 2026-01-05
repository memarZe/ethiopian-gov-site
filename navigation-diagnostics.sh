#!/bin/bash

echo "🔧 Ethiopian Government Website - Navigation Diagnostics"
echo "======================================================"

# Check servers
echo ""
echo "📡 Server Status:"
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ React Dev Server (http://localhost:3000) - Running"
else
    echo "❌ React Dev Server - Not Running"
fi

if curl -s http://localhost:8080/api/v1/news > /dev/null; then
    echo "✅ Java Backend Server (http://localhost:8080) - Running"
else
    echo "⚠️  Java Backend Server - Not Running"
fi

# Check versions
echo ""
echo "📦 Package Versions:"
cd /Users/memardesta/ethiopian-gov-site
echo "React: $(npm list react --depth=0 2>/dev/null | grep react@ | sed 's/.*react@//')"
echo "React Router DOM: $(npm list react-router-dom --depth=0 2>/dev/null | grep react-router-dom@ | sed 's/.*react-router-dom@//')"

# Test navigation endpoints
echo ""
echo "🧪 Route Testing:"
for route in "" "services" "ministries" "news" "regions" "about"; do
    if [ -z "$route" ]; then
        url="http://localhost:3000"
        name="Home (/)"
    else
        url="http://localhost:3000/$route"
        name="$route (/$route)"
    fi
    
    if curl -s "$url" | grep -q "<!DOCTYPE html>"; then
        echo "✅ $name - Responding"
    else
        echo "❌ $name - Not Responding"
    fi
done

echo ""
echo "🎯 Navigation Test Instructions:"
echo "1. Open: http://localhost:3000"
echo "2. Look for the yellow 'Navigation Test Panel'"
echo "3. Try different navigation methods:"
echo "   - React Router (navigate) - Standard method"
echo "   - Full Page Reload - Forces complete refresh"  
echo "   - Router Replace - Replaces history entry"
echo "   - Manual PushState - Low-level browser API"
echo ""
echo "4. Test each method by:"
echo "   - Selecting the method in dropdown"
echo "   - Clicking 'Services' button"
echo "   - Checking if page content updates"
echo "   - Verifying URL changes to /services"

echo ""
echo "🔍 Debugging Tips:"
echo "- Open Browser Developer Tools (F12)"
echo "- Check Console tab for logs starting with 'Navigation Test:'"
echo "- Check Network tab for API calls to /api/v1/services"
echo "- If 'Full Page Reload' works but others don't, it's a React Router issue"

echo ""
echo "📋 Expected Console Output:"
echo "Navigation Test: Going to /services using method: router"
echo "Route changed to: /services"
echo "Services component mounting/re-rendering at: [timestamp]"
echo "useApi: Effect triggered, fetching data..."

echo ""
echo "🚨 If Navigation Still Fails:"
echo "1. Try the 'Force Reload to Services' red button"
echo "2. Check if there are JavaScript errors in console"
echo "3. Test in different browser or incognito mode"
echo "4. Consider downgrading React Router to v6"

echo ""
echo "🌐 Ready to test: http://localhost:3000"
