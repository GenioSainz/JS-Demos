

var myJoystick1;
var myJoystick2;
var joystickLen
var x0=25
var y0=25

function setup() {

    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);

    joystickLen = windowWidth/6

    myJoystick1 = new Joystick({x0:x0,               y0:y0, joyLen:joystickLen, circleColor:[255,0,0]});
    myJoystick2 = new Joystick({x0:2*x0+joystickLen, y0:y0, joyLen:joystickLen, circleColor:[0,255,0]});
}
  
function draw() {

    background(240);

    strokeWeight(2)
    var centralLine = 50;
    line(windowWidth/2,windowHeight/2-centralLine,windowWidth/2,windowHeight/2+centralLine);
    line(windowWidth/2-centralLine,windowHeight/2,windowWidth/2+centralLine,windowHeight/2);
     
    fill(210)
    circle(windowWidth/2,windowHeight/2,20);
    
    strokeWeight(1)
    myJoystick1.draw();
    
        let [joystickX1,joystickY1] = myJoystick1.draw();
        
        let x1 = map(joystickX1, -1, 1, 0, windowWidth);
        let y1 = map(joystickY1, -1, 1, 0, windowHeight);
        
        line(x1,0,x1,windowHeight);
        line(0,y1,windowWidth,y1);
        
        fill(255,0,0)
        circle(x1,y1,20);

    strokeWeight(1)
    myJoystick2.draw()

        let [joystickX2,joystickY2] = myJoystick2.draw();
            
        let x2 = map(joystickX2, -1, 1, 0, windowWidth);
        let y2 = map(joystickY2, -1, 1, 0, windowHeight);
        
        line(x2,0,x2,windowHeight);
        line(0,y2,windowWidth,y2);
        
        fill(0,255,0)
        circle(x2,y2,20)

}


function windowResized() {

    // fired when window is resized
    resizeCanvas(windowWidth, windowHeight)
  
};