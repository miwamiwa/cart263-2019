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

let musicPlaying = false;

let nextTimeInterval = 0;
let quadrafuzz;
let compressor;
let highPassFilter;
let reverb;
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
compressor = new Pizzicato.Effects.Compressor({
    threshold: -12,
    ratio: 10
});

var quadrafuzz = new Pizzicato.Effects.Quadrafuzz({
    lowGain: 0.8,
    midLowGain: 0.8,
    midHighGain: 0.5,
    highGain: 0.6,
    mix: 1.0
});
highPassFilter = new Pizzicato.Effects.HighPassFilter({
    frequency: 500,
    peak: 10
});

synth.addEffect(highPassFilter);
synth.addEffect(quadrafuzz);
synth.addEffect(compressor);


   hat = new Pizzicato.Sound('./assets/sounds/hihat.wav');
   snare = new Pizzicato.Sound('./assets/sounds/snare.wav');

    reverb = new Pizzicato.Effects.Reverb({
    time: 0.5,
    decay: 0.3,
    reverse: false,
    mix: 0.8
});

snare.addEffect(reverb);

   kick = new Pizzicato.Sound('./assets/sounds/kick.wav');

}

function mousePressed(){
if(!musicPlaying){
  musicPlaying = true;
  playNote();
  setInterval(playDrum, 125);
}
}

function playNote(){
highPassFilter.frequency = random(400, 3000);
if(random()>0.8){
  synth.stop();
  nextTimeInterval = ceil(random(4)) * 250;
    setTimeout(playNote, nextTimeInterval)
}
else {

  let randomPick = floor( random(8));
  synth.frequency = frequencies[randomPick];
  synth.play();

  nextTimeInterval = ceil(random(4)) * 125;
  setTimeout(playNote, nextTimeInterval)
}
}

function playDrum(){

let symbols = pattern[ patternIndex ];

  if( symbols.indexOf("x") !==-1){
    kick.play();
  }
  if( symbols.indexOf("*") !==-1){
    hat.play();
  }
  if( symbols.indexOf("o") !==-1){
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
