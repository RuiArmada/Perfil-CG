#version 440

in vec3 n, t;
in vec4 p;
in vec2 tc;
in flat int c;

// same order as in  the render target definition
layout (location = 0) out vec4 normal;
layout (location = 1) out vec4 tangent;
layout (location = 2) out vec4 texCoord;
layout (location = 3) out vec4 pos;

float snoise(vec3 v);

void main() {

    // normalize and pack normal and tangent
    normal = vec4(normalize(n) * 0.5 + 0.5, 1.0);
    tangent = vec4(normalize(t) * 0.5 + 0.5, 1.0);

    texCoord = vec4(tc, 0 ,0);

    pos = p;

    pos.w = c ;

}


