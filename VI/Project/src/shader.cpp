#include "shader.hpp"
#include "light.hpp"
#include <fmt/core.h>
#include <glm/gtc/random.hpp>

vec3 AmbientShader::getColor(const Intersection &intersection) {
  vec3 color{0};
  if (intersection.face) {
    vec3 curLight =
        ambientLight *
        glm::max(0.2f, dot(-intersection.ray,
                           normalize(intersection.face->planeNormal)));
    if (intersection.face->material) {
      color.r += intersection.face->material->diffuse[0] * curLight.r;
      color.g += intersection.face->material->diffuse[1] * curLight.g;
      color.b += intersection.face->material->diffuse[2] * curLight.b;
    }
  }
  return color;
}

vec3 RayCastShader::getColorInternal(const Intersection &intersection, int i) {
  vec3 color{0};
  int samples = i == 0 ? 128 : 1;

  if (i < 4 && intersection.face && intersection.face->material) {
    // TODO: We need to get the roughness of the material, and randomize the ray
    // direction
    float roughness = 0.5;
    auto mtl = intersection.face->material;

    vec3 reflectedColor{0};
    for (int j = 0; j < samples; j++) {
      vec3 dir = normalize(normalize(intersection.face->planeNormal) +
                           normalize(glm::ballRand<float>(1.0)));
      reflectedColor +=
          getColorInternal(scene.castRay(*intersection.pos, dir), i + 1);
    }

    reflectedColor /= samples;

    color = reflectedColor * mtl->diffuse + mtl->emission;
  }

  return color;
}

vec3 WhittedShader::directLighting(const Intersection &isect,
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
          vec3 shadowRayOrigin = *isect.pos;

          if (dot(lDir, normal) < 0) {
            shadowRayOrigin -= 0.0001f * normal;
          } else {
            shadowRayOrigin += 0.0001f * normal;
          }

          if (scene.visibility(shadowRayOrigin, lDir, lDistance - 0.0001f))
            color += material.diffuse * pointLight.color * cosL;
        }
      }
      break;
    default:
      break;
    }
  }

  return color;
}

vec3 WhittedShader::specularReflection(const Intersection &isect,
                                       const Material &material) {
  vec3 rayDir = reflect(isect.ray, *isect.shadingNormal);
  vec3 rayOrigin = isect.pos.value();

  if (dot(rayDir, *isect.shadingNormal) < 0) {
    rayOrigin -= 0.0001f * *isect.shadingNormal;
  } else {
    rayOrigin += 0.0001f * *isect.shadingNormal;
  }

  auto intersection = scene.castRay(rayOrigin, rayDir);
  return getColor(intersection) * material.specular;
}

vec3 WhittedShader::getColor(const Intersection &intersection) {
  vec3 color{0, 0, 0};

  if (!intersection.pos.has_value()) {
    // We hit the background
    // TODO: Return background color!
    return color;
  }

  auto m = intersection.face->material;

  color += directLighting(intersection, *m);
  if (m->specular != vec3(0, 0, 0))
    color += specularReflection(intersection, *m);

  return color;
}

vec3 DistributedShader::directLighting(const Intersection &isect,
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
          vec3 shadowRayOrigin = *isect.pos;

          if (dot(lDir, normal) < 0) {
            shadowRayOrigin -= 0.0001f * normal;
          } else {
            shadowRayOrigin += 0.0001f * normal;
          }

          if (scene.visibility(shadowRayOrigin, lDir, lDistance - 0.0001f))
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
          vec3 shadowRayOrigin = *isect.pos;

          if (dot(lightDir, *isect.shadingNormal) < 0) {
            shadowRayOrigin -= 0.0001f * *isect.shadingNormal;
          } else {
            shadowRayOrigin += 0.0001f * *isect.shadingNormal;
          }

          if (scene.visibility(shadowRayOrigin, lightDir,
                               lightDistance - 0.001f))
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

vec3 DistributedShader::specularReflection(const Intersection &isect,
                                           const Material &material) {
  vec3 rayDir = reflect(isect.ray, *isect.shadingNormal);
  vec3 rayOrigin = isect.pos.value();

  if (dot(rayDir, *isect.shadingNormal) < 0) {
    rayOrigin -= 0.0001f * *isect.shadingNormal;
  } else {
    rayOrigin += 0.0001f * *isect.shadingNormal;
  }

  auto intersection = scene.castRay(rayOrigin, rayDir);
  return getColor(intersection) * material.specular;
}

vec3 DistributedShader::getColor(const Intersection &intersection) {
  vec3 color{0, 0, 0};
  if (!intersection.pos.has_value()) {
    return color;
  }

  if (intersection.lightColor.has_value()) {
    return intersection.lightColor.value();
  }

  auto m = intersection.face->material;

  color += directLighting(intersection, *m);
  if (m->specular != vec3(0, 0, 0))
    color += specularReflection(intersection, *m);

  return color;
}