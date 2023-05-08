

var rotationSpeed = 0.025
var focalLength   = 300;
var centerZ       = 2000;
var nObjects      = 200;
var nStars        = 200;
var Objects       = [];
var Stars         = [];
var canvas,context;

function setup() {
  
  createCanvas(windowWidth,windowHeight);rectMode(CENTER)

  // OBJECTS
  ///////////
	Objects[0] = { x: -500, y: -500, z: 1000 };
	Objects[1] = { x:  500, y: -500, z: 1000 };
	Objects[2] = { x:  500, y: -500, z: 500  };
	Objects[3] = { x: -500, y: -500, z: 500  };
	Objects[4] = { x: -500, y:  500, z: 1000 };
	Objects[5] = { x:  500, y:  500, z: 1000 };
	Objects[6] = { x:  500, y:  500, z: 500  };
	Objects[7] = { x: -500, y:  500, z: 500  };

  // STARS
  ///////////
  for(let i=0;i<nStars;i++){

    var object = {
                  x:random(windowWidth),
                  y:random(windowHeight),
                  r:3,
                  };

    Stars.push( object );
  };


};

function draw() {
  
  background(0);
    
    // DRAW STARS
    ////////////// 
    for(let i=0;i<nStars;i++){
        push()
          fill(255)
          circle(Stars[i].x,Stars[i].y,Stars[i].r);
        pop()
    };
    

    // SORT OBJECTS
    ////////////////
    // draw 2.5D Objects sort the objects by z.far the most distant objects are drawn first to avoid overlaps.
    //Objects.sort(zSort)
    
    // DRAW OBJECTS => beginShape() works with absoluto coordinates system
    ////////////////
    noFill();stroke(255)

    beginShape()

      for(let i=0;i<nObjects;i++){
        
          var object = Objects[i];
          project();

          push() 

            fill(255)
            translate(windowWidth/2,windowHeight/2);
            scale(scalef,scalef);
            translate(object.x,object.y);
            circle(0,0,50);
             

            var {x_0,y_0} = newReferentSystem();
            
          pop()
   
          vertex(x_0, y_0)
          
      };

    endShape()
   
};


function project(){

  for(let i=0;i<nObjects;i++){

    var object = Objects[i];
    var scalef = focalLength/(object.z+focalLength);
        object.sx  = object.px * scalef;
        object.sy  = object.py * scalef;
  };

};

function newReferentSystem(){

  let matrix = drawingContext.getTransform();

  // xnew = a x + c y + e
  // ynew = b x + d y + f

  let x_0 = matrix['e'];
  let y_0 = matrix['f'];

  return {x_0,y_0}
};

function drawLine(array){

  beginShape();

  for(let i=0;i<array.length;i++){

     var index = array[i];
     var point = Objects[index];
     vertex(point.sx,point.sy);

  };

  endShape();


}


function zSort(objA,ObjB){

  return ObjB.z-objA.z

};

function windowResized() {

  // fired when window is resized
  resizeCanvas(windowWidth, windowHeight);

};

