

let elementsArray = [];
let target;
var gui

var kEasing     = 0.1;
var kEasingMax  = 0.15;
var kEasingMin  = 0.05;
var kEasingStep = 0.05;

var nElemnts     = 10;
var nElemntsMax  = 10;
var nElemntsMin  = 1;
var nElemntsStep = 1;

var dEasing     = 1;
var dEasingMax  = 2;
var dEasingMin  = 0;
var dEasingStep = 0.5;


 // gui = createGui('Gravity').setPosition(windowWidth/2,50);
  // gui.addGlobals('g');

function setup() {

  createCanvas(windowWidth, windowHeight);

  target = {x:windowWidth/2,y:windowHeight/2,r:40};
  
  for(i=0;i<nElemnts;i++){
       elementsArray.push( {x:random(windowWidth),y:random(windowHeight),r:15} );
  }; 

  gui = createGui('Chain');
  gui.addGlobals('nElemnts','kEasing','dEasing');

};

function draw() {
  
  background(240);strokeWeight(2);myUtils.drawGrid();

  // TARGET UPDATE
  //////////////////

  var boolX = mouseX < 200;
  var boolY = mouseY < 200;
  if(mouseIsPressed && !boolX && !boolY){

     target.x = mouseX;
     target.y = mouseY;
  };
  stroke(0);circle(target.x,target.y,2*target.r)

  // POINTS UPDATE
  ////////////////////
  var leader = {
    x: target.x,
    y: target.y,
    r: target.r
  };

  noFill();stroke(255,0,0)
  
  // DRAWING LINES AND CIRCLES
  //////////////////////////////

  beginShape();
    for(let i=0;i<nElemnts;i++){
        
        var element_i = elementsArray[i];
        var dx        = leader.x - element_i.x;
        var dy        = leader.y - element_i.y;
        var di        = Math.sqrt(dx**2+dy**2);
        var diBetween = dEasing*(element_i.r + leader.r);

        if(di>diBetween ){
          element_i.x += dx*kEasing;
          element_i.y += dy*kEasing;
        }

        leader.x = element_i.x;
        leader.y = element_i.y;
        leader.r = element_i.r;

        vertex(element_i.x,element_i.y)
        push();stroke(0);circle(element_i.x,element_i.y,2*element_i.r);pop();
    };
  endShape()

  drawPoints()

}

function drawPoints(){

  for(let i=0;i<nElemnts;i++){
       
    var element_i =  elementsArray[i];
    push()
    fill(0);stroke(0);circle(element_i.x,element_i.y,3)
    pop()

  };

}

function windowResized() {
  // resize canvas
  resizeCanvas(windowWidth, windowHeight)

}