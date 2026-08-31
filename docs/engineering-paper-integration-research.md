# EngineeringPaper.xyz — Integration Research Report

> **Project**: MechanicalBKA Engineering Workspace  
> **Date**: 2026-08-30  
> **Status**: RESEARCH COMPLETE  
> **Verdict**: NO OFFICIAL AUTOMATION — File-based integration only

---

## 1. What is EngineeringPaper.xyz?

EngineeringPaper.xyz is a **free, open-source web application** for engineering calculations that runs entirely in the browser using Pyodide (Python compiled to WebAssembly) and SymPy for symbolic mathematics.

- **GitHub**: [mgreminger/EngineeringPaper.xyz](https://github.com/mgreminger/EngineeringPaper.xyz)
- **License**: Open source
- **Architecture**: 100% client-side (no backend server)
- **Math Engine**: SymPy via Pyodide (WebAssembly)
- **Desktop**: EngineeringPaper.pro (installable PWA)

---

## 2. API & Automation Research

### Official Interfaces

| Interface | Exists? | Evidence |
|---|---|---|
| REST API | ❌ NO | No server backend — runs 100% in browser |
| GraphQL API | ❌ NO | No server backend |
| CLI tool | ❌ NO | No command-line interface published |
| WebSocket API | ❌ NO | No real-time communication channel |
| SDK / Library | ❌ NO | No importable package for external use |
| Webhook | ❌ NO | No event notification system |
| Deep-link / URL scheme | ❌ NO | Cannot open specific documents via URL params |
| Git integration | ❌ NO | Local file save only |

### Community / Third-party

| Tool | Relationship to EP.xyz | Status |
|---|---|---|
| `@paperjsx/mcp-server` (npm) | **UNRELATED** — for "Paper" canvas tool, NOT EngineeringPaper.xyz | ❌ Wrong product |
| LobeHub "Paper MCP Server" | **UNRELATED** — WebSocket canvas API for different "Paper" product | ❌ Wrong product |
| MCP Registry | No EngineeringPaper.xyz server listed | ❌ Not found |

### Automation Verdict

```
OFFICIAL API:           ❌ DOES NOT EXIST
COMMUNITY TOOL:         ❌ NONE FOR THIS PRODUCT (community refs are for different product)
UNDOCUMENTED METHOD:    ⚠️ File-based I/O via .epxyz JSON format
BROWSER AUTOMATION:     ⚠️ Possible but fragile — NOT recommended as primary approach
```

---

## 3. .epxyz File Format

### Overview

The `.epxyz` file is a **JSON document** that serializes an EngineeringPaper.xyz calculation sheet. The format can be reverse-engineered from the open-source GitHub repository.

### High-level Structure

```json
{
  "cells": [
    {
      "type": "math",
      "content": "P = 5 [kW]",
      "isAssignment": true,
      "isQuery": false
    },
    {
      "type": "documentation", 
      "content": "## Tính mô-men xoắn"
    },
    {
      "type": "math",
      "content": "T_1 = \\frac{9.55 \\times 10^6 \\cdot P}{n_1}",
      "isAssignment": true,
      "isQuery": true
    },
    {
      "type": "math",
      "content": "T_1 =",
      "isAssignment": false,
      "isQuery": true
    }
  ]
}
```

### Cell Types

| Type | Purpose | Example |
|---|---|---|
| `math` (assignment) | Define variable with value and unit | `d = 50 [mm]` |
| `math` (query) | Evaluate expression, solver computes | `σ_b =` |
| `math` (assignment + query) | Define formula and show result | `T_1 = 9.55e6 * P / n_1` |
| `documentation` | Markdown text between calculations | `## Section Title` |

### Unit System

EngineeringPaper.xyz uses a bracket notation for units:
- `P = 5 [kW]`
- `d = 50 [mm]`
- `σ = 120 [MPa]`

This is compatible with our `pint`-based unit system — conversion is straightforward.

### Expression Syntax

- Variables: `P`, `n_1`, `σ_b`, `T_1`
- Subscripts: `n_1` renders as n₁
- Greek letters: `σ`, `τ`, `π`
- Functions: `sqrt()`, `sin()`, `cos()`, `log()`
- Fractions: LaTeX-style `\frac{...}{...}`
- Powers: `x^2`, `x^{1/3}`

---

## 4. Integration Strategy

### Approach: File-based I/O

Since there is no API, our integration is **file-based**:

```
EngineeringCalculationResult (JSON)
       ↓
   epxyz/exporter.py
       ↓
   .epxyz file (JSON with EP cell format)
       ↓
   User opens in browser/desktop
       ↓
   Interactive verification & modification
       ↓
   User saves modified .epxyz
       ↓
   epxyz/importer.py
       ↓
   Structured data back in Engineering Workspace
```

### Exporter Design (exporter.py)

The exporter converts `EngineeringCalculationResult` to `.epxyz` format:

1. **Project header** → Documentation cell with title, date, author
2. **Input parameters** → Assignment cells with values and units
3. **Section headers** → Documentation cells
4. **Formulas** → Assignment + query cells
5. **Results** → Query cells
6. **Checks** → Documentation cells with pass/fail indicators

```python
def export_to_epxyz(result: dict) -> dict:
    """Convert EngineeringCalculationResult to .epxyz JSON format."""
    cells = []
    
    # Title
    cells.append({
        "type": "documentation",
        "content": f"# {result['metadata']['calculationModule']}"
    })
    
    # Inputs
    cells.append({"type": "documentation", "content": "## Thông số đầu vào"})
    for name, data in result["inputs"].items():
        cells.append({
            "type": "math",
            "content": f"{name} = {data['value']} [{data['unit']}]",
            "isAssignment": True,
            "isQuery": False
        })
    
    # Steps
    cells.append({"type": "documentation", "content": "## Tính toán"})
    for step in result.get("steps", []):
        cells.append({"type": "documentation", "content": step["description"]})
        if "formula" in step:
            cells.append({
                "type": "math",
                "content": step["formula"],
                "isAssignment": True,
                "isQuery": True
            })
    
    # Results
    cells.append({"type": "documentation", "content": "## Kết quả"})
    for res in result.get("finalResults", []):
        cells.append({
            "type": "math",
            "content": f"{res['name']} =",
            "isAssignment": False,
            "isQuery": True
        })
    
    return {"cells": cells}
```

### Importer Design (importer.py)

The importer parses `.epxyz` to extract variable assignments:

```python
def import_from_epxyz(epxyz_data: dict) -> dict:
    """Parse .epxyz JSON and extract variable assignments."""
    variables = {}
    
    for cell in epxyz_data.get("cells", []):
        if cell.get("type") == "math" and cell.get("isAssignment"):
            content = cell["content"]
            # Parse "name = value [unit]" pattern
            name, value, unit = parse_assignment(content)
            if name:
                variables[name] = {"value": value, "unit": unit}
    
    return variables
```

---

## 5. Limitations

| Limitation | Impact | Mitigation |
|---|---|---|
| No API → no real-time sync | Cannot update EP document live | User manually opens .epxyz file |
| No programmatic calculation | Cannot use EP as solver | We use Python directly (same SymPy engine) |
| No PDF/Word export automation | Cannot auto-generate EP's native exports | We generate our own PDF/Excel |
| Format may change | Breaking changes in .epxyz JSON | Version check + adapter pattern |
| Complex expressions | Some EP syntax may not map 1:1 | Graceful fallback to text representation |

---

## 6. Future Integration Boundary

The exporter/importer is designed behind an **interface boundary** so that if EngineeringPaper.xyz releases an official API in the future, only the adapter implementation needs to change:

```python
# Interface
class EPBridge:
    def export(self, result: dict) -> str:
        """Export result to EP format. Returns file path."""
        raise NotImplementedError
    
    def import_data(self, file_path: str) -> dict:
        """Import data from EP file. Returns structured data."""
        raise NotImplementedError

# Current implementation (file-based)
class EPFileBridge(EPBridge):
    def export(self, result): ...
    def import_data(self, file_path): ...

# Future implementation (API-based, when available)
class EPApiBridge(EPBridge):
    def export(self, result): ...
    def import_data(self, file_path): ...
```

---

## 7. Recommendation

1. **Phase 14H**: Implement file-based `.epxyz` export/import
2. **Reverse-engineer** the exact `.epxyz` schema from `mgreminger/EngineeringPaper.xyz` source
3. **Primary value**: Verification tool — users open `.epxyz` to visually verify calculations
4. **Do NOT** build browser automation as primary integration
5. **Monitor** EP.xyz releases for potential API additions
6. **Design** for API swap-in via interface boundary
