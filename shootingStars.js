"use strict";

var canvas;
var gl;

var numVertices  = 24;
var maxNumParticles = 1000;
var initialNumParticles = 25;
var initialPointSize = 5;
var initialSpeed = 1.0;
var numColors = 8;

var program;

var time = 0;
var dt = 1;

var numParticles = initialNumParticles;
var pointSize = initialPointSize;
var speed = initialSpeed;
var gravity = false;
var elastic = false;
var repulsion = false;
var coef = 1.0;


var pointsArray = [];
var colorsArray =[];

var projectionMatrix, modelViewMatrix;
var eye;
var at;
var up;

var cBufferId, vBufferId;

var vertices = [

    vec4(-1.1, -1.1,  1.1, 1.0 ),
    vec4( -1.1,  1.1,  1.1, 1.0 ),
    vec4( 1.1,  1.1,  1.1, 1.0 ),
    vec4( 1.1, -1.1,  1.1, 1.0 ),
    vec4( -1.1, -1.1, -1.1, 1.0 ),
    vec4( -1.1,  1.1, -1.1, 1.0 ),
    vec4( 1.1,  1.1, -1.1, 1.0 ),
    vec4( 1.1, -1.1, -1.1, 1.0)
];

var vertexColors = [

    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];

function particle(){

    var p = {};
    p.color = vec4(0, 0, 0, 1);
    p.position = vec4(0, 0, 0, 1);
    p.velocity = vec4(0, 0, 0, 0);
    p.mass = 1;

    return p;
}

 var particleSystem = [];

for(var i = 0; i< maxNumParticles; i++) particleSystem.push(particle());


var d2 = []
for(var i=0; i<maxNumParticles; i++) d2[i] =  new Float32Array(maxNumParticles);

var bufferId;

function quad(a, b, c, d) {
     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[0]);
     pointsArray.push(vertices[b]);
     colorsArray.push(vertexColors[0]);
     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[0]);
     pointsArray.push(vertices[d]);
     colorsArray.push(vertexColors[0]);
}


function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

//Canvas dimensions
var W = 512; var H = 512;

//Lets create an array of particles
var particles = [];
for(var i = 0; i < 50; i++)
{
	//This will add 50 particles to the array with random positions
	particles.push(new create_particle());
}

//Lets create a function which will help us to create multiple particles
function create_particle()
{
	//Random position on the canvas
	this.x = Math.random()*W;
	this.y = Math.random()*H;
	
	//Lets add random velocity to each particle
	this.vx = Math.random()*20-10;
	this.vy = Math.random()*20-10;
	
	//Random colors
	var r = Math.random()*255>>0;
	var g = Math.random()*255>>0;
	var b = Math.random()*255>>0;
	this.color = "rgba("+r+", "+g+", "+b+", 0.5)";
	
	//Random size
	this.radius = Math.random()*20+20;
}

var x = 100; var y = 100;

//Lets animate the particle
function draw()
{
	//Moving this BG paint code insde draw() will help remove the trail
	//of the particle
	//Lets paint the canvas black
	//But the BG paint shouldn't blend with the previous frame
	ctx.globalCompositeOperation = "source-over";
	//Lets reduce the opacity of the BG paint to give the final touch
	ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
	ctx.fillRect(0, 0, W, H);
	
	//Lets blend the particle with the BG
	ctx.globalCompositeOperation = "lighter";
	
	//Lets draw particles from the array now
	for(var t = 0; t < particles.length; t++)
	{
		var p = particles[t];
		
		ctx.beginPath();
		
		//Time for some colors
		var gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
		gradient.addColorStop(0, "white");
		gradient.addColorStop(0.4, "white");
		gradient.addColorStop(0.4, p.color);
		gradient.addColorStop(1, "black");
		
		ctx.fillStyle = gradient;
		ctx.arc(p.x, p.y, p.radius, Math.PI*2, false);
		ctx.fill();
		
		//Lets use the velocity now
		p.x += p.vx;
		p.y += p.vy;
		
		//To prevent the balls from moving out of the canvas
		if(p.x < -50) p.x = W+50;
		if(p.y < -50) p.y = H+50;
		if(p.x > W+50) p.x = -50;
		if(p.y > H+50) p.y = -50;
	}
}


window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

	var ctx = canvas.getContext("2d");

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );


    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );

    gl.useProgram( program );

    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );


    gl.clearColor( 0.5, 0.5, 0.5, 1.0 );

    eye =  vec3(1.5, 1.0, 1.0);
    at = vec3(0.0, 0.0, 0.0);
    up = vec3(0.0, 1.0, 0.0);

    modelViewMatrix = lookAt(eye, at, up);
    projectionMatrix = ortho(-2.0,2.0,-2.0,2.0,-4.0,4.0);

    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix" ), false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix" ), false, flatten(projectionMatrix) );

    gl.uniform1f(gl.getUniformLocation(program, "pointSize"), pointSize);

    cBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, 16*(maxNumParticles+numVertices), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    vBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, 16*(maxNumParticles+numVertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    gl.uniform1f(gl.getUniformLocation(program, "pointSize"), pointSize);

    //simulation();

	setInterval(draw, 33);
}


//Lets create a simple particle system in HTML5 canvas and JS

//Initializing the canvas
//var canvas = document.getElementById("gl-canvas");
//var ctx = canvas.getContext("2d");

//Canvas dimensions
//var W = 1500; var H = 1500;

