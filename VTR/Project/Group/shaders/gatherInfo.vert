#version 460

// uniforms
uniform mat4 m_pvm;
uniform mat4 m_vm;

// input streams
in vec4 position;

// output streams
out vec4 posVar;

void main() {
    posVar = m_vm * position;
    gl_Position = m_pvm * position;
}