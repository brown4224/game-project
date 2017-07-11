/**
 * Sean McGlincy
 * Graphics
 * Assignment 3
 * Summer 2017
 *
 * */

// CUBE
function square(a, b, c, d) {

    // Normal Vector
    var t1 = subtract(g_vertices[b], g_vertices[a]);
    var t2 = subtract(g_vertices[c], g_vertices[b]);
    var normal = cross(t1, t2);
    var normal = vec3(normal);

    //  Push onto array
    pointsArray.push(g_vertices[a]);
    colorsArray.push(vec4(1.0, 1.0, 1.0, 1.0));
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[0]);

    pointsArray.push(g_vertices[b]);
    colorsArray.push(vec4(1.0, 1.0, 1.0, 1.0));
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[1]); 
    
    pointsArray.push(g_vertices[c]);
    colorsArray.push(vec4(1.0, 1.0, 1.0, 1.0));
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[2]);

    pointsArray.push(g_vertices[a]);
    colorsArray.push(vec4(1.0, 1.0, 1.0, 1.0));
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[0]);

    pointsArray.push(g_vertices[c]);
    colorsArray.push(vec4(1.0, 1.0, 1.0, 1.0));
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[2]);

    pointsArray.push(g_vertices[d]);
    colorsArray.push(vec4(1.0, 1.0, 1.0, 1.0));
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[3]);

}

function drawGround()
{ 
    square( 0, 1, 2, 3 );

    if(debug){
        console.log("points array: " + pointsArray.length);
        console.log(pointsArray);
    }

}
var g_vertices = [
    vec4(30.5, -5.5,  30.5, 1.0),
    vec4(-30.5, -5.5,  30.5, 1.0),
    vec4(-30.5, -5.5, -30.5, 1.0),
    vec4( 30.5, -5.5, -30.5, 1.0)
];
