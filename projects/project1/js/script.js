/*****************

Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!

******************/

"use strict";
let spansRemoved = false;
let $hairs;
let chars =0;
let textLoop =0;
let numberOfIntroFrames=5;
let sample1 = new Audio("assets/sounds/etta.mp3");
let sample2 = new Audio("assets/sounds/ride2.wav");
let stopSample;
let isPlaying=false;
let gameOver = false;
let milestone1reached = false;
let milestone2reached = false;
let milestone3reached = false;
let gameOn;

// fire setup function on load
$(document).ready(setup);

// setup()
//
//

function setup(){
console.log("ctrl+R if sound doesn't play correctly (in promise DOMexception)")
  // hide unwanted html elements
  $(".introText").hide();
  $("#face").hide();
  $("#beard").hide();

  // setup the first intro text frame
  setupText("#text0");

  // listen for mouse hovering over text
  $(".stillChar").mouseenter(makeItFall);

  // loop falling animation
  setInterval(fall, 10);

  // setup sound
  sample2.loop = true;
  sample2.playbackRate = 0.5;
  sample2.volume = 0.9;

  // start background sound (crash cymbal)
  sample2.play();

  // listen for spacebar keypress
  $('body').on("keypress", resetThisText);
}

// fall()
//
// loops through the falling text animation

function fall(){

// don't continue if nothing is falling
  if($("span").hasClass("fallingChar")){

    // declare a variable that tells us if everything fell or not
    let notAllFellYet = false;

    // for each falling character
    for(let i=0; i<chars; i++){

      // make up a variable to select this character's id
      let selector = "#char"+i;
      // if this character is falling
      if($(selector).hasClass("fallingChar")){
        // get this char's y position and convert that to a number by removing "px"
        let thisString = $(selector).css("top");
        let yPos = thisString.substr(0,thisString.length-2);

        // if this character hasn't reached the bottom
        if(yPos<500){
          // update position
          let newPos = Math.round(+yPos+10)+"px";
          $(selector).css("top", newPos);
          // indicate a character is still falling
          notAllFellYet = true;
        } else {
          // if character reached the end, update class
          $(this).removeClass("fallingChar");
          $(this).addClass("fallenChar");
        }
      }

    }
    // if any characters are still hanging up there,
    // not all characters have fallen.
    if($("span").hasClass("stillChar")){
      notAllFellYet = true;
    }
    // if all characters have fallen,
    // fade out and remove spans
    if(!notAllFellYet){
      $("span").fadeOut("slow", removeSpans);
      return;
    }
  }
}

// resetthistext()
//
// press space to reset text.
// this removes spans and fires setupText() without updating var textLoop

function resetThisText(){

  $("span").remove();
  let nextText = "#text"+textLoop;
  chars =0;
    setupText(nextText);
}


// removespans()
//
// remove all spans and setup the next intro frame, or the game.

function removeSpans(){
  if(!spansRemoved
  && $("span").hasClass("stillChar")===false
){
    spansRemoved=true;
  //console.log("yo")
  $("span").remove();
  textLoop +=1;
  let nextText = "#text"+textLoop;
  //console.log("next is "+nextText)
  chars =0;
  if(textLoop>numberOfIntroFrames){
    setupGame();
  }
  else {
    setupText(nextText);
  }


}
}

function makeItFall(){
  $(this).removeClass("stillChar");
  $(this).addClass("fallingChar");
  let thisAtt = "char"+chars;
  $(this).attr('id', thisAtt)
  let selector = "#"+thisAtt;
  $(selector).css("left", $(this).position().left+"px");
  $(selector).css("top", $(this).position().top+"px");
  //console.log("left "+$(this).position().left+"px");
  //console.log("top "+$(this).position().top+"px");
  chars +=1;
  startGranular(sample1);

}

function startGranular(sample){
  if(isPlaying){
    //clearTimeout(stopSample);
    return;
  }

  let startTime = Math.random()*15+sample.duration*0.70;
  //console.log(startTime);
  sample.currentTime = startTime;
  let length = Math.random()*(sample.duration-startTime)*9;
  sample.play();
  isPlaying = true;
  stopSample = setTimeout(function stopGranular(){
    sample.pause();
    isPlaying = false;
  }, length);
}



function setupText(selectedText){

  //console.log($(selectedText).html())


  let text = $(selectedText).html();

  for (let i=0; i<text.length; i++){
    let addSpace = "";
    if(text.charAt(i-1).trim() === ""&&i!=0){
      addSpace = " ";
    }
    if(text.charAt(i).trim()!=""){
    let thisChar = "<span class='stillChar'>"+addSpace+text.charAt(i)+"</span>";
    $(currentText).append(thisChar)

  }
  }
  spansRemoved = false;
    $(".stillChar").mouseenter(makeItFall);
}



function update(){
  if(!gameOver) {
  $("article").append(growHair);
  $("p").click(hairClicked);
  checkLastChild();
}
}

function growHair(){

  let randomNum = Math.random();
  let newCharacter = "ζ"
  if(randomNum<0.8){
    newCharacter = "θ";
  }
  if(randomNum<0.6){
    newCharacter = "Φ";
  }
  if(randomNum<0.4){
    newCharacter = "Ω";
  }
  if(randomNum<0.2){
    newCharacter = "λ";
  }
  let newString = "<p>"+newCharacter+"</p>"
  return newString;

}

function hairClicked(){
  $(this).fadeOut(500, hairFaded);
  //console.log("yo")
}

function hairFaded(){
  $(this).remove();
  //console.log("bruh")
}

function setupGame(){
  // stop looping the ride sample
sample2.loop = false;
sample1.loop = true;
sample1.currentTime = 0;
sample1.volume = 0.7;
sample1.play();
$("#top").append("<div class='ready'>ready</div>");
  $('body').off("keypress");
$("#infoSection").hide();
// wait until ride stops playing before loading the game.
// transition can get choppy otherwise
sample2.onended = function(){

  $("#face").show();
  $("#beard").show();
  gameOver = false;
  $(".ready").remove();
  $("p").click(hairClicked);
  gameOn = setInterval(update, 1000);

}

}


function checkLastChild(){
  if($( "article p:last-child" ).position().top > 300 && !milestone1reached){
    let thisMilestone = "<div id='milestone1' class='milestone'>"+"cut it!"+"</div>";
    $("body").append(thisMilestone);
    milestone1reached = true;
  }
  if($( "article p:last-child" ).position().top > 600 && !milestone2reached){
    let thisMilestone = "<div id='milestone2' class='milestone'>"+"cut harder!"+"</div>";
    $("body").append(thisMilestone);
    milestone2reached = true;
  }
  if($( "article p:last-child" ).position().top > 800 && !milestone3reached){
    let thisMilestone = "<div id='milestone3' class='milestone'>"+"aaaauuugh!!"+"</div>";
    $("body").append(thisMilestone);
    milestone3reached = true;
  }
  if($( "article p:last-child" ).position().top > 1000){
    let thisMilestone = "<div id='milestone4' class='milestone'>"+"accept your new beard and let her go, Sisyphus. <br>press space to play again"+"</div>";
    $("body").append(thisMilestone);
    gameOver = true;
    $("#faceImage").attr("src", "assets/images/sisyB.jpg");
    $("#face").css("background-color", "green");
    // listen for spacebar keypress
    $('body').on("keypress", resetGame);
    $("#milestone1").html("game over ↓");
    $("#milestone2").html("game over ↓↓");
    $("#milestone3").html("game over ↓↓↓");

  }
}

function resetGame(){
$('body').off("keypress");
  $("#face").hide();
  $("#beard").hide();
$("#faceImage").attr("src", "assets/images/sisyA.jpg");
  $("p").remove();
  $(".milestone").remove();
  milestone1reached = false;
  milestone2reached = false;
  milestone3reached = false;
  clearInterval(gameOn);
  sample2.loop = true;
  sample2.play();
  sample1.loop = false;
  sample1.pause();
  textLoop=0;
  resetThisText();
  $('body').on("keypress", resetThisText);
  $("#infoSection").show();
}
