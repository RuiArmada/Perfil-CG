#pragma once

#include "material.hpp"
#include <array>
#include <tiny_obj_loader.h>
#include <vector>
#include <optional>

#include <glm/vec3.hpp>

using namespace std;
using namespace glm;

class Triangle {
public:
  Triangle() = default;
  Triangle(array<int, 3> vertices, array<int, 3> normals,
           array<int, 3> texcoords, int material)
      : vertexIndices{vertices}, normalIndices{normals},
        texcoordIndices{texcoords}, material{material} {};

  /**
   * Indices for the three vertices that make up the triangle.
   */
  array<int, 3> vertexIndices;
  /**
   * Indices for the three normal vectors for each vertex that
   * are needed for interpolated normal calculation in interpolated
   * shading.
   */
  array<int, 3> normalIndices;
  /**
   * Three dimensional vector describing the normal direction of the
   * triangle for simple shading.
   */
  array<int, 3> texcoordIndices;
  /**
   *
   */
  int material;

  array<vec3, 3> getVertices(const tinyobj::attrib_t &attrib);

  /**
   * Checks if a ray intersects the triangle
   * @param ray The ray vector
   * @param origin The origin point of the ray
   * @return Boolean specifying whether an intersection was detected
   */
  optional<vec3> intersects(const tinyobj::attrib_t &attrib, vec3 ray, vec3 origin);
};

class Geometry {
public:
  Geometry() = default;

  vector<Triangle> triangles;
  Material material;
};