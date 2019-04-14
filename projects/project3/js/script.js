"use strict";

let limbs = [];
let back;
let head;

let velocity = 1;
let hipDistance = 25;
let shoulderDistance = 20;
let hipMove;
let currentMoves = 0;
let armMoves = [6];
let legMoves = [6];
let legSpecs;
let armSpecs;
let vigor = [0.5, 0.5, 0.5];

let offsetX=0;
let offsetY =0;
let offsetZ =-100;
let groundFill =0;

let envelopes = [3];
let synths = [3];
let filters = [3];
let delays = [3];
let attack = [0.1, 0.1];
let release = [0.1, 0.1];
let filterFreq = [100, 100];
let filterRes = [10, 10];

let uiObject;
let musicObject;
let canvas;

let pictureTaken = false;

let delayDividor = [0.5, 0.5];
let delayFeedback = [0.5, 0.5];

let camOffsetX =0;
let camOffsetY =0;

function setup(){

 // localStorage.clear(); // Clears everything in local storage

  loadMoves();
  uiObject = new UI();
  loadSavedGame();

  musicObject= new Music();
  musicObject.setupInstruments();

  frameRate(30);
  canvas = createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  uiObject.placeUI();
  setKnobs();
  canvas.parent('theDiv');
  setupBody();
  newDanceMotion();

}

// setupbody()
//
// create back, head, arms and legs objects

function setupBody(){

  // create back and head
  back = new Back();
  head = new Head();
  for (let i=0; i<2; i++){
    // create arm
    limbs.push(new Limb(200, 240, height/16, armSpecs, 2,1-  2*i));
    // create leg
    limbs.push(new Limb(200, 130, height/14, legSpecs, 0,1- 2*i));
  }
}


function draw(){

  handleInput();

  background(25, 45, 135);
  camera(0, -100, 400, 0, 0, 0, 0, 1, 0);
  ortho();  // camera function that saved my soul

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
  // scale the entire dude
  scale(2);

  // calculate hip motion
  hipMove = sin( radians(frameCount*4))/20 * velocity;


  translate(hipMove*100, limbs[1].currentHeight, 0)
  rotateZ(PI+hipMove);
  rotateX( radians(back.leanForward));
  translate(-shoulderDistance/2,0,0);

  // update & display leg 1
  push();
  rotateZ(-3*hipMove);
  limbs[1].update();
  // update & display leg 2
  translate(shoulderDistance, 0, 0);
  limbs[3].update();
  pop();
  // move to shoulder position
  push();
  translate(0, back.length, -shoulderDistance/2-hipDistance/2 );
  // update & display arm 1
  limbs[0].update();
  // update & display arm 2
  translate(hipDistance, 0, 0);
  limbs[2].update();
  pop();

  // update back and head position and display
  back.update();
  back.display();
  head.update();
  head.display();
}

// keypressed()
//
// fire different moves on key press.

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
    case " ": pictureTaken = true;
    break;
  }

}


function mousePressed(){

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

  let storedData = localStorage.getItem('storage');

  if (storedData === null) {
    return false;
  }

  let gameData = JSON.parse(storedData);

  legMoves = gameData.legMoves;
  armMoves = gameData.armMoves;
  vigor = gameData.vigor;
  uiObject.timelines = gameData.timelines;
  attack = gameData.attack;
  release = gameData.release;
  filterRes = gameData.filterRes;
  filterFreq = gameData.filterFreq;
  delayFeedback = gameData.delayFb;
  delayDividor = gameData.delayDiv;

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

  uiObject.pads[6].setValue(release[0], attack[0], 2);
  uiObject.pads[7].setValue(filterRes[0], filterFreq[0], 3);
  uiObject.pads[8].setValue(delayFeedback[0], delayDividor[0], 4);
  uiObject.pads[9].setValue(release[1], attack[1], 2);
  uiObject.pads[10].setValue(filterRes[1], filterFreq[1], 3);
  uiObject.pads[11].setValue(delayFeedback[1], delayDividor[1], 4);

  uiObject.sliders[0].setValue(whichMove2.height, 1);
  uiObject.sliders[1].setValue(vigor[currentMoves], 2);
}


function saveInfo(){

  let sendData = {
    armMoves: armMoves,
    legMoves: legMoves,
    vigor: vigor,
    timelines: uiObject.timelines,
    attack: attack,
    release: release,
    filterRes: filterRes,
    filterFreq: filterFreq,
    delayFb: delayFeedback,
    delayDiv: delayDividor,
  }

  let setDataAsJSON = JSON.stringify(sendData);
  localStorage.setItem('storage', setDataAsJSON);
}
