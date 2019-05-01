import {SpriteButton} from "./SpriteButton.js";

export function GUI(metro){
    this.metronome = metro;
    var parent = this;

    //event hooks
    window.addEventListener( 'click', onMouseClick, false );
    window.addEventListener( 'mousemove', onMouseMove, false );
    window.addEventListener('resize', onWindowResize, false);

    //init three scene, this should maybe change to paper.js in order to better support the svg characters
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        canvas: document.querySelector(".ui")
    });

    const canvas = renderer.domElement;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.translateZ(10);
    scene.add(camera);
    var raycaster = new THREE.Raycaster();
    var mouseVector = new THREE.Vector3();

    var sprites = new THREE.Group();

    var size = 5;
    var divisions = 3;
    var gridHelper = new THREE.GridHelper(size, divisions);
    gridHelper.rotateX(1.5708);
    scene.add(gridHelper);

    function onMouseClick(){
        console.log('click');
        var intersect = raycaster.intersectObjects(sprites.children, true)[0].object;
        //parent.metronome.audioEngine.loops[activeCubes[intersect.name].i].active = activeCubes[intersect.name].active = !activeCubes[intersect.name].active;
        if(intersect){
            parent.metronome.audioEngine.loops[intersect.name].active = spritez[intersect.name].active = !parent.metronome.audioEngine.loops[intersect.name].active;

        }

        console.log(intersect);
    }
    function onMouseMove(e){
        mouseVector.x =  (e.clientX / canvas.width) * 2 - 1;
        mouseVector.y = -(e.clientY / canvas.height) * 2 + 1;
    }
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    var spritez = {
        'devildave': {
            'img': 'img/sprites/devildave.png',
            'button': null,
            'active': false,
            'x': 7,
            'y': 7,
            'n': 49,
            'time': 84
        }
    }

    function createSprites(){

        console.log('creating sprites');


        for(var key in spritez){

            var spr = spritez[key];
            var SB = new SpriteButton(spr.img, spr.x, spr.y, spr.n, spr.time);
            spritez[key].button = SB;
            SB.sprite.name = key;
            sprites.add(SB.sprite);

        }

        console.log(spritez);
        scene.add(sprites);

    }

    this.init = async function() {
        //metronome.init().then(createCubes);
        return new Promise(function(resolve,reject){
            createSprites();

            resolve();
        });

    };


    function render() {
        requestAnimationFrame(render);
        raycaster.setFromCamera(mouseVector, camera);
        for(var key in spritez){
            if(spritez[key].active){
                spritez[key].button.update(42);
            }
        }

        renderer.render(scene, camera);
    }
    render();
}