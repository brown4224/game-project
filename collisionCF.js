
function collisionDetection(fx, fy, fz) {

    for (var i = 0; i < nearArray.length; i++) {

        var key = nearArray[i].key; // Map to an array
        var array = nearArray[i].array; // the  array callback
        var collitionType = nearArray[i].type; // Map to an array

        if (array[key].orginDistance > isNear) {
            //remove from array
            nearArray.splice(i, 1);  //  remove (index start, number of items)
            array[key].isNear = false;
        }

        // Otherwise Process
        else if (collitionType == "sphere") {
            // Grab object anc calculate future position
            var r = array[key].radius;
            var pos = array[key].position;
            pos = vec3(pos[0] + fx, pos[1] + fy, pos[2] + fz);  // Future Position

            var results = aabb_sphere_sphere_detection([heroPosition.center, heroPosition.radius], [pos, r]);
            if (results) {
                return true;
                speed /= 2;
            }
        } else if (collitionType == "ramp") {
            var posMin = array[key].min;
            var posMax = array[key].max;

            // Offset
            // Seems to keep you from going partially through
            fx *= 2;
            fy *= 2;
            fz *= 2;

            posMin = vec3(posMin[0] + fx, posMin[1] + fy, posMin[2] + fz);  // Future Position
            posMax = vec3(posMax[0] + fx, posMax[1] + fy, posMax[2] + fz);  // Future Position

            //clone vectors so they don't mess up
            var vectorMin = new vec3(posMin[0], posMin[1], posMin[2]);
            var vectorMax = new vec3(posMax[0], posMax[1], posMax[2]);
           

            //get ramp width
            var rampWidth = posMax[0] - posMin[0];

            // console.log(nearArray);
            var results = aabb_boundingBox_detection([heroPosition.min, heroPosition.max], [posMin, posMax]);
            if (results) {
                //jump
                var vector1 = new vec3(posMin[0], posMin[1], posMin[2]);
                var vector2 = new vec3(posMin[0] + rampWidth, posMin[1], posMin[2]);
                var vector3 = new vec3(posMax[0] - rampWidth, posMax[1], posMax[2]);
                var vector4 = new vec3(posMax[0], posMax[1], posMax[2]);
                
                //switch car y position to ramp halfway y position
                //code

                //switch car y position to ramp top y position
                vectorMin[1] = vector4[1];

                return true;
                //after leaving this if statement, car should be back on ground
            
            }
        }

    }  // End for loop
    return false;
}