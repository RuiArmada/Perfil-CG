#version 440

// uniforms
uniform	mat4 m_pvm;
uniform	mat4 m_viewModel;
uniform	mat4 m_view;
uniform	mat3 m_normal;

uniform	vec4 l_dir;	   // global space

// input streams
in vec4 position;	// local space
in vec3 normal;		// local space
in vec2 texCoord0;

// the data to be sent to the fragment shader
out vec4 eye;
out vec2 tc;
out vec3 n;
out vec3 ld;


void main () {
	tc = texCoord0;
	n = normalize(m_normal * normal);
	eye = -(m_viewModel * position);
    // can normalize because it is a directional light
	ld = normalize(vec3(m_view * -l_dir));

	gl_Position = m_pvm * position;	
}