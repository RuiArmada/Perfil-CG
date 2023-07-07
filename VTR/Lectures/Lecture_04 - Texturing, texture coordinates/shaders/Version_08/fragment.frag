#version 440

// uniforms
uniform sampler2D tex1;
uniform sampler2D tex2;

uniform vec4 l_dir; // world space
uniform mat4 m_view;
uniform float shininess;

// interpolated inputs
in Data {
    vec2 tc;
    vec3 p;
    vec3 n;
} DataIn;

// output
out vec4 color;

void main() {

    vec3 l = normalize(vec3(m_view * -l_dir));
    vec3 n_norm = normalize(DataIn.n);

    float i_dif = max(0.0, dot(l, n_norm));

    vec3 e = normalize(-DataIn.p);
    
    float i_spec = 0.0;

    if (i_dif > 0) {
        vec3 h = normalize(l + e);
        i_spec = max(0.0, pow(dot(h, n_norm), shininess));
    }

    color = max(0.25, i_dif) * texture(tex1, DataIn.tc) + i_spec * vec4(0.8,0.8,1,1) + pow((1-i_dif),2) * texture(tex2, DataIn.tc);
}