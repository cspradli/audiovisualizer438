// init


function initAudio(){
    var webaudio = new webaudio();

    var sound = webaudio.createSound().load('audio/africa.mp3', function(sound){
        sound.loop(true).play();
    });
}

function initWorld(){
    var world = tQuery.createWorld().boilerplate().start();
}