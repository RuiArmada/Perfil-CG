#version 330

uniform sampler2D diffuse, normalMap;

in vec3 ld, eye; // tangent space
in vec2 tc;

out vec4 colorOut;

void main() {

	// get normal from texture and decode it
    // normal is in tangent space
	vec3 texNormal = normalize(vec3(texture(normalMap, tc) * 2.0 - 1.0));
	
	// normalize light vector  vectors
	vec3 l = normalize(ld);
    
	float intensity = max(dot(texNormal, l), 0.0);

	colorOut = (intensity + 0.4) * texture(diffuse, tc) ;
}