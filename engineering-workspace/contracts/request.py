"""
Engineering Calculation Request — Pydantic Data Contract.

This model defines the input contract for all engineering calculations.
It is the structured form of the user's engineering requirement.

Consumers: Python engine, MCP server
Producers: AI agent (from natural language), React UI (from form)

NOT coupled to React, Firebase, or any specific framework.
"""

from __future__ import annotations

import uuid
from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field, field_validator


class CalculationStatus(str, Enum):
    """Status of a calculation module."""
    AVAILABLE = "available"
    PLANNED = "planned"
    DEPRECATED = "deprecated"


class OutputFormat(str, Enum):
    """Supported output formats."""
    JSON = "json"
    EXCEL = "excel"
    LATEX = "latex"
    PDF = "pdf"
    EPXYZ = "epxyz"
    MARKDOWN = "markdown"


class Language(str, Enum):
    """Supported report languages."""
    VI = "vi"
    EN = "en"


class ParameterInput(BaseModel):
    """A single engineering input parameter with value and unit."""
    value: float = Field(..., description="Numerical value of the parameter")
    unit: str = Field(..., description="Unit string (e.g., 'kW', 'rpm', 'mm', 'MPa')")
    description: str | None = Field(
        None, description="Human-readable description (Vietnamese)"
    )
    source: str | None = Field(
        None,
        description="Where this value comes from (e.g., 'Motor nameplate', 'TCVN Table 6.2')",
    )

    @field_validator("unit")
    @classmethod
    def unit_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Đơn vị không được để trống (unit must not be empty)")
        return v.strip()


class UnitPreferences(BaseModel):
    """Unit system preferences for the calculation."""
    system: str = Field(
        "SI", description="Base unit system: 'SI', 'metric_engineering', 'imperial'"
    )
    output_units: dict[str, str] = Field(
        default_factory=dict,
        description="Override output units for specific results (e.g., {'a_w': 'mm'})",
    )


class CalculationOptions(BaseModel):
    """Options controlling calculation behavior and output generation."""
    generate_excel: bool = Field(True, description="Generate Excel workbook")
    generate_latex: bool = Field(True, description="Generate LaTeX report")
    generate_pdf: bool = Field(True, description="Compile PDF (requires LaTeX)")
    generate_epxyz: bool = Field(False, description="Generate EngineeringPaper.xyz file")
    language: Language = Field(Language.VI, description="Report language")
    include_intermediate_steps: bool = Field(
        True, description="Include intermediate calculation steps in output"
    )
    decimal_places: int = Field(
        2, description="Default decimal places for results", ge=0, le=10
    )


class EngineeringCalculationRequest(BaseModel):
    """
    Input request for an engineering calculation.

    This is the structured form that the AI produces from the user's
    natural-language engineering description. The Python engine validates
    and processes this request — the AI NEVER performs calculations.

    Example flow:
        User: "Thiết kế sơ bộ trục truyền công suất 7.5 kW, n = 1450 rpm"
        AI → EngineeringCalculationRequest(
            calculation_type="shaft_design",
            inputs={"P": ParameterInput(value=7.5, unit="kW"), ...}
        )
        Python → validates → calculates → EngineeringCalculationResult
    """

    request_id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        description="Unique request ID",
    )
    calculation_type: str = Field(
        ...,
        description="Registered calculation module ID (e.g., 'shaft_design', 'gear_design')",
    )
    project_id: str | None = Field(
        None, description="Project identifier (e.g., 'HGT-2C-001')"
    )
    title: str | None = Field(
        None,
        description="Calculation title (e.g., 'Thiết kế sơ bộ trục I')",
    )
    language: Language = Field(Language.VI, description="Report language")

    inputs: dict[str, ParameterInput] = Field(
        ...,
        description="Input parameters keyed by parameter name",
    )
    units: UnitPreferences = Field(
        default_factory=UnitPreferences,
        description="Unit system preferences",
    )
    options: CalculationOptions = Field(
        default_factory=CalculationOptions,
        description="Output generation options",
    )
    requested_outputs: list[OutputFormat] = Field(
        default_factory=lambda: [OutputFormat.JSON],
        description="Which output formats to generate",
    )

    assumptions: list[str] = Field(
        default_factory=list,
        description="Engineering assumptions for this calculation",
    )
    references: list[str] = Field(
        default_factory=list,
        description="Standards and references (e.g., 'TCVN 1065:2004')",
    )

    created_at: datetime = Field(
        default_factory=datetime.now,
        description="Request creation timestamp",
    )

    @field_validator("calculation_type")
    @classmethod
    def calculation_type_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError(
                "Loại tính toán không được để trống "
                "(calculation_type must not be empty)"
            )
        return v.strip()

    @field_validator("inputs")
    @classmethod
    def inputs_not_empty(cls, v: dict[str, ParameterInput]) -> dict[str, ParameterInput]:
        if not v:
            raise ValueError(
                "Phải có ít nhất một thông số đầu vào "
                "(at least one input parameter is required)"
            )
        return v
