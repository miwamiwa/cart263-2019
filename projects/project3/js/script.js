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

let offsetX=0;
let offsetY =0;
let offsetZ =0;
let groundFill =0;

let beatStarted1 = false;
let beatStarted2 = false;
let synth;
let synth2;
let env2;
let env1;
let mouseHasBeenPressedOnce = false;

let hipMove;

let rootNote = 50;
let legNotes = [0, 5, 5, 0, 2, 3, 5, 7, 3];
let legNoteCounter =0;

let armNotes = [8, 9, 8, 9, 4, 6, 4, 6];
let armNoteCounter =0;

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


  for (let i=0; i<2; i++){

    limbs.push(new Limb(200, 240, 50, armSpecs, 2,1-  2*i));
    limbs[limbs.length-1].changeCurrentMotion(armRunMotion, 10);
    limbs.push(new Limb(200, 130, 60, legSpecs, 0,1- 2*i));
    limbs[limbs.length-1  ].changeCurrentMotion(legRunMotion, 10);
  }
}


function draw(){

  handleInput();

  background(25, 45, 135);
  camera(-200, 0, 400, 0, 0, 0, 0, 1, 0);

  translate(offsetX, offsetY, offsetZ);
  checkGround();
  displayGround();
  displayDude();

}


function handleInput(){

  velocity = map(mouseX, 0, width, 0, 2);

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

  synth = new p5.Oscillator();
  env1 = new p5.Envelope();
  env1.setADSR(0.01, 0.05, 0.01, 0.2);
  env1.setRange(1, 0);
  synth.setType("square");
  synth.freq(50);
  synth.amp(env1);
  synth.start();


  synth2 = new p5.Oscillator();
  env2 = new p5.Envelope();
    env2.setADSR(0.01, 0.05, 0.1, 0.3);
  env2.setRange(0.4, 0);
  synth2.setType("square");
  synth2.freq(100);
  synth2.amp(env2);
  synth2.start();
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

  limbs[0].fireTempMotion(armJumpMotion, 55, 10);
  limbs[2].fireTempMotion(armJumpMotion, 55, 10);
  limbs[1].fireTempMotion(legsOnTheFloor, 32, 25);
  limbs[3].fireTempMotion(legsOnTheFloor, 32, 25);
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


function nextArmNote(){
  let rootNote2 = 48;
  synth2.freq( midiToFreq( rootNote2 + armNotes[armNoteCounter]));
        env2.play();
  armNoteCounter++;
  if(armNoteCounter>=armNotes.length){
    armNoteCounter=0;
  }
}

function nextLegNote(){
  let rootNote1 = 24;
  synth.freq( midiToFreq( rootNote1 + legNotes[legNoteCounter]));
        env1.play();
  legNoteCounter++;
  if(legNoteCounter>=legNotes.length){
    legNoteCounter=0;
  }
}
