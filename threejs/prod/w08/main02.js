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
    light.position.set( 5, 5, 5 );
    scene.add( light );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( width, height );
    document.body.appendChild( renderer.domElement );

    var vertices = [
        [ -1,  1, 0 ], // 0
        [ -1, -1, 0 ], // 1
        [  1, -1, 0 ]  // 2
    ];

    var faces = [
        [ 0, 1, 2 ], // f0
    ];

    //Editing scalar
    var scalars = [
        .1,   // S0
        .2, // S1
        .8  // S2
    ];

    // Create color map
    var cmap = [];
    for ( var i = 0; i < 256; i++ )
    {
        var S = i / 255.0; // [0,1]
        // The red component is fixed
        var R = 1.0; //Math.max( Math.cos( ( S - 1.0 ) * Math.PI ), 0.0 );
        //Green and Blue components decrease following cos( S - PI/2)
        var G = Math.max( Math.cos( ( S ) * Math.PI / 2), 0.0 );
        var B = Math.max( Math.cos( ( S ) * Math.PI / 2), 0.0 );
        var color = new THREE.Color( R, G, B );
        cmap.push( [ S, '0x' + color.getHexString() ] );
    }

    //Lower and upper bound are supposed to be inside the array
    var low_bound = Math.min( ...scalars);
    var high_bound = Math.max( ...scalars);
    var bound_interval = Math.abs( high_bound - low_bound);

    //Returns equivalent position of scalar form color index in the [0,1] range
    function normalize( new_color)
    {
      return ( new_color - low_bound) / bound_interval;
    }

    function cmap_index( new_domain_color) {

      var normalized_color = normalize(new_domain_color);
      var corresp = NaN;

      for( var i = 0; i < 254; i++) {
        if( cmap[i][0] <= normalized_color && cmap[i+1][0] > normalized_color) {
            corresp = i;
            break;
        }
        //If reached without finding, it's probably the last one ... probably
        corresp = 255;
      }

      return corresp;
    }


    for( var i = 0; i < scalars.length; i++) {
      console.log( cmap_index( scalars[i]));
    }

    // Draw color map
    var lut = new THREE.Lut( 'rainbow', cmap.length );
    lut.addColorMap( 'mycolormap', cmap );
    lut.changeColorMap( 'mycolormap' );
    scene.add( lut.setLegendOn( {
        'layout':'horizontal',
        'position': { 'x': 0.6, 'y': -1.1, 'z': 2 },
        'dimensions': { 'width': 0.15, 'height': 1.2 }
        //Width and height are permuted though ...

    } ) );

    var geometry = new THREE.Geometry();
    var material = new THREE.MeshBasicMaterial();

    var nvertices = vertices.length;
    for ( var i = 0; i < nvertices; i++ )
    {
        var vertex = new THREE.Vector3().fromArray( vertices[i] );
        geometry.vertices.push( vertex );
    }

    var nfaces = faces.length;
    for ( var i = 0; i < nfaces; i++ )
    {
        var id = faces[i];
        var face = new THREE.Face3( id[0], id[1], id[2] );
        geometry.faces.push( face );
    }

    // Assign colors for each vertex
    material.vertexColors = THREE.VertexColors;
    for ( var i = 0; i < nfaces; i++ )
    {
        var id = faces[i];
        var S0 = scalars[ id[0] ];
        var S1 = scalars[ id[1] ];
        var S2 = scalars[ id[2] ];
        var C0 = new THREE.Color().setHex( cmap[ cmap_index( S0) ][1] );
        var C1 = new THREE.Color().setHex( cmap[ cmap_index( S1) ][1] );
        var C2 = new THREE.Color().setHex( cmap[ cmap_index( S2) ][1] );
        geometry.faces[i].vertexColors.push( C0 );
        geometry.faces[i].vertexColors.push( C1 );
        geometry.faces[i].vertexColors.push( C2 );
    }

    var triangle = new THREE.Mesh( geometry, material );
    scene.add( triangle );

    loop();

    function loop()
    {
        requestAnimationFrame( loop );
        renderer.render( scene, camera );
    }
}
