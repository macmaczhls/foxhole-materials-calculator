import { Materials, Vehicles, IRecipe } from "../../models";
import { createRecipe } from "../base";

// ===== HEAVY BOMBER AIRCRAFT =====

// Tulka P4 Welkinrive (Warden Heavy Bomber Aircraft) recipes
const tulkaP4WelkinriveRecipes: IRecipe[] = [
  // Large Assembly Station [Aircraft Assembly]:
  // 60 x Steel Construction Materials
  // 25 x Assembly Materials III
  // 40 x Assembly Materials IV
  // 65 x Assembly Materials V
  // 12 x Rare Alloys
  // 10 x Thermal Shielding
  // → 1 x Tulka P4 Welkinrive
  createRecipe(
    [
      { stuff: Materials.SteelConstructionMaterials, count: 60 },
      { stuff: Materials.AssemblyMaterialsIII, count: 25 },
      { stuff: Materials.AssemblyMaterialsIV, count: 40 },
      { stuff: Materials.AssemblyMaterialsV, count: 65 },
      { stuff: Materials.RareAlloys, count: 12 },
      { stuff: Materials.ThermalShielding, count: 10 },
    ],
    [{ stuff: Vehicles.TulkaP4Welkinrive, count: 1 }]
  ),
];

// V-1 Tzykalia (Colonial Heavy Bomber Aircraft) recipes
const v1TzykaliaRecipes: IRecipe[] = [
  // Large Assembly Station [Aircraft Assembly]:
  // 60 x Steel Construction Materials
  // 25 x Assembly Materials III
  // 40 x Assembly Materials IV
  // 65 x Assembly Materials V
  // 12 x Rare Alloys
  // 10 x Thermal Shielding
  // → 1 x V-1 Tzykalia
  createRecipe(
    [
      { stuff: Materials.SteelConstructionMaterials, count: 60 },
      { stuff: Materials.AssemblyMaterialsIII, count: 25 },
      { stuff: Materials.AssemblyMaterialsIV, count: 40 },
      { stuff: Materials.AssemblyMaterialsV, count: 65 },
      { stuff: Materials.RareAlloys, count: 12 },
      { stuff: Materials.ThermalShielding, count: 10 },
    ],
    [{ stuff: Vehicles.V1Tzykalia, count: 1 }]
  ),
];

export const heavyBomberAircraftRecipes = new Map<string, IRecipe[]>([
  [Vehicles.TulkaP4Welkinrive, tulkaP4WelkinriveRecipes],
  [Vehicles.V1Tzykalia, v1TzykaliaRecipes],
]);
