#version 440

// uniforms


vec4 blue = vec4(0.3, 0.3, 1.0, 1);
vec4 white = vec4(0.9, 0.9, 0.9, 1);

// interpolated inputs
in vec2 tc;

// output
out vec4 color;

void main() {
    // float k = 0.5;
    float gap = 0.01;
    float f;
    int div=10;

    vec2 ft = fract(div * tc);
    vec2 deriv = vec2(dFdx(ft.s), dFdy(ft.s));

    gap = 2.5 * length(deriv) + 0.01;

    f = smoothstep(0.5 - gap, 0.5, ft.s) - smoothstep(1.0 - gap, 1, ft.s);
    color = mix(blue, white, f);
    
    if(ft.s < 0.5 - gap)
        color = blue;

    else if(ft.s < 0.5) {
        f = (ft.s - 0.5 + gap) * 1/gap;
        color = (1 - f) * blue + f * white;
    }

    else if(ft.s < 1 - gap)
        color = white;

    else {
        f = (ft.s - 1 + gap) * 1/gap;
        color = (1 - f) * white + f * blue;
    }
}