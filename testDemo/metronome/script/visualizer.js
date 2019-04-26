export function Visualizer(){
    let parent = this;
    var noise = new SimplexNoise();

    //here comes the webgl
    var scene = new THREE.Scene();
    var group = new THREE.Group();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0,0,100);
    camera.lookAt(scene.position);
    scene.add(camera);

    //add objects
    var icosahedronGeometry = new THREE.IcosahedronGeometry(10, 1);
    var lambertMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        wireframe: true
    });
    var lambertMaterialTwo = new THREE.MeshLambertMaterial({
        color: 0x34f9f9,
        wireframe: true
    });
    var lambertMaterialThree = new THREE.MeshLambertMaterial({
        color: 0xf934bd,
        wireframe: true
    });

    var ball = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
    ball.position.set(0, 0, 0);
    group.add(ball);

    var ballTwo = new THREE.Mesh(icosahedronGeometry, lambertMaterialTwo);
    ball.position.set(0, 2, 0);
    group.add(ballTwo);

    var ambientLight = new THREE.AmbientLight(0xaaaaaa);
    scene.add(ambientLight);

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.intensity = 0.9;
    spotLight.position.set(-10, 40, 20);
    spotLight.lookAt(ball);
    spotLight.castShadow = true;
    scene.add(spotLight);
    scene.add(group);

    var renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        canvas: document.querySelector(".vis")
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    var analyser;
    var metronome;
    var bufferLength;
    var dataArray;

    this.init = async function(metro){
        return new Promise(function(resolve,reject){
            console.log('visualizer init');
            metronome = metro;
            analyser = metronome.audioEngine.analyser;
            bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);
            resolve();

        });
    };

    //document.getElementById('out').appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

    function render(){
        requestAnimationFrame(render);

        if(analyser){
            analyser.getByteFrequencyData(dataArray);
            //console.log(dataArray);

            var lowerHalfArray = dataArray.slice(0, (dataArray.length/2) - 1);
            var upperHalfArray = dataArray.slice((dataArray.length/2) - 1, dataArray.length - 1);

            //var overallAvg = avg(dataArray);
            var lowerMax = max(lowerHalfArray);
            //var lowerAvg = avg(lowerHalfArray);
            //var upperMax = max(upperHalfArray);
            var upperAvg = avg(upperHalfArray);

            var lowerMaxFr = lowerMax / lowerHalfArray.length;
            //var lowerAvgFr = lowerAvg / lowerHalfArray.length;
            //var upperMaxFr = upperMax / upperHalfArray.length;
            var upperAvgFr = upperAvg / upperHalfArray.length;

            makeRoughBall(ball, modulate(Math.pow(lowerMaxFr, 0.8), 0, 1, 0, 8), modulate(upperAvgFr, 0, 1, 0, 4));
            makeRoughBall(ballTwo, modulate(Math.pow(lowerMaxFr, 0.8), 0, 1, 0, 8), modulate(upperAvgFr, 0, 1, 0, 4));
            group.rotation.y += 0.005;
        }
        renderer.render(scene, camera);
    };

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function makeRoughBall(mesh, bassFr, treFr) {
        mesh.geometry.vertices.forEach(function (vertex, i) {
            var offset = mesh.geometry.parameters.radius;
            var amp = 7;
            var time = window.performance.now();
            vertex.normalize();
            var rf = 0.00001;
            var distance = (offset + bassFr ) + noise.noise3D(vertex.x + time *rf*7, vertex.y +  time*rf*8, vertex.z + time*rf*9) * amp * treFr;
            vertex.multiplyScalar(distance);
        });
        mesh.geometry.verticesNeedUpdate = true;
        mesh.geometry.normalsNeedUpdate = true;
        mesh.geometry.computeVertexNormals();
        mesh.geometry.computeFaceNormals();
    }

    render();
}

//some helper functions here
function fractionate(val, minVal, maxVal) {
    return (val - minVal)/(maxVal - minVal);
}

function modulate(val, minVal, maxVal, outMin, outMax) {
    var fr = fractionate(val, minVal, maxVal);
    var delta = outMax - outMin;
    return outMin + (fr * delta);
}

function avg(arr){
    var total = arr.reduce(function(sum, b) { return sum + b; });
    return (total / arr.length);
}

function max(arr){
    return arr.reduce(function(a, b){ return Math.max(a, b); })
}