class Parrot{

  constructor(){
    this.voice = "US English Female";
    this.pitch = 1.4;
    this.rate = 0.7;
this.guessTimeout;
  }




  sayWordAgain(){
console.log("say it again")
squak(game.theWord)
  }

  defineWord(){

console.log("define it")

let randomPick = floor( random(game.numberOfCards));
if(guesses<9){
  while(game.cards[randomPick].wasChecked ){
    randomPick = floor( random(game.numberOfCards));
  }
}


if(!currentlyGuessing){
  squak (game.cards[randomPick].definition);
  game.cards[randomPick].optionsRevealed = true;
  game.cards[randomPick].defRevealed = true;
  game.cards[randomPick].wasChecked = true;
  currentlyGuessing = true;
  game.whichCard = randomPick;

  if(annyang){

    commands = {
      'true': game.cards[randomPick].checkTrue,
    'different': game.cards[randomPick].checkDifferent,
  'fake': game.cards[randomPick].checkComposite,
  'say the definition again': game.cards[randomPick].sayDefinition,
  };

    // initialize annyang, overwriting any previously added commands
    annyang.addCommands(commands);
  };
}

  }

  startOver(){
console.log("startover")

  }

  thank(){
    squak("thank you");
  }

  correctGuess(){

    squak("correct!");
    if(guesses<maxGuesses){
      clearTimeout(parrot.guessTimeout);
    parrot.guessTimeout = setTimeout( parrot.defineWord, 3000);
    }
    else {
      if(incorrectGuess<strikeOut){
// fire on round over
      }
    }

  }

  incorrectGuess(){

    squak("incorrect!");
    if(guesses<maxGuesses){
      clearTimeout(parrot.guessTimeout);
    parrot.guessTimeout = setTimeout( parrot.defineWord, 3000);
    }
    else {
        if(incorrectGuess<strikeOut){
    // fire on round over
  }
    }
  }
}
