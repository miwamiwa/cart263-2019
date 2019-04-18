"use strict";

let velocity = 1;
let offsetX=0;
let offsetY =0;
let offsetZ =-100;
let groundFill =0;
let camOffsetX =0;
let camOffsetY =0;

let ellipses;
let uiObject;
let musicObject;
let canvas;
let dude;
let fft;

let pictureTaken = false;
let soundStarted = false;



function setup(){

  //localStorage.clear(); // Clears everything in local storage
  musicObject= new Music();
  fft = new p5.FFT();
  ellipses = new Ellipses();
  dude = new Dude();
  loadMoves();
  uiObject = new UI();
  loadSavedGame();
  uiObject.setKnobs();

  frameRate(30);
  canvas = createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  canvas.parent('theDiv');

  newDanceMotion();
  positionText(width/2, height*0.05, "#title");
  camera(0, -100, 400, 0, 0, 0, 0, 1, 0);
  ortho();
}

function startSound(){

  soundStarted = true;
  musicObject.setupInstruments();
  uiObject.getValues();
  $("#instructions"). remove();
}


function draw(){

  background(25, 15, 55);
  uiObject.displayBackground();

  push();
  translate(offsetX, offsetY, offsetZ);
  displayGround();
  dude.displayDude();
  pop();

  uiObject.displayMusicEditor();

  if(soundStarted){
    musicObject.playMusic();
  }

  analyzeSound();

  push();
  translate(-width/2, -height/2, 0);
  uiObject.displayKnobs();
  pop();

}


function analyzeSound(){
  let analysis = fft.analyze();

  // energy is constrained between 0 and 255
  let hi = fft.getEnergy(5000, 20000);
  let mid = fft.getEnergy(350, 1000);
  let mid2 = fft.getEnergy(1000, 2000);
  let mid3 = fft.getEnergy(2000, 3000);
  let lo = fft.getEnergy(20, 300);

  let lightRow = height/2-130;
  let lightSpace = width/2-130;
  ellipses.displayEllipses(mid, 0.70, -lightSpace, lightRow, 5, 0, 250);
  ellipses.displayEllipses(mid2, 0.40, 0, lightRow, 5, 2, 250);
  ellipses.displayEllipses(mid3, 0.40, lightSpace, lightRow, 5, 3, 250);
  ellipses.displayEllipses(lo, 0.75, 0, 0, 20, 1, 400);

}


// keypressed()
//
// fire different moves on key press.

function keyPressed(){

  switch(key){
    case "1": startMoves(0); break;
    case "2": startMoves(1); break;
    case "3": startMoves(2); break;
    case "4": startMoves(3); break;
    case " ": pictureTaken = true; break;
  }
}

function startMoves(input){

  dude.currentMoves =input;
  newDanceMotion();
  uiObject.setKnobs();
}


function mousePressed(){

  if(soundStarted) uiObject.checkKnobs("press");
  if(mouseButton===RIGHT) saveInfo();
  if(!soundStarted) startSound();
}

function mouseDragged(){

  if(soundStarted) uiObject.checkKnobs("drag");
}

function mouseReleased(){

  if(soundStarted) uiObject.checkKnobs("stop");
}


function displayGround(){

  push();
  fill(groundFill);
  translate(-200,200, 99)
  rotateX(PI/2.1)
  noStroke();
  rect(0, 0, 400, 400);
  pop();
}


function loadSavedGame() {

  let storedData = localStorage.getItem('storage');

  if (storedData === null) {
    return false;
  }

  let gameData = JSON.parse(storedData);

  dude.legMoves = gameData.legMoves;
  dude.armMoves = gameData.armMoves;
  dude.vigor = gameData.vigor;
  uiObject.timelines = gameData.timelines;
  musicObject.attack = gameData.attack;
  musicObject.release = gameData.release;
  musicObject.filterRes = gameData.filterRes;
  musicObject.delayFeedback = gameData.delayFb;
  musicObject.filterFreq = gameData.filterFreq;
  musicObject.delayDividor = gameData.delayDiv;
  musicObject.maxAmplitude = gameData.ampLevels;

  return true;
}



function saveInfo(){

  let sendData = {
    armMoves: dude.armMoves,
    legMoves: dude.legMoves,
    vigor: dude.vigor,
    timelines: uiObject.timelines,
    attack: musicObject.attack,
    release: musicObject.release,
    filterRes: musicObject.filterRes,
    filterFreq: musicObject.filterFreq,
    delayFb: musicObject.delayFeedback,
    delayDiv: musicObject.delayDividor,
    ampLevels: musicObject.maxAmplitude,
  }

  let setDataAsJSON = JSON.stringify(sendData);
  localStorage.setItem('storage', setDataAsJSON);
}

function positionText(x, y, selector){

  let wid =0;
  let hei =0;
  if(selector==="#title") {
    wid = - $(selector).width()/2;
  }
  else {
    wid = - $(selector).width()/4 -10;
    hei = + $(selector).height()*1.5 + 40;
  }

  $(selector).css("left", x+wid+"px");
  $(selector).css("top", y+hei+"px");
}
