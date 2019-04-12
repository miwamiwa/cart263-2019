function loadMoves(){

  armSpecs = {
    thighAngle: 20,
    thighOrigin: -PI/8,
    thighDisplacement: 0.2*PI,
    thighAngle2: 20,
    thighOrigin2: 10,
    thighDisplacement2: 10,
    kneeAngle: 100,
    kneeOrigin: 0.8*PI,
    kneeDisplacement: 0.8*PI,
    kneeConstraint1:1* PI,
    kneeConstraint2:1.9* PI,
    leanX: 4,
    leanY: 10
  }

  legSpecs = {
    thighAngle: 20,
    thighOrigin: -PI/8,
    thighDisplacement: 3*PI/16,
    thighAngle2: 0,
    thighOrigin2: 0,
    thighDisplacement2: 3*PI/16,
    kneeAngle: 100,
    kneeOrigin: 20*PI/19,
    kneeDisplacement: 5*PI/7,
    kneeConstraint1: PI,
    kneeConstraint2:1.9* PI,
    leanX:0,
    leanY:-4,
  }

  // light dancing feet
  legContinuous1 = {
    height:0,
    thighPos:0.2*PI,
    kneePos:0.5*PI,
    thighDif:0.2*PI,
    kneeDif:0.2*PI,
    speedDif:1,
    thighPos2:30,
    thighDif2:-10,
  }


  // light dancing feet
  legContinuous2 = {
    height:0,
    thighPos:0.6*PI,
    kneePos:0.5*PI,
    thighDif:0.2*PI,
    kneeDif:0.2*PI,
    speedDif:1,
    thighPos2:10,
    thighDif2:-20,
  }

  // do it on the floor
  legContinuous3 = {
    height:100,
    thighPos:(0.2)*PI,
    thighDif:+0.8*PI,
    thighPos2:-1.2*PI,
    thighDif2:-0.5*PI,
    kneePos:-0.5*PI,
    kneeDif:+0.2*PI,
    speedDif:0.3,
  }

  // whip legs around
  legTemp1 = {
    height:-100,
    thighPos:0,
    kneePos:1*PI,
    thighDif:.5*PI,
    kneeDif:-1,
    speedDif:1,
    thighPos2:30,
    thighDif2:40,
  }

  // swing left leg, stand/jump on right
  legTemp2 = {
    height:0,
    thighPos:(-1.1)*PI,
    kneePos:0.6*PI,
    thighDif:+0.2*PI,
    kneeDif:+0.15*PI,
    speedDif:0.3,
    thighPos2:-1*PI,
    thighDif2:-1*PI,
  }

  // kick left leg
  legTemp3 = {
    height:0,
    thighPos:-(1.1)*PI,
    kneePos:4,
    thighDif:+0.2*PI,
    kneeDif:+0.5*PI,
    speedDif:0.8,
    thighPos2:15,
    thighDif2:-30,
  }

  // macarena arms (touching shoulders)
  armContinuous1 = {
    thighPos:0.2*PI,
    kneePos:-0.6*PI,
    thighDif:-0.25*PI,
    kneeDif:0.75*PI,
    speedDif:0.7,
    thighPos2:16,
    thighDif2:-30,
  }

  // back and forth elbows
  armContinuous2 = {
    thighPos:0.6*PI,
    kneePos:0.3*PI,
    thighDif:0,
    kneeDif:0.5*PI,
    speedDif:1,
    thighPos2:-0.01*PI,
    thighDif2:-30,
  }

  // party hands
  armContinuous3 = {
    thighPos:.5*PI,
    kneePos:0.3*PI,
    thighDif:-0.1*PI,
    kneeDif:0.6*PI,
    speedDif:1,
    thighPos2:-4,
    thighDif2:-80,
  }

  // hands in the air2
  armTemp1 = {
    thighPos:-.8*PI,
    thighDif:-0.6*PI,
    thighPos2:-30,
    thighDif2:20,
    kneePos:1*PI,
    kneeDif:0.5*PI,
    speedDif:0.1,
  }

  // hands in the air
  armTemp2 = {
    thighPos:.4*PI,
    kneePos:-1,
    thighDif:-0.75*PI,
    kneeDif:0.25*PI,
    speedDif:0.7,
    thighPos2:-8,
    thighDif2:20,
  }

  // arms extended in front
  armTemp3 = {
    thighPos:0.1,
    kneePos:0.4,
    thighDif:- 0.2*PI,
    kneeDif:0,
    speedDif:1,
    thighPos2:1.2*PI,
    thighDif2:0,
  }

}


function tempMotion1(){
  limbs[0].fireTempMotion(armJumpMotion, 50, 20);
  limbs[2].fireTempMotion(armJumpMotion, 50, 20);
  limbs[1].fireTempMotion(legJumpMotion, 50, 20);
  limbs[3].fireTempMotion(legJumpMotion, 50, 20);
}

function danceMotion(input){


    limbs[0].changeCurrentMotion(armContinuous1, 100);
    limbs[2].changeCurrentMotion(armContinuous1, 100);
    limbs[1].changeCurrentMotion(legContinuous1, 100);
    limbs[3].changeCurrentMotion(legContinuous1, 100);


}
