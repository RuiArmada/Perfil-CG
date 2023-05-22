import json
import bpy
from mathutils import Vector

cam = bpy.context.scene.camera

# No idea how this works tbh
lookingAt = cam.matrix_world @ Vector((0, 0, -1))

cam_dict = {
    "position": {
        "x": cam.location.x,
        "y": cam.location.z,
        "z": -cam.location.y
    },
    # TODO
    "up": {
        "x": 0,
        "y": -1,
        "z": 0
    },
    "lookingAt": {
        "x": lookingAt.x,
        "y": lookingAt.z,
        "z": -lookingAt.y
    },
    # Is this it??
    "fov": {
        "x": cam.data.angle_x,
        "y": cam.data.angle_y
    }
}

out = {
    "title": "Cone",
    "model": "models/cone.obj",
    "width": bpy.context.scene.render.resolution_x,
    "height": bpy.context.scene.render.resolution_y,
    "frames": [{
        "frame": 0,
        "camera": cam_dict
    }],
    "output": "image.png"
}

with open("scene.json", "w") as f:
    json.dump(out, f)
    
bpy.ops.export_scene.obj(filepath="cone.obj")