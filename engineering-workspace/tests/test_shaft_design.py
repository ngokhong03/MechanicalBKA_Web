"""
Comprehensive Test Suite for Shaft Design Module.

Phase 14E — Shaft Design Tool MVP Implementation

Tests:
    - Test A: Minimal valid shaft calculation.
    - Test B: Known textbook / golden calculation (Trịnh Chất & Lê Văn Uyển, Tập 1, Chương 10).
    - Test C: Torque calculation accuracy.
    - Test D: Unit conversions (kW ↔ W, N·m ↔ N·mm).
    - Test E: CalculationStep structure (step_id, formula, variables, value, unit).
    - Test F: Calculation ordering determinism.
    - Test G: Result outputs (T, d_sb, d, Mb, Me, sigma_b, tau, sigma_eq, S).
    - Test H: PASS engineering check.
    - Test I: FAIL engineering check under overload.
    - Test J: Warning generation (low safety factor, high stress).
    - Test K: Invalid input rejection (missing P, negative values, invalid unit).
    - Test L: JSON serialization.
    - Test M: JSON roundtrip deserialization.
    - Test N: Deterministic calculation (same input -> identical numerical output).
    - Test O: Execution via Module Registry.
"""

import json
import math
import os
import sys
import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from contracts.request import EngineeringCalculationRequest, ParameterInput
from contracts.result import (
    CheckResult,
    EngineeringCalculationResult,
    ResultStatus,
    WarningSeverity,
)
from engine.registry import get_registry
from modules.shaft_design import calculate_shaft_design


class TestShaftDesignMVP:
    """Test suite for Shaft Design calculation engine."""

    def test_a_minimal_valid_calculation(self):
        """Test A: Minimal valid shaft calculation with only P and n."""
        request = EngineeringCalculationRequest(
            calculation_type="shaft_design",
            inputs={
                "P": ParameterInput(value=5.0, unit="kW"),
                "n": ParameterInput(value=1450, unit="rpm"),
            },
        )
        result = calculate_shaft_design(request)
        assert result.status == ResultStatus.SUCCESS
        assert result.calculation_type == "shaft_design"
        assert len(result.calculations) >= 4
        assert len(result.results) >= 5
        assert len(result.normalized_inputs) >= 2

    def test_b_golden_textbook_calculation(self):
        """
        Test B: Golden calculation verified against Trịnh Chất - Lê Văn Uyển (Tập 1, Chương 10).
        Input:
            P = 5.0 kW, n = 1450 rpm
            Mx = 35000 N·mm, My = 20000 N·mm
            [tau] = 20 MPa, [sigma] = 63 MPa
        Expected values:
            T = 32931.03 N·mm
            d_sb = 20.19 mm
            d_selected = 25.0 mm (standard)
            Mb = 40311.29 N·mm
            Me = 49379.49 N·mm
            W = 1562.5 mm^3
            sigma_eq = 31.60 MPa
            S = 1.99
            Check = PASS
        """
        request = EngineeringCalculationRequest(
            calculation_type="shaft_design",
            inputs={
                "P": ParameterInput(value=5.0, unit="kW", description="Công suất"),
                "n": ParameterInput(value=1450, unit="rpm", description="Số vòng quay"),
                "Mx": ParameterInput(value=35000, unit="N*mm", description="Mô-men uốn đứng"),
                "My": ParameterInput(value=20000, unit="N*mm", description="Mô-men uốn ngang"),
                "tau_allowable": ParameterInput(value=20.0, unit="MPa"),
                "sigma_allowable": ParameterInput(value=63.0, unit="MPa"),
                "d": ParameterInput(value=25.0, unit="mm"),
            },
        )
        result = calculate_shaft_design(request)
        assert result.status == ResultStatus.SUCCESS

        res_dict = {r.name: r.value for r in result.results}
        # Verify Golden Values with 0.1% tolerance
        assert math.isclose(res_dict["T"], 32931.03, rel_tol=1e-3)
        assert math.isclose(res_dict["d_sb"], 20.19, rel_tol=1e-2)
        assert math.isclose(res_dict["d"], 25.0, rel_tol=1e-3)
        assert math.isclose(res_dict["Mb"], 40311.29, rel_tol=1e-3)
        assert math.isclose(res_dict["Me"], 49379.49, rel_tol=1e-3)
        assert math.isclose(res_dict["sigma_eq"], 31.60, rel_tol=1e-2)
        assert math.isclose(res_dict["S"], 1.99, rel_tol=1e-2)

        # Validation summary
        assert result.validation.all_checks_passed is True

    def test_c_torque_calculation(self):
        """Test C: Torque formula accuracy T = 9.55e6 * P / n."""
        # 10 kW at 1000 rpm -> T = 95500.0 N*mm
        request = EngineeringCalculationRequest(
            calculation_type="shaft_design",
            inputs={
                "P": ParameterInput(value=10.0, unit="kW"),
                "n": ParameterInput(value=1000, unit="rpm"),
            },
        )
        result = calculate_shaft_design(request)
        t_res = next(r for r in result.results if r.name == "T")
        assert math.isclose(t_res.value, 95500.0, rel_tol=1e-3)
        assert t_res.unit == "N·mm"

    def test_d_unit_conversions(self):
        """Test D: Unit conversions (P in W, M in N*m, d in mm)."""
        request = EngineeringCalculationRequest(
            calculation_type="shaft_design",
            inputs={
                "P": ParameterInput(value=5000.0, unit="W"),
                "n": ParameterInput(value=1450, unit="vong_phut"),
                "Mx": ParameterInput(value=35.0, unit="N*m"),
                "My": ParameterInput(value=20.0, unit="N*m"),
                "d": ParameterInput(value=25.0, unit="mm"),
            },
        )
        result = calculate_shaft_design(request)
        assert result.status == ResultStatus.SUCCESS

        res_dict = {r.name: r.value for r in result.results}
        assert math.isclose(res_dict["T"], 32931.03, rel_tol=1e-3)
        assert math.isclose(res_dict["Mb"], 40311.29, rel_tol=1e-3)

        # Check conversion flags in normalized_inputs
        p_norm = next(ni for ni in result.normalized_inputs if ni.name == "P")
        assert p_norm.was_converted is True
        assert p_norm.normalized_value == 5.0
        assert p_norm.normalized_unit == "kW"

    def test_e_calculation_step_structure(self):
        """Test E: CalculationStep contains step_id, formula, variables, value, unit."""
        request = EngineeringCalculationRequest(
            calculation_type="shaft_design",
            inputs={
                "P": ParameterInput(value=7.5, unit="kW"),
                "n": ParameterInput(value=1450, unit="rpm"),
            },
        )
        result = calculate_shaft_design(request)
        for step in result.calculations:
            assert step.step_id is not None
            assert len(step.step_id) > 0
            assert step.formula is not None
            assert step.formula_latex is not None
            assert isinstance(step.variables, dict)
            assert step.value is not None
            assert step.unit is not None

    def test_f_calculation_ordering(self):
        """Test F: Calculation steps maintain deterministic sequential order (1..N)."""
        request = EngineeringCalculationRequest(
            calculation_type="shaft_design",
            inputs={
                "P": ParameterInput(value=5.0, unit="kW"),
                "n": ParameterInput(value=1450, unit="rpm"),
            },
        )
        result = calculate_shaft_design(request)
        step_numbers = [s.step for s in result.calculations]
        assert step_numbers == list(range(1, len(step_numbers) + 1))

    def test_g_result_outputs(self):
        """Test G: Result contains all essential output parameters."""
        request = EngineeringCalculationRequest(
            calculation_type="shaft_design",
            inputs={
                "P": ParameterInput(value=5.0, unit="kW"),
                "n": ParameterInput(value=1450, unit="rpm"),
                "Mx": ParameterInput(value=30000, unit="N*mm"),
            },
        )
        result = calculate_shaft_design(request)
        names = {r.name for r in result.results}
        expected_names = {"T", "d_sb", "d", "Mb", "Me", "sigma_b", "tau", "sigma_eq", "S"}
        assert expected_names.issubset(names)

    def test_h_pass_engineering_check(self):
        """Test H: Engineering checks PASS when stresses and safety factors are within limits."""
        request = EngineeringCalculationRequest(
            calculation_type="shaft_design",
            inputs={
                "P": ParameterInput(value=3.0, unit="kW"),
                "n": ParameterInput(value=1450, unit="rpm"),
                "d": ParameterInput(value=30.0, unit="mm"),
                "sigma_allowable": ParameterInput(value=80.0, unit="MPa"),
            },
        )
        result = calculate_shaft_design(request)
        assert result.status == ResultStatus.SUCCESS
        assert all(c.result == CheckResult.PASS for c in result.checks)
        assert result.validation.all_checks_passed is True

    def test_i_fail_engineering_check_on_overload(self):
        """Test I: Engineering checks FAIL and trigger warning status when overloaded."""
        request = EngineeringCalculationRequest(
            calculation_type="shaft_design",
            inputs={
                "P": ParameterInput(value=30.0, unit="kW"),
                "n": ParameterInput(value=500, unit="rpm"),
                "Mx": ParameterInput(value=800000, unit="N*mm"),
                "d": ParameterInput(value=20.0, unit="mm"),  # Dangerously undersized shaft
                "sigma_allowable": ParameterInput(value=50.0, unit="MPa"),
            },
        )
        result = calculate_shaft_design(request)
        assert result.status == ResultStatus.WARNING
        fail_checks = [c for c in result.checks if c.result == CheckResult.FAIL]
        assert len(fail_checks) > 0
        assert result.validation.all_checks_passed is False

    def test_j_warning_generation(self):
        """Test J: Warning generated when safety factor is low or diameter is below preliminary."""
        request = EngineeringCalculationRequest(
            calculation_type="shaft_design",
            inputs={
                "P": ParameterInput(value=15.0, unit="kW"),
                "n": ParameterInput(value=750, unit="rpm"),
                "Mx": ParameterInput(value=250000, unit="N*mm"),
                "d": ParameterInput(value=25.0, unit="mm"),
            },
        )
        result = calculate_shaft_design(request)
        assert len(result.warnings) > 0
        codes = [w.code for w in result.warnings]
        assert "INSUFFICIENT_SAFETY_FACTOR" in codes or "DIAMETER_BELOW_PRELIMINARY" in codes
        crit_warns = [w for w in result.warnings if w.severity == WarningSeverity.CRITICAL]
        assert len(crit_warns) > 0

    def test_k_invalid_input_rejection(self):
        """Test K: Validation error returned for missing or negative inputs."""
        # Missing n
        req_missing = EngineeringCalculationRequest(
            calculation_type="shaft_design",
            inputs={"P": ParameterInput(value=5.0, unit="kW")},
        )
        res_missing = calculate_shaft_design(req_missing)
        assert res_missing.status == ResultStatus.VALIDATION_FAILED
        assert any(e.code == "MISSING_INPUT" for e in res_missing.errors)

        # Negative P
        req_neg = EngineeringCalculationRequest(
            calculation_type="shaft_design",
            inputs={
                "P": ParameterInput(value=-5.0, unit="kW"),
                "n": ParameterInput(value=1450, unit="rpm"),
            },
        )
        res_neg = calculate_shaft_design(req_neg)
        assert res_neg.status == ResultStatus.VALIDATION_FAILED
        assert any(e.code == "RANGE_ERROR" for e in res_neg.errors)

    def test_l_json_serialization(self):
        """Test L: Result can be serialized to JSON without losing precision or structure."""
        request = EngineeringCalculationRequest(
            calculation_type="shaft_design",
            inputs={
                "P": ParameterInput(value=5.0, unit="kW"),
                "n": ParameterInput(value=1450, unit="rpm"),
            },
        )
        result = calculate_shaft_design(request)
        json_str = result.model_dump_json()
        assert isinstance(json_str, str)
        data = json.loads(json_str)
        assert data["calculation_type"] == "shaft_design"
        assert len(data["calculations"]) >= 4
        assert data["metadata"]["calculation_module"] == "shaft_design"

    def test_m_json_roundtrip(self):
        """Test M: JSON serialization -> Pydantic deserialization preserves exact data."""
        request = EngineeringCalculationRequest(
            calculation_type="shaft_design",
            inputs={
                "P": ParameterInput(value=5.0, unit="kW"),
                "n": ParameterInput(value=1450, unit="rpm"),
                "Mx": ParameterInput(value=35000, unit="N*mm"),
            },
        )
        res_orig = calculate_shaft_design(request)
        json_str = res_orig.model_dump_json()

        res_deserialized = EngineeringCalculationResult.model_validate_json(json_str)
        assert res_deserialized.calculation_id == res_orig.calculation_id
        assert len(res_deserialized.calculations) == len(res_orig.calculations)
        assert res_deserialized.results[0].value == res_orig.results[0].value
        assert res_deserialized.validation.all_checks_passed == res_orig.validation.all_checks_passed

    def test_n_deterministic_calculation(self):
        """Test N: Repeated execution with same input yields identical numerical results."""
        request = EngineeringCalculationRequest(
            calculation_type="shaft_design",
            inputs={
                "P": ParameterInput(value=7.5, unit="kW"),
                "n": ParameterInput(value=960, unit="rpm"),
                "Mx": ParameterInput(value=52000, unit="N*mm"),
                "My": ParameterInput(value=31000, unit="N*mm"),
            },
        )
        res1 = calculate_shaft_design(request)
        res2 = calculate_shaft_design(request)

        val1 = [r.value for r in res1.results]
        val2 = [r.value for r in res2.results]
        assert val1 == val2

        step_val1 = [s.value for s in res1.calculations]
        step_val2 = [s.value for s in res2.calculations]
        assert step_val1 == step_val2

    def test_o_registry_execution(self):
        """Test O: Module can be invoked through global CalculationModuleRegistry."""
        registry = get_registry()
        assert registry.is_available("shaft_design") is True

        request = EngineeringCalculationRequest(
            calculation_type="shaft_design",
            inputs={
                "P": ParameterInput(value=5.0, unit="kW"),
                "n": ParameterInput(value=1450, unit="rpm"),
            },
        )
        result = registry.execute("shaft_design", request)
        assert result.status == ResultStatus.SUCCESS
        assert result.calculation_type == "shaft_design"
        assert len(result.results) > 0
