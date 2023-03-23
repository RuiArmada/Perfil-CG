#version 440

uniform samplerCube tex_cm;

in vec3 incident, n;

out vec4 color;

void main() {
    float eta = 1.2;

    vec3 nn = normalize(n);
    vec3 ii = normalize(incident);
    
    vec3 refl = reflect(ii, nn);

    float op = 1 - dot(-ii, nn);

    vec3 refl_c = texture(tex_cm, refl).rgb;
    vec3 refr = refract(ii, nn, 1.2);
    vec3 refr_c = texture(tex_cm, refr).rgb;

    float k = 1 - eta * eta * (1- dot(-ii, nn) * dot(-ii, nn));

    color = vec4(mix(refl_c, refr_c, k), 1);
}