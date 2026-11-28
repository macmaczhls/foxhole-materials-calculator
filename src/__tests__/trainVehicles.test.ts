/**
 * Tests for Train Vehicles
 */
import { Materials, RecipeTree, IRecipe, Vehicles } from "../lib/models";
import { calculateComponents } from "../lib/services/calculateComponents";
import { RecipiesByStuff } from "../lib/recipes";
import { infantryCarRecipes } from "../lib/recipes/trains/infantryCars";
import { flatbedCarRecipes } from "../lib/recipes/trains/flatbedCars";

const allTrainVehicles = [
  Vehicles.BMSLinerunner,
  Vehicles.BMSMineseeker,
  Vehicles.BMSRailtruck,
  Vehicles.BMSOverseerSkyHauler,
  Vehicles.BMSHoldout,
  Vehicles.AegisSteelbreakerK5a,
  Vehicles.OBrienWarsmithV215,
  Vehicles.BMSTinderbox,
  Vehicles.BMSStowheel,
  Vehicles.BMSLongrider,
  Vehicles.BMSRockhold,
  Vehicles.BMSRoadhouse,
  Vehicles.BMSBlackBolt,
];

describe("Train Vehicles", () => {
  describe("Recipe availability", () => {
    test("all train vehicles have recipes defined", () => {
      allTrainVehicles.forEach((vehicle) => {
        expect(RecipiesByStuff.has(vehicle)).toBe(true);
        const recipes = RecipiesByStuff.get(vehicle);
        expect(recipes).toBeDefined();
        expect(recipes!.length).toBeGreaterThan(0);
      });
    });

    test("all train vehicle recipes have valid requirements", () => {
      allTrainVehicles.forEach((vehicle) => {
        const recipes = RecipiesByStuff.get(vehicle)!;
        recipes.forEach((recipe) => {
          expect(recipe.required.length).toBeGreaterThan(0);
          expect(recipe.required[0].count).toBeGreaterThan(0);
          expect(recipe.required[0].stuff).toBeDefined();
        });
      });
    });

    test("train vehicles are in the train vehicle recipes map", () => {
      expect(infantryCarRecipes.has(Vehicles.BMSHoldout)).toBe(true);
      expect(infantryCarRecipes.has(Vehicles.AegisSteelbreakerK5a)).toBe(true);
      expect(infantryCarRecipes.has(Vehicles.OBrienWarsmithV215)).toBe(true);
      expect(infantryCarRecipes.size).toBe(3);
      expect(flatbedCarRecipes.has(Vehicles.BMSLongrider)).toBe(true);
      expect(flatbedCarRecipes.has(Vehicles.BMSRockhold)).toBe(true);
      expect(flatbedCarRecipes.has(Vehicles.BMSRoadhouse)).toBe(true);
      expect(flatbedCarRecipes.has(Vehicles.BMSBlackBolt)).toBe(true);
      expect(flatbedCarRecipes.size).toBe(4);
    });
  });

  describe("BMS Holdout (Infantry Car)", () => {
    let bmsHoldoutRecipes: IRecipe[];
    let bmsHoldoutRecipeTree: RecipeTree;

    beforeEach(() => {
      bmsHoldoutRecipes = RecipiesByStuff.get(Vehicles.BMSHoldout)!;
      bmsHoldoutRecipeTree = {
        stuff: Vehicles.BMSHoldout,
        selectedRecipe: bmsHoldoutRecipes[0],
        recipes: bmsHoldoutRecipes,
        required: [],
      };
    });

    test("has correct large assembly station recipe requirements", () => {
      const recipe = bmsHoldoutRecipes[0];
      expect(recipe.required).toEqual([
        { stuff: Materials.ProcessedConstructionMaterials, count: 20 },
        { stuff: Materials.AssemblyMaterialsII, count: 15 },
        { stuff: Materials.AssemblyMaterialsIII, count: 5 },
      ]);
      expect(recipe.produced).toEqual([
        { stuff: Vehicles.BMSHoldout, count: 1 },
      ]);
    });

    test("has only large assembly station recipe (no mass production)", () => {
      expect(bmsHoldoutRecipes.length).toBe(1);
    });

    test("calculates components correctly for single unit", () => {
      const result = calculateComponents(bmsHoldoutRecipeTree, 1);

      expect(result.initial).toEqual([
        { stuff: Materials.ProcessedConstructionMaterials, count: 20 },
        { stuff: Materials.AssemblyMaterialsII, count: 15 },
        { stuff: Materials.AssemblyMaterialsIII, count: 5 },
      ]);
    });

    test("calculates components correctly for multiple units", () => {
      const result = calculateComponents(bmsHoldoutRecipeTree, 3);

      expect(result.initial).toEqual([
        { stuff: Materials.ProcessedConstructionMaterials, count: 60 },
        { stuff: Materials.AssemblyMaterialsII, count: 45 },
        { stuff: Materials.AssemblyMaterialsIII, count: 15 },
      ]);
    });
  });

  describe("Aegis Steelbreaker K5a (Combat Car)", () => {
    let aegisSteelbreakerK5aRecipes: IRecipe[];
    let aegisSteelbreakerK5aRecipeTree: RecipeTree;

    beforeEach(() => {
      aegisSteelbreakerK5aRecipes = RecipiesByStuff.get(
        Vehicles.AegisSteelbreakerK5a
      )!;
      aegisSteelbreakerK5aRecipeTree = {
        stuff: Vehicles.AegisSteelbreakerK5a,
        selectedRecipe: aegisSteelbreakerK5aRecipes[0],
        recipes: aegisSteelbreakerK5aRecipes,
        required: [],
      };
    });

    test("has correct large assembly station recipe requirements", () => {
      const recipe = aegisSteelbreakerK5aRecipes[0];
      expect(recipe.required).toEqual([
        { stuff: Materials.SteelConstructionMaterials, count: 30 },
        { stuff: Materials.AssemblyMaterialsI, count: 30 },
        { stuff: Materials.AssemblyMaterialsIV, count: 30 },
      ]);
      expect(recipe.produced).toEqual([
        { stuff: Vehicles.AegisSteelbreakerK5a, count: 1 },
      ]);
    });

    test("has only large assembly station recipe (no mass production)", () => {
      expect(aegisSteelbreakerK5aRecipes.length).toBe(1);
    });

    test("calculates components correctly for single unit", () => {
      const result = calculateComponents(aegisSteelbreakerK5aRecipeTree, 1);

      expect(result.initial).toEqual([
        { stuff: Materials.SteelConstructionMaterials, count: 30 },
        { stuff: Materials.AssemblyMaterialsI, count: 30 },
        { stuff: Materials.AssemblyMaterialsIV, count: 30 },
      ]);
    });

    test("calculates components correctly for multiple units", () => {
      const result = calculateComponents(aegisSteelbreakerK5aRecipeTree, 3);

      expect(result.initial).toEqual([
        { stuff: Materials.SteelConstructionMaterials, count: 90 },
        { stuff: Materials.AssemblyMaterialsI, count: 90 },
        { stuff: Materials.AssemblyMaterialsIV, count: 90 },
      ]);
    });
  });

  describe("O'Brien Warsmith v.215 (Combat Car)", () => {
    let oBrienWarsmithV215Recipes: IRecipe[];
    let oBrienWarsmithV215RecipeTree: RecipeTree;

    beforeEach(() => {
      oBrienWarsmithV215Recipes = RecipiesByStuff.get(
        Vehicles.OBrienWarsmithV215
      )!;
      oBrienWarsmithV215RecipeTree = {
        stuff: Vehicles.OBrienWarsmithV215,
        selectedRecipe: oBrienWarsmithV215Recipes[0],
        recipes: oBrienWarsmithV215Recipes,
        required: [],
      };
    });

    test("has correct large assembly station recipe requirements", () => {
      const recipe = oBrienWarsmithV215Recipes[0];
      expect(recipe.required).toEqual([
        { stuff: Materials.SteelConstructionMaterials, count: 30 },
        { stuff: Materials.AssemblyMaterialsI, count: 30 },
        { stuff: Materials.AssemblyMaterialsIV, count: 30 },
      ]);
      expect(recipe.produced).toEqual([
        { stuff: Vehicles.OBrienWarsmithV215, count: 1 },
      ]);
    });

    test("has only large assembly station recipe (no mass production)", () => {
      expect(oBrienWarsmithV215Recipes.length).toBe(1);
    });

    test("calculates components correctly for single unit", () => {
      const result = calculateComponents(oBrienWarsmithV215RecipeTree, 1);

      expect(result.initial).toEqual([
        { stuff: Materials.SteelConstructionMaterials, count: 30 },
        { stuff: Materials.AssemblyMaterialsI, count: 30 },
        { stuff: Materials.AssemblyMaterialsIV, count: 30 },
      ]);
    });

    test("calculates components correctly for multiple units", () => {
      const result = calculateComponents(oBrienWarsmithV215RecipeTree, 3);

      expect(result.initial).toEqual([
        { stuff: Materials.SteelConstructionMaterials, count: 90 },
        { stuff: Materials.AssemblyMaterialsI, count: 90 },
        { stuff: Materials.AssemblyMaterialsIV, count: 90 },
      ]);
    });
  });

  describe("BMS Longrider (Flatbed Car)", () => {
    let bmsLongriderRecipes: IRecipe[];
    let bmsLongriderRecipeTree: RecipeTree;

    beforeEach(() => {
      bmsLongriderRecipes = RecipiesByStuff.get(Vehicles.BMSLongrider)!;
      bmsLongriderRecipeTree = {
        stuff: Vehicles.BMSLongrider,
        selectedRecipe: bmsLongriderRecipes[0],
        recipes: bmsLongriderRecipes,
        required: [],
      };
    });

    test("has correct large assembly station recipe requirements", () => {
      const recipe = bmsLongriderRecipes[0];
      expect(recipe.required).toEqual([
        { stuff: Materials.ProcessedConstructionMaterials, count: 20 },
        { stuff: Materials.AssemblyMaterialsII, count: 15 },
        { stuff: Materials.AssemblyMaterialsIII, count: 10 },
      ]);
      expect(recipe.produced).toEqual([
        { stuff: Vehicles.BMSLongrider, count: 1 },
      ]);
    });

    test("has only large assembly station recipe (no mass production)", () => {
      expect(bmsLongriderRecipes.length).toBe(1);
    });

    test("calculates components correctly for single unit", () => {
      const result = calculateComponents(bmsLongriderRecipeTree, 1);

      expect(result.initial).toEqual([
        { stuff: Materials.ProcessedConstructionMaterials, count: 20 },
        { stuff: Materials.AssemblyMaterialsII, count: 15 },
        { stuff: Materials.AssemblyMaterialsIII, count: 10 },
      ]);
    });

    test("calculates components correctly for multiple units", () => {
      const result = calculateComponents(bmsLongriderRecipeTree, 3);

      expect(result.initial).toEqual([
        { stuff: Materials.ProcessedConstructionMaterials, count: 60 },
        { stuff: Materials.AssemblyMaterialsII, count: 45 },
        { stuff: Materials.AssemblyMaterialsIII, count: 30 },
      ]);
    });
  });

  describe("BMS Rockhold (Container Car)", () => {
    let bmsRockholdRecipes: IRecipe[];
    let bmsRockholdRecipeTree: RecipeTree;

    beforeEach(() => {
      bmsRockholdRecipes = RecipiesByStuff.get(Vehicles.BMSRockhold)!;
      bmsRockholdRecipeTree = {
        stuff: Vehicles.BMSRockhold,
        selectedRecipe: bmsRockholdRecipes[0],
        recipes: bmsRockholdRecipes,
        required: [],
      };
    });

    test("has correct large assembly station recipe requirements", () => {
      const recipe = bmsRockholdRecipes[0];
      expect(recipe.required).toEqual([
        { stuff: Materials.ProcessedConstructionMaterials, count: 20 },
        { stuff: Materials.AssemblyMaterialsII, count: 15 },
        { stuff: Materials.AssemblyMaterialsIII, count: 5 },
      ]);
      expect(recipe.produced).toEqual([
        { stuff: Vehicles.BMSRockhold, count: 1 },
      ]);
    });

    test("has only large assembly station recipe (no mass production)", () => {
      expect(bmsRockholdRecipes.length).toBe(1);
    });

    test("calculates components correctly for single unit", () => {
      const result = calculateComponents(bmsRockholdRecipeTree, 1);

      expect(result.initial).toEqual([
        { stuff: Materials.ProcessedConstructionMaterials, count: 20 },
        { stuff: Materials.AssemblyMaterialsII, count: 15 },
        { stuff: Materials.AssemblyMaterialsIII, count: 5 },
      ]);
    });

    test("calculates components correctly for multiple units", () => {
      const result = calculateComponents(bmsRockholdRecipeTree, 3);

      expect(result.initial).toEqual([
        { stuff: Materials.ProcessedConstructionMaterials, count: 60 },
        { stuff: Materials.AssemblyMaterialsII, count: 45 },
        { stuff: Materials.AssemblyMaterialsIII, count: 15 },
      ]);
    });
  });

  describe("BMS Roadhouse (Caboose)", () => {
    let bmsRoadhouseRecipes: IRecipe[];
    let bmsRoadhouseRecipeTree: RecipeTree;

    beforeEach(() => {
      bmsRoadhouseRecipes = RecipiesByStuff.get(Vehicles.BMSRoadhouse)!;
      bmsRoadhouseRecipeTree = {
        stuff: Vehicles.BMSRoadhouse,
        selectedRecipe: bmsRoadhouseRecipes[0],
        recipes: bmsRoadhouseRecipes,
        required: [],
      };
    });

    test("has correct large assembly station recipe requirements", () => {
      const recipe = bmsRoadhouseRecipes[0];
      expect(recipe.required).toEqual([
        { stuff: Materials.ProcessedConstructionMaterials, count: 20 },
        { stuff: Materials.AssemblyMaterialsII, count: 15 },
        { stuff: Materials.AssemblyMaterialsIII, count: 5 },
      ]);
      expect(recipe.produced).toEqual([
        { stuff: Vehicles.BMSRoadhouse, count: 1 },
      ]);
    });

    test("has only large assembly station recipe (no mass production)", () => {
      expect(bmsRoadhouseRecipes.length).toBe(1);
    });

    test("calculates components correctly for single unit", () => {
      const result = calculateComponents(bmsRoadhouseRecipeTree, 1);

      expect(result.initial).toEqual([
        { stuff: Materials.ProcessedConstructionMaterials, count: 20 },
        { stuff: Materials.AssemblyMaterialsII, count: 15 },
        { stuff: Materials.AssemblyMaterialsIII, count: 5 },
      ]);
    });

    test("calculates components correctly for multiple units", () => {
      const result = calculateComponents(bmsRoadhouseRecipeTree, 3);

      expect(result.initial).toEqual([
        { stuff: Materials.ProcessedConstructionMaterials, count: 60 },
        { stuff: Materials.AssemblyMaterialsII, count: 45 },
        { stuff: Materials.AssemblyMaterialsIII, count: 15 },
      ]);
    });
  });

  describe("BMS Black Bolt (Locomotive)", () => {
    let bmsBlackBoltRecipes: IRecipe[];
    let bmsBlackBoltRecipeTree: RecipeTree;

    beforeEach(() => {
      bmsBlackBoltRecipes = RecipiesByStuff.get(Vehicles.BMSBlackBolt)!;
      bmsBlackBoltRecipeTree = {
        stuff: Vehicles.BMSBlackBolt,
        selectedRecipe: bmsBlackBoltRecipes[0],
        recipes: bmsBlackBoltRecipes,
        required: [],
      };
    });

    test("has correct large assembly station recipe requirements", () => {
      const recipe = bmsBlackBoltRecipes[0];
      expect(recipe.required).toEqual([
        { stuff: Materials.ProcessedConstructionMaterials, count: 200 },
        { stuff: Materials.AssemblyMaterialsI, count: 60 },
        { stuff: Materials.AssemblyMaterialsIV, count: 50 },
      ]);
      expect(recipe.produced).toEqual([
        { stuff: Vehicles.BMSBlackBolt, count: 1 },
      ]);
    });

    test("has only large assembly station recipe (no mass production)", () => {
      expect(bmsBlackBoltRecipes.length).toBe(1);
    });

    test("calculates components correctly for single unit", () => {
      const result = calculateComponents(bmsBlackBoltRecipeTree, 1);

      expect(result.initial).toEqual([
        { stuff: Materials.ProcessedConstructionMaterials, count: 200 },
        { stuff: Materials.AssemblyMaterialsI, count: 60 },
        { stuff: Materials.AssemblyMaterialsIV, count: 50 },
      ]);
    });

    test("calculates components correctly for multiple units", () => {
      const result = calculateComponents(bmsBlackBoltRecipeTree, 3);

      expect(result.initial).toEqual([
        { stuff: Materials.ProcessedConstructionMaterials, count: 600 },
        { stuff: Materials.AssemblyMaterialsI, count: 180 },
        { stuff: Materials.AssemblyMaterialsIV, count: 150 },
      ]);
    });
  });

  describe("Recipe calculation integration", () => {
    test("all train vehicles can be calculated without errors", () => {
      allTrainVehicles.forEach((vehicle) => {
        const recipes = RecipiesByStuff.get(vehicle)!;
        const recipeTree: RecipeTree = {
          stuff: vehicle,
          selectedRecipe: recipes[0],
          recipes: recipes,
          required: [],
        };

        expect(() => calculateComponents(recipeTree, 1)).not.toThrow();
        const result = calculateComponents(recipeTree, 1);
        expect(result.initial.length).toBeGreaterThan(0);
      });
    });
  });
});
