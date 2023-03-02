#version 450

// Uniforms
uniform mat4 m_pvm;
uniform mat3 m_normal;

// Input streams
in vec4 position;
in vec3 normal;

// Output
out vec3 n;

void main() {
    n = normalize(m_normal * normal);
    
    gl_Position = m_pvm * position;
}