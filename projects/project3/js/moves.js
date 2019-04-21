// loadmoves()
//
// sets default leg and arm motion parameters

function loadMoves(){


  // light dancing feet
  dude.legMoves[0] = {
    height: -19.166666666666664,
    kneeOrigin: -0.6283185307179586,
    kneeDisplacement: 2.2619467105846525,
    thighOrigin: 0.6283185307179595,
    thighOrigin2: 6.283185307179593,
    thighDisplacement: -1.759291886010284,
    thighDisplacement2: -7.5398223686,
  }


  // light dancing feet
  dude.legMoves[1] = {
    height: -11.666666666666664,
    kneeOrigin: 0.1256637061435919,
    kneeDisplacement: 2.2619467105846525,
    thighOrigin: 0.5026548245743676,
    thighOrigin2: -5.026548245743669,
    thighDisplacement: -2.136283004441059,
    thighDisplacement2: -21.362830044,
  }

  // do it on the floor
  dude.legMoves[2] = {
    height: 31.66666666666667,
    kneeOrigin: 2.1362830044410597,
    kneeDisplacement: 0.2513274122871838,
    thighOrigin: 1.1309733552923253,
    thighOrigin2: -1.5707963267948983,
    thighDisplacement: -2.5132741228718345,
    thighDisplacement2: -3.7699111843,
  }

  // swimming legs
  dude.legMoves[3] = {
    height: -43.333333333333336,
    kneeOrigin: 0.1256637061435919,
    kneeDisplacement: 0.7539822368615514,
    thighOrigin: -0.3769911184307757,
    thighOrigin2: -21.362830044410593,
    thighDisplacement: 1.7592918860102849,
    thighDisplacement2: -10.053096491,
  }

  // macarena arms (touching shoulders)
  dude.armMoves[0]= {
    kneeOrigin: 2.2619467105846525,
    kneeDisplacement: -0.3769911184307757,
    thighOrigin: -0.6283185307179586,
    thighOrigin2: -7.5398223686155035,
    thighDisplacement: 1.2566370614359172,
    thighDisplacement2: 2.053096491,
  }

  // back and forth elbows
  dude.armMoves[1] = {
    kneeOrigin: -0.3769911184307757,
    kneeDisplacement: -1.2566370614359172,
    thighOrigin: -1.633628179866692,
    thighOrigin2: 1.2566370614359244,
    thighDisplacement: 0.5026548245743676,
    thighDisplacement2: -10.053096491,
  }

  // party hands
  dude.armMoves[2] = {
    kneeOrigin: 1.8849555921538759,
    kneeDisplacement: 0.942477796076937,
    thighOrigin: -0.8796459430051424,
    thighOrigin2: -23.876104167282428,
    thighDisplacement: 0.6283185307179595,
    thighDisplacement2: -3.7699111843,
  }

  // hands in the air2
  dude.armMoves[3] = {
    kneeOrigin: 1.3823007675795091,
    kneeDisplacement: 4.272566008882118,
    thighOrigin: 0.1256637061435919,
    thighOrigin2: -46.49557127312894,
    thighDisplacement: 0,
    thighDisplacement2: 33.9292006587,
  }
}
