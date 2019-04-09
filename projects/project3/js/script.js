"use strict";

let limbs = [];
let back;
let head;
let velocity = 1;
let jumpTimer = 0;
let hipDistance = 25;
let shoulderDistance = 20;

let legRunMotion;
let legJumpMotion;
let armRunMotion;
let armJumpMotion;
let armRunMotion2;
let legSpecs;
let armSpecs;

let vigor = 0.5;

let offsetX=0;
let offsetY =-50;
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


function setup(){

  frameRate(50);
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  setupInstruments();
  loadMoves();
  setupBody();
}


function setupBody(){

  back = new Back();
  head = new Head();
  uiObject = new UI();
  musicObject= new Music();

  for (let i=0; i<2; i++){

    limbs.push(new Limb(200, 240, height/15, armSpecs, 2,1-  2*i));
    limbs[limbs.length-1].changeCurrentMotion(armRunMotion, 10);
    limbs.push(new Limb(200, 130, height/13, legSpecs, 0,1- 2*i));
    limbs[limbs.length-1  ].changeCurrentMotion(legRunMotion, 10);
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
  checkGround();
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
    case "z": tempMotion1(); break;
    case "x": danceMotion1(); break;
    case "c": danceMotion0(); break;
  }
}


function mousePressed(){

  mouseHasBeenPressedOnce = true;
/*
  limbs[0].fireTempMotion(armJumpMotion, 55, 10);
  limbs[2].fireTempMotion(armJumpMotion, 55, 10);
  limbs[1].fireTempMotion(legsOnTheFloor, 32, 25);
  limbs[3].fireTempMotion(legsOnTheFloor, 32, 25);
*/
  uiObject.checkKnobs("press");
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
  translate(-100, 100, -100)
  rotateX(PI/2.1)
  noStroke();
  rect(0, 0, 200, 200);
  pop();
}


function checkGround(){

}
