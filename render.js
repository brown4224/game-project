var image;

var render = function () {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    var texture_constants = [document.getElementById("carTexture"), document.getElementById("sonicTexture"), "", document.getElementById("groundTexture"), "", document.getElementById("carTexture")];

    // CAMERA AND MODEL VIEW
    eye = vec3(radius * Math.sin(theta) * Math.cos(phi), radius * Math.sin(theta) * Math.sin(phi), radius * Math.cos(theta));
    look = lookAt(eye, at, up);
    pMatrix = perspective(fovy, aspect, near, far);

    // Rotation  Speed
    var rotationSpeed = 0.5;
    xAxis += rotationSpeed; // x axis
    yAxis += rotationSpeed;  // y axis
    zAxis += rotationSpeed;  // z axis



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
        if (shape == 0 || shape == 1 || shape == 3){

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
        // ID 0 = Ground
        // ID 1+ = Random Objects
        if (id > 0){
            var aabb_matrix = mat4();
            aabb_matrix = matrixMult(aabb_matrix, scaler, trans, axis);
            var position = aabb_spherePosition(aabb_matrix );
            collisionLocation_sphere[id].position = position;
            collisionLocation_sphere[id].orginDistance = distance(position, vec3(0,0,0));


            // If object is close
            if(collisionLocation_sphere[id].orginDistance < isNear ){
                var collision = aabb_sphere_sphere_detection([heroPosition.center, radius], [collisionLocation_sphere[id].position, collisionLocation_sphere[id].radius]);

                if(!collisionLocation_sphere[id].isNear) {
                    nearArray.push(new nearArrayObject(id, "sphere", collisionLocation_sphere));
                    collisionLocation_sphere[id].isNear = true;
                }
                // Freeze an object if it runs into you
                if(collision){
                    trans[0] = subtract(position, movementMatrix) ;
                    trans[1] = vec3(0,0,0);
                    arr[3] = trans;
                }
            }
        }


        renderObject(shapeArray[shape], flagValue, mvMatrix, pMatrix, texFlag);


    }

    // Ramp
    var size = ramps.length;
    for (var i = 0; i < size; i++) {
        var arr = ramps[i];
        var id = i;
        var shape = arr[0];
        var flagValue = arr[1];
        var scaler = arr[2];
        var trans = arr[3];
        var axis = arr[4];

        var texFlag = 0.0;
        if (shape == 0 || shape == 1 || shape == 3){

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
        var ramp_min = aabb_boxPosition_min(aabb_matrix, collisionLocation_ramps[id].corners );
        collisionLocation_ramps[id].min = ramp_min;
        var ramp_max = aabb_boxPosition_max(aabb_matrix, collisionLocation_ramps[id].corners );
        collisionLocation_ramps[id].max = ramp_max;

        var dist = closestCorner(ramp_min, ramp_max);
         collisionLocation_ramps[id].orginDistance = dist;

        if(dist < isNear && !collisionLocation_ramps[id].isNear) {
            nearArray.push(new nearArrayObject(id, "ramp",collisionLocation_ramps ));
            collisionLocation_ramps[id].isNear = true;
        }

        renderObject(shapeArray[shape], flagValue, mvMatrix, pMatrix, texFlag);
    }

    /////////////////////////////////////////////////////////////////////
    /////////////  Projectile  ///////////////////////////////


    for (var i = 0; i < projectileArray.length; i++) {
        // var arr = ramps[i];
        var bullet = projectileArray[i];
        if (!bullet.render)
            continue;

        // Position adjust from movement matrix
        var newPos = vec3(bullet.projectileMovement[0] - movementMatrix[0], bullet.projectileMovement[1] - movementMatrix, bullet.projectileMovement[2] - movementMatrix);

        var shape = bullet.shape;
        var flagValue = true;
        var scaler = bullet.scaler;
        var trans = [bullet.projectileMovement, vec3(0,0,0)];
        var axis = [false,false,false];

        var texFlag = 0.0;
        if (shape == 0 || shape == 2  ){

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
        var position = aabb_spherePosition(aabb_matrix );
        projectileArray[i].position = position;


        // If object is close
        // for(var j=1; j < historyArray.length; j++){
        //     // Need to ray trace or use zones
        //     // Write something more efficent later
        //     var target = collisionLocation_sphere[j];
        //     var results = aabb_sphere_sphere_detection([bullet.position, bullet.radius], [j.position, j.radius]);
        //     if(radius){
        //         // Kill object
        //         collisionLocation_sphere.splice(j, 1);
        //         historyArray.slice(j, 1);
        //         // Kill bullet
        //         clearInterval(bullet.callback);
        //         projectileArray.slice(i, 1);
        //         i--;
        //         continue;
        //     }
        // }

        renderObject(shapeArray[shape], flagValue, mvMatrix, pMatrix, texFlag);
    }
    
    
    // Hero Object (Render last)
    mvMatrix = mult(look, scalem(hero[2][0], hero[2][1], hero[2][2]));
    mvMatrix = mult(mvMatrix, translate(hero[3]));
    mvMatrix = mult(mvMatrix, rotateX(hxAxis));
    mvMatrix = mult(mvMatrix, rotateY(hyAxis));
    mvMatrix = mult(mvMatrix, rotateZ(hzAxis));

    renderObject2(0, hero[1], mvMatrix, pMatrix, 0);


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

// Currently car-only; will break off and add other models later
function renderObject2(indexArray, flagValue, mvMatrix, pMatrix, texValue) {
    gl.uniform1f(gl.getUniformLocation(program, "shaderFlag"), flagValue);
    gl.uniform1f(gl.getUniformLocation(program, "textureFlag"), texValue);
    
    gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));
    gl.uniformMatrix4fv(projection, false, flatten(pMatrix));
    
    
    var objStr = document.getElementById('car.obj').innerHTML;
    carMesh = new OBJ.Mesh(objStr);
    OBJ.initMeshBuffers(gl, carMesh);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, carMesh.vertexBuffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, carMesh.normalBuffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, carMesh.textureBuffer);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, carMesh.indexBuffer);
    gl.drawElements(gl.TRIANGLES, carMesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
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


