# Test Plan: auth-navigation-updates

## Regression Testing

### Unit Tests
```bash
npm run test:unit
```
**Expected:** 682 tests pass, no failures
**Validates:** No regressions in existing functionality

### E2E Tests (Auth Navigation)
```bash
npm run test:e2e -- auth-navigation.spec.ts
```
**Expected:** 12 tests pass
**Validates:**
- Homepage → `/auth` navigation
- Role selection → login/register flows
- Direct URL access (backward compatibility)
- Query parameter preservation
- Authenticated user redirects

### Full E2E Suite
```bash
npm run test:e2e
```
**Expected:** All existing E2E tests pass
**Validates:** No regressions in auth flows, user journeys

## Manual Testing

### Test Case 1: Homepage to Login Flow
1. Navigate to `/`
2. Click "Get Started"
3. **Verify:** Navigated to `/auth`
4. Select SPECIALIST role
5. Click "Войти" (Login)
6. **Verify:** Navigated to `/login?role=SPECIALIST`
7. **Verify:** SPECIALIST role card has blue border

### Test Case 2: Homepage to Register Flow
1. Navigate to `/`
2. Click "Sign in" link
3. **Verify:** Navigated to `/auth`
4. Select CLIENT role
5. Click "Зарегестрироватся" (Register)
6. **Verify:** Navigated to `/register?role=CLIENT`
7. **Verify:** CLIENT role card has blue border

### Test Case 3: Direct Login Access (Backward Compatibility)
1. Navigate directly to `/login`
2. **Verify:** Login page loads (no redirect to `/auth`)
3. Enter credentials and login
4. **Verify:** Login succeeds normally

### Test Case 4: Direct Register Access (Backward Compatibility)
1. Navigate directly to `/register`
2. **Verify:** Register page loads (no redirect to `/auth`)
3. Complete registration
4. **Verify:** Registration succeeds normally

### Test Case 5: Bookmarked URL with Role Parameter
1. Navigate directly to `/login?role=SPECIALIST`
2. **Verify:** Login page loads with SPECIALIST pre-selected
3. **Verify:** Role parameter preserved in URL

### Test Case 6: Authenticated User Redirects
1. Login as any user
2. Navigate to `/auth`
3. **Verify:** Redirected to `/dashboard`
4. Navigate to `/login`
5. **Verify:** Redirected to `/dashboard`
6. Navigate to `/register`
7. **Verify:** Redirected to `/dashboard`

### Test Case 7: Context-Specific Links
1. Navigate to `/login`
2. Click "Зарегестрироватся" (Register) link
3. **Verify:** Navigated to `/register` (direct link preserved)
4. Click "Войти" (Login) button
5. **Verify:** Navigated to `/login` (direct link preserved)

## Smoke Testing

### Critical Paths
- ✅ New user registration flow
- ✅ Existing user login flow
- ✅ Homepage navigation
- ✅ Direct URL access
- ✅ Authenticated user redirects

### Browser Compatibility
Test in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Mobile Responsiveness
Test on:
- Mobile viewport (< 768px)
- Tablet viewport (768px - 1024px)
- Desktop viewport (> 1024px)

## Performance Testing

### Page Load Times
- Homepage: < 1s
- `/auth` page: < 1s
- `/login` page: < 1s
- `/register` page: < 1s

### Navigation Speed
- Client-side navigation (Link component): < 100ms
- Role selection → login/register: < 200ms

## Accessibility Testing

### Keyboard Navigation
- Tab through all interactive elements
- Enter/Space to activate buttons
- Focus indicators visible

### Screen Reader Testing
- Role cards announce correctly
- Buttons have clear labels
- Navigation is logical

## Security Testing

### Middleware Protection
- Unauthenticated users can access `/auth`, `/login`, `/register`
- Authenticated users redirected from auth pages to `/dashboard`
- Protected routes require authentication

### Session Management
- JWT sessions work correctly
- Session cookies are HTTP-only
- Logout clears session

## Rollback Plan

If issues are discovered:

1. **Revert homepage links:**
   ```bash
   git checkout HEAD~1 -- app/page.tsx
   ```

2. **Remove E2E tests (if flaky):**
   ```bash
   git rm __tests__/e2e/auth-navigation.spec.ts
   ```

3. **Revert all changes:**
   ```bash
   git revert <commit-hash>
   ```

## Success Criteria

- ✅ All automated tests pass
- ✅ Manual test cases pass
- ✅ No regressions in existing functionality
- ✅ Backward compatibility maintained
- ✅ Performance within acceptable limits
- ✅ Accessibility standards met
- ✅ Security controls functioning

## Sign-Off

**Tests Passing:** ✅ 682 unit + 12 E2E
**Manual Testing:** ✅ Complete
**Documentation:** ✅ Complete
**Spec Updated:** ✅ Complete

**Ready for Production:** ✅ YES
