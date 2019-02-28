"use strict";

/*****************

Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!

https://od-api.oxforddictionaries.com/api/v1
app_id 8e3dbc60
app_key 	46ee0a1c78e6ca4d0c6a3856fbfede81

******************/
let theWord;
let itsDefinition;
let itsSynonyms = [];
let synonymDefinitions = [];
let moreRandomWords = [];
let randomWordsDefinitions = [];
let compositeDefinitions = [];
let compositeWords = [];

let numberOfSynonyms = 2;
let numberOfRandomWords = 3;
let numberOfComposites = 5;

let randomWordChosen = false;
let randomWordsChosen = 0;
let synonymsChosen = 0;
let allNouns = [];

let readyToStart = false;

let numberOfCards = 1 + numberOfRandomWords + numberOfSynonyms + numberOfComposites;
let cards = [];

// preload()
//
// Description of preload

function preload() {

}


// setup()
//
// Description of setup

function setup() {

  createCanvas(window.innerWidth-50, window.innerHeight);
  theWord = RiTa.randomWord("nn");
  let xml = [];
  xml  = loadStrings("https://cors-anywhere.herokuapp.com/http://www.onelook.com/?w="+theWord+"&xml=1", gotRandomWord);

}

function gotRandomWord(data){

  // a var to hold this word's definition
  let definition = "";

  // go to the 4th line of the xml file
  let xmlString = data[4];

  // if this text appears, our word didn't return results.
  // try again in else{}
  if(xmlString!="<OLResName>"){

    // format is: "noun : definition &extrathings"
    // remove everything before first ":" and first "&" to extract the
    // definition from this string

    let xmlArray = splitTokens(xmlString, ":");
    let firstCut = xmlArray[1];

    // only remove "&" section if there is one
    if( match(firstCut, "&") != null){
      let secondCut = splitTokens(firstCut, "&");

      // trim result
      definition = trim(secondCut[0]);
    }
    else {

      definition = trim(firstCut);
    }

    // pick next thing to do:
    // pick more random words, or if all random words have been
    // looked up, then move on to synonyms.

    // if we've yet to find all random words
    if(randomWordsChosen<numberOfRandomWords){

      // if we've yet to find the main word (theWord)
      if(!randomWordChosen){

        // if we hadn't yet chosen the main random word,
        // mark it as chosen and save the definition
        randomWordChosen = true;
        itsDefinition = definition;

        // look for a new random word
        let newWord = RiTa.randomWord("nn");
        // save new random word
        moreRandomWords.push(newWord);
        // shoot query
        let xml = [];
        xml  = loadStrings("https://cors-anywhere.herokuapp.com/http://www.onelook.com/?w="+newWord+"&xml=1", gotRandomWord);

      }
      else {

        // if we're still looking for random words,
        // save definition and look for a new random word.
        randomWordsDefinitions.push(definition);
        // count random words found
        randomWordsChosen +=1;
        // new random word
        let newWord = RiTa.randomWord("nn");
        // save new word
        moreRandomWords.push(newWord);
        // shoot query
        let xml = [];
        xml  = loadStrings("https://cors-anywhere.herokuapp.com/http://www.onelook.com/?w="+newWord+"&xml=1", gotRandomWord);
      }
    } else {

      // if done looking for random words, seek out synonyms
      randomWordsDefinitions.push(definition);

      // pick synonyms now
      let xml = [];
      xml  = loadJSON("https://api.datamuse.com/words?ml="+theWord, gotRelatedWords);
    }

  }
  else {
    // sometimes a word doesn't return anything but links to other websites,
    // it happens somewhere in the range of 1 in 5 to 1 in 10 times.
    // in that case just start over.

    startAgain();
  }
}

// function startAgain()
//
// sets counters and search results back to 0.
// start search process from the top.

function startAgain(){

  readyToStart = false;
  randomWordChosen = false;
  randomWordsChosen = 0;
  synonymsChosen = 0;
  allNouns = [];
  theWord=0;
  itsDefinition="";
  itsSynonyms = [];
  synonymDefinitions = [];
  moreRandomWords = [];
  randomWordsDefinitions = [];
  compositeDefinitions = [];
  compositeWords = [];

  // start search
  theWord = RiTa.randomWord("nn");
  let xml = [];
  xml  = loadStrings("https://cors-anywhere.herokuapp.com/http://www.onelook.com/?w="+theWord+"&xml=1", gotRandomWord);
}

// gotrelatedwords()
//
// add a "synonym" to the synonyms list and look up its definition

function gotRelatedWords(data){

  for( let i=0; i< numberOfSynonyms; i++){
    let result = data[i].word;
    itsSynonyms.push(result);
    let xml = [];
    xml  = loadStrings("https://cors-anywhere.herokuapp.com/http://www.onelook.com/?w="+result+"&xml=1", gotSynonymDefinition);
  }
}

// gotsynonymdefinition()
//
// add a synonym definition to the appropriate list check if all synonyms were chosen

function gotSynonymDefinition(data){

  let definition = "";
  let xmlString = data[4];

  if(xmlString!="<OLResName>"){

    let xmlArray = splitTokens(xmlString, ":");
    let firstCut = xmlArray[1];
    if( match(firstCut, "&") != null){
      let secondCut = splitTokens(firstCut, "&");
      definition = trim(secondCut[0]);
    }
    else {
      definition = trim(firstCut);
    }
    synonymDefinitions.push(definition);
    // count synonyms found
    synonymsChosen +=1;

    // if all synonyms were found
    if(synonymsChosen === numberOfSynonyms){

      // create bank of all nouns
      let allDefinitionWords = itsDefinition + synonymDefinitions.join(" ") + randomWordsDefinitions.join(" ");
      let allWordsArray = split(allDefinitionWords, " ");

      for( let k=0; k < allWordsArray.length; k++){
        let thisWord = allWordsArray[k];
        if(RiTa.isNoun(thisWord)){
          allNouns.push(thisWord);
        }
      }

      // create composite definitions
      createComposites();
    }
  }
  else {
    startAgain();
  }
}

// createcomposites()
//
// creates a frankenstein-type definition using words from
// other definitions in play.
// what it does:
// - pick any non-composite definition in play
// - look for any nouns, each has a chance to get replaced
//      by a different noun from allNouns[] (list of all nouns in play)
// - if the step above did nothing, pick a random word (any
//      part of speech) and replace it with a different word from allNouns[]

function createComposites(){

  for (let i=0; i<numberOfComposites; i++){

    let whichWord;
    let whichTypeToCopy = floor(random(3));
    let pick;
    let wordsArray = [];
    let chanceToComposite = 0.6;

    if(whichTypeToCopy===0){
      whichWord = theWord;
      wordsArray = splitTokens(itsDefinition, " ");
    }
    else if(whichTypeToCopy===1){
      pick = floor(random(numberOfRandomWords));
      whichWord = moreRandomWords[pick];
      let def = randomWordsDefinitions[pick];
      wordsArray = splitTokens(def, " ");
    }
    else  if(whichTypeToCopy===2){
      pick = floor(random(numberOfSynonyms));
      whichWord = itsSynonyms[pick];
      let def = synonymDefinitions[pick];
      wordsArray = splitTokens(def, " ");
    }

    let nounsInHere = [];
    let composited = false;


    for (let j=0; j<wordsArray.length; j++){

      let thisNoun = wordsArray[j];
      let checkIfNoun = RiTa.isNoun(thisNoun);

      if(checkIfNoun){

        nounsInHere.push[j];
        if( random()<chanceToComposite ){
          composited = true;

          while( thisNoun === wordsArray[j] ){

            let randomPick = floor(random(allNouns.length));
            let randomNoun = allNouns[randomPick];
            wordsArray[j] = randomNoun;
          }
        }
      }

    }

    if(!composited){
      console.log("forced compositing")
      // if we failed to swap a noun, pick a random word and swap it
      let whichNoun = floor(random(0, wordsArray.length));
      let theNoun = wordsArray[whichNoun];
      while( theNoun === wordsArray[whichNoun] ){

        let randomPick = floor(random(allNouns.length));
        let randomNoun = allNouns[randomPick];
        wordsArray[whichNoun] = randomNoun;
      }
    }

    let definition2 = wordsArray.join(" ");
    compositeDefinitions.push(definition2);
  }

loadCards();

  readyToStart = true;
}

// loadcards()
//
// setup the cards

function loadCards(){

  console.log("the word: "+theWord);
  console.log("itsDefinition: "+itsDefinition);
  console.log("more random words: "+moreRandomWords);
  console.log("their definition: "+randomWordsDefinitions);
  console.log("related words: "+itsSynonyms);
  console.log("their definitions: "+synonymDefinitions);
  console.log("composite definitions: "+compositeDefinitions);
  // rectmode center
  // textalign center

//load cards

let cardMargin = 10;
let totalMargin = (numberOfCards+1)*cardMargin;

let cardWidth = ( width - totalMargin ) / numberOfCards;
let cardHeight = height / ( numberOfCards / 4 );


for (let i=0; i< numberOfCards; i++){
let cardIndex =i;
  let cardX = 0.5*cardWidth + cardIndex * (cardWidth+cardMargin) + cardMargin;
  let cardY = height/2;
  let cardWord;
  let cardDefinition;
  let cardType;

  let delim1 =0;
  let delim2 = numberOfRandomWords;
if(cardIndex===0){
  cardWord = theWord;
  cardDefinition = itsDefinition;
  cardType = "main word";
}
if(cardIndex>delim1 && cardIndex<=delim2){
cardWord = moreRandomWords[cardIndex-1];
cardDefinition = randomWordsDefinitions[cardIndex-1];
cardType = "random word";
}
delim1+=delim2;
delim2+= numberOfSynonyms;
if(cardIndex>delim1 && cardIndex<=delim2){
cardWord = itsSynonyms[cardIndex-delim1-1];
cardDefinition = synonymDefinitions[cardIndex-delim1-1];
cardType = "synonym";
}
delim1=delim2;
delim2+= numberOfComposites;
if(cardIndex>delim1 && cardIndex<=delim2){
cardWord = "composite";
cardDefinition = compositeDefinitions[cardIndex-delim1-1];
cardType = "composite";
}

  cards.push( new Card(cardX, cardY, cardWidth, cardHeight, cardType, cardWord, cardDefinition));

}
}

// draw()
//
// Description of draw()

function draw() {
background(125);
fill(255);
text("loading!", width/2, height/2);

if(readyToStart){
  background(235);

//console.log(numberOfCards);
for (let j=0; j<numberOfCards; j++){
//  console.log("hey")
  cards[j].display();
  cards[j].update();
}

//displayEverything();

}
}

function displayEverything(){

    let posx = 10;
    let posy = 30;
    let textsize = 15;

    textSize(textsize);
    text("main word : "+theWord, posx, posy);
    posy+= textsize +1;
    text("its definition : "+itsDefinition, posx, posy);

    for(let i=0; i<moreRandomWords.length; i++){
      posy+= textsize +1;
      posy+= textsize +1;
      text("random word : "+moreRandomWords[i], posx, posy);
      posy+= textsize +1;
      text("its definition : "+randomWordsDefinitions[i], posx, posy);
    }

    for (let i=0; i<itsSynonyms.length; i++){
      posy+= textsize +1;
      posy+= textsize +1;
      text("related word : "+itsSynonyms[i], posx, posy);
      posy+= textsize +1;
      text("its definition : "+synonymDefinitions[i], posx, posy);
    }

    for (let i=0; i<compositeDefinitions.length; i++){
      posy+= textsize +1;
      posy+= textsize +1;
      text("composite definition : "+compositeDefinitions[i], posx, posy);
    }

}
