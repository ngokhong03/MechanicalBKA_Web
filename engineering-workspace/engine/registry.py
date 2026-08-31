"""
Calculation Module Registry — Plugin-style module management.

Design:
    - Modules are registered with metadata
    - Only registered modules can be invoked (security allowlist)
    - Modules expose their input/output specifications
    - New modules can be added without modifying the MCP server

Security:
    - No eval/exec
    - No dynamic code loading from user input
    - Only explicitly registered Python functions can execute
"""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Callable

from contracts.request import EngineeringCalculationRequest
from contracts.result import EngineeringCalculationResult


class ModuleStatus(str, Enum):
    """Status of a calculation module."""
    AVAILABLE = "available"
    PLANNED = "planned"
    DEPRECATED = "deprecated"
    TESTING = "testing"


class ModuleCategory(str, Enum):
    """Category of calculation modules."""
    TRANSMISSION = "transmission"  # Bộ truyền
    SHAFT = "shaft"  # Trục
    BEARING = "bearing"  # Ổ lăn
    FASTENER = "fastener"  # Chi tiết ghép
    COUPLING = "coupling"  # Khớp nối
    GENERAL = "general"  # Tổng quát


@dataclass
class InputSpec:
    """Specification for a module input parameter."""
    name: str
    description: str
    description_vi: str
    unit_dimension: str  # e.g., "power", "speed", "length"
    required: bool = True
    default_value: float | None = None
    default_unit: str | None = None
    min_value: float | None = None
    max_value: float | None = None


@dataclass
class OutputSpec:
    """Specification for a module output value."""
    name: str
    description: str
    description_vi: str
    unit: str


@dataclass
class ModuleInfo:
    """Metadata for a registered calculation module."""
    id: str
    name: str
    name_vi: str
    category: ModuleCategory
    version: str
    description: str
    description_vi: str
    status: ModuleStatus
    required_inputs: list[InputSpec] = field(default_factory=list)
    optional_inputs: list[InputSpec] = field(default_factory=list)
    outputs: list[OutputSpec] = field(default_factory=list)
    standards: list[str] = field(default_factory=list)
    # The actual calculation function — None for PLANNED modules
    _calculate_fn: Callable[
        [EngineeringCalculationRequest], EngineeringCalculationResult
    ] | None = field(default=None, repr=False)

    def to_dict(self) -> dict[str, Any]:
        """Convert to JSON-serializable dict (for MCP tool responses)."""
        return {
            "id": self.id,
            "name": self.name,
            "name_vi": self.name_vi,
            "category": self.category.value,
            "version": self.version,
            "description": self.description,
            "description_vi": self.description_vi,
            "status": self.status.value,
            "required_inputs": [
                {
                    "name": inp.name,
                    "description": inp.description,
                    "description_vi": inp.description_vi,
                    "unit_dimension": inp.unit_dimension,
                    "required": inp.required,
                }
                for inp in self.required_inputs
            ],
            "optional_inputs": [
                {
                    "name": inp.name,
                    "description": inp.description,
                    "description_vi": inp.description_vi,
                    "unit_dimension": inp.unit_dimension,
                    "default_value": inp.default_value,
                    "default_unit": inp.default_unit,
                }
                for inp in self.optional_inputs
            ],
            "outputs": [
                {
                    "name": out.name,
                    "description": out.description,
                    "description_vi": out.description_vi,
                    "unit": out.unit,
                }
                for out in self.outputs
            ],
            "standards": self.standards,
        }


class ModuleNotFoundError(Exception):
    """Raised when a requested calculation module is not registered."""

    def __init__(self, module_id: str, available: list[str]):
        self.module_id = module_id
        self.available = available
        super().__init__(
            f"Module tính toán '{module_id}' không tồn tại. "
            f"Các module có sẵn: {', '.join(available) if available else '(chưa có module nào)'}. "
            f"(Calculation module '{module_id}' not found)"
        )


class ModuleNotAvailableError(Exception):
    """Raised when a module exists but is not in AVAILABLE status."""

    def __init__(self, module_id: str, status: ModuleStatus):
        self.module_id = module_id
        self.status = status
        super().__init__(
            f"Module '{module_id}' có trạng thái '{status.value}' — "
            f"chưa sẵn sàng để sử dụng. "
            f"(Module '{module_id}' has status '{status.value}' — not ready for use)"
        )


class CalculationModuleRegistry:
    """
    Plugin-style registry for engineering calculation modules.

    Usage:
        registry = CalculationModuleRegistry()
        registry.register(module_info)
        modules = registry.list_modules()
        module = registry.get_module("shaft_design")
        result = registry.execute("shaft_design", request)
    """

    def __init__(self) -> None:
        self._modules: dict[str, ModuleInfo] = {}

    def register(self, module: ModuleInfo) -> None:
        """
        Register a calculation module.

        Args:
            module: Module metadata and optional calculation function.

        Raises:
            ValueError: If a module with the same ID is already registered.
        """
        if module.id in self._modules:
            raise ValueError(
                f"Module '{module.id}' đã được đăng ký. "
                f"(Module '{module.id}' is already registered)"
            )
        self._modules[module.id] = module

    def get_module(self, module_id: str) -> ModuleInfo:
        """
        Get a registered module by ID.

        Args:
            module_id: Module identifier.

        Returns:
            ModuleInfo for the requested module.

        Raises:
            ModuleNotFoundError: If module is not registered.
        """
        if module_id not in self._modules:
            raise ModuleNotFoundError(
                module_id=module_id,
                available=list(self._modules.keys()),
            )
        return self._modules[module_id]

    def list_modules(
        self,
        category: ModuleCategory | None = None,
        status: ModuleStatus | None = None,
    ) -> list[ModuleInfo]:
        """
        List registered modules, optionally filtered.

        Args:
            category: Filter by category.
            status: Filter by status.

        Returns:
            List of matching ModuleInfo objects.
        """
        modules = list(self._modules.values())

        if category is not None:
            modules = [m for m in modules if m.category == category]
        if status is not None:
            modules = [m for m in modules if m.status == status]

        return modules

    def is_available(self, module_id: str) -> bool:
        """Check if a module is registered and has AVAILABLE status."""
        if module_id not in self._modules:
            return False
        return self._modules[module_id].status == ModuleStatus.AVAILABLE

    def execute(
        self,
        module_id: str,
        request: EngineeringCalculationRequest,
    ) -> EngineeringCalculationResult:
        """
        Execute a registered calculation module.

        Args:
            module_id: Module identifier.
            request: Validated calculation request.

        Returns:
            EngineeringCalculationResult from the module.

        Raises:
            ModuleNotFoundError: If module is not registered.
            ModuleNotAvailableError: If module is not in AVAILABLE status.
        """
        module = self.get_module(module_id)

        if module.status != ModuleStatus.AVAILABLE:
            raise ModuleNotAvailableError(module_id, module.status)

        if module._calculate_fn is None:
            raise ModuleNotAvailableError(module_id, ModuleStatus.PLANNED)

        return module._calculate_fn(request)

    @property
    def module_count(self) -> int:
        """Number of registered modules."""
        return len(self._modules)

    @property
    def available_count(self) -> int:
        """Number of modules with AVAILABLE status."""
        return sum(
            1 for m in self._modules.values()
            if m.status == ModuleStatus.AVAILABLE
        )


# --- Global registry instance ---
_global_registry = CalculationModuleRegistry()


def get_registry() -> CalculationModuleRegistry:
    """Get the global module registry."""
    return _global_registry


def register_module(module: ModuleInfo) -> None:
    """Register a module in the global registry."""
    _global_registry.register(module)


def _register_planned_modules() -> None:
    """Register calculation modules in the global registry."""
    from modules.shaft_design import calculate_shaft_design

    # Shaft Design Tool — Phase 14E (Available)
    register_module(ModuleInfo(
        id="shaft_design",
        name="Shaft Design Tool",
        name_vi="Thiết kế trục",
        category=ModuleCategory.SHAFT,
        version="0.1.0",
        description="Shaft strength analysis: bending, torsion, combined stress, diameter sizing, safety factor",
        description_vi="Tính toán thiết kế trục: uốn, xoắn, mô-men tương đương, chọn đường kính tiêu chuẩn, hệ số an toàn",
        status=ModuleStatus.AVAILABLE,
        required_inputs=[
            InputSpec("P", "Transmitted power", "Công suất truyền", "power"),
            InputSpec("n", "Rotational speed", "Số vòng quay", "speed"),
        ],
        optional_inputs=[
            InputSpec("Mx", "Bending moment vertical plane", "Mô-men uốn mặt phẳng đứng", "force_length", required=False),
            InputSpec("My", "Bending moment horizontal plane", "Mô-men uốn mặt phẳng ngang", "force_length", required=False),
            InputSpec("Mb", "Resultant bending moment", "Tổng mô-men uốn", "force_length", required=False),
            InputSpec("tau_allowable", "Allowable torsional stress", "Ứng suất xoắn cho phép", "pressure", required=False, default_value=20.0, default_unit="MPa"),
            InputSpec("sigma_allowable", "Allowable stress", "Ứng suất cho phép", "pressure", required=False, default_value=63.0, default_unit="MPa"),
            InputSpec("d", "Specified shaft diameter", "Đường kính trục chỉ định", "length", required=False),
            InputSpec("material", "Material designation", "Ký hiệu vật liệu", "dimensionless", required=False),
            InputSpec("k_load", "Service / load factor", "Hệ số tải trọng", "dimensionless", required=False, default_value=1.0),
            InputSpec("min_safety_factor", "Minimum safety factor", "Hệ số an toàn tối thiểu", "dimensionless", required=False, default_value=1.5),
        ],
        outputs=[
            OutputSpec("T", "Transmitted torque", "Mô-men xoắn trên trục", "N·mm"),
            OutputSpec("d_sb", "Preliminary diameter", "Đường kính trục sơ bộ", "mm"),
            OutputSpec("d", "Selected diameter", "Đường kính trục tiêu chuẩn", "mm"),
            OutputSpec("Mb", "Resultant bending moment", "Mô-men uốn tổng hợp", "N·mm"),
            OutputSpec("Me", "Equivalent moment", "Mô-men tương đương", "N·mm"),
            OutputSpec("sigma_b", "Bending stress", "Ứng suất uốn", "MPa"),
            OutputSpec("tau", "Torsional shear stress", "Ứng suất xoắn", "MPa"),
            OutputSpec("sigma_eq", "Equivalent stress", "Ứng suất tương đương", "MPa"),
            OutputSpec("S", "Safety factor", "Hệ số an toàn", "dimensionless"),
        ],
        standards=["TCVN 1065:2004", "Trịnh Chất - Lê Văn Uyển (Tập 1, Chương 10)"],
        _calculate_fn=calculate_shaft_design,
    ))

    # Gear Design — Phase 14D+
    register_module(ModuleInfo(
        id="gear_design",
        name="Gear Design",
        name_vi="Thiết kế bộ truyền bánh răng",
        category=ModuleCategory.TRANSMISSION,
        version="0.0.1",
        description="Helical/spur gear sizing: geometry, contact stress, bending stress",
        description_vi="Tính toán bánh răng trụ: hình học, ứng suất tiếp xúc, ứng suất uốn",
        status=ModuleStatus.PLANNED,
        required_inputs=[
            InputSpec("P", "Transmitted power", "Công suất truyền", "power"),
            InputSpec("n1", "Pinion speed", "Số vòng quay bánh chủ động", "speed"),
            InputSpec("u", "Gear ratio", "Tỷ số truyền", "dimensionless"),
        ],
        outputs=[
            OutputSpec("a_w", "Center distance", "Khoảng cách trục", "mm"),
            OutputSpec("m_n", "Normal module", "Mô-đun pháp", "mm"),
        ],
        standards=["TCVN 1065:2004", "Trịnh Chất - Lê Văn Uyển"],
    ))

    # Bolt Analysis — Phase 14D+
    register_module(ModuleInfo(
        id="bolt_analysis",
        name="Bolt Analysis",
        name_vi="Phân tích bu-lông",
        category=ModuleCategory.FASTENER,
        version="0.0.1",
        description="Bolt tension, shear, preload analysis per VDI 2230",
        description_vi="Tính bu-lông: kéo, cắt, lực xiết theo VDI 2230",
        status=ModuleStatus.PLANNED,
        required_inputs=[
            InputSpec("F", "External load", "Tải trọng ngoài", "force"),
        ],
        outputs=[
            OutputSpec("d", "Bolt diameter", "Đường kính bu-lông", "mm"),
        ],
        standards=["VDI 2230", "TCVN"],
    ))

    # Bearing Selection — Phase 14D+
    register_module(ModuleInfo(
        id="bearing_selection",
        name="Bearing Selection",
        name_vi="Chọn ổ lăn",
        category=ModuleCategory.BEARING,
        version="0.0.1",
        description="Bearing life calculation, dynamic load rating per ISO 281",
        description_vi="Tính tuổi thọ ổ lăn, khả năng tải động theo ISO 281",
        status=ModuleStatus.PLANNED,
        required_inputs=[
            InputSpec("F_r", "Radial load", "Tải trọng hướng tâm", "force"),
            InputSpec("n", "Rotational speed", "Số vòng quay", "speed"),
        ],
        outputs=[
            OutputSpec("L_10h", "Basic rating life", "Tuổi thọ cơ bản", "dimensionless"),
        ],
        standards=["ISO 281", "SKF Catalog"],
    ))

    # Belt Drive — Future
    register_module(ModuleInfo(
        id="belt_drive",
        name="Belt Drive Design",
        name_vi="Thiết kế bộ truyền đai",
        category=ModuleCategory.TRANSMISSION,
        version="0.0.1",
        description="V-belt and flat belt drive analysis",
        description_vi="Tính toán bộ truyền đai thang và đai dẹt",
        status=ModuleStatus.PLANNED,
        required_inputs=[
            InputSpec("P", "Transmitted power", "Công suất truyền", "power"),
            InputSpec("n1", "Driver speed", "Số vòng quay bánh dẫn", "speed"),
        ],
        outputs=[],
        standards=["TCVN"],
    ))

    # Chain Drive — Future
    register_module(ModuleInfo(
        id="chain_drive",
        name="Chain Drive Design",
        name_vi="Thiết kế bộ truyền xích",
        category=ModuleCategory.TRANSMISSION,
        version="0.0.1",
        description="Roller chain selection and sprocket sizing",
        description_vi="Chọn xích con lăn và tính đĩa xích",
        status=ModuleStatus.PLANNED,
        required_inputs=[
            InputSpec("P", "Transmitted power", "Công suất truyền", "power"),
            InputSpec("n1", "Driver speed", "Số vòng quay đĩa dẫn", "speed"),
        ],
        outputs=[],
        standards=["TCVN"],
    ))


# Auto-register planned modules on import
_register_planned_modules()
