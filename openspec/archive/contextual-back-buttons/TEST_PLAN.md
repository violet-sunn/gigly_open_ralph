# Test Plan: Contextual Back Buttons

## Manual Testing Checklist

### Test 1: Navigation Highlighting - Client Dashboard
**Scenario:** Verify correct tab highlighting when navigating from client dashboard

1. Login as CLIENT user
2. Navigate to `/dashboard`
3. Click any gig in "My Gigs" section
4. **Expected:** 
   - URL includes `?from=dashboard`
   - "Dashboard" tab is highlighted (blue border)
   - "Browse Gigs" tab is NOT highlighted
5. Click browser back button
6. **Expected:** Return to dashboard

**Status:** ✅ Pass / ❌ Fail

---

### Test 2: Navigation Highlighting - Browse Gigs
**Scenario:** Verify correct tab highlighting when navigating from browse gigs

1. Login as CLIENT or SPECIALIST user
2. Navigate to `/dashboard/gigs`
3. Click any gig in the list
4. **Expected:**
   - URL includes `?from=browse`
   - "Browse Gigs" tab is highlighted (blue border)
   - "Dashboard" tab is NOT highlighted

**Status:** ✅ Pass / ❌ Fail

---

### Test 3: Back Button - From Dashboard
**Scenario:** Verify back button appears and works from dashboard

1. Login as CLIENT user
2. Navigate to `/dashboard`
3. Click any gig
4. **Expected:**
   - Back button appears at top of page
   - Text reads "← Back to Dashboard"
   - Button is blue and has hover effect
5. Click back button
6. **Expected:** Navigate to `/dashboard`

**Status:** ✅ Pass / ❌ Fail

---

### Test 4: Back Button - From Browse Gigs (No Filters)
**Scenario:** Verify back button works from browse gigs without filters

1. Login as SPECIALIST user
2. Navigate to `/dashboard/gigs`
3. Click any gig
4. **Expected:**
   - Back button appears
   - Text reads "← Back to Browse Gigs"
5. Click back button
6. **Expected:** Navigate to `/dashboard/gigs`

**Status:** ✅ Pass / ❌ Fail

---

### Test 5: Back Button - Preserves Browse Filters
**Scenario:** Verify filters are preserved when returning to browse gigs

1. Login as SPECIALIST user
2. Navigate to `/dashboard/gigs`
3. Apply filters:
   - Search: "react"
   - Tag: "TypeScript"
   - Go to page 2
4. Click any gig
5. **Expected:**
   - URL includes `?from=browse&search=react&tags=TypeScript&page=2`
   - Back button appears
6. Click back button
7. **Expected:**
   - Return to `/dashboard/gigs?search=react&tags=TypeScript&page=2`
   - Search box shows "react"
   - TypeScript tag is selected
   - Page 2 is active

**Status:** ✅ Pass / ❌ Fail

---

### Test 6: Specialist Dashboard - Tab Restoration (Active Work)
**Scenario:** Verify Active Work tab is restored after navigation

1. Login as SPECIALIST user
2. Navigate to `/dashboard`
3. Ensure "Active Work" tab is selected
4. Click any gig in Active Work
5. **Expected:**
   - URL includes `?from=dashboard&tab=active`
   - Back button shows "← Back to Dashboard"
6. Click back button
7. **Expected:**
   - Return to `/dashboard`
   - Active Work tab is still selected

**Status:** ✅ Pass / ❌ Fail

---

### Test 7: Specialist Dashboard - Tab Restoration (Pending)
**Scenario:** Verify Pending Applications tab is restored

1. Login as SPECIALIST user
2. Navigate to `/dashboard`
3. Click "Pending Applications" tab
4. Click any application/gig
5. **Expected:**
   - URL includes `?from=dashboard&tab=pending`
6. Click back button
7. **Expected:**
   - Return to `/dashboard`
   - Pending Applications tab is selected

**Status:** ✅ Pass / ❌ Fail

---

### Test 8: Specialist Dashboard - Tab Restoration (Archive)
**Scenario:** Verify Archive tab is restored

1. Login as SPECIALIST user
2. Navigate to `/dashboard`
3. Click "Archive" tab
4. Click any archived gig
5. **Expected:**
   - URL includes `?from=dashboard&tab=archive`
6. Click back button
7. **Expected:**
   - Return to `/dashboard`
   - Archive tab is selected

**Status:** ✅ Pass / ❌ Fail

---

### Test 9: Direct Navigation (No Context)
**Scenario:** Verify graceful handling when no navigation context

1. Login as any user
2. Navigate directly to `/dashboard/gigs/[any-gig-id]` (no query params)
3. **Expected:**
   - No back button appears (or shows default)
   - No navigation tab is highlighted
   - Page functions normally

**Status:** ✅ Pass / ❌ Fail

---

### Test 10: Accessibility - Keyboard Navigation
**Scenario:** Verify back button is keyboard accessible

1. Login as CLIENT user
2. Navigate to gig detail with `?from=dashboard`
3. Press Tab key repeatedly
4. **Expected:**
   - Back button receives focus (visible focus ring)
5. Press Enter when back button is focused
6. **Expected:**
   - Navigate to dashboard

**Status:** ✅ Pass / ❌ Fail

---

### Test 11: Mobile Responsiveness
**Scenario:** Verify back button works on mobile

1. Open browser DevTools
2. Switch to mobile viewport (320px width)
3. Login as CLIENT user
4. Navigate to gig detail from dashboard
5. **Expected:**
   - Back button is visible
   - Back button is clickable
   - No layout issues
6. Click back button
7. **Expected:** Navigate to dashboard

**Status:** ✅ Pass / ❌ Fail

---

### Test 12: URL Encoding Edge Cases
**Scenario:** Verify special characters in search are handled correctly

1. Login as SPECIALIST user
2. Navigate to `/dashboard/gigs`
3. Search for: `"react & vue"`
4. Click any gig
5. **Expected:**
   - URL properly encodes special characters
   - Back button works
6. Click back button
7. **Expected:**
   - Search box shows `"react & vue"` correctly
   - Results match the search

**Status:** ✅ Pass / ❌ Fail

---

## Automated Test Verification

### Build Tests
```bash
npm run build
```
**Expected:**
- ✅ Build completes successfully
- ✅ No Suspense boundary warnings
- ✅ No SSR de-opt warnings

### Unit Tests
```bash
npm test
```
**Expected:**
- ✅ All existing tests pass
- ✅ No new test failures

### Type Checking
```bash
npx tsc --noEmit
```
**Expected:**
- ✅ No TypeScript errors

---

## Regression Testing

### Areas to Verify
1. ✅ Dashboard page loads correctly for CLIENT users
2. ✅ Dashboard page loads correctly for SPECIALIST users
3. ✅ Browse gigs page loads and filters work
4. ✅ Gig detail page loads for all user types
5. ✅ Navigation between pages works
6. ✅ Existing links still function
7. ✅ No console errors in browser DevTools

---

## Performance Testing

### Metrics to Monitor
1. **Page Load Time:** Should not increase
2. **Time to Interactive:** Should not increase
3. **Bundle Size:** Minimal increase (~1-2KB)
4. **Lighthouse Score:** Should remain the same

---

## Browser Compatibility

Test on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile Safari (iOS)
- ✅ Chrome Android

---

## Sign-Off

**Tested By:** _________________  
**Date:** _________________  
**Environment:** Production / Staging  
**Overall Status:** ✅ Pass / ❌ Fail  

**Notes:**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
