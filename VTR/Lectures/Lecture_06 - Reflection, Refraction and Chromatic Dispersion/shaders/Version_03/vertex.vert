#version 440

uniform mat4 m_pvm, m_view, m_model, m_viewModel;
uniform mat3 m_normal;
uniform vec4 cam_pose; // world

in vec4 position; // local
in vec4 normal; // local

out vec3 incident, n;

void main() {
    mat4 mn = inverse(transpose(m_model));

    n = normalize(vec3(mn * normal)); // world

    // vec3 cp = vec3(m_view * cam_pos); // camera
    vec3 p = vec3(m_model * position); // world
    incident = p - vec3(cam_pose); // - cp;

    gl_Position = m_pvm * position;
}