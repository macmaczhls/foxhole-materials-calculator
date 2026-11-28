/**
 * Tests for Fighter Aircraft
 */
import { Materials, RecipeTree, IRecipe, Vehicles } from "../lib/models";
import { calculateComponents } from "../lib/services/calculateComponents";
import { RecipiesByStuff } from "../lib/recipes";
import { fighterAircraftRecipes } from "../lib/recipes/aircrafts";

describe("Fighter Aircraft", () => {
  describe("Recipe availability", () => {
    test("all fighter aircraft have recipes defined", () => {
      const aircraftVehicles = [
        Vehicles.LuminaryMkIIHarbinger,
        Vehicles.DaimonAK5Harpy,
        Vehicles.Toxot902BlindSilver,
      ];

      aircraftVehicles.forEach((vehicle) => {
        expect(RecipiesByStuff.has(vehicle)).toBe(true);
        const recipes = RecipiesByStuff.get(vehicle);
        expect(recipes).toBeDefined();
        expect(recipes!.length).toBeGreaterThan(0);
      });
    });

    test("all fighter aircraft recipes have valid requirements", () => {
      const aircraftVehicles = [
        Vehicles.LuminaryMkIIHarbinger,
        Vehicles.DaimonAK5Harpy,
        Vehicles.Toxot902BlindSilver,
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

    test("fighter aircraft are in the recipe map", () => {
      expect(fighterAircraftRecipes.has(Vehicles.LuminaryMkIIHarbinger)).toBe(
        true
      );
      expect(fighterAircraftRecipes.has(Vehicles.DaimonAK5Harpy)).toBe(true);
      expect(fighterAircraftRecipes.has(Vehicles.Toxot902BlindSilver)).toBe(
        true
      );
      expect(fighterAircraftRecipes.size).toBe(3);
    });
  });

  describe("Luminary Mk. II Harbinger (Warden Fighter Aircraft)", () => {
    let harbingerRecipes: IRecipe[];
    let harbingerRecipeTree: RecipeTree;

    beforeEach(() => {
      harbingerRecipes = RecipiesByStuff.get(Vehicles.LuminaryMkIIHarbinger)!;
      harbingerRecipeTree = {
        stuff: Vehicles.LuminaryMkIIHarbinger,
        selectedRecipe: harbingerRecipes[0],
        recipes: harbingerRecipes,
        required: [],
      };
    });

    test("has correct large assembly station recipe requirements", () => {
      const recipe = harbingerRecipes[0];
      expect(recipe.required).toEqual([
        { stuff: Materials.ProcessedConstructionMaterials, count: 40 },
        { stuff: Materials.AssemblyMaterialsIII, count: 50 },
        { stuff: Materials.AssemblyMaterialsIV, count: 50 },
        { stuff: Materials.RareAlloys, count: 2 },
      ]);
      expect(recipe.produced).toEqual([
        { stuff: Vehicles.LuminaryMkIIHarbinger, count: 1 },
      ]);
    });

    test("has only one recipe (no mass production)", () => {
      expect(harbingerRecipes.length).toBe(1);
    });

    test("calculates components correctly for single unit", () => {
      const result = calculateComponents(harbingerRecipeTree, 1);

      expect(result.initial).toEqual([
        { stuff: Materials.ProcessedConstructionMaterials, count: 40 },
        { stuff: Materials.AssemblyMaterialsIII, count: 50 },
        { stuff: Materials.AssemblyMaterialsIV, count: 50 },
        { stuff: Materials.RareAlloys, count: 2 },
      ]);
    });

    test("calculates components correctly for multiple units", () => {
      const result = calculateComponents(harbingerRecipeTree, 3);

      expect(result.initial).toEqual([
        { stuff: Materials.ProcessedConstructionMaterials, count: 120 },
        { stuff: Materials.AssemblyMaterialsIII, count: 150 },
        { stuff: Materials.AssemblyMaterialsIV, count: 150 },
        { stuff: Materials.RareAlloys, count: 6 },
      ]);
    });
  });

  describe('Daimon aK-5 "Harpy" (Colonial Heavy Fighter Aircraft)', () => {
    let harpyRecipes: IRecipe[];
    let harpyRecipeTree: RecipeTree;

    beforeEach(() => {
      harpyRecipes = RecipiesByStuff.get(Vehicles.DaimonAK5Harpy)!;
      harpyRecipeTree = {
        stuff: Vehicles.DaimonAK5Harpy,
        selectedRecipe: harpyRecipes[0],
        recipes: harpyRecipes,
        required: [],
      };
    });

    test("has correct large assembly station recipe requirements", () => {
      const recipe = harpyRecipes[0];
      expect(recipe.required).toEqual([
        { stuff: Materials.ProcessedConstructionMaterials, count: 40 },
        { stuff: Materials.AssemblyMaterialsII, count: 200 },
        { stuff: Materials.AssemblyMaterialsIII, count: 50 },
        { stuff: Materials.RareAlloys, count: 2 },
      ]);
      expect(recipe.produced).toEqual([
        { stuff: Vehicles.DaimonAK5Harpy, count: 1 },
      ]);
    });

    test("has only one recipe (no mass production)", () => {
      expect(harpyRecipes.length).toBe(1);
    });

    test("calculates components correctly for single unit", () => {
      const result = calculateComponents(harpyRecipeTree, 1);

      expect(result.initial).toEqual([
        { stuff: Materials.ProcessedConstructionMaterials, count: 40 },
        { stuff: Materials.AssemblyMaterialsII, count: 200 },
        { stuff: Materials.AssemblyMaterialsIII, count: 50 },
        { stuff: Materials.RareAlloys, count: 2 },
      ]);
    });

    test("calculates components correctly for multiple units", () => {
      const result = calculateComponents(harpyRecipeTree, 2);

      expect(result.initial).toEqual([
        { stuff: Materials.ProcessedConstructionMaterials, count: 80 },
        { stuff: Materials.AssemblyMaterialsII, count: 400 },
        { stuff: Materials.AssemblyMaterialsIII, count: 100 },
        { stuff: Materials.RareAlloys, count: 4 },
      ]);
    });
  });

  describe('Toxot-902 "Blind Silver" (Colonial Fighter Aircraft)', () => {
    let blindSilverRecipes: IRecipe[];
    let blindSilverRecipeTree: RecipeTree;

    beforeEach(() => {
      blindSilverRecipes = RecipiesByStuff.get(Vehicles.Toxot902BlindSilver)!;
      blindSilverRecipeTree = {
        stuff: Vehicles.Toxot902BlindSilver,
        selectedRecipe: blindSilverRecipes[0],
        recipes: blindSilverRecipes,
        required: [],
      };
    });

    test("has correct large assembly station recipe requirements", () => {
      const recipe = blindSilverRecipes[0];
      expect(recipe.required).toEqual([
        { stuff: Materials.ProcessedConstructionMaterials, count: 40 },
        { stuff: Materials.AssemblyMaterialsIII, count: 50 },
        { stuff: Materials.AssemblyMaterialsIV, count: 50 },
        { stuff: Materials.RareAlloys, count: 2 },
      ]);
      expect(recipe.produced).toEqual([
        { stuff: Vehicles.Toxot902BlindSilver, count: 1 },
      ]);
    });

    test("has only one recipe (no mass production)", () => {
      expect(blindSilverRecipes.length).toBe(1);
    });

    test("calculates components correctly for single unit", () => {
      const result = calculateComponents(blindSilverRecipeTree, 1);

      expect(result.initial).toEqual([
        { stuff: Materials.ProcessedConstructionMaterials, count: 40 },
        { stuff: Materials.AssemblyMaterialsIII, count: 50 },
        { stuff: Materials.AssemblyMaterialsIV, count: 50 },
        { stuff: Materials.RareAlloys, count: 2 },
      ]);
    });

    test("calculates components correctly for multiple units", () => {
      const result = calculateComponents(blindSilverRecipeTree, 5);

      expect(result.initial).toEqual([
        { stuff: Materials.ProcessedConstructionMaterials, count: 200 },
        { stuff: Materials.AssemblyMaterialsIII, count: 250 },
        { stuff: Materials.AssemblyMaterialsIV, count: 250 },
        { stuff: Materials.RareAlloys, count: 10 },
      ]);
    });
  });

  describe("Recipe calculation integration", () => {
    test("all fighter aircraft can be calculated without errors", () => {
      const aircraftVehicles = [
        Vehicles.LuminaryMkIIHarbinger,
        Vehicles.DaimonAK5Harpy,
        Vehicles.Toxot902BlindSilver,
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
