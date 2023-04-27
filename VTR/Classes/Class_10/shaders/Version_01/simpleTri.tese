#version 410

layout(triangles, fractional_odd_spacing, ccw) in;

uniform mat4 projViewModelMatrix;

in vec4 posTC[];

void main() {
    float u = gl_TessCoord.x;
    float v = gl_TessCoord.y;

    float w = 1 - v - u;

    vec4 p = posTC[0] * u + posTC[1] * v + posTC[2] * w;

    gl_Position = projViewModelMatrix * p;
}