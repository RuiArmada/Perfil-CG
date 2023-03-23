#version 440

uniform samplerCube tex_cm;

in vec3 incident, n;

out vec4 color;

void main() {
    vec3 nn = normalize(n);
    vec3 ii = normalize(incident);
    
    vec3 refl = reflect(ii, nn);

    float op = 1 - dot(-ii, nn);

    color = vec4(texture(tex_cm, refl).rgb, op);
}