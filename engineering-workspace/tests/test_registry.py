"""
Tests for Calculation Module Registry.

Tests:
    1. Module registration
    2. Module lookup
    3. Module listing with filters
    4. Planned module detection
    5. Module not found error
    6. Module not available error
    7. Duplicate registration rejection
"""

import sys
import os

import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from engine.registry import (
    CalculationModuleRegistry,
    InputSpec,
    ModuleCategory,
    ModuleInfo,
    ModuleNotAvailableError,
    ModuleNotFoundError,
    ModuleStatus,
    OutputSpec,
    get_registry,
)


class TestModuleRegistration:
    """Tests for module registration."""

    def test_register_and_get(self):
        reg = CalculationModuleRegistry()
        module = ModuleInfo(
            id="test_module",
            name="Test Module",
            name_vi="Module thử nghiệm",
            category=ModuleCategory.GENERAL,
            version="1.0.0",
            description="Test",
            description_vi="Thử nghiệm",
            status=ModuleStatus.PLANNED,
        )
        reg.register(module)
        retrieved = reg.get_module("test_module")
        assert retrieved.id == "test_module"
        assert retrieved.name_vi == "Module thử nghiệm"

    def test_duplicate_registration_rejected(self):
        reg = CalculationModuleRegistry()
        module = ModuleInfo(
            id="dup_test",
            name="Dup", name_vi="Dup",
            category=ModuleCategory.GENERAL,
            version="1.0.0",
            description="", description_vi="",
            status=ModuleStatus.PLANNED,
        )
        reg.register(module)
        with pytest.raises(ValueError, match="đã được đăng ký"):
            reg.register(module)

    def test_module_not_found(self):
        reg = CalculationModuleRegistry()
        with pytest.raises(ModuleNotFoundError) as exc_info:
            reg.get_module("nonexistent")
        assert "nonexistent" in str(exc_info.value)

    def test_module_count(self):
        reg = CalculationModuleRegistry()
        assert reg.module_count == 0
        reg.register(ModuleInfo(
            id="m1", name="M1", name_vi="M1",
            category=ModuleCategory.GENERAL,
            version="1.0.0",
            description="", description_vi="",
            status=ModuleStatus.PLANNED,
        ))
        assert reg.module_count == 1


class TestModuleListing:
    """Tests for module listing and filtering."""

    @pytest.fixture
    def populated_registry(self):
        reg = CalculationModuleRegistry()
        reg.register(ModuleInfo(
            id="shaft", name="Shaft", name_vi="Trục",
            category=ModuleCategory.SHAFT,
            version="1.0.0",
            description="", description_vi="",
            status=ModuleStatus.PLANNED,
        ))
        reg.register(ModuleInfo(
            id="gear", name="Gear", name_vi="Bánh răng",
            category=ModuleCategory.TRANSMISSION,
            version="1.0.0",
            description="", description_vi="",
            status=ModuleStatus.PLANNED,
        ))
        reg.register(ModuleInfo(
            id="bolt", name="Bolt", name_vi="Bu-lông",
            category=ModuleCategory.FASTENER,
            version="1.0.0",
            description="", description_vi="",
            status=ModuleStatus.AVAILABLE,
            _calculate_fn=lambda req: None,  # mock
        ))
        return reg

    def test_list_all(self, populated_registry):
        modules = populated_registry.list_modules()
        assert len(modules) == 3

    def test_filter_by_category(self, populated_registry):
        modules = populated_registry.list_modules(
            category=ModuleCategory.SHAFT
        )
        assert len(modules) == 1
        assert modules[0].id == "shaft"

    def test_filter_by_status(self, populated_registry):
        modules = populated_registry.list_modules(
            status=ModuleStatus.AVAILABLE
        )
        assert len(modules) == 1
        assert modules[0].id == "bolt"

    def test_is_available(self, populated_registry):
        assert populated_registry.is_available("bolt") is True
        assert populated_registry.is_available("shaft") is False
        assert populated_registry.is_available("nonexistent") is False


class TestModuleExecution:
    """Tests for module execution."""

    def test_execute_planned_module_raises(self):
        reg = CalculationModuleRegistry()
        reg.register(ModuleInfo(
            id="planned_mod",
            name="Planned", name_vi="Dự kiến",
            category=ModuleCategory.GENERAL,
            version="1.0.0",
            description="", description_vi="",
            status=ModuleStatus.PLANNED,
        ))
        with pytest.raises(ModuleNotAvailableError):
            reg.execute("planned_mod", None)

    def test_execute_nonexistent_module_raises(self):
        reg = CalculationModuleRegistry()
        with pytest.raises(ModuleNotFoundError):
            reg.execute("nonexistent", None)


class TestGlobalRegistry:
    """Tests for the global registry with pre-registered planned modules."""

    def test_global_registry_has_planned_modules(self):
        reg = get_registry()
        assert reg.module_count >= 6  # shaft, gear, bolt, bearing, belt, chain

    def test_shaft_design_is_available(self):
        reg = get_registry()
        module = reg.get_module("shaft_design")
        assert module.status == ModuleStatus.AVAILABLE
        assert module.version == "0.1.0"
        assert module.name_vi == "Thiết kế trục"

    def test_gear_design_is_planned(self):
        reg = get_registry()
        module = reg.get_module("gear_design")
        assert module.status == ModuleStatus.PLANNED

    def test_bolt_analysis_is_planned(self):
        reg = get_registry()
        module = reg.get_module("bolt_analysis")
        assert module.status == ModuleStatus.PLANNED

    def test_bearing_selection_is_planned(self):
        reg = get_registry()
        module = reg.get_module("bearing_selection")
        assert module.status == ModuleStatus.PLANNED

    def test_all_planned_modules_have_metadata(self):
        reg = get_registry()
        for module in reg.list_modules():
            assert module.id
            assert module.name
            assert module.name_vi
            assert module.category
            assert module.version
            # to_dict should work without error
            d = module.to_dict()
            assert "id" in d
            assert "name_vi" in d

    def test_available_module_count(self):
        reg = get_registry()
        assert reg.available_count >= 1
        assert reg.is_available("shaft_design") is True

    def test_execute_planned_module_fails_gracefully(self):
        reg = get_registry()
        with pytest.raises(ModuleNotAvailableError) as exc_info:
            reg.execute("gear_design", None)
        assert "PLANNED" in str(exc_info.value) or "planned" in str(exc_info.value)

