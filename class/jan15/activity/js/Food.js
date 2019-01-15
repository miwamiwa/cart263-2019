class Food extends Agent {
  constructor(x,y,size,c){
    super(x, y, size, c);
    this.maxSize = FOOD_MAX_SIZE;
    this.minSize = FOOD_MIN_SIZE;
    this.size = random(this.minSize, this.maxSize);
  }

  reset(){
    this.x = random(width);
    this.y = random(height);
    this.size = random(this.minSize, this.maxSize);
  }



}
