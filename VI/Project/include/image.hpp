#pragma once

#include <cstdint>
#include <string>
#include <vector>

class Image {
public:
  uint32_t width;
  uint32_t height;
  std::vector<uint8_t> imageData = {};

  Image(uint32_t width, uint32_t height);
  bool writePNG(const std::string &filename);
};