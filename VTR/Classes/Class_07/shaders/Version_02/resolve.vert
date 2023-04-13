#version 440


in vec4 position;
in vec2 texCoord0;

out Data {
	vec2 texCoord;
} DataOut;

void main()
{
	DataOut.texCoord = texCoord0;

	gl_Position = position ;
} 
