#version 150

uniform sampler2D diffuse, normalMap;

uniform float bumpScale = 0.05;

uniform int linSteps = 32;
uniform int binSteps = 8;

uniform int shadowLinSteps = 32;

in vec3 ld, eye; // tangent space
in vec2 tc;

out vec4 colorOut;

void main() {

    colorOut = vec4(0,1,0,0);
}