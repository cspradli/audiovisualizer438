import {spritez} from './arrays.js'
import {SpriteButton} from "./SpriteButton.js";
export function GUI(metro){
    this.metronome = metro;
    var spriteRoot = './img/';
    var parent = this;
    //event hooks
    window.addEventListener( 'click', onMouseClick, false );
    window.addEventListener( 'mousemove', onMouseMove, false );
    window.addEventListener('resize', onWindowResize, false);

    //init three scene
    const scene = new THREE.Scene();
    //video background called from index
    var video = document.getElementById( 'video1' );
	video.play();
    var texture = new THREE.VideoTexture( video );
    scene.background = texture;
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
    //var spriteGroup = new THREE.Group();
    var sprites = new THREE.Group();
    var activeSprites = {};
    var size = 5;
    var divisions = 3;
    //scene.add(spriteGroup);

    function onMouseClick(){
        console.log('click');
        try{
            var intersect = raycaster.intersectObjects(sprites.children, true)[0].object;
        }catch(TypeError){
            console.log('invalid click.')
        }
        if(intersect){
            parent.metronome.audioEngine.loops[intersect.name].active = spritez[intersect.name].active = !parent.metronome.audioEngine.loops[intersect.name].active;
        }
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
     * Loading of sprites and GIFS
     * 
     */
    /*
    async function loadVideo(){
        console.log('creating vids');
        parent.metronome.audioEngine.loops.forEach(function(loop, i){
             //console.log("loading " + vidList[i].name);
             var video = document.getElementById( 'video' + i );
	         video.play();
	         var texture = new THREE.VideoTexture( video );
             var spriteMaterial = new THREE.SpriteMaterial({map: texture, color: 0xffffff});
             //spriteMaterial.transparent = true;
             var spriteVid = new THREE.Sprite(spriteMaterial);
             spriteVid.position.set(videos[i].locX, videos[i].locY, 0);
             //spriteVid.visible = false;
             scene.add(spriteVid);
        })
    }*/
    async function loadSprites(){
        console.log('creating sprites');
        parent.metronome.audioEngine.loops.forEach(function(loop,i){
            console.log("loading " + sprites[i].name);
            var spriteMap = new THREE.TextureLoader().load(spriteRoot + sprites[i].name);
            var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, transparent: true, color: 0xffffff} );
            spriteMaterial.transparent = true;
            var sprite = new THREE.Sprite( spriteMaterial );
            sprite.name = loop.name;
            sprite.scale.set(2, 2, 1);
            if (sprites[i].name === 'shrek.gif'){
                sprite.scale.set(3, 3, 1);
            }
            spriteGroup.add(sprite);
            activeSprites[sprite.name] = {
                active: false,
                i: i
            }
            sprite.position.set(sprites[i].locX, sprites[i].locY, 0);
            //scene.add( sprite );
        });
        console.log('sprites created');
        console.log(spriteGroup);
    }
    /**
     * Toggle gif texture visibility
     */
    function createSprites(){
        console.log('creating sprites');

        for(var key in spritez){
            var spr = spritez[key];
            var SB = new SpriteButton(spr.img, spr.x, spr.y, spr.n, spr.time, spr.posX, spr.posY);
            spritez[key].button = SB;
            parent.buttons[key] = SB;
            SB.sprite.name = key;
            sprites.add(SB.sprite);
        }
        scene.add(sprites);
    }
    /**
     * 
     * Initialization and rendering
     * 
     */

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