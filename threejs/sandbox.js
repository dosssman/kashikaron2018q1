var scene = new THREE.Scene();


var params = { antialias: true, depth: true};
var renderer = new THREE.WebGLRenderer( params);

console.log( renderer);
renderer->setSize( 640, 480);

document.body.appendChild( renderer.domElement);
document.body.appendChild( renderer.domElement);
