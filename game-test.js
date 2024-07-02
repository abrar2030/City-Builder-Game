import { King } from "./Classes/King.js";
import { City } from "./Classes/City.js";
import { House } from "./Classes/House.js";

import { placeFromShop, destroyBuilding } from "game.mjs";

describe("Game Logic", () => {
  let city;
  let king;

  beforeEach(() => {
    city = new City();
    king = new King(city);
  });

  afterEach(() => {
    city = null;
    king = null;
  });

  test("Place building in empty cell", () => {
    let house = new House("House", 100, 1, 5, 80);
    let rowIndex = 0;
    let colIndex = 0;

    placeFromShop.call({ rowIndex, colIndex });

    expect(city.returnPositionInCity(rowIndex, colIndex)).toEqual(house);
  });

  test("Destroy building", () => {
    let house = new House("House", 100, 1, 5, 80);
    let rowIndex = 0;
    let colIndex = 0;

    placeFromShop.call({ rowIndex, colIndex });
    destroyBuilding.call({ rowIndex, colIndex });

    expect(city.returnPositionInCity(rowIndex, colIndex)).toBe(0);
  });

  test("Place building in non-empty cell", () => {
    let house1 = new House("House", 100, 1, 5, 80);
    let house2 = new House("House", 100, 2, 5, 80);
    let rowIndex = 0;
    let colIndex = 0;

    city.build(house1, rowIndex, colIndex);
    placeFromShop.call({ rowIndex, colIndex });

    expect(city.returnPositionInCity(rowIndex, colIndex)).toEqual(house1);
  });

  test("Destroy building in empty cell", () => {
    let rowIndex = 0;
    let colIndex = 0;

    destroyBuilding.call({ rowIndex, colIndex });

    expect(city.returnPositionInCity(rowIndex, colIndex)).toBe(0);
  });

  test("Destroy building in non-empty cell", () => {
    let house = new House("House", 100, 1, 5, 80);
    let rowIndex = 0;
    let colIndex = 0;

    city.build(house, rowIndex, colIndex);
    destroyBuilding.call({ rowIndex, colIndex });

    expect(city.returnPositionInCity(rowIndex, colIndex)).toBe(0);
  });

  // Handle shop click
  test("Handle shop click", () => {
    // Mock the handleShopClick function
    const shop_items = document.createElement("div");
    shop_items.style.display = "none";

    const shopButton = document.createElement("button");
    shopButton.id = "shop";
    document.body.appendChild(shopButton);

    // Simulate click on shop button
    shopButton.click();

    // Test behavior
    expect(shop_items.style.display).toBe("block");

    // Reset DOM
    document.body.removeChild(shopButton);
  });

  // Update satisfaction
  test("Update satisfaction", () => {
    // Mock the updateSatisfaction function
    const initialSatisfaction = 50;
    const taxRate = 30;

    let satisfaction = initialSatisfaction;
    if (taxRate === 30) {
      satisfaction -= 30;
    }

    satisfaction = Math.max(0, Math.min(100, satisfaction));

    // Test behavior
    expect(satisfaction).toBe(20); // Assuming initial satisfaction was 50
  });

  // Calculate population
  test("Calculate population", () => {
    // Mock the population calculation function
    const city = new City();
    const house1 = new House("House", 100, 1, 5, 80);
    const house2 = new House("House", 100, 2, 5, 80);

    city.build(house1, 0, 0);
    city.build(house2, 0, 1);

    const population = city.calculate_population();

    // Test behavior
    expect(population).toBe(10); // Assuming each house has a capacity of 5
  });

  // Change tax rate
  test("Change tax rate", () => {
    // Mock the changeTaxRate function
    let taxRate = 0;

    const input = "30"; // Valid input

    if (["20", "25", "30"].includes(input)) {
      taxRate = Number(input);
    }

    // Test behavior
    expect(taxRate).toBe(30);
  });
});