"use strict";
var canvas;
var program;
var gl;
var shaderFlag;
var flag = true;
var debug = false;
var random = 0;

// Arrays
var pointsArray = [];
var normalsArray = [];
var shapeArray = [];  // CUBE, SPHERE, CONE: [START, OFFset]
var historyArray = [];
var hero = [];
var colorsArray = [];

// Movement
var movementMatrix = vec3(0.0, 0.0, 0.0);  // When user moves

// Rotate  Variables
var xAxis = 0; var yAxis = 0; var zAxis = 0;  // Global
var hxAxis = 0; var hyAxis = 0; var hzAxis = 0;  // Hero Rotation


//   Perspective
var near = 0.001;
var far = 30.0;
var radius = 5.0;
var theta = 0;  // Radians
var phi = 0.0;
var dr = 10.0 * Math.PI / 180.0;

// Aspect Ratio
var fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var aspect;       // Viewport aspect ratio

// Model View
var mvMatrix;
var pMatrix;
var modelView;
var projection;

// Eye
var look;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

// Lighting
var ambientColor, diffuseColor, specularColor;

// Lighting Color
var red = 1.0;
var green = 1.0;
var blue = 1.0;

var lightPosition = vec4(5.0, 0.0, 10.0, 0.0);
var lightAmbient;
var lightDiffuse;
var lightSpecular;

var materialAmbient = vec4(1.0, 1.0, 1.0, 1.0);
var materialDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
var materialShininess = 100.0;

// Color
var vertexColors = [
    vec4(0.0, 0.0, 0.0, 1.0),  // black
    vec4(1.0, 0.0, 0.0, 1.0),  // red
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(0.0, 1.0, 0.0, 1.0),  // green
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(1.0, 0.0, 1.0, 1.0),  // magenta
    vec4(0.0, 1.0, 1.0, 1.0),  // cyan
    vec4(1.0, 1.0, 1.0, 1.0)  // white
];

window.onload = function init() {

    ///////////////  INIT PROGRAM   //////////////////////
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.9, 0.9, 0.9, 1.0);
    gl.enable(gl.DEPTH_TEST);

    program = initShaders(gl, "light-shader", "fragment-shader");
    gl.useProgram(program);
    aspect = canvas.width / canvas.height;


    //////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////  DRAW SHAPES   //////////////////////
    // Imported from Cube File
    // Pass Draw Functions into helper function
    shapeMapper(drawCube, pointsArray.length);
    shapeMapper(drawSphere, pointsArray.length);
    shapeMapper(drawCone, pointsArray.length);
    /////////////////  PREPARE FOR RENDERING   //////////////////////
    renderOrder();
    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////


    ///////////////  COLOR BUFFER   //////////////////////
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    ///////////////  NORMAL VECTORS BUFFER   ///////////////
    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    ///////////////  VERTEX BUFFER   //////////////////////
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    modelView = gl.getUniformLocation(program, "modelView");
    projection = gl.getUniformLocation(program, "projection");
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);


    updateLight();
    updateLightPosition();
    function updateLight() {
        ///////////////  LIGHTING   //////////////////////
        lightAmbient = vec4(red, green, blue, 1.0);
        lightDiffuse = vec4(red, green, blue, 1.0);
        lightSpecular = vec4(red, green, blue, 1.0);

        var ambientProduct = mult(lightAmbient, materialAmbient);
        var diffuseProduct = mult(lightDiffuse, materialDiffuse);
        var specularProduct = mult(lightSpecular, materialSpecular);

        gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));
    }

    function updateLightPosition() {
        ///////////////  LIGHTING Position   //////////////////////
        gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));

    }

    ///////////////  Buttons   //////////////////////
    document.onkeydown = keydown;
    function keydown(e) {

        var speed = 0.3;
        var rspeed =50 * speed;

        e = e || window.event;

        if (e.keyCode == '38') {  // up arrow
            // Movement
            movementMatrix[0] += speed * Math.sin(theta);
            movementMatrix[2] += speed *  Math.cos(theta);
            // Object Rotation
            hzAxis += rspeed *  Math.sin(theta);
            hxAxis += rspeed *  Math.cos(theta);
        }
        else if (e.keyCode == '40') {  // down arrow
            // Movement
            movementMatrix[0] -= speed * Math.sin(theta);
            movementMatrix[2] -= speed *  Math.cos(theta);
            // Object Rotation
            hzAxis -= rspeed *  Math.sin(theta);
            hxAxis -= rspeed *  Math.cos(theta);
        }
        else if (e.keyCode == '37') {  // left arrow
            theta += dr;
        }
        else if (e.keyCode == '39') {  // right arrow
            theta -= dr;
        }
    }


    ///////////////  Mouse   //////////////////////
    var gc = document.getElementById("gl-canvas");

    /**
     * This function move the "At" part of look at.
     * The eye remains unchanged
     */
    gc.addEventListener("mousemove", function (event) {
        // Do stuff
    });

    gc.addEventListener("mouseclick", function (event) {
        // Do stuff
    });



    render();
};


var render = function () {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

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
    letsRender(hero[0], hero[1], mvMatrix, pMatrix);


    // // Random Object
    var size = historyArray.length;
    for (var i = 0; i < size; i++) {
        var arr = historyArray[i];
        renderObject(arr[0], arr[1], arr[2], arr[3], arr[4]);
    }


    requestAnimFrame(render);
};

function renderObject(indexArray, flag, scaler, trans, axis) {
    // False: Use Vertex Shader
    // True: Use Light Shader
    // Flag is passed into the shader as a float
    var flagValue = 0.0;
    if (flag) {
        flagValue = 1.0;
    }
    /////////////////////////////////////////////////////////////////////
    /////////////  MATRIX MULTIPLICATION ///////////////////////////////
    // Look, Scale, Translate
    // Look: Resets the position for each object
    mvMatrix = mult(look, scalem(scaler[0], scaler[1], scaler[2]));
    mvMatrix = mult(mvMatrix, translate(movementMatrix));
    mvMatrix = mult(mvMatrix, translate(trans[0]));
    if (axis[0])
        mvMatrix = mult(mvMatrix, rotateX(xAxis));
    if (axis[1])
        mvMatrix = mult(mvMatrix, rotateY(yAxis));
    if (axis[2])
        mvMatrix = mult(mvMatrix, rotateZ(zAxis));

    mvMatrix = mult(mvMatrix, translate(trans[1]));
    letsRender(indexArray, flagValue, mvMatrix, pMatrix);

    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
}

function letsRender(indexArray, flagValue, mvMatrix, pMatrix) {
    // All that work:  Lets Render!
    gl.uniform1f(gl.getUniformLocation(program, "shaderFlag"), flagValue);
    gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));
    gl.uniformMatrix4fv(projection, false, flatten(pMatrix));
    gl.drawArrays(gl.TRIANGLES, indexArray[0], indexArray[1]);
}

// Pass a function 'funk' which draws a shape
// Map the starting point and offset to shapes array
function shapeMapper(funk, startIndex) {
    funk();
    var offset = pointsArray.length - startIndex;
    shapeArray.push([startIndex, offset]);
}
