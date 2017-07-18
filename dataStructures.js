/**
 * Created by Sean on 7/15/2017.
 */

function initDataStructures() {
    for(i = 0; i < historyArray.length; i++){
        var r = getRadius(historyArray[0]);
        collisionLocation_sphere[i] = new sphereBoundingBox(i, r);
    }

    for(i = 0; i < ramps.length; i++){
        var shape = ramps[0];
        collisionLocation_ramps.push(new boundingBox(i, getCorners(shape)))
        // console.log("Getting Ramp: " + shape);
        // console.log(getCorners(shape));
    }


}

function heroObj(shape) {
    this.center = vec3(0,0,0);
    this.radius =  getRadius(shape);
    this.corners = getCorners(shape);
    this.min = this.corners[0];
    this.max = this.corners[1];

    // console.log("Hero Data Structure");
    // console.log("radius: " + this.radius);
    // console.log("min");
    // console.log(this.min);
    // console.log("max");
    // console.log(this.max);
}

function sphereBoundingBox(id, r) {
    this.id = id;
    this.isNear = false;
    this.position = vec3();
    this.radius = r;
    this.orginDistance = 99;
}

function boundingBox(id, corners) {
    this.id = id;
    this.isNear = false;
    this.min = vec3();
    this.max = vec3();
    this.rampEnterpt1 = vec3();
    this.rampEnterpt2 = vec3();
    this.corners = [vec4(-1, -0.75, -1, 1.0), vec4(1, 0.75, 1, 1.0)];  // Array:  [ vec4: minCorner,  vec4: maxCorner ] before transformation
    this.rampEnterCorner = [vec4(1, -0.75, 1, 1.0), vec4(1, -0.75, -1, 1.0)];  // Array:  [ vec4: minCorner,  vec4: maxCorner ] before transformation

    // this.corners = corners;  // Array:  [ vec4: minCorner,  vec4: maxCorner ] before transformation
    this.orginDistance = 99;
    // this.rampEnterCorner = [new vec4(corners[1][0], corners[0][1], corners[1][2], 1), new vec4(corners[1][0], corners[0][1], corners[0][2], 1)]
    console.log("Ramp Enter");
    console.log(this.rampEnterCorner);
    console.log(this.corners);

}


function nearArrayObject(key, type, array ) {
    this.key = key;
    this.type = type;
    this.array = array;
}

function bullet(shape, id) {
    this.id = id;
    this.render = true;
    this.shape = shape;
    this.count = 100;  // Time to live
    this.size = 0.5;
    this.scaler = vec3(this.size, this.size, this.size);
    this.direction =   new vec3(   -projectileSpeed * Math.sin(theta),  0,  -projectileSpeed *  Math.cos(theta));
    this.projectileMovement = new vec3(-movementMatrix[0], -movementMatrix[1], -movementMatrix[2]);

    // Position Data
    this.radius =  getRadius(shape) * this.size ;
    this.position = vec3(0,0,0);


}