import {TextureAnimator} from "./TextureAnimator.js";

export function SpriteButton(texture, ix, iy, n, time, posX = 0, posY = 0){

    this.textureloc = new THREE.TextureLoader().load(texture);
    this.x = ix;
    this.y = iy;
    this.n = n;
    this.time = time;
    this.ani = new TextureAnimator(this.textureloc, this.x, this.y, this.n, this.time);
    this.mat = new THREE.SpriteMaterial({ map: this.textureloc, side: THREE.DoubleSide,  } );
    this.sprite = new THREE.Sprite(this.mat);
    this.sprite.scale.set(2,2,1);
    this.sprite.translateX(posX);
    this.sprite.translateY(posY);
    this.sprite.translateY(-2.5);
    this.active = false;

    this.update = function (milliSec){
        this.ani.update(milliSec);
    }


}