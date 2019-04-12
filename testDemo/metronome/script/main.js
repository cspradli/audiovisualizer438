import * as metro from "./metronome.js";
import {Visualizer} from "./visualizer.js";
import {GUI} from "./gui.js";

var metronome = new metro.Metronome();
var visualizer;
var gui;


async function init(){
    metronome.init().then(function(){

        visualizer = new Visualizer(metronome.ctx);
        gui = new GUI(metronome);
    })
}

init();