# Change Proposal: Specialist Profiles

## Change Name
`specialist-profiles`

## Problem Statement
Currently, users (both CLIENTS and SPECIALISTS) have minimal profile information stored in the system. The User model only contains authentication fields (email, password, role). However, the product vision requires:

- **Specialists** to showcase their expertise through Tech Stack, Experience Level (Middle/Senior), bio, and other professional details
- **Clients** to provide company information including Company Name, INN/KPP for B2B invoicing and trust

Without profile pages, specialists cannot differentiate themselves when applying to gigs, and clients cannot provide necessary business information for the B2B marketplace.

## Proposed Solution
Implement user profile pages with role-specific profile tables:

### Database Architecture:
- **ClientProfile** table with 1:1 relation to User (for CLIENT role)
- **SpecialistProfile** table with 1:1 relation to User (for SPECIALIST role)

This approach avoids database bloating and empty data cells, as clients and specialists have completely different field requirements.

### For SPECIALISTS (SpecialistProfile table):
- Display name (optional, defaults to email)
- Tech stack (comma-separated tags, e.g., "React, TypeScript, Node.js")
- Experience level (enum: MIDDLE, SENIOR)
- Bio (free-text description)
- Hourly rate (optional, in roubles)

### For CLIENTS (ClientProfile table):
- Company name (required for B2B)
- INN (Individual Taxpayer Number, required)
- KPP (Tax Registration Reason Code, optional)
- Contact person name (optional)
- Phone number (optional)

### Features:
1. Profile view page at `/dashboard/profile` (own profile)
2. Profile edit page at `/dashboard/profile/edit`
3. Public profile view at `/dashboard/profile/[userId]` (read-only, for other users to see)
4. Server action for updating profile
5. Profile completion indicator on dashboard

## Scope

### In Scope:
- Database schema: ClientProfile and SpecialistProfile models with 1:1 relations to User
- Profile view and edit pages
- Server action for profile updates
- Role-based field validation
- Display specialist profile on gig applications (for clients reviewing applications)
- Display client profile on gig detail pages (for specialists viewing gigs)

### Out of Scope:
- Profile photo upload (future enhancement)
- Profile verification/badges
- Portfolio/work samples
- Profile completion enforcement (users can skip for now)
- Public profile directory/search

## Constraints
- Profile tables use 1:1 relations to User (userId as primary key and foreign key)
- All profile fields are optional except Company Name and INN for CLIENTS (to support B2B requirements)
- Experience level for SPECIALISTS is limited to MIDDLE and SENIOR (per product vision)
- Monetary values (hourly rate) stored in kopecks, displayed in roubles
- Profile records are created lazily (only when user first edits their profile)

## Success Criteria
- Users can view and edit their profiles
- Specialist profiles display on applications (visible to gig owners)
- Client profiles display on gig detail pages (visible to specialists)
- Profile fields are validated based on role
- Database migrations run successfully
- No null/empty fields in profile tables (only relevant data stored)
