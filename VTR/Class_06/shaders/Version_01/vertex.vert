#version 460

uniform mat4 m_pvm;
uniform vec4 cam_pos;

in vec4 position;

out vec4 pos;

void main() {

    pos = position;
    gl_Position = m_pvm * vec4(vec3(position + cam_pos), 1.0);
}
