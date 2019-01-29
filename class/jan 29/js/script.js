"use strict";
let $fly;
let $mouth;

let buzz = new Audio("assets/sounds/buzz.mp3");

window.onload = function(){
  setTimeout(playStuff, 1000);
  /*
  let fly = document.getElementById("fly");
  fly.addEventListener("mousedown", function(){
    buzz.play().then(function(){
      console.log("playen")
    }).catch(function (error){
      console.log(error);
    });
  });
  */
}
function playStuff(){
  buzz.play();
}


/*
"use strict";

let $fly;
let $mouth;

let buzz = new Audio("sounds/buzz.mp3");
let chew = new Audio("sounds/crunch.wav");

$(document).ready(setup);

function setup(){
buzz.load();
$fly = $("#fly");
$mouth = $("#mouth");

  buzz.loop = true;
$fly.on("mousedown", function(){

buzz.play();

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
//buzz.pause();
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
*/
