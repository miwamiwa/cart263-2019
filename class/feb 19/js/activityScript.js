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
}

function startRound(){
  chosenAnimals = [];
  $(".buttons").empty();

  for(let i=0; i<choices; i++){
    pickedAnimal = Math.round(Math.random() * animals.length);
    addButton(animals[pickedAnimal]);
    chosenAnimals.push(animals[pickedAnimal])
  }

  correctChoice = chosenAnimals[Math.floor(Math.random()*choices)];

  thingToSay = correctChoice.split("").reverse().join("");



  console.log(correctChoice);
  console.log(thingToSay);


  responsiveVoice.speak(thingToSay, "UK English Female", {
    pitch: 0,
    rate: 0
  });

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
