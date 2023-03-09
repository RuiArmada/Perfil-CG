#version 440

// uniforms
uniform mat4 m_pvm;
uniform mat3 m_normal;
uniform mat4 m_viewModel;

// input streams
in vec4 position;
in vec3 normal;
in vec2 texCoord0;

// output
out Data {
    vec2 tc;
    vec3 p;
    vec3 n;
} DataOut;

void main() {

    DataOut.n = normalize(m_normal * normal);
    DataOut.p = vec3(m_viewModel * position);
    DataOut.tc = texCoord0;

    gl_Position = m_pvm * position;
}