<?php
  /*
   * CSE 154 AA Autumn 18
   * Tal Wolman
   * pointsofinterest.php web service to demonstrate basic GET parameters with associative arrays.
   * by getting points of interests from a city.
   *
   * Web service details:
   *   Required GET parameters:
   *     - strategy
   *     - personal
   *   examples
   *     - strategy=rand
   *     - personal
   *   Output Formats:
   *   - plain text and JSON object
   */
  error_reporting(E_ALL);

  $gameplan = get_strategies();
  $personal = get_personal();


  /**
   * checks to see that the necessary parameters are set and then, based on parameter, correct
   * information is assigned appropriatley
   *
   */
  if (isset($_GET["strategy"]) && isset($gameplan)) {
    $type = $_GET["strategy"];
    $error = FALSE;
    $return_information = NULL;
    $strategy_info = strategies_information($gameplan["strategies"], $type);
    if ($type === "all" || $type === "rand" || isset($strategy_info)) {
      header("Content-type: application/json");
      if ( $type === "rand") {
        $return_information = $gameplan["strategies"][array_rand($gameplan["strategies"])];
      }
      elseif ($type === "all") {
        $return_information = $gameplan;
      }
      else {
        $return_information = array($type => $strategy_info);
      }
    }
    else {
      $error = TRUE;
    }
    if (!$error) {
      echo(json_encode($return_information));
    } else {
      header("HTTP/1.1 400 Invalid Request");
      header("Content-type: text/plain");
      echo "I don't have advice for that debugging strategy,
            feel free to contact me and I'll add it";
    }
  } elseif (isset($_GET["personal"]) && isset($personal)) {
    header("Content-type: text/plain");
    print_r($personal);

  } else {
    header("HTTP/1.1 400 Invalid Request");
    header("Content-type: text/plain");
    echo "You need to pass a strategy parameter for advice to be given";
  }

  /**
   * this function gets the information from all the files in the stategies directory and
   * puts the information into an associative array
   * @return {array} $completed - which contains all the processed information from the files
   */
  function get_strategies() {
    $strategies = glob("strategies/*");
    $output = array();
    foreach ($strategies as $technique) {
      $option = glob($technique . "/*");
      $specifics = array();
      foreach ($option as $advice) {
        array_push($specifics, file_contents($advice));
      }
      $debugging_details = array();
      $debugging_details["strategy"] = str_replace("_", " ", basename($technique));
      $debugging_details["information"] = $specifics;
      array_push($output, $debugging_details);
    }
    $completed = array("strategies" => $output);
    return $completed;
  }

  /**
   * this function gets the contents of the commonbugs.txt
   * @return {string} $information - a string of the contents of the commonbugs.txt file
   */
  function get_personal() {
    $information = file("commonbugs.txt");
    return $information[0];
  }

  /**
   * this function gets all the information about the various strategies
   * @return {string} $method - refers to the name of the strategy. otherwise if empty returns null
   */
  function strategies_information($gameplan, $type) {
    foreach($gameplan as $method) {
      if ($method["strategy"] === $type) {
        return $method;
      }
    }
    return NULL;
  }

  /**
   * gets all the information of each file for each type of debugging strategy
   * @return {array} $specifics with the advice in the first index and the url for the gif in the
   * second. Otherwise return null
   */
  function file_contents($name) {
    $contents = file($name, FILE_IGNORE_NEW_LINES);
    if (count($contents) > 0) {
      $specifics = array();
      $specifics["advice"] = $contents[0];
      $specifics["gif"] = $contents[1];
      return $specifics;
    }
    return NULL;
  }
 ?>
