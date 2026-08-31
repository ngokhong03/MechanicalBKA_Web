# Engineering Data Contract — JSON Schema Specification

> **Project**: MechanicalBKA Engineering Workspace  
> **Date**: 2026-08-30  
> **Version**: 1.0.0-draft  
> **Status**: Phase 14A — Design Complete

---

## 1. Overview

This document defines the JSON data contracts that flow through the Engineering Workspace pipeline. These schemas are the **single source of truth** — every consumer (Excel, LaTeX, EngineeringPaper.xyz) reads from the same `EngineeringCalculationResult`.

### Data Flow

```
User Input (natural language or structured form)
      ↓
AI structures into:
      ↓
EngineeringCalculationRequest (JSON)
      ↓
Python Calculation Engine validates & processes:
      ↓
EngineeringCalculationResult (JSON)  ← SINGLE SOURCE OF TRUTH
      ↓
  ├── excel/builder.py   → .xlsx
  ├── latex/generator.py → .tex → .pdf
  └── epxyz/exporter.py  → .epxyz
```

### Rule

```
No manual data transfer between components.
No copy/paste.
No re-entry.
No human in the data loop.
```

---

## 2. EngineeringCalculationRequest

### JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "EngineeringCalculationRequest",
  "description": "Input request for an engineering calculation",
  "type": "object",
  "required": ["project", "calculationType", "inputs"],
  "properties": {
    "project": {
      "type": "object",
      "required": ["name"],
      "properties": {
        "name": {
          "type": "string",
          "description": "Project name",
          "examples": ["Hộp giảm tốc 2 cấp"]
        },
        "code": {
          "type": "string",
          "description": "Project code/ID",
          "examples": ["HGT-2C-001"]
        },
        "author": {
          "type": "string",
          "description": "Author/designer name"
        },
        "checker": {
          "type": "string",
          "description": "Checker/reviewer name"
        },
        "date": {
          "type": "string",
          "format": "date",
          "description": "Calculation date"
        },
        "revision": {
          "type": "string",
          "default": "R0",
          "description": "Revision code"
        },
        "description": {
          "type": "string",
          "description": "Brief project description"
        }
      }
    },
    "calculationType": {
      "type": "string",
      "description": "Registered calculation module ID",
      "examples": [
        "gear_helical_sizing",
        "gear_spur_sizing",
        "shaft_bending_stress",
        "shaft_combined_stress",
        "bearing_life_L10",
        "bolt_preload_analysis",
        "belt_v_drive",
        "chain_roller_drive",
        "coupling_selection"
      ]
    },
    "inputs": {
      "type": "object",
      "description": "Key-value pairs of input parameters",
      "additionalProperties": {
        "type": "object",
        "required": ["value", "unit"],
        "properties": {
          "value": {
            "type": "number",
            "description": "Numerical value"
          },
          "unit": {
            "type": "string",
            "description": "Unit string (SI or engineering unit)",
            "examples": ["kW", "rpm", "mm", "MPa", "N·mm", "dimensionless"]
          },
          "description": {
            "type": "string",
            "description": "Human-readable description of this parameter"
          },
          "source": {
            "type": "string",
            "description": "Where this value came from",
            "examples": ["User input", "Motor nameplate", "TCVN Table 6.2", "Calculated from Phase 1"]
          }
        }
      }
    },
    "units": {
      "type": "object",
      "description": "Unit system preferences",
      "properties": {
        "system": {
          "type": "string",
          "enum": ["SI", "metric_engineering", "imperial"],
          "default": "SI",
          "description": "Base unit system"
        },
        "outputUnits": {
          "type": "object",
          "description": "Override output units for specific results",
          "additionalProperties": {
            "type": "string"
          },
          "examples": [{"a_w": "mm", "T1": "N·mm", "sigma": "MPa"}]
        }
      }
    },
    "assumptions": {
      "type": "array",
      "description": "Engineering assumptions for this calculation",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "examples": ["A1", "A2"]
          },
          "description": {
            "type": "string",
            "examples": ["Tải trọng ổn định, không va đập"]
          },
          "value": {
            "type": ["string", "number"],
            "description": "Assumption value if applicable"
          },
          "standard": {
            "type": "string",
            "description": "Standard reference for this assumption",
            "examples": ["TCVN 1065:2004, Bảng 6.5"]
          }
        }
      }
    },
    "formulaReferences": {
      "type": "array",
      "description": "Standards and references used in calculation",
      "items": {
        "type": "object",
        "properties": {
          "standard": {
            "type": "string",
            "examples": ["TCVN 1065:2004", "DIN 743", "AGMA 2001-D04", "ISO 281"]
          },
          "section": {
            "type": "string",
            "examples": ["Mục 6.3.2"]
          },
          "table": {
            "type": "string",
            "examples": ["Bảng 6.5"]
          },
          "formula": {
            "type": "string",
            "examples": ["CT 6.15a"]
          },
          "description": {
            "type": "string"
          }
        }
      }
    },
    "options": {
      "type": "object",
      "description": "Output generation options",
      "properties": {
        "generateExcel": {
          "type": "boolean",
          "default": true,
          "description": "Generate Excel workbook"
        },
        "generateLatex": {
          "type": "boolean",
          "default": true,
          "description": "Generate LaTeX report"
        },
        "generatePdf": {
          "type": "boolean",
          "default": true,
          "description": "Compile PDF (requires LaTeX)"
        },
        "generateEpxyz": {
          "type": "boolean",
          "default": false,
          "description": "Generate EngineeringPaper.xyz file"
        },
        "language": {
          "type": "string",
          "enum": ["vi", "en"],
          "default": "vi",
          "description": "Report language"
        }
      }
    }
  }
}
```

### Example Request

```json
{
  "project": {
    "name": "Hộp giảm tốc 2 cấp đồng trục",
    "code": "HGT-2C-001",
    "author": "Nguyễn Văn A",
    "date": "2026-08-30",
    "revision": "R0"
  },
  "calculationType": "gear_helical_sizing",
  "inputs": {
    "P": {"value": 5, "unit": "kW", "description": "Công suất truyền", "source": "Motor nameplate"},
    "n1": {"value": 1450, "unit": "rpm", "description": "Số vòng quay bánh chủ động", "source": "Motor nameplate"},
    "u": {"value": 3.2, "unit": "dimensionless", "description": "Tỷ số truyền", "source": "Thiết kế sơ bộ"}
  },
  "assumptions": [
    {"id": "A1", "description": "Tải trọng ổn định, không va đập", "standard": "TCVN, Bảng 6.5"},
    {"id": "A2", "description": "Vật liệu: Thép 45, tôi cải thiện", "standard": "TCVN, Bảng 6.1"}
  ],
  "options": {
    "generateExcel": true,
    "generateLatex": true,
    "generateEpxyz": true,
    "language": "vi"
  }
}
```

---

## 3. EngineeringCalculationResult

### JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "EngineeringCalculationResult",
  "description": "Output of an engineering calculation — single source of truth for all consumers",
  "type": "object",
  "required": ["requestId", "calculationType", "status", "inputs", "finalResults", "metadata"],
  "properties": {
    "requestId": {
      "type": "string",
      "format": "uuid",
      "description": "Unique ID linking result to request"
    },
    "calculationType": {
      "type": "string",
      "description": "Echo of the calculation module used"
    },
    "status": {
      "type": "string",
      "enum": ["SUCCESS", "WARNING", "ERROR", "VALIDATION_FAILED"],
      "description": "Overall calculation status"
    },
    "inputs": {
      "type": "object",
      "description": "Validated inputs with resolved units",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "value": {"type": "number", "description": "Value in calculation units"},
          "unit": {"type": "string", "description": "Unit used in calculation"},
          "originalValue": {"type": "number", "description": "Original input value"},
          "originalUnit": {"type": "string", "description": "Original input unit"},
          "converted": {"type": "boolean", "description": "Whether unit conversion was applied"},
          "description": {"type": "string"}
        }
      }
    },
    "assumptions": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {"type": "string"},
          "description": {"type": "string"},
          "value": {"type": ["string", "number"]},
          "appliedFrom": {"type": "string", "description": "Standard/source where assumption was taken"}
        }
      }
    },
    "intermediateResults": {
      "type": "array",
      "description": "Intermediate calculation values (shown in calculation steps)",
      "items": {
        "type": "object",
        "required": ["name", "value", "unit"],
        "properties": {
          "name": {"type": "string", "description": "Variable name", "examples": ["T1", "W_x"]},
          "symbol": {"type": "string", "description": "LaTeX symbol", "examples": ["T_1", "W_x"]},
          "value": {"type": "number"},
          "unit": {"type": "string"},
          "formula": {"type": "string", "description": "Display formula (text)", "examples": ["T₁ = 9.55×10⁶ × P / n₁"]},
          "formulaLatex": {"type": "string", "description": "LaTeX formula", "examples": ["T_1 = \\frac{9{,}55 \\times 10^6 \\cdot P}{n_1}"]},
          "description": {"type": "string", "description": "Vietnamese description"},
          "standard": {"type": "string", "description": "Standard reference"}
        }
      }
    },
    "finalResults": {
      "type": "array",
      "description": "Final output values with engineering checks",
      "items": {
        "type": "object",
        "required": ["name", "value", "unit"],
        "properties": {
          "name": {"type": "string"},
          "symbol": {"type": "string"},
          "value": {"type": "number"},
          "unit": {"type": "string"},
          "formula": {"type": "string"},
          "formulaLatex": {"type": "string"},
          "description": {"type": "string"},
          "checkCondition": {
            "type": "string",
            "description": "Engineering check condition",
            "examples": ["σ_H ≤ [σ_H]", "S_σ ≥ [S]"]
          },
          "checkResult": {
            "type": "string",
            "enum": ["PASS", "FAIL", "INFO"],
            "description": "Whether the check passed"
          },
          "allowableValue": {
            "type": "number",
            "description": "Allowable/limit value for comparison"
          },
          "allowableUnit": {"type": "string"},
          "safetyFactor": {
            "type": "number",
            "description": "Computed safety factor"
          },
          "margin": {
            "type": "number",
            "description": "Safety margin percentage"
          }
        }
      }
    },
    "steps": {
      "type": "array",
      "description": "Step-by-step calculation trace",
      "items": {
        "type": "object",
        "properties": {
          "step": {"type": "integer", "description": "Step number (1-indexed)"},
          "description": {"type": "string", "description": "Vietnamese step description"},
          "formula": {"type": "string", "description": "Display formula with substituted values"},
          "formulaLatex": {"type": "string", "description": "LaTeX formula"},
          "substitution": {"type": "string", "description": "Formula with numbers substituted"},
          "result": {"type": "string", "description": "Result string with unit"},
          "reference": {"type": "string", "description": "Standard reference (e.g., CT 6.15)"}
        }
      }
    },
    "warnings": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "code": {"type": "string", "examples": ["HIGH_STRESS", "LOW_SAFETY_FACTOR"]},
          "severity": {"type": "string", "enum": ["INFO", "WARNING", "CRITICAL"]},
          "message": {"type": "string"},
          "parameter": {"type": "string"},
          "suggestion": {"type": "string"}
        }
      }
    },
    "validation": {
      "type": "object",
      "description": "Overall validation summary",
      "properties": {
        "allChecksPassed": {"type": "boolean"},
        "totalChecks": {"type": "integer"},
        "passedChecks": {"type": "integer"},
        "failedChecks": {"type": "integer"},
        "checks": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": {"type": "string"},
              "condition": {"type": "string"},
              "result": {"type": "string", "enum": ["PASS", "FAIL"]},
              "actualValue": {"type": "number"},
              "limitValue": {"type": "number"},
              "margin": {"type": "number", "description": "Safety margin %"}
            }
          }
        }
      }
    },
    "error": {
      "type": "object",
      "description": "Error details (when status is ERROR or VALIDATION_FAILED)",
      "properties": {
        "code": {"type": "string", "examples": ["UNIT_MISMATCH", "RANGE_ERROR", "MISSING_INPUT"]},
        "message": {"type": "string"},
        "parameter": {"type": "string"},
        "provided": {"type": "object"},
        "expected": {"type": "object"}
      }
    },
    "metadata": {
      "type": "object",
      "required": ["engineVersion", "calculationModule", "timestamp"],
      "properties": {
        "engineVersion": {"type": "string", "examples": ["0.1.0"]},
        "calculationModule": {"type": "string"},
        "moduleVersion": {"type": "string"},
        "timestamp": {"type": "string", "format": "date-time"},
        "computationTimeMs": {"type": "integer"},
        "pythonVersion": {"type": "string"},
        "standards": {
          "type": "array",
          "items": {"type": "string"},
          "examples": [["TCVN 1065:2004", "Trịnh Chất - Lê Văn Uyển"]]
        },
        "outputFiles": {
          "type": "object",
          "properties": {
            "xlsx": {"type": "string", "description": "Path to generated Excel file"},
            "tex": {"type": "string", "description": "Path to generated LaTeX source"},
            "pdf": {"type": "string", "description": "Path to compiled PDF"},
            "epxyz": {"type": "string", "description": "Path to generated EP file"},
            "projectDir": {"type": "string", "description": "Path to project directory"}
          }
        }
      }
    }
  }
}
```

### Example Result

```json
{
  "requestId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "calculationType": "gear_helical_sizing",
  "status": "SUCCESS",
  "inputs": {
    "P": {"value": 5, "unit": "kW", "originalValue": 5, "originalUnit": "kW", "converted": false, "description": "Công suất truyền"},
    "n1": {"value": 1450, "unit": "rpm", "originalValue": 1450, "originalUnit": "rpm", "converted": false, "description": "Số vòng quay"},
    "u": {"value": 3.2, "unit": "dimensionless", "originalValue": 3.2, "originalUnit": "dimensionless", "converted": false, "description": "Tỷ số truyền"}
  },
  "assumptions": [
    {"id": "A1", "description": "Tải trọng ổn định, không va đập", "appliedFrom": "TCVN, Bảng 6.5"},
    {"id": "A2", "description": "Vật liệu: Thép 45, tôi cải thiện, HB 250", "appliedFrom": "TCVN, Bảng 6.1"}
  ],
  "intermediateResults": [
    {
      "name": "T1",
      "symbol": "T_1",
      "value": 32931.03,
      "unit": "N·mm",
      "formula": "T₁ = 9.55×10⁶ × P / n₁",
      "formulaLatex": "T_1 = \\frac{9{,}55 \\times 10^6 \\cdot P}{n_1}",
      "description": "Mô-men xoắn trên bánh chủ động",
      "standard": "Trịnh Chất, CT 6.15"
    }
  ],
  "finalResults": [
    {
      "name": "a_w",
      "symbol": "a_w",
      "value": 125.0,
      "unit": "mm",
      "formula": "a_w = Ka(u+1)∛(T1·KHβ/(ψba·u²·[σH]²))",
      "formulaLatex": "a_w = K_a (u+1) \\sqrt[3]{\\frac{T_1 K_{H\\beta}}{\\psi_{ba} u^2 [\\sigma_H]^2}}",
      "description": "Khoảng cách trục sơ bộ",
      "checkCondition": "a_w > 0",
      "checkResult": "PASS",
      "allowableValue": null,
      "safetyFactor": null
    }
  ],
  "steps": [
    {
      "step": 1,
      "description": "Tính mô-men xoắn trên bánh chủ động T₁",
      "formula": "T₁ = 9.55×10⁶ × 5 / 1450 = 32931.03 N·mm",
      "formulaLatex": "T_1 = \\frac{9{,}55 \\times 10^6 \\times 5}{1450} = 32931{,}03 \\text{ N·mm}",
      "reference": "Trịnh Chất, CT 6.15"
    },
    {
      "step": 2,
      "description": "Tính khoảng cách trục sơ bộ a_w",
      "formula": "a_w = 43 × (3.2+1) × ∛(32931.03 × 1.0 / (0.3 × 3.2² × 500²)) = 125.0 mm",
      "reference": "Trịnh Chất, CT 6.15a"
    }
  ],
  "warnings": [],
  "validation": {
    "allChecksPassed": true,
    "totalChecks": 1,
    "passedChecks": 1,
    "failedChecks": 0,
    "checks": [
      {"name": "a_w positive", "condition": "a_w > 0", "result": "PASS", "actualValue": 125.0}
    ]
  },
  "metadata": {
    "engineVersion": "0.1.0",
    "calculationModule": "gear_helical_sizing",
    "moduleVersion": "1.0.0",
    "timestamp": "2026-08-30T22:00:00+07:00",
    "computationTimeMs": 12,
    "pythonVersion": "3.14.7",
    "standards": ["TCVN 1065:2004", "Trịnh Chất - Lê Văn Uyển"],
    "outputFiles": {
      "xlsx": "output/HGT-2C-001_20260830_220000/calculation.xlsx",
      "tex": "output/HGT-2C-001_20260830_220000/report.tex",
      "pdf": "output/HGT-2C-001_20260830_220000/report.pdf",
      "epxyz": "output/HGT-2C-001_20260830_220000/calculation.epxyz",
      "projectDir": "output/HGT-2C-001_20260830_220000/"
    }
  }
}
```

---

## 4. Consumer Specifications

### Excel Builder

Reads from `EngineeringCalculationResult`:

| Sheet | Source Fields |
|---|---|
| Sheet 1 (Inputs) | `inputs` object — name, value, unit, description, source |
| Sheet 2 (Calculation) | `steps` array — step, description, formula, result, reference |
| Sheet 3 (Results) | `finalResults` array + `validation.checks` — value, check, PASS/FAIL |
| Sheet 4 (Assumptions) | `assumptions` array + `metadata.standards` |

### LaTeX Generator

Reads from `EngineeringCalculationResult`:

| Section | Source Fields |
|---|---|
| Title page | `metadata.calculationModule`, project info from request |
| Input table | `inputs` object |
| Assumptions | `assumptions` array |
| Calculation | `steps` array — uses `formulaLatex` for equations |
| Results | `finalResults` array — uses `checkResult` for color coding |
| References | `metadata.standards` |

### EP.xyz Exporter

Reads from `EngineeringCalculationResult`:

| Cell Type | Source Fields |
|---|---|
| Documentation cells | Step descriptions, section headers |
| Assignment cells | `inputs` — `name = value [unit]` |
| Query cells | `finalResults` — `name =` |
| Formula cells | `intermediateResults` — formulas with SymPy syntax |

---

## 5. Schema Versioning

The schema uses semantic versioning:

| Version | Compatibility |
|---|---|
| MAJOR (2.0.0) | Breaking changes — consumers must update |
| MINOR (1.1.0) | New optional fields — consumers remain compatible |
| PATCH (1.0.1) | Bug fixes in descriptions/examples — no data changes |

Current version: **1.0.0-draft**

The `metadata.engineVersion` field in every result tracks which schema version was used.
