var simplexNoise = new simplexNoise();

var visualInit = function(){
    var audio = document.getElementById("audio");

    document.onload = function(e){
        console.log(e);
        audio.play();
        play();
    }
}