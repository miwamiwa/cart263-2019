"use strict";

/*****************

Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!

******************/

let square;
let circle;
let line1;
let line2;


// preload()
//
// Description of preload

function preload() {

}


// setup()
//
// Description of setup

function setup() {
createCanvas(windowWidth, windowHeight);
square  = new Square(width/2, height/2, width/20);
let myColor = color(185, 185, 25);
circle = new Circle(random(width), random(height), width/20, myColor);
let lineColor = color(25, 185, 185);
line1= new Line(random(width), random(height), random(width), random(height), undefined, lineColor)
let line2Color = color(185, 25, 185);
line2= new Line(random(width), random(height), random(width), random(height), undefined, line2Color)
}


// draw()
//
// Description of draw()

function draw() {
  fill(185, 185, 185, 12);
  rect(0, 0, width, height);
square.update();
square.display();
circle.update();
circle.display();
line1.update();
line1.display();
line2.update();
line2.display();
}
