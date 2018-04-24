function main() {
  var width = 500;
  var height = 500;

  var scene = new THREE.Scene();

  var fov = 45;
  var aspect = width / height;
  var near = 1;
  var far = 1000;
  var camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
  camera.position.set( 0, 0, 5 );
  scene.add( camera );

  var light = new THREE.PointLight();
  light.position.set( 5, 5, 5 );
  scene.add( light );

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( width, height);
  document.body.appendChild( renderer.domElement);

  var vertices = [
      [ -1, -1, -1 ], // 0
      [  1, -1, -1 ], // 1
      [  1, -1,  1 ], // 2
      [ -1, -1,  1 ], // 3
      [ -1,  1, -1 ], // 4
      [  1,  1, -1 ], // 5
      [  1,  1,  1 ], // 6
      [ -1,  1,  1 ]  // 7
  ];

  var faces = [
      [ 0, 1, 2 ], // f0
      [ 0, 2, 3 ], // f1
      [ 7, 6, 5 ], // f2
      [ 7, 5, 4 ], // f3
      [ 0, 4, 1 ], // f4
      [ 1, 4, 5 ], // f5
      [ 1, 5, 6 ], // f6
      [ 1, 6, 2 ], // f7
      [ 2, 6, 3 ], // f8
      [ 3, 6, 7 ], // f9
      [ 0, 3, 7 ], // f10
      [ 0, 7, 4 ], // f11
  ];

  var geometry = new THREE.Geometry();
  var material = new THREE.MeshLambertMaterial();

  var nvertices = vertices.length;

  // Load Geometry Vertices
  for( var i = 0; i < nvertices; i++) {
    geometry.vertices.push( new THREE.Vector3().fromArray( vertices[i]) );
  }

  // Load Geometry Faces
  for( var i = 0; i < faces.length; i++) {
    var id = faces[i];
    geometry.faces.push( new THREE.Face3( id[0], id[1], id[2]));
  }

  material.vertexColors = THREE.FaceColors;

  // Color the Geomtry's faces
  for( var i = 0; i < faces.length; i++) {
    geometry.faces[i].color = new THREE.Color( 1, 1, 1);
  }

  // Something special was said here in the slide
  geometry.computeFaceNormals();

  var cube = new THREE.Mesh( geometry, material);
  scene.add( cube);


  //Loop and render
  loop();

  function loop()
  {
      requestAnimationFrame( loop );
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render( scene, camera );
  }

}

main();
