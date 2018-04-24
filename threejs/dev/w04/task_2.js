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
  light.position.set( 0,0,3);
  scene.add( light);

  var geometry = new THREE.CubeGeometry( 1,1,1);
  //Experimenting color change
  console.log( geometry.faces.length);
  for ( var i = 0; i < geometry.faces.length; i +=2 ) {
    random_color = Math.random() * 0xffffff;
    geometry.faces[ i ].color.setHex(  random_color );
    geometry.faces[ i+1 ].color.setHex( random_color );
}

  var material = new THREE.MeshLambertMaterial( { color: 0xffffff,
      vertexColors: THREE.FaceColors });
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
