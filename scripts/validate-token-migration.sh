#!/bin/bash

# Token Migration Validation Script
# Searches for old hardcoded color patterns that should have been migrated to design tokens

set -e

echo "🔍 Validating token migration..."
echo ""

# Define old color patterns to search for
PATTERNS=(
  "bg-navy-900"
  "bg-navy-800"
  "text-gray-[0-9]"
  "border-gray-[0-9]"
  "placeholder:text-gray-400"
  "focus:ring-offset-navy-900"
)

# Directories to exclude from search
EXCLUDE_DIRS=(
  "docs"
  "archive"
  "node_modules"
  ".next"
  ".git"
  "openspec"
)

# Build exclude arguments for grep
EXCLUDE_ARGS=""
for dir in "${EXCLUDE_DIRS[@]}"; do
  EXCLUDE_ARGS="$EXCLUDE_ARGS --exclude-dir=$dir"
done

# Track if any matches found
FOUND_MATCHES=0
TOTAL_MATCHES=0

# Search for each pattern
for pattern in "${PATTERNS[@]}"; do
  echo "Searching for pattern: $pattern"

  # Run grep and capture results
  if grep -rn $EXCLUDE_ARGS "$pattern" . 2>/dev/null; then
    FOUND_MATCHES=1
    MATCH_COUNT=$(grep -rn $EXCLUDE_ARGS "$pattern" . 2>/dev/null | wc -l)
    TOTAL_MATCHES=$((TOTAL_MATCHES + MATCH_COUNT))
    echo ""
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $FOUND_MATCHES -eq 0 ]; then
  echo "✅ SUCCESS: No old color patterns found!"
  echo "   Token migration is complete."
  exit 0
else
  echo "❌ FAILURE: Found $TOTAL_MATCHES instance(s) of old color patterns"
  echo "   Please review the matches above and either:"
  echo "   1. Migrate them to design tokens, or"
  echo "   2. Document them as intentional fallbacks in DESIGN_SYSTEM.md"
  exit 1
fi
