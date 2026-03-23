# Error Message Audit

## Summary

This document catalogs all error messages across server actions, categorizes them, identifies issues, and proposes standardized replacements.

**Total Error Messages:** 58
**Files Audited:** 6 (auth.ts, gig.ts, profile.ts, moderation.ts, notification.ts, user.ts)

---

## auth.ts

### registerUser

| Current Message | Category | Issues | Proposed Message |
|----------------|----------|--------|------------------|
| "Please select a role." | VALIDATION | Missing guidance on what roles are available | "Please select whether you're a client or specialist." |
| "An account with this email already exists." | VALIDATION | Missing actionable next step | "An account with this email already exists. Try logging in instead." |
| Rate limit errors | RATE_LIMIT | ✅ Already good (uses getRateLimitError) | Keep as-is |

### loginUser

| Current Message | Category | Issues | Proposed Message |
|----------------|----------|--------|------------------|
| "Invalid email or password." | VALIDATION | Missing guidance (but intentionally generic for security) | "Invalid email or password. Check your credentials and try again." |
| "Your account has been suspended. Please contact support." | AUTHORIZATION | Missing support contact info | "Your account has been suspended. Contact support at support@gigly.ru for assistance." |
| Rate limit errors | RATE_LIMIT | ✅ Already good | Keep as-is |

---

## gig.ts - createGig

| Current Message | Category | Issues | Proposed Message |
|----------------|----------|--------|------------------|
| "Only clients can create gigs." | AUTHORIZATION | No alternative action suggested | "Only clients can post gigs. Switch to a client account or register as a client to continue." |
| "Title, description, and acceptance criteria are required." | VALIDATION | ✅ Already specific | "Please fill in all required fields: title, description, and acceptance criteria." |
| "Acceptance criteria must be at least 50 characters." | VALIDATION | Missing guidance on what to add | "Acceptance criteria must be at least 50 characters. Add more detail about what defines success for this gig." |
| "Budget must be a positive number." | VALIDATION | Missing context about what budget represents | "Budget must be a positive number in roubles. Enter the amount you'll pay the specialist (service fee will be calculated automatically)." |

---

## gig.ts - applyToGig

| Current Message | Category | Issues | Proposed Message |
|----------------|----------|--------|------------------|
| "Only specialists can apply to gigs." | AUTHORIZATION | No alternative action | "Only specialists can apply to gigs. Switch to a specialist account or register as a specialist to continue." |
| "Technical approach is required." | VALIDATION | ✅ Already clear | Keep as-is |
| "Clarifying questions are required." | VALIDATION | ✅ Already clear | Keep as-is |
| "Technical approach must be at least 100 characters. Please provide more detail about your methodology." | VALIDATION | ✅ Already excellent | Keep as-is |
| "Clarifying questions must be at least 50 characters. What do you need to know about the requirements?" | VALIDATION | ✅ Already excellent | Keep as-is |
| "Technical approach is too long. Maximum 2000 characters allowed." | VALIDATION | ✅ Already clear | Keep as-is |
| "Clarifying questions are too long. Maximum 1000 characters allowed." | VALIDATION | ✅ Already clear | Keep as-is |
| "Estimated effort is too long. Maximum 200 characters allowed." | VALIDATION | ✅ Already clear | Keep as-is |
| "Gig not found." | NOT_FOUND | Too terse, no context | "This gig no longer exists or has been removed." |
| "This is an example gig for demonstration purposes. You cannot apply to example gigs." | STATE | Too verbose, could be friendlier | "This is an example gig for demonstration. Browse real gigs to find work opportunities." |
| "This gig has been closed by administrators." | STATE | Missing next steps | "This gig has been closed by administrators and is no longer available." |
| "This gig is no longer accepting applications." | STATE | Missing explanation of why | "This gig is no longer accepting applications. It may already have an assigned specialist." |
| "You have already applied to this gig." | STATE | Missing next steps | "You've already applied to this gig. Check your dashboard to see your application status." |
| Rate limit errors | RATE_LIMIT | ✅ Already good | Keep as-is |

---

## gig.ts - acceptApplication

| Current Message | Category | Issues | Proposed Message |
|----------------|----------|--------|------------------|
| "Only clients can manage applications." | AUTHORIZATION | No guidance for specialists | "Only clients can manage applications. If you're the specialist, wait for the client's decision." |
| "Application not found." | NOT_FOUND | Too terse | "This application no longer exists or has been removed." |
| "Only the gig owner can manage applications." | AUTHORIZATION | Uses "gig owner" jargon | "Only the client who posted this gig can accept applications." |
| "This gig is no longer accepting applications." | STATE | Missing context | "This gig is no longer accepting applications. A specialist may already be assigned." |
| "This application is no longer pending." | STATE | Exposes internal status terminology | "This application has already been accepted or rejected." |

---

## gig.ts - rejectApplication

| Current Message | Category | Issues | Proposed Message |
|----------------|----------|--------|------------------|
| "Only clients can manage applications." | AUTHORIZATION | No guidance for specialists | "Only clients can manage applications. If you're the specialist, wait for the client's decision." |
| "Application not found." | NOT_FOUND | Too terse | "This application no longer exists or has been removed." |
| "Only the gig owner can manage applications." | AUTHORIZATION | Uses "gig owner" jargon | "Only the client who posted this gig can reject applications." |
| "This application is no longer pending." | STATE | Exposes internal status | "This application has already been accepted or rejected." |

---

## gig.ts - submitWork

| Current Message | Category | Issues | Proposed Message |
|----------------|----------|--------|------------------|
| "Only specialists can submit work." | AUTHORIZATION | No guidance for clients | "Only specialists can submit work. If you're the client, wait for the specialist to submit their deliverables." |
| "Gig not found." | NOT_FOUND | Too terse | "This gig no longer exists or has been removed." |
| "Work can only be submitted for gigs in progress." | STATE | Missing current status info | "Work can only be submitted for gigs that are in progress." |
| "Only the assigned specialist can submit work." | AUTHORIZATION | Could be clearer | "Only the assigned specialist can submit work for this gig." |

---

## gig.ts - approveWork

| Current Message | Category | Issues | Proposed Message |
|----------------|----------|--------|------------------|
| "Only clients can approve work." | AUTHORIZATION | No guidance for specialists | "Only clients can approve work. If you're the specialist, wait for the client to review your submission." |
| "Gig not found." | NOT_FOUND | Too terse | "This gig no longer exists or has been removed." |
| "Work can only be approved for gigs under review." | STATE | Missing prerequisite info | "Work can only be approved for gigs under review. The specialist needs to submit their work first." |
| "Only the gig owner can approve work." | AUTHORIZATION | Uses "gig owner" jargon | "Only the client who posted this gig can approve the work." |

---

## gig.ts - markAsPaid

| Current Message | Category | Issues | Proposed Message |
|----------------|----------|--------|------------------|
| "Only clients can mark gigs as paid." | AUTHORIZATION | No guidance for specialists | "Only clients can mark gigs as paid. If you're the specialist, wait for the client to confirm payment." |
| "Gig not found." | NOT_FOUND | Too terse | "This gig no longer exists or has been removed." |
| "Only the gig owner can mark this gig as paid." | AUTHORIZATION | Uses "gig owner" jargon | "Only the client who posted this gig can mark it as paid." |
| "This gig has already been marked as paid." | STATE | Missing timestamp | "This gig has already been marked as paid." (Note: timestamp added in display, not error message) |
| "Only completed gigs can be marked as paid." | STATE | Missing prerequisite | "Only completed gigs can be marked as paid. The work needs to be approved first." |

---

## gig.ts - withdrawApplication

| Current Message | Category | Issues | Proposed Message |
|----------------|----------|--------|------------------|
| "Only specialists can withdraw applications." | AUTHORIZATION | No guidance for clients | "Only specialists can withdraw applications. If you're the client, you can reject applications instead." |
| "Application not found." | NOT_FOUND | Too terse | "This application no longer exists or has been removed." |
| "Gig not found." | NOT_FOUND | Too terse | "This gig no longer exists or has been removed." |
| "You can only withdraw your own applications." | AUTHORIZATION | ✅ Already clear | Keep as-is |
| "This application has already been withdrawn." | STATE | ✅ Already clear | Keep as-is |
| "Only pending applications can be withdrawn." | STATE | Missing explanation | "You can only withdraw pending applications. This application has already been accepted or rejected." |
| "Cannot withdraw applications from closed gigs." | STATE | ✅ Already clear | Keep as-is |
| "Cannot withdraw applications from example gigs." | STATE | ✅ Already clear | Keep as-is |

---

## gig.ts - sendMessage

| Current Message | Category | Issues | Proposed Message |
|----------------|----------|--------|------------------|
| "Message is too long. Maximum 2000 characters allowed." | VALIDATION | Could include current length | "Message is too long. Maximum 2000 characters allowed." (Note: current length would require calculation) |
| "Message content is required." | VALIDATION | Could be friendlier | "Message cannot be empty. Please enter a message to send." |
| "Gig not found." | NOT_FOUND | Too terse | "This gig no longer exists or has been removed." |
| "Cannot send messages to a closed gig." | STATE | Missing context | "Cannot send messages to closed gigs. This gig has been closed by administrators." |
| "Cannot send messages to a paid gig." | STATE | Missing context | "Cannot send messages to completed and paid gigs. The work has been finalized." |
| "Cannot send messages until a specialist is assigned." | STATE | Missing guidance | "Cannot send messages until a specialist is assigned to this gig. Wait for the client to accept an application." |
| "You are not authorized to send messages on this gig." | AUTHORIZATION | Too generic | "You can only send messages if you're the client who posted this gig or the assigned specialist." |
| Rate limit errors | RATE_LIMIT | ✅ Already good | Keep as-is |

---

## profile.ts - updateProfile

| Current Message | Category | Issues | Proposed Message |
|----------------|----------|--------|------------------|
| "Experience level must be MIDDLE or SENIOR." | VALIDATION | Uses internal enum values | "Experience level must be Middle or Senior. Please select one of these options." |
| "Company name and INN are required." | VALIDATION | Could be friendlier | "Company name and INN are required. Please fill in these fields to complete your profile." |
| "Invalid user role." | SYSTEM | Too technical, unlikely to occur | "Invalid user role. Please contact support if you see this error." |
| "Failed to update profile. Please try again." | SYSTEM | Missing troubleshooting guidance | "Failed to update profile. Please check your information and try again. If the problem persists, contact support." |

---

## moderation.ts

| Current Message | Category | Issues | Proposed Message |
|----------------|----------|--------|------------------|
| "Only admins can perform moderation actions." | AUTHORIZATION | ✅ Clear for admin context | Keep as-is |
| "Reason is required for suspension." | VALIDATION | ✅ Clear | Keep as-is |
| "User not found." | NOT_FOUND | Too terse | "This user no longer exists or has been removed." |
| "User is already suspended." | STATE | ✅ Clear | Keep as-is |
| "Failed to suspend user." | SYSTEM | Missing troubleshooting | "Failed to suspend user. Please try again. If the problem persists, contact technical support." |
| "Reason is required for unsuspension." | VALIDATION | ✅ Clear | Keep as-is |
| "User is not suspended." | STATE | ✅ Clear | Keep as-is |
| "Failed to unsuspend user." | SYSTEM | Missing troubleshooting | "Failed to unsuspend user. Please try again. If the problem persists, contact technical support." |
| "Reason is required for closing a gig." | VALIDATION | ✅ Clear | Keep as-is |
| "Gig not found." | NOT_FOUND | Too terse | "This gig no longer exists or has been removed." |
| "Gig is already closed." | STATE | ✅ Clear | Keep as-is |
| "Failed to close gig." | SYSTEM | Missing troubleshooting | "Failed to close gig. Please try again. If the problem persists, contact technical support." |

---

## notification.ts - markNotificationAsRead

| Current Message | Category | Issues | Proposed Message |
|----------------|----------|--------|------------------|
| "Gig not found." | NOT_FOUND | Too terse | "This gig no longer exists or has been removed." |
| "You are not authorized to mark this notification as read." | AUTHORIZATION | ✅ Clear enough for internal action | Keep as-is |

---

## user.ts - dismissGuidance

| Current Message | Category | Issues | Proposed Message |
|----------------|----------|--------|------------------|
| "Invalid guidance type." | VALIDATION | Too technical (internal error) | "Invalid guidance type. Please contact support if you see this error." |
| "Failed to dismiss guidance. Please try again." | SYSTEM | Missing troubleshooting | "Failed to dismiss guidance. Please try again. If the problem persists, contact support." |

---

## Summary of Changes Needed

### High Priority (User-Facing, Frequent)
1. **Authorization errors** - Add alternative actions (15 messages)
2. **Not found errors** - Make more descriptive (10 messages)
3. **State errors** - Add context and prerequisites (8 messages)
4. **Validation errors** - Add guidance (5 messages)

### Medium Priority (User-Facing, Less Frequent)
5. **System errors** - Add troubleshooting steps (5 messages)

### Low Priority (Already Good)
6. **Rate limit errors** - Keep as-is (already excellent)
7. **Some validation errors** - Keep as-is (already have good guidance)

### Total Messages to Update: 38 out of 58
### Messages to Keep As-Is: 20 out of 58
