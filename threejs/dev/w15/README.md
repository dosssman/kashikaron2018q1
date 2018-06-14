# Final Task

The implementation is based on the isosurface extraction tasks.
It consists in a small set of features for visualizing the Lobster volumetric
data provided during the lecture while dynamically changing some rendering
parameters such as the isovalue, shader programs and colors.

## Features:
* Changing isovalue

* Shadeing model selection

  The four shading models implemented using the Phong shader model provide
  different reflection model for the rendering.

  - Lambertian Reflection model ( Default)
  - BlinnPhong Reflection model
  - Cook Torrance Reflection model
  - Toon shader with 4 levels

  The shader can be selected using the "Shader" dropdown of the dat.gui
  interfacem, and automatically updates the rendered lobster.

* Shader parametrization

  The shader programs have been rewritten to allow a dynamic reparametrization
  from the GUI interface. By selecting the desired shader model in the previous
  feature, the parametrizable value of the shader program under the "Shader Settings"
  menu are automatically updated accordingly.

  - Lambertian Reflection model parameters

    * Ambient: the ambient reflection coefficient
    * Diffuse: the diffuse reflection coefficient

  - BlinnPhong Reflection model

    * Ambient: the ambient reflection coefficient
    * Diffuse: the diffuse reflection coefficient
    * Specular: the specular relfection coefficient
    * Spec. Pow.: value of the exponent of the dot product between the reflection
       and normal vectors

  - Cook Torrance Reflection model

    * Ambient: the ambient reflection coefficient
    * Diffuse: the diffuse reflection coefficient
    * Specular: the specular relfection coefficient
    * Spec. Pow.: value of the exponent of the dot product between the reflection and normal vector
    * Roughness: Roughness coefficient of the material
    * Schlick: Schlik approximetion constant

  - Toon shader with 4 levels

    * Ambient: the ambient reflection coefficient
    * Diffuse: the diffuse reflection coefficient
    * Specular: the specular relfection coefficient
    * Spec. Pow.: value of the exponent of the dot product between the reflection
       and normal vectors

* Color selection

  There are two available options, namely:
  * Default: using a White-Red color map function
  * RGB: Set a color based on parametrizable RGB value

* Color parametrization

  By enabling the RGB color option, it is possible to set the value for the
  Red, Green and Blue components under the "Color Settings" menu. The lobster
  color will therefore be automatically updated accordingly.

## External Tools
[dat.gui](https://github.com/dataarts/dat.gui) for the parametrization interface
[stats.js](https://github.com/mrdoob/stats.js/) for performance monitoring
