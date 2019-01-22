"use strict";

/*****************

OOP Circle Eater
Pippin Barr

An Object-Oriented version of the Circle Eater program.
The player moves a circle around with the mouse.
Another circle represents food which the player eats by overlapping.
The player circle shrinks over time, but grows when it eats.

******************/

// Constants for key quantities
let avatarMaxSize = 85;
let score =0;

const AVATAR_SIZE_LOSS_OVER_TIME = 7;
const AVATAR_SIZE_LOSS_PER_FRAME = 1;
const FOOD_MIN_SIZE = 5;
const FOOD_MAX_SIZE = 100;
const FOOD_MAX_SPEED = 1;
const MAX_FOOD_AMOUNT = 20;

const INITIAL_FOOD_COUNT = 5;

// Variables to store the two key objects
let avatar;
let food = [];


// preload()
//
// Not needed

function preload() {

}


// setup()
//
// Create the canvas, avatar, and food, disable the cursor

function setup() {
  createCanvas(windowWidth,windowHeight);
  avatar = new Avatar(mouseX,mouseY,avatarMaxSize,AVATAR_SIZE_LOSS_PER_FRAME)

  for(let i=0; i<INITIAL_FOOD_COUNT; i++){
    food.push(new Food(random(0,width),random(0,height),FOOD_MIN_SIZE,FOOD_MAX_SIZE));
  }

  noCursor();
}


// draw()
//
// Clear the background
// Update the avatar and check for eating
// Display the avatar and food

function draw() {
  background(0);

  avatar.update();

  if(food.length<MAX_FOOD_AMOUNT && frameCount%300===0){
    food.push(new Food(random(0,width),random(0,height),FOOD_MIN_SIZE,FOOD_MAX_SIZE));
    avatarMaxSize -= AVATAR_SIZE_LOSS_OVER_TIME;
    avatar.maxSize = avatarMaxSize;
  }

  for(let i=0; i<food.length; i++){
    if (avatar.collide(food[i])) {
      if(!food[i].eaten){
      avatar.eat(food[i]);
    }
    }
    food[i].update();
    food[i].display();
  }


  avatar.display();

  displayScore();

}

function displayScore(){
  textAlign(CENTER);
  fill(245);
  textSize(15);
  text("score: "+score, width-80, height-20);

  if(!avatar.active){
    text("click to refresh", width/2, height/2);
  }
}

function mousePressed(){
  if(!avatar.active){
    location.reload();
  }
}
