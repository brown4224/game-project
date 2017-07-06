// TWO vetors:  min corner and max corner
var aabb_CubeVertices;
var aabb_SphereVertices;
var aabb_ConeVertices;

function aabb_INIT() {
    // AABB Colition
    aabb_CubeVertices = aabb_boundingBoxCube(vertices);  //  ARRAY: minX, maxX, minY, maxY, minZ, maxZ
    aabb_SphereVertices = aabb_boundingBoxSphere(s_radius);
    console.log("AABB");
    console.log("Cube");
    console.log(aabb_CubeVertices);
    console.log("Sphere");
    console.log(aabb_SphereVertices);

    // To Do
    //  Make double array of points from radius and height.
    //  Call aabb_boundingBox(array[][])
    var aabb_ConeVertices = [];

}

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
    // console.log("Min X");
    // console.log(minX);
    // console.log("Min y");
    // console.log(minY);
    // console.log("Min z");
    // console.log(minZ);
    //
    // console.log("Max X");
    // console.log(maxX);
    // console.log("Max y");
    // console.log(maxY);
    // console.log("Max z");
    // console.log(maxZ);

    // Return two vetors:  min corner and max corner
    // return [  vec3(minX, minY, minZ), vec3(minX, minY, maxZ)  ];

    return [  vec4(minX, minY, minZ, 1.0), vec4(minX, minY, maxZ, 1.0)  ];
}

function aabb_boundingBoxSphere(aabb_radius) {
    // return [ vec3(-aabb_radius, -aabb_radius, -aabb_radius), vec3(aabb_radius, aabb_radius, aabb_radius) ];

    return [ vec4(-aabb_radius, -aabb_radius, -aabb_radius, 1.0), vec4(aabb_radius, aabb_radius, aabb_radius, 1.0) ];
}

function aabb_currentPosition(aabb_typeObject, aabb_matrix) {
    var currentPosition;
    switch (aabb_typeObject){
        case 0:  //cube
            currentPosition = aabb_CubeVertices;
            break;
        case 1:  //Sphere
            currentPosition = aabb_SphereVertices;
            break;
        case 2:  //Cone
            currentPosition = aabb_ConeVertices;
            break;
        default:
            currentPosition = aabb_CubeVertices;
    }



    var currentMIN = mult(aabb_matrix, currentPosition[0]);
    var currentMax = mult(aabb_matrix, currentPosition[1]);

    currentMIN = vec3(currentMIN[0], currentMIN[1], currentMIN[2]);
    currentMax = vec3(currentMax[0], currentMax[1], currentMax[2]);


    // var currentMIN = mult(aabb_matrix, translate(currentPosition[0]));
    // var currentMax = mult(aabb_matrix, translate(currentPosition[1]));

    // // return the last column of the matrix
    // var currentMIN = mult(aabb_matrix, translate(currentPosition[0]));
    // var currentMax = mult(aabb_matrix, translate(currentPosition[1]));
    // currentMIN = vec3(currentMIN[0][3], currentMIN[1][3],currentMIN[2][3] );
    // currentMax = vec3(currentMax[0][3], currentMax[1][3], currentMax[2][3]  );

    // return the diagonal
    // var currentMIN = mult(aabb_matrix, translate(currentPosition[0]));
    // var currentMax = mult(aabb_matrix, translate(currentPosition[1]));
    // currentMIN = vec3(currentMIN[0][0], currentMIN[1][1],currentMIN[2][2] );
    // currentMax = vec3(currentMax[0][0], currentMax[1][1], currentMax[2][2]  );

    // return sum columns
    // var offset = aabb_matrix_to_vector(aabb_matrix);

    // console.log("Converted Matrix !!!!!");
    // console.log(offset);

    // var currentMIN = currentPosition[0];
    // var currentMax = currentPosition[1];
    // currentMIN = vec3( currentMIN[0] + offset[0], currentMIN[1] + offset[1], currentMIN[2] + offset[2]   );
    // currentMax = vec3( currentMax[0] + offset[0], currentMax[1] + offset[1], currentMax[2] + offset[2]   );


    // var currentMIN = mult(aabb_matrix, translate(currentPosition[0]));
    // var currentMax = mult(aabb_matrix, translate(currentPosition[1]));
    // currentMIN = aabb_matrix_to_vector(currentMIN);
    // currentMax = aabb_matrix_to_vector(currentMax);


    return [  currentMIN, currentMax  ];

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

function aabb_detection(box1, box2) {
    //  Returns TRUE or FALSE
    // var flag = false;
    // if(
    //     // X-axis
    //     box1[1][0] >= box2[0][0] &&  // box1.max.x > box2.min.x
    //     box1[0][0] <= box2[1][0] &&  // box1.min.x < box2.max.x
    //
    //     // Y-axis
    //     box1[1][1] >= box2[0][1] &&  // box1.max.y > box2.min.y
    //     box1[0][1] <= box2[1][1] &&  // box1.min.y < box2.max.y
    //
    //     // Z-axis
    //     box1[1][2] >= box2[0][2] &&  // box1.max.z > box2.min.z
    //     box1[0][2] <= box2[1][2]     // box1.min.z < box2.max.z
    // ){
    //     flag = true;
    // }
    // return flag;


    var dist1 = subtract(box1[0], box2[1]);
    var dist2 = subtract(box2[0], box1[1]);
    var maxDist = aabb_max_vector(dist1, dist2);

    console.log("AABB Detection:  Distance")
    console.log(maxDist);
    if( maxValue(maxDist) <= 0)
        return true;

    return false;
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