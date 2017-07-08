function drawCar() {
    ///////////////  IMPORT CAR   //////////////////////
    /**
     * Takes the car from the HTML file and parses the verticies from blender.
     * Returns a object "carMesh" that has all of the arrays after parsing
     *
     * There are other functions in our third party library which can add the verticies to the
     * buffer.  We should do this manuelly so that the code is not hidden
     *
     * After import.  We are adding the car to our shapes array so it matches the other objects.
     * Shape array requrires and ARRAY of   [START, OFFSet]
     *
     * We still need to make a texture mapper.  Nick can finish the car.
     */
        // Add mesh verticies to our points array
        // Give the car a shape ID
    var objStr = document.getElementById('car.obj').innerHTML;
    carMesh = new OBJ.Mesh(objStr);
    var colorCount =0;
    var start = pointsArray.length;

    for(var i = 0; i < carMesh.vertices.length /3 ; i =i + 3){

        // Create verticies
        var indices_0 = carMesh.indices[i];
        var indices_1 =  carMesh.indices[i + 1];
        var indices_2 =  carMesh.indices[i + 2];

        pointsArray.push( vec4(  carMesh.vertices[indices_0], carMesh.vertices[indices_1], carMesh.vertices[indices_2], 1.0  )  );
        normalsArray.push( vec4(  carMesh.vertexNormals[indices_0], carMesh.vertexNormals[indices_1], carMesh.vertexNormals[indices_2], 1.0  )  );

        //  Temp.  just so something shows up
        colorsArray.push(vertexColors[colorCount]);;
        colorCount  =   ++colorCount % 3;

    }
    var offset = pointsArray.length - start;
    shapeArray.push([start, offset]);

    console.log(carMesh.indices);

    console.log("Shape Array");
    console.log(shapeArray);
}