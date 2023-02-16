#version 330

uniform vec4 diffuse;

out vec4 colorOut;

void main() {

	// colorOut =  vec4(1,0,0,0);
    colorOut = diffuse;
}