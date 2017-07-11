var image;

var render = function () {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    var texture_constants = [document.getElementById("sonicTexture"), document.getElementById("sonicTexture"), document.getElementById("groundTexture")];

    // CAMERA AND MODEL VIEW
    eye = vec3(radius * Math.sin(theta) * Math.cos(phi), radius * Math.sin(theta) * Math.sin(phi), radius * Math.cos(theta));
    look = lookAt(eye, at, up);
    pMatrix = perspective(fovy, aspect, near, far);

    // Rotation  Speed
    xAxis += 0.5; // x axis
    yAxis += 0.5;  // y axis
    zAxis += 0.5;  // z axis

    ///////////////  Render Objects   //////////////////////
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

    // Hero Object
    mvMatrix = mult(look, scalem(hero[2][0], hero[2][1], hero[2][2]));
    mvMatrix = mult(mvMatrix, translate(hero[3]));
    mvMatrix = mult(mvMatrix, rotateX(hxAxis));
    mvMatrix = mult(mvMatrix, rotateY(hyAxis));
    mvMatrix = mult(mvMatrix, rotateZ(hzAxis));

    ////////////////////    AABB    //////////////////////////////
    var aabb_matrix = mat4();
    aabb_matrix = mult(aabb_matrix, scalem(hero[2][0], hero[2][1], hero[2][2]) );
    aabb_matrix = mult(aabb_matrix, translate(hero[3]));
    heroPosition = aabb_spherePosition(hero[0], aabb_matrix );

    if(collitionReady){
        for(var i = 0; i < collisionLocation_sphere.length; i++){
            var results = aabb_sphere_sphere_detection(heroPosition, collisionLocation_sphere[i]);
            if(results){
                collision = results;  // We have detected a collision
                break;
            }
        }
    }

    renderObject(shapeArray[ hero[0] ], hero[1], mvMatrix, pMatrix, 0);

    // // Random Object
    var size = historyArray.length;
    for (var i = 0; i < size; i++) {
        var arr = historyArray[i];
        var id = i;
        var shape = arr[0];
        var flag = arr[1];
        var scaler = arr[2];
        var trans = arr[3];
        var axis = arr[4];

        // False: Use Vertex Shader
        // True: Use Light Shader
        // Flag is passed into the shader as a float
        var flagValue = 0.0;
        if (flag) {
            flagValue = 1.0;
        }
        var texFlag = 0.0;
        if (shape == 0 || shape == 2){
            
            if(image != texture_constants[shape]){
                image = texture_constants[shape];
                configureTexture( image );
            }
            
            texFlag = 1.0;
        }
        
        /////////////////////////////////////////////////////////////////////
        /////////////  MATRIX MULTIPLICATION ///////////////////////////////
        // Look: Resets the position for each object
        mvMatrix = mult(look, scalem(scaler[0], scaler[1], scaler[2]));
        mvMatrix = matrixMult(mvMatrix, scaler, trans, axis);

        ////////////////////    AABB    //////////////////////////////
        var aabb_matrix = mat4();
        aabb_matrix = matrixMult(aabb_matrix, scaler, trans, axis);
        var position = aabb_spherePosition(shape, aabb_matrix );
        collisionLocation_sphere[id] = position;

        renderObject(shapeArray[shape], flagValue, mvMatrix, pMatrix, texFlag);
    }

    /**
     * Turns on collision detection system.
     * We must get each objects location through the initial pass.
     * We will store each objects location in arrays and processs the arrays
     * when we process hereos.  We can add data structures to the arrays if we have a lot of objects
     * @type {boolean}
     */
    collitionReady = true;  // turns on collision detec
    requestAnimFrame(render);
};

function renderObject(indexArray, flagValue, mvMatrix, pMatrix, texValue) {
    // All that work:  Lets Render!
    gl.uniform1f(gl.getUniformLocation(program, "shaderFlag"), flagValue);
    gl.uniform1f(gl.getUniformLocation(program, "textureFlag"), texValue);
    
    gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));
    gl.uniformMatrix4fv(projection, false, flatten(pMatrix));
    gl.drawArrays(gl.TRIANGLES, indexArray[0], indexArray[1]);
}

function configureTexture( image ) {
        texture = gl.createTexture();
        gl.bindTexture( gl.TEXTURE_2D, texture );
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB,
            gl.RGB, gl.UNSIGNED_BYTE, image );
        gl.generateMipmap( gl.TEXTURE_2D );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
            gl.NEAREST_MIPMAP_LINEAR );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

        gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

function matrixMult(matrix, scaler, trans, axis) {
    /**
     * Calculates the matrix for each object
     * this is a sub-function
     *
     * 0:  Pass in the initial matrix
     * 1:  Array int [3] of Scaler
     * 2:  Array vec3  [2] Translation
     * 3:  Array bool [3]:  Rotation for if statement
     *     Speed is not parameter, that is global value
     *     Returns Matrix
     *
     */
    matrix = mult(matrix, scalem(scaler[0], scaler[1], scaler[2]));
    matrix = mult(matrix, translate(movementMatrix));
    matrix = mult(matrix, translate(trans[0]));
    
    if (axis[0])
        matrix = mult(matrix, rotateX(xAxis));
    if (axis[1])
        matrix = mult(matrix, rotateY(yAxis));
    if (axis[2])
        matrix = mult(matrix, rotateZ(zAxis));
    

    return mult(matrix, translate(trans[1]));
}

// Pass a function 'funk' which draws a shape
// Map the starting point and offset to shapes array
function shapeMapper(funk, startIndex) {
    funk();
    var offset = pointsArray.length - startIndex;
    shapeArray.push([startIndex, offset]);
}
