import { Materials, Vehicles, IRecipe } from "../../models";
import { createRecipe } from "../base";

// ===== AMPHIBIOUS FIGHTER AIRCRAFT =====

// Tulka I1.9 White Raven (Warden Amphibious Fighter Aircraft) recipes
const tulkaI19WhiteRavenRecipes: IRecipe[] = [
  // Large Assembly Station [Aircraft Assembly]:
  // 40 x Processed Construction Materials
  // 200 x Assembly Materials II
  // 50 x Assembly Materials III
  // 2 x Rare Alloys
  // → 1 x Tulka I1.9 White Raven
  createRecipe(
    [
      { stuff: Materials.ProcessedConstructionMaterials, count: 40 },
      { stuff: Materials.AssemblyMaterialsII, count: 200 },
      { stuff: Materials.AssemblyMaterialsIII, count: 50 },
      { stuff: Materials.RareAlloys, count: 2 },
    ],
    [{ stuff: Vehicles.TulkaI19WhiteRaven, count: 1 }]
  ),
];

export const amphibiousFighterAircraftRecipes = new Map<string, IRecipe[]>([
  [Vehicles.TulkaI19WhiteRaven, tulkaI19WhiteRavenRecipes],
]);
