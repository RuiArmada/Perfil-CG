#version 440


in vec4 position;
in vec2 texCoord0;

uniform vec4 lightDir;
uniform mat4 m_view;

out vec2 tc;
out vec3 ld;

void main() {

	tc = texCoord0;	
    ld = vec3(-m_view * lightDir);
    
	gl_Position = position;
}