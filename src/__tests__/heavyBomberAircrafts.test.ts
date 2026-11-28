/**
 * Tests for Heavy Bomber Aircraft
 */
import { Materials, RecipeTree, IRecipe, Vehicles } from "../lib/models";
import { calculateComponents } from "../lib/services/calculateComponents";
import { RecipiesByStuff } from "../lib/recipes";
import { heavyBomberAircraftRecipes } from "../lib/recipes/aircrafts";

describe("Heavy Bomber Aircraft", () => {
  describe("Recipe availability", () => {
    test("all heavy bomber aircraft have recipes defined", () => {
      const aircraftVehicles = [
        Vehicles.TulkaP4Welkinrive,
        Vehicles.V1Tzykalia,
      ];

      aircraftVehicles.forEach((vehicle) => {
        expect(RecipiesByStuff.has(vehicle)).toBe(true);
        const recipes = RecipiesByStuff.get(vehicle);
        expect(recipes).toBeDefined();
        expect(recipes!.length).toBeGreaterThan(0);
      });
    });

    test("all heavy bomber aircraft recipes have valid requirements", () => {
      const aircraftVehicles = [
        Vehicles.TulkaP4Welkinrive,
        Vehicles.V1Tzykalia,
      ];

      aircraftVehicles.forEach((vehicle) => {
        const recipes = RecipiesByStuff.get(vehicle)!;
        recipes.forEach((recipe) => {
          expect(recipe.required.length).toBeGreaterThan(0);
          expect(recipe.required[0].count).toBeGreaterThan(0);
          expect(recipe.required[0].stuff).toBeDefined();
        });
      });
    });

    test("heavy bomber aircraft are in the recipe map", () => {
      expect(heavyBomberAircraftRecipes.has(Vehicles.TulkaP4Welkinrive)).toBe(
        true
      );
      expect(heavyBomberAircraftRecipes.has(Vehicles.V1Tzykalia)).toBe(true);
      expect(heavyBomberAircraftRecipes.size).toBe(2);
    });
  });

  describe("Tulka P4 Welkinrive (Warden Heavy Bomber Aircraft)", () => {
    let welkinriveRecipes: IRecipe[];
    let welkinriveRecipeTree: RecipeTree;

    beforeEach(() => {
      welkinriveRecipes = RecipiesByStuff.get(Vehicles.TulkaP4Welkinrive)!;
      welkinriveRecipeTree = {
        stuff: Vehicles.TulkaP4Welkinrive,
        selectedRecipe: welkinriveRecipes[0],
        recipes: welkinriveRecipes,
        required: [],
      };
    });

    test("has correct large assembly station recipe requirements", () => {
      const recipe = welkinriveRecipes[0];
      expect(recipe.required).toEqual([
        { stuff: Materials.SteelConstructionMaterials, count: 60 },
        { stuff: Materials.AssemblyMaterialsIII, count: 25 },
        { stuff: Materials.AssemblyMaterialsIV, count: 40 },
        { stuff: Materials.AssemblyMaterialsV, count: 65 },
        { stuff: Materials.RareAlloys, count: 12 },
        { stuff: Materials.ThermalShielding, count: 10 },
      ]);
      expect(recipe.produced).toEqual([
        { stuff: Vehicles.TulkaP4Welkinrive, count: 1 },
      ]);
    });

    test("has only one recipe (no mass production)", () => {
      expect(welkinriveRecipes.length).toBe(1);
    });

    test("calculates components correctly for single unit", () => {
      const result = calculateComponents(welkinriveRecipeTree, 1);

      expect(result.initial).toEqual([
        { stuff: Materials.SteelConstructionMaterials, count: 60 },
        { stuff: Materials.AssemblyMaterialsIII, count: 25 },
        { stuff: Materials.AssemblyMaterialsIV, count: 40 },
        { stuff: Materials.AssemblyMaterialsV, count: 65 },
        { stuff: Materials.RareAlloys, count: 12 },
        { stuff: Materials.ThermalShielding, count: 10 },
      ]);
    });

    test("calculates components correctly for multiple units", () => {
      const result = calculateComponents(welkinriveRecipeTree, 3);

      expect(result.initial).toEqual([
        { stuff: Materials.SteelConstructionMaterials, count: 180 },
        { stuff: Materials.AssemblyMaterialsIII, count: 75 },
        { stuff: Materials.AssemblyMaterialsIV, count: 120 },
        { stuff: Materials.AssemblyMaterialsV, count: 195 },
        { stuff: Materials.RareAlloys, count: 36 },
        { stuff: Materials.ThermalShielding, count: 30 },
      ]);
    });
  });

  describe("V-1 Tzykalia (Colonial Heavy Bomber Aircraft)", () => {
    let tzykaliaRecipes: IRecipe[];
    let tzykaliaRecipeTree: RecipeTree;

    beforeEach(() => {
      tzykaliaRecipes = RecipiesByStuff.get(Vehicles.V1Tzykalia)!;
      tzykaliaRecipeTree = {
        stuff: Vehicles.V1Tzykalia,
        selectedRecipe: tzykaliaRecipes[0],
        recipes: tzykaliaRecipes,
        required: [],
      };
    });

    test("has correct large assembly station recipe requirements", () => {
      const recipe = tzykaliaRecipes[0];
      expect(recipe.required).toEqual([
        { stuff: Materials.SteelConstructionMaterials, count: 60 },
        { stuff: Materials.AssemblyMaterialsIII, count: 25 },
        { stuff: Materials.AssemblyMaterialsIV, count: 40 },
        { stuff: Materials.AssemblyMaterialsV, count: 65 },
        { stuff: Materials.RareAlloys, count: 12 },
        { stuff: Materials.ThermalShielding, count: 10 },
      ]);
      expect(recipe.produced).toEqual([
        { stuff: Vehicles.V1Tzykalia, count: 1 },
      ]);
    });

    test("has only one recipe (no mass production)", () => {
      expect(tzykaliaRecipes.length).toBe(1);
    });

    test("calculates components correctly for single unit", () => {
      const result = calculateComponents(tzykaliaRecipeTree, 1);

      expect(result.initial).toEqual([
        { stuff: Materials.SteelConstructionMaterials, count: 60 },
        { stuff: Materials.AssemblyMaterialsIII, count: 25 },
        { stuff: Materials.AssemblyMaterialsIV, count: 40 },
        { stuff: Materials.AssemblyMaterialsV, count: 65 },
        { stuff: Materials.RareAlloys, count: 12 },
        { stuff: Materials.ThermalShielding, count: 10 },
      ]);
    });

    test("calculates components correctly for multiple units", () => {
      const result = calculateComponents(tzykaliaRecipeTree, 2);

      expect(result.initial).toEqual([
        { stuff: Materials.SteelConstructionMaterials, count: 120 },
        { stuff: Materials.AssemblyMaterialsIII, count: 50 },
        { stuff: Materials.AssemblyMaterialsIV, count: 80 },
        { stuff: Materials.AssemblyMaterialsV, count: 130 },
        { stuff: Materials.RareAlloys, count: 24 },
        { stuff: Materials.ThermalShielding, count: 20 },
      ]);
    });
  });

  describe("Recipe calculation integration", () => {
    test("all heavy bomber aircraft can be calculated without errors", () => {
      const aircraftVehicles = [
        Vehicles.TulkaP4Welkinrive,
        Vehicles.V1Tzykalia,
      ];

      aircraftVehicles.forEach((vehicle) => {
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
