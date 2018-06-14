// Mr Doob Stats monitor
var stats = new Stats();
stats.showPanel( 0 );
stats.showPanel( 2 );
document.body.appendChild( stats.dom );

function animate() {

	stats.begin();

	stats.end();

	requestAnimationFrame( animate );

}

requestAnimationFrame( animate );
//End Mr Doob Stats monitor

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

function getShaderId( shader_index, vertex) {
  var shader_id = "";
  switch( parseInt( shader_index)) {
    case 0:
        shader_id = "lambert";
        break;
    case 1:
        shader_id = "blinnphong_phong";
        break;
    case 2:
        shader_id = "cooktorrance_phong";
        break;
    case 3:
        shader_id = "toon_phong";
        break;
    default:
        shader_id = "blinnphong_phong";
  }

  if( vertex)
    shader_id += ".vert"
  else
    shader_id += ".frag"
  return shader_id;
}

function Isosurfaces( volume, isovalue, light_position, shader_index, shader_config,
  color_mode, color_config) {
    var geometry = new THREE.Geometry();

    //Custom Shader material for Shader Implementation
    var material = new THREE.ShaderMaterial({
      vertexColors: THREE.VertexColors,
      vertexShader: loadShaderFromDom( getShaderId( shader_index, true)),
      fragmentShader: loadShaderFromDom( getShaderId( shader_index, false)),
      uniforms: {
        light_position: { type: 'v3', value: light_position },
        ambient_reflection: { type: 'float', value: shader_config.ambient_reflection },
        diffuse_reflection: { type: 'float', value: shader_config.diffuse_reflection },
        specular_reflection: { type: 'float', value: shader_config.specular_reflection },
        specular_power: { type: 'float', value: shader_config.specular_power },
        u_roughness: { type: 'float', value: shader_config.roughness },
        u_schlick: { type: 'float', value: shader_config.schlick }
      }
    });

    var smin = volume.min_value;
    var smax = volume.max_value;
    isovalue = KVS.Clamp( isovalue, smin, smax );

    var lut = new KVS.MarchingCubesTable();
    var cell_index = 0;
    var counter = 0;
    // Extracting cube surface: are those triangles ?
    // Good question ...
    for ( var z = 0; z < volume.resolution.z - 1 ; z++ )
    {
        for ( var y = 0; y < volume.resolution.y - 1; y++ )
        {
            for ( var x = 0; x < volume.resolution.x - 1; x++ )
            {
                var indices = cell_node_indices( cell_index++ );
                var index = table_index( indices );
                if ( index == 0 ) { continue; }
                if ( index == 255 ) { continue; }

                for ( var j = 0; lut.edgeID[index][j] != -1; j += 3 )
                {
                    var eid0 = lut.edgeID[index][j];
                    var eid1 = lut.edgeID[index][j+2];
                    var eid2 = lut.edgeID[index][j+1];

                    var vid0 = lut.vertexID[eid0][0];
                    var vid1 = lut.vertexID[eid0][1];
                    var vid2 = lut.vertexID[eid1][0];
                    var vid3 = lut.vertexID[eid1][1];
                    var vid4 = lut.vertexID[eid2][0];
                    var vid5 = lut.vertexID[eid2][1];

                    var v0 = new THREE.Vector3( x + vid0[0], y + vid0[1], z + vid0[2] );
                    var v1 = new THREE.Vector3( x + vid1[0], y + vid1[1], z + vid1[2] );
                    var v2 = new THREE.Vector3( x + vid2[0], y + vid2[1], z + vid2[2] );
                    var v3 = new THREE.Vector3( x + vid3[0], y + vid3[1], z + vid3[2] );
                    var v4 = new THREE.Vector3( x + vid4[0], y + vid4[1], z + vid4[2] );
                    var v5 = new THREE.Vector3( x + vid5[0], y + vid5[1], z + vid5[2] );

                    var v01 = interpolated_vertex( v0, v1, isovalue );
                    var v23 = interpolated_vertex( v2, v3, isovalue );
                    var v45 = interpolated_vertex( v4, v5, isovalue );

                    geometry.vertices.push( v01 );
                    geometry.vertices.push( v23 );
                    geometry.vertices.push( v45 );

                    var id0 = counter++;
                    var id1 = counter++;
                    var id2 = counter++;
                    geometry.faces.push( new THREE.Face3( id0, id1, id2 ) );
                }
            }
            cell_index++;
        }
        cell_index += volume.resolution.x;
    }

    geometry.computeVertexNormals();

    // Create color map
    // WHITE_RED Range Color Map
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

    function cmap_index( new_domain_color) {

      var normalized_color = new_domain_color / geometry.faces.length * 1.;
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

    //Distribute the colors depending on the index of the face
    switch( parseInt( color_mode)) {
      case 0:
        for ( var i = 0; i < geometry.faces.length; i++ ) {
            var C0 = new THREE.Color().setHex( cmap[ cmap_index( i) ][1] );
            var C1 = new THREE.Color().setHex( cmap[ cmap_index( i) ][1] );
            var C2 = new THREE.Color().setHex( cmap[ cmap_index( i) ][1] );
            geometry.faces[i].vertexColors.push( C0 );
            geometry.faces[i].vertexColors.push( C1 );
            geometry.faces[i].vertexColors.push( C2 );
        }
        break;
      case 1:
        for ( var i = 0; i < geometry.faces.length; i++ ) {
            var C0 = new THREE.Color( color_config.r / 255.
                , color_config.g / 255., color_config.b / 255.);
            geometry.faces[i].vertexColors.push( C0 );
            geometry.faces[i].vertexColors.push( C0 );
            geometry.faces[i].vertexColors.push( C0 );
        }
        break;
      default:
        for ( var i = 0; i < geometry.faces.length; i++ ) {
            var C0 = new THREE.Color().setHex( cmap[ cmap_index( i) ][1] );
            var C1 = new THREE.Color().setHex( cmap[ cmap_index( i) ][1] );
            var C2 = new THREE.Color().setHex( cmap[ cmap_index( i) ][1] );
            geometry.faces[i].vertexColors.push( C0 );
            geometry.faces[i].vertexColors.push( C1 );
            geometry.faces[i].vertexColors.push( C2 );
        }

    }

    return new THREE.Mesh( geometry, material );

    function cell_node_indices( cell_index )
    {
        var lines = volume.resolution.x;
        var slices = volume.resolution.x * volume.resolution.y;

        var id0 = cell_index;
        var id1 = id0 + 1;
        var id2 = id1 + lines;
        var id3 = id0 + lines;
        var id4 = id0 + slices;
        var id5 = id1 + slices;
        var id6 = id2 + slices;
        var id7 = id3 + slices;

        return [ id0, id1, id2, id3, id4, id5, id6, id7 ];
    }

    function table_index( indices )
    {
        var s0 = volume.values[ indices[0] ][0];
        var s1 = volume.values[ indices[1] ][0];
        var s2 = volume.values[ indices[2] ][0];
        var s3 = volume.values[ indices[3] ][0];
        var s4 = volume.values[ indices[4] ][0];
        var s5 = volume.values[ indices[5] ][0];
        var s6 = volume.values[ indices[6] ][0];
        var s7 = volume.values[ indices[7] ][0];

        var index = 0;
        if ( s0 > isovalue ) { index |=   1; }
        if ( s1 > isovalue ) { index |=   2; }
        if ( s2 > isovalue ) { index |=   4; }
        if ( s3 > isovalue ) { index |=   8; }
        if ( s4 > isovalue ) { index |=  16; }
        if ( s5 > isovalue ) { index |=  32; }
        if ( s6 > isovalue ) { index |=  64; }
        if ( s7 > isovalue ) { index |= 128; }

        return index;
    }

    function interpolated_vertex( v0, v1, s )
    {
      //Isovalie seems to aleasy be 128
      //Read values of the two edges from the volume data
      //Understanding of the Volume data set label
      // volume.values is a one dimensional array in the sense that every edge's isovalue is stored in a 0 dimensionnal array
      // For an arbitrary edge of coodinate Va, the index is obtained by offset it's x component by 0, its y component by
      // the resolution of x and its z component by the product of resolution of x and y respectively.
      s0 = volume.values[ v0.x + v0.y * volume.resolution.x + v0.z * volume.resolution.x * volume.resolution.y][0];
      s1 = volume.values[ v1.x + v1.y * volume.resolution.x + v1.z * volume.resolution.x * volume.resolution.y][0];

      //Interpolate the isovalue betweenthe two edges
      //Spiky lobster
      // p = (2 * s - (s0 + s1))/ ( s1-s0);
      p = (s - s0)/ ( s1 - s0);

      return new THREE.Vector3().addVectors( v0.multiplyScalar( 1-p), v1.multiplyScalar( p));
    }
}

function main() {
  var volume = new KVS.LobsterData();
  var screen = new KVS.THREEScreen();

  screen.init( volume, {
    width: window.innerWidth,
    height: window.innerHeight,
    enableAutoResize: false
  });

  // dat.gui config
  var main_config = {
            data: "Lobster",
            isovalue: 128,
            shader_index: 0,
            color_mode: 0
        };

  var gui = new dat.gui.GUI();

  // Dat gui main config
  gui.add( main_config, 'data', [ "Lobster" ] ).name( "Data");
  gui.add( main_config, 'isovalue').step( 1).min( 0).max( 255).name( "Isovalue");
  gui.add( main_config, 'shader_index', { "Lambertian": 0, "Blinn-Phong": 1,
      "Cook Torrance": 2, "Toon": 3 } ).name( "Shader");

  var shader_config = { ambient_reflection: .3, diffuse_reflection: .5,
    specular_reflection: .8, specular_power: 50., roughness: .21, schlick: .975};

  // Dat gui Shader settings menu
  var shader_menu = gui.addFolder( "Shader_setting");
  shader_menu.add( shader_config, "ambient_reflection", 0., 1., .1).name( "Ambient reflection");
  shader_menu.add( shader_config, "diffuse_reflection", 0., 1., .1).name( "Diffuse reflection");
  shader_menu.add( shader_config, "specular_reflection", 0., 1., .1).name( "Specular reflection");
  shader_menu.add( shader_config, "specular_power", 0, 256, 1).name( "Spec. pow.");
  shader_menu.add( shader_config, "roughness", 0., 1., .01).name( "Roughness");
  shader_menu.add( shader_config, "schlick", 0., 1., .001).name( "Schlick coefficient");

  shader_menu.open();

  gui.add( main_config, 'color_mode', { "Default": 0, "RGB": 1}).name( "Color");

  //Dat Gui add menu for color settings
  var color_menu = gui.addFolder( "Color_Settings");
  var color_config = { r: 255, g: 255, b: 255, a: 255};

  color_menu.add( color_config, "r", 0, 255, 1).name( "R");
  color_menu.add( color_config, "g", 0, 255, 1).name( "G");
  color_menu.add( color_config, "b", 0, 255, 1).name( "B");

  color_menu.open();

  //Hiding color menu
  switch( parseInt( main_config.color_mode)) {
    case 0:
      color_menu.domElement.parentElement.style.display = "none";
      break;
    case 1:
      color_menu.domElement.parentElement.style.display = "";
      break;
    default:

  }

  //Hiding field depending on shader model
  switch( parseInt( parseInt( main_config.shader_index))) {
    case 0:
      for( var i = 2; i < 6; i++) {
        shader_menu.__controllers[i].domElement.parentElement.parentElement.style.display = "none";
      }
      break;
    case 1:
      for( var i = 2; i < 4; i++) {
        shader_menu.__controllers[i].domElement.parentElement.parentElement.style.display = "";
      }
      for( var i = 4; i < 6; i++) {
        shader_menu.__controllers[i].domElement.parentElement.parentElement.style.display = "none";
      }
      break;
    case 2:
      for( var i = 2; i < 6; i++) {
        shader_menu.__controllers[i].domElement.parentElement.parentElement.style.display = "";
      }
      break;
    case 3:
      for( var i = 2; i < 4; i++) {
        shader_menu.__controllers[i].domElement.parentElement.parentElement.style.display = "";
      }
      for( var i = 4; i < 6; i++) {
        shader_menu.__controllers[i].domElement.parentElement.parentElement.style.display = "none";
      }
      break;
    default:
      for( var i = 2; i < 6; i++) {
        shader_menu.__controllers[i].domElement.parentElement.parentElement.style.display = "none";
      }
    }
  // Color config

  //Update to pass light_position for the shaders
  var mesh = Isosurfaces( volume, main_config.isovalue,
      screen.light.position, main_config.shader_index, shader_config,
      main_config.color_mode, color_config);

  screen.scene.add( mesh );

  // Listen to isovalue changes
  gui.__controllers[1].onChange(function(value) {
    screen.scene.children[2] = Isosurfaces( volume, main_config.isovalue,
        screen.light.position, main_config.shader_index, shader_config,
        main_config.color_mode, color_config);
  });

  // Listen to shader index changes
  gui.__controllers[2].onChange(function(value) {
    //Hiding field depending on shader model
    switch( parseInt( value)) {
      case 0:
        for( var i = 2; i < 6; i++) {
          shader_menu.__controllers[i].domElement.parentElement.parentElement.style.display = "none";
        }
        break;
      case 1:
        for( var i = 2; i < 4; i++) {
          shader_menu.__controllers[i].domElement.parentElement.parentElement.style.display = "";
        }
        for( var i = 4; i < 6; i++) {
          shader_menu.__controllers[i].domElement.parentElement.parentElement.style.display = "none";
        }
        break;
      case 2:
        for( var i = 2; i < 6; i++) {
          shader_menu.__controllers[i].domElement.parentElement.parentElement.style.display = "";
        }
        break;
      case 3:
        for( var i = 2; i < 4; i++) {
          shader_menu.__controllers[i].domElement.parentElement.parentElement.style.display = "";
        }
        for( var i = 4; i < 6; i++) {
          shader_menu.__controllers[i].domElement.parentElement.parentElement.style.display = "none";
        }
        break;
      default:
        for( var i = 2; i < 6; i++) {
          shader_menu.__controllers[i].domElement.parentElement.parentElement.style.display = "none";
        }

    }
    screen.scene.children[2] = Isosurfaces( volume, main_config.isovalue,
        screen.light.position, main_config.shader_index, shader_config,
        main_config.color_mode, color_config);
  });

  // Listening to shader settings change
  for( var i = 0; i < shader_menu.__controllers.length; i++) {
    shader_menu.__controllers[i].onChange( function( value) {
      screen.scene.children[2] = Isosurfaces( volume, main_config.isovalue,
          screen.light.position, main_config.shader_index, shader_config,
          main_config.color_mode, color_config);
    });
  }

  // Listening to color mode change
  gui.__controllers[3].onChange(function(value) {
    switch( parseInt( value)) {
      case 0:
        color_menu.domElement.parentElement.style.display = "none";
        break;
      case 1:
        color_menu.domElement.parentElement.style.display = "";
        break;
      default:

    }

    screen.scene.children[2] = Isosurfaces( volume, main_config.isovalue,
        screen.light.position, main_config.shader_index, shader_config,
        value, color_config);
  });

  for( var i = 0; i < color_menu.__controllers.length; i++) {
    color_menu.__controllers[i].onChange( function( value) {
      screen.scene.children[2] = Isosurfaces( volume, main_config.isovalue,
          screen.light.position, main_config.shader_index, shader_config,
          main_config.color_mode, color_config);
    });
  }

  document.addEventListener( 'mousemove', function() {
    screen.light.position.copy( screen.camera.position );
  });

  window.addEventListener( 'resize', function() {
    screen.resize( [ window.innerWidth, window.innerHeight ] );
  });

  screen.loop();
}

main();
