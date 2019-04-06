export function Metronome(){
    var parent = this;
    this.listener = new THREE.AudioListener();
    this.loops = [];
    var audioLoader = new THREE.AudioLoader();


    var currentMeasure = 0;
    var tempo = 92.13;
    var lookAhead = 25.0;
    var scheduleAheadTime = 0.1;
    var secondsPerBeat = 0.0;
    var measureTime = 0.0;
    var nextMeasureTime = 0.0;

    var timerWorker = null;

    this.audioFiles = [
        './audio/drums.mp3',
        './audio/hats.mp3'
    ];


    var loadAudio = async function(file){
        return new Promise(function(resolve, reject){
            setTimeout(function(){

                var audio = new THREE.Audio(parent.listener);
                audioLoader.load(file,
                    function(buffer){
                        audio.setBuffer(buffer);

                        console.log('loaded file: ' + file);
                        parent.loops.push({
                            name: file,
                            audio: audio,
                            active: false
                        });
                        // parent.loops[file].audio.setBuffer(buffer);
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
        for(var i in parent.audioFiles){
            promises.push(loadAudio(parent.audioFiles[i]));
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
                        scheduler();
                    } else console.log("message: " + e.data);
                };
                timerWorker.postMessage(
                    {
                        "interval": 50
                    });
                resolve();
            },1000);
        });
    };

    this.init = async function(){
        return new Promise(function(resolve,reject){
            setTimeout(function(){
                preloadFiles()
                    .then(startWorker)
                    .then(function(){
                        // loops['./audio/drums.mp3'].active = true;
                        timerWorker.postMessage("start");
                        resolve();
                    })
            })
        })
    };

    var nextMeasure = function() {
        console.log(currentMeasure);
        secondsPerBeat = 60.0/tempo;
        measureTime = 4* secondsPerBeat;
        nextMeasureTime += measureTime;

        // if(currentMeasure === 2) loops['./audio/hats.mp3'].active = false;
        // if(currentMeasure === 3) loops['./audio/hats.mp3'].active = true;

        currentMeasure++;
        if(currentMeasure === 4) {
            currentMeasure = 0;
        }
    };

    var scheduleLoops = function(time) {
        for(var key in parent.loops){
            if(!parent.loops[key].audio.isPlaying && parent.loops[key].active){
                console.log(key);
                parent.loops[key].audio.setLoop(true);
                parent.loops[key].audio.play(nextMeasureTime);
            }

            if(!parent.loops[key].active && parent.loops[key].audio.isPlaying){
                parent.loops[key].audio.stop();
            }
        }
    };

    var scheduler = function() {
        while( nextMeasureTime < parent.listener.context.currentTime + scheduleAheadTime){
            scheduleLoops(nextMeasureTime);

            nextMeasure();
        }
    }
}