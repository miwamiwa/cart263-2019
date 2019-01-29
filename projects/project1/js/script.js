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
let textLoop =1;

$(document).ready(setup);


function setup(){
  setupText("#text1");
  $("p").click(hairClicked);
  setInterval(update, 1000);
  $("body").mousemove(moveIt);

  $(".stillChar").mouseenter(makeItFall);

  setInterval(fall, 10);

}

function fall(){

  if($("span").hasClass("fallingChar")){
    let notAllFellYet = false;
    for(let i=0; i<chars; i++){
      let selector = "#char"+i;
      if($(selector).hasClass("fallingChar")){
        let thisString = $(selector).css("top");
        let yPos = thisString.substr(0,thisString.length-2);
        if(yPos<500){
          let newPos = Math.round(+yPos+5)+"px";
          $(selector).css("top", newPos);
          notAllFellYet = true;
        } else {
          $(this).removeClass("fallingChar");
          $(this).addClass("fallenChar");
        }
      }

    }
    if(!notAllFellYet){
      console.log("errything fell")
      $("span").fadeOut("slow", removeSpans);
      return;
    }
  }
}

function removeSpans(){
  if(!spansRemoved
  && $("span").hasClass("stillChar")===false
  && $("span").hasClass("stillChar")===false
){
    spansRemoved=true;
  console.log("yo")
  $("span").remove();
  textLoop +=1;
  let nextText = "#text"+textLoop;
  console.log("next is "+nextText)
  chars =0;
  setupText(nextText);

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
}



function moveIt(){

  $("#move").css( "left", event.pageX );
  $("#move").css( "top", event.pageY );
}

function setupText(selectedText){
  console.log($(selectedText).html())
  $(".introText").hide();
  $(selectedText).show();
  let text = $(selectedText).html();
  $(selectedText).html("");
  for (let i=0; i<text.length; i++){
    let addSpace = "";
    if(text.charAt(i-1).trim() === ""&&i!=0){
      addSpace = " ";
    }
    let thisChar = "<span class='stillChar'>"+text.charAt(i)+addSpace+"</span>";
    $(selectedText).append(thisChar)
  }
  spansRemoved = false;
    $(".stillChar").mouseenter(makeItFall);
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
