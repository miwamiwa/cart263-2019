"use strict";
$(document).ready(preload);
let choices = 5;
let correctChoice;
let chosenAnimals = [];
let thingToSay;

function preload(){
  $("html").click(setup);
  $("html").append("<p id='preload'> click to start </p>");
}

function setup(){

  $("html").off();
  $("#preload").remove();
  console.log("setup started");


startRound();

if(annyang){
  var commands = {
    'I give up': giveUp,
  'say it again': sayAgain,
'I think it is *': proposeAnswer
};

  // initialize annyang, overwriting any previously added commands
  annyang.addCommands(commands, true);

  annyang.start();
}
}

function startRound(){

  chosenAnimals = [];
  $(".buttons").empty();

  for(let i=0; i<choices; i++){
    let pickedAnimal = Math.round(Math.random() * animals.length);
    addButton(animals[pickedAnimal]);
    chosenAnimals.push(animals[pickedAnimal])
  }

  correctChoice = chosenAnimals[Math.floor(Math.random()*choices)];

  thingToSay = correctChoice.split("").reverse().join("");

  responsiveVoice.speak(thingToSay, "UK English Female", {
    pitch: 0,
    rate: 0
  });



}



function giveUp(){
  console.log("giveup")
}
function sayAgain(){
  console.log("sayagain")
}
function proposeAnswer(answer){
  console.log("answeris: "+answer)
}

function addButton(label){

  let $button = $("<div class='ui-button guess'>"+label+"</div>")
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
