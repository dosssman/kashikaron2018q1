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

function main()
{
    var volume = new KVS.LobsterData();
    var screen = new KVS.THREEScreen();

    screen.init( volume, {
        width: window.innerWidth,
        height: window.innerHeight,
        enableAutoResize: false
    });
    
    var bounds = Bounds( volume );
    screen.scene.add( bounds );

    var isovalue = 128;
    //Update to pass light_position for the shaders
    var surfaces = Isosurfaces( volume, isovalue, screen.light.position );
    screen.scene.add( surfaces );

    document.addEventListener( 'mousemove', function() {
        screen.light.position.copy( screen.camera.position );
    });

    window.addEventListener( 'resize', function() {
        screen.resize( [ window.innerWidth, window.innerHeight ] );
    });

    screen.loop();
}
