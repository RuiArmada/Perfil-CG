#pragma once

#include <glm/glm.hpp>
#include <tiny_obj_loader.h>

using namespace glm;

class Material {
public:
  explicit Material(const tinyobj::material_t &material);

  vec3 specular{};
  vec3 diffuse{};
  vec3 emission{};
  vec3 ambient{};
  float shininess;
};
