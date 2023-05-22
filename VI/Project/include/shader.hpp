#pragma once

#include "geometry.hpp"
#include "scene.hpp"
#include <glm/glm.hpp>
#include <tiny_obj_loader.h>

using namespace glm;

class Shader {
protected:
  const Scene &scene;

public:
  explicit Shader(const Scene &scene) : scene{scene} {};

  virtual vec3 getColor(const Intersection &intersection) { return {0, 0, 0}; };
};

class AmbientShader : Shader {
private:
  vec3 ambientLight;

public:
  AmbientShader(const Scene &scene, vec3 ambientLight)
      : ambientLight{ambientLight}, Shader(scene){};

  vec3 getColor(const Intersection &intersection) override;
};

class WhittedShader : Shader {
private:
  vec3 background;
  vec3 directLighting(const Intersection &isect, const Material &material);
  vec3 specularReflection(const Intersection &isect, const Material &material);

public:
  explicit WhittedShader(const Scene &scene) : Shader(scene){};
  vec3 getColor(const Intersection &intersection) override;
};

class DistributedShader : Shader {
private:
  vec3 background;
  vec3 directLighting(const Intersection &isect, const Material &material);
  vec3 specularReflection(const Intersection &isect, const Material &material);

public:
  explicit DistributedShader(const Scene &scene) : Shader(scene){};
  vec3 getColor(const Intersection &intersection) override;
};

class RayCastShader : Shader {
private:
  vec3 getColorInternal(const Intersection &intersection, int i);

public:
  explicit RayCastShader(const Scene &scene) : Shader(scene){};

  inline vec3 getColor(const Intersection &intersection) override {
    return getColorInternal(intersection, 0);
  }
};
