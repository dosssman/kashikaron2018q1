var gl;
var canvas;
var shader_program;
// var vertex_buffer;
var index_buffer;
var triangle_vertex_buffer;

function create_gl_context( canvas) {
  var names = [ "webgl", "experimental-webgl"];
  var context = null;

  for( var i=0; i<names.length; i++) {
    try {
      context = canvas.getContext( names[i]);
    } catch( e) {
      if( context) {
        break;
      }
    }
  }

  if( context) {
    context.viewportWidth = canvas.width;
    context.viewportHeight = canvas.height;
  } else {
    alert( "Context creation failed.")
  }

  return context;
}

function load_shader( type, shader_source) {

  var shader = gl.createShader( type);

  gl.shaderSource( shader, shader_source);
  gl.compileShader( shader);

  if( !gl.getShaderParameter( shader, gl.COMPILE_STATUS)) {
    alert( "Shader Compile Error" + gl.getShaderInfoLog( shader));
    gl.deleteShader( shader);

    return null;
  }

  return shader;
}

function load_shader_DOM( id) {
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


  var shader;
  if( shader_script.type == "x-shader/x-fragment") {
    shader = gl.createShader( gl.FRAGMENT_SHADER);
  } else if ( shader_script.type == "x-shader/x-vertex") {
    shader = gl.createShader( gl.VERTEX_SHADER);
  } else {
    return null;
  }

  gl.shaderSource( shader, shader_source);
  gl.compileShader( shader);

  if( !gl.getShaderParameter( shader, gl.COMPILE_STATUS)) {
    alert( gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

function setup_shaders() {
  var vertex_shader = load_shader_DOM( "shader-vs");
  var fragment_shader = load_shader_DOM( "shader-fs");

  shader_program = gl.createProgram();
  gl.attachShader( shader_program, vertex_shader);
  gl.attachShader( shader_program, fragment_shader);
  gl.linkProgram( shader_program);

  if( !gl.getProgramParameter( shader_program, gl.LINK_STATUS)) {
    alert( "Shader Program Setup Failed!");
    return;
  }

  gl.useProgram( shader_program);

  shader_program.vertex_position_attribute =
    gl.getAttribLocation( shader_program, "a_vertex_position");

  shader_program.vertex_color_attribute =
    gl.getAttribLocation( shader_program, "a_vertex_color");

  // REVIEW: Potential effecst of moving enableAttribFunction from draw to here;
  gl.enableVertexAttribArray( shader_program.vertex_position_attribute);
  gl.enableVertexAttribArray( shader_program.vertex_color_attribute);
}

function setup_buffers() {
  triangle_vertex_buffer = gl.createBuffer();

  gl.bindBuffer( gl.ARRAY_BUFFER, triangle_vertex_buffer);
  var triangle_vertices = [
    0.000000,  0.866025, 0.0,     255,   0,   0, 255,  // red
   -0.500000,  0.000000, 0.0,     255, 255,   0, 255,  // yellow
   -1.000000, -0.866025, 0.0,       0, 255,   0, 255,  // green
    0.000000, -0.866025, 0.0,       0, 255, 255, 255,  // cyan
    1.000000, -0.866025, 0.0,       0,   0, 255, 255,  // blue
    0.500000,  0.000000, 0.0,     255,   0, 255, 255   // magenda
  ];

  var vertice_count = 6; // Think

  var vertex_size_bytes = 3 * Float32Array.BYTES_PER_ELEMENT +
    4 * Uint8Array.BYTES_PER_ELEMENT;

  var vertex_size_floats = vertex_size_bytes / Float32Array.BYTES_PER_ELEMENT;

  var buffer = new ArrayBuffer( vertice_count * vertex_size_bytes);

  var position_view = new Float32Array( buffer);

  var color_view = new Uint8Array( buffer);

  var position_offset_floats = 0;
  var color_offset_bytes = 12;
  var k = 0;

  for( var i = 0; i < vertice_count; i++) {
    for( var j =0; j < 3; j++) {
      position_view[position_offset_floats+j] = triangle_vertices[k+j];
    }
    for( var j = 0; j < 4; j++) {
      color_view[color_offset_bytes+j] = triangle_vertices[k+j+3];
    }

    // position_view[position_offset_floats] = triangle_vertices[k];     // x
    // position_view[1+position_offset_floats] = triangle_vertices[k+1]; // y
    // position_view[2+position_offset_floats] = triangle_vertices[k+2]; // z
    // color_view[color_offset_bytes] = triangle_vertices[k+3];          // R
    // color_view[1+color_offset_bytes] = triangle_vertices[k+4];        // G
    // color_view[2+color_offset_bytes] = triangle_vertices[k+5];        // B
    // color_view[3+color_offset_bytes] = triangle_vertices[k+6];        // A

    position_offset_floats += vertex_size_floats;
    color_offset_bytes += vertex_size_bytes;
    k+=7;
  }

  gl.bufferData( gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);
  triangle_vertex_buffer.position_size = 3;
  triangle_vertex_buffer.color_size = 4;
  triangle_vertex_buffer.item_count = vertice_count;

  index_buffer = gl.createBuffer();
  gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, index_buffer);
  var index_numbers = [
    0, 1, 5,
    1, 2, 3,
    3, 4, 5
  ];

  gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( index_numbers),
    gl.STATIC_DRAW);

  index_buffer.size = 9;
}

function draw() {

  gl.viewport( 0,0, gl.viewportWidth, gl.viewportHeight);
  gl.clear( gl.COLOR_BUFFER_BIT);

  gl.bindBuffer( gl.ARRAY_BUFFER, triangle_vertex_buffer);

  gl.vertexAttribPointer( shader_program.vertex_position_attribute,
                          triangle_vertex_buffer.position_size,
                          gl.FLOAT, false, 16, 0);

  gl.vertexAttribPointer( shader_program.vertex_color_attribute,
                          triangle_vertex_buffer.color_size,
                          gl.UNSIGNED_BYTE, true, 16, 12);

  gl.drawElements( gl.TRIANGLES, index_buffer.size, gl.UNSIGNED_SHORT, 0);
}

function startup() {

  canvas = document.getElementById( "my_gl_canvas");
  gl = create_gl_context( canvas);

  setup_shaders();
  setup_buffers();

  gl.clearColor( .0, .0, .0, 1);
  draw();
}
