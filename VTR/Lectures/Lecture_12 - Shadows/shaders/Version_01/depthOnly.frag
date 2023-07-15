#version 330

out float depth;

uniform sampler2DShadow gShadowMap;

#define EPSILON 0.00001

in vec4 position;
in vec4 normal;
in vec4 texCoord0;

uniform vec4 lightDirection;

uniform mat4 PVM;

/* float CalcShadowFactor(vec4 LightSpacePos)
{
    vec3 ProjCoords = LightSpacePos.xyz / LightSpacePos.w;
    vec2 UVCoords;
    UVCoords.x = 0.5 * ProjCoords.x + 0.5;
    UVCoords.y = 0.5 * ProjCoords.y + 0.5;
    float z = 0.5 * ProjCoords.z + 0.5;

    float xOffset = 1.0/gMapSize.x;
    float yOffset = 1.0/gMapSize.y;

    float Factor = 0.0;

    for (int y = -1 ; y <= 1 ; y++) {
        for (int x = -1 ; x <= 1 ; x++) {
            vec2 Offsets = vec2(x * xOffset, y * yOffset);
            vec3 UVC = vec3(UVCoords + Offsets, z + EPSILON);
            Factor += texture(gShadowMap, UVC);
        }
    }

    return (0.5 + (Factor / 18.0));
} */

void main(void) {
	


	gl_Position = PVM * position;
}


/*

	SOLUTION:

		for(i=0 ... 16)
			shadow += textureProj(ShadowMap, projShadowCoord/projShadowCoord.w + vec4(j[2x]/4096, j[2x+1]/4096, 0, 0))
		}
		shadow/=16

*/