
"use strict";

let $fly;
let $mouth;

let buzz = new Audio("assets/sounds/buzz.mp3");
let chew = new Audio("assets/sounds/crunch.wav");
let ew = new Audio("assets/sounds/talk.wav");

$(document).ready(setup);

function setup(){

$fly = $("#fly");
$mouth = $("#mouth");

  buzz.loop = true;
$fly.on("mousedown", function(){

buzz.play();

});

$("#icecream").draggable({
  start: function(){
    $mouth.attr("src", "images/mouth-open.png");
  },
  revert: function(){
    if($("#icecream").position().left < 256
    && $("#icecream").position().top < 256){
      ew.currentTime =0;
      ew.volume = 0.2;
      ew.play();
      $mouth.attr("src", "images/mouth-closed.png");
      return true;
    }
    else {
      $mouth.attr("src", "images/mouth-closed.png");
      return false;
    }
  },
});

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
        buzz.pause();
    }
  });
}
