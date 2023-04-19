
var xc,yc;
var a,aMin,aMax,aStep;
var b,bMin,bMax,bStep;
var speed,speedMin,speedMax,speedStep;
var gui;

function setup() {
  createCanvas(windowWidth,windowHeight);
  strokeWeight(3);
  angleMode(DEGREES);
  rectMode(CENTER)
  frameRate(30)
  
  speed     = 1;
  speedMin  = 0.5;
  speedMax  = 5;
  speedStep = 0.5;

  aStep = 1;
  bStep = 1;
  aMin  = 60;
  bMin  = 50;
  
  if(windowWidth>windowHeight){
    a     = Math.round(windowWidth/4);
    aMax  = Math.round(windowWidth/2) - 50;
    b     = Math.round(windowHeight/4);
    bMax  = Math.round(windowHeight/2) - 50;
  }else{
    a     = Math.round(windowWidth/4);
    aMax  = Math.round(windowWidth/2) - 50;
    b     = Math.round(windowWidth/8);
    bMax  = Math.round(windowWidth/8) - 50;
  };
  
  gui = createGui('Semi-axis a >= b');
  gui.addGlobals('a','b','speed');

  xc = windowWidth/2;
  yc = windowHeight/2;

  listenSliders()

}

function draw() {
  
  background(255);

  var theta = 90 - speed*frameCount;
  var     e = sqrt(1-(b**2/a**2)); // eccentricity
  var     c = a*e // focal point distance to center
  var    k1 = (cos(theta)**2)/(a**2);
  var    k2 = (sin(theta)**2)/(b**2);
  var     r = 1/sqrt(k1+k2); // r(theta) = p(px,py)
  var    px = xc + r*cos(theta);
  var    py = yc - r*sin(theta);
  var    f1 = xc - c; // f1 x 
  var    f2 = xc + c; // f2 x                       
  var    d1 = sqrt((f1-px)**2 + (py-yc)**2);  // distance p to f1
  var    d2 = sqrt((f2-px)**2 + (py-yc)**2);  // distance p to f2
  var   p1x = xc-a;
  var   p2x = p1x+d1;
  
  //ellipse
  fill(200)
  ellipse(xc, yc, 2*a, 2*b);
  
  // central line distance f1 to p
  push()
    stroke(255,0,0);strokeWeight(3);
    line(p1x,yc,p1x+d1,yc);
  pop()
  
  // central line distance f2 to p
  push()
    stroke(0,255,0);strokeWeight(3);
    line(p2x,yc,p2x+d2,yc);
  pop()
  
  // moving line f1 to p
  push()
    stroke(255,0,0)
    line(f1,yc,px,py);
  pop()
  
  // moving line f2 to p
  push()
    stroke(0,255,0)
    line(f2,yc,px,py);
  pop()
  
  // moving line r(theta) => p
  push()
    line(xc,yc,px,py);
    strokeWeight(12);
    point(xc,yc);
    point(px,py)
    point(f2,yc);
    point(f1,yc);
  pop()
  
  //bounding box, lines and text
  push()
    noFill();strokeWeight(2);
    rect(xc,yc,2*a,2*b);
    textSize(24);fill(0);strokeWeight(0.5);
    textAlign(CENTER,CENTER);
    text('2*a',xc,yc-b-20);
    text('2*b',xc+a+30,yc);
    text('f1',f1,yc+b+20);
    text('f2',f2,yc+b+20);
    text('(x0,y0)',xc,yc+b+20);
    line(xc,yc-b,xc,yc+b);
    line(f1,yc-b,f1,yc+b);
    line(f2,yc-b,f2,yc+b);
  pop()

}

function windowResized() {

    // fired when window is resized
    
    resizeCanvas(windowWidth, windowHeight);
    xc = windowWidth/2;
    yc = windowHeight/2;
    
    //adapt the maximum and minimum values of a and b so that a>b
    if(windowWidth>windowHeight){
        a     = Math.round(windowWidth/4);
        aMax  = Math.round(windowWidth/2) - 50;
        b     = Math.round(windowHeight/4);
        bMax  = Math.round(windowHeight/2) - 50;
      }else{
        a     = Math.round(windowWidth/4);
        aMax  = Math.round(windowWidth/2) - 50;
        b     = Math.round(windowWidth/8);
        bMax  = Math.round(windowWidth/8)- 50;
      };
   

    // update a,b slider value end text
    document.querySelector("#qs_1").value = a;
    document.querySelector("#qs_1").max   = aMax;

    document.querySelector("#qs_2").value = b;
    document.querySelector("#qs_2").max   = bMax;

    document.querySelectorAll("div.qs_label")[0].innerHTML = `<b>a:</b> ${a}`;
    document.querySelectorAll("div.qs_label")[1].innerHTML = `<b>b:</b> ${b}`;
  
  };

  function listenSliders(){

 
    var slider_a = document.querySelector("#qs_1");
    var slider_b = document.querySelector("#qs_2");
        
    slider_a.addEventListener('input',()=>{
        
        slider_a.min = b;
        slider_b.max = a;   
    });
        
    slider_b.addEventListener('input',()=>{

        slider_a.min = b;
        slider_b.max = a; 
    });

  }