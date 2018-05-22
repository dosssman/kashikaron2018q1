function main04_gouraud()
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
    light.position.set( 5, 5, 5 );
    scene.add( light );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( width, height );
    document.body.appendChild( renderer.domElement );

    var geometry = new THREE.TorusKnotGeometry( 1, 0.3, 100, 20 );
    // var material = new THREE.MeshLambertMaterial();

    var material = new THREE.ShaderMaterial({
      vertexColors: THREE.VertexColors,
      vertexShader: loadShaderFromDom( "gouraud.vert"),
      fragmentShader: loadShaderFromDom( "gouraud.frag"),
      uniforms: {
        inputPosition: { type: 'v3', value: light.position }
      }
    });

    var torus_knot = new THREE.Mesh( geometry, material );
    scene.add( torus_knot );

    loop();

    function loop()
    {
        requestAnimationFrame( loop );
        torus_knot.rotation.x += 0.005;
        torus_knot.rotation.y += 0.005;
        renderer.render( scene, camera );
    }
}

function main04_phong()
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
    light.position.set( 5, 5, 5 );
    scene.add( light );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( width, height );
    document.body.appendChild( renderer.domElement );

    var geometry = new THREE.TorusKnotGeometry( 1, 0.3, 100, 20 );
    // var material = new THREE.MeshLambertMaterial();

    var material = new THREE.ShaderMaterial({
      vertexColors: THREE.VertexColors,
      vertexShader: loadShaderFromDom( "phong.vert"),
      fragmentShader: loadShaderFromDom( "phong.frag"),
      uniforms: {
        inputPosition: { type: 'v3', value: light.position }
      }
    });

    var torus_knot = new THREE.Mesh( geometry, material );
    scene.add( torus_knot );

    loop();

    function loop()
    {
        requestAnimationFrame( loop );
        torus_knot.rotation.x += 0.005;
        torus_knot.rotation.y += 0.005;
        renderer.render( scene, camera );
    }
}

function main04() {
  main04_gouraud();
  main04_phong();
}
