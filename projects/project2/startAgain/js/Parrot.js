/*
Parrot.js

this script contains the Parrot class.
- the constructor contains values used to stylize the voice used.
- class Parrot's functions are designed to be triggered by annyang voice commands.
- Parrot also contains the squawk() function which triggers a random parrot sound and
says an input text using responsive voice.

*/

class Parrot{

  constructor(){

    // voice style
    this.voice = "US English Female";
    this.pitch = 1.4;
    this.rate = 0.7;

    this.motion = 0;
    this.mouthAngle = 0;
    this.beakLength = 200;
    this.x =0;
    this.y =0;
    this.maxMouthMotion=3;
    this.amp = new p5.Amplitude();

    // this variable stores the timeout that triggers a new word definition,
    // for the purpose of being cleared when needed with clearTimeout().
    this.guessTimeout;
    this.state = "start";
    this.fills = [];
  }


  // squawk(input)
  //
  // picks and plays a random parrot sound
  // says the input text outloud using responsiveVoice.

  squawk(input){

    // if game is over don't continue
    // this is meant to prevent some bugs in voice triggers
    if(!gameOver){

      // parrot sound:
      // pause any currently playing parrot sample
      for(let i=0; i<sample.length; i++){
        sample[i].pause();
      }

      // pick a random parrot sound
      let randomPick = floor(random(7));

      // set time and volume
      sample[randomPick].playMode("restart");
      sample[randomPick].setVolume(0.9);

      // play the file
      sample[randomPick].play();

      // say the input:
      // stop previous voice
      responsiveVoice.cancel();
      // once parrot sound is done playing
      sample[randomPick].onended(function(){
        // say the input outloud
        responsiveVoice.speak(input, parrot.voice, {
          pitch: parrot.pitch,
          rate: parrot.rate,
        });
      });
    }
  }

  // sayWordAgain()
  //
  // triggered by voice command "say the word again".
  // get responsivevoice to restate the current word

  sayWordAgain(){

    parrot.squawk(game.theWord)
  }


  // defineword()
  //
  // triggered by voice command.
  // picks a random card that's yet to be examined.
  // squawks its definition.
  // displays guessing buttons, triggers guessing voice commands.

  defineWord(){

    // pick a random card
    let randomPick = floor( random(game.numberOfCards));

    // if this card was checked, find a random card that wasn't checked
    while(game.cards[randomPick].wasChecked ){
      randomPick = floor( random(game.numberOfCards));
    }

    // stop if already in the process of guessing
    if(!currentlyGuessing){

      // say definition
      parrot.squawk (game.cards[randomPick].definition);

      // update card display to reveal option buttons and definition
      game.cards[randomPick].optionsRevealed = true;
      game.cards[randomPick].defRevealed = true;

      // mark card as checked
      game.cards[randomPick].wasChecked = true;
      // indicate we are in the process of guessing
      currentlyGuessing = true;
      // indicate which card we are looking at
      game.whichCard = randomPick;

      parrot.guessingAnnyang();
    }
  }

  // guessingAnnyang()
  //
  // this function setups annyang for guesses by voice command.

  guessingAnnyang(){
    // add guessing voice commands to annyang
    if(annyang){

      // annyang will check if true, different or false, or repeat this definition.
      commands = {
        'true': parrot.checkTrue,
        'different': parrot.checkDifferent,
        'fake': parrot.checkComposite,
        'say the definition again': parrot.sayDefinition,
      };
      annyang.addCommands(commands);
    };
  }

  // startover()
  //
  // triggered by voice command "let's start over shall we".
  // start game from the top.

  startOver(){

    // say that we're starting up again
    parrot.squawk("here we go again!");
    // tell game to restart
    cueStartAgain = true;
    // reset counters.
    incorrectGuess=0;
    points=0;
  }


  // thank()
  //
  // triggered by voice command "good bird"
  // parrot thanks you when you say nice.

  thank(){

    parrot.squawk("thank you");
  }


  // checktrue()
  //
  // triggered by voice command "true".
  // triggers guess checking function.

  checkTrue(){

    game.cards[game.whichCard].checkGuess("main word", 0);
  }


  // checkdifferent()
  //
  // triggered by voice command "different".
  // triggers guess checking function.

  checkDifferent(){

    game.cards[game.whichCard].checkGuess("random word", "synonym");
  }


  // checkcomposite()
  //
  // triggered by voice command "fake".
  // triggers guess checking function.

  checkComposite(){

    game.cards[game.whichCard].checkGuess("composite", 0);
  }


  // saydefinition()
  //
  // triggered by voice command "say the definition again".
  // triggers guess checking function.

  sayDefinition(){

    parrot.squawk(game.cards[ game.whichCard ].definition);
  }


  // correctguess()
  //
  // triggered by guessing (both by voice command or clicking buttons).
  // triggers reaction text display.
  // triggers defining a new word after a timeout delay.

  correctGuess(){

    //  - trigger reaction text:
    // set reaction text display
    reaction= "correct!!";
    // set animation frame to 0.
    reactionY=0;


    // squawk a reaction
    parrot.squawk("correct!");

    //  - define a new word:
    // if we haven't reached the end of the round
    if(guesses<maxGuesses){
      // set a timeout after which to define a new word.
      clearTimeout(parrot.guessTimeout);
      parrot.guessTimeout = setTimeout( parrot.defineWord, 3000);
    }
  }


  // incorrectguess()
  //
  // triggered by guessing (both by voice command or clicking buttons).
  // triggers reaction text display.
  // triggers defining a new word after a timeout delay.

  incorrectGuess(){

    //  - trigger reaction text:
    reaction= "incorrect!!"
    reactionY=0;


    // squawk a reaction
    parrot.squawk("incorrect!");

    //  - define a new word:
    // if we haven't reached the end of the round
    if(guesses<maxGuesses){
      // set a timeout after which to define a new word.
      clearTimeout(parrot.guessTimeout);
      parrot.guessTimeout = setTimeout( parrot.defineWord, 3000);
    }
  }

  // display()
  //
  // handles the parrot animation, its moving along to sound,
  // and displaying its parts.
  //
  // i used trig rather than rotate() to move the parrot's parts.. that's in part
  // because i had something easier in mind when i started writing this section,
  // but then i also figured this method at least had the advantage of allowing
  // me to scale my irregular triangles more easily. so i scaled it, duh.
  //
  // the position of everything is calculated from the beak length (including
  // the rest of the face), and mouthAngle (or difference in beak angle from a
  // closed position), and the position of the point where the jaws converge.

  // the beak (and eyes) moves with sound! mapping amplitude from a soundfile is rather
  // easy, but it seems like reading real time TTS like audio is completely impossible,
  // other than through paid services. drats. 
  // the result is that the beak follows the chirping sounds exaclty,
  // but kind of yaps randomly while it is "speaking".


  display(){

    // while an audio file is playing, stop the animation and control
    // the beak angle directly using the audio input
    for( let i=0; i<sample.length; i++){
      if(sample[i].isPlaying()){
        // stop beak's continuous motion
        this.motion =0;
        // get a reading from the amplifier object
        let level = this.amp.getLevel();
        // map the sound level to an acceptable range of beak motion
        this.mouthAngle = radians(map( level, 0, 0.5, 2, this.maxMouthMotion*30));
      }
    }

    // if the above isn't happening
    if(this.motion!=0){

      // if responsive voice is saying stuff
      if (responsiveVoice.isPlaying()){
        // accelerate beak motion
        this.motion +=15;
      }
      // calculate beak angle
      this.mouthAngle = radians( this.maxMouthMotion*(1.1+sin(radians(this.motion))) );
    }

    // closed beak angle (beak inclination)
    let origin = -0.1*PI;

    // distance from the center to the outer points of the beak, from
    // left to right.

    // top side
    let beakRamp = 0.6*this.beakLength;
    let topRamp = 1.1*this.beakLength;
    let tipRamp = 1.25*this.beakLength;
    // bottom side
    let lowerBeakRamp = 0.4*this.beakLength;
    // tip at the bottom
    let bottomRamp = 1.25*this.beakLength;

    // center point
    let aX = this.x;
    let aY = this.y;

    // do the trig dance
    // (calculate x, y pos using distance to point and angle from closed position)
    let rampAngle = radians(75);
    let lowerRampAngle = radians(55);
    let bX = aX+this.beakLength * cos(origin+this.mouthAngle);
    let bY = aY-this.beakLength * sin(origin+this.mouthAngle);
    let cX = aX+ beakRamp * cos(origin+this.mouthAngle+rampAngle);
    let cY = aY- beakRamp * sin(origin+this.mouthAngle+rampAngle);
    let dX = aX+ topRamp * cos(origin+this.mouthAngle+rampAngle/4);
    let dY = aY- topRamp * sin(origin+this.mouthAngle+rampAngle/4);
    let eX = aX+ tipRamp * cos(origin+this.mouthAngle+rampAngle/8);
    let eY = aY- tipRamp * sin(origin+this.mouthAngle+rampAngle/8);
    let fX = aX+ bottomRamp * cos(origin+this.mouthAngle-rampAngle/4);
    let fY = aY- bottomRamp * sin(origin+this.mouthAngle-rampAngle/4);
    let gX = aX+ lowerBeakRamp * cos(origin-this.mouthAngle/2-lowerRampAngle);
    let gY = aY- lowerBeakRamp * sin(origin-this.mouthAngle/2-lowerRampAngle);
    let hX = aX+this.beakLength * cos(origin-this.mouthAngle );
    let hY = aY-this.beakLength * sin(origin-this.mouthAngle );

    // setup face
    let faceDiameter = 1.4*this.beakLength;
    let faceOffset = this.beakLength/5;
    noStroke();
    let faceX = aX-faceOffset * cos(-origin);
    let faceY = aY-faceOffset * sin(-origin);

    // assign a different set of colours depending on if we're on load screen,
    // start screen, or game screen.
    // *these are probably not the colours of a parrot's beak but hey

    switch(this.state){
      case "start":
      this.fills =   [
        color(65, 5, 5, 85),
        color(125, 0, 0, 85),
        color(185, 185, 20, 85),
        color(0, 125, 0,85),
        color(0, 0, 185, 85),
        color(25, 185, 125, 85),
        color(125, 0, 125, 85),
        color(255, 85),
        color(0, 85)
      ];
      break;
      case "load":
      this.fills =   [
        color(125, 180),
        color(185, 180),
        color(200, 180),
        color(210, 180),
        color(220, 180),
        color(230, 180),
        color(240, 180),
        color(255, 180),
        color(0, 180)
      ];
      break;
      case "game":
      this.fills =   [
        color(65, 5, 5),
        color(125, 0, 0),
        color(185, 185, 20),
        color(0, 125, 0),
        color(0, 0, 185),
        color(25, 185, 125),
        color(125, 0, 125),
        color(255),
        color(0)
      ];
      break;
    }

    // display face
    fill(this.fills[0]);
    let jawDiameter = faceOffset*2.3;
    arc(aX, aY, 0.5*faceDiameter, 0.5*faceDiameter, -origin+this.mouthAngle, -origin-this.mouthAngle);
    fill(this.fills[1]);
    arc(faceX, faceY, faceDiameter, 1.1*faceDiameter, -origin+this.mouthAngle, -origin-this.mouthAngle);

    // dislay lips
    stroke(this.fills[8]);
    strokeWeight(this.beakLength/18);
    line(aX, aY, bX, bY);
    line(aX, aY, hX, hY);

    // display beak
    noStroke();
    fill(this.fills[2]);
    triangle(aX, aY, cX, cY, dX, dY);
    fill(this.fills[3]);
    triangle(aX, aY, dX, dY, eX, eY);
    fill(this.fills[4]);
    triangle(aX, aY, eX, eY, bX, bY);
    fill(this.fills[5]);
    triangle(bX, bY, eX, eY, fX, fY);
    fill(this.fills[6]);
    triangle(aX, aY, hX, hY, gX, gY);

    // display eyes
    let eyeDiameter = faceDiameter/6;
    let eyeTwitch = sin( radians( this.motion )) * eyeDiameter/8;
    fill(this.fills[7]);
    ellipse(faceX, faceY,eyeDiameter, eyeDiameter );
    fill(this.fills[8]);
    ellipse(faceX + eyeTwitch, faceY, eyeDiameter/2, eyeDiameter/2);
  }
}
