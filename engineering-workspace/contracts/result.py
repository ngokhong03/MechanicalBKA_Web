"""
Engineering Calculation Result — Pydantic Data Contract.

This model defines the output of all engineering calculations.
It is the SINGLE SOURCE OF TRUTH (SSOT) consumed by:
    1. Excel generator (openpyxl)
    2. LaTeX generator (Jinja2)
    3. EngineeringPaper.xyz exporter (.epxyz JSON)
    4. React Engineering Workspace UI (via JSON serialization)

No manual data transfer between components.
No copy/paste. No re-entry. No human in the data loop.

NOT coupled to React, Firebase, or any specific framework.
"""

from __future__ import annotations

import uuid
from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field, field_validator, model_validator


class ResultStatus(str, Enum):
    """Overall status of a calculation result."""
    SUCCESS = "success"
    WARNING = "warning"
    ERROR = "error"
    VALIDATION_FAILED = "validation_failed"


class CheckResult(str, Enum):
    """Engineering check result."""
    PASS = "pass"
    FAIL = "fail"
    INFO = "info"


class WarningSeverity(str, Enum):
    """Warning severity level."""
    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"


class NormalizedInput(BaseModel):
    """An input parameter after validation and unit normalization."""
    name: str = Field(..., description="Parameter name")
    original_value: float = Field(..., description="Original input value")
    original_unit: str = Field(..., description="Original input unit")
    normalized_value: float = Field(..., description="Value in calculation units")
    normalized_unit: str = Field(..., description="Unit used for calculation")
    was_converted: bool = Field(False, description="Whether unit conversion was applied")
    description: str | None = Field(None, description="Human-readable description")
    source: str | None = Field(None, description="Source of parameter value")

    @field_validator("name", "original_unit", "normalized_unit")
    @classmethod
    def validate_non_empty_strings(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("String field cannot be empty or whitespace")
        return v.strip()


class CalculationStep(BaseModel):
    """
    A single step in the calculation trace.
    Preserves calculation execution order and formula evaluation details.
    """
    step: int = Field(..., description="Step sequence number (1-indexed)")
    step_id: str | None = Field(
        None,
        description="Stable unique identifier for this step (e.g., 'torque_calc', 'aw_sizing')",
    )
    description: str = Field(..., description="Vietnamese/English description of this step")
    formula: str = Field(
        ..., description="Display formula with symbols (e.g., 'T₁ = 9.55×10⁶ × P / n₁')"
    )
    formula_latex: str | None = Field(
        None,
        description="LaTeX formula (e.g., r'T_1 = \\frac{9.55 \\times 10^6 \\cdot P}{n_1}')",
    )
    variables: dict[str, Any] = Field(
        default_factory=dict,
        description="Variables and substituted values used in this step (e.g. {'P': 5.0, 'n1': 1450})",
    )
    substitution: str | None = Field(
        None, description="Formula with numbers substituted (e.g., '9.55×10⁶ × 5.0 / 1450')"
    )
    value: float | None = Field(None, description="Evaluated numerical result value")
    unit: str | None = Field(None, description="Result unit (e.g., 'N·mm', 'MPa')")
    result_display: str | None = Field(
        None, description="Formatted result string (e.g., '32931.03 N·mm')"
    )
    reference: str | None = Field(
        None, description="Standard reference (e.g., 'TCVN 1065:2004', 'Trịnh Chất, CT 6.15')"
    )

    @field_validator("description", "formula")
    @classmethod
    def validate_non_empty_text(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Field cannot be empty or whitespace")
        return v.strip()

    @field_validator("unit")
    @classmethod
    def validate_unit_stripped(cls, v: str | None) -> str | None:
        if v is not None:
            v_str = v.strip()
            if not v_str:
                raise ValueError("Unit cannot be empty or whitespace only")
            return v_str
        return None

    @model_validator(mode="before")
    @classmethod
    def handle_legacy_fields(cls, data: Any) -> Any:
        if isinstance(data, dict):
            # Support legacy field names: result_value -> value, result_unit -> unit
            if "result_value" in data and "value" not in data:
                data["value"] = data["result_value"]
            if "result_unit" in data and "unit" not in data:
                data["unit"] = data["result_unit"]
        return data

    @property
    def result_value(self) -> float | None:
        """Backward-compatibility alias for value."""
        return self.value

    @property
    def result_unit(self) -> str | None:
        """Backward-compatibility alias for unit."""
        return self.unit


# Backward compatibility alias
EquationStep = CalculationStep


class IntermediateValue(BaseModel):
    """An intermediate calculation value."""
    name: str = Field(..., description="Variable name (e.g., 'T1')")
    symbol: str | None = Field(None, description="LaTeX symbol (e.g., 'T_1')")
    value: float = Field(..., description="Numerical value")
    unit: str = Field(..., description="Unit string (e.g., 'N·mm')")
    formula: str | None = Field(None, description="Display formula")
    formula_latex: str | None = Field(None, description="LaTeX formula")
    description: str | None = Field(None, description="Vietnamese description")
    standard: str | None = Field(None, description="Standard reference")

    @field_validator("name", "unit")
    @classmethod
    def validate_non_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Field cannot be empty or whitespace")
        return v.strip()


class OutputValue(BaseModel):
    """A final output value with optional engineering check."""
    name: str = Field(..., description="Variable name")
    symbol: str | None = Field(None, description="LaTeX symbol")
    value: float = Field(..., description="Numerical value")
    unit: str = Field(..., description="Unit string")
    description: str | None = Field(None, description="Vietnamese description")
    formula: str | None = Field(None, description="Display formula")
    formula_latex: str | None = Field(None, description="LaTeX formula")

    # Engineering check fields
    check_condition: str | None = Field(
        None, description="Check condition (e.g., 'σ_H ≤ [σ_H]')"
    )
    check_result: CheckResult | None = Field(None, description="PASS/FAIL/INFO")
    allowable_value: float | None = Field(
        None, description="Allowable/limit value for comparison"
    )
    allowable_unit: str | None = Field(None, description="Allowable value unit")
    safety_factor: float | None = Field(None, description="Computed safety factor")
    margin_percent: float | None = Field(None, description="Safety margin percentage")

    @field_validator("name", "unit")
    @classmethod
    def validate_non_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Field cannot be empty or whitespace")
        return v.strip()


class CalculationWarning(BaseModel):
    """A warning generated during calculation."""
    code: str = Field(..., description="Warning code (e.g., 'HIGH_STRESS')")
    severity: WarningSeverity = Field(..., description="Severity level: INFO, WARNING, CRITICAL")
    message: str = Field(..., description="Warning message (Vietnamese/English)")
    parameter: str | None = Field(None, description="Related parameter name")
    suggestion: str | None = Field(None, description="Suggested action")

    @field_validator("code", "message")
    @classmethod
    def validate_non_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Field cannot be empty or whitespace")
        return v.strip()


class CalculationError(BaseModel):
    """An error generated during calculation."""
    code: str = Field(
        ..., description="Error code (e.g., 'UNIT_MISMATCH', 'RANGE_ERROR')"
    )
    message: str = Field(..., description="Error message (Vietnamese/English)")
    parameter: str | None = Field(None, description="Related parameter name")
    details: dict[str, Any] = Field(
        default_factory=dict, description="Additional error details"
    )

    @field_validator("code", "message")
    @classmethod
    def validate_non_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Field cannot be empty or whitespace")
        return v.strip()


class ValidationCheck(BaseModel):
    """An engineering validation check result."""
    name: str = Field(..., description="Check name")
    condition: str = Field(..., description="Check condition expression (e.g. 'σ_H ≤ [σ_H]')")
    result: CheckResult = Field(..., description="PASS, FAIL, or INFO")
    actual_value: float | None = Field(None, description="Actual computed value")
    limit_value: float | None = Field(None, description="Limit/allowable/required value")
    unit: str | None = Field(None, description="Unit of the measured/limit values")
    margin_percent: float | None = Field(None, description="Safety margin %")
    description: str | None = Field(None, description="Check description")

    @field_validator("name", "condition")
    @classmethod
    def validate_non_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Field cannot be empty or whitespace")
        return v.strip()


class ValidationSummary(BaseModel):
    """Summary of all engineering validation checks."""
    all_checks_passed: bool = Field(..., description="Whether all checks passed")
    total_checks: int = Field(0, description="Total number of checks")
    passed_checks: int = Field(0, description="Number of passed checks")
    failed_checks: int = Field(0, description="Number of failed checks")
    info_checks: int = Field(0, description="Number of info checks")
    checks: list[ValidationCheck] = Field(
        default_factory=list, description="Individual check results"
    )


class OutputFileInfo(BaseModel):
    """Information about a generated output file."""
    format: str = Field(..., description="File format (xlsx, tex, pdf, epxyz)")
    path: str = Field(..., description="File path relative to output directory")
    size_bytes: int | None = Field(None, description="File size in bytes")
    generated_at: datetime | None = Field(None, description="Generation timestamp")

    @field_validator("format", "path")
    @classmethod
    def validate_non_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Field cannot be empty or whitespace")
        return v.strip()


class CalculationMetadata(BaseModel):
    """Metadata about the calculation execution."""
    engine_version: str = Field("0.1.0", description="Engine version")
    calculation_module: str = Field(..., description="Module that performed the calculation")
    module_version: str = Field("1.0.0", description="Module version")
    timestamp: datetime = Field(
        default_factory=datetime.now, description="Calculation timestamp"
    )
    computation_time_ms: int | None = Field(
        None, description="Computation time in milliseconds"
    )
    python_version: str | None = Field(None, description="Python version used")
    standards: list[str] = Field(
        default_factory=list,
        description="Standards used (e.g., ['TCVN 1065:2004'])",
    )
    output_files: list[OutputFileInfo] = Field(
        default_factory=list, description="Generated output files"
    )

    @field_validator("calculation_module")
    @classmethod
    def validate_non_empty_module(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Calculation module cannot be empty or whitespace")
        return v.strip()


class EngineeringCalculationResult(BaseModel):
    """
    Output of an engineering calculation.

    SINGLE SOURCE OF TRUTH (SSOT) for all consumers:
        - Excel builder reads this to generate .xlsx
        - LaTeX generator reads this to generate .tex/.pdf
        - EP.xyz exporter reads this to generate .epxyz
        - React UI reads this to display results

    No copy/paste. No re-entry. No human in the data loop.
    Consumers must NEVER recalculate values.
    """

    calculation_id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        description="Unique calculation ID",
    )
    request_id: str | None = Field(
        None, description="ID of the originating request"
    )
    calculation_type: str = Field(
        ..., description="Calculation module that produced this result"
    )
    status: ResultStatus = Field(..., description="Overall result status")

    # Input echo & normalized inputs
    inputs: dict[str, Any] = Field(
        default_factory=dict, description="Original inputs (raw echo)"
    )
    assumptions: list[str] = Field(
        default_factory=list, description="Applied engineering assumptions"
    )
    normalized_inputs: list[NormalizedInput] = Field(
        default_factory=list, description="Inputs after validation and normalization"
    )

    # Step-by-step calculations trace (preserves order)
    calculations: list[CalculationStep] = Field(
        default_factory=list, description="Step-by-step calculation trace preserving order"
    )
    intermediate_values: list[IntermediateValue] = Field(
        default_factory=list, description="Intermediate calculation values"
    )

    # Final outputs / results
    results: list[OutputValue] = Field(
        default_factory=list, description="Final output values with engineering checks"
    )

    # Validation and checks
    checks: list[ValidationCheck] = Field(
        default_factory=list, description="Individual validation checks list"
    )
    validation: ValidationSummary | None = Field(
        None, description="Engineering validation summary"
    )

    # Diagnostics
    warnings: list[CalculationWarning] = Field(
        default_factory=list, description="Calculation warnings"
    )
    errors: list[CalculationError] = Field(
        default_factory=list, description="Calculation errors"
    )

    # References
    references: list[str] = Field(
        default_factory=list, description="Standards and references used"
    )

    # Units
    units: dict[str, str] = Field(
        default_factory=dict,
        description="Unit mapping for key output variables",
    )

    # Metadata
    metadata: CalculationMetadata | None = Field(
        None, description="Calculation execution metadata"
    )

    @field_validator("calculation_type")
    @classmethod
    def validate_non_empty_calculation_type(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("calculation_type cannot be empty or whitespace")
        return v.strip()

    @model_validator(mode="before")
    @classmethod
    def synchronize_aliases_and_checks(cls, data: Any) -> Any:
        if isinstance(data, dict):
            # 1. Alias equations -> calculations
            if "equations" in data and "calculations" not in data:
                data["calculations"] = data["equations"]
            elif "calculations" in data and "equations" not in data:
                data["equations"] = data["calculations"]

            # 2. Alias outputs -> results
            if "outputs" in data and "results" not in data:
                data["results"] = data["outputs"]
            elif "results" in data and "outputs" not in data:
                data["outputs"] = data["results"]

            # 3. Synchronize validation summary and checks
            if "validation" in data and data["validation"] and ("checks" not in data or not data["checks"]):
                val = data["validation"]
                if isinstance(val, dict) and "checks" in val:
                    data["checks"] = val["checks"]
                elif hasattr(val, "checks"):
                    data["checks"] = val.checks
            elif "checks" in data and data["checks"] and ("validation" not in data or data["validation"] is None):
                chks = data["checks"]
                total = len(chks)
                failed = 0
                passed = 0
                info = 0
                for c in chks:
                    res = c.get("result") if isinstance(c, dict) else getattr(c, "result", None)
                    if res in (CheckResult.FAIL, CheckResult.FAIL.value, "fail"):
                        failed += 1
                    elif res in (CheckResult.PASS, CheckResult.PASS.value, "pass"):
                        passed += 1
                    elif res in (CheckResult.INFO, CheckResult.INFO.value, "info"):
                        info += 1
                data["validation"] = {
                    "all_checks_passed": (failed == 0),
                    "total_checks": total,
                    "passed_checks": passed,
                    "failed_checks": failed,
                    "info_checks": info,
                    "checks": chks,
                }
        return data

    @model_validator(mode="after")
    def populate_post_validation(self) -> EngineeringCalculationResult:
        # If validation exists but checks is empty, sync
        if self.validation and not self.checks and self.validation.checks:
            object.__setattr__(self, "checks", self.validation.checks)
        # If checks exists but validation is None, build summary
        elif self.checks and self.validation is None:
            failed = sum(1 for c in self.checks if c.result == CheckResult.FAIL)
            passed = sum(1 for c in self.checks if c.result == CheckResult.PASS)
            info = sum(1 for c in self.checks if c.result == CheckResult.INFO)
            object.__setattr__(
                self,
                "validation",
                ValidationSummary(
                    all_checks_passed=(failed == 0),
                    total_checks=len(self.checks),
                    passed_checks=passed,
                    failed_checks=failed,
                    info_checks=info,
                    checks=self.checks,
                ),
            )
        return self

    @property
    def equations(self) -> list[CalculationStep]:
        """Backward-compatibility alias for calculations."""
        return self.calculations

    @property
    def outputs(self) -> list[OutputValue]:
        """Backward-compatibility alias for results."""
        return self.results

