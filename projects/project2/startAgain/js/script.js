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

// preload()
//
// Description of preload

function preload() {

}


// setup()
//
// Description of setup

function setup() {

  theWord = RiTa.randomWord("nn");
  let xml = [];
  xml  = loadStrings("https://cors-anywhere.herokuapp.com/http://www.onelook.com/?w="+theWord+"&xml=1", gotRandomWord);

}

function gotRandomWord(data){
//  console.log(data[4]);
if(data!=undefined){
  let definition = "";
  let xmlString = data[4];

  if(xmlString!="<OLResName>"){

    let xmlArray = splitTokens(xmlString, ":");
    let firstCut = xmlArray[1];
  //  console.log("****VAR data = "+data)
  // console.log("****VAR firstCut = "+firstCut)
    if( match(firstCut, "&") != null){
      let secondCut = splitTokens(firstCut, "&");
      definition = trim(secondCut[0]);
    }
    else {
      definition = trim(firstCut);
    }


  if(randomWordsChosen<numberOfRandomWords){

    if(!randomWordChosen){

      randomWordChosen = true;
      itsDefinition = definition;
      let newWord = RiTa.randomWord("nn");
      moreRandomWords.push(newWord);
      let xml = [];
      xml  = loadStrings("https://cors-anywhere.herokuapp.com/http://www.onelook.com/?w="+newWord+"&xml=1", gotRandomWord);

    }
    else {

      randomWordsDefinitions.push(definition);
      randomWordsChosen +=1;
      let newWord = RiTa.randomWord("nn");
      moreRandomWords.push(newWord);
      let xml = [];
      xml  = loadStrings("https://cors-anywhere.herokuapp.com/http://www.onelook.com/?w="+newWord+"&xml=1", gotRandomWord);
    }
  } else {

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
}

function startAgain(){

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

   theWord = RiTa.randomWord("nn");
   let xml = [];
   xml  = loadStrings("https://cors-anywhere.herokuapp.com/http://www.onelook.com/?w="+theWord+"&xml=1", gotRandomWord);
}

function gotRelatedWords(data){

  for( let i=0; i< numberOfSynonyms; i++){
    let result = data[i].word;
    itsSynonyms.push(result);
    let xml = [];
    xml  = loadStrings("https://cors-anywhere.herokuapp.com/http://www.onelook.com/?w="+result+"&xml=1", gotSynonymDefinition);
  }
}

function gotSynonymDefinition(data){

  if(data!=undefined){
    let definition = "";
    let xmlString = data[4];

      if(xmlString!="<OLResName>"){

    let xmlArray = splitTokens(xmlString, ":");
    let firstCut = xmlArray[1];
  //  console.log("****VAR xmlString = "+xmlString)
//    console.log("****VAR firstCut = "+firstCut)
    if( match(firstCut, "&") != null){
      let secondCut = splitTokens(firstCut, "&");
      definition = trim(secondCut[0]);
    }
    else {
      definition = trim(firstCut);
    }
  synonymDefinitions.push(definition);
  synonymsChosen +=1;

  if(synonymsChosen === numberOfSynonyms){

// create bank of nouns
let allDefinitionWords = itsDefinition + synonymDefinitions.join(" ") + randomWordsDefinitions.join(" ");
let allWordsArray = split(allDefinitionWords, " ");

for( let k=0; k < allWordsArray.length; k++){
  let thisWord = allWordsArray[k];
if(RiTa.isNoun(thisWord)){
  allNouns.push(thisWord);
}
}
console.log(allNouns);
    createComposites();
  }
}
else {
  startAgain();
}
}
}

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

  console.log("the word: "+theWord);
  console.log("itsDefinition: "+itsDefinition);
  console.log("more random words: "+moreRandomWords);
  console.log("their definition: "+randomWordsDefinitions);
  console.log("related words: "+itsSynonyms);
  console.log("their definitions: "+synonymDefinitions);
  console.log("composite definitions: "+compositeDefinitions);
}

// draw()
//
// Description of draw()

function draw() {

}
