# EngineeringPaper.xyz Integration

> **Phase**: 14H (FUTURE — not implemented in Phase 14B)
> **Method**: File-based I/O via .epxyz JSON format

## Verdict

EngineeringPaper.xyz KHÔNG có API chính thức.
Tích hợp dựa trên xuất/nhập file .epxyz (JSON).

## Pipeline

```
EngineeringCalculationResult (JSON)
    ↓
epxyz/exporter.py → .epxyz file
    ↓
User opens in EngineeringPaper.xyz (browser/desktop)
    ↓
User verifies, modifies, re-solves
    ↓
User saves modified .epxyz
    ↓
epxyz/importer.py → extract values back
```

## Directory Structure

```
epxyz/
├── __init__.py
├── exporter.py         # Generate .epxyz from calculation result
└── importer.py         # Parse .epxyz to structured data
```
