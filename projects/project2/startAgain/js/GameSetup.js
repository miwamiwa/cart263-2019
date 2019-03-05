/*
GameSetup.js

The gamesetup class triggers a series of queries and actions on setup. It will:
- pick a random word from the RiTa lexicon. this is our main word,
- find its definition on onelook dictionary,
- pick a given number of extra random words,
- find their definitions,
- find extra random words if definition result is null,
- get a list of related words from onelook dictionary,
- get definitions until a given number of related words are defined,
- create composite definitions by replacing nouns in a definition with random nouns
from any definition in use,
- load cards using words and definitions,
- shuffle cards,
- done!

not really sure what i'm doing when it comes to api calls, anyhow i tried using loadJSON
and loadStrings. each query can fail by returning unusable results; in that case
either a part of the query chain or the entire chain is restarted (though i've
fixed some buggy behaviors, most of them i hope). Sometimes all this can take a while,
thus the loading screen and animation.
*/

class GameSetup{

  constructor(){

        // animation trigger: animationTimer = frameCount + animationLength;

    // number of related words, random words and composites to start with.
    this.startingWordTypes = [3, 1, 5]// synonyms, random words, composites

    // indicates that game is ready to run
    this.readyToStart = false;

    // words and definitions
    this.itsDefinition;
    this.itsSynonyms = [];
    this.synonymDefinitions = [];
    this.synonymBank=[];
    this.moreRandomWords = [];
    this.randomWordsDefinitions = [];
    this.compositeDefinitions = [];
    this.compositeWords = [];
    this.randomWordChosen = false;
    this.randomWordsChosen = 0;
    this.synonymsChosen = 0;
    this.allNouns = [];
    this.allDefinitions=[];
    this.synonymResults =0;

    // cards
    this.cards = [];
    this.numberOfCards = 1 + this.startingWordTypes[0]+this.startingWordTypes[1]+this.startingWordTypes[2];
    this.cardIndex=0;
    this.whichCard;

    // start the query chain:
    // get random word
    this.theWord = RiTa.randomWord("nn");
    // get its definition
    this.getRandomWordDefinition(this.theWord);
  }

  // getrandomworddefinition()
  //
  // builds a query for a definition to send to onelook dictionary.
  // callback triggers gotRandomWord()

  getRandomWordDefinition(input){

    let queryTextStart = "https://cors-anywhere.herokuapp.com/http://www.onelook.com/?w=";
    let queryTextEnd = "&xml=1";
    let xml = [];
    xml  = loadStrings( queryTextStart + input + queryTextEnd, {mode: "no-cors"}, this.gotRandomWord );
  }

  // gotrandomword()
  //
  // function to fire upon getting the callback response from
  // getRandomWordsDefinition().

  gotRandomWord(data){

    // extract definition from xml
    let definition = game.extractDefinition(data);

    // --- if there was some kind of issue with fetching this random word:

    if((definition===""|| definition===undefined)&& game.randomWordChosen){
      // if this was an extra random word, remove last random word found
      if(game.randomWordsChosen.length>0){
        game.randomWordsChosen.shift();
      }
      // search new random word
      game.newRandomWord();
      return;
    }
    else if(
      // if this was meant to be the main word, start from the top.
      ( definition==="" || definition===undefined )
      && !game.randomWordChosen
    ){
      animationTimer = frameCount + animationLength;
      game.startAgain();
      return;
    }

    // --- if there was no issue in:

    // pick what to do with it
    if( game.randomWordsChosen < game.startingWordTypes[1]-1 || (game.startingWordTypes[1]===1 && game.randomWordsChosen===0) ){
      if(!game.randomWordChosen){

        // if it's our main word - theWord,
        // save the definition and get a new random word

        // mark word as chosen
        game.randomWordChosen = true;
        // save definition
        game.itsDefinition = definition;
        // load card
        game.loadACard("main word", game.theWord,game.itsDefinition);
        // start new query
        game.newRandomWord();
      }
      else {
        // if we need more random words, save this definition and get a new one

        // save definition
        game.randomWordsDefinitions.push(definition);
        // load card
        game.loadACard("random word", game.moreRandomWords[game.randomWordsChosen],game.randomWordsDefinitions[game.randomWordsChosen]);
        // count random words chosen so far
        game.randomWordsChosen +=1;
        // start new query
        if(game.startingWordTypes[1]>1){
          game.newRandomWord();
        }
        // that is unless we only needed one extra random word.
        // in that case move on to related words.
        else {
          game.getRelatedWord(game.theWord);
        }
      }
    }
    else {

      // if done looking for random words,
      // push this last definition
      game.randomWordsDefinitions.push(definition);
      game.loadACard("random word", game.moreRandomWords[game.randomWordsChosen],game.randomWordsDefinitions[game.randomWordsChosen]);

      // move on to seeking words related to the main word.
      game.getRelatedWord(game.theWord);
    }
  }


// getrelatedword()
//
// build a query for datamuse (onelook) api to search for related words.
// triggers gotRelatedWords();

  getRelatedWord(input){

    game.synonymBank = [];
    let queryTextStart = "https://cors-anywhere.herokuapp.com/https://api.datamuse.com/words?ml=";
    let xml = [];
    xml  = loadJSON( queryTextStart + input, {mode: "no-cors"}, this.gotRelatedWords);
}


// newrandomword()
//
// picks a random word and gets its definition.

newRandomWord(){

  // look for a new random word
  let newWord = RiTa.randomWord("nn");
  // save the word
  this.moreRandomWords.push(newWord);
  // get its definition
  this.getRandomWordDefinition(newWord)
}


// startagain()
//
// in the event of a faulty callback, reset the entire chain.

startAgain(){

  this.readyToStart = false;
  this.randomWordChosen = false;
  this.randomWordsChosen = 0;
  this.synonymsChosen = 0;
  this.synonymBank = [];
  this.theWord=0;
  this.itsDefinition="";
  this.allNouns = [];
  this.allDefinitions = [];
  this.itsSynonyms = [];
  this.synonymDefinitions = [];
  this.synonymResults ;
  this.moreRandomWords = [];
  this.randomWordsDefinitions = [];
  this.compositeDefinitions = [];
  this.compositeWords = [];
  this.cardIndex=0;
  this.cards = [];
  this.startOver = false;

  // start search
  this.theWord = RiTa.randomWord("nn");
  this.getRandomWordDefinition(this.theWord);
}

// gotrelatedwords()
//
// add a "synonym" to the synonyms list and look up its definition

gotRelatedWords(data){
  if(data != undefined){

// create a bank of 25 'synonyms'
    for( let i=0; i< 25; i++){
      game.synonymBank.push( data[i].word );
    }

// get first synonym's definition
    game.getSynonymDefinition( game.synonymBank[0] );
  }
  else {
    // if data is undefined start over
    game.startOver = true;
  }
}

// getsynonymdefinition()
//
// builds a query to get a given word's definition. same as
// getrandomwordsDefinition() except  the callback function is
// gotSynonymDefinition().

getSynonymDefinition(input){

  let queryTextStart = "https://cors-anywhere.herokuapp.com/http://www.onelook.com/?w=";
  let queryTextEnd = "&xml=1";
  let xml = [];
  xml  = loadStrings( queryTextStart + input +"&xml=1" , {mode: "no-cors"}, this.gotSynonymDefinition );
}

// gotsynonymdefinition()
//
//

gotSynonymDefinition(data){

  // extract definition
  let definition = game.extractDefinition(data);

  // save and count definitions
  if(definition!=""){

    game.itsSynonyms.push( game.synonymBank[game.synonymResults]);
    game.synonymDefinitions.push(definition);
    // load card
    game.loadACard("synonym", game.itsSynonyms[game.synonymsChosen],game.synonymDefinitions[game.synonymsChosen]);
    game.synonymsChosen +=1;
  }

// if we've yet to find all the synonym definitions we need
  if(game.synonymsChosen < game.startingWordTypes[0]){

// get the definition from the next synonym in the bank
    game.getSynonymDefinition( game.synonymBank[game.synonymResults] );
  }

  // if we have found all the synonym definitions we need
  else if(game.synonymsChosen === game.startingWordTypes[0]){

    // if game.startOver was cued (meaning some words or definitions are null)
        if(game.startOver){
    // restart query chain
          game.startAgain();
          return;
        }

        // throw all definitions into one big array to be used later
    game.allDefinitions = concat(game.randomWordsDefinitions, game.synonymDefinitions);
    game.allDefinitions.push( game.itsDefinition );

    // create bank of all nouns:

    // make an array of all words in the definitions
    let allDefinitionWords = game.itsDefinition + game.synonymDefinitions.join(" ") + game.randomWordsDefinitions.join(" ");
    let allWordsArray = split(allDefinitionWords, " ");

// use RiTa to look for nouns:
// for all words:
    for( let k=0; k < allWordsArray.length; k++){
      let thisWord = allWordsArray[k];
      // if this word is a noun:
      if(RiTa.isNoun(thisWord)){
        // add to nouns array.
        game.allNouns.push(thisWord);
      }
    }

    // once that's done, create composite definitions
    game.createComposites();
  }
}

// extractdefinition()
//
// find the definition inside an xml result from onelook dictionary.

extractDefinition(data){

  // go to line #4
  let xmlString = data[4];
  let definition = "";

  // this would indicate an erronous result
  if(xmlString != "<OLResName>"){

    // line #4 is formatted as such:
    // "noun : definition [...] &examplesandstuff or &specialcharacters"

    // remove everthing before first ":"
    let xmlArray = splitTokens(xmlString, ":");
    let firstCut = xmlArray[1];

    // remove everything after "&". this removes things like apostrophes,
    // and any text that may follow, unfortunately, but it also removes much
    // more common things like examples, links and other related items with
    // different styling (they all start with "&"). apostrophes are rather
    // rare since there are not many contractions in dictionary language.

    if( match(firstCut, "&") != null){
      let secondCut = splitTokens(firstCut, "&");

      // trim and return result.
      definition = trim(secondCut[0]);
      return
    }
    else {
      // if there are no "&" trim and return result.
      definition = trim(firstCut);
      return definition;
    }
  }
  else {
// if there's any issue here start over.
    this.startOver = true;
    return;
  }
}


createComposites(){

  for(let i=0; i<this.startingWordTypes[2]; i++){

    let chanceToComposite = 0.6;

    let whichTypeToCopy = floor(random(this.allDefinitions.length));

    let whichDef = game.allDefinitions[ whichTypeToCopy ];
    let wordsArray;
    let composited;

    if(whichDef!=""||whichDef!=null){
      wordsArray = splitTokens( whichDef, " ");
     composited = false;
    }
    else  {
      console.log("definition missing while compositing. start over")
      this.startOver = true;
    }



    for (let j=0; j<wordsArray.length; j++){

      // RiTa.isNoun() returns true if the word is a noun
      let checkIfNoun = RiTa.isNoun( wordsArray[j] );

      if( checkIfNoun && random() < chanceToComposite ){

        composited = true;
        wordsArray[j] = this.getDifferentRandomNoun( wordsArray[j], wordsArray[j]);
      }

    }

    if(!composited){
      console.log("forced compositing")
      animationTimer = frameCount + animationLength;
      // if we failed to swap a noun, pick a random word and swap it

      let whichWord = floor(random(0, wordsArray.length));
      let thisWord = wordsArray[whichWord];
      wordsArray[ whichWord ] = this.getDifferentRandomNoun( wordsArray[whichWord], wordsArray[whichWord]);

    }
    let definition2 = wordsArray.join(" ");
    this.compositeDefinitions.push(definition2);
    this.loadACard("composite", "composite",this.compositeDefinitions[i]);
  }

  if(game.startOver){

    console.log("restart");
    animationTimer = frameCount + animationLength;
    game.startAgain();
    return;
  }

  this.tellMeWhatsUp();
  this.shuffleCards();
  gameStarted = true;
  gameRestarted = false;
  this.readyToStart = true;


}

loadACard(type, word, definition){

  this.cards.push( new Card(this.cardIndex, type, word, definition));
  this.cardIndex+=1;
}

// shufflecards()
//
// shuffle card positions at the beginning of a round (because the correct and
// incorrect ones are always generated in the same order).
// mixes up the "real" x-positions. separation into rows happens later, inside card.js.

shuffleCards(){

  let positions = [];
  for(let i=0; i<game.numberOfCards; i++){
    positions.push(game.cards[i].index);
  }
  let shuffledPositions = shuffle(positions);
  for(let i=0; i<game.numberOfCards; i++){
  game.cards[i].index = shuffledPositions[i];
  game.cards[i].updatePosition();
  }

}

getDifferentRandomNoun( varToChange, varToCompare ){
  while( varToCompare === varToChange ){

    let randomPick = floor(random(this.allNouns.length));
    let randomNoun = this.allNouns[randomPick];
    varToChange = randomNoun;
  }
  return varToChange;
}

tellMeWhatsUp(){

  console.log("----- COMPLETE LIST OF ITEMS -----")
  console.log("main word: "+this.theWord);
  console.log("its definition: "+this.itsDefinition);
  console.log("more random words: "+this.moreRandomWords);
  console.log("their definition: "+this.randomWordsDefinitions);
  console.log("related words: "+this.itsSynonyms);
  console.log("their definitions: "+this.synonymDefinitions);
  console.log("composite definitions: "+this.compositeDefinitions);
  console.log(" ---------- ")
}
}
