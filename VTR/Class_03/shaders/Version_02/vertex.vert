#version 450

// uniforms
uniform mat4 m_pvm;
uniform mat3 m_normal;
uniform mat4 m_view;
uniform mat4 m_viewModel;

uniform vec4 lPos;

// input streams - local space
in vec4 position;
in vec3 normal;

//output
out Data {
    vec3 n; // normal in camera space
    vec4 e;
    vec3 l_dir;
} DataOut;

void main() {

    vec4 pos = m_viewModel * position;
    vec4 lpos = m_view * lPos;

    // normalize to ensure correct direction when interpolating
    DataOut.n = normalize(m_normal * normal);
    DataOut.l_dir = vec3(lpos - pos);
    DataOut.e = -pos;
    
    gl_Position = m_pvm * position;
}