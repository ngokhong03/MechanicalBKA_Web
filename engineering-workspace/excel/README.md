# Excel Automation Architecture

> **Phase**: 14D (FUTURE — not implemented in Phase 14B)
> **Library**: openpyxl

## Core Principle

> Excel là định dạng ĐẦU RA, KHÔNG phải công cụ tính toán.
> Python là nguồn sự thật duy nhất cho mọi tính toán kỹ thuật.
> Người dùng KHÔNG CẦN thao tác thủ công trên Excel.

## Pipeline

```
AI request (natural language)
    ↓
EngineeringCalculationRequest (Pydantic)
    ↓
Python calculation engine (deterministic)
    ↓
EngineeringCalculationResult (JSON — single source of truth)
    ↓
Excel Builder (openpyxl — automatic)
    ↓
formatted .xlsx (read-only output)
    ↓
USER DOWNLOADS / OPENS / REVIEWS
```

## Planned Directory Structure

```
excel/
├── __init__.py
├── builder.py          # Workbook construction from EngineeringCalculationResult
├── formatter.py        # Cell formatting, styles, conditional formatting
├── schemas.py          # Sheet structure definitions per calculation type
└── templates/          # Pre-built workbook templates
    ├── gear_calculation.xlsx
    ├── shaft_calculation.xlsx
    └── ...
```

## Workbook Sheets

| Sheet | Purpose |
|---|---|
| THÔNG SỐ ĐẦU VÀO | Input parameters with symbols, values, units, sources |
| TÍNH TOÁN | Step-by-step calculation trace with formulas |
| KẾT QUẢ | Final results with PASS/FAIL checks (✅/❌) |
| GIẢ THIẾT & TIÊU CHUẨN | Assumptions and standard references |

## What the User Does NOT Need to Know

- Which cells to fill
- Which formulas to enter
- How to format the workbook
- How to map columns
- How to paste results
