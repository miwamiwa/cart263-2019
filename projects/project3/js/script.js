"use strict";

let velocity = 1;
let ellipses;

let currentMoves = 0;
let armMoves = [6];
let legMoves = [6];
let vigor = [0.5, 0.5, 0.5, 0.5];
let offsetX=0;
let offsetY =0;
let offsetZ =-100;
let groundFill =0;
let uiObject;
let musicObject;
let canvas;
let dude;
let pictureTaken = false;
let fft;
let camOffsetX =0;
let camOffsetY =0;



function setup(){

  musicObject= new Music();
  musicObject.setupInstruments();
  fft = new p5.FFT();

//  localStorage.clear(); // Clears everything in local storage
  ellipses = new Ellipses();

  loadMoves();
  uiObject = new UI();
  loadSavedGame();

  frameRate(30);
  canvas = createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  uiObject.placeUI();
  setKnobs();
  canvas.parent('theDiv');
  dude = new Dude();
  newDanceMotion();

  positionText(width/2, height*0.05, "#title");

  camera(0, -100, 400, 0, 0, 0, 0, 1, 0);
  ortho();

  uiObject.getValues();

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
  musicObject.playMusic();
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

  currentMoves =input;
  newDanceMotion();
  setKnobs();
}


function mousePressed(){

  uiObject.checkKnobs("press");

  if(mouseButton===RIGHT){
    saveInfo();
  }
}

function mouseDragged(){

  uiObject.checkKnobs("drag");
}

function mouseReleased(){

  uiObject.checkKnobs("stop");
}


function displayGround(){

  push();
  fill(groundFill);
  translate(-100,170, -100)
  rotateX(PI/2.1)
  noStroke();
  rect(0, 0, 200, 200);
  pop();
}


function loadSavedGame() {

  let storedData = localStorage.getItem('storage');

  if (storedData === null) {
    return false;
  }

  let gameData = JSON.parse(storedData);

  legMoves = gameData.legMoves;
  armMoves = gameData.armMoves;
  vigor = gameData.vigor;
  uiObject.timelines = gameData.timelines;
  musicObject.attack = gameData.attack;
  musicObject.release = gameData.release;
  musicObject.filterRes = gameData.filterRes;
  musicObject.delayFeedback = gameData.delayFb;
  musicObject.filterFreq = gameData.filterFreq;
  musicObject.delayDividor = gameData.delayDiv;

  return true;
}

function setKnobs(){

  let whichMove = armMoves[currentMoves];
  let whichMove2 = legMoves[currentMoves];

  uiObject.pads[0].setValue(whichMove.thighDif, whichMove.thighPos, 0);
  uiObject.pads[1].setValue(whichMove.thighDif2, whichMove.thighPos2, 1);
  uiObject.pads[2].setValue(whichMove.kneeDif, whichMove.kneePos, 0);
  uiObject.pads[3].setValue(whichMove2.thighDif, whichMove2.thighPos, 0);
  uiObject.pads[4].setValue(whichMove2.thighDif2, whichMove2.thighPos2, 1);
  uiObject.pads[5].setValue(whichMove2.kneeDif, whichMove2.kneePos, 0);
  uiObject.pads[6].setValue(musicObject.release[0], musicObject.attack[0], 2);
  uiObject.pads[7].setValue(musicObject.filterRes[0], musicObject.filterFreq[0], 3);
  uiObject.pads[8].setValue(musicObject.delayFeedback[0], musicObject.delayDividor[0], 4);
  uiObject.pads[9].setValue(musicObject.release[1], musicObject.attack[1], 2);
  uiObject.pads[10].setValue(musicObject.filterRes[1], musicObject.filterFreq[1], 3);
  uiObject.pads[11].setValue(musicObject.delayFeedback[1], musicObject.delayDividor[1], 4);

  uiObject.sliders[0].setValue(whichMove2.height, 1);
  uiObject.sliders[1].setValue(vigor[currentMoves], 2);
}


function saveInfo(){

  let sendData = {
    armMoves: armMoves,
    legMoves: legMoves,
    vigor: vigor,
    timelines: uiObject.timelines,
    attack: musicObject.attack,
    release: musicObject.release,
    filterRes: musicObject.filterRes,
    filterFreq: musicObject.filterFreq,
    delayFb: musicObject.delayFeedback,
    delayDiv: musicObject.delayDividor,
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
