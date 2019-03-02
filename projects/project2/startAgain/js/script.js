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
let strikeOut = 3;

let cueStartAgain = false;
let readyToContinue = false;
let currentlyGuessing = false;
let game;
let roundOverText;


// preload()
//
// Description of preload

function preload() {

}


// setup()
//
// Description of setup

function setup() {

  createCanvas(window.innerWidth-50, window.innerHeight);
  game = new GameSetup();

}


// draw()
//
// Description of draw()

function draw() {
background(125);
fill(255);
text("loading!", width/2, height/2);

if(game.readyToStart){
  background(235);

fill(0);
textSize(100);
textAlign(CENTER);
text(game.theWord, width/2, 112);
//console.log(numberOfCards);
for (let j=0; j<game.numberOfCards; j++){
//  console.log("hey")
  game.cards[j].display();
  game.cards[j].update();
}

for (let j=0; j<game.numberOfCards; j++){
  if(game.cards[j].optionsRevealed){
    game.cards[j].options();
  }
}

}

if(cueStartAgain){

  roundOverText = "strikeout! click to start next round.";
  setTimeout( readyForNewRound, 1000);
  cueStartAgain = false;
}

fill(0);
textSize(45);
text(roundOverText, width/2, height-50);
}


function readyForNewRound(){

  readyToContinue = true;
}


function mousePressed(){

  if(readyToContinue){
    readyToContinue = false;
    startNewRound();
  }
}

function startNewRound(){


  cueStartAgain = false;
  currentlyGuessing = false;
  guesses = 0;
  roundOverText = "";

  game = new GameSetup();
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
