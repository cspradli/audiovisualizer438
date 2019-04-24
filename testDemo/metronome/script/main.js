
import {Visualizer} from "./visualizer.js";
import {GUI} from "./gui.js";
import {AudioEngine} from "./audioengine.js";
import {Metronome} from "./metronome.js";

var audioEngine = new AudioEngine();
var metronome = new Metronome(audioEngine);
var visualizer = new Visualizer();
var gui = new GUI(metronome);


async function init(){
    return new Promise(function(resolve,reject){

        audioEngine.init().then(gui.init).then(function(){
            visualizer.init(metronome).then(metronome.init);
            resolve();
        });

        // metronome.init().then(function(){
        //     visualizer = new Visualizer(metronome.ctx);
        //     gui = new GUI(metronome);
        //     gui.init().then(function(){
        //         visualizer.init(metronome).then(resolve);
        //     });
        // });
    });

}

init();