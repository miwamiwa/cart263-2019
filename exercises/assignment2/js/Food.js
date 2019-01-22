// Food
//
// A class to represent food, mostly just involves the ability to be
// a random size and to reset

class Food extends Agent {

  // Constructor
  //
  // Pass arguments on to the super() constructor (e.g. for Agent)
  // Also set a minimum and maximum size for this food object which it
  // will vary between when it resets
  constructor(x,y,minSize,maxSize) {
    let randomColor = color(45, random(45, 85), random(135,215));
    super(x,y,random(minSize,maxSize),randomColor);
    this.minSize = minSize;
    this.maxSize = maxSize;
    this.vx =0;
    this.vy =0;
    this.eaten = false;
  }

update(){
  if(this.eaten){
    this.size -=1;
    this.color= color(215, 25, 25);
    if(this.size <0){
      this.reset();

    }
  }

  this.vx = random(-FOOD_MAX_SPEED, FOOD_MAX_SPEED);
  this.vy = random(-FOOD_MAX_SPEED, FOOD_MAX_SPEED);
  this.x += this.vx;
  this.y += this.vy;
  if(this.x<0 || this.x>width){
    this.x -= 500 * this.x/abs(this.x);
  }
  if(this.y<0 || this.y>height){
    this.y -= 500 * this.y/abs(this.y);
  }
}
  // reset()
  //
  // Set position to a random location on the canvas
  // Set the size to a random size within the limits

  reset() {
    score +=1;
    this.eaten = false;
    this.x = random(0,width);
    this.y = random(0,height);
    this.size = random(this.minSize,this.maxSize);
    this.color = color(45, random(45, 85), random(145,195));
  }
}
