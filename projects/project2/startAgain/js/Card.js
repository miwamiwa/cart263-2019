class Card{

  constructor(x, y, w, h, type, word, definition){
this.x =x;
this.y =y;
this.w =w;
this.h =h;
this.word = word;
this.definition= definition;
this.type = type;
this.fill = color(255);



switch(this.type){
  case "main word": this.fill = color(215, 85, 85); break;
  case "random word": this.fill = color(85, 215, 85); break;
  case "synonym": this.fill = color(85, 85, 215); break;
  case "composite": this.fill = color(125, 185, 185); break;
};
this.currentFill = this.fill;
  }

  display(){
    rectMode(CENTER);
    textAlign(CENTER);


    fill(this.currentFill);
    stroke(0);
    rect(this.x, this.y, this.w, this.h);

    noStroke();
    fill(0);
    textSize(14);
    text(this.word, this.x, this.y+10, this.w, this.h)

    textSize(12);
    text(this.definition, this.x, this.y+40, this.w, this.h)
  }

  update(){

    if(mouseX>this.x-this.w/2 && mouseX<this.x+this.w/2){

      this.currentFill = color(85);
    }
    else {

      this.currentFill = this.fill;
    }
  }

  }
