class Card{

  constructor(index, type, word, definition){
    /*

    */
    this.index =index;
    this.word = word;
    this.definition= definition;
    this.type = type;
    this.fill = color(255);
    this.defRevealed = false;
    this.wordRevealed = false;
    this.typeRevealed = false;
    this.optionsRevealed = false;
    this.reaction = "";

    this.options.fill = 45;
    this.options.hoverFill = 95;
    this.options.w = this.w;
    this.options.h = this.h/3;
    this.options.x = this.x;
    this.options.y = this.y + this.h/2 + this.options.h/2;


    switch(this.type){
      case "main word": this.fill = color(215, 85, 85); break;
      case "random word": this.fill = color(85, 215, 85); break;
      case "synonym": this.fill = color(85, 85, 215); break;
      case "composite": this.fill = color(125, 185, 185); break;
    };
    this.currentFill = this.fill;

    let cardMargin = 10;
    let totalMargin = (this.numberOfCards+1)*cardMargin;

    let cardWidth =  ( width - totalMargin ) / (this.numberOfCards/2);
    let cardHeight = height / ( this.numberOfCards / 4 );

    let cardsInARow = (this.numberOfCards /2);

    let cardIndex =this.index;
    let cardX = 0.5*cardWidth + cardIndex * (cardWidth+cardMargin) + cardMargin;
    let cardY = height/2;

    if( cardIndex >= cardsInARow ){
      cardX -= 6*cardWidth + 5*cardMargin;
      cardY += cardHeight+cardMargin;
    }


    this.x =cardX;
    this.y =cardY;
    this.w =cardWidth;
    this.h =cardHeight;
    console.log(this.x+" "+this.y)
  }

  display(){


    rectMode(CENTER);
    textAlign(CENTER);

    if(!this.typeRevealed){
      this.currentFill = color(195);
    }
    else{
      this.currentFill = this.fill
    }

    fill(this.currentFill);

    stroke(0);
    rect(this.x, this.y, this.w, this.h);

    noStroke();
    fill(0);
    textSize(12);
    text(this.reaction, this.x, this.y-this.h/2-10, this.w, 14);
if(this.optionsRevealed){
  this.options();
}
    if(this.defRevealed){
        fill(0);
      textSize(12);
      text(this.definition, this.x, this.y+40, this.w, this.h);

    }
    if(this.wordRevealed){
        fill(245);
      textSize(14);
      text(this.word, this.x, this.y+10, this.w, this.h)

    }

  }

  update(){

    if(mouseX>this.x-this.w/2
      && mouseX<this.x+this.w/2
      && mouseY>this.y-this.h/2
      && mouseY<this.y+this.h/2
    ){

      if(mouseIsPressed&&!currentlyGuessing){
        this.defRevealed = true;
        this.optionsRevealed = true;
        currentlyGuessing = true;
      }
    }
  }

  options(){

    this.options.w = this.w;
    this.options.h = this.h/6;
    this.options.x = this.x;
    this.options.y = this.y + this.h/2 + this.options.h/2;

    for(let i=0; i<3; i++){

      let posy = this.options.y + i * this.options.h;
      let textToDisplay;
      switch(i){
        case 0: textToDisplay = "THAT'S IT"; break;
        case 1: textToDisplay = "NOT IT"; break;
        case 2: textToDisplay = "FAKE"; break;
      }
      let optionsFill;

      if(
        mouseX > this.options.x-this.options.w/2
        && mouseX < this.options.x+this.options.w/2
        && mouseY > posy-this.options.h/2
        && mouseY < posy+this.options.h/2
      ){
        optionsFill = this.options.hoverFill;

        if(mouseIsPressed){
          switch(i){
            case 0: this.checkGuess("main word", 0); break;
            case 1: this.checkGuess("random word", "synonym"); break;
            case 2: this.checkGuess("composite", 0); break;
          }
        }
      }
      else {
        optionsFill = this.options.fill;
      }

      fill(optionsFill);
      rect(this.options.x, posy, this.options.w, this.options.h);
      fill(255);
      text(textToDisplay, this.options.x, posy, this.options.w, this.options.h/2);
    }

  }

  checkGuess(checkForWhat, checkOther){
    if(this.type === checkForWhat
      || ( this.type === checkOther && checkOther != 0 )
      || ( checkForWhat==="main word" && this.definition === game.itsDefinition )

    ){
      this.reaction = "correct!"
    }
    else {
      this.reaction = "incorrect!"
      if(guesses>=strikeOut-1){

        cueStartAgain = true;
      }
    }
    // ^^^^
    // overwrite reaction in the case where player checked if card is correct definition,
    // and the correct definition matches the contents of the card.
    // sometimes the related words found through onelook have the exact same
    // definition as the word we're looking for.


    guesses +=1;
    currentlyGuessing = false;
    this.wordRevealed = true;
    this.typeRevealed = true;
    this.optionsRevealed = false;
  }


}
