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

  //Change color on click

  document.addEventListener( 'mousedown', mouse_down_event);
  function mouse_down_event( event) {
    //Getting clicked point in WebGL window
    var x_win = event.clientX;
    var y_win = event.clientY;

    // Viewport
    var vx = renderer.domElement.offsetLeft;
    var vy = renderer.domElement.offsetTop;
    var vw = renderer.domElement.width;
    var vh = renderer.domElement.height;

    // Window coordinates to normalized device coordinates
    // Origin of NDC: center
    var x_NDC = 2 * ( x_win - vx ) / vw - 1;
    var y_NDC = -( 2 * ( y_win - vy ) / vh - 1 );

    // Normalized device coordinates to world coordinates
    var p_NDC = new THREE.Vector3( x_NDC, y_NDC, 1 );
    var p_wld = p_NDC.unproject( camera );

    var origin = camera.position;
    var direction = p_wld.sub( camera.position ).normalize();
    var raycaster = new THREE.Raycaster( origin, direction );
    var intersects = raycaster.intersectObject( cube );

    default_color = new THREE.Color( "white");
    changed_color = new THREE.Color( "red");

    if ( intersects.length > 0 )
    {
        // Change to switch the color

        if( intersects[0].face.color.equals( default_color))
          intersects[0].face.color.setRGB( changed_color["r"],
            changed_color["g"], changed_color["b"]);
        else
          intersects[0].face.color.setRGB( default_color["r"],
            default_color["g"], default_color["b"]);

        intersects[0].object.geometry.colorsNeedUpdate = true;
    }
  }
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
