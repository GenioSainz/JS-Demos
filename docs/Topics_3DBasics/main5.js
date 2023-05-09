

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
  for(let i=0;i<nObjects;i++){


    var ymax = 4000;

    var object = {
                  y:  ymax/2 - i*ymax/nObjects + Math.random() * 100,
                  angle: i*0.2,
                  spiralR: 1000,
                  x : function() { return 0       + this.spiralR*Math.cos( this.angle) },
                  z : function() { return centerZ + this.spiralR*Math.sin( this.angle) },
                  r:  50,
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
          var scalef = focalLength/(object.z+focalLength);

          push() 
            
            fill(255)
            translate(windowWidth/2,windowHeight/2);
            scale(scalef,scalef);
            translate(object.x,object.y);
            circle(0,0,50);
             
            object.angle +=  map(mouseX,0,windowWidth,-rotationSpeed,rotationSpeed);
            object.x      =  0       + object.spiralR*Math.cos(object.angle);
            object.z      =  centerZ + object.spiralR*Math.sin(object.angle);
            var {x_0,y_0} = referentSystem();

          pop()
            
          vertex(x_0, y_0)
          
      };

    endShape()
   
};

function referentSystem(){

  let matrix = drawingContext.getTransform();

  // xnew = a x + c y + e
  // ynew = b x + d y + f

  let x_0 = matrix['e'];
  let y_0 = matrix['f'];

  return {x_0,y_0}
}

function zSort(objA,ObjB){

  return ObjB.z-objA.z

}

function windowResized() {

  // fired when window is resized
  resizeCanvas(windowWidth, windowHeight);

};

