// this script uses the SINE() function to create oscillating movement 
// between 0 and 1 to draw vertical and horizontal lines on the screen.

let h,w;

function setup() {
   
  w = windowWidth;
  h = windowHeight;
  createCanvas(w,h);


}

function draw() {
  
  background(220);
  
  myUtils.drawGrid({cellSize:50});
   
  var x = 500;
  var y = 500;

  line(0,y,windowWidth,y);
  line(x,0,x,windowHeight)

  translate(x,y);

  rect(50,50,200,100)
  
  scale(0.5);

  translate(50+100,50+50);

  rect(50,50,200,100)
  
  
};


function windowResized() {

  // fired when window is resized
  resizeCanvas(windowWidth, windowHeight);
  w = windowWidth;
  h = windowHeight;

};






