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
let screenLoaded = false;

$(document).ready(preload);

function preload(){

  $("body").append("<p>"+"CLICK TO START"+"</p>")

  $("body").on("click", setup)
}

function setup(){

  $("body").off();
  $("p").remove();


  $.getJSON("data/data.json", dataLoaded);
  $.getJSON("data/crayola.json", crayolaLoaded);

    setInterval(checkData, 100);

  }

  function dataLoaded(data){

  dataSet1 = data;
    dataPicked = true;
  getRandomData(dataSet1);

  }

  function getRandomData(data){
    randomCondiment = getRandomElement(data.condiments);


    verb = "is";
    if(randomCondiment.charAt( randomCondiment.length-1)==="s"){
      verb = "are";
    }

    randomCat = getRandomElement(data.cats);
    let thatRoom = getRandomElement(data.rooms);
    let thatDeterminant = getAOrAn(thatRoom);
    randomRoom =  thatDeterminant + " " + thatRoom;


  }


  function crayolaLoaded(data){
  dataSet2 = data;
      colorPicked = true;
  loadColor(dataSet2);
  }

  function loadColor(data){
    randomColor = getRandomElement(data.colors).color;
    randomColor = getAOrAn(randomColor) + " " + randomColor;

  }


  function getRandomElement(data){

    let randomPick = Math.floor( Math.random()*data.length);
    return data[randomPick]
  }

  function getAOrAn(input){
    let result;
    let thisChar = input.charAt(0);
    console.log(thisChar);
    if(
      thisChar==="a"
      || thisChar==="e"
      || thisChar==="o"
      || thisChar==="u"
      || thisChar==="i"
      || thisChar==="A"
      || thisChar==="E"
      || thisChar==="O"
      || thisChar==="U"
      || thisChar==="I"
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

    if(dataPicked&&colorPicked&&!screenLoaded){
      screenLoaded = true;

      let description = `${randomCondiment} ${verb} like ${randomColor} ${randomCat} in ${randomRoom}`;
      $("p").remove();
      $("body").append("<p>"+description+"</p>");
      $("body").on("click", loadNewStuff);
    }
  }

  function loadNewStuff(){
    screenLoaded = false;
  getRandomData(dataSet1);
  loadColor(dataSet2);
  checkData();
  }
