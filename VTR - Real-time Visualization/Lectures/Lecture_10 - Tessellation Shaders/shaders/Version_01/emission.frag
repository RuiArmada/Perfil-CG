#version 410

uniform	mat4 viewMatrix;
uniform vec4 lightDir;
uniform vec4 diffuse;

in vec4 color;

out vec4 outputF;

void main() {

	outputF = color;
}