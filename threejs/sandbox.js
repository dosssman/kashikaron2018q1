<<<<<<< HEAD
function main() {
  var width = 400;
  var height = 400;

  var scene = new THREE.Scene();

  var fov = 45;
  var aspect = width / height;
  var near = 1;
  var far = 1000;

  var camera = new THREE.PerspectiveCamera( fov, aspect, near, far);
  camera.position.set( 0,0,5);
  scene.add( camera);

  var renderer = new THREE.WebGLRenderer( { depth: true});
  renderer.setSize( width, height);

  document.body.appendChild( renderer.domElement );


  var light = new THREE.PointLight( 0xffffff);
  light.position.set( 0,0,5);
  scene.add( light);

  var geometry = new THREE.CubeGeometry( 1,1,1);

  var material = new THREE.MeshLambertMaterial( { color: "blue"});
  var cube = new THREE.Mesh( geometry, material);
  scene.add( cube);

  loop();

  function loop() {
    requestAnimationFrame( loop);
    cube.rotation.x += .01;
    cube.rotation.y += .01;
    renderer.render( scene, camera);
  }
}

main();
=======
var scene = new THREE.Scene();


var params = { antialias: true, depth: true};
var renderer = new THREE.WebGLRenderer( params);

console.log( renderer);
renderer->setSize( 640, 480);

document.body.appendChild( renderer.domElement);
document.body.appendChild( renderer.domElement);
>>>>>>> 1ab933fb7d841a64fb3dfaffa982df07e9259f60
