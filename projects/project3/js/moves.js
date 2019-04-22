// loadmoves()
//
// sets default leg and arm motion parameters. function called in setup.


function loadMoves(){



  dude.legMoves[0] = {
    height: -30.395833333333357,
    kneeDisplacement: 5.46072878295212,
    kneeOrigin: 0.06981317007977378,
    thighDisplacement: 1.5225009146164232,
    thighDisplacement2: 15.923140846961969,
    thighOrigin: 0.8076331798954586,
    thighOrigin2: 0.6503144610170679,
  }


  // light dancing feet
  dude.legMoves[1] = {
    height: -26.75000000000003,
    kneeDisplacement: 3.5193488478570583,
    kneeOrigin: 1.1007528597509448,
    thighDisplacement: 0.986947829072958,
    thighDisplacement2: 1.362791333749001,
    thighOrigin: 1.2465954410819782,
    thighOrigin2: -23.248741981360077,
  }

  // do it on the floor
  dude.legMoves[2] = {
    height: 6.84375,
    kneeDisplacement: 2.3143544053842606,
    kneeOrigin: 1.873957627004323,
    thighDisplacement: 1.4689456060620767,
    thighDisplacement2: 23.45435611241695,
    thighOrigin: 0.9905341220565087,
    thighOrigin2: -4.50438398733878,

  }

  // swimming legs
  dude.legMoves[3] = {
    height: -79.61458333333337,
    kneeDisplacement: 0.8415834201397304,
    kneeOrigin: 0.21709026860422675,
    thighDisplacement: 0.29072881786645277,
    thighDisplacement2: 19.43770797084096,
    thighOrigin: -0.3141592653589793,
    thighOrigin2: -17.156825633303157,
  }

  // macarena arms (touching shoulders)
  dude.armMoves[0]= {
    kneeDisplacement: 3.0507398980065252,
    kneeOrigin: 1.8792175233801962,
    thighDisplacement: 0.6120606691925321,
    thighDisplacement2: 29.981409342477935,
    thighOrigin: -0.7148677347209657,
    thighOrigin2: -116.84142540405878,
  }

  // back and forth elbows
  dude.armMoves[1] = {
    kneeDisplacement: 1.5779689127619954,
    kneeOrigin: 0.7746392844467986,
    thighDisplacement: 0.34428412642079936,
    thighDisplacement2: 20.943951023931955,
    thighOrigin: -1.1165325488785638,
    thighOrigin2: -111.72019902354936,
  }

  // party hands
  dude.armMoves[2] = {
    kneeDisplacement: 0.9424777960769374,
    kneeOrigin: 1.8849555921538754,
    thighDisplacement: 0.6283185307179596,
    thighDisplacement2: -3.769911184299989,
    thighOrigin: -0.8796459430051425,
    thighOrigin2: -23.87610416728242,
  }

  // hands in the air2
  dude.armMoves[3] = {
    kneeDisplacement: 3.1176840336994585,
    kneeOrigin: 0.7378200098156853,
    thighDisplacement: 0.29072881786645277,
    thighDisplacement2: 47.12388980384689,
    thighOrigin: -0.011954309945166441,
    thighOrigin2: -157.07963267948966,
  }
}
