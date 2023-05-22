#include <light.hpp>

LightType Light::lightType() const { return UNDEFINED; }

// Ambinet
AmbientLight::AmbientLight(vec3 color) : color(color) {}
LightType AmbientLight::lightType() const { return AMBIENT; }

// Point
PointLight::PointLight(vec3 pos, vec3 color) : position(pos), color(color) {}
LightType PointLight::lightType() const { return POINT; }

// Area
AreaLight::AreaLight(vec3 color, vec3 v1, vec3 v2, vec3 v3) : color(color) {
  gem = Triangle({v1, v2, v3});
  pdf = 1.f / gem.area();
  intensity = color * pdf;
}
LightType AreaLight::lightType() const { return AREA; }
vec3 AreaLight::sampleLight(vec2 rand) const {
  float sqrt_r0 = sqrtf(rand.x);
  float alpha = 1.f - sqrt_r0;
  float beta = (1.f - rand.y) * sqrt_r0;
  float gamma = rand.y * sqrt_r0;

  vec3 point = {alpha * gem.vertices[0].x + beta * gem.vertices[1].x +
                    gamma * gem.vertices[2].x,
                alpha * gem.vertices[0].y + beta * gem.vertices[1].y +
                    gamma * gem.vertices[2].y,
                alpha * gem.vertices[0].z + beta * gem.vertices[1].z +
                    gamma * gem.vertices[2].z};

  return point;
}
