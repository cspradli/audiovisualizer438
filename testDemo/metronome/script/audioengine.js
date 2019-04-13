export function AudioEngine(){
    this.listener = new THREE.AudioListener();
    this.ctx = this.listener.context;
    this.analyserList = [];

    this.loops = [];
    var audioRoot = './audio/';
    this.audioFiles = [
        'drums.mp3',
        'hats.mp3'
    ];
    var parent = this; //used to call instance vars within the context of a function
    var audioLoader = new THREE.AudioLoader();

    // goes through everything in the audioFiles[] arr and calls loadAudio.
    var preloadFiles = async function(){
        console.log('loading files');
        var promises = [];
        for(var i in parent.audioFiles){
            promises.push(loadAudio(audioRoot+parent.audioFiles[i]));
        }
        return Promise.all(promises);
    };

    // this method preloads the audio files so that when they are played it is already loaded. called by preloadFiles()
    var loadAudio = async function(file){
        return new Promise(function(resolve, reject){
            setTimeout(function(){
                var audio = new THREE.Audio(parent.listener);
                //start loading the file
                audioLoader.load(file,
                    function(buffer){
                        //set the buffer of new audio object to the file loaded
                        audio.setBuffer(buffer);
                        audio.setVolume(0.5);
                        parent.analyserList.push(new THREE.AudioAnalyser(audio, 1024));

                        console.log('loaded file: ' + file);
                        //push audio object to loops list in Metronome()
                        parent.loops.push({
                            name: file,
                            audio: audio,
                            active: false
                        });
                        resolve(); //this successfully exits the promise, goes to .then() or main execution
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

    this.scheduleLoops = function(time) {
        for(var key in parent.loops){
            if(!parent.loops[key].audio.isPlaying && parent.loops[key].active){
                console.log(key);
                parent.loops[key].audio.setLoop(true);
                parent.loops[key].audio.play(time);
            }

            if(!parent.loops[key].active && parent.loops[key].audio.isPlaying){
                parent.loops[key].audio.stop();
            }
        }
    };

    this.init = async function(){
        return new Promise(function(resolve,reject){
            setTimeout(function(){
                preloadFiles().then(function(){
                    resolve();
                })
            }, 5000)
        });
    }
}