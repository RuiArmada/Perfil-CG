#include "geometry.hpp"
#include <glm/glm.hpp>
#include <optional>

Triangle::Triangle(array<vec3, 3> vertices, optional<array<vec3, 3>> normals,
                   const Material *material)
    : vertices{vertices}, normals{normals}, material{material} {
  this->planeNormal =
      cross(vertices[1] - vertices[0], vertices[2] - vertices[0]);
}

Triangle::Triangle(array<vec3, 3> vertices) : vertices(vertices) {
  this->planeNormal =
      cross(vertices[1] - vertices[0], vertices[2] - vertices[0]);
}

optional<vec3> Triangle::intersects(vec3 ray, vec3 origin) const {
  vec3 E1 = vertices[1] - vertices[0];
  vec3 E2 = vertices[2] - vertices[0];
  float det = -dot(ray, planeNormal);
  float invDet = 1.0f / det;
  vec3 AO = origin - vertices[0];
  vec3 DAO = cross(AO, ray);
  float u = dot(E2, DAO) * invDet;
  float v = -dot(E1, DAO) * invDet;
  float t = dot(AO, planeNormal) * invDet;

  if (t >= 0 && u > 0 && v > 0 && u + v <= 1) {
    return {vec3(origin + t * ray)};
  }
  return {};
}

float Triangle::area() const {
  float a = distance(vertices[0], vertices[1]);
  float b = distance(vertices[1], vertices[2]);
  float c = distance(vertices[2], vertices[0]);

  float p = (a + b + c) / 2;

  return sqrt(p * (p - a) * (p - b) * (p - c));
}

inline __attribute__((always_inline)) void minVertices(vec3 &one,
                                                       const vec3 &two) {
  if (two.x < one.x)
    one.x = two.x;
  if (two.y < one.y)
    one.y = two.y;
  if (two.z < one.z)
    one.z = two.z;
}

inline __attribute__((always_inline)) void maxVertices(vec3 &one,
                                                       const vec3 &two) {
  if (two.x > one.x)
    one.x = two.x;
  if (two.y > one.y)
    one.y = two.y;
  if (two.z > one.z)
    one.z = two.z;
}

inline __attribute__((always_inline)) vec3
minVertex(const array<vec3, 3> &vertices) {
  vec3 m = vertices[0];
  for (int i = 1; i < 3; i++) {
    minVertices(m, vertices[i]);
  }

  return m;
}

inline __attribute__((always_inline)) vec3
maxVertex(const array<vec3, 3> &vertices) {
  vec3 m = vertices[0];
  for (int i = 1; i < 3; i++) {
    maxVertices(m, vertices[i]);
  }

  return m;
}

void Object::calculateBoundingBox() {
  minPoint = minVertex(faces[0].vertices);
  maxPoint = maxVertex(faces[0].vertices);

  for (int i = 1; i < faces.size(); i++) {
    vec3 faceMinPoint = minVertex(faces[i].vertices);
    vec3 faceMaxPoint = maxVertex(faces[i].vertices);

    minVertices(minPoint, faceMinPoint);
    maxVertices(maxPoint, faceMaxPoint);
  }
}
