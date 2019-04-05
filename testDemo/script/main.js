// init

var world = tQuery.createWorld().boilerplate().start();

function initAudio(){
    var webaudio = new WebAudio();
    /*
    var sound = webaudio.createSound().load('audio/africa.mp3', function(sound){
        sound.loop(true).play();
    });*/
}

function initWorld(){
    //var object = tQuery.createTorus().addTo(world);
    //world.renderer().setClearColorHex(0x000000, world.renderer().getClearAlpha() );
    tQuery.createAmbientLight().addTo(world).color(0x888888);
    tQuery.createDirectionalLight().addTo(world).position(+1,+1,1).color(0x88FF88);
    tQuery.createDirectionalLight().addTo(world).position(-1,-1, 1).color(0x8888FF);

}

function createVueMeter(){
    var nBar = 41;
    var barW = 80/nBar;
    var bars3d = [];
    var group3d = tQuery.createObject3D().scale(1/20).addTo(world);

    for (var i=0; i <nBar; i++){
        var bar3d = tQuery.createCube(barW, 10, 5, new THREE.MeshLambertMaterial({
            ambient: 0x888888,
            color: 0xffffff
        }));
        bar3d.addTo(group3d).position((i-nBar/2)*barW, 0, 0);
        bars3d.push(bar3d);
    }
}

function mainRun(){
    initAudio();
    initWorld();
    createVueMeter();
}