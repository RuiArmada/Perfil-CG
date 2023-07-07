#version 430

// uniforms
uniform sampler2D texEarth;
uniform sampler2D texSpec;
uniform sampler2D texLights;
uniform sampler2D texClouds;
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
	vec4 eNight = texture(texLights, tc);
	vec4 eDay = texture(texEarth, tc);
	
	float sColor = texture(texSpec, tc).r;
	float cColor = texture(texClouds, tc).r;

	vec4 colorDay, colorNight;

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

	colorDay = cColor * intensity + (1-cColor) * intensity * eDay + sColor * spec;

	colorNight = (1-cColor) * eNight;

	if(intensity > 0.1) color = colorDay;

	else if(intensity > 0.0) color = mix(colorNight, cColor * 0.1 + (1-cColor) * 0.1 * eDay + sColor * spec, intensity * 10);

	else color = colorNight;
}
