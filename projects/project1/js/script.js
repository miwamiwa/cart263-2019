/*****************

Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!

******************/

"use strict";

let $hairs;

$(document).ready(setup);


function setup(){

  $("p").click(hairClicked);
  setInterval(update, 1000);
}

function update(){

  $("article").append(growHair);
  $("p").click(hairClicked);
}

function growHair(){
  
    let randomNum = Math.random();
    let newCharacter = "|"
    if(randomNum<0.8){
      newCharacter = "}";
    }
    if(randomNum<0.6){
      newCharacter = ";";
    }
    if(randomNum<0.4){
      newCharacter = "/";
    }
    if(randomNum<0.2){
      newCharacter = "[";
    }
    let newString = "<p>"+newCharacter+"</p>"
    return newString;

}

function hairClicked(){
  $(this).fadeOut(500, hairFaded);
  console.log("yo")
}

function hairFaded(){
  $(this).remove();
  console.log("bruh")
}
