# LaTeX Report Architecture

> **Phase**: 14E (FUTURE — not implemented in Phase 14B)
> **Library**: Jinja2 + MiKTeX (pdflatex)
> **Fallback**: fpdf2

## Pipeline

```
EngineeringCalculationResult (JSON)
    ↓
latex/generator.py (Jinja2 templates)
    ↓
report.tex
    ↓
latex/compiler.py (pdflatex / xelatex)
    ↓
report.pdf
```

## Directory Structure

```
latex/
├── __init__.py
├── generator.py        # LaTeX document generator
├── compiler.py         # PDF compilation (MiKTeX + fallback)
└── templates/
    ├── calculation_report.tex.j2
    ├── preamble.tex.j2
    └── ...
```

## Report Language

Primary: **Tiếng Việt** (Vietnamese) — phù hợp TCVN và đồ án.
