const audioContext = new AudioContext();

// pass the context and a base url to the factory
const faustNodeFactory = new freeverb(audioContext, "");

let faustNode;
let faustNodeParams;
let wetParam;
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

    // bind wet param
    wetParam = faustNodeParams[3];
    console.log(wetParam);

    // show initial wet value
    const initVal = faustNode.getParamValue(wetParam);
    console.log("initial wet param: " + initVal);
    document.getElementById("show-wet").textContent = showFixedOne(initVal);

    faustNode.connect(audioContext.destination);
})
.catch((error) => { 
    console.log("Simple synth could not be loaded or compiled: " + error); 
});


/** 
 * Control functions to start and stop oscillator and change wet level
 */
const play = function() {
    osc = audioContext.createOscillator();
    osc.type = "square";
    osc.connect(faustNode);
    osc.start();
    osc.stop(audioContext.currentTime + 1);
}

const increaseWet = function() {
    const newVal = faustNode.getParamValue(wetParam) + 0.1;
    if (newVal <= 1.0) { 
        faustNode.setParamValue(wetParam, newVal); 
        document.getElementById("show-wet").textContent = showFixedOne(newVal);
    } else { 
        faustNode.setParamValue(wetParam, 1.0);
        document.getElementById("show-wet").textContent = showFixedOne(1);
    }

    // set happens in the worklet, so delay inspection of actual value
    setTimeout (() => console.log(faustNode.getParamValue(wetParam)), 100); 
}

const decreaseWet = function() {
    const newVal = faustNode.getParamValue(wetParam) - 0.1;
    if (newVal >= 0.0) { 
        faustNode.setParamValue(wetParam, newVal); 
        document.getElementById("show-wet").textContent = showFixedOne(newVal);
    } else { 
        faustNode.setParamValue(wetParam, 0.0);
        document.getElementById("show-wet").textContent = showFixedOne(0);
    }

    setTimeout (() => console.log(faustNode.getParamValue(wetParam)), 100); 
}


/**
 * Damp, room size, and stereo spread are also available as params
 * in the faustNodeParams array. These could be added to the UI and 
 * exposed here.
 */
 

// attach event handlers
document.getElementById("play").addEventListener("click", play);
document.getElementById("increase-wet").addEventListener("click", increaseWet);
document.getElementById("decrease-wet").addEventListener("click", decreaseWet);


const showFixedOne = function (num) { return num.toFixed(1) }