#version 330

// uniforms
uniform mat4 m_pvm;
uniform mat3 m_normal;
uniform mat4 m_viewModel;

// input streams - local space
in vec4 position;
in vec3 normal;

//output
out Data {
    vec3 n; // normal in camera space
    vec4 e;
} DataOut;

void main() {

    // normalize to ensure correct direction when interpolating
    DataOut.n = normalize(m_normal * normal);
    DataOut.e = -(m_viewModel * position);
    
    gl_Position = m_pvm * position;
}