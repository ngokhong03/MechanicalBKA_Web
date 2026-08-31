# MechanicalBKA Engineering Workspace — Architecture Plan

> **Document**: Phase 14 Architecture & Research Report  
> **Project**: MechanicalBKA Web  
> **Date**: 2026-08-30 (Updated)  
> **Status**: APPROVED — Phase 14A  
> **Location**: `D:\01_Projects_HocTap\05_MechanicalBKA_Web\docs\engineering-workspace-architecture.md`

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Repository Audit](#2-repository-audit)
3. [Current MCP Status](#3-current-mcp-status)
4. [Data-Agent-Kit Error — Root Cause Analysis](#4-data-agent-kit-error--root-cause-analysis)
5. [MCP Architecture Proposal](#5-mcp-architecture-proposal)
6. [Python Engineering Calculation Engine](#6-python-engineering-calculation-engine)
7. [Excel Automation Architecture](#7-excel-automation-architecture)
8. [LaTeX Report Architecture](#8-latex-report-architecture)
9. [EngineeringPaper.xyz Integration Research](#9-engineerpaperxyz-integration-research)
10. [JSON Data Contract](#10-json-data-contract)
11. [Backend Architecture Analysis](#11-backend-architecture-analysis)
12. [Engineering Workspace UI](#12-engineering-workspace-ui)
13. [File Package Design](#13-file-package-design)
14. [Security Model](#14-security-model)
15. [Error Handling](#15-error-handling)
16. [Testing Strategy](#16-testing-strategy)
17. [AI Role — Engineering Orchestrator](#17-ai-role--engineering-orchestrator)
18. [Phase 14 Implementation Roadmap](#18-phase-14-implementation-roadmap)
19. [Summary Status Report](#19-summary-status-report)

---

## 1. Executive Summary

### Goal

Reduce manual operations in mechanical engineering projects to near-zero. The user describes a technical problem; the system automatically:

1. Understands the requirement (AI)
2. Structures the engineering input (AI)
3. Runs deterministic calculations (Python)
4. Generates an Excel workbook (openpyxl)
5. Generates a LaTeX/PDF report (Jinja2 + MiKTeX)
6. Creates an EngineeringPaper.xyz file (JSON export)
7. Packages everything into a downloadable project folder

### Core Principle

```
USER ← not an Excel expert, not a LaTeX expert
  ↓
AI ← understands, asks, structures (NEVER calculates)
  ↓
Python ← calculates, validates, deterministic
  ↓
JSON ← single source of truth
  ↓
Excel + LaTeX + .epxyz ← automatic output
  ↓
Complete engineering documentation package
```

---

## 2. Repository Audit

### Current Architecture (Phase 13 Complete)

```
MechanicalBKA Web (React 19 + Vite 8 + Firebase 12)
├── src/
│   ├── App.jsx                — BrowserRouter, 17 public + 11 admin routes
│   ├── main.jsx               — Entry point
│   ├── context/
│   │   ├── AuthContext.jsx    — Firebase Auth + Mock Auth dual mode
│   │   └── CartContext.jsx    — Shopping cart state
│   ├── services/
│   │   ├── dataProvider.js    — Firestore/Mock data abstraction layer
│   │   ├── adminService.js    — Admin CRUD operations
│   │   ├── orderService.js    — Order processing
│   │   ├── downloadService.js — Secure download client
│   │   ├── entitlementService.js — Access entitlement checks
│   │   └── accessService.js   — Access control helpers
│   ├── firebase/config.js     — Firebase SDK init (VITE_USE_FIREBASE toggle)
│   ├── config/
│   │   ├── payment.js         — Payment configuration
│   │   └── youtube.js         — YouTube API config
│   ├── pages/                 — 35 page components
│   │   └── admin/             — 12 admin CMS pages (lazy loaded)
│   ├── components/
│   │   ├── ProtectedRoute.jsx — Route guards (auth + admin)
│   │   ├── cards/             — Card components
│   │   ├── common/            — Shared components
│   │   └── layout/            — Header, Footer, etc.
│   ├── layouts/               — MainLayout wrapper
│   ├── mock/                  — Mock data (development mode)
│   └── assets/                — Static assets
├── functions/
│   ├── index.js               — Cloud Functions v2 (secure download)
│   └── package.json           — Functions dependencies (firebase-admin, cors)
├── scripts/                   — 15 validation/utility scripts
├── docs/                      — Architecture documentation
├── public/                    — Static public files
├── dist/                      — Production build output
├── firestore.rules            — Firestore security rules (4.2 KB)
├── storage.rules              — Cloud Storage security rules
├── package.json               — Project dependencies
├── vite.config.js             — Vite configuration (minimal)
├── vercel.json                — Vercel deployment config
└── .env / .env.example        — Environment variables
```

### Dependencies (package.json)

| Package | Version | Purpose |
|---|---|---|
| react | ^19.2.8 | UI framework |
| react-dom | ^19.2.8 | DOM rendering |
| react-router-dom | ^7.18.2 | Client-side routing |
| firebase | ^12.18.0 | Firebase SDK (Auth, Firestore) |
| lucide-react | ^1.34.0 | Icon library |
| @vitejs/plugin-react | ^6.1.0 | Vite React plugin |
| vite | ^8.2.2 | Build tool |
| oxlint | ^1.79.0 | Linter |
| firebase-admin | ^14.3.0 | Admin SDK (scripts only) |

### Reusable Components for Engineering Workspace

| Component | Reuse Potential |
|---|---|
| `dataProvider.js` pattern | Model for Engineering data service |
| `AuthContext.jsx` | User authentication for workspace access |
| `ProtectedRoute.jsx` | Route guard for `/engineering` |
| Admin lazy-loading pattern | Lazy load Engineering Workspace UI |
| `downloadService.js` | Model for engineering file download |
| Cloud Functions pattern | Template for future engineering API endpoints |

### Key Constraints

- Engineering Workspace MUST integrate into existing architecture
- MUST NOT create standalone separate application
- MUST follow existing patterns (dataProvider, context, lazy loading)
- MUST NOT break existing Phase 3-13 functionality
- MUST maintain Firebase/Mock dual mode

---

## 3. Current MCP Status

### Audit Evidence (2026-08-30, re-verified)

| MCP Server | Status | Transport | Evidence |
|---|---|---|---|
| **notebooks** | ✅ OPERATIONAL | Named Pipe | 11 tools registered, processes running |
| **visualization** | ✅ OPERATIONAL | Named Pipe | 1 tool registered (render_chart) |
| **data-agent-kit** | ⚠️ OPERATIONAL (intermittent) | Named Pipe | 4 lazy tools, all responded successfully |

### Configuration File

- **Location**: `C:\Users\trong\.gemini\config\mcp_config.json` (793 bytes)
- **Only config file** — no workspace-level `mcp_config.json`
- All 3 MCPs use same proxy: `mcp_proxy_bundle.js`
- Proxy connects via Windows Named Pipes (IPC) to IDE extension backend

### Tool Schemas

| Server | Tools | Count |
|---|---|---|
| notebooks | create_notebook, insert_markdown_cell, insert_code_cell, replace_cell, delete_cell, get_notebook_info, read_cell, list_cells, search_cells, get_cell_range, get_cell_outputs | 11 |
| visualization | render_chart | 1 |
| data-agent-kit | get_active_editor_context, get_active_gcp_connection, list_resource_templates, read_resource | 4 (lazy) |

---

## 4. Data-Agent-Kit Error — Root Cause Analysis

### What "context canceled" means

```
Antigravity Agent → stdin → node mcp_proxy_bundle.js → Named Pipe → IDE Extension Backend
```

The proxy has retry mechanism (MAX_ATTEMPTS=10, RETRY_DELAY_MS=2000ms = 20s total). The error occurs when:
1. The agent's request context times out before proxy completes response
2. OR the IDE extension backend is temporarily unresponsive

### Root Cause

**Primary Cause: Startup race condition + request context timeout**

The MCP proxy was restarted when the Settings page probed it. The probe's context expired before the proxy completed the Named Pipe connection handshake. This is a **transient timing issue**, not a configuration or installation error.

### Evidence

| Evidence | Detail |
|---|---|
| Named pipe | Active and confirmed |
| Node proxy | Processes running |
| Extension | `googlecloudtools.datacloud-0.9.1-universal` — path exists |
| Node.js | v24.19.0 — compatible |
| Crash logs | All empty (0 bytes) |
| Live test | All 4 tools responded **successfully** |

### Recommendation

| Action | Priority |
|---|---|
| **Do nothing to config** | HIGH — correct, working |
| **Monitor** | MEDIUM |
| **Set GCP project** | LOW — may reduce init time |

---

## 5. MCP Architecture Proposal

### Current vs. Proposed

```
CURRENT:
┌─────────────┐  ┌───────────────┐  ┌─────────────────┐
│  notebooks   │  │ visualization │  │ data-agent-kit  │
│  UNCHANGED   │  │  UNCHANGED    │  │  UNCHANGED      │
└─────────────┘  └───────────────┘  └─────────────────┘

                         + ADD:

┌──────────────────────────────────────────────────────┐
│           engineering-workspace (NEW MCP)             │
│                                                      │
│  ┌──────────────┐  ┌──────────┐  ┌────────────────┐ │
│  │ python-calc  │  │  excel   │  │  latex-report  │ │
│  │   engine     │  │  engine  │  │    engine      │ │
│  └──────┬───────┘  └────┬─────┘  └───────┬────────┘ │
│         └───────────┬───┘────────────────┘          │
│                     │                                │
│         EngineeringCalculationResult (JSON)          │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │  engineeringpaper-bridge (file I/O adapter)    │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

### Transport: stdio (not Named Pipes)

Standalone Python server, simpler, more debuggable, standard MCP SDK pattern.

### mcp_config.json Addition (ADD only)

```json
{
  "mcpServers": {
    "notebooks": { "/* UNCHANGED */" },
    "visualization": { "/* UNCHANGED */" },
    "data-agent-kit": { "/* UNCHANGED */" },
    "engineering-workspace": {
      "command": "python",
      "args": [
        "D:\\01_Projects_HocTap\\05_MechanicalBKA_Web\\engineering-workspace\\server.py"
      ],
      "env": {
        "WORKSPACE_ROOT": "D:\\01_Projects_HocTap\\05_MechanicalBKA_Web",
        "OUTPUT_DIR": "D:\\01_Projects_HocTap\\05_MechanicalBKA_Web\\output",
        "TEMPLATE_DIR": "D:\\01_Projects_HocTap\\05_MechanicalBKA_Web\\engineering-workspace\\templates"
      }
    }
  }
}
```

### Proposed MCP Tools

| Tool Name | Category | Description |
|---|---|---|
| `calculate` | Engine | Run calculation module, return JSON result |
| `list_calculations` | Engine | List available calculation types |
| `validate_inputs` | Engine | Validate inputs before calculation |
| `create_workbook` | Excel | Create .xlsx from result + template |
| `generate_report` | LaTeX | Generate .tex + .pdf from result |
| `export_epxyz` | EP Bridge | Generate .epxyz from result |
| `import_epxyz` | EP Bridge | Parse .epxyz to structured data |
| `export_project` | Package | Export complete project folder |

---

## 6. Python Engineering Calculation Engine

### Core Principle

> **Python does ALL calculations. AI does ZERO calculations.**

### Module Structure

```
engineering-workspace/
├── server.py                    # MCP server entry point (stdio)
├── pyproject.toml               # Dependencies
├── engine/
│   ├── __init__.py
│   ├── registry.py              # Module registry
│   ├── validator.py             # Input/unit/range validation
│   ├── units.py                 # Unit system (pint-based)
│   └── modules/
│       ├── __init__.py
│       ├── gear_design.py       # Gear geometry, stress, sizing
│       ├── shaft_design.py      # Shaft strength, deflection
│       ├── bearing_selection.py # Bearing life, load rating
│       ├── bolt_analysis.py     # Bolt tension, shear, preload
│       ├── belt_drive.py        # Belt tension, power
│       ├── chain_drive.py       # Chain selection
│       ├── coupling_design.py   # Coupling selection
│       └── common/
│           ├── materials.py     # Material properties
│           ├── standards.py     # Standard tables (TCVN, DIN, AGMA)
│           └── interpolation.py # Table interpolation
├── excel/
│   ├── __init__.py
│   ├── builder.py               # Workbook builder (openpyxl)
│   ├── formatter.py             # Formatting, styles
│   └── templates/
├── latex/
│   ├── __init__.py
│   ├── generator.py             # LaTeX generator (Jinja2)
│   ├── compiler.py              # PDF compilation
│   └── templates/
├── epxyz/
│   ├── __init__.py
│   ├── exporter.py              # .epxyz export
│   └── importer.py              # .epxyz import
├── contracts/
│   ├── __init__.py
│   ├── request.py               # Pydantic request model
│   └── result.py                # Pydantic result model
├── output/                      # Generated files (git-ignored)
└── tests/
    ├── conftest.py
    ├── test_gear_design.py
    ├── test_shaft_design.py
    ├── test_validator.py
    ├── test_excel_builder.py
    └── golden/                  # Golden reference files
```

### Calculation Module Pattern

```python
from engine.registry import register_calculation
from engine.validator import validate_inputs

@register_calculation("gear_helical_sizing")
def gear_helical_sizing(request: dict) -> dict:
    """
    Preliminary sizing of helical gear pair.
    Standard: TCVN 1065:2004, Trịnh Chất - Lê Văn Uyển

    Required: P [kW], n1 [rpm], u [-]
    Optional: K_Hβ [-], ψ_ba [-]
    """
    inputs = validate_inputs(request["inputs"], {
        "P": {"unit": "kW", "min": 0.01, "required": True},
        "n1": {"unit": "rpm", "min": 1, "required": True},
        "u": {"unit": "dimensionless", "min": 1.0, "required": True},
    })

    P = inputs["P"]["value"]
    n1 = inputs["n1"]["value"]
    u = inputs["u"]["value"]

    T1 = (9.55e6 * P) / n1  # Torque [N·mm]

    return {
        "intermediateResults": [
            {"name": "T1", "value": round(T1, 2), "unit": "N·mm",
             "formula": "T₁ = 9.55×10⁶ × P / n₁",
             "description": "Mô-men xoắn trên bánh chủ động"},
        ],
        "finalResults": [...],
        "steps": [...],
    }
```

### Dependencies

| Package | Purpose | Status |
|---|---|---|
| pint | Unit system | ❌ NOT INSTALLED |
| numpy | Numerical computation | ❌ NOT INSTALLED |
| scipy | Interpolation, optimization | ❌ NOT INSTALLED |
| sympy | Symbolic math | ❌ NOT INSTALLED |
| openpyxl | Excel read/write | ❌ NOT INSTALLED |
| mcp | MCP server SDK | ❌ NOT INSTALLED |
| pydantic | Data validation | ❌ NOT INSTALLED |
| jinja2 | LaTeX templates | ❌ NOT INSTALLED |
| fpdf2 | PDF fallback | ❌ NOT INSTALLED |
| pytest | Testing | ❌ NOT INSTALLED |

Environment: Python 3.14.7 (global), pip 26.2.1 only. `.venv` to be created.

---

## 7. Excel Automation Architecture

### Design Philosophy

> The user NEVER opens Excel to enter data or formulas.
> Excel is an **output artifact** created by the system.

### Technology Comparison

| Option | Win | Cloud | Browser | Security | Format | Charts | R+W | Maint. | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| **A. openpyxl** | ✅ | ✅ | ❌ | ✅ | ✅✅ | ✅ | ✅ | Low | **SELECTED** |
| B. xlsxwriter | ✅ | ✅ | ❌ | ✅ | ✅✅ | ✅✅ | ❌ | Low | Runner-up |
| C. MS Graph | ✅ | ✅ | ✅ | ⚠️ | ✅ | ✅ | ✅ | High | Overkill |
| D. Office Scripts | ❌ | ✅ | ✅ | ⚠️ | ✅ | ✅ | ✅ | High | Lock-in |
| E. COM | ✅ | ❌ | ❌ | ⚠️ | ✅✅✅ | ✅✅✅ | ✅ | High | Win-only |
| F. LibreOffice | ✅ | ✅ | ❌ | ✅ | ⚠️ | ✅ | ✅ | Med | 100MB+ |

### Workbook Structure

```
Sheet 1: "THÔNG SỐ ĐẦU VÀO" (Inputs)
Sheet 2: "TÍNH TOÁN" (Calculation Steps)
Sheet 3: "KẾT QUẢ" (Results + ✅/❌)
Sheet 4: "GIẢ THIẾT & TIÊU CHUẨN" (Assumptions)
```

---

## 8. LaTeX Report Architecture

### Workflow

```
EngineeringCalculationResult (JSON)
  → latex/generator.py (Jinja2)
  → report.tex
  → latex/compiler.py (pdflatex)
  → report.pdf
```

### LaTeX Status

| Requirement | Status |
|---|---|
| pdflatex | ❌ NOT FOUND |
| MiKTeX | ❌ NOT INSTALLED |

**Decision**: Install MiKTeX. Fallback: fpdf2 for PDF, .tex always generated.

---

## 9. EngineeringPaper.xyz Integration Research

### Verdict

**NO OFFICIAL AUTOMATION EXISTS.**

| Aspect | Finding |
|---|---|
| Public API | ❌ None |
| CLI | ❌ None |
| MCP Server | ⚠️ Community refs are for DIFFERENT product |
| Backend | None — 100% browser (Pyodide + SymPy) |
| File format | `.epxyz` = JSON |
| Open source | ✅ GitHub: mgreminger/EngineeringPaper.xyz |

### Integration: File-based I/O only

```
Python Result → exporter.py → .epxyz → User opens in EP → verifies
User saves → importer.py → extract values back
```

---

## 10. JSON Data Contract

See: `docs/engineering-data-contract.md` for full JSON Schema.

### Data Flow

```
User → AI → EngineeringCalculationRequest → Python → EngineeringCalculationResult
                                                            ↓
                                                    ├── Excel (.xlsx)
                                                    ├── LaTeX (.tex/.pdf)
                                                    └── EP (.epxyz)
```

### Rule

EngineeringCalculationResult is the **SINGLE SOURCE OF TRUTH**. No copy/paste. No re-entry.

---

## 11. Backend Architecture Analysis

| Option | Verdict |
|---|---|
| **Local MCP Server (Python stdio)** | **SELECTED for Phase 14** |
| Cloud Functions | Future Phase |
| Cloud Run | Future Phase |
| Dedicated service | Future Phase |

Migration path: Local MCP → Cloud Run (same Python code, same JSON contracts).

---

## 12. Engineering Workspace UI

Route: `/engineering` (lazy loaded, ProtectedRoute)

```
┌─────────────────────────────┬───────────────────────────────┐
│  INPUT                      │  RESULTS                      │
│  ┌───────────────────────┐  │  ┌─────────────────────────┐  │
│  │ AI Chat / Input Form  │  │  │ Inputs (validated)      │  │
│  │ Structured parameters │  │  │ Calculation steps       │  │
│  │ [▶ Run Calculation]   │  │  │ Results (PASS/FAIL)     │  │
│  └───────────────────────┘  │  │ [📊 Excel] [📄 PDF]    │  │
│                             │  │ [📐 EP.xyz] [📦 ALL]   │  │
│                             │  └─────────────────────────┘  │
└─────────────────────────────┴───────────────────────────────┘
```

---

## 13. File Package Design

```
output/project_YYYYMMDD_HHMMSS/
├── calculation-request.json
├── calculation-result.json
├── calculation.xlsx
├── report.tex
├── report.pdf
├── calculation.epxyz
├── figures/
└── metadata.json
```

ONE CLICK → full documentation package.

---

## 14. Security Model

| Rule | Enforcement |
|---|---|
| AI cannot modify formulas | Modules are Python code, not AI-generated |
| AI cannot change coefficients | Hardcoded with standard references |
| AI cannot alter units | validator.py validates before calculation |
| AI cannot override safety factors | From standard tables only |
| Results are deterministic | Same input → same output |
| No arbitrary filesystem access | Output only to output/ directory |
| No shell command execution | MCP tools only |
| Module allowlist | Only registered modules callable |

---

## 15. Error Handling

| Category | Response |
|---|---|
| Input Validation | VALIDATION_FAILED + errors |
| Unit Error | Expected vs. provided unit |
| Range Error | Valid range |
| Calculation Error | Step where failure occurred |
| Module Not Found | Available modules list |
| File I/O Error | Partial result + details |
| LaTeX Error | .tex source + error log |

---

## 16. Testing Strategy

| Type | Description |
|---|---|
| Unit tests | Per-module with textbook answers |
| Schema tests | Pydantic model validation |
| Integration tests | Full pipeline |
| Regression tests | Golden file comparison |
| Excel tests | .xlsx structure verification |
| LaTeX tests | Compilation without errors |
| Round-trip tests | .epxyz export → import |
| Determinism tests | Same input → same output |

Key invariant: `∀ request: calculate(request) == calculate(request)`

---

## 17. AI Role — Engineering Orchestrator

AI MUST: understand, ask, validate, call tools, present results.
AI MUST NOT: calculate, guess, modify formulas, override checks.

---

## 18. Phase 14 Implementation Roadmap

| Phase | Description | Status |
|---|---|---|
| **14A** | Architecture & Research | ✅ COMPLETE |
| **14B** | Foundation Setup (.venv, contracts, engine core, MCP server) | ✅ COMPLETE (47/47 checks) |
| **14C** | EngineeringCalculationResult Contract Hardening (SSOT) | ✅ COMPLETE (88/88 tests) |
| **14D** | Tool Packaging & Commercial Product Architecture | ✅ COMPLETE (docs/tool-packaging-architecture.md) |
| **14E** | Shaft Design Tool Implementation (First Commercial MVP) | ⏳ READY FOR APPROVAL |
| **14F** | Excel Automation Builder (openpyxl generation) | ⏳ PLANNED |
| **14G** | LaTeX & PDF Report Generator | ⏳ PLANNED |
| **14H** | EngineeringPaper.xyz Product Line Bridge | ⏳ PLANNED |
| **14I** | Tool Packaging Automation & Store Integration | ⏳ PLANNED |

---

## 19. Summary Status Report

### Architecture & Contracts Status

| Component | Status | Documentation Reference |
|---|---|---|
| Foundation Engine Core | ✅ OPERATIONAL | `engineering-workspace/engine/` |
| Calculation Contract (SSOT) | ✅ HARDENED | `contracts/result.py`, `docs/engineering-data-contract.md` |
| Packaging Architecture | ✅ APPROVED | `docs/tool-packaging-architecture.md` |
| Product-Tool Contract | ✅ APPROVED | `docs/product-tool-contract.md` |
| Next Implementation Target | 🎯 Shaft Design Tool MVP | `modules/shaft_design.py` (Phase 14E) |

