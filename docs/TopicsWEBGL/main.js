

var axisLength = 200;
var divPad     = 10;
var dxy        = 20;
var myFont;
var gui;
var angelStep = 10;

var rXStep = angelStep;
var rXMin  = -180;
var rXMax  =  180;
var rX     = 0;

var rYStep = angelStep;
var rYMin  = -180;
var rYMax  =  180;
var rY     = 0;

var rZStep = angelStep;
var rZMin  = -180;
var rZMax  =  180;
var rZ     = 0;

var tZStep = 50;
var tZMin  = -1000;
var tZMax  =  1000;
var tZ     = 0;


function setup() {

    createCanvas(windowWidth,windowHeight, WEBGL);
    angleMode(DEGREES);strokeWeight(5);
    frameRate(5);

    myFont = loadFont('font.otf');
    textFont(myFont);
    fill(255,0,0);textSize(20);
    textAlign(CENTER,CENTER);

    gui = createGui('Rotation Axis').setPosition(divPad,divPad);
    gui.addGlobals('rX','rY','rZ','tZ');


};

function draw(){

    background(200);//orbitControl(10,10);
    strokeWeight(2);

    // Rotations X,Y,Z
    ////////////////////
    rotateX(rX);
    rotateY(rY);
    rotateZ(rZ);
    
    // Translations X,Y,Z
    ////////////////////
    translate(0,0,tZ)
     
    drawReferentSystem();

};


function drawReferentSystem(){

    push()
    
        strokeWeight(3);stroke(0)

        line(-axisLength,0,0, axisLength,0,0);
        line(0,-axisLength,0, 0,axisLength,0);
        line(0,0,-axisLength, 0,0,axisLength);

        stroke(0)
        text('+X',axisLength+dxy,dxy);
        text('+y',dxy,axisLength+dxy);

        translate(0,0,axisLength)
        text('+Z',dxy,-dxy);

    pop();

};

function windowResized() {

    window.location.reload();
    resizeCanvas(windowWidth, windowHeight);
};






