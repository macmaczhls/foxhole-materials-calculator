/**
 * Tests for Amphibious Fighter Aircraft
 */
import { Materials, RecipeTree, IRecipe, Vehicles } from "../lib/models";
import { calculateComponents } from "../lib/services/calculateComponents";
import { RecipiesByStuff } from "../lib/recipes";
import { amphibiousFighterAircraftRecipes } from "../lib/recipes/aircrafts";

describe("Amphibious Fighter Aircraft", () => {
  describe("Recipe availability", () => {
    test("all amphibious fighter aircraft have recipes defined", () => {
      const aircraftVehicles = [Vehicles.TulkaI19WhiteRaven];

      aircraftVehicles.forEach((vehicle) => {
        expect(RecipiesByStuff.has(vehicle)).toBe(true);
        const recipes = RecipiesByStuff.get(vehicle);
        expect(recipes).toBeDefined();
        expect(recipes!.length).toBeGreaterThan(0);
      });
    });

    test("all amphibious fighter aircraft recipes have valid requirements", () => {
      const aircraftVehicles = [Vehicles.TulkaI19WhiteRaven];

      aircraftVehicles.forEach((vehicle) => {
        const recipes = RecipiesByStuff.get(vehicle)!;
        recipes.forEach((recipe) => {
          expect(recipe.required.length).toBeGreaterThan(0);
          expect(recipe.required[0].count).toBeGreaterThan(0);
          expect(recipe.required[0].stuff).toBeDefined();
        });
      });
    });

    test("amphibious fighter aircraft are in the recipe map", () => {
      expect(
        amphibiousFighterAircraftRecipes.has(Vehicles.TulkaI19WhiteRaven)
      ).toBe(true);
      expect(amphibiousFighterAircraftRecipes.size).toBe(1);
    });
  });

  describe("Tulka I1.9 White Raven (Warden Amphibious Fighter Aircraft)", () => {
    let whiteRavenRecipes: IRecipe[];
    let whiteRavenRecipeTree: RecipeTree;

    beforeEach(() => {
      whiteRavenRecipes = RecipiesByStuff.get(Vehicles.TulkaI19WhiteRaven)!;
      whiteRavenRecipeTree = {
        stuff: Vehicles.TulkaI19WhiteRaven,
        selectedRecipe: whiteRavenRecipes[0],
        recipes: whiteRavenRecipes,
        required: [],
      };
    });

    test("has correct large assembly station recipe requirements", () => {
      const recipe = whiteRavenRecipes[0];
      expect(recipe.required).toEqual([
        { stuff: Materials.ProcessedConstructionMaterials, count: 40 },
        { stuff: Materials.AssemblyMaterialsII, count: 200 },
        { stuff: Materials.AssemblyMaterialsIII, count: 50 },
        { stuff: Materials.RareAlloys, count: 2 },
      ]);
      expect(recipe.produced).toEqual([
        { stuff: Vehicles.TulkaI19WhiteRaven, count: 1 },
      ]);
    });

    test("has only one recipe (no mass production)", () => {
      expect(whiteRavenRecipes.length).toBe(1);
    });

    test("calculates components correctly for single unit", () => {
      const result = calculateComponents(whiteRavenRecipeTree, 1);

      expect(result.initial).toEqual([
        { stuff: Materials.ProcessedConstructionMaterials, count: 40 },
        { stuff: Materials.AssemblyMaterialsII, count: 200 },
        { stuff: Materials.AssemblyMaterialsIII, count: 50 },
        { stuff: Materials.RareAlloys, count: 2 },
      ]);
    });

    test("calculates components correctly for multiple units", () => {
      const result = calculateComponents(whiteRavenRecipeTree, 3);

      expect(result.initial).toEqual([
        { stuff: Materials.ProcessedConstructionMaterials, count: 120 },
        { stuff: Materials.AssemblyMaterialsII, count: 600 },
        { stuff: Materials.AssemblyMaterialsIII, count: 150 },
        { stuff: Materials.RareAlloys, count: 6 },
      ]);
    });
  });

  describe("Recipe calculation integration", () => {
    test("all amphibious fighter aircraft can be calculated without errors", () => {
      const aircraftVehicles = [Vehicles.TulkaI19WhiteRaven];

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
