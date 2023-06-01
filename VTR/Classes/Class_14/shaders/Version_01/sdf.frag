

uniform float FOV;
uniform float Ratio;
uniform vec2 WindowSize;
uniform vec4 RayOrigin;
uniform vec4 CamView, CamUp, CamRight;
uniform vec3 LightPos;
uniform float Timer;

uniform vec3 background = vec3(0.5, 0.8, 0.9);

out vec4 color;

const int MAX_STEPS = 128;
const float MAX_DIST = 512;
const float EPSILON = 0.001;

struct object {
    float dist;
    int id;
};


float turbulence(vec3 pos);

vec3 getRayDir(vec2 fc, vec2 offset) {
  
  vec3 rayDir;

  float FocalLenght = 1.0 / tan(radians(FOV * 0.5));

  rayDir.xy = 2.0 * fc / WindowSize - 1.0;
  rayDir.x *= Ratio;
  rayDir.z = - FocalLenght;
  
  rayDir = normalize(rayDir);

  rayDir = mat3(vec3(CamRight), vec3(CamUp), vec3(-CamView)) * rayDir;

  return rayDir;

}

object fOpUnionID(object a, object b) {
  
  return (a.dist < b.dist ? a : b);

}

object map(vec3 p) {

  float dist = p.y;

  object plane = object(dist, 1);

  vec3 p1 = p;

  p1.y = p1.y - 3.0;

  object sphere = object(length(p1) - 1.0, 2);

  object res = fOpUnionID(sphere, plane);

  return res;

}

vec3 getNormal(vec3 p) {

  vec2 e = vec2(EPSILON, 0.0);

  vec3 n = normalize(vec3(map(p).dist) - vec3(map(p - e.xyy).dist, map(p - e.yxy).dist, map(p - e.yyx).dist));

  return n;

}

float getSoftShadow(vec3 p, vec3 lightDir) {

  float res = MAX_DIST;
  float dist = 0.01;
  float lightSize = 0.02;

  float dist_to_light = length(p - LightPos);

  for(int i = 0; i < MAX_STEPS; ++i) {

    float hit = map(p + lightDir * dist).dist;

    res = min(res, hit/(dist * lightSize));

    dist += hit;

    if(hit < EPSILON * 0.1 || dist > MAX_DIST || dist > dist_to_light)
      	break;
  }

  return clamp(res, 0.0, 1.0);

}

object rayMarch(vec3 rayOrig, vec3 rayDir) {

  object hit;

  float dist = 0.0;
  int id = 0;

  for(int i = 0; i < MAX_STEPS; ++i) {
    
    vec3 p = rayOrig + rayDir * dist;
    
    hit = map(p);
    dist += hit.dist;
    id = hit.id;

    if(abs(hit.dist) < EPSILON || dist > MAX_DIST) 
      break;

  }

  return object(dist, id);
}

vec3 getMaterial(int id) {

  vec3 material;

  switch(id) {

    case 1: material = vec3(0.5, 0.5, 0.5); break;
    case 2: material = vec3(0.0, 1.0, 1.0); break;
    case 3: material = vec3(1.0, 0.0, 1.0); break;

  }

  return material;

}

vec3 getLight(vec3 p, vec3 rayDir, vec3 color) {

  vec3 l = normalize(LightPos - p);

  vec3 n = getNormal(p);

  vec3 view = -rayDir;
  vec3 refl = reflect(-l, n);

  vec3 specColor = vec3(0.5);
  vec3 specular = specColor * pow(max(0.0, dot(refl, view)), 10.0);

  vec3 diffuse = color * max(0.0, dot(l, n));
  vec3 ambient = 0.3 * color;

  return ambient + (diffuse + specular) * getSoftShadow(p + n * 0.0001, l);

}

vec3 getColor(object obj, vec3 rayDir) {

  vec3 c;
  
  if(obj.dist < MAX_DIST) {

    vec3 p = vec3(RayOrigin) + obj.dist * rayDir;

    c = getMaterial(obj.id);

    c = getLight(p, rayDir, c);

    c = mix(c, background, 1.0 - exp(-0.000005 * obj.dist * obj.dist));

  } else c = background - clamp(max(0.9 * rayDir.y, 0.0), 0.0, 0.4);

  c = pow(c, vec3(0.454));

  return c;

}

void main(){
  
  vec3 c = vec3(0);
  vec3 rayDir;

  object obj;

  rayDir = getRayDir(gl_FragCoord.xy, vec2(0));

  obj = rayMarch(RayOrigin.xyz, rayDir);

  c += getColor(obj, rayDir);

  color = vec4(c, 1.0);

}


//---------------------------------------------------------------------------------------
//
// Description : Array and textureless GLSL 2D/3D/4D simplex 
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
// 

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v)
  { 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289(i); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
  }
  

  float turbulence(vec3 pos) {

	float n = snoise(pos) + 0.5 * snoise(pos*2) + 0.25 * snoise(pos*4) + 0.125 * snoise(pos*8);
	return n;
}
