/*****************

Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!

******************/
"use strict";

let $fly;
let $mouth;

let buzz = new Audio("sounds/buzz.mp3");
let chew = new Audio("sounds/crunch.wav");

$(document).ready(setup);

function setup(){
  buzz.loop = true;

  console.log("ready")
$fly = $("#fly");
$mouth = $("#mouth");
$fly.on("mousedown", function(){

  buzz.currentTime = 0;
buzz.play();})


$fly.draggable({

  start: function() {
console.log("start drag");
$mouth.attr("src", "images/mouth-open.png");

  },
  drag: function() {
console.log("dragging");

  },
  stop: function() {
console.log("stop drag");
$mouth.attr("src", "images/mouth-closed.png");
buzz.pause();
  }
});


$mouth.droppable({
  accept: "#fly",
    drop: function() {
      $( this )
        console.log("dropped");
        $fly.hide();
        chew.play();
    }
  });
}
