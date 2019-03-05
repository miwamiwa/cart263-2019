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

    // this variable stores the timeout that triggers a new word definition,
    // for the purpose of being cleared when needed with clearTimeout().
    this.guessTimeout;
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
      sample[randomPick].currentTime = 0;
      sample[randomPick].volume = 0.9;

      // play the file
      sample[randomPick].play();

// say the input:
// stop previous voice
      responsiveVoice.cancel();
// once parrot sound is done playing
      sample[randomPick].onended = function(){
        // say the input outloud
        responsiveVoice.speak(input, parrot.voice, {
          pitch: parrot.pitch,
          rate: parrot.rate,
        });
      }
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

      // add guessing voice commands to annyang
      if(annyang){

        // annyang will check if true, different or false, or repeat this definition.
        commands = {
          'true': parrot.checkTrue,
          'different': parrot.checkDifferent,
          'fake': parrot.checkComposite,
          'say the definition again': parrot.sayDefinition,
        };
        voiceCommandsDescription += ", 'true', 'different', 'fake', 'say the definition again'";
        annyang.addCommands(commands);
      };
    }
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
// triggered by voice command "nice"
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
    // display it
    react();

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
    react();

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
}
