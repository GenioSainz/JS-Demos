
var rotationSpeed = 0.01
var focalLength   = 300;
var centerZ       = 1000;
var spirarR       = 1000;
var nObjects      = 20;
var nStars        = 200;
var Objects       = [];
var Stars         = [];

function setup() {
  
  createCanvas(windowWidth,windowHeight);rectMode(CENTER)

  // OBJECTS
  ///////////
  for(let i=0;i<nObjects;i++){

    var object = {
                  y: 0,
                  angle: i*2*Math.PI/nObjects,
                  x : function() { return 0       + spirarR*Math.cos( this.angle) },
                  z : function() { return centerZ + spirarR*Math.sin( this.angle) },
                  r: 50,
                  wh: 100,
                  };

    Objects.push( object );
  };

  // STARS
  ///////////
  for(let i=0;i<nStars;i++){

    var object = {
                  x:random(windowWidth),
                  y:random(windowHeight),
                  r:3,
                  };

    Stars.push( object );
  }

};

function draw() {
  
  background(0);

    
    // DRAW STARS
    ////////////// 
    for(let i=0;i<nStars;i++){
        push()
          fill(255,255,0)
          circle(Stars[i].x,Stars[i].y,Stars[i].r);
        pop()
    };
    

    // SORT OBJECTS
    ////////////////
    // draw 2.5D Objects sort the objects by z.far the most distant objects are drawn first to avoid overlaps.
    Objects.sort(zSort)
    
    // DRAW OBJECTS
    ////////////////
    for(let i=0;i<nObjects;i++){
      
        var object = Objects[i];
        var scalef = focalLength/(object.z+focalLength);

        push() 
           
          var fillColor = map(object.z,0,2*centerZ,220,40)
          fill(fillColor)
          translate(windowWidth/2,windowHeight/2);
          scale(scalef,scalef);
          translate(object.x,object.y)
          rect(0,0,object.wh,object.wh);
          circle(0,0,2*object.r);

          
          object.angle +=  map(mouseX,0,windowWidth,-rotationSpeed,rotationSpeed);
          object.y      =  map(mouseY,0,windowHeight,-windowHeight/2,windowHeight/2);
          object.x      =  0       + spirarR*Math.cos(object.angle),
          object.z      =  centerZ + spirarR*Math.sin(object.angle),
          //object.y      -= 1;

          // if(object.z<-focalLength/2){

          //   object.z = 3*focalLength
          // };

        pop()
    };
   
};


function zSort(objA,ObjB){

  return ObjB.z-objA.z

}

function windowResized() {

  // fired when window is resized
  resizeCanvas(windowWidth, windowHeight);

};


