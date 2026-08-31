"""
Tests for Engineering Data Contracts (Pydantic models).

Phase 14C — EngineeringCalculationResult Contract Hardening

Tests:
    1. EngineeringCalculationRequest validation
    2. EngineeringCalculationResult validation (SSOT)
    3. ParameterInput & NormalizedInput validation
    4. CalculationStep / EquationStep validation
    5. OutputValue & IntermediateValue validation
    6. ValidationCheck & ValidationSummary (PASS / FAIL / INFO)
    7. CalculationWarning (INFO / WARNING / CRITICAL)
    8. CalculationMetadata & OutputFileInfo
    9. Ordering determinism & Unit preservation
    10. Serialization round-trip & Downstream consumer compatibility
"""

import json
import os
import sys
from datetime import datetime

import pytest

# Add engineering-workspace to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from contracts.request import (
    CalculationOptions,
    EngineeringCalculationRequest,
    Language,
    OutputFormat,
    ParameterInput,
    UnitPreferences,
)
from contracts.result import (
    CalculationError,
    CalculationMetadata,
    CalculationStep,
    CalculationWarning,
    CheckResult,
    EngineeringCalculationResult,
    EquationStep,
    IntermediateValue,
    NormalizedInput,
    OutputFileInfo,
    OutputValue,
    ResultStatus,
    ValidationCheck,
    ValidationSummary,
    WarningSeverity,
)


# --- EngineeringCalculationRequest Tests ---


class TestParameterInput:
    """Tests for ParameterInput validation."""

    def test_valid_parameter(self):
        p = ParameterInput(value=5.0, unit="kW")
        assert p.value == 5.0
        assert p.unit == "kW"

    def test_parameter_with_description(self):
        p = ParameterInput(
            value=1450,
            unit="rpm",
            description="Số vòng quay",
            source="Motor nameplate",
        )
        assert p.description == "Số vòng quay"
        assert p.source == "Motor nameplate"

    def test_empty_unit_rejected(self):
        with pytest.raises(Exception):
            ParameterInput(value=5.0, unit="")

    def test_whitespace_unit_rejected(self):
        with pytest.raises(Exception):
            ParameterInput(value=5.0, unit="   ")

    def test_unit_stripped(self):
        p = ParameterInput(value=5.0, unit="  kW  ")
        assert p.unit == "kW"


class TestEngineeringCalculationRequest:
    """Tests for EngineeringCalculationRequest validation."""

    def test_minimal_valid_request(self):
        req = EngineeringCalculationRequest(
            calculation_type="shaft_design",
            inputs={"P": ParameterInput(value=5.0, unit="kW")},
        )
        assert req.calculation_type == "shaft_design"
        assert "P" in req.inputs
        assert req.language == Language.VI
        assert req.request_id  # auto-generated UUID

    def test_full_request(self):
        req = EngineeringCalculationRequest(
            calculation_type="gear_design",
            project_id="HGT-2C-001",
            title="Tính bánh răng cấp nhanh",
            language=Language.VI,
            inputs={
                "P": ParameterInput(value=5.0, unit="kW", description="Công suất"),
                "n1": ParameterInput(value=1450, unit="rpm"),
                "u": ParameterInput(value=3.2, unit="dimensionless"),
            },
            units=UnitPreferences(system="SI"),
            options=CalculationOptions(
                generate_excel=True,
                generate_latex=True,
                generate_epxyz=True,
            ),
            requested_outputs=[OutputFormat.JSON, OutputFormat.EXCEL],
            assumptions=["Tải trọng ổn định"],
            references=["TCVN 1065:2004"],
        )
        assert len(req.inputs) == 3
        assert req.options.generate_epxyz is True

    def test_empty_calculation_type_rejected(self):
        with pytest.raises(Exception):
            EngineeringCalculationRequest(
                calculation_type="",
                inputs={"P": ParameterInput(value=5.0, unit="kW")},
            )

    def test_empty_inputs_rejected(self):
        with pytest.raises(Exception):
            EngineeringCalculationRequest(
                calculation_type="shaft_design",
                inputs={},
            )

    def test_json_serialization_roundtrip(self):
        req = EngineeringCalculationRequest(
            calculation_type="shaft_design",
            inputs={"P": ParameterInput(value=7.5, unit="kW")},
        )
        json_str = req.model_dump_json()
        data = json.loads(json_str)
        assert data["calculation_type"] == "shaft_design"
        assert data["inputs"]["P"]["value"] == 7.5
        assert data["inputs"]["P"]["unit"] == "kW"

    def test_default_options(self):
        req = EngineeringCalculationRequest(
            calculation_type="shaft_design",
            inputs={"P": ParameterInput(value=5.0, unit="kW")},
        )
        assert req.options.generate_excel is True
        assert req.options.generate_latex is True
        assert req.options.generate_epxyz is False
        assert req.options.language == Language.VI
        assert req.options.decimal_places == 2


# --- Building Block Models Tests ---


class TestNormalizedInput:
    """Tests for NormalizedInput model."""

    def test_valid_normalized_input(self):
        ni = NormalizedInput(
            name="P",
            original_value=5.0,
            original_unit="kW",
            normalized_value=5000.0,
            normalized_unit="W",
            was_converted=True,
            description="Công suất động cơ",
            source="Motor nameplate",
        )
        assert ni.name == "P"
        assert ni.normalized_value == 5000.0
        assert ni.was_converted is True

    def test_empty_unit_or_name_rejected(self):
        with pytest.raises(ValueError):
            NormalizedInput(
                name="",
                original_value=5.0,
                original_unit="kW",
                normalized_value=5000.0,
                normalized_unit="W",
            )
        with pytest.raises(ValueError):
            NormalizedInput(
                name="P",
                original_value=5.0,
                original_unit="  ",
                normalized_value=5000.0,
                normalized_unit="W",
            )


class TestCalculationStep:
    """Tests for CalculationStep and legacy EquationStep alias."""

    def test_valid_calculation_step(self):
        step = CalculationStep(
            step=1,
            step_id="torque_calc",
            description="Tính mô-men xoắn T₁",
            formula="T₁ = 9.55×10⁶ × P / n₁",
            formula_latex=r"T_1 = \frac{9.55 \times 10^6 \cdot P}{n_1}",
            variables={"P": 5.0, "n1": 1450},
            substitution="9.55×10⁶ × 5.0 / 1450",
            value=32931.03,
            unit="N·mm",
            result_display="32931.03 N·mm",
            reference="Trịnh Chất, CT 6.15",
        )
        assert step.step == 1
        assert step.step_id == "torque_calc"
        assert step.variables["P"] == 5.0
        assert step.value == 32931.03
        assert step.unit == "N·mm"
        # Backward compatibility properties
        assert step.result_value == 32931.03
        assert step.result_unit == "N·mm"

    def test_legacy_equation_step_alias(self):
        step = EquationStep(
            step=1,
            description="Tính mô-men xoắn T₁",
            formula="T₁ = 9.55×10⁶ × P / n₁",
            result_value=32931.03,
            result_unit="N·mm",
        )
        assert step.value == 32931.03
        assert step.unit == "N·mm"
        assert step.result_value == 32931.03
        assert step.result_unit == "N·mm"

    def test_empty_formula_or_description_rejected(self):
        with pytest.raises(ValueError):
            CalculationStep(step=1, description="", formula="a + b")
        with pytest.raises(ValueError):
            CalculationStep(step=1, description="calc", formula="   ")

    def test_whitespace_unit_rejected(self):
        with pytest.raises(ValueError):
            CalculationStep(
                step=1,
                description="calc",
                formula="a + b",
                unit="   ",
            )


class TestIntermediateAndOutputValue:
    """Tests for IntermediateValue and OutputValue models."""

    def test_intermediate_value(self):
        iv = IntermediateValue(
            name="T1",
            symbol="T_1",
            value=32931.03,
            unit="N·mm",
            formula="T1 = 9.55e6 * P / n1",
            description="Mô-men xoắn trục 1",
        )
        assert iv.name == "T1"
        assert iv.unit == "N·mm"

    def test_output_value_with_checks(self):
        ov = OutputValue(
            name="d1",
            symbol="d_1",
            value=35.0,
            unit="mm",
            description="Đường kính trục 1",
            check_condition="d1 ≥ [d1]",
            check_result=CheckResult.PASS,
            allowable_value=30.0,
            allowable_unit="mm",
            safety_factor=1.17,
            margin_percent=16.67,
        )
        assert ov.check_result == CheckResult.PASS
        assert ov.safety_factor == 1.17

    def test_output_value_empty_unit_rejected(self):
        with pytest.raises(ValueError):
            OutputValue(name="d1", value=35.0, unit="")


# --- Validation and Warning Tests ---


class TestValidationCheckAndSummary:
    """Tests for ValidationCheck and ValidationSummary models."""

    def test_validation_check_pass(self):
        vc = ValidationCheck(
            name="Kiểm nghiệm bền tiếp xúc bánh răng",
            condition="σ_H ≤ [σ_H]",
            result=CheckResult.PASS,
            actual_value=485.2,
            limit_value=520.0,
            unit="MPa",
            margin_percent=6.69,
        )
        assert vc.result == CheckResult.PASS
        assert vc.actual_value < vc.limit_value

    def test_validation_check_fail(self):
        vc = ValidationCheck(
            name="Kiểm nghiệm bền uốn",
            condition="σ_F ≤ [σ_F]",
            result=CheckResult.FAIL,
            actual_value=215.0,
            limit_value=190.0,
            unit="MPa",
            margin_percent=-13.16,
        )
        assert vc.result == CheckResult.FAIL

    def test_validation_check_info(self):
        vc = ValidationCheck(
            name="Gợi ý chọn ổ lăn",
            condition="L10h ≥ 15000",
            result=CheckResult.INFO,
            actual_value=18000.0,
            limit_value=15000.0,
            unit="giờ",
            description="Tuổi thọ vượt yêu cầu cơ sở",
        )
        assert vc.result == CheckResult.INFO

    def test_validation_summary_auto_counts(self):
        checks = [
            ValidationCheck(name="c1", condition="a>0", result=CheckResult.PASS),
            ValidationCheck(name="c2", condition="b<10", result=CheckResult.FAIL),
            ValidationCheck(name="c3", condition="c==1", result=CheckResult.INFO),
        ]
        summary = ValidationSummary(
            all_checks_passed=False,
            total_checks=3,
            passed_checks=1,
            failed_checks=1,
            info_checks=1,
            checks=checks,
        )
        assert summary.all_checks_passed is False
        assert summary.total_checks == 3
        assert summary.failed_checks == 1


class TestCalculationWarningAndError:
    """Tests for warnings and errors."""

    def test_warning_severities(self):
        w_info = CalculationWarning(
            code="EFFICIENCY_NOTE",
            severity=WarningSeverity.INFO,
            message="Hiệu suất bộ truyền nằm trong dải trung bình",
        )
        w_warn = CalculationWarning(
            code="HIGH_STRESS",
            severity=WarningSeverity.WARNING,
            message="Ứng suất uốn gần giới hạn",
            suggestion="Tăng mô-đun pháp m",
        )
        w_crit = CalculationWarning(
            code="CRITICAL_OVERHEAT",
            severity=WarningSeverity.CRITICAL,
            message="Nhiệt độ dầu vượt ngưỡng an toàn",
            suggestion="Bổ sung quạt làm mát",
        )
        assert w_info.severity == WarningSeverity.INFO
        assert w_warn.severity == WarningSeverity.WARNING
        assert w_crit.severity == WarningSeverity.CRITICAL

    def test_calculation_error(self):
        err = CalculationError(
            code="RANGE_ERROR",
            message="Tỷ số truyền u phải lớn hơn 1",
            parameter="u",
            details={"provided_u": 0.5},
        )
        assert err.code == "RANGE_ERROR"
        assert err.details["provided_u"] == 0.5


# --- EngineeringCalculationResult Full Test Suite (Requirements A-K) ---


class TestEngineeringCalculationResult:
    """Tests for EngineeringCalculationResult as SSOT."""

    def test_req_a_minimal_result(self):
        """Test A: Minimal valid result can be instantiated."""
        result = EngineeringCalculationResult(
            calculation_type="shaft_design",
            status=ResultStatus.SUCCESS,
        )
        assert result.status == ResultStatus.SUCCESS
        assert result.calculation_id
        assert len(result.calculations) == 0
        assert len(result.results) == 0

    def test_req_b_full_result_can_be_serialized(self):
        """
        Test B: Full result containing:
        inputs, assumptions, normalized_inputs, calculations, results, checks,
        warnings, references, metadata can be serialized to JSON.
        """
        result = EngineeringCalculationResult(
            calculation_type="shaft_design",
            status=ResultStatus.SUCCESS,
            inputs={"P": 5.0, "n1": 1450, "u": 3.2},
            assumptions=["Tải trọng tĩnh, không va đập", "Trục quay 1 chiều"],
            normalized_inputs=[
                NormalizedInput(
                    name="P",
                    original_value=5.0,
                    original_unit="kW",
                    normalized_value=5000.0,
                    normalized_unit="W",
                    was_converted=True,
                    description="Công suất động cơ",
                    source="User Input",
                ),
            ],
            calculations=[
                CalculationStep(
                    step=1,
                    step_id="torque_calc",
                    description="Tính mô-men xoắn T₁",
                    formula="T₁ = 9.55×10⁶ × P / n₁",
                    formula_latex=r"T_1 = \frac{9.55 \times 10^6 \cdot P}{n_1}",
                    variables={"P": 5.0, "n1": 1450},
                    substitution="9.55×10⁶ × 5.0 / 1450",
                    value=32931.03,
                    unit="N·mm",
                    result_display="32931.03 N·mm",
                    reference="Trịnh Chất, CT 6.15",
                ),
                CalculationStep(
                    step=2,
                    step_id="diameter_prelim",
                    description="Tính sơ bộ đường kính trục d₁",
                    formula="d₁ = ∛(T₁ / (0.2 × [τ]))",
                    formula_latex=r"d_1 = \sqrt[3]{\frac{T_1}{0.2 \cdot [\tau]}}",
                    variables={"T1": 32931.03, "tau": 20.0},
                    substitution="∛(32931.03 / (0.2 × 20))",
                    value=20.19,
                    unit="mm",
                    result_display="20.19 mm",
                    reference="Trịnh Chất, CT 10.9",
                ),
            ],
            intermediate_values=[
                IntermediateValue(
                    name="T1",
                    symbol="T_1",
                    value=32931.03,
                    unit="N·mm",
                    description="Mô-men xoắn",
                ),
            ],
            results=[
                OutputValue(
                    name="d1",
                    symbol="d_1",
                    value=25.0,
                    unit="mm",
                    description="Đường kính trục tiêu chuẩn",
                    check_condition="d1 ≥ 20.19",
                    check_result=CheckResult.PASS,
                    allowable_value=20.19,
                    allowable_unit="mm",
                    safety_factor=1.24,
                    margin_percent=23.82,
                ),
            ],
            checks=[
                ValidationCheck(
                    name="Kiểm tra đường kính trục tiêu chuẩn",
                    condition="d1 ≥ d1_calc",
                    result=CheckResult.PASS,
                    actual_value=25.0,
                    limit_value=20.19,
                    unit="mm",
                    margin_percent=23.82,
                ),
            ],
            warnings=[
                CalculationWarning(
                    code="DIAMETER_ROUNDED",
                    severity=WarningSeverity.INFO,
                    message="Đã làm tròn đường kính trục lên dãy số tiêu chuẩn R40",
                    suggestion="Không cần điều chỉnh",
                ),
            ],
            errors=[],
            references=["TCVN 1065:2004", "Trịnh Chất - Tính toán thiết kế CTTM"],
            units={"d1": "mm", "T1": "N·mm"},
            metadata=CalculationMetadata(
                engine_version="0.1.0",
                calculation_module="shaft_design",
                module_version="1.0.0",
                computation_time_ms=8,
                standards=["TCVN 1065:2004"],
                output_files=[
                    OutputFileInfo(
                        format="xlsx",
                        path="output/calc.xlsx",
                        size_bytes=10240,
                        generated_at=datetime.now(),
                    ),
                ],
            ),
        )

        json_str = result.model_dump_json()
        assert isinstance(json_str, str)
        data = json.loads(json_str)
        assert data["calculation_type"] == "shaft_design"
        assert len(data["calculations"]) == 2
        assert len(data["results"]) == 1
        assert len(data["checks"]) == 1
        assert data["metadata"]["calculation_module"] == "shaft_design"

    def test_req_c_json_roundtrip_preserves_structure(self):
        """Test C: JSON serialization → Pydantic deserialization preserves structure."""
        step = CalculationStep(
            step=1,
            step_id="calc_s1",
            description="Bước 1",
            formula="y = 2*x",
            variables={"x": 10},
            value=20.0,
            unit="mm",
        )
        res_orig = EngineeringCalculationResult(
            calculation_type="shaft_design",
            status=ResultStatus.SUCCESS,
            assumptions=["Giả thiết A"],
            calculations=[step],
            results=[OutputValue(name="y", value=20.0, unit="mm")],
            checks=[ValidationCheck(name="chk", condition="y > 0", result=CheckResult.PASS)],
            metadata=CalculationMetadata(calculation_module="shaft_design"),
        )

        json_str = res_orig.model_dump_json()
        res_deserialized = EngineeringCalculationResult.model_validate_json(json_str)

        assert res_deserialized.calculation_id == res_orig.calculation_id
        assert res_deserialized.calculations[0].variables == {"x": 10}
        assert res_deserialized.calculations[0].value == 20.0
        assert res_deserialized.results[0].value == 20.0
        assert res_deserialized.checks[0].result == CheckResult.PASS
        assert res_deserialized.validation.all_checks_passed is True

    def test_req_d_calculation_ordering_is_deterministic(self):
        """Test D: Calculation ordering is deterministic and strictly preserved."""
        steps = [
            CalculationStep(step=i, description=f"Step {i}", formula=f"f_{i} = {i}", value=float(i))
            for i in range(1, 10)
        ]
        result = EngineeringCalculationResult(
            calculation_type="shaft_design",
            status=ResultStatus.SUCCESS,
            calculations=steps,
        )
        assert [s.step for s in result.calculations] == list(range(1, 10))

        # Re-verify through JSON serialization
        data = json.loads(result.model_dump_json())
        assert [s["step"] for s in data["calculations"]] == list(range(1, 10))

    def test_req_e_calculation_steps_contain_required_fields(self):
        """Test E: Calculation steps contain formula + variables + value + unit."""
        step = CalculationStep(
            step=1,
            step_id="step_p",
            description="Công suất tính toán",
            formula="P_t = P * k",
            formula_latex=r"P_t = P \cdot k",
            variables={"P": 5.0, "k": 1.25},
            value=6.25,
            unit="kW",
        )
        assert step.formula == "P_t = P * k"
        assert step.formula_latex == r"P_t = P \cdot k"
        assert step.variables == {"P": 5.0, "k": 1.25}
        assert step.value == 6.25
        assert step.unit == "kW"

    def test_req_f_validation_checks_support_pass_fail_info(self):
        """Test F: ValidationCheck supports PASS / FAIL / INFO."""
        chk_pass = ValidationCheck(name="c1", condition="s >= [s]", result=CheckResult.PASS)
        chk_fail = ValidationCheck(name="c2", condition="tau <= [tau]", result=CheckResult.FAIL)
        chk_info = ValidationCheck(name="c3", condition="rec >= 1000", result=CheckResult.INFO)

        result = EngineeringCalculationResult(
            calculation_type="shaft_design",
            status=ResultStatus.WARNING,
            checks=[chk_pass, chk_fail, chk_info],
        )
        assert result.checks[0].result == CheckResult.PASS
        assert result.checks[1].result == CheckResult.FAIL
        assert result.checks[2].result == CheckResult.INFO
        assert result.validation.failed_checks == 1
        assert result.validation.passed_checks == 1
        assert result.validation.info_checks == 1
        assert result.validation.all_checks_passed is False

    def test_req_g_warning_severity_supports_all_levels(self):
        """Test G: Warning severity supports INFO / WARNING / CRITICAL."""
        w1 = CalculationWarning(code="W1", severity=WarningSeverity.INFO, message="Info msg")
        w2 = CalculationWarning(code="W2", severity=WarningSeverity.WARNING, message="Warn msg")
        w3 = CalculationWarning(code="W3", severity=WarningSeverity.CRITICAL, message="Crit msg")

        result = EngineeringCalculationResult(
            calculation_type="shaft_design",
            status=ResultStatus.WARNING,
            warnings=[w1, w2, w3],
        )
        assert len(result.warnings) == 3
        assert [w.severity for w in result.warnings] == [
            WarningSeverity.INFO,
            WarningSeverity.WARNING,
            WarningSeverity.CRITICAL,
        ]

    def test_req_h_metadata_contains_engine_module_version(self):
        """Test H: Metadata contains engine/module/version information."""
        meta = CalculationMetadata(
            engine_version="0.1.0",
            calculation_module="gear_design",
            module_version="1.2.0",
            computation_time_ms=15,
            standards=["TCVN 1065:2004", "ISO 6336"],
        )
        result = EngineeringCalculationResult(
            calculation_type="gear_design",
            status=ResultStatus.SUCCESS,
            metadata=meta,
        )
        assert result.metadata.engine_version == "0.1.0"
        assert result.metadata.calculation_module == "gear_design"
        assert result.metadata.module_version == "1.2.0"
        assert result.metadata.computation_time_ms == 15
        assert "TCVN 1065:2004" in result.metadata.standards

    def test_req_i_invalid_contracts_are_rejected(self):
        """Test I: Invalid contracts are rejected."""
        # Empty calculation_type
        with pytest.raises(Exception):
            EngineeringCalculationResult(calculation_type="", status=ResultStatus.SUCCESS)

        # Invalid status
        with pytest.raises(Exception):
            EngineeringCalculationResult(calculation_type="test", status="invalid_status")

        # Missing calculation_module in metadata
        with pytest.raises(Exception):
            CalculationMetadata(calculation_module="")

    def test_req_j_unit_bearing_values_cannot_silently_lose_units(self):
        """Test J: Unit-bearing values cannot silently lose their unit metadata."""
        with pytest.raises(ValueError):
            OutputValue(name="d", value=20.0, unit="")
        with pytest.raises(ValueError):
            OutputValue(name="d", value=20.0, unit="   ")
        with pytest.raises(ValueError):
            IntermediateValue(name="T", value=100.0, unit="")
        with pytest.raises(ValueError):
            CalculationStep(step=1, description="step", formula="f", unit="")

    def test_req_k_downstream_consumer_compatibility(self):
        """
        Test K: The result is suitable for downstream Excel/LaTeX/EPXYZ consumers.
        Verifies:
        - Excel builder can access inputs, calculations, results, assumptions.
        - LaTeX generator can access formula_latex, check_result, metadata.standards.
        - EPXYZ exporter can access variables, values, units.
        """
        result = EngineeringCalculationResult(
            calculation_type="shaft_design",
            status=ResultStatus.SUCCESS,
            inputs={"P": 5.0, "n1": 1450},
            assumptions=["Tải trọng tĩnh"],
            calculations=[
                CalculationStep(
                    step=1,
                    step_id="t1_calc",
                    description="Mô-men xoắn",
                    formula="T1 = 9.55e6 * P / n1",
                    formula_latex=r"T_1 = \frac{9.55 \times 10^6 \cdot P}{n_1}",
                    variables={"P": 5.0, "n1": 1450},
                    value=32931.03,
                    unit="N·mm",
                ),
            ],
            results=[
                OutputValue(
                    name="d1",
                    symbol="d_1",
                    value=25.0,
                    unit="mm",
                    formula_latex=r"d_1 \ge 20",
                    check_result=CheckResult.PASS,
                ),
            ],
            metadata=CalculationMetadata(
                calculation_module="shaft_design",
                standards=["TCVN 1065:2004"],
            ),
        )

        # 1. Excel consumer checks
        assert hasattr(result, "inputs")
        assert hasattr(result, "calculations")
        assert hasattr(result, "results")
        assert len(result.calculations) > 0
        assert result.calculations[0].value is not None

        # 2. LaTeX consumer checks
        assert result.calculations[0].formula_latex is not None
        assert result.results[0].check_result == CheckResult.PASS
        assert len(result.metadata.standards) > 0

        # 3. EPXYZ consumer checks
        assert result.calculations[0].variables == {"P": 5.0, "n1": 1450}
        assert result.calculations[0].unit == "N·mm"

        # 4. Backward-compatibility property checks
        assert result.equations == result.calculations
        assert result.outputs == result.results

    def test_legacy_equations_outputs_input_support(self):
        """Test backward compatibility when initializing with legacy equations / outputs."""
        result = EngineeringCalculationResult(
            calculation_type="shaft_design",
            status=ResultStatus.SUCCESS,
            equations=[
                EquationStep(
                    step=1,
                    description="Legacy step",
                    formula="a = b + c",
                    result_value=10.0,
                    result_unit="mm",
                ),
            ],
            outputs=[
                OutputValue(name="a", value=10.0, unit="mm"),
            ],
        )
        assert len(result.calculations) == 1
        assert result.calculations[0].value == 10.0
        assert result.calculations[0].unit == "mm"
        assert len(result.results) == 1
        assert result.results[0].name == "a"
        assert result.equations == result.calculations
        assert result.outputs == result.results

    def test_all_status_values(self):
        for status in ResultStatus:
            result = EngineeringCalculationResult(
                calculation_type="test",
                status=status,
            )
            assert result.status == status
