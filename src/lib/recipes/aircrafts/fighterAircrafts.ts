import { Materials, Vehicles, IRecipe } from "../../models";
import { createRecipe } from "../base";

// ===== FIGHTER AIRCRAFT =====

// Luminary Mk. II Harbinger (Warden Fighter Aircraft) recipes
const luminaryMkIIHarbingerRecipes: IRecipe[] = [
  // Large Assembly Station [Aircraft Assembly]:
  // 40 x Processed Construction Materials
  // 50 x Assembly Materials III
  // 50 x Assembly Materials IV
  // 2 x Rare Alloys
  // → 1 x Luminary Mk. II Harbinger
  createRecipe(
    [
      { stuff: Materials.ProcessedConstructionMaterials, count: 40 },
      { stuff: Materials.AssemblyMaterialsIII, count: 50 },
      { stuff: Materials.AssemblyMaterialsIV, count: 50 },
      { stuff: Materials.RareAlloys, count: 2 },
    ],
    [{ stuff: Vehicles.LuminaryMkIIHarbinger, count: 1 }]
  ),
];

// Daimon aK-5 "Harpy" (Colonial Heavy Fighter Aircraft) recipes
const daimonAK5HarpyRecipes: IRecipe[] = [
  // Large Assembly Station [Aircraft Assembly]:
  // 40 x Processed Construction Materials
  // 200 x Assembly Materials II
  // 50 x Assembly Materials III
  // 2 x Rare Alloys
  // → 1 x Daimon aK-5 "Harpy"
  createRecipe(
    [
      { stuff: Materials.ProcessedConstructionMaterials, count: 40 },
      { stuff: Materials.AssemblyMaterialsII, count: 200 },
      { stuff: Materials.AssemblyMaterialsIII, count: 50 },
      { stuff: Materials.RareAlloys, count: 2 },
    ],
    [{ stuff: Vehicles.DaimonAK5Harpy, count: 1 }]
  ),
];

// Toxot-902 "Blind Silver" (Colonial Fighter Aircraft) recipes
const toxot902BlindSilverRecipes: IRecipe[] = [
  // Large Assembly Station [Aircraft Assembly]:
  // 40 x Processed Construction Materials
  // 50 x Assembly Materials III
  // 50 x Assembly Materials IV
  // 2 x Rare Alloys
  // → 1 x Toxot-902 "Blind Silver"
  createRecipe(
    [
      { stuff: Materials.ProcessedConstructionMaterials, count: 40 },
      { stuff: Materials.AssemblyMaterialsIII, count: 50 },
      { stuff: Materials.AssemblyMaterialsIV, count: 50 },
      { stuff: Materials.RareAlloys, count: 2 },
    ],
    [{ stuff: Vehicles.Toxot902BlindSilver, count: 1 }]
  ),
];

export const fighterAircraftRecipes = new Map<string, IRecipe[]>([
  [Vehicles.LuminaryMkIIHarbinger, luminaryMkIIHarbingerRecipes],
  [Vehicles.DaimonAK5Harpy, daimonAK5HarpyRecipes],
  [Vehicles.Toxot902BlindSilver, toxot902BlindSilverRecipes],
]);
