"use strict";

/*****************

Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!

******************/


let player;
let foods;
const PLAYER_SIZE = 100;
const FOOD_MAX_SIZE = 100;
const FOOD_MIN_SIZE = 10;
const SIZE_LOSS_OVER_TIME = 2;

// preload()
//
// Description of preload

function preload() {

}


// setup()
//
// Description of setup

function setup() {

  createCanvas(500, 500);
  let c1 = color(185, 185, 45);
  player = new Avatar(200, 200, PLAYER_SIZE, c1);
  let c2 = color(45, 185, 145);
  foods = new Food(100, 100, 50, c2);
}


// draw()
//
// Description of draw()

function draw() {
  fill(215, 45);
  rect(0, 0, width, height);
  player.update();

  if(player.collision(foods)){
    player.eat(foods);
  }

  player.display();
  foods.display();


}
