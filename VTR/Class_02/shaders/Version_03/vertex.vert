#version 450

// Uniforms
uniform vec4 l_dir; // world space
uniform mat4 m_pvm;
uniform mat3 m_normal;
uniform mat4 m_view;

// Input streams
in vec4 position;
in vec3 normal;

// Output
out float intensity;

void main(){

    vec3 n = normalize(m_normal * normal);
    vec3 l = normalize(vec3(m_view * -l_dir));

    intensity = max(dot(l,n),0.0);

    if(intensity > 0.9)
        intensity = 0.9;
    else if(intensity > 0.75)
        intensity = 0.75;
    else if(intensity > 0.5)
        intensity = 0.5;
    else
        intensity = 0.25;

    gl_Position = m_pvm * position;
}