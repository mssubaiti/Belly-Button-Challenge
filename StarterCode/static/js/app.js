// Constant Variable name
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch the JSON data and console log it (promise chain, then called on returned promise. callback function logs values when JSON data is retrieved to console)
d3.json(url).then(function(data) {
  console.log(data);
});


// -----------------------------------------------------------------------------------------------

// Initialize dropdown menu with sample_names
function init() {

  // Use D3 to select the dropdown menu
  let dropdownMenu = d3.select("#selDataset");

  // Use D3 to get sample_names and populate the drop-down selector
  d3.json(url).then((data) => {

    // Setting variable sampleNames to the data.names array, containing the sample names.
    let sampleNames = data.names; 

    // forEach iterates over each sample name in the sampleNames array. Each sample name is logged to the console using: console.log(id).
    sampleNames.forEach((id) => {
      console.log(id);
      // Adding an Option element and appending it to the dropdown menu.
      dropdownMenu.append("option")
        .text(id)
        .property("value", id);
    });

    // Set the first sample from the list and Log the value of sample_one
    let sample_one = sampleNames[0];
    console.log(sample_one);



    // Build the plots
    buildMetadata(sample_one);
    buildBarChart(sample_one);
    buildBubbleChart(sample_one);
    buildGaugeChart(sample_one);
  });
}


// Function to populate metadata
function buildMetadata(sample) {

  // D3 to retrieve all data
  d3.json(url).then((data) => {

      let metadata = data.metadata; 
      let value = metadata.filter(result => result.id == sample);
      console.log(value)

      // Get the first index from the array
      let valueData = value[0]; 
      d3.select("#sample-metadata").html("");

       // The "Object.entries" adds every key/value pair to the panel
      Object.entries(valueData).forEach(([key,value])=> {
          console.log(key,value);
          
          d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
      });
  });
};

// Build bar charts.
function buildBarChart(sample) {
  
  // D3 to get all data
  d3.json(url).then((data) => {
      let sampleInfo = data.samples;

      // Filter on the values
      let value = sampleInfo.filter(result => result.id == sample); 
        
      // Get the first index from the array
      let valueData = value[0];

     // Get "otu_ids", "sample_values", and "otu_labels"
      let sample_values = valueData.sample_values;
      let otu_ids = valueData.otu_ids;
      let otu_labels = valueData.otu_labels;

      console.log(sample_values, otu_ids, otu_labels);

      // Top 10 in descending order and bar chart trace setup
      let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
      let xticks = sample_values.slice(0, 10).reverse();
      let labels = otu_labels.slice(0, 10).reverse();
        
      let trace = {
          x: xticks,
          y: yticks,
          text: labels,
          type: "bar",
          orientation: "h"
      };
      
      let traceData = [trace]

      // Setup the layout
      let layout = {
          title: "10 OTU by ID's",
          margin: {
              l: 150,
              r: 20,
              t: 50,
              b: 50
          }
      };

      // Create the bar chart
      Plotly.newPlot("bar", traceData, layout);
  });
};


// Build the Bubble chart
function buildBubbleChart(sample) {

// Use D3 to retrieve all of the data
  d3.json(url).then((data) => {

      let sampleInfo = data.samples; 

      let value = sampleInfo.filter(result => result.id == sample);

     // Get the first index from the array
      let valueData = value[0]; 

    // Get "otu_ids", "sample_values", and "otu_labels"
      let sample_values = valueData.sample_values;
      let otu_ids = valueData.otu_ids;
      let otu_labels = valueData.otu_labels;

      console.log(sample_values, otu_ids, otu_labels);

      // Trace for the bubblechart
      let trace = {
          x: otu_ids, 
          y: sample_values, 
          text: otu_labels,
          mode: "markers", 
          marker: {
              size: sample_values,
              color: otu_ids, 
              colorscale: "Earth"
          }
      };
      let traceData = [trace]

      let layout = {
          title: "Clusters of samples showing number of bacterial", 
          hovermode: "closest", 
          xaxis: {title: "OTU ID"},
          height: 600,
          width: 1000
      };

      // Call Plotly to plot the bubble chart
      Plotly.newPlot("bubble", traceData, layout)
  });
};

function optionChanged(value) {
  console.log(value); 

  buildMetadata(value);
  buildBarChart(value); 
  buildBubbleChart(value); 
};

init(); 


