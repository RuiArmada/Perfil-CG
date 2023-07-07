#version 330

uniform	mat4 m_pvm;
uniform	mat4 m_viewModel;
uniform	mat4 m_view;
uniform	mat3 m_normal;

uniform	vec4 l_dir;	// camera space

in vec4 position;	// local space
in vec3 normal;		// local space
in vec4 tangent;	// local space
in vec2 texCoord0;

// the data to be sent to the fragment shader
out vec3 ld; // tangent space
out vec3 eye; 
out vec2 tc;

void main () {
	// pass through texture coordinates
	tc = texCoord0;
	
	// all vectors to camera space
	vec3 n = normalize(m_normal * normal);
	vec3 t = normalize(vec3(m_viewModel * tangent));
	vec3 b = cross(n,t);
		
	// build transpose tbn	
	mat3 tbn_trans = transpose(mat3(t, b, n));
	
    // transform light to tangent space
    ld = tbn_trans * vec3(-m_view * l_dir); 

	// eye vector is vector from eye to vertex 
    // eye vector = vertex pos - camera pos (all in camera space)
    // eye vector = VM * pos - (0,0,0) 
	eye = tbn_trans * vec3(m_viewModel * position);

	gl_Position = m_pvm * position;	
}