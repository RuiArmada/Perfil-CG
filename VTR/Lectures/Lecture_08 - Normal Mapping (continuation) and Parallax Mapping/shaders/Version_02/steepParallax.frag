#version 150

uniform sampler2D diffuse, normalMap;

uniform float bumpScale = 0.05;

uniform int linSteps = 32;
uniform int binSteps = 8;

uniform int shadowLinSteps = 32;

in vec3 ld, eye; // tangent space
in vec2 tc;

out vec4 colorOut;

void main() {

    float height = 1;
    float intensity = 0;
    float h = texture(normalMap, tc).a;

    vec3 eye_n = normalize(eye);
    vec3 ld_n = normalize(ld);

    float step = 1.0/linSteps;

    vec2 delta = bumpScale * eye_n.xy * step / abs(eye_n.z);

    vec2 offset = tc;

    while(h < height){
        height -= step;
        offset += delta;
        h = texture(normalMap, offset).a;
    }

    vec4 color = texture(diffuse, offset);

    vec3 n = texture(normalMap, offset).xyz * 2.0 - 1.0;

    intensity = max(0.0, dot(n, normalize(ld)));

    colorOut = (intensity + 0.4) * color;
}