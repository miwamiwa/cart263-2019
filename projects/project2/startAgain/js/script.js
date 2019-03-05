"use strict";

/*****************

Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!

https://od-api.oxforddictionaries.com/api/v1
app_id 8e3dbc60
app_key 	46ee0a1c78e6ca4d0c6a3856fbfede81


https://cors-anywhere.herokuapp.com/


******************/

let maxGuesses = 3;
let guesses =0;
let points =0;
let failedRounds =0;
let incorrectGuess =0;

let gameRestarted = false;

let newGame;

let gameOverY  =0;
let strikeOut = 5;
let maxFailedRounds = 1;

let animator =[];
let animationLength = 40;
let animationTimer = animationLength;

let cueStartAgain = false;
let readyToContinue = false;
let currentlyGuessing = false;

let startScreen  = true;
let game;
let roundOverText;
let numberOfEllipses = 8;
let gameOver = false;
let gameOverClickable = false;
let whichCard;
let gameStarted = false;

let parrot;

let sample = [];
sample[0] = new Audio("assets/sounds/parrot1.wav");
sample[1] = new Audio("assets/sounds/parrot2.wav");
sample[2] = new Audio("assets/sounds/parrot3.wav");
sample[3] = new Audio("assets/sounds/parrot4.wav");
sample[4] = new Audio("assets/sounds/parrot5.wav");
sample[5] = new Audio("assets/sounds/parrot6.wav");
sample[6] = new Audio("assets/sounds/parrot7.wav");

 let commands;
/*
if(annyang){
  annyang.removeCommands("okay");

  commands = {
    'I give up': giveUp,
  'say it again': sayAgain,
'I think it is *answer': proposeAnswer
};

  // initialize annyang, overwriting any previously added commands
  annyang.addCommands(commands);
}

*/

// preload()
//
// Description of preload

function preload() {

}


// setup()
//
// Description of setup

function setup() {
  textAlign(CENTER);
  rectMode(CENTER);

for(let i=0; i<numberOfEllipses; i++){
  animator.push(i);
}
  createCanvas(window.innerWidth-50, window.innerHeight);
  game = new GameSetup();
  parrot = new Parrot();

  if(annyang){
    let permaCommands = {
      'nice': parrot.thank,

  };

    // initialize annyang, overwriting any previously added commands
    annyang.addCommands(permaCommands);
    annyang.start();
}

}


// draw()
//
// Description of draw()

function draw() {



if(startScreen){
  displayStartScreen();
}
else {

if(game.readyToStart && !gameOver){

  if(gameStarted){
    gameStarted = false;

      squak("the word is "+game.theWord);

      if(annyang){
        commands = {
          'say the word again': parrot.sayWordAgain,
        'define the word': parrot.defineWord,
      'can we start over': parrot.startOver
      };
        // initialize annyang, overwriting any previously added commands
        annyang.addCommands(commands);
    }

  }

  background(235);
fill(0);
textSize(100);
textAlign(CENTER);
text(game.theWord, width/2, 112);


for (let j=0; j<game.numberOfCards; j++){
  game.cards[j].display();
  game.cards[j].update();
}

for (let j=0; j<game.numberOfCards; j++){
  if(game.cards[j].optionsRevealed){
    game.cards[j].options();
  }
  else {
    game.cards[j].commandsSetup = false;
  }
}

handleScore();
}
else if(gameOver){

  displayGameOverScreen();
}
else {
  background(125);
  fill(255);
  text("loading!", width/2, height/2);

  displayEllipses();
}
}

if(cueStartAgain && !gameRestarted){

  roundOverText = "click to start next round.";
  clearTimeout(newGame);
  console.log("CUE NEW ROUND")
  newGame = setTimeout( startNewRound, 1000);
  gameRestarted = true;
  cueStartAgain = false;

}

fill(255);
textSize(45);
text(roundOverText, width/2, height-50);
}


function   squak(input){
    let randomPick = floor(random(7));
    sample[randomPick].currentTime = 0;
    sample[randomPick].volume = 0.9;
    sample[randomPick].play();

    sample[randomPick].onended = function(){
      responsiveVoice.speak(input, parrot.voice, {
        pitch: parrot.pitch,
        rate: parrot.rate,

      });
    }
  }

function mousePressed(){

if(startScreen){

  startScreen = false;
  currentlyGuessing = true;
  squak("Hello and welcome to true different or fake! You can talk to me, or go ahead and click through the game.");
  setTimeout(function(){ currentlyGuessing = false; }, 300);
}
else if(gameOver&&gameOverClickable){
  gameOverClickable = false;
  gameOver = false;
  guesses =0;
  points =0;
  failedRounds =0;
  gameOverY  =0;
  game = new GameSetup();
}

}

function displayStartScreen(){

  background(235);

  textSize(20);
  let startTitle = "welcome to real, different or fake!";
  text(startTitle, width/2, height/4, width-50, (height-50)/4);
  let startDescription =
  "that day mr. parrot put on his smartee brand pants and flew to the dictionary, flapping through pages and stopping on random ones. "
  + "\nhe squawked: 'rwaak! let's play a game! i'll state word, then i'll suggest a definition. "
  + "\nyou tell me if it's the real definition, a definition for a different word, or a fake definition. "
  + "\nsquawk! real, different or fake! perhaps all i can do is repeat things, but i bet you can't tell what's true!"
  + "\n\n\nclick to start";
  text(startDescription, width/2, height/2, width-50, (height-50)/2);
}

function displayGameOverScreen(){

fill(145, 215, 110, 3+gameOverY/10);
rect(width/2, height/2, width, height);
gameOverY+=2;
if(gameOverY<1*height/2){
  fill(255-gameOverY);
  textSize(45+gameOverY*3);
  text("game over!", width/2, height/2+gameOverY*0.3, width, height);
  roundOverText = "";
}
roundOverText = "click to restart";

}

function startNewRound(){

  cueStartAgain = false;
  currentlyGuessing = false;
  gameStarted = true;
  guesses = 0;
  incorrectGuess =0;
  roundOverText = "";
console.log("NEW ROUND")
  game = new GameSetup();
}

function displayEllipses(){

  for(let i=0; i<numberOfEllipses; i++){
    let ellipseX = width/3;
    let ellipseY = height/2;
    let ellipseR;

    if(frameCount<animationTimer){
      animator[i]+=10;
    } else {
      animator[i] +=i;
    }

    ellipseR = 12*i + sin( radians( 180*animator[i]/100 ) )*20;
    stroke(255);
    noFill();
    ellipse(ellipseX, ellipseY, ellipseR, ellipseR);
  }
}


function shuffleCards(){

let positions = [];
  for(let i=0; i<game.numberOfCards; i++){
    positions.push(game.cards[i].x);
  }
  let shuffledPositions = shuffle(positions);
  for(let i=0; i<game.numberOfCards; i++){
    game.cards[i].x = shuffledPositions[i];
  }
}

function handleScore(){

  // display score
  fill(0);
  text("score : "+points, width-30, height-30);

  if(incorrectGuess>=strikeOut){

    cueStartAgain = true;
    failedRounds +=1;
  }

  if(guesses>=maxGuesses){
 cueStartAgain = true;
  }

  if(failedRounds >= maxFailedRounds){
    // game over. display score and restart.à
    gameOver = true;
    points =0;
    setTimeout(function(){gameOverClickable = true}, 500);

  }
}
