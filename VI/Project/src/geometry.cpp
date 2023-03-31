#include "geometry.hpp"
#include <glm/glm.hpp>
#include <optional>

array<vec3, 3> Triangle::getVertices(const tinyobj::attrib_t &attrib) {
  return {
      vec3{attrib.vertices[vertexIndices[0] * 3],
           attrib.vertices[vertexIndices[0] * 3 + 1],
           attrib.vertices[vertexIndices[0] * 3 + 2]},
      vec3{attrib.vertices[vertexIndices[1] * 3],
           attrib.vertices[vertexIndices[1] * 3 + 1],
           attrib.vertices[vertexIndices[1] * 3 + 2]},
      vec3{attrib.vertices[vertexIndices[2] * 3],
           attrib.vertices[vertexIndices[2] * 3 + 1],
           attrib.vertices[vertexIndices[2] * 3 + 2]},
  };
}

/* bool sameSide(vec3 A, vec3 B, vec3 C, vec3 D, vec3 p) {
  vec3 normal = cross(B - A, C - A);
  double dotD = dot(normal, D - A);
  double dotP = dot(normal, p - A);
  return signbit(dotD) == signbit(dotP);
} */

optional<vec3> Triangle::intersects(const tinyobj::attrib_t &attrib, vec3 ray,
                                    vec3 origin) {
  auto vertices = getVertices(attrib);

  vec3 E1 = vertices[1] - vertices[0];
  vec3 E2 = vertices[2] - vertices[0];
  vec3 N = cross(E1, E2);
  float det = -dot(ray, N);
  float invdet = 1.0 / det;
  vec3 AO = origin - vertices[0];
  vec3 DAO = cross(AO, ray);
  float u = dot(E2, DAO) * invdet;
  float v = -dot(E1, DAO) * invdet;
  float t = dot(AO, N) * invdet;

  if (det >= 1e-6 && t >= 0 && u > 0 && v > 0 && u + v <= 1) {
    return {vec3(origin + t * ray)};
  }
  return {};
  // if (sameSide(vertices[0], vertices[1], vertices[2], origin, origin+ray)
  // && sameSide(vertices[1], vertices[2], origin, vertices[0], origin + ray)
  // && sameSide(vertices[2], origin, vertices[0], vertices[1], origin + ray)
  // && sameSide(origin, vertices[0], vertices[1], vertices[2], origin + ray)) {
  //   return
  // }
}
