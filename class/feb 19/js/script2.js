/*****************

Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!

******************/
"use strict";
let currentPitch= 2;
let singing;
let drumming;

$(document).ready(preload);

function preload(){
  $("html").click(setup);
}

function setup(){

  $("html").off();
//  responsiveVoice.speak("hello world", "UK English Male", {pitch: 2});


drumming = setInterval(sayBoom, 1200);
}

function sayBoom(){
  responsiveVoice.pause();
  responsiveVoice.speak("boom", "UK English Female", {
    pitch: 0,
    rate: 0
  });
}

function sayLa(){
  responsiveVoice.pause();
  responsiveVoice.speak("la", "UK English Male", {
    pitch: currentPitch,
    rate: 2
  });
  currentPitch -= 0.4;

  if(currentPitch < 0){
    stopLa();
  }
}

function stopLa(){
  currentPitch = 2;

}
