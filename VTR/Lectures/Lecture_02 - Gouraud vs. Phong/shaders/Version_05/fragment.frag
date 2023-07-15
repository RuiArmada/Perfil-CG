#version 450

// Uniform
uniform vec4 diffuse;
uniform mat4 m_view;
uniform vec4 l_dir; // world space

uniform vec4 specular;
uniform float shininess;

// Input streams
in Data {
    vec3 norm;
    vec4 eye;
} DataIn;

// Output
out vec4 color;

void main(){

    vec4 spec = vec4(0.0);
    float shiny;

    vec3 l = normalize(vec3(m_view * -l_dir));
    vec3 n = normalize(DataIn.norm);
    vec3 e = normalize(vec3(DataIn.eye));

    float intensity = max(dot(l,n),0.0);

    if(shininess == 0.0) {
        shiny = 50.0;
    }

    if(intensity > 0.0) {
        vec3 h = normalize(l + e);
        float intSpec = max(dot(h, n), 0.0);
        
        spec = specular * pow(intSpec, shiny);
    }


    color = max(intensity * diffuse + spec, diffuse * 0.25);

}