/*****************

Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!

******************/

"use strict";

let $spans;

$(document).ready(setup);

function setup(){

$spans = $("span");
// setInterval calls function repeatedly at a set interval
setInterval(update, 1000);

$spans.on("click", spanClicked)

}

function update(){
console.log("update!");
$spans.each(updateSpan);
}

function updateSpan(){
  console.log("span updated");
  let randomNumber = Math.random();
  let probability = 0.3;

  if(randomNumber<probability){
    $(this).removeClass("redacted");
    $(this).addClass("revealed");
  }
}

function spanClicked(){
  let isRevealed = $(this).hasClass("revealed");
  if(isRevealed){
    $(this).removeClass("revealed");
    $(this).addClass("redacted");
  }
}
