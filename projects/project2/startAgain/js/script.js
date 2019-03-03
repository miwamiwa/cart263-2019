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


let guesses =0;
let points =0;
let failedRounds =0;

let gameOverY  =0;
let strikeOut = 3;
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
if(cueStartAgain){

  roundOverText = "strikeout! click to start next round.";
  setTimeout( readyForNewRound, 1000);
  cueStartAgain = false;
}

fill(255);
textSize(45);
text(roundOverText, width/2, height-50);
}


function readyForNewRound(){

  readyToContinue = true;
}


function mousePressed(){
if(startScreen){
  startScreen = false;
  currentlyGuessing = true;
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
else  if(readyToContinue){
    readyToContinue = false;
    startNewRound();
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
  guesses = 0;
  roundOverText = "";

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
  for(let i=0; i<numberOfCards; i++){
    positions.push(cards[i].x);
  }
  let shuffledPositions = shuffle(positions);
  for(let i=0; i<numberOfCards; i++){
    cards[i].x = shuffledPositions[i];
  }
}

function handleScore(){

  // display score
  fill(0);
  text("score : "+points, width-30, height-30);

  if(guesses>=10){
 cueStartAgain = true;
  }

  if(failedRounds >= maxFailedRounds){
    // game over. display score and restart.à
    gameOver = true;
    setTimeout(function(){gameOverClickable = true}, 500);
  }
}
