# FraudShield Identity — AI Agent Review

**Reviewed:** 2026-05-14  
**Reviewer:** Claude Sonnet 4.6 (Automated Code + Architecture Review)  
**Repo:** [krishnaparuchuri-productmanager/fraudshieldidentity](https://github.com/krishnaparuchuri-productmanager/fraudshieldidentity)  
**Live Demo:** https://fraudshieldidentitymvp.lovable.app

---

## 1. App Overview

### Purpose
FraudShield Identity is a mobile-first web app for detecting identity fraud in the Indian fintech/lending sector. It targets fraud analysts, KYC operations teams, and risk managers at banks, NBFCs, and fintechs who face ₹30,000+ crore in annual digital identity fraud losses.

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript + Vite |
| Routing | React Router DOM v6 |
| State | React Context (Auth) + TanStack React Query |
| UI | shadcn/ui + Radix UI primitives |
| Styling | Tailwind CSS (custom `fraud-*` color tokens) |
| Animation | Framer Motion |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Testing | Vitest + Testing Library |
| Data | 100% client-side mock data (`src/lib/mockData.ts`) |
| Auth | Session-based (sessionStorage), no backend |
| Build | Vite 5.4, TypeScript strict mode |

### Core Features
- **Identity Scan** — Enter 12-digit Aadhaar, get AI risk score (0-100) with fraud signal breakdown
- **Risk Score Meter** — Animated SVG gauge (LOW/MEDIUM/HIGH/CRITICAL), "AI Confidence: 94%" label
- **Fraud Case Dashboard** — KPI cards, filterable case queue (P1-P3 priority), case cards with masked Aadhaar
- **KYC Workflow** — 4-step guided verification: Aadhaar → Document Upload → Liveness Check → Review
- **Result Actions** — Escalate to Review / Mark Verified / Block Identity (contextual by risk level)
- **Profile** — Role display, notification preferences, secure sign-out
- **Bottom Navigation** — KYC | My Cases | Scan | Profile tabs

### Users / Roles
Two hardcoded demo accounts (both `demo1234`):
- `kiran.patel@fraudshield.in` — Senior Fraud Analyst
- `ananya.rao@fraudshield.in` — KYC Operations Lead

---

## 2. Assets

### Screenshots

| File | Screen | Description |
|------|--------|-------------|
| [01-home-splash.png](screenshots/01-home-splash.png) | Splash | Landing page with Sign In CTA |
| [02-login.png](screenshots/02-login.png) | Login | Login form with demo credentials |
| [03-login-filled.png](screenshots/03-login-filled.png) | Login | Credentials entered, ready to submit |
| [04-dashboard.png](screenshots/04-dashboard.png) | Dashboard | KPI cards view |
| [04-dashboard-clean.png](screenshots/04-dashboard-clean.png) | Dashboard | Clean dashboard overview |
| [04b-dashboard-cases.png](screenshots/04b-dashboard-cases.png) | Dashboard | Case list scrolled |
| [05-dashboard-fab.png](screenshots/05-dashboard-fab.png) | Dashboard | FAB quick actions panel |
| [06-scan.png](screenshots/06-scan.png) | Scan | Identity scan entry screen |
| [06b-scan-filled.png](screenshots/06b-scan-filled.png) | Scan | Aadhaar number entered (formatted) |
| [07-result-high.png](screenshots/07-result-high.png) | Result | HIGH RISK result (score 72) |
| [07b-result-signals.png](screenshots/07b-result-signals.png) | Result | Fraud signals breakdown |
| [07c-result-details.png](screenshots/07c-result-details.png) | Result | Identity details + action buttons |
| [07d-result-critical.png](screenshots/07d-result-critical.png) | Result | CRITICAL RISK (score 91) |
| [08-kyc.png](screenshots/08-kyc.png) | KYC | Step 1 — Aadhaar verification |
| [08b-kyc-steps.png](screenshots/08b-kyc-steps.png) | KYC | Steps progress indicator |
| [08-kyc-step1.png](screenshots/08-kyc-step1.png) | KYC | KYC step 1 detail |
| [09-profile.png](screenshots/09-profile.png) | Profile | User profile and settings |
| [10-dashboard-filter-p1.png](screenshots/10-dashboard-filter-p1.png) | Dashboard | Filtered by P1 Critical cases |

### Video Demo

**File:** [screenshots/app-demo-annotated.mp4](screenshots/app-demo-annotated.mp4)  
**Duration:** 63 seconds | **Resolution:** 1080×1920 | **Format:** H.264 MP4 | **Size:** 2.0 MB

| Timestamp | Section | Annotation |
|-----------|---------|-----------|
| 0–5s | Splash screen | "Step 1: App Landing Page" |
| 5–10s | Login form | "Step 2: User Login" |
| 10–15s | Dashboard (5s pause) | "Step 3: Main Dashboard" |
| 15–25s | Case list + filters + FAB | "Step 4: Key Features Demo" |
| 25–30s | Scan + Aadhaar input | "Step 5: Identity Scan Flow" |
| 30–35s | HIGH RISK result (5s pause) | "Step 6: Analytics / Risk Report" |
| 35–45s | KYC 4-step workflow | "Step 7: KYC Verification Workflow" |
| 45–55s | Profile + sign out | "Step 8: Session Complete" |
| 55–63s | End title card | "App Demo Complete" |

---

## 3. Code Review

### Quality Assessment: **B+ — Production-Ready UI Prototype**

The codebase is a polished, well-structured React prototype. It demonstrates strong UI/UX instincts and clean component composition. The primary limitation is that it has **no backend, no real API calls, and no persistent state** — everything runs off `src/lib/mockData.ts`.

---

### 3.1 Strengths

**Clean component decomposition** — Feature-specific components (`RiskScoreMeter`, `CaseCard`, `FraudSignalCard`, `StepIndicator`) are self-contained and reusable. Pages import from `@/components/*` with consistent patterns.

**Accessible mobile-first design** — `min-touch-target: 44px` enforced throughout, `aria-label` attributes on interactive elements, `sr-only` labels on sensitive inputs. The `max-w-sm` container correctly mirrors a native mobile app.

**Type-safe data model** — Interfaces `FraudSignal`, `AadhaarProfile`, `FraudCase`, and `KycStep` in `src/lib/mockData.ts` represent a realistic production data model. TypeScript strict mode is configured in `tsconfig.app.json`.

**Animation quality** — Framer Motion is used judiciously (entrance animations, staggered lists, animated risk score counter). Not over-animated; transitions feel purposeful.

**Auth pattern is secure for a demo** — `src/lib/auth.tsx` explicitly excludes passwords from sessionStorage, uses case-insensitive email matching, and throws on incorrect `useAuth()` usage outside provider.

---

### 3.2 Issues & Gaps

#### Critical (Blockers for production)

| # | File | Issue |
|---|------|-------|
| C1 | `src/lib/mockData.ts` | **All data is hardcoded mock.** No API integration, no real Aadhaar/UIDAI calls, no database. Every "scan" returns pre-set profiles regardless of input. |
| C2 | `src/lib/auth.tsx` | **No real authentication.** sessionStorage persistence with no expiry, no JWT, no backend session validation. Credentials (`demo1234`) are bundled in client JS. |
| C3 | `src/pages/ScanPage.tsx` | **Scan is simulated** — 1.5s `setTimeout` then navigates to mock data. Input Aadhaar has no validation against UIDAI format (checksum digit). |
| C4 | `src/pages/ResultPage.tsx` | **"Escalate to Review" generates a fake case ID** via `Math.random()` and shows a toast — no actual case creation, no persistence, no notification to reviewers. |

#### Moderate (Quality / Maintainability)

| # | File | Issue |
|---|------|-------|
| M1 | `src/components/ui/command.tsx:24` | `@typescript-eslint/no-empty-object-type` error — empty interface declaration |
| M2 | `src/components/ui/textarea.tsx:5` | Same empty interface error |
| M3 | `tailwind.config.ts:107` | `require()` used instead of ES import — lint error |
| M4 | `src/lib/auth.tsx:12,71` | Fast-refresh warning — context + non-component exports in same file |
| M5 | `src/pages/KycPage.tsx` | Document upload and liveness check are **fully simulated** with `setTimeout` — no actual file handling or camera access |
| M6 | Multiple pages | **No error boundaries** — unhandled errors in navigation or mock data lookup would show blank screens |
| M7 | `src/pages/DashboardPage.tsx` | KPI cards display hardcoded values ("142 cases today", "+12%") — no computation from mock case data |

#### Minor (Polish / Best practices)

| # | File | Issue |
|---|------|-------|
| P1 | `src/test/example.test.ts` | Only 1 trivial placeholder test (`expect(true).toBe(true)`). No component tests, no hook tests. |
| P2 | `src/components/CaseCard.tsx` | Falls back to `profileIndex 0` (Priya Sharma LOW risk) for unmatched Aadhaar lookups — could mislead analysts |
| P3 | `src/components/RiskScoreMeter.tsx` | "AI Confidence: 94%" is hardcoded — not derived from any model output |
| P4 | `src/pages/ProfilePage.tsx` | "Notification preferences", "Security & access", "Help & support" all show "Coming soon" toast — non-functional |
| P5 | `src/lib/mockData.ts` | Aadhaar numbers use partial masking (`XXXX-XXXX-4521`) — the full number is never stored, making the scan input logic use `replace('X', '1')` substitution |

---

### 3.3 Test Coverage

| Area | Status |
|------|--------|
| Unit tests | 1 trivial placeholder — **0% real coverage** |
| Component tests | None |
| Integration tests | None |
| E2E tests | None |
| A11y tests | None |

---

## 4. AI Agent Opportunities

Ranked by **impact × feasibility** for this domain.

---

### Agent 1 — Real-Time Risk Scoring Agent ⭐⭐⭐⭐⭐ (Priority 1)

**Problem:** `src/pages/ScanPage.tsx` simulates scoring with a `setTimeout`. The `RiskScoreMeter` shows hardcoded "AI Confidence: 94%". There's no real ML inference.

**Opportunity:** Replace the mock scan with a **Claude API tool-use agent** that:
1. Receives the Aadhaar number + context (linked accounts, location, timestamp)
2. Calls tools: `check_uidai_record`, `lookup_bureau_history`, `check_sim_swap_signals`, `query_blacklist_db`
3. Synthesizes a risk score with per-signal confidence and natural-language reasoning
4. Returns structured JSON: `{ score, riskLevel, signals[], confidence, reasoning }`

**Files to modify:** `src/pages/ScanPage.tsx`, `src/lib/mockData.ts` → replace `handleScan()`  
**Backend:** FastAPI endpoint wrapping Claude API with tool_use  
**Expected value:** Transforms static demo into a real fraud detection engine

---

### Agent 2 — Case Triage & Escalation Agent ⭐⭐⭐⭐⭐ (Priority 1)

**Problem:** `src/pages/ResultPage.tsx` — "Escalate to Review" generates a random case ID and shows a toast. No actual routing, no analyst assignment, no priority calculation.

**Opportunity:** An **agentic triage pipeline** that:
1. Analyzes the full fraud profile (score, signals, linked accounts, velocity)
2. Determines correct priority tier (P1/P2/P3) using Claude's reasoning
3. Routes to available analyst based on workload and specialization
4. Creates case record in database with pre-populated investigation checklist
5. Sends alerts (Slack/email) with case summary

**Files to modify:** `src/pages/ResultPage.tsx:handleEscalate()`  
**New files:** `src/agents/triageAgent.ts`, backend `POST /api/cases`  
**Expected value:** Eliminates manual triage, reduces P1 case response time by >50%

---

### Agent 3 — Document Intelligence Agent ⭐⭐⭐⭐ (Priority 2)

**Problem:** `src/pages/KycPage.tsx` — Step 2 (Document Upload) simulates a 2-second upload delay and always returns "Document verified ✓". No actual OCR, no tampering detection.

**Opportunity:** A **document processing agent** using Claude's vision API that:
1. Receives uploaded Aadhaar card / PAN / passport image
2. Extracts fields: name, DOB, address, ID number via OCR
3. Cross-checks extracted data against declared Aadhaar profile
4. Detects tampering signals: font inconsistencies, metadata anomalies, image splicing
5. Returns verification result with confidence + flagged anomalies

**Files to modify:** `src/pages/KycPage.tsx` Step 2 handler  
**Claude API:** Vision + structured output with tool_use for cross-reference checks  
**Expected value:** Replaces manual document review, catches tampered documents automatically

---

### Agent 4 — Liveness & Biometric Verification Agent ⭐⭐⭐⭐ (Priority 2)

**Problem:** `src/pages/KycPage.tsx` — Step 3 (Liveness Check) shows an animated scanning line for 2 seconds and always confirms liveness. No actual camera access, no biometric analysis.

**Opportunity:** A **liveness detection agent** that:
1. Captures webcam frames via `getUserMedia`
2. Sends frames to a vision model for presence/liveness verification
3. Detects presentation attacks (photos, videos, masks)
4. Cross-references facial features with ID document photo from Step 2
5. Assigns biometric match confidence score

**Files to modify:** `src/pages/KycPage.tsx` Step 3 handler  
**Tech:** WebRTC + Claude Vision API streaming  
**Expected value:** Eliminates remote KYC fraud vector (photo spoofing, deepfakes)

---

### Agent 5 — Conversational Fraud Analyst Copilot ⭐⭐⭐⭐ (Priority 2)

**Problem:** Analysts viewing `DashboardPage.tsx` must manually filter, click through cases, and form their own judgments. There's no search, no natural language query, no AI assistance.

**Opportunity:** A **conversational copilot** embedded in the dashboard that:
- Answers: "Show me all P1 cases with SIM swap signals from Mumbai this week"
- Explains: "Why is Vikram Singh flagged CRITICAL?" → detailed reasoning
- Suggests: "Based on the pattern, this looks like a synthetic identity ring — 3 related cases"
- Drafts: Incident reports and escalation emails from case data
- Learns: Analyst feedback on false positives to improve future scoring

**Files to modify:** `src/pages/DashboardPage.tsx` — add chat panel  
**Implementation:** Claude API with function calling over mock/real case data  
**Expected value:** 40%+ reduction in analyst decision time on complex cases

---

### Agent 6 — Automated KYC Compliance Agent ⭐⭐⭐ (Priority 3)

**Problem:** `src/pages/KycPage.tsx` Step 4 (Review & Submit) shows a summary card but has no compliance checks, no regulatory validation, no audit trail generation.

**Opportunity:** A **compliance validation agent** that:
1. Cross-checks KYC data completeness against RBI/SEBI requirements
2. Flags missing documentation or expired records
3. Generates a signed audit trail with timestamps and verification chain
4. Auto-populates regulatory filing forms (CKYC, Video KYC compliance)
5. Alerts compliance officer if manual review is required

**Files to modify:** `src/pages/KycPage.tsx` Step 4 + final submit handler  
**Expected value:** Reduces compliance review overhead, prevents regulatory penalties

---

### Agent 7 — Fraud Pattern & Network Analysis Agent ⭐⭐⭐ (Priority 3)

**Problem:** `src/lib/mockData.ts` contains 8 individual cases but no relationship graph. Analysts cannot see connections between cases (same device, same address, same mule account network).

**Opportunity:** A **graph analysis agent** that:
1. Builds a relationship graph from case data (shared attributes)
2. Detects fraud rings: clusters of connected suspicious identities
3. Visualizes the network in the dashboard (using Recharts or D3)
4. Scores newly scanned identities against known fraud rings
5. Surfaces related cases automatically when an analyst opens a case

**Files to modify:** `src/pages/DashboardPage.tsx`, `src/lib/mockData.ts`  
**New component:** `src/components/FraudNetworkGraph.tsx`  
**Expected value:** Detects organized fraud rings that individual case review misses

---

## 5. Agent Architecture Recommendation

```
┌─────────────────────────────────────────────────────────┐
│                    FraudShield Frontend                   │
│  React + TypeScript + Vite (max-w-sm mobile container)   │
└──────────────────────┬──────────────────────────────────┘
                       │ REST / WebSocket
┌──────────────────────▼──────────────────────────────────┐
│                   Agent Orchestrator                      │
│              FastAPI  (Python 3.12+)                      │
│                                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │ Risk Scoring│  │   Triage    │  │  Document Intel │  │
│  │   Agent     │  │   Agent     │  │    Agent        │  │
│  │(Claude API) │  │(Claude API) │  │ (Claude Vision) │  │
│  └──────┬──────┘  └──────┬──────┘  └────────┬────────┘  │
│         │                │                   │           │
│  ┌──────▼────────────────▼───────────────────▼────────┐  │
│  │                   Tool Layer                        │  │
│  │  UIDAI Mock  │  Bureau API  │  OCR Service          │  │
│  │  Case DB     │  Slack/Email │  Biometric Check      │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                   Data Layer                              │
│  PostgreSQL (cases, profiles)  │  Redis (session cache)  │
│  S3/MinIO (documents)          │  Vector DB (embeddings) │
└─────────────────────────────────────────────────────────┘
```

### Recommended SDK Pattern

Use the **Anthropic Python SDK with tool_use** for each agent:

```python
# Risk Scoring Agent skeleton
import anthropic

client = anthropic.Anthropic()

tools = [
    {"name": "check_uidai_record", "description": "Query UIDAI API for Aadhaar status",
     "input_schema": {"type": "object", "properties": {"aadhaar": {"type": "string"}}}},
    {"name": "get_bureau_signals", "description": "Fetch credit bureau fraud signals",
     "input_schema": {"type": "object", "properties": {"aadhaar": {"type": "string"}}}},
    {"name": "check_sim_swap", "description": "Check for recent SIM swap activity",
     "input_schema": {"type": "object", "properties": {"mobile": {"type": "string"}}}},
]

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    tools=tools,
    messages=[{
        "role": "user",
        "content": f"Analyze Aadhaar {aadhaar} for fraud risk. Call all available tools and return a structured risk assessment."
    }]
)
```

### Prompt Caching Strategy

Enable **prompt caching** on the system prompt containing fraud signal definitions, regulatory rules, and investigation guidelines — this is a large, static context that changes infrequently:

```python
response = client.messages.create(
    model="claude-sonnet-4-6",
    system=[{
        "type": "text",
        "text": FRAUD_RULES_AND_SIGNALS,  # ~2000 tokens, static
        "cache_control": {"type": "ephemeral"}
    }],
    ...
)
```

---

## 6. Top 3 Immediate Priorities + Roadmap

### Priority 1 (Sprint 1, Week 1-2): Real Risk Scoring Backend

**Why first:** This is the core product claim. Without real scoring, every other feature is theater.

**Tasks:**
1. Create `POST /api/scan` endpoint (FastAPI)
2. Implement `RiskScoringAgent` with Claude API + tool_use
3. Build 3 mock tools: `check_uidai`, `get_bureau_signals`, `check_velocity`
4. Replace `src/pages/ScanPage.tsx` `handleScan()` with API call
5. Update `src/pages/ResultPage.tsx` to render dynamic agent output

**Success metric:** Scan returns different scores for different inputs, with reasoning text.

---

### Priority 2 (Sprint 2, Week 3-4): Document Intelligence Agent

**Why second:** KYC document verification is the highest-value automation for lenders. It directly reduces operational cost.

**Tasks:**
1. Enable camera/file upload in `src/pages/KycPage.tsx` Step 2
2. Create `POST /api/kyc/verify-document` with Claude Vision
3. Implement OCR extraction + cross-reference check
4. Add tampering detection heuristics
5. Return per-field confidence scores to frontend

**Success metric:** Upload a real Aadhaar card image → see extracted fields + verification status.

---

### Priority 3 (Sprint 3, Week 5-6): Analyst Copilot (Dashboard Chat)

**Why third:** Analyst productivity compound-returns — every case the copilot helps with saves 10-20 minutes of investigation time.

**Tasks:**
1. Add `<CopilotPanel>` component to `src/pages/DashboardPage.tsx`
2. Implement streaming Claude API response with function calling
3. Connect to case data functions: `get_case()`, `search_cases()`, `get_related_cases()`
4. Enable natural language case queries
5. Add "draft escalation email" capability

**Success metric:** Analyst types "explain why case FS-2026-00142 is P1" → gets a 3-sentence explanation with evidence links.

---

### 12-Week Roadmap

| Week | Milestone |
|------|-----------|
| 1-2 | Real risk scoring API + Claude tool_use backend |
| 3-4 | Document intelligence (OCR + tamper detection) |
| 5-6 | Analyst copilot (dashboard chat panel) |
| 7-8 | Real authentication (OAuth2 / Auth0), user roles RBAC |
| 9-10 | Case database (PostgreSQL), persistent case creation |
| 11-12 | Fraud network graph analysis + ring detection |

---

## 7. Environment Setup (for contributors)

```bash
git clone https://github.com/krishnaparuchuri-productmanager/fraudshieldidentity.git
cd fraudshieldidentity
npm install
npm run dev        # → http://localhost:5173

# Demo login
# Email:    kiran.patel@fraudshield.in
# Password: demo1234
```

**No environment variables required** — the current version is entirely frontend with mock data.

**Lint results:** 3 errors (empty interfaces in `ui/command.tsx`, `ui/textarea.tsx`; `require()` in `tailwind.config.ts`), 9 warnings (fast-refresh patterns). All in generated shadcn/ui files.

**Test results:** 1/1 tests pass (`src/test/example.test.ts` — placeholder only).

---

*Generated by automated code review + screenshot capture + video production pipeline.*  
*Assets: 19 screenshots + 1 annotated MP4 in `screenshots/` folder.*
