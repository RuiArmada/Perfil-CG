#version 440

// uniforms
uniform sampler2D tex;

// interpolated inputs
in vec2 tc;

// output
out vec4 color;

void main() {

    color = texture(tex, tc);
}