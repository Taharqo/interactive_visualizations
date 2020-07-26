//NOTE: both DD & dd stand for drop down. 

//initiate data promise 
const url = 'samples.json'
var dataPromise = d3.json(url)

d3.select("#selDataset").on("change", getOptionData);

//Populates the drop down with names
function populateDD(){
    dataPromise.then(results =>{
        console.log(results)
        var names = results.names
        var ddMenue = d3.select('#selDataset')
        for( var i=0; i < names.length; i++){
          ddMenue.append('option').text(names[i])
        }
    });
};

//Filter the data and retrives the data related to the drop down selection 
//Sends the filtered data to the following funcitons: sortFilterData, buildGauge & populateDemoInfo
function getOptionData(){
    var ddMenu = d3.select("#selDataset").node();
    var ddValue = ddMenu.value;

    dataPromise.then(results =>{
        results.samples.forEach(d => {
            if (d['id'] == ddValue){  
                sortFilterData(d)
            } 
        })

        results.metadata.forEach(r => {
            if (r['id'] == ddValue){ 
               console.log(r)
               buildGauge(r)
               populateDemoInfo(r)
            }
        }) 
    })     
}

//Prepares the data to be plotted by sorting and filtering for the top 10 values
//the data is sent to the following functions: buildHBar & buildBubble.
function sortFilterData(d){
    var sample_values = d['sample_values']
    var otu_ids = d['otu_ids']
    var otu_labels= d['otu_labels']

    sample_values = sample_values.sort((a, b) => b - a).slice(0,10);
    otu_ids = otu_ids.sort((a, b) => b - a).slice(0,10);
    otu_labels = otu_labels.sort((a, b) => b - a).slice(0,10);

    buildHBar(sample_values, otu_ids, otu_labels)
    buildBubble(sample_values, otu_ids, otu_labels)
}

//Populates demograpic info for the selected name
function populateDemoInfo(r){
    var demogInfo = Object.entries(r)
    console.log(demogInfo)
    const demogEntry = d3.select('#sample-metadata')
    demogEntry.html("");
    for (var i = 0; i < demogInfo.length; i++){
        demogEntry.append('h6').text(demogInfo[i])
    }  
}

//Plots a horizantal bar graph
function buildHBar(sample_values, otu_ids, otu_labels){ 
    for (var i=0; i < otu_ids.length; i++){
        otu_ids[i] = 'OTU '+ otu_ids[i]
    }  
    console.log(otu_ids)
    var data = [{
        type: 'bar',
        x: sample_values,
        y: otu_ids,
        hoverinfo: otu_labels,
        orientation: 'h'
    }];
                
    var layout = {
        title: "Top 10 OTU",
        yaxis:{
           // tickmode:"linear",
        },
        /* margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 30
        } */
    };

    Plotly.newPlot('bar', data, layout);
}

//Plots a bubble chart
function buildBubble(sample_values, otu_ids, otu_labels){
    var data = [{
        x: otu_ids,
        y: sample_values,
        mode: 'markers',
        text: otu_labels,
        marker: {
          color: otu_ids,
          size: sample_values
        }
               
      }];
          
      var layout = {
        title: 'Marker Size and Color',
        xaxis: {title: 'OTU ID'},
        showlegend: false,
        height: 600,
        width: 1000
      };
      
      Plotly.newPlot('bubble', data, layout);
}

//Plots a guage
function buildGauge(r){
    const wfreq = r['wfreq']
    var data = [
        {
            //domain: { x: [0, 1], y: [0, 1] },
            value: wfreq,
            title: { text: " Weekly Washing Frequency" },
            type: "indicator",
            mode: "gauge+number"
        }
    ];
    
    var layout = { 
        width: 600, 
        height: 500, 
        margin: { t: 0, b: 0 } 
    };

    Plotly.newPlot('gauge', data, layout);

}

populateDD()