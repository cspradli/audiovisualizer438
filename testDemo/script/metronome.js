export var webAudio, loops;
export function Metronome(){

    var listener = new THREE.AudioListener();
    var audioLoader = new THREE.AudioLoader();

    loops = {};

    var unlocked = false;
    var isPlaying = false;
    var startTime = 0.0;
    var currentMeasure = 0.0;
    var tempo = 92.13;
    var lookAhead = 25.0;
    var scheduleAheadTime = 0.1;
    var secondsPerBeat = 0.0;
    var measureTime = 0.0;
    var nextMeasureTime = 0.0;

    var timerWorker = null;

    var audioFiles = [
        {
            file: './audio/africa.mp3',
            loaded: false
        }
    ];

    var loadAudio = async function(file){
        return new Promise(function(resolve, reject){
            setTimeout(function(){

                loops[file] = {};
                var audio = new THREE.Audio(listener);
                const audioFile = audioLoader.load(file,
                    function(buffer){

                        console.log('loaded file: ' + file);
                        loops[file] = {
                            name: file,
                            audio: audio,
                            playing: false,
                            active: false
                        };
                        loops[file].audio.setBuffer(buffer);
                        resolve();
                    },
                    function(xhr){
                        console.log('loading: '+file+' '+(xhr.loaded/xhr.total)*100+'%');
                    },
                    function(err){
                        console.log("failed to load file: " + file);
                        console.log(err);
                    });
            },2000);

        });
    };

    var preloadFiles = async function(){
        console.log('loading files');
        var promises = [];
        for(var i in audioFiles){
            promises.push(loadAudio(audioFiles[i].file));
        }
        return Promise.all(promises);


    };

    var startWorker = async function(){
        return new Promise(function(resolve, reject){
            setTimeout(function(){
                console.log('starting worker');
                timerWorker = new Worker("./script/worker.js");
                timerWorker.onmessage = function(e) {
                    if(e.data === "tick"){
                        console.log("tick");
                        scheduler();
                    } else console.log("message: " + e.data);
                };
                timerWorker.postMessage(
                    {
                        "interval": 100
                    });
                resolve();
            },1000);

        });

    };
    this.init = async function(callback){
        preloadFiles().then(startWorker)
            .then(function(){
                timerWorker.postMessage("start");
            }).then(function(){
                loops['./audio/africa.mp3'].active = true;
                console.log(loops);
            }).then(callback);
    };
    var nextMeasure = function() {
        secondsPerBeat = 60.0/tempo;
        measureTime = 4* secondsPerBeat;
        nextMeasureTime += measureTime;

        if(currentMeasure === 0){
            for(var i in loops){
                if(loops[i].active && !loops[i].audio.isPlaying){
                    loops[i].audio.play();
                }
            }
        }

        currentMeasure++;
        console.log(currentMeasure);
        if(currentMeasure === 4) {
            currentMeasure = 0;
        }
    };
    var scheduleLoops = function(time) {

        for(var key in loops){
            loops[key].audio.hasPlaybackControl = true;
            if(!loops[key].audio.isPlaying && loops[key].active){
                console.log(key);
                loops[key].audio.setLoop(true);
            }

            // if(!loops[key].active && loops[key].playing){
            //     loops[key].audio.destroy();
            // }
        }
    };

    var scheduler = function() {
        while( nextMeasureTime < listener.context.currentTime + scheduleAheadTime){
            scheduleLoops(nextMeasureTime);

            nextMeasure();
        }
    }


}
var main = function(){
    var metronome = new Metronome();
    window.addEventListener("load", function(){
        metronome.init(function(){
            console.log('init finished');
        });
    });
};
main();
