/*
Card.js

this script contains the Card class.
- each card gets a word, a definition and a type.
- types: "main word", "random word", "synonym" or "composite".
- cards are split in a table made of two rows.
- a card's index is its position within the table. it is used to shuffle positions easily.
- x, y position is calculated using index number.
- includes the guess checking function
- up/down wobble animation is generated within card.display()
- guessing buttons are also handled here.
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

      case "main word": this.fill = color(215, 85, 85); this.typeDescription = "Correct Definition"; break;
      case "random word": this.fill = color(85, 215, 85); this.typeDescription = "Unrelated word"; break;
      case "synonym": this.fill = color(85, 85, 215); this.typeDescription = "Related word"; break;
      case "composite": this.fill = color(125, 185, 185); this.typeDescription = "Fake definition"; break;
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


  // display()
  //
  // set card's current up-down wobble position, its size and its color.
  // display this card's shapes and text.

  display(){

    // -------- CARD WOBBLE ANIMATION --------

    // displacement amount
    let maxDisplacement = 10;
    // "reverse" is used to calculate the mirrored motion of cards depending
    // on their row
    let reverse =1;
    if(this.y === cardY + this.h + 30){
      reverse =-1;
    }
    // determine whether this card's position within the table is an odd
    // or even number.
    if( (this.x-this.w/2-windowMargin)/(this.w+cardMargin)%2===0 && this.motion){

      // if it's an even number displace it with a sine function
      this.displacement = reverse*sin( radians(frameCount)) *( maxDisplacement );
    }
    else if(this.motion){
      // else if it's an odd number displace it with a reversed sine function
      this.displacement = -reverse*sin( radians(frameCount)) * ( maxDisplacement );
    }
    else {
      // if motion is FALSE, stop moving.
      this.displacement =0;
    }
    // update this card's y-position according to displacement value
    let yPos = this.y + this.displacement;


    // -------- CARD SIZE --------

    // var skew is used to vary the card's width and height
    let skew=0;
    // once a guess has been made (reaction animation is running),
    if(reactionY<reactYlimit && guesses>=maxGuesses){
      // update skew value;
      skew = reactionY;
    }
    // update with and height according to skew value.
    let cardWidth = this.w - 55 + skew/2;
    let cardHeight = this.h - 50 + skew/2;


    // -------- COLOR --------

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


    // -------- DISPLAY TEXT AND SHAPES --------

    // display card rectangle
    stroke(0);
    strokeWeight(5);
    rect(this.x, yPos, cardWidth, cardHeight, 12);

    push();

    textFont('Helvetica');

    // display card definition
    if(this.defRevealed){
      noStroke();
      fill(0);
      textSize(height/48);
      text(this.definition, this.x, yPos+ 9*cardHeight/48, cardWidth-10, cardHeight - 6*cardHeight/48);
    }

    textFont('Srisakdi');

    // display card's word
    if(this.wordRevealed){
      noStroke();
      fill(245);
      textSize(height/36);
      text(this.word, this.x, yPos + 2*cardHeight/48, cardWidth, cardHeight);

      textFont('Helvetica');

      textSize(height/48);
      text(this.typeDescription, this.x, yPos + 8*cardHeight/48, cardWidth, cardHeight);
    }
    pop();
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

        // trigger voice commands
        parrot.guessingAnnyang();

        // set display state
        this.defRevealed = true;
        this.optionsRevealed = true;
        game.whichCard = (this.x-this.w/2-windowMargin)/(this.w+cardMargin);
        // mark this card as checked.
        this.wasChecked = true;
        // toggle guessing state to active.
        currentlyGuessing = true;
      }
    }
    else if(!this.wordRevealed){
      // if this word isn't revealed, start motion
      this.motion = true;
    }
  }

  // updatePosition()
  //
  // triggered after shuffling cards.
  // updates this card's position within the table using its new index value.
  // this is where page layout is calculated.

  updatePosition(){

    // set margin around the card
    cardMargin = 10;
    let totalMargin = (game.numberOfCards)*cardMargin;

    // get card width and height using page dimensions and margin values.
    let cardWidth =  floor(( width - totalMargin ) / (game.numberOfCards/2));
    let cardHeight = floor(height / ( 3 ));

    // find number of cards in a row, given that we're splitting them in 2 rows.
    let cardsInARow = ceil(game.numberOfCards /2);

    // calculate the remaining x-margin on each side of the table
    windowMargin = floor((width - ( cardsInARow* cardWidth + (cardsInARow)* cardMargin ))/2);

    // calculate this card's x, y position given the values above and
    // this card's index number (this places them all on one row).
    let cardIndex =this.index;
    let cardX = 0.5*cardWidth + cardIndex * (cardWidth+cardMargin) + windowMargin;
    cardY = height/3+30;

    // if this card is on the second row, modify x, y position
    if( cardIndex >= cardsInARow ){
      cardX -= cardsInARow*cardWidth + (cardsInARow)*cardMargin;
      cardY += cardHeight+30;
    }

    // update this card's parameters.
    this.x =cardX;
    this.y =cardY;
    this.w =cardWidth;
    this.h =cardHeight;
  }


  // options()
  //
  // triggered in draw() if options are toggled on.
  // displays the guessing options buttons below this card.

  options(){

    this.options.w = this.w;
    this.options.h = this.h/10;
    this.options.x = this.x;
    this.options.y = this.y + this.h/2;

    // toggle card motion to off.
    this.motion = false;

    // display options buttons:

    // for each button
    for(let i=0; i<3; i++){
      // calculate its y-position
      let posy = this.options.y + i * this.options.h;
      // assign text to display
      let textToDisplay;
      switch(i){
        case 0: textToDisplay = "True"; break;
        case 1: textToDisplay = "Different"; break;
        case 2: textToDisplay = "Fake"; break;
      }

      // set color:
      let optionsFill;

      // check for mouse hovering over this option button
      if(
        mouseX > this.options.x-this.options.w/2
        && mouseX < this.options.x+this.options.w/2
        && mouseY > posy-this.options.h/2
        && mouseY < posy+this.options.h/2
      ){
        // if mouse IS hovering over button, update fill accordingly
        optionsFill = this.options.hoverFill;

        // if mouse is pressed on this button
        if(mouseIsPressed){
          // trigger the appropriate guess checking function
          switch(i){
            case 0: this.checkGuess("main word", 0); break;
            case 1: this.checkGuess("random word", "synonym"); break;
            case 2: this.checkGuess("composite", 0); break;
          }
        }
      }
      else {
        // if mouse IS NOT hovering over button, udpate fill accordingly
        optionsFill = this.options.fill;
      }

      // display button rectangle
      fill(optionsFill);
      rect(this.options.x, posy, 2*this.options.w/5, this.options.h, 10);

      // display button text
      push();

      textFont('Helvetica');
      noStroke();
      fill(255);
      textSize(height/48);
      text(textToDisplay, this.options.x, posy + this.options.h/4);
      pop();
    }
    // update voice commands text display
    voiceCommandsDescription = startingVoiceCommands + cardVoiceCommands + optionsVoiceCommands;
  }


  // checkguess( checkforwhat, checkother )
  //
  // - checks if a definition is true, a random or synonym word, or a composite.
  // - checkforwhat tells you what result you are checking for.
  // - checkother should be 0, unless you are checking for a "different" word :
  // "different" includes either "random word" or "synonym" types.
  // - also counts guesses and triggers the parrot voicing the result and picking
  // a new definition.

  checkGuess(checkForWhat, checkOther){

    // don't continue if word is already revealed
    if(!this.wordRevealed){

      // count guesses
      guesses +=1;

      // - if this card's type is the type we're checking for,
      // - or if this card's type is the "other" type (a synonym),
      // - or if we're checking for a true definition and the result is a synonym
      // definition that actually matches the true definition exactly (it happens.
      // onelook dictionary is full of repeats).
      if(this.type === checkForWhat
        || ( this.type === checkOther && checkOther != 0 )
        || ( checkForWhat==="main word" && this.definition === game.itsDefinition )
      ){

        // if result is true, give points.
        // guessing the true definition awards most points, a composite gives the least.
        // reduce points depending on guesses already made. i consider that
        // knowing some results makes the process easier. that way you get the most
        // points if you get your first guess right.

        switch(checkForWhat){
          case "main word": points += 4 - guesses; break;
          case "random word": points += 3 - guesses; break;
          case "composite": points += 1; break;
        }

        // trigger parrot reaction
        parrot.correctGuess();
      }
      else {

        // if the return is false, count incorrect guesses.
        incorrectGuess +=1;
        // trigger parrot reaction.
        parrot.incorrectGuess();
      }
    }
    // prevent clicking two objects at once by keeping the guessing status as
    // active for a hot second.
    setTimeout(this.resumePlay, 300);
    // update this card's state.
    this.wordRevealed = true;
    this.typeRevealed = true;
    this.optionsRevealed = false;
    this.motion = false;
  }

  // resets guessing state
  resumePlay(){
    currentlyGuessing = false;
  }
}
