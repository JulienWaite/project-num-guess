$(document).ready(function(){ // do not remove - insert all code in here!

  var size3x3 = [[1,1,1,1,0,1,1,1,1], //0
                 [1,1,0,0,1,0,1,1,1], //1
                 [1,1,0,0,1,0,0,1,1], //2
                 [1,1,1,0,1,1,1,1,1], //3
                 [1,0,1,1,1,1,0,0,1], //4
                 [0,1,1,0,1,0,1,1,0], //5
                 [1,0,0,1,1,1,1,1,1], //6
                 [1,1,1,0,0,1,0,0,1], //7
                 [0,1,1,1,1,1,1,1,1], //8
                 [1,1,1,1,1,1,0,0,1]];//9

  var size3x4 = [[1,1,1,1,0,1,1,0,1,1,1,1], //0
                 [0,1,0,1,1,0,0,1,0,1,1,1], //1
                 [1,1,0,0,0,1,0,1,0,1,1,1], //2
                 [1,1,0,0,1,1,0,0,1,1,1,0], //3
                 [1,0,1,1,1,1,0,0,1,0,0,1], //4
                 [1,1,1,1,1,0,0,0,1,1,1,0], //5
                 [1,1,1,1,0,0,1,1,1,1,1,1], //6
                 [1,1,1,0,0,1,0,1,0,0,1,0], //7
                 [1,1,1,0,1,0,1,0,1,0,1,0], //8
                 [1,1,1,1,1,1,0,0,1,1,1,1]];//9

  var size3x5 = [[1,1,1,1,0,1,1,0,1,1,0,1,1,1,1], //0
                 [0,1,0,1,1,0,0,1,0,0,1,0,1,1,1], //1
                 [1,1,1,0,0,1,1,1,1,1,0,0,1,1,1], //2
                 [1,1,1,0,0,1,1,1,1,0,0,1,1,1,1], //3
                 [1,0,1,1,0,1,1,1,1,0,0,1,0,0,1], //4
                 [1,1,1,1,0,0,1,1,1,0,0,1,1,1,1], //5
                 [1,1,1,1,0,0,1,1,1,1,0,1,1,1,1], //6
                 [1,1,1,0,0,1,0,1,0,1,0,0,1,0,0], //7
                 [1,1,1,1,0,1,1,1,1,1,0,1,1,1,1], //8
                 [1,1,1,1,0,1,1,1,1,0,0,1,1,1,1]];//9

  var soundIncorrect = new buzz.sound("sounds/incorrect-guess.mp3");
  var soundCorrect = new buzz.sound("sounds/correct-guess.mp3");
  var soundButtonClick = new buzz.sound("sounds/button-click.mp3"); // add after fixing event listeners!

  var gridCounter = 0;
  var turnCounter = 0;
  var clicked = false;
  var DEFAULT_TARGET = 20;

  var targetScoreInput;
  var spriteSizeInput;
  var orientationInput;

  var answer;
  var numberInGrid;
  var puzzles;

  var pOneScore = 0;
  var pTwoScore = 0;

  // UTILITY FUNCTION
  function toTwoDArr (array) {
    var twoDArr = [];
    var timesToRun = array.length / 3;
    var offset = 0;
    for (var i = 0; i < timesToRun; i++){
      var tmp = [array[i + offset], array[i + offset + 1], array[i + offset + 2]];
      twoDArr.push(tmp);
      offset += 2;
    }
    return twoDArr;
  }

  function toOneDArr (array) {
    var oneDArr = [];
    for (var i=0; i < array.length; i++){
      for (var j=0; j < array[i].length; j++){
        oneDArr.push(array[i][j]);
      }
    }
    return oneDArr;
  }

  function inverse (array) {
    var inverseArray = [];
    var twoDArr = toTwoDArr(array);
    for (var i = twoDArr.length - 1; i >= 0; i--) {
      var tmp = [];
      for (var j = 0; j < twoDArr[i].length; j++){
        tmp.push(twoDArr[i][j]);
      }
      inverseArray.push(tmp);
    }
    var oneDArr = toOneDArr(inverseArray);
    return oneDArr;
  }

  function mirror (array) {
    var mirrorArray = [];
    var twoDArr = toTwoDArr(array);
    for (var i = 0; i < twoDArr.length; i++) {
      var tmp = [];
      for (var j = twoDArr[i].length - 1; 0 <= j ; j--){
        tmp.push(twoDArr[i][j]);
      }
      mirrorArray.push(tmp);
    }
    var oneDArr = toOneDArr(mirrorArray);
    return oneDArr;
  }

  // This function could be replaced by calling both the above functions
  function inverseMirror (array) {
    var inverseMirrorArray = [];
    for (var i = array.length - 1; i >=0; i--) {
      inverseMirrorArray.push(array[i]);
    }
    return inverseMirrorArray;
  }

  // SUB FUNCTION
  function setTargetScore () {
    targetScoreInput = $('#set-target-score').val() || DEFAULT_TARGET;
    $('#target-score').text(targetScoreInput);
  }

  // feat. depending on what input, show different screen
  function setGridSize () {
    spriteSizeInput = $('#set-sprite-size').val() || "3x3";

    var spriteWidth = parseInt(spriteSizeInput[0]);
    var spriteHeight = parseInt(spriteSizeInput[2]);

    //console.log(spriteSizeInput)
    $('#instructions-screen').hide();

    if (spriteWidth === 3 && spriteHeight === 3)  {
      $('#game-screen3x3').show();
      puzzles = size3x3;
    }
    else if (spriteWidth === 3 && spriteHeight === 4) {
      $('#game-screen3x4').show();
      puzzles = size3x4;
    }
    else if (spriteWidth === 3 && spriteHeight === 5) {
      $('#game-screen3x5').show();
      puzzles = size3x5;
    }
    else {
      console.log("You've broken numGuess!");
    }
  }

  // ORIENTATION BUTTON
  function generateNumberAndSetOrientation () {
    answer = Math.floor(Math.random()*(10));
    numberInGrid = puzzles[answer];

    orientationInput = orientationInput || $('#set-orientation').val() || "normal";
    if (orientationInput === "normal") {
    }
    else if (orientationInput === "inverse") {
      numberInGrid = inverse(numberInGrid);
    }
    else if (orientationInput === "mirror") {
      numberInGrid = mirror(numberInGrid);
    }
    else if (orientationInput === "inverse-mirror") {
      numberInGrid = inverseMirror(numberInGrid);
    }
    else {
      console.log("You've broken numGuess!");
    }
  }

  function highlightPlayer () {
    var option1 = {'background-color':'blue', 'border':'white solid 2px'};
    var option2 = {'background-color':'red', 'border-color':'red'};
    if (turnCounter % 2 === 0) {
      $('#player-one').css(option1);
      $('#player-two').css(option2);
    }
    else {
      $('#player-one').css(option2);
      $('#player-two').css(option1);
    }
  }

  function selectCell () {
    $('#pass-button').show();
    $('#reset-cells-button').hide();

    $('#results-text1').text("");
    $('#results-text2').text("");
    $('#results-text3').text("");

    $('.game-cell').off().on("click", function() {
      if (!clicked) { // when click is false
        var cellId = parseInt($(this).attr('id').substring(1));
        var pixel = numberInGrid[cellId];

        if(pixel === 1) {
          $('.c' + cellId).css('background-color', 'black');
        }
        else {
          $('.c' + cellId).css('background-color', 'white');
        }

        gridCounter = gridCounter + 1;
        clicked = true;
        // console.log(gridCounter);
        //if (gridCounter >= numberInGrid.length) {
        //$userGuessElem1.text("The number is " + answer +".");
        //}
      }
    });
  }

  // calculates score
  function calculateScore (userGuess) {
    var bonus = (numberInGrid.length - gridCounter);
    var pointsAwarded = answer + bonus;
    //console.log("cs", numberInGrid)
    if (userGuess === answer) {
      soundCorrect.play();
      $('#results-text1').text("The number " + userGuess + " is correct!");
      $('#results-text2').text("You score " + pointsAwarded + " (" + answer + " + " + bonus + ") point(s).");
    }
    else {
      soundIncorrect.play();
      $('#results-text1').text("Wrong!  The number is " + answer + ", not " + userGuess + ".");
      $('#results-text2').text("Your opponent scores " + pointsAwarded + " (" + answer + " + " + bonus + ") point(s).");
    }
    if (turnCounter % 2 === 0 && userGuess === answer || turnCounter % 2 !== 0 && userGuess !== answer)  {
      pOneScore = pOneScore + pointsAwarded;
      $('#player-one-score').text(pOneScore);
    }
    else {
      pTwoScore = pTwoScore + pointsAwarded;
      $('#player-two-score').text(pTwoScore);
    }
  }

  // removes remaining squares to show answer
  function revealAnswer () {
    for(var i = 0; i < numberInGrid.length; i++) {
      if(numberInGrid[i] === 1) {
        $('.c'+ i).css('background-color', 'black');
      }
      else {
        $('.c'+ i).css('background-color', 'white');
      }
    }
  }

  // reset grid to background colour
  function resetCell () {
    gridCounter = 0;
    for(var i = 0; i < numberInGrid.length; i++) {
      $('.game-cell').css('background-color', 'red');
      generateNumberAndSetOrientation();
      selectCell();
    }
  }

  function showOptionScreen (show) {
    if (show) {
      $('#options-screen').show();
      $('#instructions-screen').show();

      $('#play-box').hide();
      $('#game-screen3x3').hide();
      $('#game-screen3x4').hide();
      $('#game-screen3x5').hide();
    } else {
      $('#options-screen').hide();
      $('#instructions-screen').hide();

      $('#play-box').show();
    }
  }

  // MAIN FUNCTION
  // STEP 1 (This function needs breaking down into smaller chunks)
  function bindStartButton () {
    $('#start-button').on("click", function(){
      setTargetScore();
      setGridSize();
      generateNumberAndSetOrientation();
      selectCell();
      highlightPlayer();
      showOptionScreen(false);
    });
  }

  // STEP 2A
  function bindUserPass () {
    $('#pass-button').off().on("click", function() {
      if (clicked) { // when click is true
        clicked = false;
        turnCounter = turnCounter + 1;
        highlightPlayer();
      }
    })
  }

  // STEP 2B
  function bindUserGuess () {
    $('.guess-buttons').off().on("click", function() {
      if (clicked) { // when click is true
        var userGuess = parseInt($(this).val());
        clicked = false;

        turnCounter = turnCounter + 1;
        highlightPlayer();

        // calcuate score
        calculateScore(userGuess);
        revealAnswer();

        $('#pass-button').hide();

        if (pOneScore >= targetScoreInput || pTwoScore >= targetScoreInput){
          $('#restart-button').show();
        } else {
          $('#reset-cells-button').show();
        }

        if (pOneScore >= targetScoreInput) { // target is reached, end of game
          $('#results-text3').text("Player 1 wins.  Thank you for playing."); // create modal
        }
        else if (pTwoScore >= targetScoreInput) {
          $('#results-text3').text("Player 2 wins. Thank you for playing.");
        }
      }
    });
  }
  // This function needs fixing
  function bindRestartButton () {
    $('#restart-button').on("click", function(){
      resetCell();

      pOneScore = 0;
      pTwoScore = 0;
      $('#player-one-score').text(pOneScore);
      $('#player-two-score').text(pTwoScore);

      showOptionScreen(true);
    });
  }

  function bindNextRoundButton () {
    $('#reset-cells-button').on("click", function() {
      resetCell();
      generateNumberAndSetOrientation();
      selectCell();
    })
  }

  function init () {
    bindStartButton();
    bindUserPass();
    bindUserGuess();
    bindRestartButton();
    bindNextRoundButton()
  }

  init(); // start code
}); // do not remove