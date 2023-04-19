

var myJoystick1;
var myJoystick2;
var myJoystick3;
var joyLen
var x0=50
var y0=50

function setup() {

    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);

    joyLen = 200

    myJoystick1 = new Joystick( {x0: x0,            y0: y0, joyLen: joyLen, joystickX:-0.700, joystickY:+0.800, drawCircle:true, color:[0,255,0]});
    myJoystick2 = new Joystick( {x0: 2*x0+1*joyLen, y0: y0, joyLen: joyLen, joystickX:-0.300, joystickY:-0.800, drawCircle:false,color:[255,0,0]});
    myJoystick3 = new Joystick( {x0: 3*x0+2*joyLen, y0: y0, joyLen: joyLen, joystickX:+0.600, joystickY:+0.100, drawCircle:false,color:[255,255,0]});

}

function draw() {

    background(220);textAlign(CENTER,CENTER);

    myUtils.drawGrid();

    let [joystickX1,joystickY1] = myJoystick1.draw();
    let [joystickX2,joystickY2] = myJoystick2.draw();
    let [joystickX3,joystickY3] = myJoystick3.draw();
    
    var Kv = 200;
    var Ka = 200;
    var px = map(joystickX1,-1,1,0,windowWidth);
    var py = map(joystickY1,-1,1,0,windowHeight);
    var vx = map(joystickX2,-1,1,-Kv,Kv);
    var vy = map(joystickY2,-1,1,-Kv,Kv);
    var ax = map(joystickX3,-1,1,-Ka,Ka);
    var ay = map(joystickY3,-1,1,-Ka,Ka);
    
    textSize(20)
    fill(0,255,0);   text(`p0(${round(px)},${round(py)})`,myJoystick1.xMed,myJoystick1.yMax+20);
    fill(255,0,0);   text(`v0(${round(vx)},${round(vy)})`,myJoystick2.xMed,myJoystick2.yMax+20);
    fill(255,255,0); text(` a(${round(ax)},${round(ay)})`,myJoystick3.xMed,myJoystick3.yMax+20);


    var p = createVector(px,py);
    var v = createVector(vx,vy);
    var a = createVector(ax,ay);
    var P = [p];

    for(let i = 0;i<5;i++){
         
        push()
            stroke(0,255,0);fill(0);textSize(16)

            text(`p${i}`,p.x-10,p.y)

            var pos1 = [p.x,p.y];
            var pos2 = [p.x+v.x,p.y+v.y]; 
            myUtils.drawArrow(pos1,pos2,{color:[255,0,0],arrowHead:0.05});
            stroke(255,0,0);text(`v${i}`,(pos1[0]+pos2[0])/2,(pos1[1]+pos2[1])/2)
            
            p = p5.Vector.add(v,p);
            v = p5.Vector.add(v,a);
            
            var vel1 = [P[i].x,P[i].y];
            var vel2 = [v.x+P[i].x,v.y+P[i].y];
            myUtils.drawArrow(vel1,vel2,{color:[0,0,0],arrowHead:0.05});
            stroke(0,0,0);text(`v${i+1}`,(vel1[0]+vel2[0])/2,(vel1[1]+vel2[1])/2)
            
            var ace1 = [p.x,p.y];
            var ace2 = [p.x+a.x,p.y+a.y];
            myUtils.drawArrow(ace1,ace2,{color:[255,255,0],arrowHead:0.05});
            stroke(255,255,0);text(`a`,(ace1[0]+ace2[0])/2,(ace1[1]+ace2[1])/2)

            P.push(p);

        pop()

    }
};

function windowResized(){

resizeCanvas(windowWidth, windowHeight)

}
