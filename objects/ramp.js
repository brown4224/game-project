/**
 * Sean McGlincy
 * Graphics
 * Assignment 3
 * Summer 2017
 *
 * */

// Ramp
function rampsides(a, b, c) {

    // Normal Vector
    var t1 = subtract(ramp_vertices[b], ramp_vertices[a]);
    var t2 = subtract(ramp_vertices[c], ramp_vertices[b]);
    var normal = cross(t1, t2);
    var normal = vec3(normal);

    //  Push onto array
    pointsArray.push(ramp_vertices[a]);
    colorsArray.push(vertexColors[1]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[0]);

    pointsArray.push(ramp_vertices[b]);
    colorsArray.push(vertexColors[1]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[1]);

    pointsArray.push(ramp_vertices[c]);
    colorsArray.push(vertexColors[1]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[2]);

}


function rampQuad(a, b, c, d) {

    // Normal Vector
    var t1 = subtract(ramp_vertices[b], ramp_vertices[a]);
    var t2 = subtract(ramp_vertices[c], ramp_vertices[b]);
    var normal = cross(t1, t2);
    var normal = vec3(normal);

    //  Push onto array
    pointsArray.push(ramp_vertices[a]);
    colorsArray.push(vertexColors[4]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[0]);

    pointsArray.push(ramp_vertices[b]);
    colorsArray.push(vertexColors[4]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[1]);

    pointsArray.push(ramp_vertices[c]);
    colorsArray.push(vertexColors[4]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[2]);

    pointsArray.push(ramp_vertices[a]);
    colorsArray.push(vertexColors[4]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[0]);

    pointsArray.push(ramp_vertices[c]);
    colorsArray.push(vertexColors[4]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[2]);

    pointsArray.push(ramp_vertices[d]);
    colorsArray.push(vertexColors[4]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[3]);

}

function drawRamp()
{
    // Sides
    rampsides( 1, 0, 3 );
    rampsides( 4, 5, 7 );
    rampQuad( 5, 4, 0, 1 );  // backS
    rampQuad( 3, 0, 4, 7 );  // bottom
    rampQuad(1, 3 , 7, 5);   // ramp


    if(debug){
        console.log("points array: " + pointsArray.length);
        console.log(pointsArray);
    }

}
var ramp_vertices = [
    vec4(-1, -0.75,  1, 1.0),
    vec4(-1,  0.75,  1, 1.0),
    vec4(1,  0.75,  1, 1.0),
    vec4(1, -0.75,  1, 1.0),
    vec4(-1, -0.75, -1, 1.0),
    vec4(-1,  0.75, -1, 1.0),
    vec4(1,  0.75, -1, 1.0),
    vec4( 1, -0.75, -1, 1.0)
];
