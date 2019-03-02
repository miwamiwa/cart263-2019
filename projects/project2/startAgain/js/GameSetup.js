class GameSetup{

  constructor(){

    this.readyToStart = false;

    this.theWord = RiTa.randomWord("nn");
    this.itsDefinition;

    this.itsSynonyms = [];
    this.synonymDefinitions = [];

    this.moreRandomWords = [];
    this.randomWordsDefinitions = [];

    this.compositeDefinitions = [];
    this.compositeWords = [];

    this.startingWordTypes = [3, 2, 8] // synonyms, random words, composites

    this.randomWordChosen = false;
    this.randomWordsChosen = 0;
    this.synonymsChosen = 0;

    this.allNouns = [];
    this.allDefinitions=[];

    this.cards = [];
    this.numberOfCards = 1 + this.startingWordTypes[0]+this.startingWordTypes[1]+this.startingWordTypes[2];

    this.getRandomWordDefinition(this.theWord);
  }


  gotRandomWord(data){

    // extract definition from xml
    let definition = game.extractDefinition(data)

    if(definition===0){
      return;
    }

    // pick what to do with it
    if( game.randomWordsChosen < game.startingWordTypes[1] ){
      if(!game.randomWordChosen){

        // if it's our main word - theWord,
        // save the definition and get a new random word

        game.randomWordChosen = true;
        game.itsDefinition = definition;
        game.newRandomWord();

        console.log("main random word :"+game.theWord +"\n and definition :"+game.itsDefinition)
      }
      else {

        // if we need more random words, save this definition and get a new one
        game.randomWordsDefinitions.push(definition);
        game.randomWordsChosen +=1;
        game.newRandomWord();
      }
    }
    else {

      // if done looking for random words,
      // push this last definition
      game.randomWordsDefinitions.push(definition);
      // seek out synonyms
      game.getRelatedWord(game.theWord);
    }
  }

  getRandomWordDefinition(input){

    let queryTextStart = "https://cors-anywhere.herokuapp.com/http://www.onelook.com/?w=";
    let queryTextEnd = "&xml=1";
    let xml = [];
    xml  = loadStrings( queryTextStart + input + queryTextEnd, this.gotRandomWord );
  }

  getRelatedWord(input){

    let queryTextStart = "https://api.datamuse.com/words?ml=";
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

    // start search
    this.theWord = RiTa.randomWord("nn");
    this.getRandomWordDefinition(this.theWord);

  }

  // gotrelatedwords()
  //
  // add a "synonym" to the synonyms list and look up its definition

  gotRelatedWords(data){

    for( let i=0; i< game.startingWordTypes[0]; i++){
      game.itsSynonyms.push( data[i].word );
      game.getSynonymDefinition( data[i].word );
    }
  }

  getSynonymDefinition(input){

    let queryTextStart = "https://cors-anywhere.herokuapp.com/http://www.onelook.com/?w=";
    let queryTextEnd = "&xml=1";
    let xml = [];
    xml  = loadStrings( queryTextStart + input + queryTextEnd, this.gotSynonymDefinition );
  }


  gotSynonymDefinition(data){

    // save definition and count synonym definitions received
    let definition = game.extractDefinition(data);

    if(definition===0){
      return;
    }

    game.synonymDefinitions.push(definition);
    game.synonymsChosen +=1;
/*
    console.log("pushed definition :"+definition)
    console.log("random definitions "+game.randomWordsDefinitions.length);
    console.log("synonyms definitions "+game.synonymDefinitions.length)
*/
    // if all synonyms were found
    if(game.synonymsChosen === game.startingWordTypes[0]){

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
        definition = trim(secondCut[0]);
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
    //  console.log("output 0")
      game.startAgain();
      return 0;
    }
  }


  createComposites(){

for(let i=0; i<this.startingWordTypes[2]; i++){

      let chanceToComposite = 0.6;

      let whichTypeToCopy = floor(random(this.allDefinitions.length));

      console.log("all defs :"+this.allDefinitions)
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
        // if we failed to swap a noun, pick a random word and swap it

        let whichWord = floor(random(0, wordsArray.length));
        let thisWord = wordsArray[whichWord];
        wordsArray[ whichWord ] = this.getDifferentRandomNoun( wordsArray[whichWord], wordsArray[whichWord]);

      }
      let definition2 = wordsArray.join(" ");
  this.compositeDefinitions.push(definition2);
    }

      this.loadCards();
      this.readyToStart = true;
    }



  loadCards(){

   this.tellMeWhatsUp();

    //load cards




    for (let i=0; i< this.numberOfCards; i++){

      let cardIndex =i;

      let cardWord;
      let cardDefinition;
      let cardType;

      let delim1 =0;
      let delim2 = this.startingWordTypes[1];

      if(cardIndex===0){
        cardWord = this.theWord;
        cardDefinition = this.itsDefinition;
        cardType = "main word";
      }
      if(cardIndex>delim1 && cardIndex<=delim2){
        cardWord = this.moreRandomWords[cardIndex-1];
        cardDefinition = this.randomWordsDefinitions[cardIndex-1];
        cardType = "random word";
      }
      delim1+=delim2;
      delim2+= this.startingWordTypes[0];
      if(cardIndex>delim1 && cardIndex<=delim2){
        cardWord = this.itsSynonyms[cardIndex-delim1-1];
        cardDefinition = this.synonymDefinitions[cardIndex-delim1-1];
        cardType = "synonym";
      }
      delim1=delim2;
      delim2+= this.startingWordTypes[2];
      if(cardIndex>delim1 && cardIndex<=delim2){
        cardWord = "composite";
        cardDefinition = this.compositeDefinitions[cardIndex-delim1-1];
        cardType = "composite";
      }

      this.cards.push( new Card(cardIndex, cardType, cardWord, cardDefinition));

    }
    this.shuffleCards();
  }


  shuffleCards(){

    let positions = [];
    for(let i=0; i<this.numberOfCards; i++){
      positions.push(this.cards[i].index);
    }
    let shuffledPositions = shuffle(positions);
    for(let i=0; i<this.numberOfCards; i++){
      this.cards[i].index = shuffledPositions[i];
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

    console.log("the word: "+this.theWord);
    console.log("this.itsDefinition: "+this.itsDefinition);
    console.log("more random words: "+this.moreRandomWords);
    console.log("their definition: "+this.randomWordsDefinitions);
    console.log("related words: "+this.itsSynonyms);
    console.log("their definitions: "+this.synonymDefinitions);
    console.log("composite definitions: "+this.compositeDefinitions);
  }
}
