<?php  
   if(isset($_GET['Back'])){
    echo "BACK PRESSED";
    header('Location: index.php');
  exit;
}
   
   if(isset($_GET['M'])) {
       $filename = 'saved_games.json';
       $games = file_exists($filename) ? json_decode(file_get_contents($filename), true) : [];
   
       $newMatrixData = json_decode($_GET['M'], true);
      if(isset($_GET['N'])){
        $uniqueCode = $_GET['N'];
      }else{
       $uniqueCode = uniqid('game_', true); 
      } 
       $games[$uniqueCode] = $newMatrixData;
      
       $jsonData = json_encode($games, JSON_PRETTY_PRINT);
   
       file_put_contents($filename, $jsonData);
   
       http_response_code(200);
       echo "Matrix data successfully saved with code: $uniqueCode";
       header('Location: game.php?S=' . $uniqueCode);
       exit();
    }


    if(isset($_GET['S'])){
      $index = $_GET['S'];
      echo $index;
    $filename = 'saved_games.json';
    $existingData = file_exists($filename) ? json_decode(file_get_contents($filename), true) : [];

    if(isset($_GET['S'])){
      $uniqueCode = $_GET['S'];
      $filename = 'saved_games.json';
      $existingData = file_exists($filename) ? json_decode(file_get_contents($filename), true) : [];
      if(isset($existingData[$uniqueCode])) {
          $matrixData = $existingData[$uniqueCode];
          echo '<script>';
          echo 'var matrixData = ' . json_encode($matrixData) . ';'; // Only encode this game's data
          echo '</script>';
      } else {
          // Handle the case where the specific game's data does not exist
          echo '<script>';
          echo 'var matrixData = null;';
          echo '</script>';
      }
    }
  }

  if (empty($_GET)) {
    echo '<script>';
    echo 'var matrixData = null;';
    echo '</script>';
}
  
?>

<!DOCTYPE html>

<html lang="en">
  <head>
    <link rel="stylesheet" type="text/css" href="game.css" />
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Royal Kingdom</title>
  </head>
  <body>
    
  <div id="top-bar">
    <div id="stats-left">
      <p id="money">💰: $1000</p>
      <p id="population">👨‍👨‍👧‍👦: 0</p>
      <p id="satisfaction">🤩: 50</p>
      <p id="service_workplaces">Service workers: 0</p>
      <p id="industrial_workplaces">Industrial workers: 0</p>
    </div>
    <div id="gameOverDiv"></div>
    <div id="stats-right">
    <p id="actual-time">Current Date & Time: 0</p>
    <p id="elapsed-time">In-Game Date & Time: Year: 0000, Month: 00, Day: 00, Hour: 00:00</p>
    </div>
    </div>
    <div id="buttonContainer">
    <img src="shop.png" alt="Shop" id="shop" role="button" aria-pressed="false" style="cursor: pointer;"/>

    <button id="Save">Save</button>
    <button id="Pause">Pause</button>
      
    </div>

    <table border="0" id="bigtable">    
    </table>

    <div id="infoDiv" style="position: absolute; background-color: white; border: 1px solid black; padding: 10px;"></div>
    <div id="shop_items" style="display: none;">
  <div class="shop-item">
    <img id="Residential Zone" src="images/house1.png" alt="House" />
    <p>Residential Zone - $100</p>
  </div>
  <div class="shop-item">
    <img id="Forest" src="images/forest.png" alt="Forest" />
    <p>Forest - $150</p>
  </div>
  <div class="shop-item">
    <img id="Colosseum" src="images/colosseum.png" alt="Service" />
    <p>Colosseum - $200</p>
  </div>
  <div class="shop-item">
    <img id="Roads" src="images/road.jpg" alt="Roads" />
    <p>Roads - $50</p>
  </div>
  <div class="shop-item">
    <img id="RoyalForges" src="images/royal_forges.png" alt="Industrial" />
    <p>Royal Forges - $300</p>
  </div>
  <div class="shop-item">
    <img id="RoyalShipyards" src="images/royal_shipyards.png" alt="Industrial" />
    <p>Royal Shipyards - $250</p>
  </div>
  <div class="shop-item">
    <img id="Knights" src="images/knights.png" alt="Service" />
    <p>Knights - $230</p>
  </div>
</div>


    
  <form action="index.php" method="get">
    <input type="submit" name="back" value="Back">
  </form>

    <script type="module" src="game.mjs"></script>
  </body>
</html>