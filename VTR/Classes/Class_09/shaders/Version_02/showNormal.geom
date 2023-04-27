#version 420
 
layout(triangles) in;
layout (line_strip, max_vertices=6) out;

uniform mat4 m_pvm;

out vec4 color;

in Data {
	vec3 normal;
	vec4 tangent;
	vec4 bitangent;
} DataIn[3];


 void main() {	
	for (int i = 0; i < 3; i++) {
		gl_Position = m_pvm * gl_in[i].gl_Position;
		color = vec4(1,0,0,1);
		EmitVertex();

		gl_Position = m_pvm * (gl_in[i].gl_Position + vec4(DataIn[i].normal, 0));
		EmitVertex();
		EndPrimitive();

		gl_Position = m_pvm * gl_in[i].gl_Position;
		color = vec4(0,1,0,1);
		EmitVertex();

		gl_Position = m_pvm * (gl_in[i].gl_Position + DataIn[i].tangent);
		EmitVertex();
		EndPrimitive();

		gl_Position = m_pvm * gl_in[i].gl_Position;
		color = vec4(0,0,1,1);
		EmitVertex();

		gl_Position = m_pvm * (gl_in[i].gl_Position + DataIn[i].bitangent);
		EmitVertex();
		EndPrimitive();
	}
}

