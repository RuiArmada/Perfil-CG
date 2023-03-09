#version 450

// uniforms
uniform mat4 m_pvm;

// input streams
in vec4 position;

// output


void main() {
    gl_Position = m_pvm * position;
}