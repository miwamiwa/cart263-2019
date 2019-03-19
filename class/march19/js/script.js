"use strict";

let frequencies = [
  110, 123.47, 138.59, 155.56, 164.81, 185, 196, 220
];
let kick;
let snare;
let hat;
let synth;
let pattern = [
  'x*', '*', 'o*', '*', 'x', '*', 'o*', '*',
];
let patternIndex = 0;

function preload() {

}


// setup()
//
// Description of setup

function setup() {
  synth = new Pizzicato.Sound({
    source: 'wave',
    options: {
        frequency: 440
    }
});


   hat = new Pizzicato.Sound('./assets/sounds/hihat.wav');
   snare = new Pizzicato.Sound('./assets/sounds/snare.wav');
   kick = new Pizzicato.Sound('./assets/sounds/kick.wav');

}

function mousePressed(){

  setInterval(playNote, 500);
  setInterval(playDrum, 125);
}

function playNote(){

  let randomPick = floor( random(8));

  synth.frequency = frequencies[randomPick];
  synth.play();
}

function playDrum(){

let symbols = pattern[ patternIndex ];

  if( symbols.indexOf('x', 0) >=0){
    kick.play();
  }
  if( symbols.indexOf('*', 0) >=0){
    hat.play();
  }
  if( symbols.indexOf('o', 0) >=0){
    snare.play();
  }
  patternIndex+=1;
  if(patternIndex>=8){
    patternIndex = 0;
  }
}

// draw()
//
// Description of draw()

function draw() {

}
