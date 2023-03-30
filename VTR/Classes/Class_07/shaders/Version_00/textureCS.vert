#version 330

uniform	mat4 m_pvm;
uniform	mat4 m_viewModel;
uniform	mat4 m_view;
uniform	mat3 m_normal;

uniform	vec4 l_dir;	// global space

in vec4 position;	// local space
in vec3 normal;		// local space
in vec3 tangent;	// local space
in vec2 texCoord0;

// the data to be sent to the fragment shader
out Data {
	vec3 eye;
	vec2 texCoord;
	vec3 normal;
	vec3 tangent;
	vec3 l_dir;
} DataOut;


void main () {

	DataOut.texCoord = texCoord0;
	DataOut.normal = normalize(m_normal * normal);
	DataOut.tangent = m_normal * tangent;
	DataOut.l_dir = normalize(vec3(m_view * -l_dir)); 
	DataOut.eye = vec3(-(m_viewModel * position)); 

	gl_Position = m_pvm * position;	
}
