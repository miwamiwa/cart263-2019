"use strict";

let limbs = [];
let arms = [];
let back;
let head;

let numberOfLimbs = 2;

let leanForward;
let camOffset=0;
let velocity = 1;

let jumpTimer = 0;

let  legRunMotion;
let legJumpMotion;
let armRunMotion;
let armJumpMotion;
let armRunMotion2;
let legSpecs;
let armSpecs;

let hipDistance = 25;
let shoulderDistance = 20;

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

function setup(){

  synth = new p5.Oscillator();
  env1 = new p5.Envelope();

  env1.setADSR(0.05, 0.2, 0.8, 0.4);
  env1.setRange(1, 0);

  synth.setType("sine");
  synth.freq(50);
  synth.amp(env1);
  synth.start();

  synth2 = new p5.Oscillator();
  env2 = new p5.Envelope();

  env2.setADSR(0.05, 0.2, 0.8, 0.4);
  env2.setRange(1, 0);

  synth2.setType("sine");
  synth2.freq(50);
  synth2.amp(env2);
  synth2.start();


  armSpecs = {
    thighAngle: 20,
    thighOrigin: -PI/8,
    thighDisplacement: 0.2*PI,
    thighAngle2: 20,
    thighOrigin2: 10,
    thighDisplacement2: 10,
    kneeAngle: 100,
    kneeOrigin: 0.8*PI,
    kneeDisplacement: 0.8*PI,
    kneeConstraint1:1* PI,
    kneeConstraint2:2* PI,
    leanX: 4,
    leanY: 10
  }

  legSpecs = {
    thighAngle: 20,
    thighOrigin: -PI/8,
    thighDisplacement: 3*PI/16,
    thighAngle2: 0,
    thighOrigin2: 0,
    thighDisplacement2: 3*PI/16,
    kneeAngle: 100,
    kneeOrigin: 20*PI/19,
    kneeDisplacement: 5*PI/7,
    kneeConstraint1: PI,
    kneeConstraint2:1.9* PI,
    leanX:0,
    leanY:-4,
  }

  legRunMotion = {
   thighPos:0.2*PI,
   kneePos:0.5*PI,
   thighDif:0.2*PI,
   kneeDif:0.2*PI,
   speedDif:1,
   thighPos2:30,
   thighDif2:-10,
 }


  legJumpMotion = {
 thighPos:0,
 kneePos:1*PI,
 thighDif:.5*PI,
 kneeDif:-1,
 speedDif:1,
 thighPos2:30,
 thighDif2:-60,
 }

 armRunMotion2 = {
  thighPos:1.4,
  kneePos:1*PI,
  thighDif:0,
  kneeDif:0.5*PI,
  speedDif:1,
  thighPos2:-15,
  thighDif2:-30,
}
armRunMotion = {
 thighPos:.5*PI,
 kneePos:0.3*PI,
 thighDif:-0.1*PI,
 kneeDif:0.6*PI,
 speedDif:1,
 thighPos2:-3,
 thighDif2:-80,
}


 armJumpMotion = {
thighPos:0.1,
kneePos:0.4,
thighDif:- 0.2*PI,
kneeDif:0,
speedDif:1,
thighPos2:1.2*PI,
thighDif2:0,
}

createCanvas(window.innerWidth, window.innerHeight, WEBGL);

strokeWeight(20);
frameRate(60);


back = new Back();
head = new Head();


for (let i=0; i<2; i++){
  limbs.push(new Limb(200, 240, i*23, 50, armSpecs, 2,1-  2*i));
  limbs[limbs.length-1].changeCurrentMotion(armRunMotion, 10);
  limbs.push(new Limb(200, 130, 23-i*23, 60, legSpecs, 0,1- 2*i));
  limbs[limbs.length-1  ].changeCurrentMotion(legRunMotion, 10);
  //arms.push(new Arm(200+i*15, 130, 23-i*23));
}
}


function draw(){


//background(0);
background(25, 45, 135);
if(keyIsPressed){
  switch(key){
    case "w": offsetZ -=1; break;
    case "s": offsetZ +=1; break;
    case "a": offsetX -= 1; break;
    case "d": offsetX += 1; break;
  }
}


camera(-200, 0, 400, 0, 0, 0, 0, 1, 0);
//rotateX(-PI/2);

  translate(offsetX, offsetY, offsetZ);
checkGround();
displayGround();
//  rotateY(PI+offsetY);
//translate(0, 0, 10);
rotateZ(PI);
//rotateY(radians(mouseY));
rotateX( radians(back.leanForward));
//rotateY( sin(radians(frameCount/4))*10 );
translate(10,0,0)
push();

limbs[1].update();

translate(shoulderDistance, 0, 0);
limbs[3].update();

pop();
push()
translate(0, back.length, hipDistance/2- shoulderDistance/2 );
limbs[0].update();


translate(hipDistance, 0, 0);
limbs[2].update();


pop();

back.update();
back.display();
head.update();
head.display();



velocity = map(mouseX, 0, width, 0, 2);
//velocity = 1;

noStroke();
fill(0);
//text("mouseover left/right to accelerate, space to jump", 10, height-20)

}

function keyPressed(){

  if(key===" "){

    limbs[0].fireTempMotion(armJumpMotion, 50, 20);
    limbs[2].fireTempMotion(armJumpMotion, 50, 20);
    limbs[1].fireTempMotion(legJumpMotion, 50, 20);
    limbs[3].fireTempMotion(legJumpMotion, 50, 20);
  }
}

function mousePressed(){

  mouseHasBeenPressedOnce = true;
  let legClickMotion = {
 thighPos:-(1.5+mouseX/width)*PI,
 kneePos:4,
 thighDif:+0.3*PI,
 kneeDif:+0.2*PI,
 speedDif:0.1,
 thighPos2:15,
 thighDif2:-30,
 }
 let armClickMotion = {
thighPos:.4*PI,
kneePos:-1,
thighDif:-0.75*PI,
kneeDif:0.25*PI,
speedDif:0.7,
thighPos2:-8,
thighDif2:20,
}
  limbs[0].fireTempMotion(armClickMotion, 25, 10);
  limbs[2].fireTempMotion(armClickMotion, 25, 10);
  limbs[1].fireTempMotion(legClickMotion, 25, 10);
  limbs[3].fireTempMotion(legClickMotion, 25, 10);
  back.leanForward *=-1;
}


function displayGround(){
  push();
  fill(groundFill);
  translate(-100, 100, -100)
  rotateX(PI/2.1)
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

    synth.freq( random(3, 6) * 100)
    env1.play();
    //console.log("one");
  }
}
else if(
abs(limbs[3].thigh.angle) - abs(limbs[3].current.thighDif) >= -0.1*PI
){
groundFill = color( 255, 0, 0);
if(!beatStarted2){
  beatStarted2 = true;
  beatStarted1 = false;

  synth2.freq( random(3, 6) * 100)
  env2.play();
//  console.log("two");
}
}
}
