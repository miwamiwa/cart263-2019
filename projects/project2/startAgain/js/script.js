"use strict";

/*****************

TRUE DIFFERENT OR FAKE or when mr parrot put on his smartee brand pants
by Samuel Paré-Chouinard


known bugs:

- sometimes related words and their definitions get mixed up. not sure why. keep
playing and the next round will most likely be ok.

- "match" error while loading the game means it's broken and needs a refresh

******************/

// level design:

// maximum guesses per round
let maxGuesses = 3;
// number of incorrect guesses that will trigger game over
let strikeOut = 3;

// game objects:
// - creating a new Game() starts a search for new words and definitions.
let game;
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
let loadScreenStarted = false;
let reactionStarted = false;
// text display what voice commands are available
let voiceCommandsDescription = "";
// ANIMATIONS
// loading animation
let numberOfEllipses = 50;
let ellipseSpacing = 100;
let animator =[];
let animationLength = 40;
let animationTimer = animationLength;
// values used to define card wobble direction
let windowMargin;
let cardMargin;
let cardY;
// text animation
let reactionY=0;
let gameOverY=0;
let reaction;
let reactYlimit=0;
let timerDisplay = 0;
// SOUND
// parrot sound samples
let sample = [];
// annyang voice commands
let commands;
let startingVoiceCommands = "voice commands: 'good bird', 'let's start again'";
let cardVoiceCommands = ", 'say the word again', 'pick one for me'";
let optionsVoiceCommands = ", 'true', 'different', 'fake', 'say the definition again'";



// preload()
//
// preload the parrot sounds

function preload(){

  // source: this spanish-speaking parrot from the youtubes.
  // https://www.youtube.com/watch?v=M3jf9K_LQYY
  sample[0] = loadSound("assets/sounds/parrot1.wav");
  sample[1] = loadSound("assets/sounds/parrot2.wav");
  sample[2] = loadSound("assets/sounds/parrot3.wav");
  sample[3] = loadSound("assets/sounds/parrot4.wav");
  sample[4] = loadSound("assets/sounds/parrot5.wav");
  sample[5] = loadSound("assets/sounds/parrot6.wav");
  sample[6] = loadSound("assets/sounds/parrot7.wav");
}



// setup()
//
// create canvas, create new game objects and start annyang.

function setup() {

  // set canvas to match window size
  createCanvas(window.innerWidth-20, window.innerHeight);

  textAlign(CENTER);
  rectMode(CENTER);
  textStyle(BOLD);
  textFont('Srisakdi');

  // create game objects:

  game = new GameSetup();
  parrot = new Parrot();

  // annyang initial setup:

  // add parrot.thank() and parrot.startover() commands.
  if(annyang){
    let permaCommands = {
      'good bird': parrot.thank,
      "let's start again": parrot.startOver,
    };

    //  voiceCommandsDescription = startingVoiceCommands;
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

      displayLoadingScreen();
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

  displayCountDown();
}



// rungame()
//
// setup annyang commands on first frame.
// trigger and update animations.
// update and display cards and guessing option buttons.

function runGame(){

  // if this is the first frame
  if(gameStarted){
    // set states
    gameStarted = false;
    loadScreenStarted = false;

    // set parrot location
    parrot.x = width/16;
    parrot.y = height/14;
    parrot.beakLength = width/20;

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

  // ------------ DISPLAY TEXT
  fill(0);

  // if reaction animation is running, display animation (and not the background).
  if(reactionY<reactYlimit){
    // animate main word display
    textSize(height/9+reactionY/4);
    fill(0, 0 +reactionY, 0 +reactionY*3);
  }
  else {
    // if reaction animation is not running, display the background.
    displayBackground(color(235, 235, 215));
    // stylize main word display
    textSize(height/9);
  }

  // ---------- display parrot
  parrot.motion+=0.5;
  parrot.state = "game";
  parrot.display();

  // display the word being "defined"
  fill(0);
  text(game.theWord, width/2-2, height/8-2);
  fill(245);
  text(game.theWord, width/2-4, height/8-4);
  fill(185, 24, 24);
  text(game.theWord, width/2, height/8);

  // dislay instructions and voice commands description below the title
  let instructions = 'pick a card and tell mr parrot whether this is the TRUE definition of the word above, the definition for a DIFFERENT word, or a FAKE definition';
  voiceCommandsDescription = startingVoiceCommands + cardVoiceCommands + optionsVoiceCommands;
  push();
  textFont('Helvetica');
  textSize(width/80);

  // display shaded text
  fill(185);
  text(voiceCommandsDescription, width/2-1, height/8-1 + height/16);
  text(instructions, width/2-1, height/8-1 + height/32);

  // display text
  fill(0);
  text(voiceCommandsDescription, width/2, height/8 + height/16);
  text(instructions, width/2, height/8 + height/32);
  pop();

  // display the cards
  if(reactionY>=reactYlimit){
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

  // animate reaction text
  react();
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
    game.readyToStart = false;
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
  voiceCommandsDescription = startingVoiceCommands;

  // reset counter
  guesses = 0;

  // stop animation
  reactionY += reactYlimit;

  // search for new words and definitions
  game = new GameSetup();
}
