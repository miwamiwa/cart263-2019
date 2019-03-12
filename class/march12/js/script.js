"use strict";

/*****************

Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!

******************/

let dataPicked = false;
let colorPicked = false;

let randomCondiment;
let randomRoom;
let randomCat;
let verb;
let randomColor;
let aOrAn="a";
let dataSet1;
let dataSet2;


$(document).ready(preload);

function preload(){

  $("body").append("<p>"+"CLICK TO START"+"</p>")

  $("body").on("click", setup)
}

function setup(){

  $("body").off();
  $("p").remove();


  $.getJSON("data/data.json", dataLoaded);
  $.getJSON("data/data.json", crayolaLoaded);

  loadNewStuff();

  setInterval(checkData, 100);

}

function dataLoaded(data){

dataSet1 = data;
getRandomData(dataSet1);

}

function getRandomData(data){
  randomCondiment = getRandomElement(data.condiments);
  console.log(randomCondiment);

  verb = "is";
  if(randomCondiment.charAt( randomCondiment.length-1)==="s"){
    verb = "are";
  }

  randomCat = getRandomElement(data.cats);
  randomRoom = getRandomElement(data.rooms);
  randomRoom = getAOrAn(randomRoom) + " " + randomRoom;

dataPicked = true;
}


function crayolaLoaded(data){
dataSet2 = data;
loadColor(dataSet2);
}

function loadColor(data){
  randomColor = getRandomElement(data.colors).color;
  randomColor = getAOrAn(randomColor) + " " + randomColor;
  colorPicked = true;
}


function getRandomElement(data){

  let randomPick = Math.floor( Math.random()*data.length);
  return data[randomPick]
}

function getAOrAn(input){
  let result;
  if(
    input.charAt[0]==="a"
    || input.charAt[0]==="e"
    || input.charAt[0]==="o"
    || input.charAt[0]==="u"
    || input.charAt[0]==="i"
    || input.charAt[0]==="A"
    || input.charAt[0]==="E"
    || input.charAt[0]==="O"
    || input.charAt[0]==="U"
    || input.charAt[0]==="I"
  ){
    result = "an";
  return result;
  }
  else {
    result = "a";
    return result;
  }
}

function checkData(){

  if(dataPicked&&colorPicked){
    let description = `${randomCondiment} ${verb} like ${randomColor} ${randomCat} in ${randomRoom}`;
    $("body").append(description);
    $("body").on("click", loadNewStuff);
  }
}

function loadNewStuff(){
getRandomData(dataSet1);
loadColor(dataSet2);
checkData();
}
