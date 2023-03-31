#include <light.hpp>
#include <tiny_obj_loader.h>
#include <vector>

glm::vec3 AmbientLight::light(tinyobj::attrib_t attributes,
                                       tinyobj::material_t material) {
  return this->rgb;
}

glm::vec3 AmbientLight::light() {
  return this->rgb;
}

LightType AmbientLight::lightType() {
  return AMBIENT;
}

LightType Light::lightType() {
    return UNDEFINED;
}

glm::vec3 Light::light(tinyobj::attrib_t attributes,
                                tinyobj::material_t material) {
  return glm::vec3(0);
}

glm::vec3 Light::light() {
  return glm::vec3(0);
}