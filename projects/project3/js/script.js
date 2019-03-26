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

function setup(){

  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
//  setupInstruments();
  loadMoves();
  setupBody();
}


function setupBody(){

  back = new Back();
  head = new Head();

  for (let i=0; i<2; i++){

    limbs.push(new Limb(200, 240, i*30, 50, armSpecs, 2,1-  2*i));
    limbs[limbs.length-1].changeCurrentMotion(armRunMotion, 10);
    limbs.push(new Limb(200, 130, 30-i*30, 60, legSpecs, 0,1- 2*i));
    limbs[limbs.length-1  ].changeCurrentMotion(legRunMotion, 10);
  }
}


function draw(){

  handleInput();

  background(25, 45, 135);
  camera(-200, 0, 400, 0, 0, 0, 0, 1, 0);

  translate(offsetX, offsetY, offsetZ);
//  checkGround();
  displayGround();
  displayDude();
}


function handleInput(){

  //velocity = map(mouseX, 0, width, 0, 2);
  velocity = 0.8;
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

  hipMove = sin( radians(frameCount*4))/20;
translate(hipMove*50, limbs[1].currentHeight, 0)
  rotateZ(PI+hipMove);

  rotateX( radians(back.leanForward));
  translate(-shoulderDistance/2,0,0);

  push();


     rotateZ(-5*hipMove);
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
  env1.setADSR(0.05, 0.2, 0.8, 0.4);
  env1.setRange(1, 0);
  synth.setType("square");
  synth.freq(50);
  synth.amp(env1);
  synth.start();

  synth2 = new p5.Oscillator();
  env2 = new p5.Envelope();
  env2.setADSR(0.05, 0.2, 0.8, 0.4);
  env2.setRange(1, 0);
  synth2.setType("square");
  synth2.freq(50);
  synth2.start();
}


function keyPressed(){

  if(key===" "){
    mouseHasBeenPressedOnce = true;

    limbs[0].fireTempMotion(armJumpMotion, 50, 20);
    limbs[2].fireTempMotion(armJumpMotion, 50, 20);
    limbs[1].fireTempMotion(legJumpMotion, 50, 20);
    limbs[3].fireTempMotion(legJumpMotion, 50, 20);
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

  groundFill = color(0);

  if(
    -1*abs(limbs[1].thigh.angle) + abs(limbs[1].current.thighDif) >= 0.163*PI
  ){
    groundFill = color(0, 255, 0);
    if(!beatStarted1){

      beatStarted1 = true;
      beatStarted2 = false;
      synth.freq( random(3, 6) * 20)
      env1.play();
    }
  }
  else if(
    abs(limbs[3].thigh.angle) - abs(limbs[3].current.thighDif) >= -0.1*PI
  ){
    groundFill = color( 255, 0, 0);
    if(!beatStarted2){

      beatStarted2 = true;
      beatStarted1 = false;
      synth2.freq( random(3, 6) * 20)
      env2.play();
    }
  }
}
