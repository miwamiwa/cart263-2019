class Parrot{

  constructor(){
this.knownWords = goodWords; // PLACEHOLDER WORDS
  }

saySomething(){

let randomPick = Math.floor( Math.random() * this.knownWords.length );
let chosenWord = this.knownWords[randomPick];
console.log(chosenWord);
responsiveVoice.speak(chosenWord, "UK English Female", {
  pitch: 0,
  rate: 1,
});

}

}
