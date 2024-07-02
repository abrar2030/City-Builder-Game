import { King } from "./Classes/King.js";
import { City } from "./Classes/City.js";
import { House } from "./Classes/House.js";
import { Roads } from "./Classes/Roads.js";
import { Forest } from "./Classes/Forest.js";
import { RoyalForges } from "./Classes/RoyalForges.js";
import { RoyalShipyards } from "./Classes/RoyalShipyards.js";
import { Colosseum } from "./Classes/Colosseum.js";
import { Zone } from "./Classes/Zone.js"
import { Knights } from "./Classes/Knights.js";
import { Residential } from "./Classes/Residential.js";

let house_count = 0;
let Ship_count =0;
let Forge_count =0;
let knights_count =0;
let road_count = 0;
let pauseStartTime;
let totalPausedTime = 0;
let pause = false;


let service_workers = document.querySelector("p#service_workplaces");
let industrial_workers = document.querySelector("p#industrial_workplaces");

let pause_button = document.querySelector("button#Pause");
let div_for_images = document.querySelector("div#shop_items");
let table = document.querySelector("table");
let shop = document.querySelector("button#shop");
let shop_items = document.querySelector("div#shop_items");
let cash = document.querySelector("p#money");
let name_of_build = null;
let money = 1000;
// Game speed and satisfaction initialization
let gameSpeed = 1; // Normal speed
const gameSpeeds = [0.25, 1, 8]; // Game speed options
let gameSpeedIndex = 1; // Start at normal speed
let taxRate = 10; // Default tax rate
let satisfaction_p = document.querySelector("p#satisfaction");
let satisfaction = 50; // Default satisfaction level

//Population(starting at 0)
let population_p = document.querySelector("p#population");
let population = 0;

//matrixData for representing the table
//Idea: php has a temp saved_games json. Where the temporary one goes
//we initialise the 

const buildingTypes = {
  House: { name: "House", imageUrl: "images/house", color: "red", price: 100 },
  Forest: { name: "Forest", imageUrl: "images/forest.png", color: "green", price: 150 },
  Roads: { name: "Roads", imageUrl: "images/road.jpg", color: "black", price: 50 },
  RoyalForges: { name: "Royal Forges", imageUrl: "images/royal_forges.png", color: "gold", price: 300 },
  RoyalShipyards: { name: "Royal Shipyards", imageUrl: "images/royal_shipyards.png", color: "blue", price: 250 },
  Knights: {name: "Knights", imageUrl: "images/knights.png", color: "pink", price: 230 },
  Colosseum: { name: "Colosseum", imageUrl: "images/colosseum.jpg", color: "gray", price: 200 },
  Colosseum1: { name: "Colosseum", imageUrl: "images/colosseum1.jpg", color: "gray", price: 200 },
  Colosseum2: { name: "Colosseum", imageUrl: "images/colosseum2.jpg", color: "gray", price: 200 },
  Colosseum3: { name: "Colosseum", imageUrl: "images/colosseum3.jpg", color: "gray", price: 200 },
  Colosseum4: { name: "Colosseum", imageUrl: "images/colosseum4.jpg", color: "gray", price: 200 }
};


const upgradeTypes = {
  House: { newType: "Mansion", newImageUrl: "images/mansion1.png", newColor: "darkred" },
  RoyalForges: { newType: "Forges", newImageUrl: "images/forgesupgrade.png", newColor: "darkgreen" },
  RoyalShipyards: { newType: "Ship", newImageUrl: "images/bigship.png", newColor: "darkgreen" },
};

let upgradeMode = false;
let upgradeButton = document.createElement("button");
upgradeButton.textContent = "Enable Upgrade Mode";
document.body.appendChild(upgradeButton);

upgradeButton.addEventListener("click", function() {
    upgradeMode = !upgradeMode; // Toggle upgrade mode on or off
    upgradeButton.textContent = upgradeMode ? "Disable Upgrade Mode" : "Enable Upgrade Mode";
    upgradeButton.style.backgroundColor = upgradeMode ? "blue" : "";
});
function upgradeBuilding(cell) {
  let rowIndex = cell.parentNode.rowIndex;
  let colIndex = cell.cellIndex;

  if (matrixData[rowIndex][colIndex] && upgradeTypes[matrixData[rowIndex][colIndex].type]) {
      if (confirm("Are you sure you want to upgrade this building?")) {
          let building = matrixData[rowIndex][colIndex];
          let upgradeInfo = upgradeTypes[building.type];
          Player.City.getTypeOfZone(rowIndex, colIndex).upgrade();
          console.log(building);

          // Safely update matrixData with new building info
          //building.type = upgradeInfo.newType;
          building.imageUrl = upgradeInfo.newImageUrl;
          building.color = upgradeInfo.newColor;

          // Find or create the <img> element in the cell
          let img = cell.querySelector('img');
          if (!img) {
              img = document.createElement('img');
              cell.appendChild(img);
              img.style.width = '100%';
              img.style.height = 'auto';
          }
          img.src = building.imageUrl;
          cell.style.backgroundColor = building.color;
      }
  } else {
      console.error("No upgradable building in this cell.");
  }
}





function loadTable() {
  var numRows = 10;
  var numCols = 23;
  
  if (matrixData == null) {
    matrixData = new Array(numRows).fill().map(() => new Array(numCols).fill(0));
  }

  // Clear existing table rows
  while (table.rows.length > 0) {
    table.deleteRow(0);
  }

  // Populate table
  for (var i = 0; i < numRows; i++) {
    var row = table.insertRow(-1); // Append at the end of the table
    for (var j = 0; j < numCols; j++) {
      var cell = row.insertCell(-1); // Append at the end of the row
      let img = document.createElement('img');
      img.style.width = '100%'; // Fill the cell
      img.style.height = 'auto';

      if (matrixData[i][j]) {
        if(matrixData[i][j].type != 'Colosseum'){
          img.src = buildingTypes[matrixData[i][j].type].imageUrl;
          cell.style.backgroundColor = buildingTypes[matrixData[i][j].type].color;
        }else{
          img.src = buildingTypes[matrixData[i][j].type + matrixData[i][j].order].imageUrl;
          cell.style.backgroundColor = buildingTypes[matrixData[i][j].type].color;
        }
      } else {
        img.src = 'images/default.jpg'; // Default image for uninitialized cells
        cell.style.backgroundColor = 'green';
      }
      cell.style.border = "none";
      cell.appendChild(img);
    }
  }
}

//one by one

loadTable();

function handleShopClick() {
  shop_items.style.display =
    shop_items.style.display === "none" ? "block" : "none";
}

let Player = new King(new City(matrixData));
console.log("Position of matrix: " + Player.returnPositionInCity(0,0));

// Add a variable to track the number of Colosseum buildings placed
let colosseumPlacedCount = 0;

function placeFromShop() {
  if(!pause && !destroyMode){
  var cell = this;
  var rowIndex = cell.parentNode.rowIndex;
  var colIndex = cell.cellIndex;
  let new_class_for_matrix = null;
  let new_class_for_matrix_second = null;
  switch (name_of_build) {
    case "Residential Zone":
      if(satisfaction > 0 && house_count < 16 && Player.City.can_build_in_fourbyfour(rowIndex,colIndex)){
        let num_to_live = Math.round(satisfaction/10);
        let pic_type = Math.floor(Math.random() * 2) + 1;
        let new_class_for_matrix = new House("House", buildingTypes["House"].price, 15, num_to_live, satisfaction, pic_type,house_count/4);
        pic_type = Math.floor(Math.random() * 2) + 1;
        let new_class_for_matrix1 = new House("House", buildingTypes["House"].price, 15, num_to_live, satisfaction,pic_type,house_count/4);
        pic_type = Math.floor(Math.random() * 2) + 1;
        let new_class_for_matrix2 = new House("House", buildingTypes["House"].price, 15, num_to_live, satisfaction,pic_type,house_count/4);
        pic_type = Math.floor(Math.random() * 2) + 1;
        let new_class_for_matrix3 = new House("House", buildingTypes["House"].price, 15, num_to_live, satisfaction,pic_type,house_count/4);

        house_count += 4; // Increment the house count by 4

        matrixData[rowIndex][colIndex] = new_class_for_matrix;          // (rowIndex, colIndex)
        matrixData[rowIndex][colIndex + 1] = new_class_for_matrix1;     // (rowIndex, colIndex + 1)
        matrixData[rowIndex + 1][colIndex] = new_class_for_matrix2;     // (rowIndex + 1, colIndex)
        matrixData[rowIndex + 1][colIndex + 1] = new_class_for_matrix3; // (rowIndex + 1, colIndex + 1)        house_count += 4;

      }else{
        alert("You can only place 4 zones and it should be possible to place them(make sure people arent dissatisfied");
        return;   

      }
      break;
    case "Forest":
      new_class_for_matrix = new Forest("Forest", buildingTypes["Forest"].price,100,0);
      break;
    case "Colosseum":
      // Check if the placement count is less than the limit
      if (colosseumPlacedCount < 2 ) {
        if(Player.returnPositionInCity(rowIndex,colIndex) == 0 && Player.City.can_build_in_fourbyfour(rowIndex,colIndex)){
        colosseumPlacedCount++; // Increment the placement count
        new_class_for_matrix = new Colosseum("Colosseum",buildingTypes["Colosseum"].price, 100/4, 0, 3, 10000,1.1,1, colosseumPlacedCount);
        let new_class_for_matrix1 = new Colosseum("Colosseum",buildingTypes["Colosseum"].price, 100/4, 0, 3, 10000,1.1,2,colosseumPlacedCount);
        let new_class_for_matrix2 = new Colosseum("Colosseum",buildingTypes["Colosseum"].price, 100/4, 0, 3, 10000,1.1,3,colosseumPlacedCount);
        let new_class_for_matrix3 = new Colosseum("Colosseum",buildingTypes["Colosseum"].price, 100/4, 0, 3, 10000,1.1,4,colosseumPlacedCount);

        matrixData[rowIndex][colIndex] = new_class_for_matrix;          // (startX, startY)
        matrixData[rowIndex][colIndex + 1] = new_class_for_matrix1;      // (startX, startY + 1)
        matrixData[rowIndex + 1][colIndex] = new_class_for_matrix2;      // (startX + 1, startY)
        matrixData[rowIndex + 1][colIndex + 1] = new_class_for_matrix3;  // (startX + 1, startY + 1)
      }else{
          alert("You can only place the Colosseum in an empty space.");
          return;  
        }
      } else {
        // If the limit is reached, don't allow placement
        alert("You can only place the Colosseum twice.");
        return;
      }
      break;
    case "Roads":
      if(Player.City.check_if_connects_roads(road_count,rowIndex, colIndex)){
        road_count += 1;
        new_class_for_matrix = new Roads("Roads", buildingTypes["Roads"].price, 0, 200);
      }else{
        alert("The roads need to be connected!");
        return;
      }
      break;
    case "RoyalForges":
      if(Forge_count < 3){
      new_class_for_matrix = new RoyalForges("RoyalForges", buildingTypes["RoyalForges"].price,100,0);
        Forge_count++;
    }
      break;
    case "RoyalShipyards":
      if(Ship_count < 3){
      new_class_for_matrix = new RoyalShipyards("RoyalShipyards", buildingTypes["RoyalShipyards"].price, 100,0 );
        Ship_count++;
    }
      break;
    case "Knights":
      if(knights_count < 3){
      new_class_for_matrix = new Knights("Knights", buildingTypes["Knights"].price, 100, 0,3,10000, 1.1);
      //constructor(type, cost, uniqueID, amountOfWorkers, radius, maintenance fee)
      }
    default:
      // Handle other cases if needed
  }
  console.log(matrixData);
  // Only proceed if a building class is created
  if (new_class_for_matrix && name_of_build != 'Colosseum' && name_of_build != 'House') {
    if(Player.returnPositionInCity(rowIndex,colIndex) == 0){
    Player.build(new_class_for_matrix, rowIndex, colIndex);
    matrixData[rowIndex][colIndex] = new_class_for_matrix;
    money -= 1*buildingTypes[new_class_for_matrix.type].price;
    cash.innerText = `💰: ${money} $`;

    // Update the table after placement
    updateTable();
    }
  }
}
}

function separate_into_zones(){
  var numRows = 10;
var numCols = 23;

var middleCol = Math.floor(numCols / 2);

var middleRow = Math.floor(numRows / 2);

/*
for (var j = 0; j < numCols; j++) {
    matrixData[middleRow][j] = new Roads("Roads", buildingTypes["Roads"].price, 0, 200);; // You can use any character to represent the line
}
for (var j = middleRow; j < numRows; j++) {
  matrixData[j][middleCol] = new Roads("Roads", buildingTypes["Roads"].price, 0, 200);; // You can use any character to represent the line
}
*/
console.log(matrixData);

}
//separate_into_zones();
//make it so that people will go to work if there are jobs available
//make a function to put all references of the jobs in arrays. Service or ind
//Go through each. Fill the service, fill the industrial. One by one. As long as there are still people and space to work.
//Another function to know if there are enough spaces to work. In the city class? Also make a tax collection thing from every place. 

function delegate(parent, type, selector, handler) {
  parent.addEventListener(type, function(event) {
      const targetElement = event.target.closest(selector);
      if (targetElement && this.contains(targetElement)) {
          handler.call(targetElement, event);
      }
  });
}

// Toggle event handling based on the current mode
delegate(table, "click", "td", function(event) {
  if(!pause){
  if (upgradeMode) {
      upgradeBuilding(this);
  } else if (destroyMode) {
      destroyBuilding(this);
  } else {
      placeFromShop.call(this, event);
  }
}
});




let destroyMode = false;
let destroyButton = document.createElement("button");
destroyButton.textContent = "Enable Destroy Mode";
document.body.appendChild(destroyButton);

destroyButton.addEventListener("click", function() {
    destroyMode = !destroyMode; // Toggle destroy mode on or off
    destroyButton.textContent = destroyMode ? "Disable Destroy Mode" : "Enable Destroy Mode";
    destroyButton.style.backgroundColor = destroyMode ? "red" : "";
});

function destroyBuilding(cell) {
  if (!pause) {
    let rowIndex = cell.parentNode.rowIndex;
    let colIndex = cell.cellIndex;

    // Check if there is a building in the cell
    if (matrixData[rowIndex][colIndex] && matrixData[rowIndex][colIndex].type !== 'Colosseum' && matrixData[rowIndex][colIndex].type !== 'Roads') {
      if (confirm("Are you sure you want to remove this building?")) {
        //if(matrixData[rowIndex][colIndex].type != 'House'){
        matrixData[rowIndex][colIndex] = 0; // Remove the building from matrixData
        updateTable(); // Update the table to reflect the change
        console.log("Building removed successfully.");
        //}else{
          //Player.City.destroy_house(matrixData[rowIndex][colIndex].count);
          //house_count -= 4;
        //}
      }
    } else if (matrixData[rowIndex][colIndex] && matrixData[rowIndex][colIndex].type === 'Colosseum') {
      if (confirm("Are you sure you want to remove this building?")) {
        Player.City.destroy_colosseum(matrixData[rowIndex][colIndex].count);
        matrixData[rowIndex][colIndex] = 0; // Remove the colosseum from matrixData
        colosseumPlacedCount -= 1; // Decrement the colosseum placed count
        updateTable(); // Update the table to reflect the change
        console.log("Colosseum removed successfully.");
      }
    } else if (matrixData[rowIndex][colIndex] && matrixData[rowIndex][colIndex].type === 'Roads' && Player.City.isValidDestroyRoad(rowIndex, colIndex)) {
      if (confirm("Are you sure you want to remove this road?")) {
        matrixData[rowIndex][colIndex] = 0; // Remove the road from matrixData
        road_count -= 1; // Decrement the road count
        updateTable(); // Update the table to reflect the change
        console.log("Road removed successfully.");
      }
    } else {
      console.log("No building to remove in this cell or invalid action.");
    }
  }
}


let hasBeenSelected = false;
let previousSelected = null;

function imageClicked(){
  let newSelected = this;
  if (hasBeenSelected) {
    previousSelected.style.backgroundColor = "";
  }
  previousSelected = newSelected;
  hasBeenSelected = true;
  newSelected.style.backgroundColor = "green";
  name_of_build = this.id;
}


function updateRealTime(){
  let currentTime = new Date();
  let elapsedTime = currentTime - startTime - totalPausedTime;  

  // Calculate elapsed time components
  let seconds = Math.floor(elapsedTime / (1000)) % 60;
  let minutes = Math.floor(elapsedTime / (1000 * 60)) % 60;
  let hours = Math.floor(elapsedTime / (1000 * 60 * 60)) % 24;
  let days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));

  // Format and display current date and time
  let year = currentTime.getFullYear();
  let month = currentTime.getMonth() + 1;  // Month is zero-indexed, so add 1
  let day = currentTime.getDate();
  let hour = currentTime.getHours();
  let minute = currentTime.getMinutes();
  let second = currentTime.getSeconds();

  let currentDateTimeText = `Current Date & Time: ${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day} ${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}:${second < 10 ? '0' + second : second}`;
  // Update the UI with the current date and elapsed time
  let actual_time = document.getElementById("actual-time");
  actual_time.innerHTML = currentDateTimeText + "<br>";

}

let startDate = new Date(); // You can set this to any specific date you want the game to start from
startDate.setHours(0, 0, 0, 0); // Normalize the time part to start at midnight

let current_time_bpause = null;
let lastMonth = startDate.getMonth();
function handleMonthChange(){
  money += Player.City.get_unemployment_count() * 100 * (taxRate / 100);
  money += (Player.City.calculate_population() - Player.City.get_unemployment_count()) * 500 * (taxRate / 100);
  console.log("Taxes have been paid!")
}

function updateElapsedTime() {

  if(!pause){
    let currentTime = new Date();
    let elapsedTime = currentTime - startTime - totalPausedTime;  
    let realElapsedTime = elapsedTime * gameSpeed;  // Scale elapsed time by the game speed factor

    // Convert real-time milliseconds to game hours, with each 1000 milliseconds representing one game hour
    let gameHoursPassed = Math.floor(realElapsedTime / 1000); // Convert milliseconds to seconds to game hours
    let gameDate = new Date(startDate.getTime());
    
    // Add the hours passed to the game date
    gameDate.setHours(startDate.getHours() + gameHoursPassed);

    // Format and display the in-game date
    let year = gameDate.getFullYear();
    let month = gameDate.getMonth() + 1; // Month is zero-indexed, so add 1
    let day = gameDate.getDate();
    let hour = gameDate.getHours();

    let currentMonth = gameDate.getMonth();
    if (currentMonth !== lastMonth) {
        // Month has changed
        console.log(`New month: ${currentMonth + 1}`);
        handleMonthChange();  // Call a function to handle the month change
        lastMonth = currentMonth;  // Update the lastMonth to the current
    }

    let dateText = `In-Game Date & Time: \n Year: ${year}, \t Month: ${month < 10 ? '0' + month : month}, \t Day: ${day < 10 ? '0' + day : day}, \t Hour: ${hour < 10 ? '0' + hour : hour}:00`;
    let elapsedTimeElement = document.getElementById("elapsed-time");
    current_time_bpause = dateText;
    elapsedTimeElement.innerHTML = dateText;
    
  }else{
    
    let elapsedTimeElement = document.getElementById("elapsed-time");
    elapsedTimeElement.innerHTML = `Paused: <br> ${current_time_bpause}`;  }
}


function redistribute_workers() {
  let service_jobs = Player.City.return_array_of_service().array;
  let industry_jobs = Player.City.return_array_of_industrial().array;

  let all_jobs = service_jobs.concat(industry_jobs);

  all_jobs.forEach(job => job.amountOfWorkers = 0);

  // Retrieve the total number of available workers from houses
  let houses = Player.City.return_houses_array();
  let total_workers = Player.City.calculate_population(); // Assuming 'unemployed' holds the number of available workers

  // Distribute workers in batches of 10 as long as there are workers available
  let index = 0;
  while (total_workers > 0 && all_jobs.length > 0) {
    // Distribute workers to the next job in line
    if (all_jobs[index].capacity - all_jobs[index].amountOfWorkers > 0) { // Check if the current job can take more workers
      let workers_to_hire = Math.min(10, total_workers, all_jobs[index].capacity - all_jobs[index].amountOfWorkers);
      all_jobs[index].amountOfWorkers += workers_to_hire;
      total_workers -= workers_to_hire;
    }

    // Move to the next job in the list, wrap around if at the end
    index = (index + 1) % all_jobs.length;

    // Check if we have completed a full cycle without being able to place any workers
    // This condition prevents an infinite loop in cases where no jobs can accept more workers
    if (index == 0 && all_jobs.every(job => job.amountOfWorkers == job.capacity || total_workers < 10)) {
      break;
    }
  }

  console.log("Workers have been redistributed among all jobs.");
}



function employ_people() {
  let unemployed_count = Player.City.get_unemployment_count();
  if (unemployed_count === 0) return; // Exit if no unemployed people

  let service_jobs = Player.City.return_array_of_service().array;
  let industry_jobs = Player.City.return_array_of_industrial().array;
  let houses_arr = Player.City.return_houses_array();

  let i = 0, j = 0; // indices for industry and service jobs

  houses_arr.forEach(house => {
    let house_unemployed = house.unemployed;
    while (house_unemployed > 0 && (j < service_jobs.length || i < industry_jobs.length)) {
      // Calculate total employed in both sectors
      console.log("Infinite loop");
      let totalEmployedService = service_jobs.reduce((sum, job) => sum + job.amountOfWorkers, 0);
      let totalEmployedIndustry = industry_jobs.reduce((sum, job) => sum + job.amountOfWorkers, 0);

      // Determine which sector to prioritize
      let prioritizeService = totalEmployedService <= totalEmployedIndustry;

      // Assign jobs from the prioritized sector
      if (prioritizeService && j < service_jobs.length) {
        let vacancies = service_jobs[j].capacity - service_jobs[j].amountOfWorkers;
        let num_to_hire = Math.min(house_unemployed, vacancies);
        service_jobs[j].hire(num_to_hire);
        house_unemployed -= num_to_hire;
        unemployed_count -= num_to_hire;
        if (service_jobs[j].amountOfWorkers == service_jobs[j].capacity) j++;
      } else if (i < industry_jobs.length) {
        let vacancies = industry_jobs[i].capacity - industry_jobs[i].amountOfWorkers;
        let num_to_hire = Math.min(house_unemployed, vacancies);
        industry_jobs[i].hire(num_to_hire);
        house_unemployed -= num_to_hire;
        unemployed_count -= num_to_hire;
        if (industry_jobs[i].amountOfWorkers == industry_jobs[i].capacity) i++;
      }

      // Check if we need to switch job sectors due to balance
      if (j >= service_jobs.length || i >= industry_jobs.length) break; // Exit if no more jobs in either sector
    }
    
    house.unemployed = house_unemployed; // Update the house's unemployed count
  });

  // Check final employment status
  if (unemployed_count === 0 || (j >= service_jobs.length && i >= industry_jobs.length)) {
    console.log("All possible employment opportunities exhausted.");
  }
}

var gameOverDiv = document.getElementById("gameOverDiv"); 

function showGameOver() {
  pause = true;
  gameOverDiv.innerText = "Game Over";
  gameOverDiv.style.display = "block"; 
  const restartButton = document.createElement("button");
  restartButton.textContent = "Restart Game"; // Set the button text
  restartButton.id = "restartButton"; // Set an ID for styling or further scripting
  const mainMenu = document.createElement("button");
  mainMenu.textContent = "Main menu";
  gameOverDiv.appendChild(restartButton);
  gameOverDiv.appendChild(mainMenu);
  mainMenu.addEventListener("click", function() {
    window.location.href = "index.php";
    console.log("");
  });
  restartButton.addEventListener("click", function() {
    console.log("Restarting the game..."); // Placeholder for actual restart logic
    window.location.href = "game.php";
    gameOverDiv.style.display = "none"; // Optionally hide the gameOverDiv on restart
  });
}



var gameOver = false;


function updateTable() {  
  var numRows = 10;
  var numCols = 23;
  
  if (!matrixData) {
    matrixData = new Array(numRows).fill().map(() => new Array(numCols).fill(0));
  }

  // Clear existing table rows
  while (table.rows.length > 0) {
    table.deleteRow(0);
  }

  population = Player.City.calculate_population();
  satisfaction_p.innerText = "🤩: " + satisfaction;
  population_p.innerText = "👨‍👨‍👧‍👦: " + population;

  // Populate table
  for (var i = 0; i < numRows; i++) {
    var row = table.insertRow(-1);
    for (var j = 0; j < numCols; j++) {
      Player.City.check_two_by_two_residential(i,j);
      var cell = row.insertCell(-1);
      let img = document.createElement('img');
      img.style.width = '100%'; // Fill the cell
      img.style.height = 'auto';
      if (matrixData[i][j]) {
        if(matrixData[i][j].type == 'Colosseum'){
          img.src = buildingTypes[matrixData[i][j].type + matrixData[i][j].order].imageUrl;
          cell.style.backgroundColor = buildingTypes[matrixData[i][j].type].color;
        }else{
        if(matrixData[i][j].type in upgradeTypes){
          if(matrixData[i][j].type == "House" && matrixData[i][j].capacity == 0){
            console.log("BLUE");
            cell.style.backgroundColor = "blue";
          }else{
          if(matrixData[i][j].is_Upgraded){
            img.src = upgradeTypes[matrixData[i][j].type].newImageUrl;
            cell.style.backgroundColor = upgradeTypes[matrixData[i][j].type].color;
          }else{
            if(matrixData[i][j].type == 'Roads'){
              img.src = buildingTypes[matrixData[i][j].type].imageUrl;
              cell.style.backgroundColor = buildingTypes[matrixData[i][j].type].color;          
              cell.style.width = "1px";
              cell.style.height = "1px";
              cell.style.padding = "0";  // Remove padding to ensure the cell is small
            }else{
            if(matrixData[i][j].type == "House"){
            img.src = buildingTypes[matrixData[i][j].type].imageUrl + matrixData[i][j].pic_type + '.png';
            cell.style.backgroundColor = buildingTypes[matrixData[i][j].type].color;  
            }else{
              img.src = buildingTypes[matrixData[i][j].type].imageUrl;
              cell.style.backgroundColor = buildingTypes[matrixData[i][j].type].color;    
            }
            }
          }
          if(matrixData[i][j].type == "House" && matrixData[i][j].is_in_zone){
            cell.style.backgroundColor = "gold"; 
          }
        }
        }else{

          if(matrixData[i][j].type == "House" && matrixData[i][j].is_in_zone){
            cell.style.backgroundColor = "gold"; 
          }
  
          img.src = buildingTypes[matrixData[i][j].type].imageUrl;
          cell.style.backgroundColor = buildingTypes[matrixData[i][j].type].color;
        }
      }
      } else {
        img.src = 'images/default.jpg'; // Default image for uninitialized cells
        cell.style.backgroundColor = 'green';
      }
      cell.style.border = "none";
        cell.appendChild(img);
    }
  }
}

function updateGame(){
  Player.City.checkAndConnect();
  let service_count = Player.City.count_service_zone_workers();
  let industrial_count = Player.City.count_industrial_zone_workers();

  service_workers.innerText = "Service workers: "+ service_count;
  industrial_workers.innerText = "Industrial workers: "+ industrial_count;

  updateElapsedTime();
  updateRealTime();
  Player.City.move_in(satisfaction);
  if (satisfaction < -100) {
    gameOver = true;
  }

  // Check if the game is paused or over
  if (!pause && !gameOver) {
    Player.City.calculateMaintenanceFees();

    let currentTime = new Date();
    // Adjust elapsed time by gameSpeed
    let realElapsedTime = currentTime - startTime - totalPausedTime;  
    let elapsedTime = realElapsedTime * gameSpeed;  // Scale elapsed time by the game speed factor

    if (elapsedTime % 4 === 0) {
      //console.log("4 ms have passed at game speed");
      Player.City.increase_satisfaction_around_special_zones();
      employ_people();
    }

    if (elapsedTime % 1000){
      money -= Player.City.calculateMaintenanceFees();
    }

    // Handle money calculations
    if (elapsedTime % 20 === 0) {
      redistribute_workers();
      satisfaction = Player.City.calculate_satisfaction();

    }

    // Update UI components or other game elements

    updateTable();
  }else if (gameOver) {
    showGameOver(); 
  }
}

var startTime = new Date().getTime();
setInterval(updateGame, 1000 / gameSpeed);

function addGameSpeedButton() {
  let gameSpeedButton = document.createElement("button");
  gameSpeedButton.textContent = "Game Speed: Normal";
  document.body.appendChild(gameSpeedButton);

  gameSpeedButton.addEventListener("click", function () {
    gameSpeedIndex = (gameSpeedIndex + 1) % gameSpeeds.length;
    gameSpeed = gameSpeeds[gameSpeedIndex];
    console.log("Game speed "+ gameSpeed);

    let speedText = ["Slow", "Normal", "Fast"][gameSpeedIndex];
    gameSpeedButton.textContent = `Game Speed: ${speedText}`;
  });
}

// Function to add tax button
function addTaxButton() {
  let taxButton = document.createElement("button");
  taxButton.textContent = "Change Tax";
  document.body.appendChild(taxButton);

  taxButton.addEventListener("click", function () {
    let input = window.prompt("Enter a tax rate: 20, 25, or 30!");
    if (["20", "25", "30"].includes(input)) {
      taxRate = Number(input);
      alert(`Tax rate set to ${taxRate}%`);
      updateSatisfaction();
    } else {
      alert("Invalid input. Please enter either 20, 25, or 30.");
    }
  });
}

// Update satisfaction based on the tax rate
function updateSatisfaction() {
  if (taxRate === 30) {
    satisfaction -= 20;
  } else if (taxRate === 10) {
    satisfaction += 10;
  } else {
    // No change for rate of 20
  }
  satisfaction = Math.max(0, Math.min(100, satisfaction));
  let satisfactionDisplay = document.getElementById("satisfaction");
  if (!satisfactionDisplay) {
    satisfactionDisplay = document.createElement("p");
    satisfactionDisplay.id = "satisfaction";
    document.body.appendChild(satisfactionDisplay);
  }
  satisfactionDisplay.textContent = `Satisfaction: ${satisfaction}%`;
}

let save_button = document.querySelector("button#Save");

function save() {
  console.log(matrixData);
  var saveName = prompt("Please enter a name for the save:", "");
    if (saveName != null) {
      console.log(matrixData);
      var matrixDataJson = JSON.stringify(matrixData);
      var matrixDataEncoded = encodeURIComponent(matrixDataJson);
      var url = "game.php?M=" + matrixDataEncoded + "&N=" + saveName;
      window.location.href = url;
    
    } else {
          var matrixDataJson = JSON.stringify(matrixData);
          var matrixDataEncoded = encodeURIComponent(matrixDataJson);
          var url = "game.php?M=" + matrixDataEncoded;
          window.location.href = url;          
  }
}

let infoDiv = document.querySelector("div#infoDiv");
let hoverTimer;

function showInfo(rowIndex,colIndex) {
    var rowI = rowIndex;
    var colI = colIndex;
    infoDiv.style.display = "block";
    if(matrixData[rowI][colI] !== 0){
      console.log("Matrix is not 0")
      //console.log(Player.City.getTypeOfZone(rowI,colI).toString());
      infoDiv.innerHTML =  Player.City.getTypeOfZone(rowI,colI).toString();// Example data
      console.log(infoDiv.innerHTML);
      infoDiv.style.color = "black";
    }else{
      infoDiv.innerHTML = "Nothing is built here!";
      infoDiv.style.color = "black";
    }
}

function for_mouseover() {
    var cell = this;
    var rowIndex = cell.parentNode.rowIndex;
    var colIndex = cell.cellIndex;
    clearTimeout(hoverTimer); // Clear previous timer if any
    hoverTimer = setTimeout(() => showInfo(rowIndex,colIndex), 1000);
}

function for_mouseout(event) {
    var relatedTarget = event.relatedTarget; // Get where the mouse is moving to
    if (this.contains(relatedTarget)) {
        return; // Ignore this mouseout as it's still within the cell
    }
    clearTimeout(hoverTimer);
    infoDiv.style.display = "none";
}

function delegate_two(element, eventName, selector, handler) {
    element.addEventListener(eventName, function(event) {
        var possibleTargets = element.querySelectorAll(selector);
        var target = event.target;

        for (var i = 0, len = possibleTargets.length; i < len; i++) {
            if (possibleTargets[i] === target) {
                handler.call(target, event);
                break;
            }
        }
    });
}

delegate_two(table, "mouseover", "td", for_mouseover);
delegate_two(table, "mouseout", "td", for_mouseout);

document.addEventListener('DOMContentLoaded', function () {
  let shop = document.getElementById('shop'); // Ensure it targets the image
  let shop_items = document.querySelector("div#shop_items");
  
  shop.addEventListener("click", function() {
      shop_items.style.display = shop_items.style.display === 'none' ? 'block' : 'none';
  });
  
      // Add other necessary scripts here to ensure they are run after the DOM is loaded
});

function handlePause(){
  if (pause) {
    pause = false;
    let pauseEndTime = new Date();
    totalPausedTime += pauseEndTime - pauseStartTime;  // Accumulate paused duration
  } else {
    pause = true;
    pauseStartTime = new Date();  // Record when the pause started
  }
}

delegate(table, "click", "td", placeFromShop);

delegate(div_for_images, "click", "img", imageClicked);

addGameSpeedButton();

addTaxButton();

pause_button.addEventListener("click", handlePause);

save_button.addEventListener("click", save);
