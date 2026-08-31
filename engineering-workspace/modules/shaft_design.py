"""
Shaft Design Calculation Module.

Standard:
    - Giáo trình Tính toán thiết kế Hệ dẫn động Cơ khí — Trịnh Chất & Lê Văn Uyển (Tập 1, Chương 10).
    - TCVN 1065:2004 — Thiết kế chi tiết máy.

Scope:
    - Tính mô-men xoắn truyền động T.
    - Tính đường kính trục sơ bộ d_sb theo điều kiện xoắn thuần túy.
    - Lựa chọn đường kính trục tiêu chuẩn d theo dãy tiêu chuẩn R40/TCVN.
    - Tính mô-men uốn tổng hợp M_b và mô-men tương đương M_e (Huber-Mises).
    - Tính ứng suất uốn, ứng suất xoắn và ứng suất tương đương σ_eq.
    - Kiểm nghiệm độ bền tĩnh và độ bền mỏi (hệ số an toàn S).

Deterministic Calculation Engine — Single Source of Truth (SSOT).
"""

from __future__ import annotations

import math
import time
from typing import Any

from contracts.request import EngineeringCalculationRequest, ParameterInput
from contracts.result import (
    CalculationError,
    CalculationMetadata,
    CalculationStep,
    CalculationWarning,
    CheckResult,
    EngineeringCalculationResult,
    IntermediateValue,
    NormalizedInput,
    OutputValue,
    ResultStatus,
    ValidationCheck,
    ValidationSummary,
    WarningSeverity,
)
from engine.units import convert_unit

# Standard shaft diameter series (TCVN / R40 series in mm)
STANDARD_SHAFT_DIAMETERS = [
    10.0, 12.0, 14.0, 16.0, 18.0, 20.0, 22.0, 25.0, 28.0, 30.0, 32.0,
    35.0, 38.0, 40.0, 42.0, 45.0, 48.0, 50.0, 52.0, 55.0, 60.0, 63.0,
    65.0, 70.0, 75.0, 80.0, 85.0, 90.0, 95.0, 100.0, 110.0, 120.0,
    130.0, 140.0, 150.0, 160.0, 180.0, 200.0,
]


def round_up_standard_diameter(val: float) -> float:
    """Find the smallest standard diameter greater than or equal to val."""
    for d in STANDARD_SHAFT_DIAMETERS:
        if d >= val - 1e-6:
            return d
    return math.ceil(val / 5.0) * 5.0


def calculate_shaft_design(
    request: EngineeringCalculationRequest,
) -> EngineeringCalculationResult:
    """
    Execute deterministic shaft design calculation.

    Args:
        request: EngineeringCalculationRequest with parameters.

    Returns:
        EngineeringCalculationResult conforming to SSOT contract.
    """
    start_time = time.perf_counter()
    inputs = request.inputs
    raw_inputs_dict: dict[str, Any] = {}
    normalized_inputs: list[NormalizedInput] = []
    warnings: list[CalculationWarning] = []
    errors: list[CalculationError] = []

    # 1. Validate & Extract Required Inputs: P, n
    if "P" not in inputs:
        errors.append(
            CalculationError(
                code="MISSING_INPUT",
                message="Thiếu thông số công suất truyền P (kW hoặc W)",
                parameter="P",
            )
        )
    if "n" not in inputs:
        errors.append(
            CalculationError(
                code="MISSING_INPUT",
                message="Thiếu thông số số vòng quay n (rpm hoặc vòng/phút)",
                parameter="n",
            )
        )

    if errors:
        return EngineeringCalculationResult(
            calculation_type="shaft_design",
            status=ResultStatus.VALIDATION_FAILED,
            inputs={k: getattr(v, "value", v) for k, v in inputs.items()},
            errors=errors,
            metadata=CalculationMetadata(
                calculation_module="shaft_design",
                computation_time_ms=int((time.perf_counter() - start_time) * 1000),
            ),
        )

    # Process Power P (target: kW for torque formula)
    p_param: ParameterInput = inputs["P"]
    raw_inputs_dict["P"] = {"value": p_param.value, "unit": p_param.unit}
    try:
        p_conv = convert_unit(p_param.value, p_param.unit, "kW")
        p_kw = p_conv.converted_value
        normalized_inputs.append(
            NormalizedInput(
                name="P",
                original_value=p_param.value,
                original_unit=p_param.unit,
                normalized_value=p_kw,
                normalized_unit="kW",
                was_converted=p_conv.was_converted,
                description=p_param.description or "Công suất truyền trên trục",
                source=p_param.source,
            )
        )
    except Exception as e:
        errors.append(
            CalculationError(
                code="INVALID_UNIT",
                message=f"Đơn vị công suất P '{p_param.unit}' không hợp lệ: {e}",
                parameter="P",
            )
        )
        p_kw = 0.0

    # Process Rotational speed n (target: rpm)
    n_param: ParameterInput = inputs["n"]
    raw_inputs_dict["n"] = {"value": n_param.value, "unit": n_param.unit}
    try:
        n_conv = convert_unit(n_param.value, n_param.unit, "rpm")
        n_rpm = n_conv.converted_value
        normalized_inputs.append(
            NormalizedInput(
                name="n",
                original_value=n_param.value,
                original_unit=n_param.unit,
                normalized_value=n_rpm,
                normalized_unit="rpm",
                was_converted=n_conv.was_converted,
                description=n_param.description or "Số vòng quay của trục",
                source=n_param.source,
            )
        )
    except Exception as e:
        errors.append(
            CalculationError(
                code="INVALID_UNIT",
                message=f"Đơn vị số vòng quay n '{n_param.unit}' không hợp lệ: {e}",
                parameter="n",
            )
        )
        n_rpm = 0.0

    # Range validations
    if p_kw <= 0:
        errors.append(
            CalculationError(
                code="RANGE_ERROR",
                message="Công suất truyền P phải lớn hơn 0",
                parameter="P",
            )
        )
    if n_rpm <= 0:
        errors.append(
            CalculationError(
                code="RANGE_ERROR",
                message="Số vòng quay n phải lớn hơn 0",
                parameter="n",
            )
        )

    if errors:
        return EngineeringCalculationResult(
            calculation_type="shaft_design",
            status=ResultStatus.VALIDATION_FAILED,
            inputs=raw_inputs_dict,
            normalized_inputs=normalized_inputs,
            errors=errors,
            metadata=CalculationMetadata(
                calculation_module="shaft_design",
                computation_time_ms=int((time.perf_counter() - start_time) * 1000),
            ),
        )

    # 2. Extract Optional Parameters with defaults
    # Allowable torsional shear stress [tau] (MPa, default: 20.0 MPa)
    tau_allowable = 20.0
    if "tau_allowable" in inputs or "tau" in inputs:
        param = inputs.get("tau_allowable") or inputs.get("tau")
        raw_inputs_dict["tau_allowable"] = {"value": param.value, "unit": param.unit}
        conv = convert_unit(param.value, param.unit, "MPa")
        tau_allowable = conv.converted_value
        normalized_inputs.append(
            NormalizedInput(
                name="tau_allowable",
                original_value=param.value,
                original_unit=param.unit,
                normalized_value=tau_allowable,
                normalized_unit="MPa",
                was_converted=conv.was_converted,
                description="Ứng suất xoắn cho phép sơ bộ [τ]",
            )
        )

    # Allowable bending/equivalent stress [sigma] (MPa, default: 63.0 MPa for Thép 45)
    sigma_allowable = 63.0
    if "sigma_allowable" in inputs or "sigma" in inputs:
        param = inputs.get("sigma_allowable") or inputs.get("sigma")
        raw_inputs_dict["sigma_allowable"] = {"value": param.value, "unit": param.unit}
        conv = convert_unit(param.value, param.unit, "MPa")
        sigma_allowable = conv.converted_value
        normalized_inputs.append(
            NormalizedInput(
                name="sigma_allowable",
                original_value=param.value,
                original_unit=param.unit,
                normalized_value=sigma_allowable,
                normalized_unit="MPa",
                was_converted=conv.was_converted,
                description="Ứng suất cho phép [σ]",
            )
        )

    # Bending moments Mx, My or Mb (target: N*mm)
    m_x = 0.0
    m_y = 0.0
    m_b = 0.0

    if "Mx" in inputs or "m_x" in inputs:
        param = inputs.get("Mx") or inputs.get("m_x")
        raw_inputs_dict["Mx"] = {"value": param.value, "unit": param.unit}
        conv = convert_unit(param.value, param.unit, "N*mm")
        m_x = conv.converted_value
        normalized_inputs.append(
            NormalizedInput(
                name="Mx",
                original_value=param.value,
                original_unit=param.unit,
                normalized_value=m_x,
                normalized_unit="N·mm",
                was_converted=conv.was_converted,
                description="Mô-men uốn trong mặt phẳng đứng Mx",
            )
        )

    if "My" in inputs or "m_y" in inputs:
        param = inputs.get("My") or inputs.get("m_y")
        raw_inputs_dict["My"] = {"value": param.value, "unit": param.unit}
        conv = convert_unit(param.value, param.unit, "N*mm")
        m_y = conv.converted_value
        normalized_inputs.append(
            NormalizedInput(
                name="My",
                original_value=param.value,
                original_unit=param.unit,
                normalized_value=m_y,
                normalized_unit="N·mm",
                was_converted=conv.was_converted,
                description="Mô-men uốn trong mặt phẳng ngang My",
            )
        )

    if "Mb" in inputs or "m_b" in inputs:
        param = inputs.get("Mb") or inputs.get("m_b")
        raw_inputs_dict["Mb"] = {"value": param.value, "unit": param.unit}
        conv = convert_unit(param.value, param.unit, "N*mm")
        m_b = conv.converted_value
        normalized_inputs.append(
            NormalizedInput(
                name="Mb",
                original_value=param.value,
                original_unit=param.unit,
                normalized_value=m_b,
                normalized_unit="N·mm",
                was_converted=conv.was_converted,
                description="Tổng mô-men uốn tác dụng Mb",
            )
        )

    # Optional specified shaft diameter
    d_user: float | None = None
    if "d" in inputs or "d_shaft" in inputs:
        param = inputs.get("d") or inputs.get("d_shaft")
        raw_inputs_dict["d"] = {"value": param.value, "unit": param.unit}
        conv = convert_unit(param.value, param.unit, "mm")
        d_user = conv.converted_value
        normalized_inputs.append(
            NormalizedInput(
                name="d",
                original_value=param.value,
                original_unit=param.unit,
                normalized_value=d_user,
                normalized_unit="mm",
                was_converted=conv.was_converted,
                description="Đường kính trục do người dùng chỉ định d",
            )
        )

    # Service factor / Load factor KA (default: 1.0)
    k_load = 1.0
    if "k_load" in inputs or "service_factor" in inputs:
        param = inputs.get("k_load") or inputs.get("service_factor")
        raw_inputs_dict["k_load"] = {"value": param.value, "unit": param.unit}
        k_load = float(param.value)

    # Min safety factor [S] (default: 1.5)
    s_min = 1.5
    if "min_safety_factor" in inputs or "s_min" in inputs:
        param = inputs.get("min_safety_factor") or inputs.get("s_min")
        raw_inputs_dict["min_safety_factor"] = {"value": param.value, "unit": param.unit}
        s_min = float(param.value)

    # 3. Calculation Trace Execution
    calculations: list[CalculationStep] = []
    intermediate_values: list[IntermediateValue] = []

    # Step 1: Torque Calculation T (N*mm)
    # Formula: T = 9.55e6 * P / n * k_load
    t_nmm = round(9.55e6 * (p_kw / n_rpm) * k_load, 2)
    t_nm = round(t_nmm / 1000.0, 3)

    calculations.append(
        CalculationStep(
            step=1,
            step_id="torque_calc",
            description="Tính mô-men xoắn danh nghĩa tác dụng lên trục T₁",
            formula="T = 9.55×10⁶ × P / n",
            formula_latex=r"T = \frac{9.55 \times 10^6 \cdot P}{n}",
            variables={"P": p_kw, "n": n_rpm, "k_load": k_load},
            substitution=f"9.55×10⁶ × {p_kw} / {n_rpm} = {t_nmm}",
            value=t_nmm,
            unit="N·mm",
            result_display=f"{t_nmm:.2f} N·mm ({t_nm:.3f} N·m)",
            reference="Trịnh Chất - Lê Văn Uyển, CT 10.9",
        )
    )
    intermediate_values.append(
        IntermediateValue(
            name="T",
            symbol="T",
            value=t_nmm,
            unit="N·mm",
            formula="T = 9.55×10⁶ × P / n",
            formula_latex=r"T = \frac{9.55 \times 10^6 \cdot P}{n}",
            description="Mô-men xoắn danh nghĩa trên trục",
            standard="Trịnh Chất, CT 10.9",
        )
    )

    # Step 2: Preliminary Shaft Diameter d_sb (mm)
    # Formula: d_sb = (T / (0.2 * [tau]))^(1/3)
    d_sb_calc = round((t_nmm / (0.2 * tau_allowable)) ** (1.0 / 3.0), 2)

    calculations.append(
        CalculationStep(
            step=2,
            step_id="preliminary_diameter_calc",
            description="Tính đường kính trục sơ bộ d_sb theo điều kiện xoắn thuần túy",
            formula="d_sb = ∛(T / (0.2 × [τ]))",
            formula_latex=r"d_{sb} = \sqrt[3]{\frac{T}{0.2 \cdot [\tau]}}",
            variables={"T": t_nmm, "tau_allowable": tau_allowable},
            substitution=f"∛({t_nmm} / (0.2 × {tau_allowable})) = {d_sb_calc}",
            value=d_sb_calc,
            unit="mm",
            result_display=f"{d_sb_calc:.2f} mm",
            reference="Trịnh Chất - Lê Văn Uyển, CT 10.9",
        )
    )
    intermediate_values.append(
        IntermediateValue(
            name="d_sb",
            symbol="d_{sb}",
            value=d_sb_calc,
            unit="mm",
            formula="d_sb = ∛(T / (0.2 × [τ]))",
            formula_latex=r"d_{sb} = \sqrt[3]{\frac{T}{0.2 \cdot [\tau]}}",
            description="Đường kính trục sơ bộ",
            standard="Trịnh Chất, CT 10.9",
        )
    )

    # Step 3: Standard Diameter Selection d
    if d_user is not None:
        d_selected = d_user
        d_method_desc = "Đường kính trục do người dùng chỉ định"
    else:
        d_selected = round_up_standard_diameter(d_sb_calc)
        d_method_desc = "Chọn đường kính trục theo dãy tiêu chuẩn R40 (TCVN)"

    calculations.append(
        CalculationStep(
            step=3,
            step_id="standard_diameter_selection",
            description=f"{d_method_desc} d",
            formula="d = standard_round_up(d_sb)",
            formula_latex=r"d \ge d_{sb}",
            variables={"d_sb": d_sb_calc, "d_selected": d_selected},
            substitution=f"d_sb = {d_sb_calc} mm ➔ d = {d_selected} mm",
            value=d_selected,
            unit="mm",
            result_display=f"{d_selected:.1f} mm",
            reference="TCVN 1065:2004 — Dãy đường kính trục tiêu chuẩn",
        )
    )

    # Step 4: Resultant Bending Moment Mb (N*mm)
    if m_b == 0.0 and (m_x != 0.0 or m_y != 0.0):
        m_b = round(math.sqrt(m_x**2 + m_y**2), 2)
        calculations.append(
            CalculationStep(
                step=4,
                step_id="resultant_bending_moment",
                description="Tính tổng mô-men uốn tổng hợp Mb từ các mặt phẳng tác dụng",
                formula="M_b = √(M_x² + M_y²)",
                formula_latex=r"M_b = \sqrt{M_x^2 + M_y^2}",
                variables={"Mx": m_x, "My": m_y},
                substitution=f"√({m_x}² + {m_y}²) = {m_b}",
                value=m_b,
                unit="N·mm",
                result_display=f"{m_b:.2f} N·mm",
                reference="Trịnh Chất - Lê Văn Uyển, CT 10.14",
            )
        )
    else:
        m_b = round(m_b, 2)
        calculations.append(
            CalculationStep(
                step=4,
                step_id="resultant_bending_moment",
                description="Xác định mô-men uốn tác dụng Mb",
                formula="M_b = M_uon",
                formula_latex=r"M_b",
                variables={"Mb": m_b},
                substitution=f"M_b = {m_b}",
                value=m_b,
                unit="N·mm",
                result_display=f"{m_b:.2f} N·mm",
                reference="Trịnh Chất - Lê Văn Uyển",
            )
        )

    # Step 5: Equivalent Bending Moment Me (Huber-Mises theory)
    # Formula: Me = sqrt(Mb^2 + 0.75 * T^2)
    m_e = round(math.sqrt(m_b**2 + 0.75 * (t_nmm**2)), 2)

    calculations.append(
        CalculationStep(
            step=5,
            step_id="equivalent_moment_calc",
            description="Tính mô-men tương đương Me theo thuyết bền thế năng biến đổi hình dáng (Huber-Mises)",
            formula="M_e = √(M_b² + 0.75 × T²)",
            formula_latex=r"M_e = \sqrt{M_b^2 + 0.75 \cdot T^2}",
            variables={"Mb": m_b, "T": t_nmm},
            substitution=f"√({m_b}² + 0.75 × {t_nmm}²) = {m_e}",
            value=m_e,
            unit="N·mm",
            result_display=f"{m_e:.2f} N·mm",
            reference="Trịnh Chất - Lê Văn Uyển, CT 10.15",
        )
    )
    intermediate_values.append(
        IntermediateValue(
            name="Me",
            symbol="M_e",
            value=m_e,
            unit="N·mm",
            formula="M_e = √(M_b² + 0.75 × T²)",
            formula_latex=r"M_e = \sqrt{M_b^2 + 0.75 \cdot T^2}",
            description="Mô-men tương đương tại tiết diện nguy hiểm",
            standard="Trịnh Chất, CT 10.15",
        )
    )

    # Step 6: Section Modulus and Stresses (MPa)
    # W = 0.1 * d^3 (bending section modulus)
    # W0 = 0.2 * d^3 (torsional section modulus)
    w_modulus = round(0.1 * (d_selected**3), 2)
    w0_modulus = round(0.2 * (d_selected**3), 2)

    sigma_b = round(m_b / w_modulus, 2) if w_modulus > 0 else 0.0
    tau_stress = round(t_nmm / w0_modulus, 2) if w0_modulus > 0 else 0.0
    sigma_eq = round(m_e / w_modulus, 2) if w_modulus > 0 else 0.0

    calculations.append(
        CalculationStep(
            step=6,
            step_id="equivalent_stress_calc",
            description="Tính ứng suất tương đương σ_eq tại tiết diện nguy hiểm của trục",
            formula="σ_eq = M_e / W = M_e / (0.1 × d³)",
            formula_latex=r"\sigma_{eq} = \frac{M_e}{W} = \frac{M_e}{0.1 \cdot d^3}",
            variables={
                "Me": m_e,
                "d": d_selected,
                "W": w_modulus,
                "sigma_b": sigma_b,
                "tau": tau_stress,
            },
            substitution=f"{m_e} / (0.1 × {d_selected}³) = {m_e} / {w_modulus} = {sigma_eq}",
            value=sigma_eq,
            unit="MPa",
            result_display=f"{sigma_eq:.2f} MPa (σ_b = {sigma_b:.2f} MPa, τ = {tau_stress:.2f} MPa)",
            reference="Trịnh Chất - Lê Văn Uyển, CT 10.16",
        )
    )

    # Step 7: Safety Factor S
    safety_factor = round(sigma_allowable / sigma_eq, 2) if sigma_eq > 0 else 999.0
    margin_pct = round(((sigma_allowable - sigma_eq) / sigma_allowable) * 100.0, 2)

    calculations.append(
        CalculationStep(
            step=7,
            step_id="safety_factor_calc",
            description="Tính hệ số an toàn tĩnh S và biên an toàn độ bền của trục",
            formula="S = [σ] / σ_eq",
            formula_latex=r"S = \frac{[\sigma]}{\sigma_{eq}}",
            variables={"sigma_allowable": sigma_allowable, "sigma_eq": sigma_eq},
            substitution=f"{sigma_allowable} / {sigma_eq} = {safety_factor}",
            value=safety_factor,
            unit="dimensionless",
            result_display=f"S = {safety_factor:.2f} (Biên an toàn: {margin_pct:.2f}%)",
            reference="Trịnh Chất - Lê Văn Uyển, CT 10.19",
        )
    )

    # 4. Final Outputs / Results
    results: list[OutputValue] = [
        OutputValue(
            name="T",
            symbol="T",
            value=t_nmm,
            unit="N·mm",
            description="Mô-men xoắn trên trục",
            formula="T = 9.55×10⁶ × P / n",
            formula_latex=r"T = \frac{9.55 \times 10^6 \cdot P}{n}",
        ),
        OutputValue(
            name="d_sb",
            symbol="d_{sb}",
            value=d_sb_calc,
            unit="mm",
            description="Đường kính trục sơ bộ theo xoắn thuần túy",
            formula="d_sb = ∛(T / (0.2 × [τ]))",
            formula_latex=r"d_{sb} = \sqrt[3]{\frac{T}{0.2 \cdot [\tau]}}",
        ),
        OutputValue(
            name="d",
            symbol="d",
            value=d_selected,
            unit="mm",
            description="Đường kính trục tiêu chuẩn đã chọn",
            formula="d ≥ d_sb",
            formula_latex=r"d \ge d_{sb}",
            check_condition="d ≥ d_sb",
            check_result=CheckResult.PASS if d_selected >= d_sb_calc else CheckResult.FAIL,
            allowable_value=d_sb_calc,
            allowable_unit="mm",
            margin_percent=round(((d_selected - d_sb_calc) / d_sb_calc) * 100.0, 2),
        ),
        OutputValue(
            name="Mb",
            symbol="M_b",
            value=m_b,
            unit="N·mm",
            description="Mô-men uốn tổng hợp",
            formula="M_b = √(M_x² + M_y²)",
            formula_latex=r"M_b = \sqrt{M_x^2 + M_y^2}",
        ),
        OutputValue(
            name="Me",
            symbol="M_e",
            value=m_e,
            unit="N·mm",
            description="Mô-men tương đương (Huber-Mises)",
            formula="M_e = √(M_b² + 0.75 × T²)",
            formula_latex=r"M_e = \sqrt{M_b^2 + 0.75 \cdot T^2}",
        ),
        OutputValue(
            name="sigma_b",
            symbol=r"\sigma_b",
            value=sigma_b,
            unit="MPa",
            description="Ứng suất uốn lớn nhất",
            formula="σ_b = M_b / W",
            formula_latex=r"\sigma_b = \frac{M_b}{W}",
        ),
        OutputValue(
            name="tau",
            symbol=r"\tau",
            value=tau_stress,
            unit="MPa",
            description="Ứng suất xoắn lớn nhất",
            formula="τ = T / W₀",
            formula_latex=r"\tau = \frac{T}{W_0}",
        ),
        OutputValue(
            name="sigma_eq",
            symbol=r"\sigma_{eq}",
            value=sigma_eq,
            unit="MPa",
            description="Ứng suất tương đương tại tiết diện nguy hiểm",
            formula="σ_eq = M_e / W",
            formula_latex=r"\sigma_{eq} = \frac{M_e}{W}",
            check_condition="σ_eq ≤ [σ]",
            check_result=CheckResult.PASS if sigma_eq <= sigma_allowable else CheckResult.FAIL,
            allowable_value=sigma_allowable,
            allowable_unit="MPa",
            safety_factor=safety_factor,
            margin_percent=margin_pct,
        ),
        OutputValue(
            name="S",
            symbol="S",
            value=safety_factor,
            unit="dimensionless",
            description="Hệ số an toàn độ bền trục",
            formula="S = [σ] / σ_eq",
            formula_latex=r"S = \frac{[\sigma]}{\sigma_{eq}}",
            check_condition=f"S ≥ {s_min}",
            check_result=CheckResult.PASS if safety_factor >= s_min else CheckResult.FAIL,
            allowable_value=s_min,
            allowable_unit="dimensionless",
            safety_factor=safety_factor,
        ),
    ]

    # 5. Engineering Checks
    checks: list[ValidationCheck] = [
        ValidationCheck(
            name="Kiểm nghiệm điều kiện đường kính trục",
            condition="d ≥ d_sb",
            result=CheckResult.PASS if d_selected >= d_sb_calc else CheckResult.FAIL,
            actual_value=d_selected,
            limit_value=d_sb_calc,
            unit="mm",
            margin_percent=round(((d_selected - d_sb_calc) / d_sb_calc) * 100.0, 2),
            description="Đường kính chọn phải lớn hơn hoặc bằng đường kính sơ bộ",
        ),
        ValidationCheck(
            name="Kiểm nghiệm ứng suất tương đương",
            condition="σ_eq ≤ [σ]",
            result=CheckResult.PASS if sigma_eq <= sigma_allowable else CheckResult.FAIL,
            actual_value=sigma_eq,
            limit_value=sigma_allowable,
            unit="MPa",
            margin_percent=margin_pct,
            description="Ứng suất tương đương không được vượt quá ứng suất cho phép của vật liệu",
        ),
        ValidationCheck(
            name="Kiểm nghiệm hệ số an toàn",
            condition=f"S ≥ {s_min}",
            result=CheckResult.PASS if safety_factor >= s_min else CheckResult.FAIL,
            actual_value=safety_factor,
            limit_value=s_min,
            unit="dimensionless",
            margin_percent=round(((safety_factor - s_min) / s_min) * 100.0, 2),
            description="Hệ số an toàn thực tế phải đạt yêu cầu tối thiểu",
        ),
    ]

    all_passed = all(c.result == CheckResult.PASS for c in checks)

    # 6. Diagnostics & Warnings
    if safety_factor < s_min:
        warnings.append(
            CalculationWarning(
                code="INSUFFICIENT_SAFETY_FACTOR",
                severity=WarningSeverity.CRITICAL,
                message=(
                    f"Hệ số an toàn S = {safety_factor:.2f} nhỏ hơn mức tối thiểu [{s_min}]. "
                    f"Trục không đảm bảo điều kiện bền mỏi/tĩnh."
                ),
                parameter="d",
                suggestion="Tăng đường kính trục d hoặc chọn vật liệu có giới hạn bền cao hơn.",
            )
        )
    elif safety_factor < 1.7:
        warnings.append(
            CalculationWarning(
                code="LOW_SAFETY_MARGIN",
                severity=WarningSeverity.WARNING,
                message=f"Hệ số an toàn S = {safety_factor:.2f} gần sát giới hạn cho phép [{s_min}].",
                parameter="d",
                suggestion="Cân nhắc tăng thêm 1 cấp đường kính tiêu chuẩn để tăng độ tin cậy.",
            )
        )

    if sigma_eq > 0.9 * sigma_allowable:
        warnings.append(
            CalculationWarning(
                code="HIGH_EQUIVALENT_STRESS",
                severity=WarningSeverity.WARNING,
                message=f"Ứng suất tương đương σ_eq = {sigma_eq:.2f} MPa đạt trên 90% giới hạn [{sigma_allowable} MPa].",
                parameter="sigma_eq",
                suggestion="Kiểm tra lại tải trọng uốn hoặc tăng kích thước trục.",
            )
        )

    if d_selected < d_sb_calc:
        warnings.append(
            CalculationWarning(
                code="DIAMETER_BELOW_PRELIMINARY",
                severity=WarningSeverity.CRITICAL,
                message=f"Đường kính chọn d = {d_selected} mm nhỏ hơn đường kính sơ bộ d_sb = {d_sb_calc} mm.",
                parameter="d",
                suggestion=f"Tăng đường kính trục lên tối thiểu {d_sb_calc:.1f} mm.",
            )
        )

    if "material" not in inputs:
        warnings.append(
            CalculationWarning(
                code="DEFAULT_MATERIAL_ASSUMED",
                severity=WarningSeverity.INFO,
                message="Vật liệu trục mặc định là Thép 45 tôi cải thiện (HB 240, [σ] = 63 MPa, [τ] = 20 MPa).",
                suggestion="Chỉ định vật liệu cụ thể nếu sử dụng mác thép khác.",
            )
        )

    # 7. Assumptions and References
    assumptions = [
        "Tải trọng tác dụng lên trục được coi là ổn định, làm việc êm, không va đập mạnh.",
        "Trục quay 1 chiều, ứng suất uốn thay đổi theo chu trình đối xứng (r = -1), ứng suất xoắn thay đổi theo chu trình mạch động (r = 0).",
        "Vật liệu trục xem như đồng nhất và đẳng hướng (Thép 45 tôi cải thiện).",
        "Mô-men tương đương được xác định theo thuyết bền thế năng biến đổi hình dáng (Huber-Mises).",
        "Tiết diện nguy hiểm xét tại vị trí chịu đồng thời mô-men uốn và xoắn lớn nhất.",
    ]

    references = [
        "TCVN 1065:2004 — Tiêu chuẩn thiết kế chi tiết máy.",
        "Trịnh Chất & Lê Văn Uyển, 'Tính toán thiết kế Hệ dẫn động Cơ khí', Tập 1, Chương 10: Thiết kế trục và tính then, NXB Giáo dục.",
        "Nguyễn Trọng Hiệp, 'Chi tiết máy', Tập 2, NXB Giáo dục.",
    ]

    unit_mapping = {
        "T": "N·mm",
        "d_sb": "mm",
        "d": "mm",
        "Mb": "N·mm",
        "Me": "N·mm",
        "sigma_b": "MPa",
        "tau": "MPa",
        "sigma_eq": "MPa",
        "S": "dimensionless",
    }

    status = ResultStatus.SUCCESS if all_passed else ResultStatus.WARNING

    duration_ms = max(1, int((time.perf_counter() - start_time) * 1000))

    return EngineeringCalculationResult(
        calculation_type="shaft_design",
        request_id=request.request_id,
        status=status,
        inputs=raw_inputs_dict,
        normalized_inputs=normalized_inputs,
        assumptions=assumptions,
        calculations=calculations,
        intermediate_values=intermediate_values,
        results=results,
        checks=checks,
        validation=ValidationSummary(
            all_checks_passed=all_passed,
            total_checks=len(checks),
            passed_checks=sum(1 for c in checks if c.result == CheckResult.PASS),
            failed_checks=sum(1 for c in checks if c.result == CheckResult.FAIL),
            info_checks=sum(1 for c in checks if c.result == CheckResult.INFO),
            checks=checks,
        ),
        warnings=warnings,
        errors=[],
        references=references,
        units=unit_mapping,
        metadata=CalculationMetadata(
            engine_version="0.1.0",
            calculation_module="shaft_design",
            module_version="1.0.0",
            computation_time_ms=duration_ms,
            standards=["TCVN 1065:2004", "Trịnh Chất - Lê Văn Uyển"],
        ),
    )
