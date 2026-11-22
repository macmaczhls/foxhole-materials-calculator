import { Vehicles } from "../models";
import { vehicleRecipes } from "../recipes/vehicles";

/** Display names from the Vehicles enum (calculator inventory). */
export function loadLocalVehicleNames(): string[] {
  return Object.values(Vehicles).filter(
    (value): value is string => typeof value === "string"
  );
}

/**
 * Names that appear as keys in `vehicleRecipes`.
 * Useful to spot enum entries that lack recipe modules.
 */
export function loadLocalRecipeVehicleNames(): string[] {
  return [...vehicleRecipes.keys()];
}
