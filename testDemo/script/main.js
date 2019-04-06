import {Metronome} from "./metronome.js";
// init



var world = tQuery.createWorld().boilerplate().start();

// var webaudio = new WebAudio();
//
// var sound = webaudio.createSound().load('audio/africa.mp3', function(sound){
//         sound.loop(true).play();
// });


var metronome = new Metronome();
var webAudio = metronome.webAudio;


var sound;

var object = tQuery.createTorus().addTo(world);

function initWorld(){
    //world.renderer().setClearColorHex(0x000000, world.renderer().getClearAlpha() );
    tQuery.createAmbientLight().addTo(world).color(0x888888);
    tQuery.createDirectionalLight().addTo(world).position(+1,+1,1).color(0x88FF88);
    tQuery.createDirectionalLight().addTo(world).position(-1,-1, 1).color(0x8888FF);

    //window.addEventListener("load", metronome.init );

}

function buildVueMeter(){
    var nBar = 41;
    var barW = 80/nBar;
    var bars3d = [];
    var group3d = tQuery.createObject3D().scale(1/20).addTo(world);

    for (var i=0; i <nBar; i++){
        var bar3d = tQuery.createCube(barW, 10, 5, new THREE.MeshLambertMaterial({
            ambient: 0x888888,
            color: 0xffffff
        }));
        bar3d.addTo(group3d).position(((i-nBar/2)*barW)*2, 0, 0);
        bars3d.push(bar3d);
    }
    world.loop().hook(function(){
        //if(sound.isPlayable() === false) return;
        var nBarHalf = Math.ceil(nBar/2);
        var histograph = sound.makeHistogram(nBarHalf);
        var scale = sound.amplitude() * 2 + 0.5;
        object.scale(scale);
        bars3d.forEach(function(bar3d, barIdx){
            var histoIdx = barIdx < nBarHalf ? nBarHalf-1-barIdx : barIdx - nBarHalf;
            var height = histograph[histoIdx] / 256;
            bar3d.get(0).scale.y = height*3;
            bar3d.get(0).material.color.setHSL(0.3+height*0.7, 1,1)
        })
    })
}



function mainRun(){
    initWorld();
    buildVueMeter();

}
