#version 330

// Uniforms
uniform mat4 m_pvm;
uniform mat3 m_normal;
uniform	mat4 m_viewModel;

// Input streams
in vec4 position;
in vec3 normal;

// Output
out Data {
    vec3 norm;
    vec4 eye;
} DataOut;

void main(){

    DataOut.norm = normalize(m_normal * normal);
    DataOut.eye = -(m_viewModel * position);

    gl_Position = m_pvm * position;
}