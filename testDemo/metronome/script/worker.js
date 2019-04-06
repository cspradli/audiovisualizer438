var timerID = null;
var interval = 20;

self.onmessage = function(e) {
    if(e.data === "start"){
        console.log('worker started');
        timerID = tick(interval);
    }

    else if (e.data.interval) {
        interval = e.data.interval;
        console.log('interval changed: ' + interval);
        if(timerID) {
            clearInterval(timerID);
            timerID = setInterval( tick(interval), interval )
        }
    }
    else if (e.data === "stop"){
        console.log('worker stopping');
        clearInterval(timerID);
        timerID = null;
    }
};

function tick(interval){
    return setInterval(
        function(){
            postMessage("tick");
        },
        interval);
}