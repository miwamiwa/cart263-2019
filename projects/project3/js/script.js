"use strict";

let limbs = [];
let back;
let head;
let velocity = 1;
let jumpTimer = 0;
let hipDistance = 25;
let shoulderDistance = 20;

let currentMoves = 0;

let armMoves = [6];
let legMoves = [6];



let legSpecs;
let armSpecs;

let vigor = 0.5;

let offsetX=0;
let offsetY =0;
let offsetZ =-100;
let groundFill =0;

let beatStarted1 = false;
let beatStarted2 = false;
let synth;
let synth2;
let env2;
let env1;

let envelopes = [3];
let synths = [3];

let mouseHasBeenPressedOnce = false;

let hipMove;

let rootNote = 50;
let legNotes = [0, 5, 5, 0, 2, 3, 5, 7, 3];
let legNoteCounter =0;

let armNotes = [8, 9, 8, 9, 4, 6, 4, 6];
let armNoteCounter =0;

let uiObject;
let musicObject;
let canvas;


function setup(){

//  localStorage.clear(); // Clears everything in local storage


  loadMoves();
  uiObject = new UI();

  loadSavedGame();


  musicObject= new Music();
  frameRate(50);
  canvas = createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  canvas.parent('theDiv');
  setupInstruments();

  setupBody();
  newDanceMotion();


}


function setupBody(){

  back = new Back();
  head = new Head();


  for (let i=0; i<2; i++){

    limbs.push(new Limb(200, 240, height/16, armSpecs, 2,1-  2*i));
    limbs.push(new Limb(200, 130, height/14, legSpecs, 0,1- 2*i));
  }


}


function draw(){

  handleInput();

  background(25, 45, 135);
  camera(0, -100, 400, 0, 0, 0, 0, 1, 0);
  // camera function that saved my soul
  ortho();

  uiObject.displayBackground();

  push();
  translate(offsetX, offsetY, offsetZ);
  displayGround();
  displayDude();
  pop();


  uiObject.displayMusicEditor();
  musicObject.playMusic();

push();
translate(-width/2, -height/2, 0);
uiObject.displayKnobs();
pop();

}


function handleInput(){

  //velocity = map(mouseX, 0, width, 0, 2);
velocity = 1;
  if(keyIsPressed){
    switch(key){
      case "w": offsetZ -=1; break;
      case "s": offsetZ +=1; break;
      case "a": offsetX -= 1; break;
      case "d": offsetX += 1; break;
    }
  }
}


function displayDude(){
scale(2);
  hipMove = sin( radians(frameCount*4))/20 * velocity;
  translate(hipMove*100, limbs[1].currentHeight, 0)
  rotateZ(PI+hipMove);

  rotateX( radians(back.leanForward));
  translate(-shoulderDistance/2,0,0);

  push();
  rotateZ(-3*hipMove);
  limbs[1].update();

  translate(shoulderDistance, 0, 0);
  limbs[3].update();
  pop();

  push();
  translate(0, back.length, hipDistance/2- shoulderDistance/2 );
  limbs[0].update();

  translate(hipDistance, 0, 0);
  limbs[2].update();
  pop();

  back.update();
  back.display();
  head.update();
  head.display();
}


function setupInstruments(){

for (let i=0; i<3; i++){
  switch(i){
    case 0:
    synths[i] = new p5.Oscillator();
    synths[i].setType("sine");
    synths[i].freq(50);
    break;

    case 1: synths[i] = new p5.Oscillator();
    synths[i].setType("square");
    synths[i].freq(50);
    break;

    case 2: synths[i] = new p5.Noise();

    break;
  }

  envelopes[i] = new p5.Envelope();
  envelopes[i].setADSR(0.01, 0.05, 0.01, 0.2);
  envelopes[i].setRange(1, 0);

  synths[i].amp(envelopes[i]);
  synths[i].start();
}
}


function keyPressed(){

  switch(key){
    case "1":
    currentMoves =0;
    newDanceMotion();
    setKnobs();
    break;
    case "2":
    currentMoves =1;
    newDanceMotion();
    setKnobs();
    break;
    case "3":
    currentMoves =2;
    newDanceMotion();
    setKnobs();
    break;
    case "4":
    tempMotion(3);
    break;
    case "5":
    tempMotion(4);
    break;
    case "6":
    tempMotion(5);
    break;
  }
}


function mousePressed(){

  mouseHasBeenPressedOnce = true;

  uiObject.checkKnobs("press");

  if(mouseButton===RIGHT){
    saveInfo();
    console.log(armMoves);
    console.log(legMoves);
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

  console.log("Loading words...");
  let storedData = localStorage.getItem('storage');
  if (storedData === null) {
    return false;
    console.log("load failed!");
  }
  console.log("... load successful.");
  let gameData = JSON.parse(storedData);

// assign saved pad positions, and update motion accordingly
/*
  for(let i=0; i<uiObject.pads.length; i++){
    uiObject.pads[i].valueX = gameData.padsX[i];
    uiObject.pads[i].valueY = gameData.padsY[i];
    uiObject.pads[i].getValue();
  }
*/
  legMoves = gameData.legMoves;
  armMoves = gameData.armMoves;

  setKnobs();

// assign saved slider positions
  for(let i=0; i<uiObject.sliders.length; i++){
    uiObject.sliders[i].position = gameData.sliders[i];
    uiObject.sliders[i].getValue();
  }

// assign saved music timelines
  uiObject.timelines = gameData.timelines;

  return true;
}

function setKnobs(legMove, armMove){
  let whichMove = armMoves[currentMoves];
  let whichMove2 = legMoves[currentMoves];


    uiObject.pads[0].setValue(whichMove.thighDif, whichMove.thighPos, 0);
    uiObject.pads[1].setValue(whichMove.thighDif2, whichMove.thighPos2, 1);
    uiObject.pads[2].setValue(whichMove.kneeDif, whichMove.kneePos, 0);
    uiObject.pads[3].setValue(whichMove2.thighDif, whichMove2.thighPos, 0);
    uiObject.pads[4].setValue(whichMove2.thighDif2, whichMove2.thighPos2, 1);
    uiObject.pads[5].setValue(whichMove2.kneeDif, whichMove2.kneePos, 0);
}


function saveInfo(){

  let sendData = {
    padsX: [],
    padsY: [],

    armMoves: armMoves,
    legMoves: legMoves,

    sliders: [],
    vigor: vigor,
    timelines: uiObject.timelines,
  }

/*
  for (let i=0; i< uiObject.pads.length; i++){
    sendData.padsX.push( uiObject.pads[i].valueX );
    sendData.padsY.push( uiObject.pads[i].valueY );
  }
*/

  for (let i=0; i<uiObject.sliders.length; i++){
    sendData.sliders.push( uiObject.sliders[i].position );
  }

  let setDataAsJSON = JSON.stringify(sendData);
  // Save the JSON string to storage as 'words'
  localStorage.setItem('storage',setDataAsJSON);
}
