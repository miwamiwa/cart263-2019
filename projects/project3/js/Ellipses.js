class Ellipses {

  constructor(){

    this.animator = [5];
    this.animationTimer = [0, 0, 0, 0, 0];
    this.ellipseSpacing = 30;

    for(let i=0; i<5; i++){
      this.animator[i] = new Array(20);
      for (let j=0; j<20; j++){
        this.animator[i][j] = j;
      }
    }
  }



  displayEllipses(input, thresh, x, y, numberOfEllipses, timer, bigness){

      if(input>(thresh)*255){
    //    console.log("oi");
        this.animationTimer[timer] = frameCount +3;
      }

    push();
    translate(x, y, -200);
      // for each ellipse
      for(let i=0; i<numberOfEllipses; i++){

        // set position
        let ellipseX = 0;
        let ellipseY = 0;
        let ellipseR;

        // increment animation
        if(frameCount<this.animationTimer[timer]){
          // this.animationTimer is active, speed up animation
          this.animator[timer][i] +=i*2;
        }
        else {
          // else play at normal speed
          this.animator[timer][i] +=i*0.1;
        }

        // calculate radius
        ellipseR = this.ellipseSpacing*i + sin( radians( 100*this.animator[timer][i]/100 ) )*bigness;

        // display ellipse
        noStroke();
        fill((this.animationTimer[timer]-frameCount)*120, 10000/bigness, 65, 75);
        ellipse(ellipseX, ellipseY, ellipseR, ellipseR);
      }
      pop();
    }
}
