import {AudioEngine} from "./audioengine.js";

export function Metronome(){
    this.audioEngine = new AudioEngine();
    //these are private
    var parent = this; //used to call instance vars within the context of a function

    //time tracking vars
    var currentMeasure = 0;
    var tempo = 92.13;
    var lookAhead = 25.0; // not used yet, may need to add.
    var scheduleAheadTime = 0.1;
    var secondsPerBeat = 0.0;
    var measureTime = 0.0;
    var nextMeasureTime = 0.0;

    var timerWorker = null;


    // runs all of the initialization functions in the necessary order. consider moving this function to constructor?
    this.init = async function(){
        return new Promise(function(resolve,reject){
            setTimeout(function(){
                parent.audioEngine.init()
                    .then(startWorker)
                    .then(function(){
                        timerWorker.postMessage("start");
                        resolve();
                    })
            },1000);
        })
    };

    // starts the worker, sends first tick message
    var startWorker = async function(){
        return new Promise(function(resolve, reject){
            setTimeout(function(){
                console.log('starting worker');

                timerWorker = new Worker("./script/worker.js");

                //event hook for 'tick'
                timerWorker.onmessage = function(e) {
                    if(e.data === "tick"){
                        scheduler();
                    } else console.log("message: " + e.data);
                };

                //send first tick
                timerWorker.postMessage(
                    {
                        "interval": 50
                    });
                resolve();
            },1000);
        });
    };

    // ran by scheduler after the loops are scheduled. counts to 4, then resets, keeps track of the time of next measure.
    var nextMeasure = function() {
        console.log(currentMeasure);
        secondsPerBeat = 60.0/tempo;
        measureTime = 4* secondsPerBeat;
        nextMeasureTime += measureTime;

        currentMeasure++;
        if(currentMeasure === 4) {
            currentMeasure = 0;
        }
    };

    //called every time the worker gets a 'tick' message
    var scheduler = function() {
        while( nextMeasureTime < parent.audioEngine.listener.context.currentTime + scheduleAheadTime){
            parent.audioEngine.scheduleLoops(nextMeasureTime);
            nextMeasure();
        }
    };
}