/**
 * Authors: Devin Sipal and Caleb Spradlin
 * 438 Audio Visualizer Project
 */

export function Loop(context, buffer){
    this.context = context;
    this.buffer = buffer;
    this.source = null;
    this.isPlaying = false;

    this.play = function(analyser){
        var source = this.context.createBufferSource();
        source.buffer = this.buffer;
        source.loop = true;
        source.connect(analyser);
        source.start();
        this.source = source;
        this.isPlaying = true;
        console.log('started');
    };

    this.stop = function(){
        this.source.stop();
        this.isPlaying = false;
    };
}