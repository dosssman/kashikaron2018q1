var gl;
var canvas;
var shader_program;
var vertex_buffer;
var index_buffer;

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
    "void main() { gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0); }"

  var vertex_shader = load_shader(gl.VERTEX_SHADER, vertex_shader_source);
  var fragment_shader =
    load_shader( gl.FRAGMENT_SHADER, fragment_shader_source);

  shader_program = gl.createProgram();

  gl.attachShader( shader_program, vertex_shader);
  gl.attachShader( shader_program, fragment_shader);
  gl.linkProgram( shader_program);

  if( !gl.getProgramParameter( shader_program, gl.LINK_STATUS)) {
    alert( "Shader Setup Failed.");
    return;
  }

  gl.useProgram( shader_program);

  shader_program.vertex_position_attribute =
    gl.getAttribLocation( shader_program, "a_vertex_position");
}

function setup_buffers() {
  vertex_buffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, vertex_buffer);

  var triangle_vertices = [
    0, .8, 0, //0
    -.3, 0, 0, //1
    .3, 0, 0, //2

    0, -.8, 0 //3
  ];


  gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( triangle_vertices),
    gl.STATIC_DRAW);

  vertex_buffer.item_size = 3;
  // vertex_buffer.item_count = 6;

  index_buffer = gl.createBuffer();
  gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, index_buffer);
  var index_numbers = [
    0,1,2,
    1,3,2
  ];

  gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( index_numbers),
                 gl.STATIC_DRAW);

  index_buffer.size = index_numbers.length;
}

function draw() {

  gl.viewport( 0,0, gl.viewportWidth, gl.viewportHeight);
  gl.clear( gl.COLOR_BUFFER_BIT);

  gl.vertexAttribPointer( shader_program.vertex_position_attribute,
                          vertex_buffer.item_size, gl.FLOAT, false, 0, 0);

 gl.enableVertexAttribArray( shader_program.vertex_position_attribute);
 gl.drawElements(gl.TRIANGLES, index_buffer.size, gl.UNSIGNED_SHORT, 0);
}

function startup() {

  canvas = document.getElementById( "my_gl_canvas");
  gl = create_gl_context( canvas);

  setup_shaders();
  setup_buffers();
  gl.clearColor( .8, .8, .8, 1);
  draw();
}
