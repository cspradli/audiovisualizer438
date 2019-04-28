export function GUI(metro){
    this.metronome = metro;
    var spriteRoot = './img/';
    var vidRoot = './img/';
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
    var vidList = [
        'shrek.mp4',
        'shrek.mp4'
    ];
    var parent = this;
    var animator;
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
    var spriteGroup = new THREE.Group();
    var activeSprites = {};
    var size = 5;
    var divisions = 3;
    scene.add(spriteGroup);

    function onMouseClick(){
        console.log('click');
        var intersect = raycaster.intersectObjects(spriteGroup.children, true)[0].object;
        parent.metronome.audioEngine.loops[activeSprites[intersect.name].i].active = activeSprites[intersect.name].active = !activeSprites[intersect.name].active;
        console.log(intersect);
        console.log(activeSprites);
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


    /**
     * 
     * Loading of sprites adn GIFS
     * 
     */
      
    async function loadVideo(){
    }
    async function loadSprites(){
        console.log('creating sprites');
        parent.metronome.audioEngine.loops.forEach(function(loop,i){
            console.log("loading " + spriteObj[i].name);
            var spriteMap = new THREE.TextureLoader().load(spriteRoot + spriteObj[i].name);
            var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } );
            var sprite = new THREE.Sprite( spriteMaterial );
            sprite.name = loop.name;
            spriteGroup.add(sprite);
            activeSprites[sprite.name] = {
                active: false,
                i: i
            }
            sprite.position.set(spriteObj[i].locX, spriteObj[i].locY, 0);
            //scene.add( sprite );
        });
        console.log('sprites created');
        console.log(spriteGroup);
    }


    /**
     * 
     * Initialization and rendering
     * 
     */

    this.init = async function() {
        //metronome.init().then(createCubes);
        return new Promise(function(resolve,reject){
            loadSprites();
            resolve();
        });

    };


    function render() {
        requestAnimationFrame(render);
        raycaster.setFromCamera(mouseVector, camera);
        renderer.render(scene, camera);
    }
    render();
}