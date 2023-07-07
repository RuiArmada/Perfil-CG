#version 440

uniform samplerCube tex_cm;

in vec3 incident, n;

out vec4 color;

void main() {
    float eta = 1.2;

    vec3 nn = normalize(n);
    vec3 ii = normalize(incident);
    
    

    float op = 1 - dot(-ii, nn);

    // REFLEXION
    vec3 refl = reflect(ii, nn);
    vec3 refl_c = texture(tex_cm, refl).rgb;
    
    // REFRACTION
    vec3 trefrRED = refract(ii, nn, eta);
    vec3 trefrGREEN = refract(ii, nn, eta + 0.01);
    vec3 trefrBLUE = refract(ii, nn, eta + 0.02);
    
    vec3 refr_c;
    refr_c.r = texture(tex_cm, trefrRED).r;
    refr_c.g = texture(tex_cm, trefrGREEN).g;
    refr_c.b = texture(tex_cm, trefrBLUE).b;

    float k = 1 - eta * eta * (1- dot(-ii, nn) * dot(-ii, nn));

    color = vec4(mix(refl_c, refr_c, k), 1);
}