class Agent{

  constructor(x,y,size,c){
    this.x = x;
    this.y = y;
    this.size = size;
    this.c = c;
    this.alive = true;
  }

  display(){
    if(this.alive){
      push();
      noStroke();
      fill(this.c);
      ellipse(this.x, this.y, this.size, this.size);
      pop();
    }
  }

  collision(target){
    if(!this.alive){
      return;
    }
    let distance = dist(this.x, this.y, target.x, target.y)*2;
    if( distance < this.size+target.size){
      return true;
    }
    else {
      return false;
    }
  }

}
