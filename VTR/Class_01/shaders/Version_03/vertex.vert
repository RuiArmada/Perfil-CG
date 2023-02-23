#version 330

uniform mat4 m_pvm;
uniform mat3 m_normal;
uniform mat4 m_view;
uniform vec4 l_dir;

uniform vec4 diffuse; // world space
uniform vec4 ambient; // world space

in vec4 position; // local space
in vec3 normal; // local space

out vec4 dif_color;

void main() {

    vec3 n = normalize(m_normal * normal); // camera space
    vec3 ld = normalize(vec3(m_view * -l_dir)); // camera space

    float intensity = max(0.0, dot(n, ld));

    dif_color = intensity * diffuse + ambient;

    gl_Position = m_pvm * position;
}