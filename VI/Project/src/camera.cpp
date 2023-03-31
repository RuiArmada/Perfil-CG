#include "camera.hpp"
#include "fmt/core.h"

#include <cmath>
#include <glm/glm.hpp>
#include <glm/mat3x3.hpp>

Camera::Camera(uint32_t width, uint32_t height, double angle_x, double angle_y,
               vec3 up, vec3 pos, vec3 lookingAt) {
  this->width = width;
  this->height = height;
  this->angle_w = tan(angle_x / 2);
  this->angle_h = tan(angle_y / 2);
  this->up = up;
  this->pos = pos;
  this->lookingAt = lookingAt;

  this->forward = normalize(this->lookingAt - this->pos);
  this->right = normalize(cross(this->up, this->forward));

  this->camera2world = {right, up, forward};
}

glm::vec3 Camera::getRay(uint32_t x, uint32_t y) const {
  double xs = 2 * (x + 0.5) / width - 1;
  double ys = 2 * (y + 0.5) / height - 1;

  double xc = xs * angle_w;
  double yc = ys * angle_h;

  return normalize(camera2world * vec3(xc, yc, 1));
}

void Camera::render() {
  for (uint32_t y = 0; y < height; y++) {
    for (uint32_t x = 0; x < width; x++) {
      glm::vec3 ray = getRay(x, y);

      fmt::println("Ray for {},{}: {} {} {}", x, y, ray.x, ray.y, ray.z);
    }
  }
}