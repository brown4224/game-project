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
var isNear = 4;  // Min distance before we want to compare objects
var nearArray =[];
var heroPosition;
var keydown_move = false;
var collisionObjects = [];  // Array of objects after the collition has occured
var collisionLocation_sphere = [maxObjects];   // An array of objects current location.  Give each object an ID
var collisionLocation_ramps = [];   // An array of objects current location.  Give each object an ID

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
var ramps = [];


// Movement  and keymapping
var movementMatrix = vec3(0.0, 0.0, 0.0);  // When user moves
var maxSpeed = 0.3;
var defaultSpeed = 0.1;
var speed = defaultSpeed;
var acceleration = 0.05;  // Use small values
var turnSpeed = 5;   // Measured in Degrees
var keymap = [];  // Stores callback functions.  Not numbers
var gravity = 0.01; //Constant that is subtracting from Y movementMatrix
var gravity_callback;
var y_speed = 0; //Actual jump speed (increase to start jump or ramp)
var bunny_jump_flag = 0; //Prevents the car from jumping more than once if spacebar is held
var brake_light = 0; //Used for car texture change


// Projectiles
var projectileArray = [];
var projectileSpeed = 10 * defaultSpeed;
var projectileMatrix = [];
var bulletArray = [];

//Sound
var soundArray = [];

// Rotate  Variables
var xAxis = 0; var yAxis = 0; var zAxis = 0;  // Global
var hxAxis = 0; var hyAxis = 0; var hzAxis = 0;  // Hero Rotation


//   Perspective
var near = 0.001;
var showCar = true;
// var nearDefault = 0.001;
// var nearDriverSeat = 2.2;
var far = 30.0;
var radius = 10.0;
var camera_radius = radius;
var theta = 0;  // Radians
var camera_theta = theta;
var phi = 0.0;
var camera_phi = phi;
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


// Night
var isNight = false;
var nightTimer = 200;  //  Timer Callback,  10 Seconds

// Lighting
var lightPosition = vec4(5.0, 0.0, 10.0, 0.0);
var carLightPosition = vec4(-radius * Math.sin(theta), 0.0, -radius * Math.cos(theta), 0.0);  // Points away from car
var ambientColor, diffuseColor, specularColor;


var lightAmbient = vec4(1.0, 1.0, 1.0, 1.0);    // Turn overhead lights on and off:   Night callback functions
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);  // Turn overhead lights on and off:   Night callback functions
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);// Turn overhead lights on and off:   Night callback functions

var materialAmbient = vec4(1.0, 1.0, 1.0, 1.0);
var materialDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
var materialShininess = 100.0;

var carLightAmbient = vec4(0.0, 0.0, 0.0, 1.0);
var carLightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var carLightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

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
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
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

    /* DO NOT CHANGE OREDER*/
    /* DO NOT CHANGE OREDER*/
    shapeMapper(drawCar);
    shapeMapper(drawCube);
    shapeMapper(drawSphere);
    shapeMapper(drawGround);
    shapeMapper(drawRamp);
    shapeMapper(drawSkybox);
    
    // shapeMapper(drawCone);
    /* DO NOT CHANGE OREDER*/
    /* DO NOT CHANGE OREDER*/


    // Pass a function 'funk' which draws a shape
    // Map the starting point and offset to shapes array
    function shapeMapper(funk) {
        var startIndex = pointsArray.length;
        funk();
        var offset = pointsArray.length - startIndex;
        shapeArray.push([startIndex, offset]);
    }

    aabb_INIT();
    renderOrder();
    initDataStructures();

    ////////////////////    HERO     //////////////////////////////
    heroPosition = new heroObj(hero[0]);


    ////////////////////    Sphere Location    //////////////////////////////
    // var aabb_matrix = mat4();
    // aabb_matrix = mult(aabb_matrix, scalem(hero[2][0], hero[2][1], hero[2][2]) );
    // aabb_matrix = mult(aabb_matrix, translate(hero[3]));
    // heroPosition.center = aabb_spherePosition(hero[0], aabb_matrix );



    /////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////
    
    
    ///////////////////// LOAD SOUNDS ///////////////////////////////
    soundArray.push(document.getElementById("laserSound"));
    soundArray.push(document.getElementById("crashSound"));
    soundArray.push(document.getElementById("backgroundSound"));
	soundArray.push(document.getElementById("reverseSound"));
	soundArray.push(document.getElementById("landSound"));

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


    modelView = gl.getUniformLocation(program, "modelView");
    projection = gl.getUniformLocation(program, "projection");
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);


    updateLight();
    updateLightPosition();
    function updateLight() {
        ///////////////  LIGHTING   //////////////////////

        // Global Lighting
        var ambientProduct = mult(lightAmbient, materialAmbient);
        var diffuseProduct = mult(lightDiffuse, materialDiffuse);
        var specularProduct = mult(lightSpecular, materialSpecular);

        gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));


        // Car Lighting
        var carAmbientProduct = mult(carLightAmbient, materialAmbient);
        var carDiffuseProduct = mult(carLightDiffuse, materialDiffuse);
        var carSpecularProduct = mult(carLightSpecular, materialSpecular);

        gl.uniform4fv(gl.getUniformLocation(program, "carAmbientProduct"), flatten(carAmbientProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "carDiffuseProduct"), flatten(carDiffuseProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "carSpecularProduct"), flatten(carSpecularProduct));
    }

    function updateLightPosition() {
        ///////////////  LIGHTING Position   //////////////////////
        gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));
        gl.uniform4fv(gl.getUniformLocation(program, "carLightPosition"), flatten(carLightPosition));

    }


    ////////////////////////////////////////////////////////////////
    //////////////    Night Callbacks   ///////////////////////////
    ////////////////////////////////////////////////////////////////
    

    //var nightCallback;
    var switch_nights = 0; //Switch to light

    setInterval(function () {
        //isNight = !isNight;
        //nightCallback = night();
        night();
    }, 50);



    function night() {
            var dxNight = 1;
            var dxLight = 0.05;
            if(isNight && lightAmbient[0] > 0.1 ){
                dxNight = -1;
                nightTransition(dxLight, dxNight);
            } else if (!isNight && lightAmbient[0] < 1.0){
                nightTransition(dxLight, dxNight);
            }
            switch_nights++;
            if(switch_nights >= nightTimer){
                isNight = !isNight;
                switch_nights = 0;
            }
    }

    

    function nightTransition(dxLight, dxNight) {

        var intensity = lightAmbient[0]  += dxLight * dxNight;

        // Change Main Light source and Background
        lightAmbient = vec4(intensity,intensity,intensity, 1.0);
        lightDiffuse = vec4(intensity,intensity,intensity, 1.0);
        lightSpecular = vec4(intensity,intensity,intensity, 1.0);
        gl.clearColor(intensity,intensity,intensity, 1.0);
        updateLight();
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
        if (key == 38 || key == 40)
            keydown_move = false;
        
        if (key == 32) { //Prevents "bunny-jumping"
            bunny_jump_flag = 0;
        }
        
        if (key == 40) {
            brake_light = 0; //Turn brake light off
			soundArray[3].pause();
        }
        
        if(timer){
            clearInterval(timer);
            delete keymap[key];
        }
    }
    
    
    function car_gravity(){
        
        movementMatrix[1] -= y_speed;
        y_speed -= gravity;
        
        hxAxis -= y_speed * 10;
        
        if(movementMatrix[1] >= 0.0 && y_speed < 0) {
            y_speed = 0;
            movementMatrix[1] = 0;
            hxAxis = 0;
            clearInterval(gravity_callback);
			soundArray[4].play();
        }
    }
    
    
    

    var keyDownCallBackSpeed = 1;

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

        
        if (key == 32 && y_speed == 0.0 && bunny_jump_flag == 0) { //Spacebar - set initial 'jump' speed
            y_speed = 0.15;
            bunny_jump_flag = 1;
            car_gravity();
            
            gravity_callback = setInterval(function () { //Repeatedly calling gravity
                car_gravity();
            }, 1);
        }
		else if (key == 40 && soundArray[3].paused){
			soundArray[3].play();
		}
        else{
        
            if(!keymap[key]){
                keymap[key] = setInterval(function () {
                    repeateKeyDown(key);
                }, keyDownCallBackSpeed);
            } else {
            // Nothing to do
            }
        }

    }

    function repeateKeyDown(key) {
        // Give us accelleration
        if (speed < maxSpeed) {
            speed += acceleration;
        }
        // Calculate futer location on user input
        var futureX =   speed * Math.sin(theta);
        var futureY =   0;
        var futureZ =   speed *  Math.cos(theta);

        var rotationSpeed = 50 * speed;

        // Car Movement & Camera
        if ( key == 38) {  // up arrow
            upArrow();
        }

        if ( key == 40) {  // down arrow
            downArrow();
        }
        if ( key == 39) {  // right arrow
            rightArrow(turnSpeed);
        }
        if ( key == 37) {  // left arrow
            leftArrow(turnSpeed);
        }

        //  Camera Movement
        if (key == 65){  // "a"  Pan Left
            panLeft(turnSpeed);
        }
        if (key == 68){  // "d"  Pan Right
            panRight(turnSpeed);
        }
        if (key == 83){  // "s"  Pan down
            panDown(turnSpeed);
        }
        if (key == 87){  // "w"  Pan up
            panUp(turnSpeed);
        }
        if (key == 67){  // "c"  Center camera behind car
            restCamera();
        }
        if (key == 88){  // "x"  drivers Seat
            driversSeat()
        }
        if ( key == 70){  // 'f' Key
            fire();
        }


        ////////////////////////////////////////////////////////////////
        //////////////    Arrow Functions   ///////////////////////////
        ////////////////////////////////////////////////////////////////

        function upArrow(speedAdjust) {
            keydown_move = true;
            var collision = collisionDetection(futureX, futureY, futureZ);

            if(!collision){
                move(1);
            }
           
        }

        function downArrow(speedAdjust) {
            keydown_move = true;
            var collision = collisionDetection(-futureX, -futureY, -futureZ);
            brake_light = 1;
            
            if(!collision){
                move(-1);
            }
           
        }
        function leftArrow(degreeTurn) {
            if (camera_theta == theta)
                camera_theta  += (dr * degreeTurn);

            theta += (dr * degreeTurn);

            // hyAxis = theta *  Math.PI;
            // hyAxis = -theta * 180 / Math.PI;


        }
        function rightArrow(degreeTurn) {
            if (camera_theta == theta)
                camera_theta  -= (dr * degreeTurn);

            theta -= (dr * degreeTurn);


            // hyAxis = theta *  Math.PI;
            // hyAxis = -theta * 180 / Math.PI;
            // move(-1);


        }

        function move(direction) {
            movementMatrix[0] += direction * futureX;
            movementMatrix[1] += direction * futureY;
            movementMatrix[2] += direction * futureZ;
            /**
             * Object Rotation  - For sphere hero only
             * DO NOT DELETE
             *   hzAxis += direction * rotationSpeed *  Math.sin(theta);
             *   hxAxis += direction * rotationSpeed *  Math.cos(theta);
             *
             */
        }

        function panLeft(degreeTurn) {  // "a"
            camera_theta  -= (dr * degreeTurn);
            // showCar = true;
        }
        function panRight(degreeTurn) {  //  "d"
            camera_theta  += (dr * degreeTurn);
            // showCar = true;
        }
        function panDown(degreeTurn) { // "s"
            camera_phi  -= (dr * degreeTurn);
          camera_theta  -= (dr * degreeTurn);
            // showCar = true;
        }
        function panUp(degreeTurn) {   //  "w"
            camera_phi  += (dr * degreeTurn);
            camera_theta  += (dr * degreeTurn);

            // showCar = true;
        }
        function restCamera() {
            camera_theta = theta;
            camera_phi = phi;
            camera_radius = radius;
            showCar = true;
            // near = nearDefault;
        }
        function driversSeat() {
            camera_radius = 1;
            showCar = false;
            // near = nearDriverSeat;
        }

    }


    function fire() {

        soundArray[0].play();

        projectileArray.push( new bullet(2, projectileArray.length ));
        var b = projectileArray[projectileArray.length -1];
        bulletArray.push(b.id);

    }

    ///////////////  Mouse   //////////////////////
    // var gc = document.getElementById("gl-canvas");
    //
    // /**
    //  * This function move the "At" part of look at.
    //  * The eye remains unchanged
    //  */
    // gc.addEventListener("mousemove", function (event) {
    //     // Do stuff
    // });
    //
    // gc.addEventListener("mouseclick", function (event) {
    //     // Do stuff
    // });

    //Plays music
    soundArray[2].volume = 0.2;
    soundArray[2].play();
    
    
    render();
};
