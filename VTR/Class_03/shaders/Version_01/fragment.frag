#version 330

//uniform
uniform vec4 diffuse;
uniform vec4 l_dir; // world space
uniform mat4 m_view;

uniform vec4 specular;
uniform float shininess;

// input
in Data {
    vec3 n;
    vec4 e;
} DataIn;

// output
out vec4 color;

void main() {

    vec4 spec = vec4(0.0);

   // compute light direction in camera space
    vec3 l = normalize(vec3(m_view * -l_dir));
    vec3 nn = normalize(DataIn.n);
    float i = max(0.0, dot(l,nn));

    vec3 e = normalize(vec3(DataIn.e));

    if(i > 0.0) {
        vec3 h = normalize(l + e);
        float intSpec = max(dot(h,nn), 0.0);
        spec = specular * pow(intSpec, shininess);
    }

    color = max(i * diffuse + spec, diffuse * 0.25) * diffuse;
}