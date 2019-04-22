"use strict";

let velocity = 1;
let ellipses;
let uiObject;
let musicObject;
let canvas;
let dude;
let fft;
let pictureTaken = false;
let soundStarted = false;




// setup()
//
// loads the game minus sound

function setup(){

  //localStorage.clear(); // Clears everything in local storage

  // the next three objects use sound,
  // but can be initialized without starting sound.
  musicObject= new Music();
  fft = new p5.FFT();
  ellipses = new Ellipses();
  // load dude and default moves
  dude = new Dude();
  loadMoves();
  // loads knobs and sliders
  uiObject = new UI();

  // if there is a saved game,
  // update moves, music data and knob positions.
  loadSavedGame();
  // start moving this dude
  startMoves(0);

  // create canvas
  frameRate(30);
  canvas = createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  // place canvas inside a Div so that we can remove text highlighting as well as
  // right click menu using css, and also position it as fixed below html text.
  canvas.parent('theDiv');

  // position html
  positionText(width*0.01, height*0.95, "#title");
  // position camera
  camera(0, -100, 400, 0, 0, 0, 0, 1, 0);

  // ortho() removes all scaling due to perspective.
  // prior to finding this, i tried doing math to map mouse position to fit
  // perspective but it wasn't working 100%. this solved my issue pretty neatly.
  ortho();
}






// startsound()
//
// switches sound "on" at the first mouse click in order to avoid autoplay issues.

function startSound(){

  // mark sound as started
  soundStarted = true;
  // load instrument objects and update their parameters using saved game data
  musicObject.setupInstruments();
  uiObject.setKnobs();
  // remove instructions to click for sound
  $("#instructions"). remove();
}






// draw()
//
// runs the game loop.
// displays everything on screen except for text, which is in the html.

function draw(){

  // display background color, cubes, and tinted layer
  uiObject.displayBackground();
  // display dude's limbs, head and back, and display ground
  dude.displayDude();
  // display timeline and keyboard
  uiObject.displayMusicEditor();
  // play sound
  if(soundStarted) musicObject.playMusic();
  // run fft analysis and display background ellipses
  analyzeSound();
  // display sliders and pads
  uiObject.displayKnobs();
}






// analyzesound()
//
// read the energy contained in different frequency ranges using fft,
// display background ellipses and animate them using fft result.

function analyzeSound(){

  // run a new fft
  fft.analyze();

  // get energy from different frequency ranges
  // result is a value between 0 and 255
  let mid = fft.getEnergy(350, 1000);
  let mid2 = fft.getEnergy(1000, 2000);
  let mid3 = fft.getEnergy(2000, 3000);
  let lo = fft.getEnergy(20, 300);
  // let hi = fft.getEnergy(5000, 20000);

  // set position of ellipse arrays
  let ellipsesY = height/2-130;
  let ellipsesX = width/2-130;

  // display an array of ellipses for each frequency range analyzed
  // displayEllipses(input, centerX, centerY, number of ellipses, timer, size)
  ellipses.displayEllipses(mid, 0.70, -ellipsesX, ellipsesY, 5, 0, 250);
  ellipses.displayEllipses(mid2, 0.40, 0, ellipsesY, 5, 2, 250);
  ellipses.displayEllipses(mid3, 0.40, ellipsesX, ellipsesY, 5, 3, 250);
  ellipses.displayEllipses(lo, 0.77, 0, 0, 20, 1, 400);
}







// keypressed()
//
// fire different moves on key press.

function keyPressed(){

  switch(key){
    case "1": startMoves(0); break;
    case "2": startMoves(1); break;
    case "3": startMoves(2); break;
    case "4": startMoves(3); break;
    case "q": saveInfo(); break;
    case " ":
    pictureTaken = true;
    $("#instruct4").remove();
    break;
  }
}






// startmoves(input)
//
// three tasks to execute when switching between moves

function startMoves(input){

  // keep track of the current motion pattern
  dude.currentMoves =input;
  // update each limb's motion
  dude.newDanceMotion();
  // update pads and sliders positions
  uiObject.setKnobs();
}






// mousepressed()
//
// check for interaction with pads or sliders,
// save game data on right-click (to be changed to another input),
// if sound isn't started yet, start sound.

function mousePressed(){

  if(soundStarted) uiObject.checkKnobs("press");
  if(!soundStarted) startSound();
}






// mousedragged()
//
// check for interaction with pads or sliders

function mouseDragged(){

  if(soundStarted) uiObject.checkKnobs("drag");
}





// mousereleased()
//
// check for interaction with pads or sliders

function mouseReleased(){

  if(soundStarted) uiObject.checkKnobs("stop");
}






// loadsavedgame()
//
// check if there is a game data variable in the local storage
// if there isn't or it is empty, stick to default game parameters.
// if there is a saved game, load game data.


function loadSavedGame() {

  // find saved game variable
  let storedData = localStorage.getItem('CestTaTouneData');

  if (storedData === null) {
    // if there isn't a saved game, skip the next step
    return false;
  }

  // if there is a saved game..:
  let gameData = JSON.parse(storedData);
  console.log(gameData);

  // load saved motion
  dude.legMoves = gameData.legMoves;
  dude.armMoves = gameData.armMoves;
  dude.vigor = gameData.vigor;
  // load saved music
  uiObject.timelines = gameData.timelines;
  // load saved synthesizor setup
  musicObject.attack = gameData.attack;
  musicObject.release = gameData.release;
  musicObject.filterRes = gameData.filterRes;
  musicObject.delayFeedback = gameData.delayFb;
  musicObject.filterFreq = gameData.filterFreq;
  musicObject.delayDividor = gameData.delayDiv;
  musicObject.maxAmplitude = gameData.ampLevels;
  musicObject.subDivisionLength = gameData.tempo;

  return true;
}






// saveinfo()
//
// store game data into an object,
// the store the object in the local storage.

function saveInfo(){

  // save game data in an object
  let sendData = {
    armMoves: dude.armMoves,
    legMoves: dude.legMoves,
    vigor: dude.vigor,
    timelines: uiObject.timelines,
    attack: musicObject.attack,
    release: musicObject.release,
    filterRes: musicObject.filterRes,
    filterFreq: musicObject.filterFreq,
    delayFb: musicObject.delayFeedback,
    delayDiv: musicObject.delayDividor,
    ampLevels: musicObject.maxAmplitude,
    tempo: musicObject.subDivisionLength,
  }

  // stringify and store saved game data
  console.log(sendData)
  let setDataAsJSON = JSON.stringify(sendData);
  localStorage.setItem('CestTaTouneData', setDataAsJSON);
}






// positiontext()
//
// a function to reposition html text elements. WEBGL doesn't support text
// as far as i know, so i'm using jquery to move things around since my
// sketch size is adaptive.
// William mentionned i could have used p5.dom for this, which is true! but
// i guess jquery is still fresh in my mind. This came about late in the project;
// at this point i'm trying to tie things together rather than explore new.

function positionText(x, y, selector){

  let wid =0;
  let hei =0;

  // adapt x, y position to this object's width and height:

  // if it's the main title place it this way
 if( $(selector).hasClass("pad")){
    wid = -$(selector).width()*0.2;
    hei = 0.02*window.innerHeight;
  }
  else   if( $(selector).hasClass("slider")){
      hei = 0.15*window.innerHeight;
      wid = -$(selector).width()*0.2;
    }
    else   if( $(selector).hasClass("moveable")){
        hei = -$(selector).height()*0.25;
        wid = -$(selector).width()*0.25;
      }
  // reposition object
  $(selector).css("left", x+wid+"px");
  $(selector).css("top", y+hei+"px");
}
