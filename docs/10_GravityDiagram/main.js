

// MAIN VARIABLES
///////////////////
var joyLen,gui,myJoystick;
var planet_x,planet_y;
var gui,planet,sun;
var sun_r    = 25;
var planet_r = 15;
var joyLen   = 250;

var x0 = 50;
var y0 = 50;

// GUI VARIABLES
//////////////////
var nIterations     = 5;
var nIterationsMin  = 0;
var nIterationsMax  = 20;
var nIterationsStep = 1;

var massRatio     = 5000000;
var massRatioMin  = 1000;
var massRatioMax  = 10000000;
var massRatioStep = 500;

var drawMode = ['Vector Diagram','Show Trajectory'];

function setup() {
    
    // INIT CANVAS AND GUI
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    frameRate(30);
    gui = createGui('Controls').setPosition(x0+50 + joyLen,y0);
    gui.addGlobals('nIterations','massRatio','drawMode');
     
    // INIT JOYSTICK
    myJoystick  = new Joystick( {x0:x0, y0: y0, joyLen: joyLen, joystickX:-0.65, joystickY:0, drawCircle:false,color:[0,0,255], fillValue:230,fillText:255});

    // INIT SUN AND PLANET COORDINATES
    sun         = createVector(windowWidth/2,windowHeight/2);
    planet_x    = sun.x;
    planet_y    = sun.y-250;

};

function draw() {

    background(10);textAlign(CENTER,CENTER);textStyle(BOLD);
    
    myUtils.drawGrid({fillText:255, cellSize:100});

    // SCALE JOYSTICK  x[-1,1] y[-1,1] TO Vx,Vy
    ///////////////////////////////////////////////
    let [joystickX,joystickY] = myJoystick.draw();
    
    var Kv = 200;
    var vx = map(joystickX,-1,1,-Kv,Kv);
    var vy = map(joystickY,-1,1,-Kv,Kv);
    
    textSize(18);textStyle(BOLD);fill(0,0,255)
    push();strokeWeight(3);stroke(255);fill(0,0,255);text(`v0( ${round(vx)} , ${round(vy)} )`,myJoystick.xMed,myJoystick.yMax+20);pop()

    
    push()
        
        // DRAW SUN-BUFFERS DISTANCE AND DETECT SUN POSITION WITH (mouseX,mouseY)
        ///////////////////////////////////////////////////////////////////////////
        textSize(12);fill(255,255,0);circle(sun.x,sun.y,2*sun_r);fill(0);noStroke();text('M1',sun.x,sun.y);
   
        var boolX = mouseX >= sun.x-sun_r && mouseX <= sun.x+sun_r;
        var boolY = mouseY >= sun.y-sun_r && mouseY <= sun.y+sun_r;
        if( mouseIsPressed && ( boolX && boolY )){
            sun.x = mouseX;
            sun.y = mouseY;
        };
    
        for(let r=50; r<=400;r+=50){
            noFill();stroke(127);circle(sun.x,sun.y,2*r)
            fill(127);noStroke()
            text(`${r}`,sun.x-r,sun.y);
            text(`${r}`,sun.x+r,sun.y);
            text(`${r}`,sun.x,sun.y+r);
            text(`${r}`,sun.x,sun.y-r);
           
        };

        // DRAW PLANET AND DETECT PLANET POSITION (mouseX,mouseY)
        //////////////////////////////////////////////////////////////
        fill(255);circle(planet_x,planet_y,2*planet_r);fill(0);text('M2',planet_x,planet_y);
        
        var boolX = mouseX >=  planet_x-planet_r &&  mouseX <=  planet_x+planet_r
        var boolY = mouseY >=  planet_y-planet_r &&  mouseY <=  planet_y+planet_r

        if( mouseIsPressed && ( boolX && boolY )){
            planet_x = mouseX;
            planet_y = mouseY;
        };

        // INITIALISE PLANET and v,a
        planet  = createVector(planet_x-2*planet_r,planet_y);

        var v   = createVector(vx,vy);
        var a   = createVector(0,0);
        var P   = [planet];

    pop()


    for(let i = 0;i<nIterations;i++){
         
        push()
             
            textSize(18);textStyle(BOLD);

            fill(0);stroke(255);strokeWeight(4);text(`p${i}`,planet.x,planet.y-15);
            
            // V0
            var v0_1 = [planet.x    , planet.y];
            var v0_2 = [planet.x+v.x, planet.y+v.y];
            
            // COMPUTE GRAVITY
            var distance    = Math.sqrt( (planet.x-sun.x)**2 + (planet.y-sun.y)**2)
            var anglep1p2   = atan2(sun.y-planet.y,sun.x-planet.x)*PI/180;
            var gravityMood = (massRatio)/distance**2;
            var a           = new p5.Vector.fromAngle(anglep1p2,gravityMood);
            
            // G OVER V1 1
            var a_10 = v0_1;
            var a_20 = [ a_10[0]+a.x, a_10[1]+a.y ];
            
            // G OVER V1 2
            var a_11 = v0_2;
            var a_21 = [ a_11[0]+a.x, a_11[1]+a.y ];

            v      = p5.Vector.add(v,a);
            planet = p5.Vector.add(v,planet);
        
            // V1
            var vel_1 = [P[i].x,P[i].y];
            var vel_2 = [v.x+P[i].x,v.y+P[i].y];

            if(drawMode=='Vector Diagram'){
                
                // V0
                myUtils.drawArrow(v0_1,v0_2,{color:[0,0,255],arrowHead:0.05});
                strokeWeight(3);stroke(255);fill(0,0,255);text(`v${i}`,(v0_1[0]+v0_2[0])/2,(v0_1[1]+v0_2[1])/2);
                
                 // G OVER V1 1
                myUtils.drawArrow(a_10,a_20,{color:[255,0,0],arrowHead:0.05});
                strokeWeight(3);stroke(255);fill(255,0,0);text(`g${i}`,(a_10[0]+a_20[0])/2,(a_10[1]+a_20[1])/2);
                
                // G OVER V1 2
                myUtils.drawArrow(a_11,a_21,{color:[255,0,0],arrowHead:0.05});
                strokeWeight(3);stroke(255);fill(255,0,0);text(`g${i}`,(a_11[0]+a_21[0])/2,(a_11[1]+a_21[1])/2);
                
                // V1
                myUtils.drawArrow(vel_1,vel_2,{color:[0,255,0],arrowHead:0.05});
                fill(0,255,0);stroke(0);text(`v${i+1}`,(vel_1[0]+vel_2[0])/2,(vel_1[1]+vel_2[1])/2)
            
            }else{

                fill(255);circle(vel_2[0],vel_2[1],2*planet_r);//fill(0);text('M2',planet_x,planet_y);

            }

            
            P.push(planet);

            if(i==nIterations-1){
                fill(0);stroke(255);strokeWeight(4);text(`p${i+1}`,planet.x,planet.y-15);
            };


        pop()

    }

    
};

function windowResized(){
    
    // RESIZE CANVAS AND SUN-PLANTE POSITIONS WHEN WINDOWRESIZED
    /////////////////////////////////////////////////////////////

    resizeCanvas(windowWidth, windowHeight);

    sun.x = windowWidth/2;
    sun.y = windowHeight/2;

    planet_x    = sun.x;
    planet_y    = sun.y-250;

};
