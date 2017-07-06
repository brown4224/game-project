var s_verticalPosition = [];
var s_latitudeBands = 30;
var s_longitudeBands = 30;
var s_radius = 0.5;
var s_color = 0;

function drawSphere() {

    // Set AABB points
    aabbSphere = s_radius;

// Generate Points
    for(var latNumber = 0; latNumber <= s_latitudeBands; latNumber++){
        var s_theta = latNumber * Math.PI / s_latitudeBands;
        var sinTheta = Math.sin(s_theta);
        var cosTheta = Math.cos(s_theta);

        for(var longNumber = 0; longNumber <= s_longitudeBands; longNumber++){
            var s_phi = longNumber * 2 * Math.PI / s_longitudeBands;
            var sinPhi = Math.sin(s_phi);
            var cosPhi = Math.cos(s_phi);

            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinTheta * sinPhi;

            s_verticalPosition.push([s_radius * x, s_radius * y, s_radius * z, 1.0]);
        }
    }

// Generate Indices
    var indexData = [];
    for (var latNumber = 0; latNumber < s_latitudeBands; latNumber++) {
        for (var longNumber = 0; longNumber < s_longitudeBands; longNumber++) {
            var first = (latNumber * (s_longitudeBands + 1)) + longNumber;
            var second = first + s_longitudeBands + 1;

            /**
             *
             * Pattern uses triangles to make square
             * abc  // First triangle
             * bdb  // Second triangle
             *
             * a = first
             * b = first++
             * c = second
             * d = second ++
             */

            var a = s_verticalPosition[first];
            var b = s_verticalPosition[first + 1];
            var c = s_verticalPosition[second];
            var d = s_verticalPosition[second + 1];

            // Normal Vector
            var t1 = subtract(b,a);
            var t2 = subtract(c,b);
            var normal = cross(t1, t2);
            var normal = vec3(normal);

            // First Triangle
            pointsArray.push(a);
            pointsArray.push(c);
            pointsArray.push(b);

            normalsArray.push(normal);
            normalsArray.push(normal);
            normalsArray.push(normal);

            sphereColor();
            sphereColor();
            sphereColor();

            // Second Triangle
            pointsArray.push(c);
            pointsArray.push(d);
            pointsArray.push(b);

            normalsArray.push(normal);
            normalsArray.push(normal);
            normalsArray.push(normal);

            sphereColor();
            sphereColor();
            sphereColor();
        }
    }

    function sphereColor() {
        colorsArray.push(vertexColors[s_color]);
        s_color = ++s_color % 3;
    }

    if(debug){
        console.log("verticalPosition: " + s_verticalPosition.length);
        console.log(s_verticalPosition);
        console.log("points array: " + pointsArray.length);
        console.log(pointsArray);
    }

}
