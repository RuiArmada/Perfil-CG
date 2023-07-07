#version 450

// Uniform
uniform vec4 diffuse;

// Input streams
in float intensity;

// Output
out vec4 color;

void main(){

    float it;

    if(intensity > 0.9)
        it = 0.9;
    else if(intensity > 0.75)
        it = 0.75;
    else if(intensity > 0.5)
        it = 0.5;
    else
        it = 0.25;

    color = intensity * diffuse;

}