/*

displays.js
The following are functions that display game elements:
- display Start Screen,
- display Game Over Screen,
- display Background,
- react (displays the guessing reaction text)
- display Ellipses (handles the ellipses in the background)
- handle Score (display score and listen for game over)
- display Count Down
- display Loading Screen

*/



// displaystartscreen()
//
// displays a starting screen with some kind of introduction to the game

function displayStartScreen(){

  displayBackground(color(215, 215, 245));
  parrot.state = "start";
  parrot.motion+=0.5;
  parrot.display();

  // backdrop
  fill(255, 150);
  rect(width/2, height/2, width-60, height-100)

  // title
  fill(0);
  textSize(height/10);
  let startTitle = "welcome to true, different or fake!";
  text(startTitle, width/2, height/4, width-80, (height-50)/4);
  parrot.x = width/2;
  parrot.y = height/2;
  parrot.beakLength = width/3;

  // body
  textSize(height/30);
  let startDescription =
  "\n\n\nthat day mr. parrot put on his smartee brand pants and flew to the dictionary, flapping through pages and stopping on random ones. "
  + "\n\nhe squawked: 'rwaak! let's play a game! first, i'll state word, then i'll suggest definitions. "
  + "\n\nyou tell me if they're the true definition, a definition for a different word, or a fake definition. "
  + "\n\nsquawk! true, different or fake! perhaps all i can do is repeat things, but i bet you can't tell what's real!"
  + "\n\nclick to start";
  text(startDescription, width/2, 3*height/5, width-100, 3*(height-50)/4,);
}



// displaygameoverscreen()
//
// displays the animated game over text

function displayGameOverScreen(){

  // display a colored rectangle behind it
  fill(145, 215, 110, 3+gameOverY/10);
  rect(width/2, height/2, width, height);
  fill(255);
  noStroke();
  textSize(30);
  text("click to restart!\nor say 'let's start again'\nor say 'good parrot!'", width/2, height/2);

  // increment animation
  gameOverY+=2;

  // display text
  if(gameOverY<1*height/2){
    fill(255-gameOverY);
    textSize(45+gameOverY*3);
    text("game over!", width/2, height/2+gameOverY*0.3, width, height);
  }
}



// displaybackground()
//
// combines background color,
// and ellipses animation (which moves and changes color with mouse position)

function displayBackground(input){
  if(input!=0){
      background(input);
  }

  displayEllipses();
}



// react()
//
// text triggered when user makes a guess.
// displays the reaction text (either "correct" or "incorrect").
// animates its size and position.

function react(){

  if(!reactionStarted){
    voiceCommandsDescription = "";
    displayBackground(color(45, 225, 225));
    reactionStarted = true;
  }

  voiceCommandsDescription = "";
  // set animation limit
  reactYlimit= 1*height/4;
  // increment animation
  reactionY+=2;
  voiceCommandsDescription = "";
  // display text.
  if(reactionY<reactYlimit){

    stroke(245, 45, 45);
    strokeWeight(1);
    fill(45, 45, 0+reactionY*1);
    textSize(25+reactionY*1);
    text(reaction, width/2, height/2+reactionY*0.15, width, height);

  }
  else if(reactionY === reactYlimit-1){
    reactionStarted = false;
    voiceCommandsDescription = startingVoiceCommands + cardVoiceCommands + optionsVoiceCommands;
  }
}



// displayellipses()
//
// display a bunch of ellipses.
// vary their radii.

function displayEllipses(){

  // for each ellipse
  for(let i=0; i<numberOfEllipses; i++){

    // set position
    let ellipseX = width/3;
    let ellipseY = height/2;
    let ellipseR;

    // increment animation
    if(frameCount<animationTimer){
      // animationTimer is active, speed up animation
      animator[i]+=10;
    } else if(!gameStarted){
      animator[i]+=0.1;
    } else {
      // else play at normal speed
      animator[i] +=i*1;
    }

    // calculate radius
    ellipseR = ellipseSpacing*i + sin( radians( 100*animator[i]/100 ) )*50;

    // display ellipse
    stroke(125+sin(radians(frameCount*4))*100, 125+125*mouseX/width, 255*mouseY/height, 150);
    strokeWeight(4);
    noFill();
    ellipse(ellipseX, ellipseY, ellipseR, ellipseR);
  }
}



// displayloadingscreen()
//
// displays the loading screen...

function displayLoadingScreen(){

  // setup on first frame
  if(!loadScreenStarted){
    loadScreenStarted = true;

    // move and resize parrot
    parrot.x = width/3;
    parrot.y = height/2;
    parrot.beakLength = width/20;
  }

  // display animated ellipses.
  displayBackground(0);

  // display parrot
  parrot.motion+=0.5;
  parrot.state = "load";
  parrot.display();

  // display text
  push();
  noStroke();
  fill(255);
  textSize(30);
  text("loading!", width/2, height/2);
  pop();

}



// displaycountdown()
//
// displays the countdown to the next round.

function displayCountDown(){

  if(timerDisplay>0 && reactionY >= reactYlimit){

    // increment countdown
    timerDisplay -= 1/frameRate();

    // display countdown
    push();
    textSize(width/12);
    stroke(3);
    fill(255);
    text("new round in "+ceil(timerDisplay)+" seconds", width/2, 3*height/5);
    pop();
  }
}



// handlescore()
//
// displays score and checks if game or round is over.

function handleScore(){

  // display score.
  push();
  fill(0);
  textSize(height/36);
  noStroke();
  let guessesLeft = strikeOut - incorrectGuess;
  fill(225);
  text("score : "+points+", incorrect guesses left: "+guessesLeft, width/2, height/32);
  fill(5);
  text("score : "+points+", incorrect guesses left: "+guessesLeft, width/2-1, height/32-1);
  pop();
  // trigger game over if user runs out of incorrect guesses
  if(incorrectGuess>=strikeOut){

    // squawk game over and set state.
    parrot.squawk("game over!");

    guesses =0;
    gameOver = true;
    //  prevent clicking for a hot second.
    setTimeout(function(){ gameOverClickable = true; }, 400);
  }

  // trigger new round if maximum number of guesses was reached for this round.
  if(guesses>=maxGuesses){

    // reveal all cards
    for(let i=0; i<game.cards.length; i++){
      game.cards[i].wordRevealed = true;
      game.cards[i].typeRevealed = true;
      game.cards[i].defRevealed = true;
    }

    // set game to restart in 10 seconds
    guesses =0;
    timerDisplay = 10;
    setTimeout(function(){cueStartAgain = true;}, 10000);
  }
}
