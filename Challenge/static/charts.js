function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filterArray = samples.filter(sampleObj => sampleObj.id == sample);
    //console.log(filterArray);
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = filterArray[0];
    //console.log(firstSample);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuID = firstSample.otu_ids;
    //console.log(otuID);

    var labels = firstSample.otu_labels;
    //console.log(labels);

    var values = firstSample.sample_values;
    //console.log(values);

    // Create a variable that filters the metadata array 
    var metadata = data.metadata;
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);
    // Create a variable that holds the first sample in the metadata array
    var metaResult = metadataArray[0];
    // Create a variable that holds the washing frequency
    var washingFreq = parseInt(metaResult.wfreq);

    //let otus = [];
    
    // array of otu objects 
    //for (var i = 0; i < otuID.length; i++){
      //otus.push({
        //id: otuID[i],
        //label: labels[i],
       // value: values[i],
     //});
    //}
    //otus.sort((a,b)=>b.value - a.value)

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuID.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    var xticks = values.slice(0,10).reverse();
    var labels = labels.slice(0,10).reverse();

    // 8. Create the trace for the bar chart. 
    var trace = {
        x: xticks,
        y: yticks,
        type: "bar",
        orientation: "h",
        text: labels
    };

    var barData = [trace];
    
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacterial Cultures Found",
          
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
  

    // Bar and Bubble charts
    
    // 1. Create the trace for the bubble chart.
    var bubbleData = {
      x: otuID,
      y: values,
      text: labels,
      mode: 'markers',
      marker: {
        size: values,
        color: otuID
      }
    };

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      showlegend: false
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", [bubbleData], bubbleLayout); 


    // Gauge chart
    var gaugeData = {
      value: washingFreq,
      title: {text: "Belly Button Washing Frequency<br>Scrubs per Week"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [0,10]},
        steps: [
          {range: [0,2], color:"#deeaee"},
          {range: [2,4], color:"#b1cbbb"},
          {range: [4,6], color:"#eea29a"},
          {range: [6,8], color:"#c94c4c"},
          {range: [8,10], color:"#50394c"}
        ]
      }
    };

    var gaugeLayout = {
      width: 600, height: 450, margin: {t: 0, b: 0}
    };

    Plotly.newPlot("gauge", [gaugeData], gaugeLayout);
  });
};