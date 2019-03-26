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
  legRun3Motion = {
   thighPos:0.2*PI,
   kneePos:0.5*PI,
   thighDif:0.2*PI,
   kneeDif:0.2*PI,
   speedDif:1,
   thighPos2:30,
   thighDif2:-10,
  }

// whip legs around
  legJumpMotion = {
  thighPos:0,
  kneePos:1*PI,
  thighDif:.5*PI,
  kneeDif:-1,
  speedDif:1,
  thighPos2:30,
  thighDif2:-60,
  }

  // swing left leg, stand/jump on right
    legRunMotion = {
      thighPos:(-1.1)*PI,
      kneePos:0.6*PI,
      thighDif:+0.2*PI,
      kneeDif:+0.15*PI,
      speedDif:0.3,
      thighPos2:-1*PI,
      thighDif2:-1*PI,
    }

    // macarena arms (touching shoulders)
     armRunMotion = {
      thighPos:0.2*PI,
      kneePos:-0.6*PI,
      thighDif:-0.25*PI,
      kneeDif:0.75*PI,
      speedDif:0.7,
      thighPos2:16,
      thighDif2:-30,
    }

// back and forth elbows
  armRunMotion2 = {
  thighPos:0.6*PI,
  kneePos:0.3*PI,
  thighDif:0,
  kneeDif:0.5*PI,
  speedDif:1,
  thighPos2:-0.01*PI,
  thighDif2:-30,
  }

  // party hands
  armRun3Motion = {
  thighPos:.5*PI,
  kneePos:0.3*PI,
  thighDif:-0.1*PI,
  kneeDif:0.6*PI,
  speedDif:1,
  thighPos2:-4,
  thighDif2:-80,
  }

// arms extended in front
  armJumpMotion = {
    thighPos:0.1,
    kneePos:0.4,
    thighDif:- 0.2*PI,
    kneeDif:0,
    speedDif:1,
    thighPos2:1.2*PI,
    thighDif2:0,
  }

  // kick left leg
    legClickMotion = {
      thighPos:-(1.1)*PI,
      kneePos:4,
      thighDif:+0.2*PI,
      kneeDif:+0.5*PI,
      speedDif:0.8,
      thighPos2:15,
      thighDif2:-30,
    }
    // hands in the air
     armClickMotion = {
      thighPos:.4*PI,
      kneePos:-1,
      thighDif:-0.75*PI,
      kneeDif:0.25*PI,
      speedDif:0.7,
      thighPos2:-8,
      thighDif2:20,
    }
}
