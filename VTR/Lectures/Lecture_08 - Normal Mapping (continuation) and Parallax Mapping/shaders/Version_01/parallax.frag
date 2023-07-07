#version 330

uniform sampler2D diffuse, normalMap;
uniform float scale = 0.04, bias = 0.0;

in vec3 ld, eye; // tangent space
in vec2 tc;

out vec4 colorOut;

void main() {


	colorOut = vec4(1,0,0,0);
}