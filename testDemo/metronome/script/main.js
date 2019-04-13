import * as metro from "./metronome.js";
import {Visualizer} from "./visualizer.js";
import {GUI} from "./gui.js";

var metronome = new metro.Metronome();
var visualizer = new Visualizer();
var gui;


async function init(){
    return new Promise(function(resolve,reject){
        setTimeout(function(){
            metronome.init().then(function(){
                visualizer = new Visualizer(metronome.ctx);
                gui = new GUI(metronome);
                gui.init().then(function(){
                    visualizer.init(metronome).then(resolve);
                });
            });
        })
    });

}

init();