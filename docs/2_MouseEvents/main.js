

let width  = 800;
let height = 400
let distance = 20

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0,255,0);
  rectMode(CENTER);
}

function draw() {
  
  background(220);strokeWeight(3);

  for(let diameter=100;diameter<=windowHeight;diameter+=100){

    noFill();stroke(0)
    circle(windowWidth/2,windowHeight/2,diameter)
    fill(255);textSize(16);textAlign(LEFT,CENTER);
    text(`${diameter/2}`,windowWidth/2 + diameter/2,windowHeight/2);
  }
  push()
   strokeWeight(1);fill(0)
   text('CLICK ANYWHERE ON THE SCREEN',25,25);
  pop()
  
  if (mouseIsPressed){
    
    
    var distance = sqrt((mouseX-windowWidth/2)**2+(mouseY-windowHeight/2)**2)/3;

    stroke(0);fill(255);textSize(20);textAlign(CENTER,BOTTOM);
      text(round(3*distance),mouseX,mouseY-3*distance)
      point(mouseX,mouseY);
    
    stroke(255,255,255);fill(255,0,0);
      circle(mouseX+2*distance,mouseY,distance);
      circle(mouseX-2*distance,mouseY,distance);
      circle(mouseX,mouseY+2*distance,distance);
      circle(mouseX,mouseY-2*distance,distance);
    
    noFill();
      circle(mouseX,mouseY,distance);
    stroke(255,255,0);
      rect(mouseX,mouseY,6*distance,6*distance)
    
  }else{

    var distance = 100;
    var xc       = windowWidth/2;
    var yc       = windowHeight/2;
    stroke(0);fill(255);textSize(20);textAlign(CENTER,BOTTOM);
      text(round(distance/2),xc,yc-3*distance)
      point(mouseX,mouseY);
    
    stroke(255,255,255);noFill();
      circle(xc+2*distance,yc,distance);
      circle(xc-2*distance,yc,distance);
      circle(xc,           yc+2*distance,distance);
      circle(xc,           yc-2*distance,distance);
    
    noFill();
      circle(xc,yc,distance);
    stroke(255,255,0);
      rect(xc,yc,6*distance,6*distance)

  }
  
}

function windowResized() {

  // fired when window is resized
  resizeCanvas(windowWidth, windowHeight);

};

