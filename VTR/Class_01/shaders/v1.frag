#version 330

// in vec4 diffuse;

in Data {
    vec4 colors;
} dataIn;

out vec4 colorOut;

void main() {

	// colorOut =  vec4(1,0,0,0);
    // colorOut = diffuse
    colorOut = dataIn.colors;
}