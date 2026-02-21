# Change Proposal: Rate Limiting for Server Actions

## Problem Statement

Currently, Gigly's server actions have no rate limiting protection, creating several critical vulnerabilities:

1. **Brute Force Attacks**: Attackers can attempt unlimited login attempts to guess passwords
2. **Spam Applications**: Malicious users can flood gigs with fake applications, degrading platform quality
3. **Message Flooding**: Users can spam the messaging system, creating noise and potential harassment
4. **Registration Abuse**: Bots can create unlimited fake accounts, polluting the user base
5. **Resource Exhaustion**: Unlimited requests can overwhelm the database and server resources

These vulnerabilities directly threaten the platform's core value propositions:
- **Quality Over Quantity** (Design Principle #4): Spam degrades the curated experience
- **Trust Through Transparency** (Design Principle #2): Abuse erodes user trust
- **Professional B2B Experience** (Design Principle #3): Spam and abuse are unprofessional

## Proposed Solution

Implement rate limiting on critical server actions using Upstash Redis:

1. **Library**: Use `@upstash/ratelimit` with `@upstash/redis` for persistent storage
2. **Storage**: Upstash Redis (serverless-compatible, no state loss between invocations)
3. **Strategy**: Sliding window algorithm for accurate rate limiting
4. **Scope**:
   - IP-based rate limiting for anonymous endpoints (login, registration)
   - User-based rate limiting for authenticated endpoints (applications, messages)
5. **Conservative Defaults**: Start strict, can relax based on real usage data

### Rate Limit Thresholds (Proposed)

| Endpoint | Limit | Window | Identifier | Rationale |
|----------|-------|--------|------------|-----------|
| Login | 15 attempts | 15 min | IP address | Prevent brute force while allowing offices sharing NAT IPs |
| Registration | 3 attempts | 1 hour | IP address | Prevent bot account creation |
| Application Submission | 10 applications | 1 hour | User ID | Prevent spam applications while allowing legitimate activity |
| Message Sending | 30 messages | 1 hour | User ID | Prevent harassment/flooding while supporting real conversations |

### Why These Thresholds?

- **Login (15/15min)**: Allows multiple users behind shared office NAT IPs. Still protects against brute force (15 attempts = very unlikely legitimate use).
- **Registration (3/hour)**: One legitimate registration per IP. Extra attempts allow for form errors.
- **Applications (10/hour)**: Specialists can apply to ~10 gigs/hour max. More suggests spam.
- **Messages (30/hour)**: ~1 message every 2 minutes. Supports real conversations, blocks flooding.

## Constraints & Non-Goals

### In Scope
✅ Rate limiting on 4 critical server actions (login, register, apply, message)
✅ Clear error messages with retry-after information
✅ IP-based limiting for anonymous endpoints
✅ User-based limiting for authenticated endpoints
✅ Integration tests verifying rate limits work
✅ Upstash Redis for persistent, serverless-compatible storage
✅ Environment variables for Upstash configuration

### Out of Scope (Deferred)
❌ Rate limiting on read operations (browsing gigs, viewing profiles)
❌ Admin bypass mechanisms (can add post-MVP if needed)
❌ Rate limit analytics dashboard (post-MVP monitoring feature)
❌ Per-role rate limit customization (all users same limits for MVP)

### Technical Requirements

**Environment Variables:**
- `UPSTASH_REDIS_REST_URL`: Upstash Redis REST endpoint
- `UPSTASH_REDIS_REST_TOKEN`: Upstash Redis authentication token

**Why Upstash Redis?**
- **Serverless-compatible**: No connection pooling issues in Next.js serverless functions
- **Persistent storage**: State survives between function invocations (unlike in-memory Maps)
- **No memory leaks**: External storage prevents memory accumulation in serverless environment
- **Free tier**: Generous free tier suitable for MVP (10,000 requests/day)
- **Low latency**: Edge-optimized for fast rate limit checks

## Success Criteria

1. **Security**: Brute force login attempts are blocked after 15 tries per IP
2. **Quality**: Spam applications are prevented (max 10/hour per user)
3. **User Experience**: Legitimate users are not impacted by rate limits (including offices with shared IPs)
4. **Error Handling**: Clear error messages explain why request was blocked and when to retry
5. **Testing**: All rate limits verified by automated tests
6. **Persistence**: Rate limits persist across serverless function invocations

## Migration & Rollout

- **No breaking changes**: Rate limiting is transparent to legitimate users
- **Gradual rollout**: Can deploy with high limits initially, then tighten based on data
- **Monitoring**: Log rate limit hits to identify if thresholds need adjustment
- **Escape hatch**: Can disable rate limiting via environment variable if issues arise

## Alternative Approaches Considered

1. **Express-rate-limit**: Not compatible with Next.js App Router server actions
2. **Next.js middleware rate limiting**: Only works for route handlers, not server actions
3. **Database-based rate limiting**: Too slow, adds DB load
4. **In-memory Map storage**: Loses state between serverless invocations, causes memory leaks

**Decision**: Use `@upstash/ratelimit` with Upstash Redis for persistent, serverless-compatible storage.
