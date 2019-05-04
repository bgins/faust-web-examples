const audioContext = new AudioContext();

// pass the context and a base url to the factory
const faustNodeFactory = new volume(audioContext, "");

let faustNode;
let faustNodeParams;
let volumeParam;
let osc;


/** 
 * Instantiate a new node using the factory method. 
 * 
 * The node returned from the promise is extended from AudioWorkletNode. 
 * The corresponding AudioWorkletProcessor is set up by the factory method.
 * Checks on the availability of AudioWorklet should be made here.
 */
faustNodeFactory.load()
.then((aw_node) => {
    faustNode = aw_node;

    // show info about the node
    console.log(faustNode.getJSON());

    // get a list of params
    faustNodeParams  = faustNode.getParams();
    console.log(faustNodeParams);

    // bind volume param
    volumeParam = faustNodeParams[0];
    console.log(volumeParam);

    // show initial volume level
    const initVal = faustNode.getParamValue(volumeParam);
    console.log("initial volume level:" + initVal);
    document.getElementById("show-volume").textContent = initVal;

    faustNode.connect(audioContext.destination);
})
.catch((error) => { 
    console.log("Simple synth could not be loaded or compiled: " + error); 
});


/** 
 * Control functions to start and stop oscillator and change the volume level 
 */
const startOscillator = function() {
    osc = audioContext.createOscillator();
    osc.connect(faustNode);
    osc.start();
}

const stopOscillator = function() {
    osc.stop();
    osc = null;
}

const increaseVolume = function() {
    const newVal = faustNode.getParamValue(volumeParam) + 1;
    if (newVal < 4) {
        faustNode.setParamValue(volumeParam, newVal);
        document.getElementById("show-volume").textContent = newVal;
    } else {
        faustNode.setParamValue(volumeParam, 4);
        document.getElementById("show-volume").textContent = 4;
    }

    // set happens in the worklet, so delay inspection of actual value
    setTimeout (() => console.log(faustNode.getParamValue(volumeParam)), 100); 
}

const decreaseVolume = function() {
    const newVal = faustNode.getParamValue(volumeParam) - 1;
    if (newVal > -70) {
        faustNode.setParamValue(volumeParam, newVal);
        document.getElementById("show-volume").textContent = newVal;
    } else {
        faustNode.setParamValue(volumeParam, -70);
        document.getElementById("show-volume").textContent = -70;
    }

    setTimeout (() => console.log(faustNode.getParamValue(volumeParam)), 100);
}


// attach event handlers
document.getElementById("start").addEventListener("click", startOscillator);
document.getElementById("stop").addEventListener("click", stopOscillator);
document.getElementById("increase-volume").addEventListener("click", increaseVolume);
document.getElementById("decrease-volume").addEventListener("click", decreaseVolume);