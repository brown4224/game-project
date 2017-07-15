/**
 * Created by Sean on 7/15/2017.
 */

function initDataStructures() {
    for(i = 0; i < historyArray.length; i++){
        var r = getRadius(historyArray[0]);
        collisionLocation_sphere[i] = new sphereBoundingBox(i, r);

    }
}

function heroObj(shape) {
    this.center = vec3(0,0,0);
    this.radius =  getRadius(shape);
    this.min = vec3();
    this.max = vec3();
}

function sphereBoundingBox(id, r) {
    this.id = id;
    this.position = vec3();
    this.radius = r;
    this.orginDistance = 99;
}

