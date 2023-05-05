

let pointsArray = [];

function setup() {

    createCanvas(windowWidth, windowHeight);textAlign(CENTER,CENTER);textSize(12)
  
    pointsArray = new pointsDetection({nPoints:50});
    pointsArray.createRandom();
};

function draw() {
  
    background(240);myUtils.drawGrid();
    pointsArray.mouseDetection();
    pointsArray.draw();
};

function doubleClicked(event) {
  
    pointsArray.addPoint(event.x, event.y);
};

function mouseReleased(){
         
    pointsArray.pressUp()
};

function windowResized() {

    resizeCanvas(windowWidth, windowHeight)
}