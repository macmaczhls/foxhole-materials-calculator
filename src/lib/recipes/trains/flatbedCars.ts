import { Materials, Vehicles, IRecipe } from "../../models";
import { createRecipe } from "../base";

// BMS Longrider (Flatbed Car) recipes
const bmsLongriderRecipes: IRecipe[] = [
  // Large Assembly Station: 20 x Processed Construction Materials + 15 x Assembly Materials II + 10 x Assembly Materials III → 1 x BMS Longrider
  createRecipe(
    [
      { stuff: Materials.ProcessedConstructionMaterials, count: 20 },
      { stuff: Materials.AssemblyMaterialsII, count: 15 },
      { stuff: Materials.AssemblyMaterialsIII, count: 10 },
    ],
    [{ stuff: Vehicles.BMSLongrider, count: 1 }]
  ),
];

// BMS Rockhold (Container Car) recipes
const bmsRockholdRecipes: IRecipe[] = [
  // Large Assembly Station: 20 x Processed Construction Materials + 15 x Assembly Materials II + 5 x Assembly Materials III → 1 x BMS Rockhold
  createRecipe(
    [
      { stuff: Materials.ProcessedConstructionMaterials, count: 20 },
      { stuff: Materials.AssemblyMaterialsII, count: 15 },
      { stuff: Materials.AssemblyMaterialsIII, count: 5 },
    ],
    [{ stuff: Vehicles.BMSRockhold, count: 1 }]
  ),
];

// BMS Roadhouse (Caboose) recipes
const bmsRoadhouseRecipes: IRecipe[] = [
  // Large Assembly Station: 20 x Processed Construction Materials + 15 x Assembly Materials II + 5 x Assembly Materials III → 1 x BMS Roadhouse
  createRecipe(
    [
      { stuff: Materials.ProcessedConstructionMaterials, count: 20 },
      { stuff: Materials.AssemblyMaterialsII, count: 15 },
      { stuff: Materials.AssemblyMaterialsIII, count: 5 },
    ],
    [{ stuff: Vehicles.BMSRoadhouse, count: 1 }]
  ),
];

export const flatbedCarRecipes = new Map<string, IRecipe[]>([
  [Vehicles.BMSLongrider, bmsLongriderRecipes],
  [Vehicles.BMSRockhold, bmsRockholdRecipes],
  [Vehicles.BMSRoadhouse, bmsRoadhouseRecipes],
]);
