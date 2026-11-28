import { Materials, Vehicles, IRecipe } from "../../models";
import { createRecipe } from "../base";

// BMS Holdout (Infantry Car) recipes
const bmsHoldoutRecipes: IRecipe[] = [
  // Large Assembly Station: 20 x Processed Construction Materials + 15 x Assembly Materials II + 5 x Assembly Materials III → 1 x BMS Holdout
  createRecipe(
    [
      { stuff: Materials.ProcessedConstructionMaterials, count: 20 },
      { stuff: Materials.AssemblyMaterialsII, count: 15 },
      { stuff: Materials.AssemblyMaterialsIII, count: 5 },
    ],
    [{ stuff: Vehicles.BMSHoldout, count: 1 }]
  ),
];

// Aegis Steelbreaker K5a (Combat Car) recipes
const aegisSteelbreakerK5aRecipes: IRecipe[] = [
  // Large Assembly Station: 30 x Steel Construction Materials + 30 x Assembly Materials I + 30 x Assembly Materials IV → 1 x Aegis Steelbreaker K5a
  createRecipe(
    [
      { stuff: Materials.SteelConstructionMaterials, count: 30 },
      { stuff: Materials.AssemblyMaterialsI, count: 30 },
      { stuff: Materials.AssemblyMaterialsIV, count: 30 },
    ],
    [{ stuff: Vehicles.AegisSteelbreakerK5a, count: 1 }]
  ),
];

// O'Brien Warsmith v.215 (Combat Car) recipes
const oBrienWarsmithV215Recipes: IRecipe[] = [
  // Large Assembly Station: 30 x Steel Construction Materials + 30 x Assembly Materials I + 30 x Assembly Materials IV → 1 x O'Brien Warsmith v.215
  createRecipe(
    [
      { stuff: Materials.SteelConstructionMaterials, count: 30 },
      { stuff: Materials.AssemblyMaterialsI, count: 30 },
      { stuff: Materials.AssemblyMaterialsIV, count: 30 },
    ],
    [{ stuff: Vehicles.OBrienWarsmithV215, count: 1 }]
  ),
];

export const infantryCarRecipes = new Map<string, IRecipe[]>([
  [Vehicles.BMSHoldout, bmsHoldoutRecipes],
  [Vehicles.AegisSteelbreakerK5a, aegisSteelbreakerK5aRecipes],
  [Vehicles.OBrienWarsmithV215, oBrienWarsmithV215Recipes],
]);
