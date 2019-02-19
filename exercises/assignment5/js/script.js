"use strict";
$(document).ready(preload);
let choices = 5;
let correctChoice;
let chosenAnimals = [];
let thingToSay;
let chosenNumber;
let commands;
let score = 0;

function preload(){
  $("html").click(setup);
  $("html").append("<p id='preload'> click to start </p>");
}

function setup(){

  $("html").off();
  $("#preload").text("say okay to start");
  console.log("setup started");


  responsiveVoice.speak("welcome darling. i will say a word backwards and you tell me which one it is. say okay when you are ready", "UK English Female", {
    pitch: 0,
    rate: 0,
  });

if(annyang){
  commands = {
    'okay': startGame,
};

  // initialize annyang, overwriting any previously added commands
  annyang.addCommands(commands);

  annyang.start();
}
}

function startGame(){
    $("#preload").remove();
    $(".instructions").show();
    startRound();
}



function startRound(){

  chosenAnimals = [];
  $(".buttons").empty();
$(".answer").text("");
  while(chosenAnimals.length<5){

        let alreadyPicked = false;
        let pickedAnimal = Math.floor(Math.random() * animals.length);

    for(let j=0; j<chosenAnimals.length; j++){
      if(animals[pickedAnimal]===chosenAnimals[j]){
        alreadyPicked = true;
      }
    }

    if(!alreadyPicked){
      addButton(animals[pickedAnimal], chosenAnimals.length);
      chosenAnimals.push(animals[pickedAnimal])
    }
  }
  chosenNumber = Math.floor(Math.random()*choices);
  correctChoice = chosenAnimals[chosenNumber];

  thingToSay = correctChoice.split("").reverse().join("");

  responsiveVoice.speak(thingToSay, "UK English Female", {
    pitch: 0,
    rate: 0
  });

  if(annyang){
    annyang.removeCommands("okay");

    commands = {
      'I give up': giveUp,
    'say it again': sayAgain,
  'I think it is *answer': proposeAnswer
  };

    // initialize annyang, overwriting any previously added commands
    annyang.addCommands(commands);
}
}



function giveUp(){
  console.log("giveup");
    $("#but"+chosenNumber).css("background-color", "tomato");
    $("#but"+chosenNumber).css("color", "white");
    $(".answer").text("SERIOUSLY");
    score =0;
  responsiveVoice.speak("seriously!? the correct answer was :"+correctChoice+". try another", "UK English Female", {
    pitch: 0,
    rate: 0,
    onend: startRound,
  });

}

function sayAgain(){
  console.log("sayagain");
  $(".answer").text("UNPLUG THOSE EARS");
  responsiveVoice.speak("i will repeat but you must promise to clean your ears. "+thingToSay, "UK English Female", {
    pitch: 0,
    rate: 0
  });
}

function proposeAnswer(answer){
  if(answer===correctChoice){
    $("#but"+chosenNumber).css("background-color", "green");
    $("#but"+chosenNumber).css("color", "white");
    $(".answer").text("GOOD JOB");
    score+=1;
  let  scoreText = "point";
    if(score>=2){
      scoreText = "points";
    }
    responsiveVoice.speak("good freaking job. so far you've scored "+score+" "+scoreText+". let's continue", "UK English Female", {
      pitch: 0,
      rate: 0,
      onend: startRound,
    });

  }
  else {
    $(".answer").text("BAD!");
    responsiveVoice.speak("wrongetty-wrong", "UK English Female", {
      pitch: 0,
      rate: 0,
      onend: clearDisplay,
    });
  }
}

function clearDisplay(){
  $(".answer").text("");
}

function addButton(label, index){

  let $button = $("<div class='ui-button guess' id='but"+index+"'>"+label+"</div>")
  $button.button();
  $button.on("click", checkChoice);
  $(".buttons").append($button);
}

function checkChoice(){
  console.log("checked")
  if($(this).html() === correctChoice){
    startRound();
  }
}
