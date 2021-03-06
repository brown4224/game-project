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

var maxObjects = 12;

function renderOrder() {
    var shape;
    var defaultScale = vec3(1.0, 1.0, 1.0);
    var defaultTranslation = vec3(0.0, 0.0, 0.0);
    var defaultRotation = [false, true, false];
    var bounds = 15;


    ///////////////  HERO OBJECT   //////////////////////
    shape = 0;  //Car
    var centerCar = subtract(carMax, carMin);
    centerCar =  vec3((centerCar[0] / 2 ) - carMax[0], (centerCar[1] / 2 ) - carMax[1], (centerCar[2] / 2 ) - carMax[2]);
    // centerCar =  vec3((centerCar[0] / 2 ) - carMax[0], 0, (centerCar[2] / 2 ) - carMax[2]);

    var heroPosition = vec3(0,-0.14,0);
    hero =[  shape, true, vec3(4.0, 4.0, 4.0), heroPosition, centerCar, true  ];


    ///////////////  Ramps   //////////////////////
    shape = 4;
    trans = [vec3(5,0,5), defaultTranslation];
    ramps.push([  shape, true, defaultScale, trans, [false, false, false], true  ]);

    
    ///////////////  DRAW GROUND   //////////////////////
    historyArray.push([  3, true, [1, 1, 1], [vec3(0.0, 5.0, 0.0), defaultTranslation], [false, false, false], true ]);
    console.log("Ground");
    console.log(historyArray[historyArray.length - 1]);

    ///////////////  RANDOM OBJECTS   //////////////////////
    for (var i = 0; i < maxObjects; i++){
        shape = randomNumber(3, 1, false);
        var trans;
        var translation = vec3(randomNumber(bounds, 1, true), 0, randomNumber(bounds, 1, true));

        // Make half of the objects move
        if(i%2 == 0){
            var translationSecond = vec3(randomNumber(bounds, 1, true), 0, randomNumber(bounds, 1, true));
            trans = [translation, translationSecond];
        } else {
        // Make half static
        trans = [translation, defaultTranslation];
        }

        historyArray.push([  shape, true, defaultScale, trans, defaultRotation, true  ]);
        console.log(historyArray[historyArray.length - 1]);
        
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