"use strict";
var canvas;
var program;
var gl;
var shaderFlag;
var textureFlag;
var flag = true;
var debug = false;
var random = 0;

//AABB
var heroPosition;
var collision = false;  // If hero runs into object
var collisionLocation_sphere = [maxObjects];   // An array of objects current location.  Give each object an ID
var collitionReady = false;  // Turn on after first render

// Arrays
var carMesh;
var pointsArray = [];
var normalsArray = [];
var texCoordsArray = [];
var shapeArray = [];  // CUBE, SPHERE, CONE: [START, OFFset]
var historyArray = [];
var hero = [];
var colorsArray = [];

// Movement  and keymapping
var movementMatrix = vec3(0.0, 0.0, 0.0);  // When user moves
var maxSpeed = 0.4;
var defaultSpeed = 0.1;
var speed = defaultSpeed;
var speedOffset =  0;  // Offset for uparrow and down arrow.  Use values form 0 [to 1]
var acceleration = 0.005;  // Use small values
var turnSpeed = 5;   // Measured in Degrees
var  keymap = [];  // Stores callback functions.  Not numbers


// Rotate  Variables
var xAxis = 0; var yAxis = 0; var zAxis = 0;  // Global
var hxAxis = 0; var hyAxis = 0; var hzAxis = 0;  // Hero Rotation


//   Perspective
var near = 0.001;
var far = 30.0;
var radius = 10.0;
var theta = 0;  // Radians
var phi = 0.0;
// var dr = 10.0 * Math.PI / 180.0;
var dr = Math.PI / 180.0;

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

// Texture data from file
var texture;

// Texture Coordinates (simple for now, we can expand latter)
var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
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


    ////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////
    /////////////  DRAW SHAPES   //////////////////////
    // Imported from Cube File
    // Pass Draw Functions into helper function
    shapeMapper(drawCube, pointsArray.length);
    shapeMapper(drawSphere, pointsArray.length);
    shapeMapper(drawCone, pointsArray.length);

    drawCar();
    aabb_INIT();
    renderOrder();
    /////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////


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
    
    ///////////////  TEXTURE BUFFER   //////////////////////
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );
    
    // Turn into array at some point when we have multiple textures
    var image = document.getElementById("sonicTexture");
    configureTexture( image );

    modelView = gl.getUniformLocation(program, "modelView");
    projection = gl.getUniformLocation(program, "projection");
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);
    //
    // ///////////////  APPEND Car to Buffer   //////////////////////
    // var objStr = document.getElementById('car.obj').innerHTML;
    // carMesh = new OBJ.Mesh(objStr);
    // var start = pointsArray.length;
    // OBJ.initMeshBuffers(gl, carMesh);
    //
    //
    // var vPosition = gl.getAttribLocation(program, "vPosition");
    // gl.bindBuffer(gl.ARRAY_BUFFER, carMesh.vertexBuffer);
    // gl.vertexAttribPointer(vPosition, carMesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(vPosition);
    //
    //
    // var vNormal = gl.getAttribLocation(program, "vNormal");
    // gl.bindBuffer(gl.ARRAY_BUFFER, carMesh.normalBuffer);
    // gl.vertexAttribPointer(vNormal, carMesh.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(vNormal);
    //
    // var  colorCount = 0;
    // for(var i = 0; i < carMesh.vertices.length / 3; i++){
    //
    //     //  Temp.  just so something shows up
    //     colorsArray.push(vertexColors[colorCount]);
    //     colorCount  =   ++colorCount % 3;
    // }
    // ///////////////  COLOR BUFFER   //////////////////////
    // var cBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);
    //
    // var vColor = gl.getAttribLocation(program, "vColor");
    // gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(vColor);
    //
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, carMesh.indexBuffer);
    // gl.drawElements(gl.TRIANGLES,  carMesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    //


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

    ///////////////  Buttons   //////////////////////
    ////////////////////////////////////////////////////////////////
    //////////////    Key Mapping   ///////////////////////////
    ////////////////////////////////////////////////////////////////
    var isKeyDown = false;
    keymap = [256];
    for(var i =0; i < keymap.length; i++){
        keymap[i] = false;
    }

    document.onkeyup = keyup;
    document.onkeydown = keydown;
    function keyup(e) {
        e = e || window.event;
        var key = e.which;
        var timer = keymap[key];
        if(timer){
            clearInterval(timer);
            delete keymap[key];
        }
    }

    var keyDownCallBackSpeed = 30;

    function keydown(e) {
        /**
         *
         * You can set the system responsiveness with the 'keyDownCallBackSpeed'
         * This will call the key functions,  it will make the system make more calls and increase the
         * user's speed.
         *
         * You can also adjust the speed of an object with the repeateKeyDown function.
         * This is the callback function but there are speed variables that can be fine tuned.
         *
         * The keyup function removed the callback from the array.  Storing the callback in an array is more effective
         * and prevents the system from thinking all the keys have been released when only one key has been released.
         *
         */

        e = e || window.event;
		e.preventDefault();
        var key = e.which;
        if(!keymap[key]){
            keymap[key] = setInterval(function () {
                repeateKeyDown(key);
            }, keyDownCallBackSpeed);
        } else {
            // Nothing to do
        }
    }

    function repeateKeyDown(key) {

        // Give us accelleration
        if (speed < maxSpeed) {
            speed += acceleration;
        }

        var rotationSpeed = 50 * speed;

        if ( key == 38) {  // up arrow
            upArrow(speedOffset);
        }

        if ( key == 40) {  // down arrow
            downArrow(speedOffset);
        }
        if ( key == 39) {  // right arrow
            rightArrow(turnSpeed);
        }
        if ( key == 37) {  // left arrow
            leftArrow(turnSpeed);
        }



        ////////////////////////////////////////////////////////////////
        //////////////    Arrow Functions   ///////////////////////////
        ////////////////////////////////////////////////////////////////
        function upArrow(speedAdjust) {
            movementMatrix[0] += (speed + speedAdjust) * Math.sin(theta);
            movementMatrix[2] += (speed + speedAdjust)  *  Math.cos(theta);
            // Object Rotation
            hzAxis += rotationSpeed *  Math.sin(theta);
            hxAxis += rotationSpeed *  Math.cos(theta);

        }
        function downArrow(speedAdjust) {
            // Movement
            movementMatrix[0] -= (speed + speedAdjust) * Math.sin(theta);
            movementMatrix[2] -= (speed + speedAdjust)  *  Math.cos(theta);
            // Object Rotation
            hzAxis -= rotationSpeed *  Math.sin(theta);
            hxAxis -= rotationSpeed *  Math.cos(theta);
        }
        function leftArrow(degreeTurn) {
            theta += (dr * degreeTurn);

        }
        function rightArrow(degreeTurn) {
            theta -= (dr * degreeTurn);

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


    // Moved to seperate file:  render.js
    render();
};
