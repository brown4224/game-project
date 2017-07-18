
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
                
                document.getElementById("crashSound").play();
                speed /= 2;
                return true;

            }
        } else if (collitionType == "ramp") {
            var posMin = array[key].min;
            var posMax = array[key].max;

            // Offset
            // Seems to keep you from going partially through
            // fx *= 2;
            // fy *= 2;
            // fz *= 2;

            // posMin = vec3(posMin[0] + fx, posMin[1] + fy, posMin[2] + fz);  // Future Position
            // posMax = vec3(posMax[0] + fx, posMax[1] + fy, posMax[2] + fz);  // Future Position


            var results = aabb_boundingBox_detection([heroPosition.min, heroPosition.max], [posMin, posMax]);
            if (results) {

                // Working on Ramp Enterence
                var rampWidth = subtract(posMax, posMin);
                var pt1 = array[key].rampEnterpt1;
                var pt2 = array[key].rampEnterpt2;
                // var pt3 = new vec3(pt1[0] + rampWidth[0] / 2, pt1[1], pt1[2]);
                var pt4 = new vec3(pt2[0] - (posMax[0] - posMin[0]) / 2, pt2[1], pt2[2]);
                // var enter = aabb_boundingBox_detection([heroPosition.min, heroPosition.max], [new vec3(pt4[0] + fx, pt4[1] + fy,pt4[2] + fz),new vec3(pt1[0] + fx, pt1[1] + fy,pt1[2] + fz)]);
                var enter = aabb_boundingBox_detection([heroPosition.min, heroPosition.max], [pt4, pt1]);
                
                // if(enter) {
                //     movementMatrix[1] = -1;
                //     console.log("Success")
                //     return false;
                // }

                // var slope = (posMax[1] - posMin[1])/ (posMax[0] - posMin[0]);


                document.getElementById("crashSound").play();
                console.log("True");
                return true;
            }
        }

    }  // End for loop
    return false;
}