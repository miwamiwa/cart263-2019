/*****************

Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!

******************/


"use strict";

$(document).ready(setup);

function setup(){
  /*
  FADE IN EFFECT

  USING A VARIABLE
  let $divs = $("div");
  $divs.hide();
  $divs.fadeIn(2000);
  */

  /* WITHOUT VARIABLES (SELECTION AND ACTION IN SAME LINE)*/
  $("div").hide();
  $("div").fadeIn(2000);

  /* CHAINED VERSION
  $("div").hide().fadeIn(2000);
  */

  /* CHAIN VERSION 2
  $("div")
    .hide()
    .fadeIn(2000);
  */
    $("div").on("click", fadeOne);
}

// with a function on completion
function fadeOne(){
  $(this).fadeOut(2000, fadeTwo);
}

// with an anonymous nested function on completion.
function fadeTwo(){
  $("div").fadeIn(1000, function(){
    console.log("oll korrect!");
  });
}
