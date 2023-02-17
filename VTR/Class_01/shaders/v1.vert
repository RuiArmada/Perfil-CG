#version 330

// the matrices
uniform mat4 m_pvm;
uniform mat4 m_view;
uniform mat3 m_normal;

uniform vec4 diffuse;
uniform vec4 ambient;

uniform vec4 l_dir; // Global Space | Vetor Luz

in vec4 position;   // Local Space
in vec3 normal;		// Local Space

out Data {          // Output Variables
	vec4 colors;
} dataOut;

void main () {

	vec3 n1 = normalize(m_normal * normal);
	vec3 n = m_normal * normal;
	
	vec3 ld1 = normalize(vec3(m_view * -l_dir));
	vec3 ld = vec3(m_view * -l_dir);

	float intensity = max(dot(n1, ld1), 0.0);

	dataOut.colors = intensity * diffuse + ambient;

	// transform the vertex coordinates
	gl_Position = m_pvm * position;	
}