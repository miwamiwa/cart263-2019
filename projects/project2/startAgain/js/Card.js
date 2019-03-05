/*
Card.js

this script contains the Card class.


*/

class Card{

  constructor(index, type, word, definition){

    // index is used to calculate x, y position
    this.index =index;

    // this card's data
    this.word = word;
    this.definition= definition;
    this.type = type;

    // card states
    this.defRevealed = false;
    this.wordRevealed = false;
    this.typeRevealed = false;
    this.optionsRevealed = false;
    this.wasChecked = false;
    this.motion = true;

    // wobble animation
    this.displacement =0;

    // option buttons
    this.options.fill = 45;
    this.options.hoverFill = 95;
    this.options.w = this.w;
    this.options.h = this.h/3;
    this.options.x = this.x;
    this.options.y = this.y + this.h/2 + this.options.h/2;

// set fill according to card type.
// displayed once card is turned and guess was made. was also useful for testing.
    switch(this.type){

      case "main word": this.fill = color(215, 85, 85); break;
      case "random word": this.fill = color(85, 215, 85); break;
      case "synonym": this.fill = color(85, 85, 215); break;
      case "composite": this.fill = color(125, 185, 185); break;
    };
    this.currentFill = this.fill;

    // declare x, y, w, h parameters
    this.x =0;
    this.y=0;
    this.w=0;
    this.h=0;

    // calculate position and size given the index number
    this.updatePosition();
  }

  display(){

// setup card wobble effect

// displacement amount
  let maxDisplacement = 10;
  // "reverse" is used to calculate the mir
    let reverse =1;
    if(this.y === cardY + this.h + 30){
      reverse =-1;
    }


  if( (this.x-this.w/2-windowMargin)/(this.w+cardMargin)%2===0 && this.motion){
    this.displacement = reverse*sin( radians(frameCount)) *( maxDisplacement );
  }
  else if(this.motion){
    this.displacement = -reverse*sin( radians(frameCount)) * ( maxDisplacement );
  }
  else {
    this.displacement =0;
  }

  let yPos = this.y + this.displacement;
  let skew=0;
      if(reactionY<reactYlimit && guesses>=maxGuesses){
        skew = reactionY;
      }
  let cardWidth = this.w - 55 + skew/2;
  let cardHeight = this.h - 50 + skew/2;

// pick color:

// if this card hasn't been turned yet
if(!this.typeRevealed){
      this.currentFill = color(195);

      // if this is the currently selected card
      if(this.optionsRevealed){
        this.currentFill = 255;
      }
    }
    else{
      // if this card has been turned
      this.currentFill = this.fill
    }
    // set color value
    fill(this.currentFill);

// display card rectangle
    stroke(0);
    strokeWeight(5);
    rect(this.x, yPos, cardWidth, cardHeight, 12);

// display card definition
    if(this.defRevealed){
      noStroke();
        fill(0);
      textSize(20);
      text(this.definition, this.x, yPos+height/20, cardWidth-10, cardHeight - height/20);
    }

// display card's word
    if(this.wordRevealed){
      noStroke();
        fill(245);
      textSize(25);
      text(this.word, this.x, yPos+10, cardWidth, cardHeight)
    }
  }

    // update()
    //
    // listens for mouse click hovering over and clicking on the card.
    // starts and stops card motion on hover.
    // triggers guessing options if mouse if clicked.

  update(){

      // if mouse is hovering over card
    if(mouseX>this.x-this.w/2
      && mouseX<this.x+this.w/2
      && mouseY>this.y-this.h/2
      && mouseY<this.y+this.h/2
    ){

        // stop motion
this.motion = false;

// if mouse is pressed and user is not already guessing
      if(mouseIsPressed&&!currentlyGuessing){

        // set display state
        this.defRevealed = true;
        this.optionsRevealed = true;

        this.wasChecked = true;
        currentlyGuessing = true;
      }
    }
    else if(!this.wordRevealed){
      this.motion = true;
    }
  }


updatePosition(){

   cardMargin = 10;
  let totalMargin = (game.numberOfCards)*cardMargin;

  let cardWidth =  ( width - totalMargin ) / (game.numberOfCards/2);
  let cardHeight = height / ( 3 );

  let cardsInARow = ceil(game.numberOfCards /2);

   windowMargin = (width - ( cardsInARow* cardWidth + (cardsInARow)* cardMargin ))/2;

  let cardIndex =this.index;
  let cardX = 0.5*cardWidth + cardIndex * (cardWidth+cardMargin) + windowMargin;
  cardY = height/3+30;

  if( cardIndex >= cardsInARow ){
    cardX -= cardsInARow*cardWidth + (cardsInARow)*cardMargin;
    cardY += cardHeight+30;
  }


  this.x =cardX;
  this.y =cardY;
  this.w =cardWidth;
  this.h =cardHeight;
      //console.log(this.x+" "+this.y)

}

  options(){

this.motion = false;

    this.options.w = this.w;
    this.options.h = this.h/10;
    this.options.x = this.x;
    this.options.y = this.y + this.h/2;

    for(let i=0; i<3; i++){

      let posy = this.options.y + i * this.options.h;
      let textToDisplay;
      switch(i){
        case 0: textToDisplay = "TRUE"; break;
        case 1: textToDisplay = "DIFFERENT"; break;
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
      rect(this.options.x, posy, this.options.w, this.options.h, 10);
      fill(255);
      textSize(15);
      text(textToDisplay, this.options.x, posy, this.options.w, this.options.h/2);
    }
  }

  checkTrue(){
game.cards[game.whichCard].checkGuess("main word", 0);
  }

  checkDifferent(){
game.cards[game.whichCard].checkGuess("random word", "synonym");
  }

  checkComposite(){
game.cards[game.whichCard].checkGuess("composite", 0);
  }

  sayDefinition(){
parrot.squawk(game.cards[ game.whichCard ].definition);
  }

  checkGuess(checkForWhat, checkOther){


if(!this.wordRevealed){

  guesses +=1;

  if(this.type === checkForWhat
    || ( this.type === checkOther && checkOther != 0 )
    || ( checkForWhat==="main word" && this.definition === game.itsDefinition )

  ){

    switch(checkForWhat){
      case "main word": points += 4 - incorrectGuess; break;
      case "random word": points += 3 - incorrectGuess; break;
      case "composite": points += 1; break;
    }

    parrot.correctGuess();
  }
  else {
    incorrectGuess +=1;

    parrot.incorrectGuess();

  }
}

    // ^^^^
    // overwrite reaction in the case where player checked if card is correct definition,
    // and the correct definition matches the contents of the card.
    // sometimes the related words found through onelook have the exact same
    // definition as the word we're looking for.

    setTimeout(this.resumePlay, 300);
    this.wordRevealed = true;
    this.typeRevealed = true;
    this.optionsRevealed = false;
    this.motion = false;

  }

  resumePlay(){
    currentlyGuessing = false;
  }


}
