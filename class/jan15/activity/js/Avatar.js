class Avatar extends Agent {
  constructor(x,y,size,c){
    super(x, y, size, c);
    this.sizeLoss= SIZE_LOSS_OVER_TIME;
    this.maxSize = size;
  }

  update(){

    if(!this.alive){
      return;
    }

    this.x= mouseX;
    this.y = mouseY;
    this.size -= this.sizeLoss;
    this.size = constrain(this.size, 0, this.maxSize);

    if(this.size===0){
      this.alive = false;
      console.log("DED");
    }
  }

  eat(target){
    if(!this.alive){
      return;
    }

    this.size += target.size;
    this.size= constrain(this.size, 0, this.maxSize);
    target.reset();
  }

}
