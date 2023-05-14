
var point;
var target;
var tStart;
var time;
var tmax = 3000;
var x,y,alpha,radius

function setup() {

  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

    point = {
            x: random(windowWidth),
            y: random(windowHeight),
            r: 10
            };

    target = {
              x: windowWidth/2,
              y: windowHeight/2,
              r: 50
              };
    tStart = new Date();
};

function draw() {
  
    background(240);strokeWeight(2);myUtils.drawGrid();
    
    var time = new Date()-tStart;

    fill(255,0,0)
    circle(target.x,target.y,2*target.r)
    
    if(time<tmax){
      x      = smoothTween(time,point.x,target.x,tmax);
      y      = smoothTween(time,point.y,target.y,tmax);
      alpha  = smoothTween(time,1,0.1,tmax);
      radius = smoothTween(time,point.r,target.r,tmax);
      fill(`rgba(0,255,0,${alpha})`);
      circle(x,y,2*radius);

    }else{

      fill(`rgba(0,255,0,${alpha})`)
      circle(target.x,target.y,2*radius);
  };

};


function smoothTween(time,x0,x1,duration){

  var normt = time/duration;
  var normx =  6*normt**5-15*normt**4+10*normt**3
  return x0 + (x1-x0)*normx
};



function windowResized() {
  // resize canvas
  resizeCanvas(windowWidth, windowHeight)

}