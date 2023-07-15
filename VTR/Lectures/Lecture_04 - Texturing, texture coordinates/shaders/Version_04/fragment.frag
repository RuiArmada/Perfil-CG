#version 440

// uniforms
uniform sampler2D tex;

// interpolated inputs
in vec2 tc;

// output
out vec4 color;

void main() {
    float k = 0.1;

    vec2 ft = fract(10 * tc);
    if(ft.s > k && ft.t > k) discard;
    color = vec4(0.3, 0.3, 1.0, 1);
}