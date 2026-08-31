# Engineering Workspace - Excel Package
"""
Excel workbook generation using openpyxl.

PRINCIPLE: Excel is an OUTPUT FORMAT, not the calculation engine.
Python is the source of truth for all engineering calculations.
The user NEVER manually operates Excel.

Architecture:
    - builder.py: Workbook construction from EngineeringCalculationResult
    - formatter.py: Cell formatting, styles, themes, conditional formatting
    - schemas.py: Sheet structure definitions
    - templates/: Pre-built workbook templates per calculation type

Pipeline:
    AI request → EngineeringCalculationRequest → Python engine →
    EngineeringCalculationResult → Excel Builder → formatted .xlsx →
    USER DOWNLOADS/OPENS (read-only review)

NOT IMPLEMENTED in Phase 14B. See excel/README.md.
"""
