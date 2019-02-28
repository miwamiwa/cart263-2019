/*
MR. PARROT
*/

"use strict";

let mrParrot;
let startingChannels =100;
let channels = [];
let lastChannelIndex =0;
let dayLength = 1000;

$(document).ready(preload);

function preload(){

  $("html").click(setup);
}

function setup(){

  // remove preload
  $("html").off();
  $("#preload").remove();

  // setup parrot
  mrParrot = new Parrot();
  $("#parrot").on("click", parrotTalk);

  // setup channels
  for (let i=0; i<startingChannels; i++){

    channels.push(new Channel(  lastChannelIndex ));
    lastChannelIndex +=1;
  }

  // produce videos
  setInterval(selectAllChannels, dayLength);
}

function parrotTalk(){

  mrParrot.saySomething();
}

function selectAllChannels(){

  $(".goodhuman").each(produceVideos);
  $(".badhuman").each(produceVideos);
  $(".copycat").each(produceVideos);
}

function produceVideos(){

  let videoWords = produceWords($(this).attr('id'));
  let videoElement = "<div class='videoElement' id='video"+this.length+"' hidden>"+videoWords+"</div>";
  $(this).append(videoElement);

}

function produceWords( whichChannel ){

  // get channel #
  let nameLength = whichChannel.length;
  let channelIndex = whichChannel.substring(7, nameLength);

  let result = "";
  let amountOfWords = 10;
  let goodWordsLength = goodWords.length;
  let badWordsLength = badWords.length;
  let thisBadness = channels[channelIndex].badness;

  // if good human channel
  if(channels[channelIndex].type === 0){

    for(let i=0; i<amountOfWords; i++){

      let randomIndex = Math.floor( Math.random()*goodWordsLength );
      result += goodWords[randomIndex]+" ";
    }
  }

  // if bad human channel
  // throw in one bad word
  // chance
  if(channels[channelIndex].type === 1){

    let whichAreBad = [];
    let wordCounter =0;
    let treshold = thisBadness * 2 /10;


while(wordCounter<amountOfWords){
      if( Math.random() < treshold ){
      wordCounter +=1;
      let randomIndex = Math.floor( Math.random()*badWordsLength );
      result += badWords[randomIndex]+" ";
    }
    else {
      wordCounter +=1;
      let randomIndex = Math.floor( Math.random()*goodWordsLength );
      result += goodWords[randomIndex]+" ";
    }
  }
    }


  // if copycat channel
  if(channels[channelIndex].type === 2){

  let videoContents="";
  let totalVideos;
  let randomVideo;
  let innerText="";
  let videoChosen = false;


  for(let i=0; i< channels.length; i++ ){

    if(channelIndex !== i && !videoChosen){

      let selector = "#"+"channel"+channelIndex;
      let allVideos = $( ".videoElement" ).length;

while(innerText.trim() ===""){
      // pick a random video
      randomVideo = Math.floor( Math.random()*allVideos );

      // get its contents
      innerText = $( ".videoElement" ).eq(randomVideo).text();
}
      if(innerText.trim()!=""){

        videoContents = innerText;
        videoChosen = true;
      }
    }
  }


  // alter text
  let splitContents = videoContents.split(" ");

  for(let i=0; i<thisBadness; i++){
  let randomPick = Math.floor( Math.random() * splitContents.length );

  let randomVid = $(".videoElement").eq( Math.floor( Math.random() *  $(".videoElement").length )).text().trim().split(" ");
  let randomWord = randomVid[ Math.floor(Math.random() * randomVid.length)];

  console.log("random word "+randomWord)

  splitContents[randomPick] = randomWord;

}
  videoContents = splitContents.join(" ");

  result = videoContents;
  }
//console.log(result);
  return result;
}
