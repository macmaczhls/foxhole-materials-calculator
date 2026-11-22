import { Vehicles } from "../models";
import { vehicleRecipes } from "../recipes/vehicles";

/** Display names from the Vehicles enum (calculator inventory). */
export function loadLocalVehicleNames(): string[] {
  // String enum: Object.values is already Vehicles[] (assignable to string[]).
  return Object.values(Vehicles);
}

/**
 * Names that appear as keys in `vehicleRecipes`.
 * Useful to spot enum entries that lack recipe modules.
 */
export function loadLocalRecipeVehicleNames(): string[] {
  return [...vehicleRecipes.keys()];
}
