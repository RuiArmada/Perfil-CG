#version 440

// uniforms
uniform mat4 m_pvm;

// input streams
in vec4 position;
in vec2 texCoord0;

// output
out vec2 tc;

void main() {
    tc = texCoord0;
    gl_Position = m_pvm * position;
}