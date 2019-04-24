//import * as metro from "./metronome.js";

export function GUI(metro){
    this.metronome = metro;
    var spriteRoot = './img/';
    this.sprites = [
        'drums',
        'hats'
    ];
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

    var geom = new THREE.CubeGeometry();

    var cubes = new THREE.Group();
    var activeCubes = {};

    var size = 5;
    var divisions = 3;
    var gridHelper = new THREE.GridHelper(size, divisions);
    gridHelper.rotateX(1.5708);
    scene.add(gridHelper);
    scene.add(cubes);

    function onMouseClick(){
        console.log('click');
        var intersect = raycaster.intersectObjects(cubes.children, true)[0].object;
        parent.metronome.audioEngine.loops[activeCubes[intersect.name].i].active = activeCubes[intersect.name].active = !activeCubes[intersect.name].active;
        console.log(intersect);
        console.log(activeCubes);
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

    async function loadSprite(){

    }

    async function loadSprites(){

    }

    function createCubes(){
        console.log('creating cubes');
        parent.metronome.audioEngine.loops.forEach(function(loop,i){
            var mat = new THREE.MeshBasicMaterial({color: '#999999'});
            var cube = new THREE.Mesh(geom,mat);
            cube.name = loop.name;
            cube.translateX(-2+(i*2));
            cubes.add(cube);
            activeCubes[loop.name] = {
                active: false,
                i: i
            };
        });
        cubes.translateY(-2.5);
        console.log('cubes created');
        console.log(cubes);
    }

    function createSprites(){
        console.log('creating sprites');
        parent.metronome.loops.forEach(function(loop,i){

        });
    }
    this.init = async function() {
        //metronome.init().then(createCubes);
        return new Promise(function(resolve,reject){
            createCubes();
            resolve();
        });

    };


    function render() {
        requestAnimationFrame(render);
        raycaster.setFromCamera(mouseVector, camera);
        cubes.children.forEach(function(cube){
            if(activeCubes[cube.name] && activeCubes[cube.name].active){
                cube.rotation.x += Math.random() * (0.03 - 0.01) + 0.01;
                cube.rotation.y += Math.random() * (0.03 - 0.01) + 0.01;
            }

        });
        renderer.render(scene, camera);
    }
    render();
}