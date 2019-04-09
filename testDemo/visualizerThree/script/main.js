var simplexNoise = new simplexNoise();

var visualInit = function(){
    var audio = document.getElementById("audio");

    document.onload = function(e){
        console.log(e);
        audio.play();
        audioSetup();
    }

    audio.src="../sounds";
    audio.load();
    audio.play();
    audioSetup();
}

function audioSetup(){

    var context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();
    src.connect(analyser);
    analyser.connect(context.destination);
    analyser.fftSize = 512;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    sceneSetup();
}

function sceneSetup(){
    var scene = new Three.Scene();
    var group = new Three.Group();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0,0,100);
    camera.lookAt(scene.position);
    scene.add(camera);
    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
}