// TWO vetors:  min corner and max corner
var aabb_CubeVertices;
var aabb_SphereVertices;
var aabb_ConeVertices;

var aabb_CubeRadius;
var aabb_SphereRadius;
var aabb_ConeRadius;


var aabb_radius = s_radius;  // If we want to hard code

function aabb_INIT() {
    // AABB Colition
    aabb_CubeVertices = aabb_boundingBoxCube(vertices);  //  ARRAY: minX, maxX, minY, maxY, minZ, maxZ
    aabb_CubeRadius = distance(aabb_CubeVertices[1], aabb_CubeVertices[0]) /2;

    aabb_SphereVertices = aabb_boundingBoxSphere(s_radius);
    aabb_SphereRadius = s_radius;

}


/////////////////////    Position //////////////////////////////

function getRadius(typeObject) {
    //  Hard code radius
    // var sp_radius = aabb_radius;

    // // var radius;
    switch (typeObject) {
        case 0:  //cube
            sp_radius = aabb_CubeRadius;
            break;
        case 1:  //Sphere
            sp_radius = aabb_SphereRadius;
            break;
        case 2:  //Ground
            sp_radius = aabb_SphereRadius;

            console.log("There was an error.  Ground doesn't have a radius")
            break;
        case 3:  //Cone
            sp_radius = aabb_ConeRadius;
            break;
        default:
            sp_radius = aabb_SphereRadius;
    }
    return sp_radius;
}

function aabb_spherePosition(matrix) {

    var orgian = vec4(0.0, 0.0, 0.0, 1.0);
    var pos = mult(matrix, orgian);
    return vec3(pos[0], pos[1], pos[2]);
}
function aabb_boxPosition(typeObject, matrix) {
    var current;
    switch (typeObject){
        case 0:  //cube
            current = aabb_CubeVertices;
            break;
        case 1:  //Sphere
            current = aabb_SphereVertices;
            break;
        case 2:  //Cone
            current = aabb_ConeVertices;
            break;
        default:
            current = aabb_CubeVertices;
    }

    var min = mult(matrix, current[0]);
    var max = mult(matrix, current[1]);

    min = vec3(min[0], min[1], min[2]);
    max = vec3(max[0], max[1], max[2]);

    return [  min, max  ];
}
/////////////////////    Detection //////////////////////////////
function aabb_box_box_detection(box1, box2) {

    // ALT VERSION
    //  Returns TRUE or FALSE
    return (
        // X-axis
        box1[1][0] >= box2[0][0] &&  // box1.max.x > box2.min.x
        box1[0][0] <= box2[1][0] &&  // box1.min.x < box2.max.x

        // Y-axis
        box1[1][1] >= box2[0][1] &&  // box1.max.y > box2.min.y
        box1[0][1] <= box2[1][1] &&  // box1.min.y < box2.max.y

        // Z-axis
        box1[1][2] >= box2[0][2] &&  // box1.max.z > box2.min.z
        box1[0][2] <= box2[1][2]     // box1.min.z < box2.max.z
    );

}

function aabb_sphere_box_detection(sphere1, box) {}

function aabb_sphere_sphere_detection(sphere1, sphere2) {
    var results = distance(sphere1[0], sphere2[0]);
    var sumRadius = sphere1[1] + sphere2[1];

    return (results < sumRadius);
}

function aabb_distance_detection(box1, box2) {
    var maxDist = aabb_box_distance_vector(box1, box2);
    if( maxValue(maxDist) <= 0)
        return true;

    return false;
}

/////////////////////    Bounding Box //////////////////////////////
function aabb_boundingBoxCube(item) {
    /**
     * Created by Sean on 7/5/2017.
     */
        // AABB Variables
    var minX = 9999;
    var maxX = -9999;

    var minY = 9999;
    var maxY = -9999;

    var minZ = 9999;
    var maxZ = -9999;

    for(var i=0; i < vertices.length; i++){
        // X Values
        if(item[i][0] < minX)
            minX = item[i][0];
        if(item[i][0] > maxX)
            maxX = item[i][0];

        // Y Values
        if(item[i][1] < minY)
            minY = item[i][1];
        if(item[i][1] > maxY)
            maxY = item[i][1];

        // Z Values
        if(item[i][2] < minZ)
            minZ = item[i][2];
        if(item[i][2] > maxZ)
            maxZ = item[i][2];
    }

    // Return two vetors:  min corner and max corner
    return [  vec4(minX, minY, minZ, 1.0), vec4(minX, minY, maxZ, 1.0)  ];
}

function aabb_boundingBoxSphere(aabb_radius) {

    return [ vec4(-aabb_radius, -aabb_radius, -aabb_radius, 1.0), vec4(aabb_radius, aabb_radius, aabb_radius, 1.0) ];
}

function aabb_boundingBoxCone(coneRadius, coneBase, coneHeight){

    return [  vec4(-coneRadius, coneBase, -coneRadius, 1.0), vec4(coneRadius, coneBase + coneHeight, coneRadius, 1.0)  ];
}

/////////////////////    Distance //////////////////////////////
function distance(pnt1, pnt2) {
    var dist = subtract(pnt1, pnt2);
    return  Math.sqrt( dist[0] * dist[0] + dist[1] * dist[1] + dist[2] * dist[2]  );

}

function aabb_matrix_to_vector(matrix) {
    var x = 0;
    var y = 0;
    var z = 0;
    var extra;
    for(var i = 0; i < matrix.length; i++){
        x += matrix[i][0];
        y += matrix[i][1];
        z += matrix[i][2];
    }
    return vec3(x, y, z);

}

function aabb_box_distance_vector(box1, box2) {
    var dist1 = subtract(box1[0], box2[1]);
    var dist2 = subtract(box2[0], box1[1]);
    return aabb_max_vector(dist1, dist2);

}

function aabb_max_vector (dist1, dist2) {
    var results = [];
    for(var i = 0; i < dist1.length; i++){
        if(dist1[i] > dist2[i] )
            results.push(dist1[i]);
        else
            results.push(dist2[i]);
    }
    return results;
}
function maxValue(vector) {
    var max = vector[0];
    for(var i = 0; i<vector.length; i++){
        if (max < vector[i]){
            max = vector[i];
        }
    }
    return max;
}