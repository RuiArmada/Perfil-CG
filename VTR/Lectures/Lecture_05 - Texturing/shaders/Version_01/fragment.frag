#version 440

// uniforms
uniform sampler2D texEarth;
uniform float shininess = 128;

//interpolated inputs
in vec4 eye;
in vec2 tc;
in vec3 n;
in vec3 ld;

// output
out vec4 color;

void main() {

	// get texture color
	vec4 eColor = texture(texEarth, tc);

	// set the specular term to black
	vec4 spec = vec4(0.0);

	// normalize both input vectors
	vec3 nn = normalize(n);
	vec3 e = normalize(vec3(eye));

	float intensity = max(dot(nn , ld), 0.0);

	// if the vertex is lit compute the specular color
	if (intensity > 0.0) {
		// compute the half vector
		vec3 h = normalize(ld + e);	
		// compute the specular intensity
		float intSpec = max(dot(h,nn), 0.0);
		// compute the specular term into spec
		spec = vec4(1) * pow(intSpec,shininess);
	}
	color = max(intensity,0.3) * eColor + spec;
}