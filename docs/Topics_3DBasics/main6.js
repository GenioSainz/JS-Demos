
var rotationSpeed = 0.025
var focalLength   = 300;
var centerZ       = 2000;
var pointsArray   = [];
var xc = 0;
var yc = 0;
var zc = 0;

function setup() {
  
  createCanvas(windowWidth,windowHeight);
  textSize(50);
  textAlign(CENTER,BOTTOM)

  // OBJECTS
  ///////////
  var xp    = 500;
  var yp    = 500;
  var zNear = 100;
  var zFar  = 2*zNear;

	pointsArray[0] = { x: -xp, y: -yp, z: zFar };
	pointsArray[1] = { x:  xp, y: -yp, z: zFar };
	pointsArray[2] = { x:  xp, y: -yp, z: zNear  };
	pointsArray[3] = { x: -xp, y: -yp, z: zNear  };
	pointsArray[4] = { x: -xp, y:  yp, z: zFar };
	pointsArray[5] = { x:  xp, y:  yp, z: zFar };
	pointsArray[6] = { x:  xp, y:  yp, z: zNear  };
	pointsArray[7] = { x: -xp, y:  yp, z: zNear  };

  key_mouse_Events()

};

function draw() {
  
  background(0);
    
    // DRAW OBJECTS => beginShape() works with absoluto coordinates system
    ////////////////
    stroke(255);

    drawPoins(pointsArray);
    drawLines(pointsArray,[0,1,2,3,0])
    drawLines(pointsArray,[4,5,6,7,4])
    drawLines(pointsArray,[0,4])
    drawLines(pointsArray,[1,5])
    drawLines(pointsArray,[2,6])
    drawLines(pointsArray,[3,7])
    
    push()
    fill(255);textSize(30);textAlign(CENTER,CENTER);
    text(`[ ${xc}, ${yc}, ${zc} ]`,windowWidth/2,30)
    pop();
   
};


function drawPoins(array){

    array.forEach( (point,index) =>{

        var scalef = focalLength/(point.z+focalLength);

        push() 

          fill(255)
          translate(windowWidth/2,windowHeight/2);
          scale(scalef,scalef);
          translate(point.x,point.y);
          circle(0,0,10);
          text(`P${index}`,0,0)
          
        pop()
      
    });
};

function drawLines(points,indexs){

    //noFill();
    fill('rgba(255,0,0,0.2)')
    beginShape()

        indexs.forEach( (indx) =>{

            var point  = points[indx]
            var scalef = focalLength/(point.z+focalLength);

            push() 

              fill(255)
              translate(windowWidth/2,windowHeight/2);
              scale(scalef,scalef);
              translate(point.x,point.y);
              var {x_0,y_0} = referentSystem();
            pop()

            vertex(x_0, y_0)
    
        });
        
    endShape()

};

function translatePoints(x,y,z){

      pointsArray.forEach( (point) =>{

          point.x += x;
          point.y += y;
          point.z += z;

      });

}


function project(){

  for(let i=0;i<nObjects;i++){

    var object = Objects[i];
    var scalef = focalLength/(object.z+focalLength);
        object.sx  = object.px * scalef;
        object.sy  = object.py * scalef;
  };

};

function referentSystem(){

  let matrix = drawingContext.getTransform();

  // xnew = a x + c y + e
  // ynew = b x + d y + f

  let x_0 = matrix['e'];
  let y_0 = matrix['f'];

  return {x_0,y_0}

};

function drawLine(array){
  
  fill(255)
  beginShape();
  fill(255)

  for(let i=0;i<array.length;i++){

     var index = array[i];
     var point = Objects[index];
     vertex(point.sx,point.sy);

  };

  endShape(CLOSE);

}

function key_mouse_Events(){

    var deltaXYZ = 50;

    document.addEventListener("keydown", (event) => {

        if(event.code=="ArrowUp"){

          translatePoints(0,-deltaXYZ,0);
          yc+=-deltaXYZ;

        }else if(event.code=="ArrowDown"){
          
          translatePoints(0,deltaXYZ,0)
          yc+=deltaXYZ

        }else if(event.code=="ArrowRight"){

          translatePoints(deltaXYZ,0,0);
          xc+=deltaXYZ

        }else if(event.code=="ArrowLeft"){

          translatePoints(-deltaXYZ,0,0);
          xc+=-deltaXYZ
        };

        if(event.code=="Numpad8"){

          translatePoints(0,0,deltaXYZ);
          zc+=deltaXYZ;
        };
        if(event.code=="Numpad2"){

          translatePoints(0,0,-deltaXYZ);
          zc+=-deltaXYZ;
        };

    });


};


function windowResized() {

  // fired when window is resized
  resizeCanvas(windowWidth, windowHeight);

};

