#pragma once

#include "geometry.hpp"
#include <glm/glm.hpp>
#include <memory>
#include <tiny_obj_loader.h>
#include <vector>

using namespace glm;

enum LightType { AMBIENT, POINT, AREA, UNDEFINED };

class Light {
public:
  Light() = default;
  virtual ~Light() = default;

  vec3 rgb{};

  [[nodiscard]] virtual LightType lightType() const;
};

class AmbientLight : public Light {
public:
  vec3 color;

  explicit AmbientLight(vec3 color);

  [[nodiscard]] LightType lightType() const override;
};

class PointLight : public Light {
public:
  vec3 position;
  vec3 color;

  PointLight(vec3 pos, vec3 color);
  [[nodiscard]] LightType lightType() const override;
};

class AreaLight : public Light {
public:
  float pdf;
  vec3 position;
  vec3 color;
  vec3 intensity;
  Triangle gem;

  AreaLight(vec3 color, vec3 v1, vec3 v2, vec3 v3);
  [[nodiscard]] LightType lightType() const override;
  [[nodiscard]] vec3 sampleLight(vec2 rand) const;
};
