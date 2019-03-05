"use strict";

/*****************

TRUE DIFFERENT OR FAKE or when mr parrot put on his smartee brand pants
by Samuel Paré-Chouinard


******************/

// level design:

// maximum guesses per round
let maxGuesses = 3;
// number of incorrect guesses that will trigger game over
let strikeOut = 5;


// game objects:

// - creating a new Game() starts a search for new words and definitions.
let game;

// - the Parrot() class will handle functions triggered by annyang,
// and the parrot's voice.
let parrot;

// GAME VARIABLES
// game counters
let guesses =0;
let points =0;
let incorrectGuess =0;
// stores timeout to start new round
let newGame;
// cues new round to start at the end of draw()
let cueStartAgain = false;
// prevents other cards from being selected while guessing
let currentlyGuessing = false;
// the card which is selected
let whichCard;
// prevents multiple new words and definitions searches from starting in a loop
let gameRestarted = false;
// game states
let startScreen  = true;
let gameOver = false;
let gameOverClickable = false;
let gameStarted = false;

// ANIMATIONS
// loading animation
let numberOfEllipses = 8;
let animator =[];
let animationLength = 40;
let animationTimer = animationLength;
// values used to define card wobble direction
let windowMargin;
let cardMargin;
let cardY;
// text animation
let reactionY;
let gameOverY=0;
let reaction;
let reactYlimit;

// SOUND
// parrot sound samples
let sample = [];
sample[0] = new Audio("assets/sounds/parrot1.wav");
sample[1] = new Audio("assets/sounds/parrot2.wav");
sample[2] = new Audio("assets/sounds/parrot3.wav");
sample[3] = new Audio("assets/sounds/parrot4.wav");
sample[4] = new Audio("assets/sounds/parrot5.wav");
sample[5] = new Audio("assets/sounds/parrot6.wav");
sample[6] = new Audio("assets/sounds/parrot7.wav");
// annyang voice commands
let commands;


// setup()
//
// create canvas, create new game objects and start annyang.

function setup() {

  // set canvas to match window size
  createCanvas(window.innerWidth-50, window.innerHeight);

  textAlign(CENTER);
  rectMode(CENTER);

  // create game objects:

  game = new GameSetup();
  parrot = new Parrot();

  // annyang initial setup:

  // add parrot.thank() and parrot.startover() commands.
  if(annyang){
    let permaCommands = {
      'nice': parrot.thank,
      "let's start again": parrot.startOver,
    };
    annyang.addCommands(permaCommands);

    // start annyang
    annyang.start();

    // set different starting values for each ellipse in the loading animation
    for(let i=0; i<numberOfEllipses; i++){
      animator.push(i);
    }
  }
}


// draw()
//
// runs the different game states: start screen, runGame, game over, loading screen.
// new rounds are triggered at the end of draw() when cued. most game values are
// reset while the new round is being set up, so it seems to me like this works better
// if i prevent the change from happening in the middle of an update() or display()
// function.

function draw() {

  // check game states:

  // ------- if START SCREEN is running
  if(startScreen){

    displayStartScreen();
  }

  // ------- if GAME IS RUNNING
  else {
    if(game.readyToStart && !gameOver){

      // run the game
      runGame();

      // display score and listen for round over and game over.
      handleScore();
    }

    // ------- if GAME OVER is running.
    else if(gameOver){

      // display game over screen
      displayGameOverScreen();
    }

    // ------- if LOADING SCREEN IS RUNNING
    else {
      background(125);

      // display text
      fill(255);
      text("loading!", width/2, height/2);

      // display animated ellipses.
      displayEllipses();
    }
  }

  // if new round command was triggered, start a new round.
  if(cueStartAgain && !gameRestarted){

    // start new round
    clearTimeout(newGame);
    newGame = setTimeout( startNewRound, 2000);

    // squawk it
    parrot.squawk("new round!");

    // set states
    gameRestarted = true;
    cueStartAgain = false;
  }
}


// rungame()
//
// setup annyang commands on first frame.
// trigger and update animations.
// update and display cards and guessing option buttons.

function runGame(){

  // if this is the first frame
  if(gameStarted){
    gameStarted = false;

    // say the word
    parrot.squawk("the word is "+game.theWord);

    // setup annyang commands: repeat the word, or pick a random definition.
    if(annyang){
      commands = {
        'say the word again': parrot.sayWordAgain,
        'pick one for me': parrot.defineWord,
      };
      annyang.addCommands(commands);
    }
  }

  // if reaction animation is running, display animation (and not the background).
  if(reactionY<reactYlimit){
    // animate reaction text
    react();
    // animate main word display
    textSize(100+reactionY);
    fill(0, 0 +reactionY, 0 +reactionY*3);
  }
  else {
    // if reaction animation is not running, display the background.
    background(235);
    // stylize main word display
    textSize(100);
  }

  fill(0);
  // display the word being "defined"
  text(game.theWord, width/2, 112);

  // display the cards
  for (let j=0; j<game.numberOfCards; j++){
    game.cards[j].display();
    game.cards[j].update();
  }

  // display options over the cards
  for (let j=0; j<game.numberOfCards; j++){
    if(game.cards[j].optionsRevealed){
      game.cards[j].options();
    }
  }
}


// mousepressed()
//
// listens for click that will start the game at the start screen or after a gameover.

function mousePressed(){

  // if starting screen is active
  if(startScreen){

    // squawk introduction text
    parrot.squawk("Hello and welcome to true different or fake! You can talk to me, or go ahead and click through the game.");

    // set states
    startScreen = false;

    // prevent clicking on cards for a hot second, to prevent a card from
    // being selected at the same click as the game start.
    currentlyGuessing = true;
    setTimeout(function(){ currentlyGuessing = false; }, 300);
  }

  // if game over screen is active
  else if(gameOver&&gameOverClickable){

    // set states
    gameOverClickable = false;
    gameOver = false;
    // start new round
    cueStartAgain = true;
    // reset counters
    points =0;
    incorrectGuess =0;
  }
}


// displaystartscreen()
//
// displays a starting screen with some kind of introduction to the game

function displayStartScreen(){

  background(235);

  // title
  fill(0);
  textSize(20);
  let startTitle = "welcome to real, different or fake!";
  text(startTitle, width/2, height/4, width-50, (height-50)/4);

  // body
  let startDescription =
  "that day mr. parrot put on his smartee brand pants and flew to the dictionary, flapping through pages and stopping on random ones. "
  + "\nhe squawked: 'rwaak! let's play a game! i'll state word, then i'll suggest a definition. "
  + "\nyou tell me if it's the real definition, a definition for a different word, or a fake definition. "
  + "\nsquawk! real, different or fake! perhaps all i can do is repeat things, but i bet you can't tell what's true!"
  + "\n\n\nclick to start";
  text(startDescription, width/2, height/2, width-50, (height-50)/2);
}


// displaygameoverscren()
//
// displays the animated game over text

function displayGameOverScreen(){

  // display a colored rectangle behind it
  fill(145, 215, 110, 3+gameOverY/10);
  rect(width/2, height/2, width, height);

  // increment animation
  gameOverY+=2;

  // display text
  if(gameOverY<1*height/2){
    fill(255-gameOverY);
    textSize(45+gameOverY*3);
    text("game over!", width/2, height/2+gameOverY*0.3, width, height);
  }
}


// react()
//
// text triggered when user makes a guess.
// displays the reaction text (either "correct" or "incorrect").
// animates its size and position.

function react(){

  // set animation limit
  reactYlimit= 1*height/3;
  // increment animation
  reactionY+=2;

  // display text.
  if(reactionY<reactYlimit){
    fill(255-reactionY);
    textSize(45+reactionY*3);
    text(reaction, width/2, height/2+reactionY*0.3, width, height);
  }
}

// startnewround()
//
// starts a new round (new word and definitions).

function startNewRound(){

  // set states
  cueStartAgain = false;
  currentlyGuessing = false;
  gameStarted = true;

  // reset counter
  guesses = 0;

  // stop animation
  reactionY += reactYlimit;

  // search for new words and definitions
  game = new GameSetup();
}

// displayellipses()
//
// display a bunch of ellipses.
// vary their radii.

function displayEllipses(){

  // for each ellipse
  for(let i=0; i<numberOfEllipses; i++){

    // set position
    let ellipseX = width/3;
    let ellipseY = height/2;
    let ellipseR;

    // increment animation
    if(frameCount<animationTimer){
      // animationTimer is active, speed up animation
      animator[i]+=10;
    } else {
      // else play at normal speed
      animator[i] +=i;
    }

    // calculate radius
    ellipseR = 12*i + sin( radians( 180*animator[i]/100 ) )*20;

    // display ellipse
    stroke(255);
    noFill();
    ellipse(ellipseX, ellipseY, ellipseR, ellipseR);
  }
}


// handlescore()
//
// displays score and checks if game or round is over.

function handleScore(){

  // display score.
  fill(0);
  textSize(20);
  noStroke();
  let guessesLeft = strikeOut - incorrectGuess;
  text("score : "+points+", incorrect guesses left: "+guessesLeft, width/2, 28);

  // trigger game over if user runs out of incorrect guesses
  if(incorrectGuess>=strikeOut){

    // squawk game over and set state.
    parrot.squawk("game over!");
    gameOver = true;
    //  prevent clicking for a hot second.
    setTimeout(function(){gameOverClickable = true}, 500);
  }

  // trigger new round if maximum number of guesses was reached for this round.
  if(guesses>=maxGuesses){
    cueStartAgain = true;
  }
}
