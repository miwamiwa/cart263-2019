class Line extends Shape {
  constructor(x,y,x2,y2,size,c) {
    super(x,y,size);
    this.c = c; // Color
    this.x2 = x2;
    this.y2 = y2;
  }
  update() {
    super.update(); // Do the generic Shape update()
    this.x2 += random(-1,1);
    this.y2 += random(-1,1);
  }
  display() {
    push();
    stroke(this.c);
    noFill();
    line(this.x,this.y,this.x2,this.y2);
    pop();
  }
}
