class GameSetup{

  constructor(){

    this.readyToStart = false;
    this.incorrectGuesses =0;

    this.theWord = RiTa.randomWord("nn");
    this.itsDefinition;

    this.itsSynonyms = [];
    this.synonymDefinitions = [];
    this.synonymBank=[];

    this.moreRandomWords = [];
    this.randomWordsDefinitions = [];

    this.compositeDefinitions = [];
    this.compositeWords = [];

    this.startingWordTypes = [3, 1, 5]// synonyms, random words, composites

    this.randomWordChosen = false;
    this.randomWordsChosen = 0;
    this.synonymsChosen = 0;

    this.allNouns = [];
    this.allDefinitions=[];
    this.synonymResults =0;

    this.cards = [];
    this.numberOfCards = 1 + this.startingWordTypes[0]+this.startingWordTypes[1]+this.startingWordTypes[2];
    this.cardIndex=0;

    this.getRandomWordDefinition(this.theWord);
  }



// gotrandomword()
//
// function to fire upon getting the callback response for a
// random word's definition.

  gotRandomWord(data){

    // extract definition from xml
    let definition = game.extractDefinition(data);

    // if there was some kind of issue with fetching this random word

    if((definition===""|| definition===undefined)&& game.randomWordChosen){
      // remove last random word found
      if(game.randomWordsChosen.length>0){
        game.randomWordsChosen.shift();
      }
      // for a lack of tangible results, make the loading screen animation
      // move a bit, so that the user doesn't feel like the program crashed.
      animationTimer = frameCount + animationLength;
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

    // if there was no issue in finding this random word's definition

    // pick what to do with it
    if( game.randomWordsChosen < game.startingWordTypes[1]-1 || (game.startingWordTypes[1]===1 && game.randomWordsChosen===0) ){
      if(!game.randomWordChosen){

        // if it's our main word - theWord,
        // save the definition and get a new random word
        game.randomWordChosen = true;
        game.itsDefinition = definition;
        game.loadACard("main word", game.theWord,game.itsDefinition);
        game.newRandomWord();

        //console.log("main random word :"+game.theWord +"\n and definition :"+game.itsDefinition)
      }
      else {
        // if we need more random words, save this definition and get a new one
        game.randomWordsDefinitions.push(definition);
        game.loadACard("random word", game.moreRandomWords[game.randomWordsChosen],game.randomWordsDefinitions[game.randomWordsChosen]);
        game.randomWordsChosen +=1;

      // get a new random word
        if(game.startingWordTypes[1]>1){
        game.newRandomWord();
      }
        // that is unless we only needed one extra random word.
        // in that case move on.
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

      // move on to seeking out synonyms
      game.getRelatedWord(game.theWord);
    }
  }


// getrandomworddefinition()
//
// builds a query for a definition to send to onelook dictionary.
// treats result as a randomWord definition.

  getRandomWordDefinition(input){

    let queryTextStart = "https://cors-anywhere.herokuapp.com/http://www.onelook.com/?w=";
    let queryTextEnd = "&xml=1";
    let xml = [];
    xml  = loadStrings( queryTextStart + input + queryTextEnd, this.gotRandomWord );
  }

  getRelatedWord(input){

    let queryTextStart = "https://cors-anywhere.herokuapp.com/https://api.datamuse.com/words?ml=";
    let xml = [];
    xml  = loadJSON( queryTextStart + input, this.gotRelatedWords);
  }


  newRandomWord(){

    // look for a new random word
    let newWord = RiTa.randomWord("nn");
    this.moreRandomWords.push(newWord);
    // get its definition
    this.getRandomWordDefinition(newWord)
  }

  startAgain(){

    this.readyToStart = false;

    this.randomWordChosen = false;
    this.randomWordsChosen = 0;
    this.synonymsChosen = 0;
this.synonymBank = [];
this.synonymResults = 0;

    this.theWord=0;
    this.itsDefinition="";
    this.allNouns = [];
    this.allDefinitions = [];
    this.itsSynonyms = [];
    this.synonymDefinitions = [];
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

  for( let i=0; i< 25; i++){
    game.synonymBank.push( data[i].word );
  }
console.log("successfully fetched synonyms list");
console.log("synonyms list : "+game.synonymBank)
  game.getSynonymDefinition( game.synonymBank[0] );
}
else {
  console.log("restarted. failed to retrieve related words ")
  this.startOver = true;
}
  }

  getSynonymDefinition(input){

    let queryTextStart = "https://cors-anywhere.herokuapp.com/http://www.onelook.com/?w=";
    let queryTextEnd = "&xml=1";
    let xml = [];
    xml  = loadStrings( queryTextStart + input +"&xml=1" , this.gotSynonymDefinition );
    console.log("synonym  definition searched")

  }


  gotSynonymDefinition(data){
    // save definition and count synonym definitions received
    let definition = game.extractDefinition(data);


    if(definition!=""){
      game.itsSynonyms.push( game.synonymBank[game.synonymResults]);
      game.synonymDefinitions.push(definition);
      game.loadACard("synonym", game.itsSynonyms[game.synonymsChosen],game.synonymDefinitions[game.synonymsChosen]);
      game.synonymsChosen +=1;

    }

      game.synonymResults +=1;

      // in case my code sux this prevents an infinite loop
      // of synonym queries from being fired.
      // cors-anywhere banned my ip the other day cause i was
      // accidentally flooding them with queries

      if(game.synonymResults>=25){
        console.log("fail");
        console.log("last data element: "+data)
        return;
      }


    if(game.synonymsChosen < game.startingWordTypes[0]){

      game.getSynonymDefinition( game.synonymBank[game.synonymResults] );
    }
    else if(game.synonymsChosen === game.startingWordTypes[0]){

      if(game.startOver){
        console.log("restart");
        animationTimer = frameCount + animationLength;
        game.startAgain();
        return;
      }

      game.allDefinitions = concat(game.randomWordsDefinitions, game.synonymDefinitions);
      game.allDefinitions.push( game.itsDefinition );

      // create bank of all nouns
      let allDefinitionWords = game.itsDefinition + game.synonymDefinitions.join(" ") + game.randomWordsDefinitions.join(" ");
      let allWordsArray = split(allDefinitionWords, " ");

      for( let k=0; k < allWordsArray.length; k++){
        let thisWord = allWordsArray[k];
        if(RiTa.isNoun(thisWord)){
          game.allNouns.push(thisWord);
        }
      }

      // create composite definitions
      game.createComposites();
    }

  }

  extractDefinition(data){

    //console.log("input data : "+data)

    let definition = "";
    let xmlString = data[4];

    if(xmlString!="<OLResName>"){

      let xmlArray = splitTokens(xmlString, ":");
      let firstCut = xmlArray[1];

      if( match(firstCut, "&") != null){

        let secondCut = splitTokens(firstCut, "&");

        //    console.log("output extract : "+definition);

        return definition;
      }
      else {
        definition = trim(firstCut);

        //      console.log("output extract : "+definition);

        return definition;
      }
    }
    else {
      console.log("parsing error. starting up again")
      this.startOver = true;
      return;
    }
  }


  createComposites(){

    for(let i=0; i<this.startingWordTypes[2]; i++){

      let chanceToComposite = 0.6;

      let whichTypeToCopy = floor(random(this.allDefinitions.length));

      let whichDef = this.allDefinitions[ whichTypeToCopy ];
      let wordsArray = splitTokens( whichDef, " ");
      let composited = false;


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
      this.loadACard("composite", "composite",game.compositeDefinitions[i]);
    }

    this.tellMeWhatsUp();
    this.shuffleCards();
    this.readyToStart = true;
  }

  loadACard(type, word, definition){

      this.cards.push( new Card(this.cardIndex, type, word, definition));
      this.cardIndex+=1;
  }


  shuffleCards(){

    let positions = [];
    for(let i=0; i<this.numberOfCards; i++){
      positions.push(this.cards[i].index);
    }
    let shuffledPositions = shuffle(positions);
    for(let i=0; i<this.numberOfCards; i++){
      this.cards[i].index = shuffledPositions[i];
      this.cards[i].updatePosition();
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
