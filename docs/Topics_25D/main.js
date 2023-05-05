

var focal    = 300;
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
                  x:random(-windowWidth/2,windowWidth/2),
                  y:random(-windowHeight/2,windowHeight/2),
                  r:5,
                  };

    Stars.push( object );
  }

};

function draw() {
  
  background(0);

  // line(0,windowHeight/2,windowWidth,windowHeight/2);
  // line(windowWidth/2,0,windowWidth/2,windowHeight);

    for(let i=0;i<nStars;i++){
        push()
          translate(windowWidth/2,windowHeight/2)
          circle(Stars[i].x,Stars[i].y,Stars[i].r);
        pop()
    };

    for(let i=0;i<nObjects;i++){
      
        var object = Objects[i];
        push()

          translate(windowWidth/2,windowHeight/2);
          var scalef = focal/(object.z+focal);
          scale(scalef,scalef);
          rect(scalef*object.x,scalef*object.y,object.wh,object.wh);
          circle(scalef*object.x,scalef*object.y,2*object.r);
          
          object.z+=1

          if(object.z>600){

            object.z = -300
          };

        pop()
    };
   
};


function windowResized() {

  // fired when window is resized
  resizeCanvas(windowWidth, windowHeight);

};






