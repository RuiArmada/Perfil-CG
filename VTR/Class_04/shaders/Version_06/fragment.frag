#version 440

// uniforms


vec4 blue = vec4(0.3,0.3,1,1);
vec4 white = vec4(0.9,0.9,0.9,1);

// interpolated inputs
in vec2 tc;

// output
out vec4 color;

void main() {

    int div = 10;

    vec2 ft = fract(tc * div);

    vec2 deriv = vec2(dFdx(ft.s), dFdy(ft.s));

    float gap = 1.5 * length(deriv);

    float f;


    f = smoothstep(0.5 - gap, 0.5, ft.s) - smoothstep(1.0 - gap, 1.0, ft.s);
    color = vec4(gap);


    /*if (ft.s < 0.5 - gap) {
        color = blue;
    }
    else if (ft.s < 0.5) {
        f = (ft.s - 0.4) * 1/gap;
        color = (1 - f) * blue + f * white;
    }
    else if (ft.s < 1 - gap) {
        color = white;
    }
    else {
        f = (ft.s - 1 + gap) * 1/gap;
        color = (1 - f) * white + f * blue;
    }*/
}