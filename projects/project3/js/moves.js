function loadMoves(){


  // light dancing feet
  dude.legMoves[0] = {
    height: -19.166666666666664,
  kneeDif: -0.6283185307179586,
  kneePos: 2.2619467105846525,
  speedDif: 1,
  thighDif: 0.6283185307179595,
  thighDif2: 6.283185307179593,
  thighPos: -1.759291886010284,
  thighPos2: -7.5398223686,
  }


  // light dancing feet
  dude.legMoves[1] = {
    height: -11.666666666666664,
  kneeDif: 0.1256637061435919,
  kneePos: 2.2619467105846525,
  speedDif: 1,
  thighDif: 0.5026548245743676,
  thighDif2: -5.026548245743669,
  thighPos: -2.136283004441059,
  thighPos2: -21.362830044,
  }

  // do it on the floor
  dude.legMoves[2] = {
    height: 31.66666666666667,
  kneeDif: 2.1362830044410597,
  kneePos: 0.2513274122871838,
  speedDif: 0.3,
  thighDif: 1.1309733552923253,
  thighDif2: -1.5707963267948983,
  thighPos: -2.5132741228718345,
  thighPos2: -3.7699111843,
  }

  // swimming legs
  dude.legMoves[3] = {
    height: -43.333333333333336,
  kneeDif: 0.1256637061435919,
  kneePos: 0.7539822368615514,
  speedDif: 1,
  thighDif: -0.3769911184307757,
  thighDif2: -21.362830044410593,
  thighPos: 1.7592918860102849,
  thighPos2: -10.053096491,
  }




  // macarena arms (touching shoulders)
  dude.armMoves[0]= {
    kneeDif: 2.2619467105846525,
kneePos: -0.3769911184307757,
speedDif: 0.7,
thighDif: -0.6283185307179586,
thighDif2: -7.5398223686155035,
thighPos: 1.2566370614359172,
thighPos2: 2.053096491,
  }

  // back and forth elbows
  dude.armMoves[1] = {
    kneeDif: -0.3769911184307757,
kneePos: -1.2566370614359172,
speedDif: 1,
thighDif: -1.633628179866692,
thighDif2: 1.2566370614359244,
thighPos: 0.5026548245743676,
thighPos2: -10.053096491,
  }

  // party hands
  dude.armMoves[2] = {
    kneeDif: 1.8849555921538759,
    kneePos: 0.942477796076937,
    speedDif: 1,
    thighDif: -0.8796459430051424,
    thighDif2: -23.876104167282428,
    thighPos: 0.6283185307179595,
    thighPos2: -3.7699111843,
  }

  // hands in the air2
  dude.armMoves[3] = {
    kneeDif: 1.3823007675795091,
  kneePos: 4.272566008882118,
  speedDif: 0.1,
  thighDif: 0.1256637061435919,
  thighDif2: -46.49557127312894,
  thighPos: 0,
  thighPos2: 33.9292006587,
  }
}



function newDanceMotion(){


    dude.limbs[0].changeCurrentMotion(dude.armMoves[dude.currentMoves], 20);
    dude.limbs[2].changeCurrentMotion(dude.armMoves[dude.currentMoves], 20);
    dude.limbs[1].changeCurrentMotion(dude.legMoves[dude.currentMoves], 20);
    dude.limbs[3].changeCurrentMotion(dude.legMoves[dude.currentMoves], 20);


}
