#include "path_tracer_shader.hpp"
#include "fmt/core.h"
#include "ray.hpp"
#include <fmt/color.h>
#include <glm/gtc/random.hpp>
#define MAX_DEPTH 4
#define CONTINUE_P 0.5f

vec3 PathTracerShader::getColor(const Intersection &intersection) {
  return getColorInternal(intersection, 0);
}

vec3 PathTracerShader::getColorInternal(const Intersection &intersection,
                                        int depth) {
  vec3 color{0, 0, 0};

  if (!intersection.pos.has_value()) {
    // We hit the background
    // TODO: Return background color!
    return color;
  }

  if (intersection.lightColor.has_value()) {
    return intersection.lightColor.value();
  }

  float rnd_russian = ((float)rand()) / ((float)RAND_MAX);
  if (depth < MAX_DEPTH || rnd_russian < CONTINUE_P) {
    auto m = intersection.face->material;
    vec3 lcolor = vec3(0, 0, 0);
    if (m->specular != vec3(0, 0, 0))
      lcolor += specularReflection(intersection, *m, depth + 1);
    if (m->diffuse != vec3(0, 0, 0)) {
      lcolor += diffuseReflection(intersection, *m, depth + 1);
      lcolor += directLighting(intersection, *m);
    }

    if (depth < MAX_DEPTH)
      color += lcolor;
    else
      color += lcolor / CONTINUE_P;
  }

  return color;
}

vec3 PathTracerShader::diffuseReflection(const Intersection &isect,
                                         const Material &material, int depth) {
  vec3 color{0, 0, 0};
  vec2 rand = glm::linearRand(vec2(0, 0), vec2(1, 1));
  float cosTheta = sqrtf(rand.y);

  vec3 dAroundZ{cosf(2.f * (float)M_PI * rand.x) * sqrtf(1.f - rand.y),
                sinf(2.f * (float)M_PI * rand.x) * sqrtf(1.f - rand.y), cosTheta};

  vec3 rayZ = *isect.shadingNormal;
  vec3 rayX, rayY;
  if (abs(rayZ.x) > abs(rayZ.y))
    rayX = vec3(-rayZ.z, 0, rayZ.x) / sqrtf(rayZ.x * rayZ.x + rayZ.z * rayZ.z);
  else
    rayX = vec3(0, rayZ.z, -rayZ.y) / sqrtf(rayZ.y * rayZ.y + rayZ.z * rayZ.z);
  rayY = cross(rayZ, rayX);

  vec3 rayOrigin = *isect.pos;
  vec3 rayDir = {
      dAroundZ.x * rayX.x + dAroundZ.y * rayY.x + dAroundZ.z * rayZ.x,
      dAroundZ.x * rayX.y + dAroundZ.y * rayY.y + dAroundZ.z * rayZ.y,
      dAroundZ.x * rayX.z + dAroundZ.y * rayY.z + dAroundZ.z * rayZ.z};

  Ray diffuse(rayOrigin, rayDir);
  diffuse.adjustOrigin(*isect.shadingNormal);

  auto intersection = scene.castRay(diffuse.origin, diffuse.direction);

  if (!intersection.lightColor.has_value()) {
    vec3 rColor = getColorInternal(intersection, depth+1);
    color = (material.diffuse * rColor);// / (cosTheta / (float)M_PI);
  }

  return color;
}

vec3 PathTracerShader::directLighting(const Intersection &isect,
                                      const Material &material) {
  vec3 color{0, 0, 0};

  for (auto &light : scene.lights) {
    switch (light->lightType()) {
    case LightType::AMBIENT:
      color += material.ambient * dynamic_cast<AmbientLight *>(light)->color;
      break;
    case LightType::POINT:
      if (material.diffuse != vec3(0, 0, 0)) {
        auto &pointLight = dynamic_cast<const PointLight &>(*light);
        vec3 lDir = glm::normalize(pointLight.position - *isect.pos);
        const float lDistance = glm::distance(pointLight.position, *isect.pos);

        vec3 normal = *isect.shadingNormal;
        // TODO should be shading normal, but don't know where to get that...
        float cosL = dot(lDir, normal);

        if (cosL > 0) {
          // Light is NOT behind the primitive
          Ray ray(*isect.pos, lDir);
          ray.adjustOrigin(normal);

          if (scene.visibility(ray.origin, ray.direction, lDistance - 0.0001f))
            color += material.diffuse * pointLight.color * cosL;
        }
      }
      break;
    case LightType::AREA:
      if (material.diffuse != vec3(0, 0, 0)) {
        auto &areaLight = dynamic_cast<const AreaLight &>(*light);

        vec2 rnd = glm::linearRand(vec2(0, 0), vec2(1, 1));
        vec3 lightPoint = areaLight.sampleLight(rnd);

        vec3 lightDir = normalize(lightPoint - *isect.pos);
        float lightDistance = distance(*isect.pos, lightPoint);

        // cos between lightDir and the shading normal
        float cosL = dot(lightDir, *isect.shadingNormal);
        // cos between lightDir and area light normal
        float cosL_LA = dot(lightDir, areaLight.gem.planeNormal);

        if (cosL > 0 && cosL_LA <= 0) {
          Ray ray(*isect.pos, lightDir);
          ray.adjustOrigin(*isect.shadingNormal);

          if (scene.visibility(ray.origin, ray.direction,
                               lightDistance - 0.0001f))
            color +=
                (material.diffuse * areaLight.intensity * cosL) / areaLight.pdf;
        }
      }
      break;
    default:
      break;
    }
  }

  return color;
}

vec3 PathTracerShader::specularReflection(const Intersection &isect,
                                          const Material &material, int depth) {
  vec3 rayDir = reflect(isect.ray, *isect.shadingNormal);
  float cosTheta;

  if (material.shininess < 1000) {
    vec2 rnd = glm::linearRand(vec2(0, 0), vec2(1, 1));
    cosTheta = powf(rnd.y, 1 / (material.shininess + 1));

    float auxRand1 = powf(rnd.y, 2 / (material.shininess + 1));
    vec3 sAroundN{
        cosf(2.f * (float)M_PI * rnd.x) * sqrtf(1 - auxRand1),
        sinf(2.f * (float)M_PI * rnd.x) * sqrtf(1 - auxRand1),
        cosTheta,
    };

    // The greater the shininess value, the more sAroundN will point up

    vec3 rayX, rayY;
    if (abs(rayDir.x) > abs(rayDir.y)) {
      rayX = vec3(-rayDir.z, 0, rayDir.x) /
             sqrtf(rayDir.x * rayDir.x + rayDir.z * rayDir.z);
    } else {
      rayX = vec3(0, rayDir.z, -rayDir.y) /
             sqrtf(rayDir.y * rayDir.y + rayDir.z * rayDir.z);
    }
    rayY = cross(rayDir, rayX);
    rayDir = {sAroundN.x * rayX.x + sAroundN.x * rayY.x + sAroundN.z * rayDir.x,
              sAroundN.x * rayX.y + sAroundN.x * rayY.y + sAroundN.z * rayDir.y,
              sAroundN.x * rayX.z + sAroundN.x * rayY.z +
                  sAroundN.z * rayDir.z};
  }

  // Ideal specular
  Ray ray(*isect.pos, rayDir);
  ray.adjustOrigin(*isect.shadingNormal);

  auto intersection = scene.castRay(ray.origin, ray.direction);
  vec3 color = getColorInternal(intersection, depth);

  if (material.shininess < 1000 && false) {
    // Isto é suposto ajustar as cores para que tenham o peso probabilistico
    // certo, mas na verdade acabam só a desaparecer... TODO
    float power = powf(cosTheta, material.shininess) / (2.f * (float)M_PI);

    // TODO: Há um bug aqui, isto está a ficar demasiado escuro
    float pdf = (material.shininess + 1.0f) * power;
    color = (material.specular * color * power) / pdf;
  } else {
    color *= material.specular;
  }

  return color;
}
