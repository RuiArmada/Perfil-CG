#version 440

uniform sampler2DMS texUnit;
uniform sampler2D texNormal;
uniform int samples = 32;
uniform vec2 vp_dim;

in Data {
	vec2 texCoord;
} DataIn;

out vec4 outputF;

void main() {

    vec3 n = texture(texNormal, DataIn.texCoord).rgb;
    if (n == vec3(0,0,0))
        discard;

	ivec2 tc = ivec2(DataIn.texCoord.xy * vp_dim);

	outputF = vec4(0.0);
	for (int i = 0; i < samples; ++i) {
		outputF += texelFetch(texUnit, tc , i) ;
	}
	outputF = outputF/samples;
} 
