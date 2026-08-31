"""
Tests for Engineering Unit System (Pint-based).

Tests:
    1. Unit conversion (compatible)
    2. Incompatible unit rejection
    3. Vietnamese unit aliases
    4. Dimension category detection
    5. Dimension validation
    6. Unit parse errors
"""

import sys
import os

import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from engine.units import (
    ConversionResult,
    UnitConversionError,
    UnitParseError,
    are_units_compatible,
    convert_unit,
    get_dimension_category,
    get_registry,
    parse_quantity,
    parse_unit,
    resolve_unit_string,
    validate_unit_dimension,
)


class TestUnitParsing:
    """Tests for unit string parsing."""

    def test_parse_basic_units(self):
        assert parse_unit("mm") is not None
        assert parse_unit("kW") is not None
        assert parse_unit("rpm") is not None
        assert parse_unit("MPa") is not None
        assert parse_unit("N*mm") is not None

    def test_parse_invalid_unit(self):
        with pytest.raises(UnitParseError):
            parse_unit("invalid_unit_xyz")

    def test_parse_quantity(self):
        qty = parse_quantity(50.0, "mm")
        assert qty.magnitude == 50.0

    def test_parse_quantity_invalid_unit(self):
        with pytest.raises(UnitParseError):
            parse_quantity(50.0, "not_a_unit")


class TestVietnameseAliases:
    """Tests for Vietnamese unit aliases."""

    def test_vong_phut_to_rpm(self):
        assert resolve_unit_string("vòng/phút") == "rpm"
        assert resolve_unit_string("vong/phut") == "rpm"

    def test_n_dot_mm(self):
        assert resolve_unit_string("N.mm") == "N*mm"
        assert resolve_unit_string("N.m") == "N*m"

    def test_kg_force(self):
        assert resolve_unit_string("kG") == "kgf"

    def test_unknown_alias_passthrough(self):
        assert resolve_unit_string("MPa") == "MPa"
        assert resolve_unit_string("kW") == "kW"


class TestUnitConversion:
    """Tests for unit conversion."""

    def test_mm_to_m(self):
        result = convert_unit(50.0, "mm", "m")
        assert abs(result.converted_value - 0.05) < 1e-10
        assert result.was_converted is True

    def test_kw_to_w(self):
        result = convert_unit(5.0, "kW", "W")
        assert abs(result.converted_value - 5000.0) < 1e-10

    def test_mpa_to_pa(self):
        result = convert_unit(200.0, "MPa", "Pa")
        assert abs(result.converted_value - 200e6) < 1.0

    def test_same_unit_no_conversion(self):
        result = convert_unit(50.0, "mm", "mm")
        assert result.converted_value == 50.0
        assert result.was_converted is False

    def test_incompatible_units_rejected(self):
        """50 kg CANNOT silently become a force."""
        with pytest.raises(UnitConversionError):
            convert_unit(50.0, "kg", "N")

    def test_length_to_force_rejected(self):
        with pytest.raises(UnitConversionError):
            convert_unit(100.0, "mm", "N")

    def test_power_to_torque_rejected(self):
        with pytest.raises(UnitConversionError):
            convert_unit(5.0, "kW", "N*m")


class TestUnitCompatibility:
    """Tests for unit compatibility checking."""

    def test_compatible_length(self):
        assert are_units_compatible("mm", "m") is True
        assert are_units_compatible("mm", "cm") is True
        assert are_units_compatible("mm", "in") is True

    def test_compatible_force(self):
        assert are_units_compatible("N", "kN") is True

    def test_compatible_pressure(self):
        assert are_units_compatible("MPa", "Pa") is True
        assert are_units_compatible("MPa", "GPa") is True

    def test_incompatible_mass_force(self):
        assert are_units_compatible("kg", "N") is False

    def test_incompatible_length_force(self):
        assert are_units_compatible("mm", "N") is False


class TestDimensionCategory:
    """Tests for dimension category detection."""

    def test_length(self):
        assert get_dimension_category("mm") == "length"
        assert get_dimension_category("m") == "length"

    def test_force(self):
        assert get_dimension_category("N") == "force"
        assert get_dimension_category("kN") == "force"

    def test_power(self):
        assert get_dimension_category("kW") == "power"
        assert get_dimension_category("W") == "power"

    def test_pressure(self):
        cat = get_dimension_category("MPa")
        assert cat in ("pressure", "stress")

    def test_mass(self):
        assert get_dimension_category("kg") == "mass"

    def test_speed(self):
        assert get_dimension_category("rpm") == "speed"


class TestDimensionValidation:
    """Tests for unit dimension validation."""

    def test_valid_length(self):
        error = validate_unit_dimension("mm", "length", "d")
        assert error is None

    def test_valid_power(self):
        error = validate_unit_dimension("kW", "power", "P")
        assert error is None

    def test_wrong_dimension(self):
        """kg unit for a force parameter should fail."""
        error = validate_unit_dimension("kg", "force", "F")
        assert error is not None
        assert error.parameter == "F"
        assert "force" in (error.expected_dimension or "")

    def test_wrong_dimension_has_vietnamese_message(self):
        error = validate_unit_dimension("mm", "force", "F_load")
        assert error is not None
        assert "thứ nguyên" in error.message_vi  # Vietnamese error present

    def test_wrong_dimension_has_suggestions(self):
        error = validate_unit_dimension("mm", "force", "F")
        assert error is not None
        assert error.suggestions is not None
        assert "N" in error.suggestions
