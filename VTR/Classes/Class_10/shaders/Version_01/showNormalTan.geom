#version 420
 
layout(triangles) in;
layout (line_strip, max_vertices=12) out;

uniform mat4 projViewModelMatrix;
uniform float len = 0.1;

in vec3 normalTE[];
in vec3 tangentTE[];

out vec4 color;

 void main()
{

    color = vec4(0,1,0,0);
	// normal for first vertex
	gl_Position = projViewModelMatrix * gl_in[0].gl_Position;
	EmitVertex();

	gl_Position = projViewModelMatrix * (gl_in[0].gl_Position + len * vec4(normalTE[0],0.0));
	EmitVertex();

	EndPrimitive();

	// tangent for first vertex
    color = vec4(1,0,0,0);

	gl_Position = projViewModelMatrix * gl_in[0].gl_Position;
	EmitVertex();

	gl_Position = projViewModelMatrix * (gl_in[0].gl_Position + len * vec4(tangentTE[0],0.0));
	EmitVertex();

	EndPrimitive();
	

	// normal for second vertex
    color = vec4(0,1,0,0);

	gl_Position = projViewModelMatrix * gl_in[1].gl_Position;
	EmitVertex();

	gl_Position = projViewModelMatrix * (gl_in[1].gl_Position + len * vec4(normalTE[1], 0.0));
	EmitVertex();

	EndPrimitive();

	// tangent for second vertex
    color = vec4(1,0,0,0);

	gl_Position = projViewModelMatrix * gl_in[1].gl_Position;
	EmitVertex();

	gl_Position = projViewModelMatrix * (gl_in[1].gl_Position + len * vec4(tangentTE[1],0.0));
	EmitVertex();

	EndPrimitive();

	// normal for third vertex
    color = vec4(0,1,0,0);

	gl_Position = projViewModelMatrix * gl_in[2].gl_Position;
	EmitVertex();

	gl_Position = projViewModelMatrix * (gl_in[2].gl_Position + len * vec4(normalTE[2],0.0));
	EmitVertex();

	EndPrimitive();

	// tangent for third vertex

    color = vec4(1,0,0,0);

	gl_Position = projViewModelMatrix * gl_in[2].gl_Position;
	EmitVertex();

	gl_Position = projViewModelMatrix * (gl_in[2].gl_Position + len * vec4(tangentTE[2],0.0));
	EmitVertex();

	EndPrimitive();
}

