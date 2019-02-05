/*****************

Sisyphus' Beard
by Samuel Pare-Chouinard
description: miwamiwa.github.io/projects/project1/README.md

******************/

"use strict";

// declare game variables

// triggers
let spansRemoved = false;
let isPlaying=false;
let gameOver = false;
let milestone1reached = false;
let milestone2reached = false;
let milestone3reached = false;

// jquery selectors
let $hairs;
let $spans;

// counters
let chars =0;
let textLoop =0;
let numberOfIntroFrames=4;

// audio files
let sample1 = new Audio("assets/sounds/etta.mp3");
let sample2 = new Audio("assets/sounds/ride2.wav");

// variables that hold timeout() functions
let stopSample;
let gameOn;



// fire preload function on load
$(document).ready(preload);

// preload()
//
// a dummy function that forces a click before attempting to load sound,
// in an effort to bypass autoplay issues

function preload(){
  $("body").click(setup);
}

// setup()
//
//

function setup(){

  // setup html

  $("body").off();
  $(".preloadInfo").remove();
  $(".introText").hide();

  $("#top").show();
  $("#infoSection").show();

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

  $spans = $("span");

  // don't continue if nothing is falling
  if( $spans.hasClass("fallingChar" )){

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
        if(yPos<window.innerHeight-200){
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
    if( $spans.hasClass("stillChar")){
      notAllFellYet = true;
    }
    // if all characters have fallen,
    // fade out and remove spans
    if(!notAllFellYet){
      $spans.fadeOut("slow", removeSpans);
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
// remove all spans and continue to the next intro frame, or the game.

function removeSpans(){

  $spans = $("span");

  // if spans haven't been removed yet and no characters are hanging on top,
  if(
    !spansRemoved
    && $spans.hasClass("stillChar")===false
  ){
    // indicate that spans were removed
    spansRemoved=true;

    // remove all span elements
    $spans.remove();

    // start next part:

    // increment intro loop
    textLoop +=1;
    let nextText = "#text"+textLoop;
    chars =0;

    // if intro is over start game
    if(textLoop>numberOfIntroFrames){
      setupGame();
    }
    // else continue intro by setting up the next frame
    else {
      setupText(nextText);
    }
  }
}

// makeitfall()
//
// tell a character to start falling by updating class, id and css top/left

function makeItFall(){

  // update class
  $(this).removeClass("stillChar");
  $(this).addClass("fallingChar");

  // add css positioning (.fallingChar class uses fixed position):

  // select this span
  let thisAtt = "char"+chars;
  // give it an ID
  $(this).attr('id', thisAtt)
  // set css top/left to match span's previous in-line position
  let selector = "#"+thisAtt;
  $(selector).css("left", $(this).position().left+"px");
  $(selector).css("top", $(this).position().top+"px");

  // count fallen characters
  chars +=1;

  // shoot a sound
  startGranular(sample1);

}

// startgranular()
//
// here is a very simple granular synthesizor. the idea is that the synth
// plays a series of "grains" or very short samples randomly selected from
// a given section of a sample. no added frills, i suppose one could make
// this more interesting by crossfading between grains and filtering sounds.
//
// this synth checks if a grain is currently playing, then if not it picks
// a random starting point within a section of our sample, starts playing,
// and starts a timeout that will stop the sample.


function startGranular(sample){

  // do not continue if synth is already playing
  if(isPlaying){
    return;
  }

  // set length of section from which to randomly sample sound
  let sectionLength = 15;
  // set start time of the said section (% sample length)
  let sectionStart = 0.7;
  // generate random start time and set it
  let startTime = Math.random()*sectionLength+sample.duration*sectionStart;
  sample.currentTime = startTime;

  // set maximum possible grain length, then generate random grain length
  let maxGrainLength =9;
  let length = Math.random()*(sample.duration-startTime)*maxGrainLength;

  // play sample
  sample.play();
  isPlaying = true;

  // fire timer that fill stop the sample
  stopSample = setTimeout(function stopGranular(){
    sample.pause();
    isPlaying = false;
  }, length);
}


// setuptext()
//
// separates an introText div's individual characters into spans.
// sticks spaces into the next span (hovering over a space character
// doesn't work, it seems because there is no line to collide with)

function setupText(selectedText){

  // get this div's html content
  let text = $(selectedText).html();

  // for each character
  for (let i=0; i<text.length; i++){
    // declare a var to add space to this next span (or not)
    let addSpace = "";

    // if last character was a space, update addSpace.
    // works as long as first character in the string isn't space.
    if(text.charAt(i-1).trim() === ""&&i!=0){
      addSpace = " ";
    }

    // don't continue if the current character is a space
    if(text.charAt(i).trim()!=""){
      // create a new span with the stillChar class
      let thisChar = "<span class='stillChar'>"+addSpace+text.charAt(i)+"</span>";
      // append to currentText, the div used to display intro text
      $(currentText).append(thisChar)

    }
  }

  // reset spansRemoved trigger once all spans have been reset
  spansRemoved = false;
  // update mouse hover listener
  $(".stillChar").mouseenter(makeItFall);
}


// update()
//
// called periodically using setInterval.
// this updates the beard length, listens for mouse interaction and
// checks if the beard has reached any milestones.

function updateGameLoop(){

  // don't continue if game isn't running
  if(!gameOver) {
    // increase hair length
    $("article").append(growHair);
    // listen for clicks
    $("p").click(hairClicked);
    // check hair length
    checkLastChild();
  }
}

// growhair()
//
// pick a random greek character and throw it inside a <p> element

function growHair(){

  // get a random number
  let randomNum = Math.random();

  // either use this default character
  let newCharacter = "ζ"

  // or if our random number meets any of the following requirements,
  // pick another character:

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

  // return character inside a <p> element
  let newString = "<p>"+newCharacter+"</p>"
  return newString;

}

// hairclicked()
//
// fade out hair on click

function hairClicked(){
  $(this).fadeOut(500, hairFaded);

}

// hairfaded()
//
// remove <p> element upon hair fading out

function hairFaded(){
  $(this).remove();

}

// setupgame()
//
//

function setupGame(){

  // setup audio
  sample2.loop = false;
  sample1.loop = true;
  sample1.currentTime = 0;
  sample1.volume = 0.7;
  sample1.play();

  // display "ready" to point out user is clearly not ready
  $("#top").append("<div class='ready'>ready</div>");

  // turn off keypress listener and remove intro elements
  $('body').off("keypress");
  $("#infoSection").hide();

  // wait until intro sound stops playing then start the game
  sample2.onended = function(){

    // display game elements
    $("#face").show();
    $("#beard").show();

    // declare game started
    gameOver = false;

    // remove "ready" text
    $(".ready").remove();

    // star the game loop (hair growing, clicks, event triggers)
    gameOn = setInterval(updateGameLoop, 1000);

  }
}

// checklastchild()
//
// find the lowest hair element, check if it reached any milestones.
// milestones are bad but unavoidable
// milestones cause descriptive text to appear and eventually end the game.
// milestone text position is set using ID

function checkLastChild(){

  // get position of lowest <p> element in each "hair" article
  let lowest1 = $( "#hair1 p:last-child" ).position().top;
  let lowest2 = $( "#hair2 p:last-child" ).position().top;
  let lowest3 = $( "#hair3 p:last-child" ).position().top;

  // get highest value out of the three (lowest position)
  let hairs = [lowest1, lowest2, lowest3];
  let lowestP = Math.max.apply(Math,hairs);

  // if 1st milestone is hit
  if(lowestP > 500 && !milestone1reached){
    // remind the user to cut stuff
    let thisMilestone = "<div id='milestone1' class='milestone'>"+"cut it!"+"</div>";
    // append text
    $("body").append(thisMilestone);
    // prevent text from being added multiple times
    milestone1reached = true;
  }

  // if 2nd milestone is hit
  if(lowestP > 1000 && !milestone2reached){
    // tell user he suks
    let thisMilestone = "<div id='milestone2' class='milestone'>"+"cut harder!"+"</div>";
    $("body").append(thisMilestone);
    milestone2reached = true;
  }

  // if 3rd milestone is hit
  if(lowestP > 1500 && !milestone3reached){
    // tell user u're starting to freak out
    let thisMilestone = "<div id='milestone3' class='milestone'>"+"aaaauuugh!!"+"</div>";
    $("body").append(thisMilestone);
    milestone3reached = true;
  }

  // if 4th milestone is reached, game over.
  if(lowestP > 2000){

    // display gameover text below the hair line
    let thisMilestone = "<div id='milestone4' class='milestone'>"+"accept your new beard and let her go, Sisyphus. <br>press space to play again"+"</div>";
    $("body").append(thisMilestone);

    // indicate that game is over
    gameOver = true;

    // update face image (make sisyphus smile)
    $("#faceImage").attr("src", "assets/images/sisyB.jpg");

    // reset game using spacebar
    $('body').on("keypress", resetGame);

    // update milestone text to show that game is over
    $("#milestone1").html("game over ↓");
    $("#milestone2").html("game over ↓↓");
    $("#milestone3").html("game over ↓↓↓");

  }
}


// resetgame()
//
// turn game off and start intro from the top

function resetGame(){

  // turn off listeners and game loop
  $('body').off("keypress");
  clearInterval(gameOn);

  // hide game html
  $("#face").hide();
  $("#beard").hide();

  // remove generated beard
  $("p").remove();

  // remove milestones
  $(".milestone").remove();
  milestone1reached = false;
  milestone2reached = false;
  milestone3reached = false;

  // reset face image (sisyphus starts out sad)
  $("#faceImage").attr("src", "assets/images/sisyA.jpg");

  // stop game sound
  sample1.loop = false;
  sample1.pause();
  // start intro sound
  sample2.loop = true;
  sample2.play();

  // reset intro text loop
  textLoop=0;

  // setup text
  resetThisText();

  // listen for keypress
  $('body').on("keypress", resetThisText);

  // show intro html
  $("#infoSection").show();
}
