#pragma once

#include <tiny_obj_loader.h>
#include <vector>
#include <glm/glm.hpp>

enum LightType { AMBIENT, UNDEFINED };

class Light {
public:
  Light() = default;
  ~Light() = default;

  glm::vec3 rgb;

  /**
   * Returns the color of the point as affected by this light source
   */
  virtual glm::vec3 light(tinyobj::attrib_t attributes,
                                   tinyobj::material_t material);
  virtual glm::vec3 light();
  virtual LightType lightType();
};

class AmbientLight : public Light {
public:
  AmbientLight() = default;
  ~AmbientLight() = default;

  glm::vec3 light(tinyobj::attrib_t attributes,
                           tinyobj::material_t material) override;
  glm::vec3 light() override;
  LightType lightType() override;
};