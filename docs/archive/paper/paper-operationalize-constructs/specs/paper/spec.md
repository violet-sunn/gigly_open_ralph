# Paper Spec Delta: paper-operationalize-constructs

## ADDED Requirements

### Requirement: Construct Definitions paragraph in §2

§2 of `icid-2026-paper-final.md` MUST contain a **Construct Definitions** paragraph that:

1. Is positioned after the paragraph ending "...tests, migrations, server actions, UI components — are generated." and before the paragraph beginning "The motivating problem SDD addresses is context decay..."
2. Defines **architectural drift as used in this study**: an observable state in which a code artifact violates one or more invariants documented in the canonical spec corpus at the time of its generation.
3. States the observable proxy for architectural drift: a backpressure event — compiler error, type system rejection, or test failure — triggered by violation of a pre-existing spec-documented convention, requiring correction to conform to that convention rather than introducing a new one.
4. Disambiguates from Pan et al. [2]: this study uses "architectural drift" in the sense of AI-generated deviation from established system invariants, distinct from Pan et al. [2] who use the term for legacy architecture recovery.
5. Defines **context decay as used in this study**: degradation in an AI agent's adherence to previously established architectural decisions, attributable to context window saturation rather than spec ambiguity.
6. States the observable proxy for context decay in SDD: its absence — no archived change introduced a regression against a prior change's spec-documented interface.
7. States the asymmetry observation: SDD makes context decay observable by its absence in a way that vibe coding does not, because vibe coding has no external spec against which to detect deviation.
8. Is approximately 150 words in length.

#### Scenario: Both constructs defined before §4

**Given** the paper as modified by this change  
**When** a reader reaches §4 ("Architectural Validation")  
**Then** both "architectural drift" and "context decay" have already been formally defined with observable proxies in §2

#### Scenario: Pan et al. disambiguation present

**Given** the Construct Definitions paragraph  
**When** inspected for the Pan et al. [2] reference  
**Then** the paragraph explicitly distinguishes this study's use of "architectural drift" from Pan et al. [2]'s use for legacy architecture recovery

#### Scenario: Observable proxies stated for both constructs

**Given** the Construct Definitions paragraph  
**When** inspected for observable proxies  
**Then** architectural drift's proxy is a backpressure event (compiler error, type system rejection, or test failure)  
**And** context decay's proxy in SDD is its absence (no regression against a prior change's spec-documented interface)

#### Scenario: Asymmetry observation present

**Given** the Construct Definitions paragraph  
**When** inspected for the asymmetry claim  
**Then** the paragraph states that SDD makes context decay observable by its absence, and that vibe coding cannot make this observation because it has no external spec

#### Scenario: Word count approximately 150

**Given** the Construct Definitions paragraph  
**When** its word count is measured  
**Then** the count is between 130 and 170 words
