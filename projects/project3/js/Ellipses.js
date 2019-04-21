/*
Ellipses.js
This class handles generating groups of ellipses that react to sound.
displayEllipses() can be configured to display multiple groups of ellipses.
*/
class Ellipses {

  constructor(){
    // keeps track of each ellipse's motion
    this.animator = [5];
    for(let i=0; i<5; i++){
      this.animator[i] = new Array(20);
      for (let j=0; j<20; j++){
        this.animator[i][j] = j;
      }
    }
    // timer during which ellipses move faster
    this.animationTimer = [0, 0, 0, 0, 0];
    // initial spacing
    this.ellipseSpacing = 30;
  }

// displayEllipses()
//
// - displays a group of animated ellipses at middle position x, y
// - if input value lies above the given threshold, ellipses will move faster
// for a short amount of time.
// - other inputs are the number of ellipses to display, which timer in the
// this.animationTimer array to use, and maximum size.

  displayEllipses(input, thresh, x, y, numberOfEllipses, timer, size){

    // if input excedes threshold
      if(input>(thresh)*255){
        // extend animation timer length
        this.animationTimer[timer] = frameCount +3;
      }
    push();

    // move to inputed ellipse position
    translate(x, y, -600);

      // for each ellipse
      for(let i=0; i<numberOfEllipses; i++){
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
        ellipseR = this.ellipseSpacing*i + sin( radians( 100*this.animator[timer][i]/100 ) )*size;

        // choose fill
        noStroke();
        if(size<350){
          // small groups get this fill
          fill(20000/size, (this.animationTimer[timer]-frameCount)*120, 145, 75);
        }
        else {
          // big groups get this fill
          fill((this.animationTimer[timer]-frameCount)*120, 20000/size, 145, 75);
        }

        // display ellipse
        ellipse(ellipseX, ellipseY, ellipseR, ellipseR);
      }
      pop();
    }
}
