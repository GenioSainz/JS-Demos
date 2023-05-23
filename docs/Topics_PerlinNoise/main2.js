

let noiseObject = new PerlinNoise();
var divSize     = 800;
var id0         = 'plot0';


function setup() {

    createCanvas(windowWidth,windowHeight, WEBGL);
    angleMode(DEGREES);strokeWeight(5);

    frameRate(3);

    createDiv('')
                 .id(id0)
                 .position(windowWidth/2-divSize/2,windowHeight/2-divSize/2)
                 .style('border','2px solid');

    plot3D(id0);
}


function plot3D(id){

    var N = 1000;
    var X = myUtils.linspace(2,20,N);
    var Y = myUtils.linspace(4,40,N) ;
    var Z = [];

    for (let y = 0; y < N-1; y++) {

        var row = [];
        for (let x = 0; x < N; x++) {

            // Noise2D generally returns a value approximately in the range [-1.0, 1.0]
            //let z = noiseObject.eval(x*0.005, y*0.005)*100;
            let z = noise(x*0.001, y*0.001)*100;

            row.push(`${z}`);
        }

        Z.push(row);
    };

    // Plotting the mesh
    var data=[
        {
        opacity:0.8,
        color:'rgb(300,100,200)',
        type: 'surface',
        x: X,
        // y: Y,
        z: Z,
        }
    ];

    var layout = {
        // title: {text:`<b>${txtTitle}: ${interp.toFixed(4)} `,font:{size:12}},
        // showlegend: false,
        width:  divSize,
        height: divSize,
        margin: {
            l: 25,
            r: 25,
            b: 35,
            t: 35,
            pad: 2
          },
      };
    Plotly.newPlot(id, data, layout);

}

function plot3D2(id){

    d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/api_docs/mt_bruno_elevation.csv', function(err, rows){
        function unpack(rows, key) {
        return rows.map(function(row) { return row[key]; });
    }

    var z_data=[ ]
    for(i=0;i<24;i++)
    {
    z_data.push(unpack(rows,i));
    }

    console.log(z_data)

    var data = [{
            z: z_data,
            type: 'surface'
            }];

    var layout = {
    title: 'Mt Bruno Elevation',
    autosize: false,
    width: divSize,
    height: divSize,
    margin: {
        l: 65,
        r: 50,
        b: 65,
        t: 90,
    }
    };
    Plotly.newPlot(id, data, layout);
    });
}