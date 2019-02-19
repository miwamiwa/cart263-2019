/*
MR. PARROT
*/

"use strict";

let mrParrot;

$(document).ready(preload);

function preload(){

  $("html").click(setup);
}

function setup(){

$("html").off();
$("#preload").remove();
mrParrot = new Parrot();
}
