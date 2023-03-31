#pragma once

using namespace std;

class RGB {
    public:
        RGB(float r = 0, float g = 0, float b = 0);

        float R, G, B;
};

class BRDF {
    public:
        BRDF() = default;
};

class Material {
    public:
        Material() = default;

        RGB rgb;
        BRDF brdf;
};