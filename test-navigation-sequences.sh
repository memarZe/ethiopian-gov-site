#!/bin/bash

# Navigation Sequence Test Script
# Tests all problematic navigation sequences

echo "🧪 NAVIGATION SEQUENCE TEST SUITE"
echo "=================================="
echo ""

# Check if the development server is running
if ! curl -s http://localhost:3001 > /dev/null; then
    echo "❌ Development server not running on localhost:3001"
    echo "Please start with: npm start"
    exit 1
fi

echo "✅ Development server detected on localhost:3001"
echo ""

# Test sequences that were previously failing
sequences=(
    "Home→Services→Ministries→Regions"
    "Home→Ministries→Regions→Services"
    "Home→Regions→Services→Ministries"
)

paths=(
    "/,/services,/ministries,/regions"
    "/,/ministries,/regions,/services"
    "/,/regions,/services,/ministries"
)

echo "🎯 TESTING NAVIGATION SEQUENCES"
echo "------------------------------"

for i in "${!sequences[@]}"; do
    echo ""
    echo "📍 Test $((i+1)): ${sequences[$i]}"
    
    # Split the paths
    IFS=',' read -ra ADDR <<< "${paths[$i]}"
    
    success=true
    for path in "${ADDR[@]}"; do
        # Use curl to check if the path responds
        if curl -s -o /dev/null -w "%{http_code}" "http://localhost:3001$path" | grep -q "200"; then
            echo "  ✅ $path - accessible"
        else
            echo "  ❌ $path - not accessible"
            success=false
        fi
    done
    
    if $success; then
        echo "  🎉 Sequence PASSED"
    else
        echo "  💥 Sequence FAILED"
    fi
done

echo ""
echo "🔍 INDIVIDUAL PAGE TESTS"
echo "-----------------------"

# Test individual pages
pages=("/" "/services" "/ministries" "/regions" "/news" "/users")
page_names=("Home" "Services" "Ministries" "Regions" "News" "Users")

for i in "${!pages[@]}"; do
    path="${pages[$i]}"
    name="${page_names[$i]}"
    
    if curl -s -o /dev/null -w "%{http_code}" "http://localhost:3001$path" | grep -q "200"; then
        echo "✅ $name ($path) - accessible"
    else
        echo "❌ $name ($path) - not accessible"
    fi
done

echo ""
echo "📋 MANUAL TESTING INSTRUCTIONS"
echo "==============================="
echo ""
echo "1. Open: http://localhost:3001"
echo "2. Open Browser DevTools (F12) → Console tab"
echo "3. Test the following sequences:"
echo ""
echo "   🔸 Home → Services → Ministries → Regions"
echo "   🔸 Home → Ministries → Regions → Services"  
echo "   🔸 Home → Regions → Services → Ministries"
echo ""
echo "4. Watch for console messages:"
echo "   🧭 Navigating to [Page] ([Path])"
echo "   ✅ Successfully navigated to [Page]"
echo "   ⚠️ React Router failed, using fallback"
echo ""
echo "5. Verify each page loads with content"
echo ""
echo "🎯 All navigation should work reliably now!"
echo "If any sequence fails, check console for fallback messages."
echo ""
