# Engineering Workspace - Contracts Package
"""
Pydantic data contracts for the Engineering Workspace.
These are the SINGLE SOURCE OF TRUTH for all data flowing through the system.

Consumers:
    - Python calculation engine
    - Excel builder (openpyxl)
    - LaTeX generator (Jinja2)
    - EngineeringPaper.xyz exporter
    - React Engineering Workspace UI (via JSON serialization)

These contracts are NOT coupled to React or Firebase.
"""
