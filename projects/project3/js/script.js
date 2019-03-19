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
let legSpecs;
let armSpecs;

let hipDistance = 25;
let shoulderDistance = 20;

let offsetX=0;
let offsetY =0;
let offsetZ =0;

function setup(){

  armSpecs = {
    thighAngle: 20,
    thighOrigin: -PI/8,
    thighDisplacement: 0.2*PI,
    thighAngle2: 20,
    thighOrigin2: 10,
    thighDisplacement2: 10,
    kneeAngle: 100,
    kneeOrigin: 1.5*PI,
    kneeDisplacement: 0.8*PI,
    kneeConstrain:0,
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
    kneeConstrain:1* PI,
    leanX:0,
    leanY:-4,
  }

  legRunMotion = {
   thighPos:0.2*PI,
   kneePos:0.3*PI,
   thighDif:0.2*PI,
   kneeDif:0.5,
   speedDif:1,
   thighPos2:100,
   thighDif2:-10,
 }


  legJumpMotion = {
 thighPos:0,
 kneePos:4,
 thighDif:0,
 kneeDif:0,
 speedDif:5,
 thighPos2:30,
 thighDif2:-60,
 }

 armRunMotion = {
  thighPos:1.4,
  kneePos:-0.3*PI,
  thighDif:0,
  kneeDif:-0.3*PI,
  speedDif:1,
  thighPos2:-15,
  thighDif2:-30,
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


camera(-200, 0, 800, 0, 0, 0, 0, 1, 0);
rotateX(-PI/2);


  translate(offsetX, offsetY, offsetZ);
//  rotateY(PI+offsetY);
//translate(0, 0, 10);
rotateZ(PI);
//rotateY(radians(mouseY));
rotateX( radians(back.leanForward));
rotateY( sin(radians(frameCount/4))*10 );
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



velocity = 1;


noStroke();
fill(0);
//text("mouseover left/right to accelerate, space to jump", 10, height-20)

}

function keyPressed(){

  if(key===" "){

    limbs[0].fireTempMotion(armJumpMotion, 50, 20);
    limbs[2].fireTempMotion(armJumpMotion, 50, 20);
    limbs[1].fireTempMotion(legJumpMotion, 50, 50);
    limbs[3].fireTempMotion(legJumpMotion, 50, 50);
  }
}

function mousePressed(){
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
thighPos:-1.4*PI,
kneePos:-1,
thighDif:0.75*PI,
kneeDif:0.25*PI,
speedDif:0.7,
thighPos2:40,
thighDif2:20,
}
  limbs[0].fireTempMotion(armClickMotion, 25, 10);
  limbs[2].fireTempMotion(armClickMotion, 25, 10);
  limbs[1].fireTempMotion(legClickMotion, 25, 10);
  limbs[3].fireTempMotion(legClickMotion, 25, 10);
  back.leanForward *=-1;
}
