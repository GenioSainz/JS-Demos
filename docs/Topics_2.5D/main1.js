

var focalLength    = 300;
var nObjects = 100;
var nStars   = 200;
var Objects  = [];
var Stars    = [];

function setup() {
  
  createCanvas(windowWidth,windowHeight);rectMode(CENTER)

  // OBJECTS
  ///////////
  for(let i=0;i<nObjects;i++){

    var object = {
                  x:random(-windowWidth/2,windowWidth/2),
                  y:random(-windowHeight/2,windowHeight/2),
                  z:random(1,600),
                  r:25,
                  wh:50,
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

  // line(0,windowHeight/2,windowWidth,windowHeight/2);
  // line(windowWidth/2,0,windowWidth/2,windowHeight);
    
    // draw stars 
    for(let i=0;i<nStars;i++){
        push()
          fill(255,255,0)
          circle(Stars[i].x,Stars[i].y,Stars[i].r);
        pop()
    };
    
    // draw 2.5D Objects
    // sort the objects by z.far the most distant objects are drawn first to avoid overlaps.

    Objects.sort(zSort)
    for(let i=0;i<nObjects;i++){
      
        var object = Objects[i];
        var scalef = focalLength/(object.z+focalLength);

        push()
  
          translate(windowWidth/2,windowHeight/2);
          translate(scalef*object.x,scalef*object.y)
          scale(scalef,scalef);
          rect(0,0,object.wh,object.wh);
          circle(0,0,2*object.r);
          
          object.z-=1

          if(object.z<-focalLength/2){

            object.z = 3*focalLength
          };

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






