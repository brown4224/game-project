/**
 * Sean McGlincy
 * Graphics
 * Assignment 3
 * Summer 2017
 *
 * */
// CUBE
function quad(a, b, c, d) {

    // Normal Vector
    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    var normal = vec3(normal);

    //  Push onto array
    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[a]);
    normalsArray.push(normal);

    pointsArray.push(vertices[b]);
    colorsArray.push(vertexColors[a]);
    normalsArray.push(normal);

    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[a]);
    normalsArray.push(normal);

    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[a]);
    normalsArray.push(normal);

    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[a]);
    normalsArray.push(normal);

    pointsArray.push(vertices[d]);
    colorsArray.push(vertexColors[a]);
    normalsArray.push(normal);

}

function drawCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );

    if(debug){
        console.log("points array: " + pointsArray.length);
        console.log(pointsArray);
    }

}
var vertices = [
    vec4(-0.5, -0.5,  0.5, 1.0),
    vec4(-0.5,  0.5,  0.5, 1.0),
    vec4(0.5,  0.5,  0.5, 1.0),
    vec4(0.5, -0.5,  0.5, 1.0),
    vec4(-0.5, -0.5, -0.5, 1.0),
    vec4(-0.5,  0.5, -0.5, 1.0),
    vec4(0.5,  0.5, -0.5, 1.0),
    vec4( 0.5, -0.5, -0.5, 1.0)
];
