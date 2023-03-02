#version 450

//uniform
uniform vec4 diffuse;
uniform mat4 m_view;

uniform vec4 specular;
uniform float shininess;

uniform vec4 spot_Dir;
uniform float l_spotCutoff;

// input
in Data {
    vec3 n;
    vec4 e;
    vec3 ld;
} DataIn;

// output
out vec4 color;

void main() {

    vec4 spec = vec4(0.0);
    float i;

   // compute light direction in camera space

    vec3 e = normalize(vec3(DataIn.e));

    vec3 nn = normalize(DataIn.n);

    vec3 light_dir = normalize(DataIn.ld);
    vec3 spot_dir = normalize(vec3(m_view * vec4(-spot_Dir)));

    if(dot(spot_dir,light_dir) > l_spotCutoff) {

        i = max(0.0, dot(light_dir,nn));
        
        if(i > 0.0) {
            vec3 h = normalize(light_dir + e);
            float intSpec = max(dot(h,nn), 0.0);
            spec = specular * pow(intSpec, shininess);
        }
    }

    color = max(i * diffuse + spec, diffuse * 0.25) * diffuse;
}