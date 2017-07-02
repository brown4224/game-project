/**
 *
 * Pull objects from the history array.
 * Position 0 & 1 are default spheres
 *
 * arr[0]:  Type of shape, pulls from the shapes array.
 *             CUBE, SPHERE, CONE: [START, OFF Set]
 *             The shapes array represents each object by the
 *             vertex start position and off set.
 *             For example the cube might start at postion 0 and sphere at 36.
 *             The cube's value will then be [0, 36] and represent positions
 *             0 to 35.  Position 36 is where the cube starts
 * arr[1]:  Flag for shader.  Passed into shader and represents if lighting is used.
 * arr[2]:  Vec3:   Scale values for matrix multiplication
 * arr[3]:  Vec3:   Translation values for matrix multiplication
 * arr[4]:  Vec3:   Boolan Flag for rotation
 *                  Each axis can rotate at different speeds.
 *                  This flag determine which axis will be rotated.
 */



function renderOrder() {
    var defaultScale = vec3(1.0, 1.0, 1.0);
    var defaultTranslation = vec3(0.0, 0.0, 0.0);
    var defaultRotation = [false, true, false];
    var bounds = 3;
    var maxObjects = 50;

    for (var i = 0; i < maxObjects; i++){
        var shape = randomNumber(3, 0, false);
        var x = randomNumber(bounds, 1, true);
        var y = 0;
        var z = randomNumber(bounds, 1, true);
        var translation = vec3(x, y, z);
        historyArray.push([shapeArray[shape], true, defaultScale, translation, defaultRotation]);
    }
}

// Input:   max value for 0 to max. + offset
// Input:  bool for if negative number
function randomNumber( max, offSet,negative) {
    var num = Math.floor(Math.random() * max) + offSet;
    if(negative)
        num *= Math.floor(Math.random()*2) == 1 ? 1 : -1;

    return num;
}