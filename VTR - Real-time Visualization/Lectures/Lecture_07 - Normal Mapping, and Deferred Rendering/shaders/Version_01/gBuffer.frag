#version 440

in vec4 p;
in vec3 n, t;
in vec2 tc;

// Same order has they appear in the .mlib
layout (location = 0) out vec4 normal;
layout (location = 1) out vec4 tangent;
layout (location = 2) out vec4 texCoord;
layout (location = 3) out vec4 pos;

void main(){
    
    normal = vec4(normalize(n) * 0.5 + 0.5, 0.0);
    tangent = vec4(normalize(t) * 0.5 + 0.5, 0.0);

    pos = p;

    texCoord = vec4(tc, 0, 0);
}