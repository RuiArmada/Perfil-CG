#version 460

// uniforms
uniform mat4 m_pvm;
uniform mat3 m_normal;

// input streams
in vec4 position;
in vec3 normal;
in vec2 texCoord0;

//output
out vec3 n;
out vec2 tc;

void main() {
    n = normalize(m_normal * normal);
    tc = texCoord0;
    gl_Position = m_pvm * position;
}