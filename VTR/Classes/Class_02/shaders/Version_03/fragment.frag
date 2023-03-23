#version 450

// Uniform
uniform vec4 diffuse;

// Input streams
in float intensity;

// Output
out vec4 color;

void main(){

    color = intensity * diffuse;

}