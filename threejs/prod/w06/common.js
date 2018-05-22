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
