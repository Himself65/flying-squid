var Chunk = require('prismarine-chunk')(require("../version"));
var Vec3 = require('vec3').Vec3;

function generation({opt='default',bottom_id=7,middle_id=1,top_id=2,middle_thickness=3,debug=false}={}) {
  function generateChunk(chunkX,chunkZ) {
    var chunk=new Chunk();
    var height = middle_thickness + 1;
    var DEBUG_POINTS = [new Vec3(0, height, 0), new Vec3(15, height, 0), new Vec3(0, height, 15), new Vec3(15, height, 15)];
    for (var x = 0; x < 16; x++) {
      for (var z = 0; z < 16; z++) {
        for (var y = 0; y < middle_thickness + 2; y++) {
          if (y == 0) chunk.setBlockType(new Vec3(x, y, z), bottom_id);
          else if (y < middle_thickness + 1) chunk.setBlockType(new Vec3(x, y, z), middle_id);
          else chunk.setBlockType(new Vec3(x, y, z), top_id);
        }
        for (y = 0; y < 256; y++) {
          chunk.setSkyLight(new Vec3(x, y, z), 15);
        }
      }
    }

    if (debug) {
      for (var d in DEBUG_POINTS) {
        chunk.setBlockType(DEBUG_POINTS[d], 35);
      }
    }
    return chunk;
  }
  return generateChunk;
}

module.exports=generation;