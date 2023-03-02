#version 450

// Uniforms
uniform vec4 diffuse;
uniform mat4 m_view;
uniform vec4 l_dir;

// Input Stream
in vec3 n;

// Output
out vec4 color;

void main() {
    vec3 l = normalize(vec3(m_view * -l_dir));
    float intensity = max(dot(normalize(n), l), 0.0);

    if (intensity > 0.9) 
        intensity = 0.9;
    else if (intensity > 0.75) 
        intensity = 0.75;
    else if (intensity > 0.5) 
        intensity = 0.5;
    else 
        intensity = 0.25;

    color = intensity * diffuse;
}