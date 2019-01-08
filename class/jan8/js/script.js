/*
JANUARY 8 2019 IN CLASS ACTIVITY
STEP BY STEP CIRCLE EATER
*/

"use strict";

// Global Variables

// avatar
let player = {
  x: 0,
  y: 0,
  maxSize: 100,
  currentSize: 100,
  isAlive: true,
  color: "#ff0000"
}

// food
let target = {
  x: 0,
  y: 0,
  size: 10,
  color: "#0000ff"
}

// constants
const HEALTH_LOSS = 1;
const HEALTH_INCREASE = 50;

// setup()
//
// creates canvas object and sets initial food location

function setup(){

  createCanvas(windowWidth, windowHeight);
  resetFood();
  noCursor();
  rectMode(CENTER);
}

// draw()
//
// loops the main game mechanics:
// updates avatar position and displays avatar and food.
// checks for avatar/food collisions as long as avatar is alive.

function draw(){

  background(0, 125, 85);
  updateAvatar();
  displayAvatar();
  displayFood();

  if(player.isAlive)
  checkCollisions();
}

// updateAvatar()
//
// assigns player's x, y position to match mouse's position
// updates and constrains player's size (health).
// handles death (surprisingly well).

function updateAvatar(){

  // update position
  player.x = mouseX;
  player.y = mouseY;

  // update and constrain size
  player.currentSize -= HEALTH_LOSS;
  player.currentSize = constrain(player.currentSize, 0, player.maxSize);

  // signal avatar's death
  if(player.currentSize ===0)
  player.isAlive = false;
}

// displayAvatar()
//
// assigns fill to the avatar and displays it as an ellipse

function displayAvatar(){

  push();
  noStroke();
  fill(player.color);
  ellipse(player.x, player.y, player.currentSize, player.currentSize);
  pop();
}

// displayFood()
//
// assigns the food's fill and displays it as a rectangle

function displayFood(){

  push();
  noStroke();
  fill(target.color);
  rect(target.x, target.y, target.size, target.size);
  pop();
}

// checkCollisions()
//
// calculate distance between avatar and food.
// if they overlap, increase player size and move food.

function checkCollisions(){

  // get distance between avatar and food
  let distance = dist(target.x, target.y, player.x, player.y);

  // trigger capture mechanics
  if(distance <= target.size/2 + player.currentSize/2){
    player.currentSize += HEALTH_INCREASE;
    player.currentSize = constrain(player.currentSize, 0, player.maxSize);
    resetFood();
  }
}

// resetFood()
//
// assign a random location on the canvas to the Food

function resetFood(){

  target.x = random(width);
  target.y = random(height);
}
