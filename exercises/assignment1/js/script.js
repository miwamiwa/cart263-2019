"use strict";

/*****************

Circle Eater
Pippin Barr

A simple game in which the player controls a shrinking circle with their mouse and tries
to overlap another circle (food) in order to grow bigger.

******************/

// Constants defining key quantities
const AVATAR_SIZE_GAIN = 50;
const AVATAR_SIZE_LOSS = 1;
const MAX_SPEED = 10;

let frame =0;
let gameOverTextx = [];
let gameOverTexty = [];
let gameOverTextc = [];


// Avatar is an object defined by its properties
let avatar = {
  x: 0,
  y: 0,
  maxSize: 64,
  size: 64,
  active: true,
  color: '#cccc55'
}

// Food is an object defined by its properties
let food = {
  x: 0,
  y: 0,
  vx:0,
  vy:0,
  size: 64,
  color: '#55cccc'
}

// preload()
//
// Not needed

function preload() {

}


// setup()
//
// Create the canvas, position the food, remove the cursor

function setup() {
  createCanvas(windowWidth,windowHeight);
  positionFood();
  updateFoodVelocity();
  noCursor();
}


// draw()
//
// Move the avatar, check for collisions, display avatar and food

function draw() {
  frame +=1;
  // Make sure the avatar is still alive - if not, we don't run
  // the rest of the draw loop
  if (!avatar.active) {
    // By using "return" the draw() function exits immediately
    background(0);
  
    gameOverTextx.push(random(width));
    gameOverTexty.push(random(height));
    gameOverTextc.push(color(random(40), random(40), random(40)));

    for( let i=0; i<gameOverTextx.length; i++ ){

      fill(gameOverTextc[i]);
      text("game ovrr", gameOverTextx[i], gameOverTexty[i]);

    }

    fill(avatar.color);
    let avatarTextX = constrain(avatar.x, 20, width-20);
    let avatarTextY = constrain(avatar.y, 20, height-20);
    text(" you ", avatarTextX, avatarTextY);
    fill(food.color);
    let foodTextX = constrain(food.x, 50, width-50);
    let foodTextY = constrain(food.y, 20, height-20);
    text(" your freaking target ", foodTextX, foodTextY);
    let infoFill = color(random(255), random(255), random(255));
    stroke(infoFill);
    line(52, 18, 68, 2);
    line(68, 2, 63, 2);
    line(68, 2, 68, 7);
    noStroke();
    fill(infoFill);
    text(" refresh ", 10, 20);

    return;
  }
  if(frame%60===0)
  updateFoodVelocity();
  // Otherwise we handle the game
  background(0);
  updateAvatar();
  updateFood();
  checkCollision();
  displayAvatar();
  displayFood();
}

// updateAvatar()
//
// Set the position to the mouse location
// Shrink the avatar
// Set it to inactive if it reaches a size of zero
function updateAvatar() {
  avatar.x = mouseX;
  avatar.y = mouseY;
  // Shrink the avatar and use constrain() to keep it to reasonable bounds
  avatar.size = constrain(avatar.size - AVATAR_SIZE_LOSS,0,avatar.maxSize);
  if (avatar.size === 0) {
    avatar.active = false;
  }
}

// checkCollision()
//
// Calculate distance of avatar to food
// Check if the distance is small enough to be an overlap of the two circles
// If so, grow the avatar and reposition the food
function checkCollision() {
  let d = dist(avatar.x,avatar.y,food.x,food.y);
  if (d < avatar.size/2 + food.size/2) {
    avatar.size = constrain(avatar.size + AVATAR_SIZE_GAIN,0,avatar.maxSize);
    positionFood();
  }
}

// displayAvatar()
//
// Draw the avatar in its current position, using its size and color
// Use push() and pop() around it all to avoid affecting the rest of the program
// with drawing commands
function displayAvatar() {
  push();
  noStroke();
  fill(avatar.color);
  ellipse(avatar.x,avatar.y,avatar.size);
  pop();
}

// displayFood()
//
// Draw the food in its current position, using its size and color
// Use push() and pop() around it all to avoid affecting the rest of the program
// with drawing commands
function displayFood() {
  push();
  noStroke();
  fill(food.color);
  ellipse(food.x,food.y,food.size);
  pop();
}

// positionFood()
//
// Set the food's position properties to random numbers within the canvas dimensions
function positionFood() {
  food.x = random(0,width);
  food.y = random(0,height);
}

function updateFood(){

  food.x += food.vx;
  food.y += food.vy;
  if(food.x >= width || food.x <= 0 || food.y >= height || food.y <=0)
  updateFoodVelocity();


}

function updateFoodVelocity(){

  food.vx = random(-MAX_SPEED, MAX_SPEED);
  food.vy = random(-MAX_SPEED, MAX_SPEED);
}
