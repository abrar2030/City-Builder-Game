<?php
if (isset($_POST['submit'])) {
    $uniqueCode = $_POST['game_code']; // Make sure the name attribute of the select element is 'game_code'
    header('Location: game.php?S=' . urlencode($uniqueCode));
    exit();
}

if(isset($_POST['back'])){
    header('Location: index.php');
    exit;
}


$json_file = file_get_contents("saved_games.json");
$dataArray = json_decode($json_file, true);

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="load.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&display=swap" rel="stylesheet">

    <title>Load Game</title>
</head>
<body>
<form action="" method="post">
    <select name="game_code">
    <?php
    foreach ($dataArray as $code => $game) {
        echo "<option value='$code'>$code</option>";
    }
    ?>
    </select>
    <input type="submit" name="submit" value="Load Game">
    <input type="submit" name="back" value="Back">
</form>
</body>
</html>
