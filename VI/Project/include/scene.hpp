#pragma once

#include "camera.hpp"
#include "geometry.hpp"
#include "image.hpp"
#include <glm/vec2.hpp>
#include <glm/vec3.hpp>
#include <light.hpp>
#include <memory>
#include <optional>
#include <string>
#include <tiny_obj_loader.h>

using namespace glm;

class Scene {
private:
  std::vector<Triangle> faces;

  const Camera *camera = nullptr;

  void info();

  //  void componentToVec2(const vector<float> &components, vector<vec2> &vecs);
  //  void componentToVec3(const vector<float> components, vector<vec3> &vecs);
  //  void loadFaces(shape_t & shape, vector<Triangle> & faces);

public:
  tinyobj::attrib_t attributes;
  std::vector<tinyobj::shape_t> shapes;
  std::vector<tinyobj::material_t> materials;
  std::vector<Light> lights;

  /**
   * Loads and creates a scene from a filename
   */
  static std::optional<Scene> load(const std::string &filename);
  ~Scene();

  void setCamera(const Camera &camera);

  Image render();
};