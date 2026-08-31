# Engineering Workspace - Calculation Modules Package
"""
Calculation modules for specific engineering domains.

Each module:
    - Is registered via engine.registry
    - Receives an EngineeringCalculationRequest
    - Returns an EngineeringCalculationResult
    - Contains ONLY deterministic calculation logic
    - Does NOT call AI, does NOT use eval/exec

Available modules:
    - shaft_design: Shaft strength, equivalent moment, diameter sizing, safety factor

Planned modules:
    - gear_design: Gear geometry, stress, sizing
    - bolt_analysis: Bolt tension, shear, preload
    - bearing_selection: Bearing life, load rating
    - belt_drive: Belt tension, power, wrap angle
    - chain_drive: Chain selection, sprocket sizing
"""

from modules.shaft_design import calculate_shaft_design

__all__ = ["calculate_shaft_design"]
