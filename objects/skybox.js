// Skybox
function quad_sky(a, b, c, d, side) {

    // Normal Vector
    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    var normal = vec3(normal);
    
    var clearColor = vec4(1.0, 1.0, 1.0, 1.0);

    //  Push onto array
    pointsArray.push(vertices[a]);
    colorsArray.push(clearColor);
    normalsArray.push(normal);


    pointsArray.push(vertices[b]);
    colorsArray.push(clearColor);
    normalsArray.push(normal);

    
    pointsArray.push(vertices[c]);
    colorsArray.push(clearColor);
    normalsArray.push(normal);


    pointsArray.push(vertices[a]);
    colorsArray.push(clearColor);
    normalsArray.push(normal);


    pointsArray.push(vertices[c]);
    colorsArray.push(clearColor);
    normalsArray.push(normal);


    pointsArray.push(vertices[d]);
    colorsArray.push(clearColor);
    normalsArray.push(normal);

    
    //Hard-coded for now
    
    if(side == 1){ //Right 
        texCoordsArray.push(vec2(0.5, 0.625));
        texCoordsArray.push(vec2(0.5, 0.375)); 
        texCoordsArray.push(vec2(0.25, 0.375));
        
        texCoordsArray.push(vec2(0.5, 0.625));
        texCoordsArray.push(vec2(0.25, 0.375));
        texCoordsArray.push(vec2(0.25, 0.625));
        
        /*
        texCoordsArray.push(texCoord[2]);
        texCoordsArray.push(texCoord[3]); 
        texCoordsArray.push(texCoord[0]);
        
        texCoordsArray.push(texCoord[2]);
        texCoordsArray.push(texCoord[0]);
        texCoordsArray.push(texCoord[1]);
        
        */
    }
    else if(side == 4){ //Top
         
        /////////////
        texCoordsArray.push(vec2(0.25, 0.625));
        texCoordsArray.push(vec2(0.25, 0.875)); 
        texCoordsArray.push(vec2(0.5, 0.875));
        
        texCoordsArray.push(vec2(0.25, 0.625));
        texCoordsArray.push(vec2(0.5, 0.875));
        texCoordsArray.push(vec2(0.5, 0.625));

        
        
    }
    else if(side == 3){ //Left
    
        texCoordsArray.push(vec2(1, 0.625));
        texCoordsArray.push(vec2(1, 0.375)); 
        texCoordsArray.push(vec2(0.75, 0.375));
        
        texCoordsArray.push(vec2(1, 0.625));
        texCoordsArray.push(vec2(0.75, 0.375));
        texCoordsArray.push(vec2(0.75, 0.625));
        
        /*
        texCoordsArray.push(texCoord[2]);
        texCoordsArray.push(texCoord[3]); 
        texCoordsArray.push(texCoord[0]);
        
        texCoordsArray.push(texCoord[2]);
        texCoordsArray.push(texCoord[0]);
        texCoordsArray.push(texCoord[1]);
        */
    }
    else if(side == 0){ //Back
    
        texCoordsArray.push(vec2(0.75, 0.625));
        texCoordsArray.push(vec2(0.75, 0.375)); 
        texCoordsArray.push(vec2(0.5, 0.375));
        
        texCoordsArray.push(vec2(0.75, 0.625));
        texCoordsArray.push(vec2(0.5, 0.375));
        texCoordsArray.push(vec2(0.5, 0.625));
    
    /*
        texCoordsArray.push(texCoord[2]);
        texCoordsArray.push(texCoord[3]); 
        texCoordsArray.push(texCoord[0]);
        
        texCoordsArray.push(texCoord[2]);
        texCoordsArray.push(texCoord[0]);
        texCoordsArray.push(texCoord[1]);
        
        */
    }
    else { //Front
        texCoordsArray.push(vec2(0, 0.375));
        texCoordsArray.push(vec2(0, 0.625)); 
        texCoordsArray.push(vec2(0.25, 0.625));
        
        texCoordsArray.push(vec2(0, 0.375));
        texCoordsArray.push(vec2(0.25, 0.625));
        texCoordsArray.push(vec2(0.25, 0.375));
    }

}

function drawSkybox()
{
    quad_sky( 1, 0, 3, 2, 0); //Back
    quad_sky( 2, 3, 7, 6, 1); //Right
    quad_sky( 6, 5, 1, 2, 4); //Top
    quad_sky( 4, 5, 6, 7, 2); //Front
    quad_sky( 5, 4, 0, 1, 3); //Left

    if(debug){
        console.log("points array: " + pointsArray.length);
        console.log(pointsArray);
    }

}
var vertices_sky = [
    vec4(-30.5, -5.5,  30.5, 1.0),
    vec4(-30.5,  30.5,  30.5, 1.0),
    vec4(30.5,  30.5,  30.5, 1.0),
    vec4(30.5, -5.5,  30.5, 1.0),
    vec4(-30.5, -5.5, -30.5, 1.0),
    vec4(-30.5,  30.5, -30.5, 1.0),
    vec4(30.5,  30.5, -30.5, 1.0),
    vec4( 30.5, -5.5, -30.5, 1.0)
];
