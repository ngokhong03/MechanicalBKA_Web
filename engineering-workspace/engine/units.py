"""
Engineering Unit System — Pint-based unit management.

Responsibilities:
    - Normalize engineering units
    - Convert compatible units
    - Reject incompatible units with clear Vietnamese error messages
    - Preserve source units where appropriate
    - Distinguish physical dimensions (length, force, torque, pressure, etc.)
    - NEVER silently assume or convert incompatible units

Examples:
    50 mm → 0.05 m (compatible conversion)
    50 kg → CANNOT silently become a force (incompatible)
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

import pint

# Global unit registry — single instance for consistency
_ureg = pint.UnitRegistry()
_ureg.formatter.default_format = "~P"  # Short pretty format

# Common engineering unit aliases for Vietnamese users
_UNIT_ALIASES: dict[str, str] = {
    "vòng/phút": "rpm",
    "vong/phut": "rpm",
    "vong_phut": "rpm",
    "vòng_phút": "rpm",
    "N.mm": "N*mm",
    "N.m": "N*m",
    "N·mm": "N*mm",
    "N·m": "N*m",
    "kN.m": "kN*m",
    "kN·m": "kN*m",
    "kG": "kgf",
    "kG/mm²": "kgf/mm**2",
    "kG/cm²": "kgf/cm**2",
    "kg/mm²": "kgf/mm**2",
    "daN": "decanewton",
}

# Reference units for dimension category detection.
# Each category maps to a canonical Pint unit string.
_DIMENSION_REFERENCE_UNITS: dict[str, str] = {
    "length": "m",
    "force": "N",
    "torque": "N*m",
    "pressure": "Pa",
    "stress": "Pa",
    "power": "W",
    "speed": "rpm",
    "mass": "kg",
    "density": "kg/m**3",
    "angle": "rad",
    "time": "s",
    "area": "m**2",
    "moment_of_inertia": "m**4",
    "section_modulus": "m**3",
}


@dataclass
class ConversionResult:
    """Result of a unit conversion operation."""
    original_value: float
    original_unit: str
    converted_value: float
    converted_unit: str
    was_converted: bool
    dimensionality: str


@dataclass
class UnitValidationError:
    """Structured unit validation error."""
    parameter: str
    message: str
    message_vi: str
    provided_unit: str
    expected_dimension: str | None = None
    suggestions: list[str] | None = None


def get_registry() -> pint.UnitRegistry:
    """Get the global Pint unit registry."""
    return _ureg


def resolve_unit_string(unit_str: str) -> str:
    """
    Resolve a unit string, applying Vietnamese aliases.

    Args:
        unit_str: Raw unit string from user input.

    Returns:
        Pint-compatible unit string.
    """
    cleaned = unit_str.strip()
    return _UNIT_ALIASES.get(cleaned, cleaned)


def parse_unit(unit_str: str) -> pint.Unit:
    """
    Parse a unit string into a Pint Unit object.

    Args:
        unit_str: Unit string (may include Vietnamese aliases).

    Returns:
        Pint Unit object.

    Raises:
        UnitParseError: If the unit string cannot be parsed.
    """
    resolved = resolve_unit_string(unit_str)
    try:
        return _ureg.Unit(resolved)
    except (pint.errors.UndefinedUnitError, pint.errors.DefinitionSyntaxError) as e:
        raise UnitParseError(
            unit_str=unit_str,
            message=f"Không thể nhận dạng đơn vị '{unit_str}'. "
                    f"Vui lòng kiểm tra lại. (Cannot parse unit '{unit_str}')",
        ) from e


def parse_quantity(value: float, unit_str: str) -> pint.Quantity:
    """
    Create a Pint Quantity from value and unit string.

    Args:
        value: Numerical value.
        unit_str: Unit string.

    Returns:
        Pint Quantity object.

    Raises:
        UnitParseError: If the unit string cannot be parsed.
    """
    unit = parse_unit(unit_str)
    return _ureg.Quantity(value, unit)


def convert_unit(
    value: float,
    from_unit: str,
    to_unit: str,
) -> ConversionResult:
    """
    Convert a value from one unit to another.

    Args:
        value: Numerical value.
        from_unit: Source unit string.
        to_unit: Target unit string.

    Returns:
        ConversionResult with original and converted values.

    Raises:
        UnitConversionError: If units are incompatible.
        UnitParseError: If a unit string cannot be parsed.
    """
    from_qty = parse_quantity(value, from_unit)
    to_pint_unit = parse_unit(to_unit)

    try:
        converted = from_qty.to(to_pint_unit)
    except pint.errors.DimensionalityError as e:
        raise UnitConversionError(
            from_unit=from_unit,
            to_unit=to_unit,
            message=(
                f"Không thể chuyển đổi từ '{from_unit}' sang '{to_unit}'. "
                f"Các đơn vị không tương thích về thứ nguyên. "
                f"(Cannot convert '{from_unit}' to '{to_unit}': incompatible dimensions)"
            ),
        ) from e

    return ConversionResult(
        original_value=value,
        original_unit=from_unit,
        converted_value=float(converted.magnitude),
        converted_unit=to_unit,
        was_converted=(from_unit != to_unit),
        dimensionality=str(from_qty.dimensionality),
    )


def are_units_compatible(unit_a: str, unit_b: str) -> bool:
    """
    Check if two unit strings are dimensionally compatible.

    Args:
        unit_a: First unit string.
        unit_b: Second unit string.

    Returns:
        True if units have the same dimensionality.
    """
    try:
        ua = parse_unit(unit_a)
        ub = parse_unit(unit_b)
        return _ureg.Quantity(1, ua).is_compatible_with(ub)
    except (UnitParseError, Exception):
        return False


def get_dimension_category(unit_str: str) -> str | None:
    """
    Get the engineering dimension category for a unit.

    Args:
        unit_str: Unit string.

    Returns:
        Category name (e.g., 'length', 'force', 'torque') or None.
    """
    try:
        qty = parse_quantity(1.0, unit_str)
        dim_str = str(qty.dimensionality)

        if dim_str == "dimensionless":
            return "dimensionless"

        # Check compatibility with reference units for each category.
        # Order matters: more specific categories first to avoid
        # matching torque as force*length etc.
        # Use priority ordering: specific → general
        _priority = [
            "torque", "density", "moment_of_inertia", "section_modulus",
            "area", "pressure", "stress", "power", "force",
            "speed", "length", "mass", "angle", "time",
        ]
        for category in _priority:
            ref_unit_str = _DIMENSION_REFERENCE_UNITS.get(category)
            if ref_unit_str is None:
                continue
            try:
                ref_qty = _ureg.Quantity(1, ref_unit_str)
                if qty.is_compatible_with(ref_qty):
                    return category
            except Exception:
                continue

        return None
    except (UnitParseError, Exception):
        return None


def validate_unit_dimension(
    unit_str: str,
    expected_category: str,
    parameter_name: str = "",
) -> UnitValidationError | None:
    """
    Validate that a unit belongs to an expected dimension category.

    Args:
        unit_str: Unit string to validate.
        expected_category: Expected category (e.g., 'length', 'force').
        parameter_name: Name of the parameter (for error messages).

    Returns:
        None if valid, UnitValidationError if invalid.
    """
    if expected_category == "dimensionless":
        # Accept dimensionless or empty units
        if unit_str.strip().lower() in ("", "-", "dimensionless", "1"):
            return None
        actual = get_dimension_category(unit_str)
        if actual == "dimensionless":
            return None
        return UnitValidationError(
            parameter=parameter_name,
            message=f"Parameter '{parameter_name}' should be dimensionless but has unit '{unit_str}'",
            message_vi=(
                f"Thông số '{parameter_name}' phải là đại lượng không thứ nguyên "
                f"nhưng có đơn vị '{unit_str}'"
            ),
            provided_unit=unit_str,
            expected_dimension="dimensionless",
        )

    actual = get_dimension_category(unit_str)
    if actual is None:
        return UnitValidationError(
            parameter=parameter_name,
            message=f"Cannot determine dimension of unit '{unit_str}' for parameter '{parameter_name}'",
            message_vi=(
                f"Không thể xác định thứ nguyên của đơn vị '{unit_str}' "
                f"cho thông số '{parameter_name}'"
            ),
            provided_unit=unit_str,
            expected_dimension=expected_category,
        )

    # pressure and stress are the same dimension
    compatible = {actual}
    if actual in ("pressure", "stress"):
        compatible = {"pressure", "stress"}

    if expected_category not in compatible:
        return UnitValidationError(
            parameter=parameter_name,
            message=(
                f"Parameter '{parameter_name}' expected dimension '{expected_category}' "
                f"but unit '{unit_str}' has dimension '{actual}'"
            ),
            message_vi=(
                f"Thông số '{parameter_name}' cần có thứ nguyên '{expected_category}' "
                f"nhưng đơn vị '{unit_str}' thuộc thứ nguyên '{actual}'"
            ),
            provided_unit=unit_str,
            expected_dimension=expected_category,
            suggestions=_suggest_units(expected_category),
        )

    return None


def _suggest_units(category: str) -> list[str]:
    """Suggest common units for a dimension category."""
    suggestions: dict[str, list[str]] = {
        "length": ["mm", "m", "cm", "in"],
        "force": ["N", "kN", "kgf", "lbf"],
        "torque": ["N*mm", "N*m", "kN*m"],
        "pressure": ["MPa", "Pa", "kPa", "GPa", "psi"],
        "stress": ["MPa", "Pa", "kPa", "GPa"],
        "power": ["kW", "W", "HP"],
        "speed": ["rpm", "rad/s", "Hz"],
        "mass": ["kg", "g", "lb"],
        "density": ["kg/m**3", "g/cm**3"],
        "angle": ["deg", "rad"],
        "time": ["s", "min", "h"],
        "area": ["mm**2", "m**2", "cm**2"],
        "moment_of_inertia": ["mm**4", "m**4", "cm**4"],
        "section_modulus": ["mm**3", "m**3", "cm**3"],
    }
    return suggestions.get(category, [])


# --- Custom Exceptions ---

class UnitParseError(Exception):
    """Raised when a unit string cannot be parsed."""

    def __init__(self, unit_str: str, message: str):
        self.unit_str = unit_str
        super().__init__(message)


class UnitConversionError(Exception):
    """Raised when unit conversion fails due to incompatible dimensions."""

    def __init__(self, from_unit: str, to_unit: str, message: str):
        self.from_unit = from_unit
        self.to_unit = to_unit
        super().__init__(message)
