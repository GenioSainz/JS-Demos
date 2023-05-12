
var point;
var target;
var tStart;
var time;
var tmax = 3000;

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
              r: 20
              };
    tStart = new Date();
};

function draw() {
  
  background(240);strokeWeight(2);myUtils.drawGrid();
   
  var time = new Date()-tStart;


  fill(255,0,0)
  circle(target.x,target.y,2*target.r)


  fill(0,255,0)
  if(time<tmax){
    //var x = smooth1(time,point.x,target.x,tmax);
    //var y = smooth1(time,point.y,target.y,tmax);
    var x = tweenFunctions.easeOutElastic(time,point.x,target.x,tmax);
    var y = tweenFunctions.easeOutElastic(time,point.y,target.y,tmax);

    circle(x,y,2*point.r);
  }else{
    circle(target.x,target.y,2*point.r);
  };


};


function smooth1(time,x0,x1,duration){

  var normt = time/duration;
  //var normx = 3*normt**2 -2*normt**3;
  var normx =  6*normt**5-15*normt**4+10*normt**3
  
  return x0 + (x1-x0)*normx
};



function windowResized() {
  // resize canvas
  resizeCanvas(windowWidth, windowHeight)

}