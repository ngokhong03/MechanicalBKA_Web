"""
Engineering Input Validator.

Responsibilities:
    - Validate required fields in calculation requests
    - Validate numeric ranges (reject impossible values)
    - Validate unit dimensions (reject incompatible units)
    - Produce structured validation errors with Vietnamese messages
    - NEVER silently correct engineering input
    - Reusable by every future calculation module

Security:
    - No eval/exec
    - No arbitrary code execution
    - Pure validation logic only
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from engine.units import (
    UnitParseError,
    parse_quantity,
    validate_unit_dimension,
)


@dataclass
class ParameterSpec:
    """Specification for a single input parameter."""
    name: str
    required: bool = True
    unit_dimension: str | None = None  # e.g., "length", "force", "power"
    min_value: float | None = None
    max_value: float | None = None
    min_exclusive: bool = False  # If True, value must be > min (not >=)
    max_exclusive: bool = False
    default_value: float | None = None
    default_unit: str | None = None
    description: str = ""
    description_vi: str = ""
    allow_negative: bool = False
    allow_zero: bool = False


@dataclass
class ValidationError:
    """A single validation error."""
    parameter: str
    code: str
    message: str
    message_vi: str
    details: dict[str, Any] = field(default_factory=dict)


@dataclass
class ValidationResult:
    """Result of input validation."""
    is_valid: bool
    errors: list[ValidationError] = field(default_factory=list)
    validated_inputs: dict[str, Any] = field(default_factory=dict)

    def add_error(
        self,
        parameter: str,
        code: str,
        message: str,
        message_vi: str,
        **details: Any,
    ) -> None:
        """Add a validation error and mark result as invalid."""
        self.is_valid = False
        self.errors.append(
            ValidationError(
                parameter=parameter,
                code=code,
                message=message,
                message_vi=message_vi,
                details=details,
            )
        )


def validate_inputs(
    inputs: dict[str, Any],
    specs: list[ParameterSpec],
) -> ValidationResult:
    """
    Validate engineering inputs against parameter specifications.

    This is the central validation function used by all calculation modules.
    It checks:
        1. Required parameters are present
        2. Values have correct structure (value + unit)
        3. Numeric values are within acceptable ranges
        4. Units are parseable and dimensionally correct
        5. No impossible/invalid values

    Args:
        inputs: Dict of parameter name → {value, unit, ...} or ParameterInput-like objects.
        specs: List of ParameterSpec defining expected parameters.

    Returns:
        ValidationResult with is_valid flag, errors list, and validated_inputs dict.
    """
    result = ValidationResult(is_valid=True)

    for spec in specs:
        param_name = spec.name

        # --- Check presence ---
        if param_name not in inputs:
            if spec.required:
                result.add_error(
                    parameter=param_name,
                    code="MISSING_REQUIRED",
                    message=f"Required parameter '{param_name}' is missing",
                    message_vi=(
                        f"Thiếu thông số bắt buộc '{param_name}'"
                        + (f" ({spec.description_vi})" if spec.description_vi else "")
                    ),
                )
            elif spec.default_value is not None:
                # Use default
                result.validated_inputs[param_name] = {
                    "value": spec.default_value,
                    "unit": spec.default_unit or "dimensionless",
                    "is_default": True,
                }
            continue

        # --- Extract value and unit ---
        raw = inputs[param_name]
        value: float | None = None
        unit: str | None = None

        if isinstance(raw, dict):
            value = raw.get("value")
            unit = raw.get("unit")
        elif hasattr(raw, "value") and hasattr(raw, "unit"):
            # Pydantic model (ParameterInput)
            value = raw.value
            unit = raw.unit
        else:
            result.add_error(
                parameter=param_name,
                code="INVALID_FORMAT",
                message=f"Parameter '{param_name}' must have 'value' and 'unit' fields",
                message_vi=(
                    f"Thông số '{param_name}' phải có trường 'value' (giá trị) "
                    f"và 'unit' (đơn vị)"
                ),
            )
            continue

        # --- Validate value is numeric ---
        if value is None:
            result.add_error(
                parameter=param_name,
                code="MISSING_VALUE",
                message=f"Parameter '{param_name}' has no value",
                message_vi=f"Thông số '{param_name}' thiếu giá trị",
            )
            continue

        try:
            value = float(value)
        except (TypeError, ValueError):
            result.add_error(
                parameter=param_name,
                code="NOT_NUMERIC",
                message=f"Parameter '{param_name}' value must be numeric, got: {value!r}",
                message_vi=f"Giá trị của '{param_name}' phải là số, nhận được: {value!r}",
            )
            continue

        # --- Validate unit is present ---
        if not unit or not str(unit).strip():
            result.add_error(
                parameter=param_name,
                code="MISSING_UNIT",
                message=f"Parameter '{param_name}' has no unit specified",
                message_vi=f"Thông số '{param_name}' thiếu đơn vị",
            )
            continue

        unit = str(unit).strip()

        # --- Validate negative values ---
        if value < 0 and not spec.allow_negative:
            result.add_error(
                parameter=param_name,
                code="NEGATIVE_VALUE",
                message=f"Parameter '{param_name}' cannot be negative: {value}",
                message_vi=f"Thông số '{param_name}' không được âm: {value}",
            )
            continue

        # --- Validate zero ---
        if value == 0 and not spec.allow_zero:
            result.add_error(
                parameter=param_name,
                code="ZERO_VALUE",
                message=f"Parameter '{param_name}' cannot be zero",
                message_vi=f"Thông số '{param_name}' không được bằng 0",
            )
            continue

        # --- Validate numeric range ---
        if spec.min_value is not None:
            if spec.min_exclusive and value <= spec.min_value:
                result.add_error(
                    parameter=param_name,
                    code="BELOW_MIN",
                    message=f"Parameter '{param_name}' = {value} must be > {spec.min_value}",
                    message_vi=(
                        f"Thông số '{param_name}' = {value} phải lớn hơn {spec.min_value}"
                    ),
                    min_value=spec.min_value,
                )
                continue
            elif not spec.min_exclusive and value < spec.min_value:
                result.add_error(
                    parameter=param_name,
                    code="BELOW_MIN",
                    message=f"Parameter '{param_name}' = {value} must be ≥ {spec.min_value}",
                    message_vi=(
                        f"Thông số '{param_name}' = {value} phải ≥ {spec.min_value}"
                    ),
                    min_value=spec.min_value,
                )
                continue

        if spec.max_value is not None:
            if spec.max_exclusive and value >= spec.max_value:
                result.add_error(
                    parameter=param_name,
                    code="ABOVE_MAX",
                    message=f"Parameter '{param_name}' = {value} must be < {spec.max_value}",
                    message_vi=(
                        f"Thông số '{param_name}' = {value} phải nhỏ hơn {spec.max_value}"
                    ),
                    max_value=spec.max_value,
                )
                continue
            elif not spec.max_exclusive and value > spec.max_value:
                result.add_error(
                    parameter=param_name,
                    code="ABOVE_MAX",
                    message=f"Parameter '{param_name}' = {value} must be ≤ {spec.max_value}",
                    message_vi=(
                        f"Thông số '{param_name}' = {value} phải ≤ {spec.max_value}"
                    ),
                    max_value=spec.max_value,
                )
                continue

        # --- Validate unit is parseable ---
        try:
            parse_quantity(value, unit)
        except UnitParseError:
            result.add_error(
                parameter=param_name,
                code="INVALID_UNIT",
                message=f"Cannot parse unit '{unit}' for parameter '{param_name}'",
                message_vi=(
                    f"Không thể nhận dạng đơn vị '{unit}' "
                    f"cho thông số '{param_name}'"
                ),
            )
            continue

        # --- Validate unit dimension ---
        if spec.unit_dimension:
            dim_error = validate_unit_dimension(
                unit, spec.unit_dimension, param_name
            )
            if dim_error is not None:
                result.add_error(
                    parameter=param_name,
                    code="WRONG_DIMENSION",
                    message=dim_error.message,
                    message_vi=dim_error.message_vi,
                    expected_dimension=dim_error.expected_dimension,
                    suggestions=dim_error.suggestions,
                )
                continue

        # --- All checks passed for this parameter ---
        result.validated_inputs[param_name] = {
            "value": value,
            "unit": unit,
            "is_default": False,
        }

    return result
