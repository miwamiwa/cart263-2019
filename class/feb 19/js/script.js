/*****************

here i attempt to get two voices going at once.. doesnt werk


******************/
"use strict";
let currentPitch= 2;
let singing;
let drumming;

$(document).ready(preload);

function preload(){
  $("html").click(setup);
  //openInNewTab("http://127.0.0.1:3000/class/feb%2019/voice2.html")
}

function setup(){

  $("html").off();
//  responsiveVoice.speak("hello world", "UK English Male", {pitch: 2});

singing = setInterval(sayLa, 400);

}

function openInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
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


  if(currentPitch < 0){
    stopLa();
  }

  console.log(responsiveVoice.pitch)
}

function stopLa(){
  currentPitch = 2;

}
