/*
JANUARY 8 2019 IN CLASS ACTIVITY
STEP BY STEP CIRCLE EATER
*/

"use strict";

let player = {
  x: 0,
  y: 0,
  maxSize: 100,
  currentSize: 100,
  isAlive: true,
  color: "#ff0000"
}

let target = {
  x: 0,
  y: 0,
  size: 10,
  color: "#0000ff"
}

const HEALTH_LOSS = 1;
const HEALTH_INCREASE = 50;


function setup(){

  createCanvas(windowWidth, windowHeight);
  resetFood();
  noCursor();
  rectMode(CENTER);
}

function draw(){

  background(0, 125, 85);
  updateAvatar();
  displayAvatar();
  displayFood();

  if(player.isAlive)
  checkCollisions();
}

function updateAvatar(){

  player.x = mouseX;
  player.y = mouseY;
  player.currentSize -= HEALTH_LOSS;
  player.currentSize = constrain(player.currentSize, 0, player.maxSize);

  if(player.currentSize ===0)
  player.isAlive = false;
}

function displayAvatar(){

  push();
  noStroke();
  fill(player.color);
  ellipse(player.x, player.y, player.currentSize, player.currentSize);
  pop();
}

function displayFood(){

  push();
  noStroke();
  fill(target.color);
  rect(target.x, target.y, target.size, target.size);
  pop();
}

function checkCollisions(){

  let distance = dist(target.x, target.y, player.x, player.y);

  if(distance <= target.size/2 + player.currentSize){
    player.currentSize += HEALTH_INCREASE;
    player.currentSize = constrain(player.currentSize, 0, player.maxSize);
    resetFood();
  }
}

function resetFood(){

  target.x = random(width);
  target.y = random(height);
}
