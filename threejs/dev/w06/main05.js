function loadShaderFromDom( id) {
  var shader_script = document.getElementById( id);

  if( !shader_script) { return null;}

  //Reading all the lines of the script, appending to shader source variable
  var shader_source = "";
  var current_child = shader_script.firstChild;

  while( current_child) {
    if( current_child.nodeType == 3) {
      shader_source += current_child.textContent;
    }
    current_child = current_child.nextSibling;
  }

  return shader_source;
}

//Renamed main to main1 to use it in Task2 too
function main()
{
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
    light.position.set( 5, 5, 5);
    scene.add( light );

    var renderer = new THREE.WebGLRenderer( { alpha: true });
    renderer.setSize( width, height );
    renderer.setClearColor( 0xffffff, 0);
    document.body.appendChild( renderer.domElement );

    var geometry = new THREE.TorusKnotGeometry( 1, 0.3, 100, 20 );
    // var geometry = new THREE.SphereGeometry( 1, 32, 32, 1.0);
    // var material = new THREE.MeshToonMaterial();

    var material = new THREE.ShaderMaterial({
      vertexColors: THREE.VertexColors,
      vertexShader: loadShaderFromDom( "toon.vert"),
      fragmentShader: loadShaderFromDom( "toon.frag"),
      uniforms: {
        inputPosition: { type: 'v3', value: light.position },
        tonesCount:{ type: 'float' , value: 5}
      }
    });

    var torus_knot = new THREE.Mesh( geometry, material );
    scene.add( torus_knot );

    loop();

    function loop()
    {
        requestAnimationFrame( loop );
        torus_knot.rotation.x += 0.01;
        torus_knot.rotation.y += 0.01;
        renderer.render( scene, camera );
    }
}
