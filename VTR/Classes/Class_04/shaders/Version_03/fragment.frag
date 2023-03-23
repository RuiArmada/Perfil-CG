#version 440

// uniforms
uniform sampler2D tex;

// interpolated inputs
in vec2 tc;

// output
out vec4 color;

void main() {

    vec2 res = textureQueryLod(tex, tc);

    if (res.x == 0)
        color = vec4(1.0, 0.0, 0.0, 0.0);
    else if (res.x < 1)
        color = vec4(0.0, 1.0, 0.0, 0.0);
    else if (res.x < 2)
        color = vec4(0.0, 0.0, 1.0, 0.0);
    else if (res.x < 3)
        color = vec4(0.0, 1.0, 1.0, 0.0);
    else if (res.x < 4)
        color = vec4(1.0, 0.0, 1.0, 0.0);
    else if (res.x < 5)
        color = vec4(1.0, 1.0, 0.0, 0.0);
    else if (res.x < 6)
        color = vec4(0.5, 1.0, 0.0, 0.0);
    else if (res.x < 7)
        color = vec4(0.0, 1.0, 0.5, 0.0);
}