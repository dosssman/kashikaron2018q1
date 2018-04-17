var gl;
var canvas;
var red_shader_program;
var white_shader_program;
var vertex_buffer;

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
function setup_shaders() {
  var vertex_shader_source =
    "attribute vec3 a_vertex_position;"+
    "void main() { gl_Position = vec4( a_vertex_position, 1); }"

  var fragment_shader_source =
    "precision mediump float;"+
    "void main() { gl_FragColor = vec4( .78, 0.03, 0.18, 1.0); }"

  var white_fragment_shader_source =
    "precision mediump float;"+
    "void main() { gl_FragColor = vec4( 1, 1, 1, 1.0); }"

  var vertex_shader = load_shader(gl.VERTEX_SHADER, vertex_shader_source);
  var fragment_shader =
    load_shader( gl.FRAGMENT_SHADER, fragment_shader_source);

  var white_fragment_shader =
    load_shader( gl.FRAGMENT_SHADER, white_fragment_shader_source);

  red_shader_program = gl.createProgram();
  white_shader_program = gl.createProgram();

  gl.attachShader( red_shader_program, vertex_shader);
  gl.attachShader( red_shader_program, fragment_shader);

  gl.attachShader( white_shader_program, vertex_shader);
  gl.attachShader( white_shader_program, white_fragment_shader);

  gl.linkProgram( red_shader_program);
  gl.linkProgram( white_shader_program);

  if( !gl.getProgramParameter( red_shader_program, gl.LINK_STATUS)) {
    alert( "Shader Setup Failed.");
    return;
  }

  if( !gl.getProgramParameter( white_shader_program, gl.LINK_STATUS)) {
    alert( "Shader Setup Failed.");
    return;
  }

  gl.useProgram( red_shader_program);

  red_shader_program.vertexPositionAttribute =
    gl.getAttribLocation( red_shader_program, "a_vertex_position");
}

function setup_buffers_red() {
  vertex_buffer_red = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, vertex_buffer_red);

  // var red_triangle_vertices = [
  //   0, 0, 0,
  //   .765366, -.382683, 0,
  //   .765366, .382683, 0,
  //
  //   0, 0, 0,
  //   -.382683, .765366, 0,
  //   .382683, .765366, 0,
  //
  //   0, 0, 0,
  //   -.765366, -.382683, 0,
  //   -.765366, .382683, 0,
  //
  //   0, 0, 0,
  //   -.382683, -.765366, 0,
  //   .382683, -.765366, 0
  // ];
  var red_triangle_vertices = [
    0, 0, 0,
    .8, -.301646, 0,
    .8, .301646, 0,

    0, 0, 0,
    -.301646, .8, 0,
    .301646, .8, 0,

    0, 0, 0,
    -.8, -.301646, 0,
    -.8, .301646, 0,

    0, 0, 0,
    -.301646, -.8, 0,
    .301646, -.8, 0
  ];

  gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( red_triangle_vertices),
    gl.STATIC_DRAW);

  vertex_buffer_red.itemSize = 3;
  vertex_buffer_red.numberOfItems = 12;
}

function setup_buffers_white() {
  vertex_buffer_white = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, vertex_buffer_white);

  var white_triangle_vertices = [
    0, 0, 0,
    .765366, .382683, 0,
    .765366, .765366, 0,

    0, 0, 0,
    -.382683, .765366, 0,
    .765366, .382683, 0,

    0, 0, 0,
    -.765366, -.382683, 0,
    -.765366, -.765366, 0,

    0, 0, 0,
    -.382683, -.765366, 0,
    .765366, -.765366, 0
  ];

  gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertex_buffer_white),
    gl.STATIC_DRAW);

  vertex_buffer_white.itemSize = 3;
  vertex_buffer_white.numberOfItems = 12;
}

function draw() {

  gl.viewport( 0,0, gl.viewportWidth, gl.viewportHeight);
  gl.clear( gl.COLOR_BUFFER_BIT);
  //Red Triangles vertices
  gl.vertexAttribPointer( red_shader_program.vertexPositionAttribute,
                          vertex_buffer_red.itemSize, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray( red_shader_program.vertexPositionAttribute);
  gl.drawArrays( gl.TRIANGLES, 0, vertex_buffer_red.numberOfItems);

}

function draw_2() {
  gl.disableVertexAttribArray( red_shader_program.vertexPositionAttribute);
  gl.useProgram( white_shader_program);

  white_shader_program.vertexPositionAttribute =
    gl.getAttribLocation( white_shader_program, "a_vertex_position");

    gl.vertexAttribPointer( white_shader_program.vertexPositionAttribute,
                            vertex_buffer_white.itemSize, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray( white_shader_program.vertexPositionAttribute);
    gl.drawArrays( gl.TRIANGLES, 0, vertex_buffer_white.numberOfItems);
}

function startup() {

  canvas = document.getElementById( "my_gl_canvas");
  gl = create_gl_context( canvas);

  setup_shaders();
  setup_buffers_red();
  // setup_buffers_white();
  // draw_2();
  gl.clearColor( .8, .8, .8, 1);
  draw();
}
