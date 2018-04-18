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
  light.position.set( 0,0,10);
  scene.add( light);

  var geometry = new THREE.SphereGeometry( 1,32,32);

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
