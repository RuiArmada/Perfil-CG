#version 460

uniform samplerCube tex_cm;
in vec4 pos;

out vec4 color;

void main() {

    color = texture(tex_cm, normalize(vec3(pos)));
}