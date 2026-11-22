/**
 * Wiki `vehicles.type` → local recipe module path (relative to src/lib/recipes/).
 * Unmapped types resolve to null and appear as `unmapped` in reports.
 */
export const WIKI_TYPE_CHAPTER_MAP: Record<string, string> = {
  // Armoured fighting vehicles
  "Armoured Car": "armouredFightingVehicles.ts",
  Tankette: "armouredFightingVehicles.ts",
  "Landing APC": "armouredFightingVehicles.ts",
  "Half-Track": "armouredFightingVehicles.ts",
  "Relic Armoured Car": "armouredFightingVehicles.ts",

  // Field weapons
  "Field AT Rifle": "fieldWeapons.ts",
  "Field Machine Gun": "fieldWeapons.ts",
  "Field AT Gun": "fieldWeapons.ts",
  "Field Cannon": "fieldWeapons.ts",
  "Field Artillery": "fieldWeapons.ts",
  "Field Mortar": "fieldWeapons.ts",
  "Field Launcher": "fieldWeapons.ts",
  "Heavy Field Cannon": "fieldWeapons.ts",
  "Heavy Field Gun": "fieldWeapons.ts",
  "Large Field Gun": "fieldWeapons.ts",
  "Large Field Mortar": "fieldWeapons.ts",

  // Tanks by category file
  "Scout Tank": "tanks.ts",
  "Light Tank": "lightTanks.ts",
  "Relic Light Tank": "lightTanks.ts",
  "Light Infantry Tank": "lightTanks.ts",
  "Assault Tank": "assaultTanks.ts",
  "Siege Tank": "siegeTanks.ts",
  "Destroyer Tank": "destroyerTanks.ts",
  "Battle Tank": "battleTanks.ts",
  "Cruiser Tank": "cruiserTanks.ts",
  "Super Tank": "superTanks.ts",

  // Logistics / support
  Truck: "logisticsVehicles.ts",
  "Relic Truck": "logisticsVehicles.ts",
  "Heavy-Duty Truck": "logisticsVehicles.ts",
  "Fuel Tanker": "logisticsVehicles.ts",
  "Flatbed Truck": "logisticsVehicles.ts",
  Crane: "logisticsVehicles.ts",
  "Fire Engine": "logisticsVehicles.ts",
  "Transport Bus": "logisticsVehicles.ts",
  Harvester: "logisticsVehicles.ts",
  "Concrete Truck": "logisticsVehicles.ts",
  Trailer: "trailers.ts",
  Ambulance: "ambulances.ts",
  "Construction Vehicle": "constructionVehicles.ts",
  "Advanced Construction Vehicle": "constructionVehicles.ts",
  "Light Utility Vehicle": "lightUtilityVehicles.ts",
  Motorcycle: "motorcycles.ts",
  Bicycle: "motorcycles.ts",

  // Naval
  Barge: "navalVehicles.ts",
  Freighter: "navalVehicles.ts",
  Gunboat: "navalVehicles.ts",
  Destroyer: "navalVehicles.ts",
  Battleship: "navalVehicles.ts",
  Submarine: "navalVehicles.ts",
  "Landing Ship": "navalVehicles.ts",
  "Base Ship": "navalVehicles.ts",
  "Infantry Boat": "navalVehicles.ts",
  "Siege Boat": "navalVehicles.ts",
  "Light Boat": "navalVehicles.ts",
  Motorboat: "navalVehicles.ts",
  "Mine Boat": "navalVehicles.ts",
  "Light Freighter": "navalVehicles.ts",
  "Light Frigate": "navalVehicles.ts",
  "Liquid Transport Ship": "navalVehicles.ts",
  "Resource Ship": "navalVehicles.ts",
  "Storage Ship": "navalVehicles.ts",
  Gunship: "navalVehicles.ts",

  // Trains
  "Small Train Locomotive": "trains/smallTrains.ts",
  "Small Flatbed Car": "trains/smallTrains.ts",
  "Small Box Car": "trains/smallTrains.ts",
  "Small Container Car": "trains/smallTrains.ts",
  "Small Liquid Container Car": "trains/smallTrains.ts",
  Locomotive: "trains/smallTrains.ts",
  "Large Crane": "trains/largeCranes.ts",
  "Infantry Car": "trains/infantryCars.ts",
  "Combat Car": "trains/infantryCars.ts",
  "Flatbed Car": "trains/flatbedCars.ts",
  "Container Car": "trains/flatbedCars.ts",
  Caboose: "trains/flatbedCars.ts",
  "First Aid Car": "trains/flatbedCars.ts",
  "Long-Range Artillery Car": "trains/flatbedCars.ts",

  // Aircraft
  "Amphibious Scout Aircraft": "aircrafts/amphibiousScoutAircrafts.ts",
  "Scout Aircraft": "aircrafts/amphibiousScoutAircrafts.ts",
  "Fighter Aircraft": "unmapped",
  "Amphibious Fighter Aircraft": "unmapped",
  "Torpedo Bomber Aircraft": "unmapped",
  "Dive Bomber Aircraft": "unmapped",
  "Heavy Bomber Aircraft": "unmapped",
  "Transport Aircraft": "unmapped",
  "Rocket-Armed Aircraft": "unmapped",
  "Aircraft Carrier": "unmapped",

  // Other / special
  Mech: "unmapped",
  "Relic Vehicle": "unmapped",
};

export function mapWikiTypeToChapter(wikiType: string): string | null {
  const mapped = WIKI_TYPE_CHAPTER_MAP[wikiType];
  if (!mapped || mapped === "unmapped") {
    return null;
  }
  return mapped;
}

/** True when the wiki type has no dedicated local recipe module mapping. */
export function isUnmappedWikiType(wikiType: string): boolean {
  const mapped = WIKI_TYPE_CHAPTER_MAP[wikiType];
  return mapped === undefined || mapped === "unmapped";
}
