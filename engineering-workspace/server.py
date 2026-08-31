"""
Engineering Workspace MCP Server.

This is a THIN orchestration layer. It does NOT contain engineering formulas.
All calculations are delegated to registered modules via the registry.

Transport: stdio (standard MCP pattern for custom servers)

Tools exposed:
    - list_calculation_modules: List available/planned calculation modules
    - validate_calculation_request: Validate inputs before calculation
    - calculate: Run a registered calculation module
    - generate_excel: Generate Excel workbook from result (Phase 14D)
    - generate_report: Generate LaTeX/PDF report from result (Phase 14E)
    - export_epxyz: Generate EngineeringPaper.xyz file from result (Phase 14H)

Security:
    - No eval/exec
    - No arbitrary code execution
    - Only registered modules can execute
    - File output restricted to controlled directories
"""

from __future__ import annotations

import json
import os
import sys

# Add the engineering-workspace directory to Python path
_workspace_dir = os.path.dirname(os.path.abspath(__file__))
if _workspace_dir not in sys.path:
    sys.path.insert(0, _workspace_dir)

from mcp.server.mcpserver import MCPServer

from contracts.request import (
    EngineeringCalculationRequest,
    ParameterInput,
)
from contracts.result import (
    CalculationError,
    CalculationMetadata,
    EngineeringCalculationResult,
    ResultStatus,
)
from engine.registry import (
    ModuleNotAvailableError,
    ModuleNotFoundError,
    get_registry,
)
from engine.validator import ParameterSpec, validate_inputs

# --- Server Configuration ---
WORKSPACE_ROOT = os.environ.get(
    "WORKSPACE_ROOT",
    os.path.dirname(_workspace_dir),
)
OUTPUT_DIR = os.environ.get(
    "OUTPUT_DIR",
    os.path.join(WORKSPACE_ROOT, "output"),
)

# --- Initialize MCP Server ---
mcp = MCPServer(
    "engineering-workspace",
    version="0.1.0",
    instructions=(
        "Engineering Workspace for MechanicalBKA. "
        "Provides deterministic engineering calculations, "
        "Excel workbook generation, LaTeX reports, and "
        "EngineeringPaper.xyz file export. "
        "AI orchestrates; Python calculates. "
        "AI must NEVER perform engineering calculations directly."
    ),
)


@mcp.tool()
def list_calculation_modules(
    category: str | None = None,
    include_planned: bool = True,
) -> str:
    """
    List available engineering calculation modules.

    Args:
        category: Filter by category (e.g., 'transmission', 'shaft', 'bearing', 'fastener').
        include_planned: If True, include modules with PLANNED status.

    Returns:
        JSON list of module metadata.
    """
    registry = get_registry()
    from engine.registry import ModuleCategory, ModuleStatus

    cat = None
    if category:
        try:
            cat = ModuleCategory(category)
        except ValueError:
            valid = [c.value for c in ModuleCategory]
            return json.dumps({
                "error": f"Invalid category '{category}'. Valid: {valid}",
                "error_vi": f"Danh mục '{category}' không hợp lệ. Hợp lệ: {valid}",
            }, ensure_ascii=False)

    modules = registry.list_modules(category=cat)

    if not include_planned:
        modules = [m for m in modules if m.status == ModuleStatus.AVAILABLE]

    return json.dumps(
        {
            "total": len(modules),
            "available": sum(1 for m in modules if m.status == ModuleStatus.AVAILABLE),
            "planned": sum(1 for m in modules if m.status == ModuleStatus.PLANNED),
            "modules": [m.to_dict() for m in modules],
        },
        ensure_ascii=False,
        indent=2,
    )


@mcp.tool()
def validate_calculation_request(
    calculation_type: str,
    inputs: str,
) -> str:
    """
    Validate engineering calculation inputs before running.

    Args:
        calculation_type: Module ID (e.g., 'shaft_design', 'gear_design').
        inputs: JSON string of input parameters. Each key maps to
                {"value": <number>, "unit": "<unit_string>"}.

    Returns:
        JSON validation result with is_valid flag and any errors.
    """
    registry = get_registry()

    # Check module exists
    try:
        module = registry.get_module(calculation_type)
    except ModuleNotFoundError as e:
        return json.dumps({
            "is_valid": False,
            "error": str(e),
            "available_modules": e.available,
        }, ensure_ascii=False)

    # Parse inputs
    try:
        parsed_inputs = json.loads(inputs) if isinstance(inputs, str) else inputs
    except json.JSONDecodeError as e:
        return json.dumps({
            "is_valid": False,
            "error": f"Invalid JSON inputs: {e}",
            "error_vi": f"Dữ liệu đầu vào JSON không hợp lệ: {e}",
        }, ensure_ascii=False)

    # Build specs from module metadata
    specs = []
    for inp in module.required_inputs:
        specs.append(ParameterSpec(
            name=inp.name,
            required=True,
            unit_dimension=inp.unit_dimension,
            min_value=inp.min_value,
            max_value=inp.max_value,
            description=inp.description,
            description_vi=inp.description_vi,
        ))
    for inp in module.optional_inputs:
        specs.append(ParameterSpec(
            name=inp.name,
            required=False,
            unit_dimension=inp.unit_dimension,
            default_value=inp.default_value,
            default_unit=inp.default_unit,
            description=inp.description,
            description_vi=inp.description_vi,
        ))

    result = validate_inputs(parsed_inputs, specs)

    return json.dumps({
        "is_valid": result.is_valid,
        "module": calculation_type,
        "module_status": module.status.value,
        "validated_inputs": result.validated_inputs,
        "errors": [
            {
                "parameter": err.parameter,
                "code": err.code,
                "message": err.message,
                "message_vi": err.message_vi,
                "details": err.details,
            }
            for err in result.errors
        ],
    }, ensure_ascii=False, indent=2)


@mcp.tool()
def calculate(
    calculation_type: str,
    inputs: str,
    title: str | None = None,
    project_id: str | None = None,
    language: str = "vi",
) -> str:
    """
    Execute an engineering calculation.

    The AI agent calls this tool after structuring the user's engineering
    requirement into parameters. The Python engine validates inputs and
    runs deterministic calculations. The AI must NEVER calculate values itself.

    Args:
        calculation_type: Module ID (e.g., 'shaft_design').
        inputs: JSON string of input parameters.
                Each key maps to {"value": <number>, "unit": "<unit_string>"}.
        title: Calculation title (e.g., 'Thiết kế trục I').
        project_id: Project identifier.
        language: Report language ('vi' or 'en').

    Returns:
        JSON EngineeringCalculationResult.
    """
    registry = get_registry()

    # Check module exists
    try:
        module = registry.get_module(calculation_type)
    except ModuleNotFoundError as e:
        return json.dumps(
            EngineeringCalculationResult(
                calculation_type=calculation_type,
                status=ResultStatus.ERROR,
                errors=[CalculationError(
                    code="MODULE_NOT_FOUND",
                    message=str(e),
                )],
            ).model_dump(mode="json"),
            ensure_ascii=False,
            indent=2,
        )

    # Check module is available
    try:
        # Parse inputs
        parsed_inputs = json.loads(inputs) if isinstance(inputs, str) else inputs
        param_inputs = {
            k: ParameterInput(value=v["value"], unit=v["unit"])
            for k, v in parsed_inputs.items()
        }

        request = EngineeringCalculationRequest(
            calculation_type=calculation_type,
            inputs=param_inputs,
            title=title,
            project_id=project_id,
        )

        result = registry.execute(calculation_type, request)
        return json.dumps(
            result.model_dump(mode="json"),
            ensure_ascii=False,
            indent=2,
        )

    except ModuleNotAvailableError as e:
        return json.dumps(
            EngineeringCalculationResult(
                calculation_type=calculation_type,
                status=ResultStatus.ERROR,
                errors=[CalculationError(
                    code="MODULE_NOT_AVAILABLE",
                    message=str(e),
                )],
                metadata=CalculationMetadata(
                    calculation_module=calculation_type,
                ),
            ).model_dump(mode="json"),
            ensure_ascii=False,
            indent=2,
        )
    except Exception as e:
        return json.dumps(
            EngineeringCalculationResult(
                calculation_type=calculation_type,
                status=ResultStatus.ERROR,
                errors=[CalculationError(
                    code="CALCULATION_ERROR",
                    message=f"Lỗi tính toán: {e} (Calculation error: {e})",
                )],
            ).model_dump(mode="json"),
            ensure_ascii=False,
            indent=2,
        )


@mcp.tool()
def generate_excel(
    calculation_result: str,
    template: str | None = None,
) -> str:
    """
    Generate an Excel workbook from a calculation result.

    NOT IMPLEMENTED in Phase 14B.

    The Excel builder will automatically create:
    - Input sheet (validated parameters)
    - Calculation sheet (step-by-step formulas)
    - Result sheet (final values + PASS/FAIL checks)
    - Engineering notes and references

    The user NEVER manually operates Excel.

    Args:
        calculation_result: JSON EngineeringCalculationResult.
        template: Optional template name.

    Returns:
        JSON with file path or error.
    """
    return json.dumps({
        "status": "not_implemented",
        "message": "Excel generation chưa được triển khai trong Phase 14B.",
        "message_en": "Excel generation not implemented in Phase 14B.",
        "planned_phase": "14D",
        "architecture": {
            "library": "openpyxl",
            "sheets": [
                "THÔNG SỐ ĐẦU VÀO (Input Parameters)",
                "TÍNH TOÁN (Calculation Steps)",
                "KẾT QUẢ (Results + PASS/FAIL)",
                "GIẢ THIẾT & TIÊU CHUẨN (Assumptions & References)",
            ],
            "principle": "Excel is an OUTPUT FORMAT. Python is the source of truth.",
        },
    }, ensure_ascii=False, indent=2)


@mcp.tool()
def generate_report(
    calculation_result: str,
    format: str = "latex",
) -> str:
    """
    Generate a LaTeX/PDF report from a calculation result.

    NOT IMPLEMENTED in Phase 14B.

    Args:
        calculation_result: JSON EngineeringCalculationResult.
        format: Output format ('latex', 'pdf', 'markdown').

    Returns:
        JSON with file path or error.
    """
    return json.dumps({
        "status": "not_implemented",
        "message": "Tạo báo cáo chưa được triển khai trong Phase 14B.",
        "message_en": "Report generation not implemented in Phase 14B.",
        "planned_phase": "14E",
    }, ensure_ascii=False, indent=2)


@mcp.tool()
def export_epxyz(
    calculation_result: str,
) -> str:
    """
    Export calculation result to EngineeringPaper.xyz format (.epxyz).

    NOT IMPLEMENTED in Phase 14B.

    Args:
        calculation_result: JSON EngineeringCalculationResult.

    Returns:
        JSON with file path or error.
    """
    return json.dumps({
        "status": "not_implemented",
        "message": "Xuất file .epxyz chưa được triển khai trong Phase 14B.",
        "message_en": "EngineeringPaper.xyz export not implemented in Phase 14B.",
        "planned_phase": "14H",
    }, ensure_ascii=False, indent=2)


# --- Entry point ---
if __name__ == "__main__":
    mcp.run(transport="stdio")
