import * as metro from "./metronome.js";

export function GUI(){
    window.addEventListener( 'click', onMouseClick, false );
    window.addEventListener( 'mousemove', onMouseMove, false );
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector(".ui")
    });
    const canvas = renderer.domElement;
    renderer.setSize(500, 500, false);
    renderer.setClearColor(0x000000, 0);
    const camera = new THREE.PerspectiveCamera(90, 1, 1, 500);
    camera.translateZ(10);
    scene.add(camera);
    var raycaster = new THREE.Raycaster();
    var mouseVector = new THREE.Vector3();


    var geom = new THREE.CubeGeometry();

    var cubes = new THREE.Group();
    var activeCubes = {};

    var metronome = new metro.Metronome();

    var size = 20;
    var divisions = 10;
    var gridHelper = new THREE.GridHelper(size, divisions);
    gridHelper.rotateX(1.5708);
    scene.add(gridHelper);
    scene.add(cubes);

    function onMouseClick(){
        console.log('click');
        var intersect = raycaster.intersectObjects(cubes.children, true)[0].object;
        metronome.loops[activeCubes[intersect.name].i].active = activeCubes[intersect.name].active = !activeCubes[intersect.name].active;
        console.log(intersect);
        console.log(activeCubes);

    }
    function onMouseMove(e){
        mouseVector.x =  (e.clientX / canvas.width) * 2 - 1;
        mouseVector.y = -(e.clientY / canvas.height) * 2 + 1;
    }


    function createCubes(){
        console.log('creating cubes');
        metronome.loops.forEach(function(loop,i){
            var mat = new THREE.MeshBasicMaterial({color: '#FFFFFF'});
            var cube = new THREE.Mesh(geom,mat);
            cube.name = loop.name;
            cube.translateX(-8+(4*i));
            cubes.add(cube);
            activeCubes[loop.name] = {
                active: false,
                i: i
            };
        });
        cubes.translateY(-6);
    }
    function init() {

        metronome.init().then(createCubes);
    }


    function render() {
        requestAnimationFrame(render);
        raycaster.setFromCamera(mouseVector, camera);
        cubes.children.forEach(function(cube){
            if(activeCubes[cube.name] && activeCubes[cube.name].active){
                cube.rotation.x += Math.random() * (0.03 - 0.01) + 0.01;
            }

        });
        renderer.render(scene, camera);
    }
    init();
    render();
}
GUI();