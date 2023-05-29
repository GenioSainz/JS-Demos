
var divSize;

var plotId = 'plot';
var plot;  

var gui;

var timeCount  = 0;
var noiseSpeedMin  = -0.1;
var noiseSpeedMax  =  0.1;
var noiseSpeedStep =  0.05;
var noiseSpeed     =  0.05;
var c = 0;
function setup() {

    createCanvas(windowWidth,windowHeight);angleMode(DEGREES);

    frameRate(10);

    textSize(14);textAlign(CENTER,CENTER);textStyle(BOLD);

    var divPad = 50;
    plot       = createDiv('').id(plotId);

    if(windowWidth>windowHeight){
        divSize = windowHeight - 2*divPad;
        plot.position(windowWidth/2 -divSize/2, divPad);
    }else{
        divSize = windowWidth - 2*divPad;
        plot.position(windowWidth/2 -divSize/2, 4*divPad);
    }

    plot.style('border','2px solid');

    gui = createGui('Dynamic Noise');
    gui.addGlobals('noiseSpeed');

    setInterval(()=>{
           drawOctaves();
           timeCount = timeCount - noiseSpeed;
    },200);

};


function drawOctaves(){
   

    var nt      = 500;
    var t       = myUtils.linspace(0,500,nt);
    var octave1 = []; 
    var octave2 = [];
    var octave3 = [];
    var octave4 = [];
    var perlinN = [];
    
    for(let i=0;i<t.length;i++){
        
        var tt   = i*0.01 + timeCount;
        var val1 = noise(tt*1);  val1 = map(val1,0,1,-1/2,1/2);
        var val2 = noise(tt*2);  val2 = map(val2,0,1,-1/4,1/4);
        var val3 = noise(tt*4);  val3 = map(val3,0,1,-1/8,1/8);
        var val4 = noise(tt*8);  val4 = map(val4,0,1,-1/16,1/16);
        octave1.push( val1 );
        octave2.push( val2 );
        octave3.push( val3 );
        octave4.push( val4 );
        perlinN.push( val1 + val2 + val3 + val4)
    };

      var trace1 = {
        x: t,
        y: octave1,
        type: 'scatter',
      };
      
      var trace2 = {
        x: t,
        y: octave2,
        xaxis: 'x2',
        yaxis: 'y2',
        type: 'scatter'
      };

      var trace3 = {
        x: t,
        y: octave3,
        xaxis: 'x3',
        yaxis: 'y3',
        type: 'scatter'
      };

      var trace4 = {
        x: t,
        y: octave4,
        xaxis: 'x4',
        yaxis: 'y4',
        type: 'scatter'
      };

      var trace5 = {
        x: t,
        y: perlinN,
        xaxis: 'x5',
        yaxis: 'y5',
        type: 'scatter'
      };

      var annotationsArray = [
                                {
                                    x: nt/2,
                                    y: 0.4,
                                    xref: 'x',
                                    yref: 'y',
                                    text: '<b>Octave1 : Amplitude 1/2 -  Frecuency 1',
                                    showarrow: false,
                                },            {
                                    x: nt/2,
                                    y: 0.2,
                                    xref: 'x2',
                                    yref: 'y2',
                                    text: '<b>Octave2 : Amplitude 1/4 -  Frecuency 2',
                                    showarrow: false,
                                },
                                {
                                    x: nt/2,
                                    y: 0.1,
                                    xref: 'x3',
                                    yref: 'y3',
                                    text: '<b>Octave3 : Amplitude 1/8 -  Frecuency 4',
                                    showarrow: false,
                                },
                                {
                                    x: nt/2,
                                    y: 0.05,
                                    xref: 'x4',
                                    yref: 'y4',
                                    text: '<b>Octave4 : Amplitude 1/16 -  Frecuency 8',
                                    showarrow: false,
                                },
                                {
                                    x: nt/2,
                                    y: 0.8,
                                    xref: 'x5',
                                    yref: 'y5',
                                    text: '<b>Fractal Pelin Noise: Octave1 + Octave2 + Octave3 + Octave4',
                                    showarrow: false,
                                },

                                
      ]
      
      var data = [trace1, trace2, trace3, trace4, trace5];
      
      var layout = {
                    grid: {rows: 5, columns: 1, pattern: 'independent'},
                    width:  divSize,
                    height: divSize,
                    showlegend: false,
                    margin: {
                        l: 50,
                        r: 50,
                        b: 50,
                        t: 50,
                        pad: 0
                      },
                    
                    yaxis: {
                        range: [-1/2,1/2],
                        tickvals:myUtils.linspace(-1/2,1/2,5),
                        showline: true,
                        mirror: 'ticks',
                    },
                    xaxis: {
                        showline: true,
                        mirror: 'ticks',
                    },

                    yaxis2: {
                        range: [-1/4,1/4],
                        tickvals:myUtils.linspace(-1/4,1/4,5),
                        showline: true,
                        mirror: 'ticks',
                    },
                    xaxis2: {
                        showline: true,
                        mirror: 'ticks',
                    },

                    yaxis3: {
                        range: [-1/8,1/8],
                        tickvals:myUtils.linspace(-1/8,1/8,5),
                        showline: true,
                        mirror: 'ticks',
                    },
                    xaxis3: {
                        showline: true,
                        mirror: 'ticks',
                    },

                    yaxis4: {
                        range: [-1/16,1/16],
                        tickvals:myUtils.linspace(-1/16,1/16,5),
                        showline: true,
                        mirror: 'ticks',
                    },
                    xaxis4: {
                        showline: true,
                        mirror: 'ticks',
                    },

                    yaxis5: {
                        range: [-1,1],
                        tickvals:myUtils.linspace(-1,1,5),
                        showline: true,
                        mirror: 'ticks',
                    },
                    xaxis5: {
                        showline: true,
                        mirror: 'ticks',
                    },

                    annotations:annotationsArray
      };
      
      Plotly.newPlot(plotId, data, layout);
}



function windowResized() {

    window.location.reload();
    resizeCanvas(windowWidth, windowHeight);
};






