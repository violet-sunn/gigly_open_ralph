# UI Specification Changes

## MODIFIED Requirements

### Requirement: Gig Creation Form Fee Preview
The gig creation form MUST display a real-time preview of the service fee and total amount as the user enters the budget.

#### Scenario: Fee preview calculation
- GIVEN a user is filling out the gig creation form
- WHEN the user enters a budget value in the budget field
- THEN the form MUST display:
  - Service Fee: **10%** of budget (changed from 20%)
  - Total Amount: budget + service fee
- AND the preview MUST update in real-time as the user types
- AND the preview MUST use Russian locale number formatting (e.g., "100 000")

#### Scenario: Fee preview for 100,000 ₽ budget
- GIVEN a user enters "100000" in the budget field
- WHEN the preview is calculated
- THEN the form MUST display:
  - Budget: 100 000 ₽
  - Service Fee (10%): 10 000 ₽
  - Total Amount: 110 000 ₽

**Acceptance Criteria:**
- Fee calculation in client component: `Math.floor(budgetNum * 0.10)` (changed from 0.20)
- Preview updates on every keystroke (controlled input)
- Numbers formatted with Russian locale (spaces as thousands separators)
- Preview only shows when budget is a valid positive number
- No UI text mentions "20%" in relation to service fee
