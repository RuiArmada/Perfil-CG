#version 440

//uniforms
uniform vec4 diffuse;
uniform float shininess;
uniform vec4 specular;
uniform mat4 m_view;
uniform vec4 l_dir;
uniform sampler2D posTexture;
uniform sampler2D noise;

uniform int divisions_lines;
uniform int divisions_dither;
uniform float line_growth;
uniform float darkness_limit;

uniform int outline_check_radius;
uniform float outline_min_dif;
uniform float outline_max_dif;
uniform vec4 outline_color;
uniform float noise_scale;

// input
in vec3 n;
in vec2 tc;

// output
out vec4 color;



void main() {
    // Calculating light and normal vectors and diffuse intensity
    vec3 l = normalize(vec3(m_view * -l_dir));
    vec3 nn = normalize(n);
    float i = max(dot(normalize(nn), l), 0.0);

    // Frag coordinate and texture size
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 texSize = textureSize(posTexture, 0);

    // Preparing noise vector
    vec2 noise_vec = texture(noise, fragCoord / vec2(128, 128)).rb;
    noise_vec = (noise_vec * 2) - 1;
    noise_vec *= noise_scale;

    // Calculating texture coordinates for line and dithering shading
    vec2 ft = fract(divisions_lines * tc);
    vec2 ft2 = fract(divisions_dither * tc);

    //OUTLINES
    vec4 noise_pos = texture(posTexture, (fragCoord - noise_vec) / texSize);
    float max_dif = 0;

    for (int i = -outline_check_radius; i <= outline_check_radius; i++) {
        for (int j = -outline_check_radius; j <= outline_check_radius; j++) {
            vec2 neighbor_tc = (fragCoord + vec2(i, j) - noise_vec) / texSize;
            vec4 neighbor_pos = texture(posTexture, neighbor_tc);
            
            max_dif = max(max_dif, distance(neighbor_pos, noise_pos));
        }
    }
    float outline_alpha = smoothstep(outline_min_dif, outline_max_dif, max_dif);




    // TWO TONE SHADING
    color = diffuse;

    // SPECULAR DITHERING
    if (i > darkness_limit) {
        vec3 e = -vec3(texture(posTexture, fragCoord / texSize));
        vec3 h = normalize(l + e);
        float i_spec = max(0.0, pow(dot(h, nn), shininess));
        float dif = distance(vec2(ft2.s, ft2.t), vec2(0.5,0.5));
        if (i_spec > 0 && dif <= 1/line_growth/4) {
            color = specular * vec4(0.2, 0.2, 0.2, 0);
        }
    }
    // LINE SHADING
    else {
        float line_width = pow(smoothstep(1.0, 0.1, i/darkness_limit), 1/line_growth);

        float dif = abs(-ft.s - ft.t +1);

        if (dif <= line_width/2 || dif >= 1 - line_width/2) {
            color = vec4(0,0,0,0);
        }
        else {
            color = diffuse;
        }
    }

    // MIX THE OUTLINE IN
    color = mix(color, outline_color, outline_alpha);
}