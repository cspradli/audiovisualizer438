import {Loop} from "./loop.js";

export function AudioEngine(){
    const parent = this; //used to call instance vars within the context of a function
    var audioLoader = new THREE.AudioLoader();
    this.ctx = new AudioContext();
    this.analyser = this.ctx.createAnalyser();
    this.analyser.connect(this.ctx.destination);
    this.loops = {};

    const audioRoot = './audio/';
    this.audio = {
        'devildave': 'loops/devildave.wav',
        'drum1': 'loops/drum1.wav',
        'alienangel': 'devildave.mp3',
        'bloodghost': 'loops/ghost.wav',
        'cactusjoe': 'loops/cactus.wav',
        'drum2': 'loops/drum2.wav',
        'drum3': 'loops/drum3.wav',
        'drum4': 'loops/drum4.wav',
        'drum5': 'loops/drum5.wav',
        'drum6': 'loops/drum6.wav',
        'houseman': 'loops/haus.wav',
        'prettyman': 'loops/prettyman.wav',
        'shrek': 'bass.mp3',
        'spikey': 'loops/spiky.wav',
        'wizzrobe': 'more.mp3',
        'zenman': 'loops/zen.wav',
        'astroblob': 'loops/astroblob.wav'
    };

    // goes through everything in the audioFiles[] arr and calls loadAudio.
    async function preloadFiles (){
        console.log('loading files');
        var promises = [];
        for(var key in parent.audio){
            promises.push(loadAudio(key, audioRoot+parent.audio[key]));
        }
        return Promise.all(promises);
    }

    // this method preloads the audio files so that when they are played it is already loaded. called by preloadFiles()
    async function loadAudio(key, file){
        return new Promise(function(resolve, reject){
            var audio;
            //start loading the file
            audioLoader.load(file,
                function(buffer){
                    audio = new Loop(parent.ctx, buffer);
                    console.log('loaded file: ' + file);
                    parent.loops[key] = {audio: audio, active: false};
                    resolve(); //this successfully exits the promise, goes to .then() or main execution
                },
                function(xhr){
                    console.log('loading: '+file+' '+(xhr.loaded/xhr.total)*100+'%');
                },
                function(err){
                    console.log("failed to load file: " + file);
                    console.log(err);
                });
        });
    }

    this.scheduleLoops = function(time) {
        for(var key in parent.loops){
            if(!parent.loops[key].audio.isPlaying && parent.loops[key].active){
                parent.loops[key].audio.play(parent.analyser);
            }

            if(!parent.loops[key].active && parent.loops[key].audio.isPlaying){
                parent.loops[key].audio.stop();
            }
        }
    };

    this.init = async function(){
        return new Promise(function(resolve,reject){
            preloadFiles().then(resolve);
        });
    }
}