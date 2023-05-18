#version 440

layout(triangles, fractional_odd_spacing, ccw) in;

uniform	mat4 projViewModelMatrix;
uniform	mat3 normalMatrix;

uniform float alpha = 0.75;

in vec4 normalTC[];
in vec4 posTC[];

out vec3 normalTE;



void main() {

	float u = gl_TessCoord.x;
	float v = gl_TessCoord.y;
	float w = gl_TessCoord.z;

	vec4 b300 = posTC[0];
	vec4 b030 = posTC[1];
	vec4 b003 = posTC[2];
	vec4 n1 = normalTC[0];
	vec4 n2 = normalTC[1];
	vec4 n3 = normalTC[2];

	// compute normal as the weighted average of the normals for each vertex
	vec3 normalTE = normalize(vec3(n1 *w*w + n2 *u*u + n3 *v*v +
				n110 *w*u + n011 * u*v + n101 * w*v));

	// compute point as weighted average of triangle vertices
	vec4 P = ...;
	
	// compute the projected points
	vec4 P0 = ...;
	vec4 P1 = ...;
	vec4 P2 = ...;

	// compute the weighted average of the projected points
	vec4 PS = ...;

	// compute final point as a linear interpolation between P and PS with factor alpha
	vec4 res = ...;

	gl_Position = projViewModelMatrix *  res;
}

