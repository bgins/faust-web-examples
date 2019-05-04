# faust-web-examples

This repository contains examples of using Faust with the Web Audio API. The examples show how to instantiate, load, and use Faust compiled to WebAssembly in an AudioWorklet node.

The first examples are rather simple and much more could be done. In addition, they are not particularly well-engineered. For example, no check is made whether a browser supports the AudioWorklet. This could also be improved, but the initial goal was to load some Faust and comment on how to do it.

## Use

Compile the Faust code using `faust2wasm` with the `-worklet` option. For example:

```
faust2wasm volume.dsp -worklet
```

Serve the code and view it in a browser that supports AudioWorklet (Chrome or Chromium for now).
