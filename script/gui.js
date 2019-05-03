import {SpriteButton} from "./SpriteButton.js";
import {sprites} from "./spriteList.js";

export function GUI(metro){
    this.metronome = metro;
    this.buttons = {};
    var parent = this;

    //event hooks
    window.addEventListener( 'click', onMouseClick, false );
    window.addEventListener( 'mousemove', onMouseMove, false );
    window.addEventListener('resize', onWindowResize, false);

    //scene with video background located in bg folder
    const scene = new THREE.Scene();
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
    var spriteGroup = new THREE.Group();

    function onMouseClick(){
        console.log('click');
        try{
            var intersect = raycaster.intersectObjects(spriteGroup.children, true)[0].object;
        }catch(TypeError){
            console.log('invalid click.')
        }
        if(intersect){
            parent.metronome.audioEngine.loops[intersect.name].active = sprites[intersect.name].active = !parent.metronome.audioEngine.loops[intersect.name].active;
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

    async function createSprites(){
        console.log('creating sprites');
        for(var key in sprites){
            var spr = sprites[key];
            var SB = new SpriteButton(spr.img, spr.x, spr.y, spr.n, spr.time, spr.posX, spr.posY);
            sprites[key].button = SB;
            parent.buttons[key] = SB;
            SB.sprite.name = key;
            SB.sprite.scale.set(1.5, 1.5, 1);
            spriteGroup.add(SB.sprite);
        }
        scene.add(spriteGroup);
    }

    this.init = async function() {
        return new Promise(function(resolve,reject){
            createSprites();
            resolve();
        });
    };

    async function render() {
        requestAnimationFrame(render);
        raycaster.setFromCamera(mouseVector, camera);
        for(var key in sprites){
            if(sprites[key].active){
                sprites[key].button.update(42);
            }
        }
        renderer.render(scene, camera);
    }
    render();
}