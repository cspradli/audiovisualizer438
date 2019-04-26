//import * as metro from "./metronome.js";

export function GUI(metro){
    var textureLoader = new THREE.TextureLoader;
    this.metronome = metro;
    var spriteRoot = './img/';
    var spriteList = [
        'drums.png',
        'place.png'
    ];
    var spriteObj = [
        {
            name: 'shrek.gif',
            locX: 0,
            locY: 3
        },
        {
            name: 'place.png',
            locX: -4,
            locY: 3
        }
    ]
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
    var wireframeMat = new THREE.MeshLambertMaterial({
        color: 0xf934bd,
        wireframe: true
    });
    var cubes = new THREE.Group();
    var activeCubes = {};

    var size = 5;
    var divisions = 3;
    //var gridHelper = new THREE.GridHelper(size, divisions);
    //gridHelper.rotateX(1.5708);
   // scene.add(gridHelper);
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

    async function loadSprite(spriteTexture){
        var texture = textureLoader.load(spriteRoot+spriteTexture);
        var mat = new THREE.SpriteMaterial( {map: texture, color: 0xfffff, fog: true});
    }

    async function loadSprites(){
        /*spriteList.forEach(function(element) {
                var spriteMap = new THREE.TextureLoader().load( spriteRoot+element );
                var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } );
                var sprite = new THREE.Sprite( spriteMaterial );
                sprite.translateX(-2+(2*2));
                scene.add( sprite );
        })*/
        for ( var i = 0; i < spriteObj.length; i++){
            console.log("loading " + spriteObj[i].name);
            var spriteMap = new THREE.TextureLoader().load(spriteRoot + spriteObj[i].name);
            var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } );
            var sprite = new THREE.Sprite( spriteMaterial );
            sprite.position.set(spriteObj[i].locX, spriteObj[i].locY, 0);
            scene.add( sprite );
        }
    }

    function createCubes(){
        console.log('creating cubes');
        parent.metronome.audioEngine.loops.forEach(function(loop,i){
            var mat = new THREE.MeshBasicMaterial({color: '#999999'});
            var cube = new THREE.Mesh(geom,wireframeMat);
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
            loadSprites();
            resolve();
        });

    };


    function render() {
        requestAnimationFrame(render);
        raycaster.setFromCamera(mouseVector, camera);
        cubes.children.forEach(function(cube){
            if(activeCubes[cube.name] && activeCubes[cube.name].active){
                //cube.rotation.x += Math.random() * (0.03 - 0.01) + 0.01;
                //cube.rotation.y += Math.random() * (0.03 - 0.01) + 0.01;
            }

        });
        renderer.render(scene, camera);
    }
    render();
}