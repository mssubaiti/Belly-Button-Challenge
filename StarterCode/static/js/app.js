

// Read the samples.json data
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
.then(function(data) {
  // Get the necessary data for the chart
  var samples = data.samples;
  var dropdown = d3.select("#selDataset");



  // Initialize the chart with the first sample
  var initialSample = samples[0];
  updateBarChart(initialSample);

  // Event listener for dropdown changes
  dropdown.on("change", function() {
    var selectedSampleId = d3.select(this).property("value");
    var selectedSample = samples.find(function(sample) {
      return sample.id === selectedSampleId;
    });
    updateBarChart(selectedSample);
  });

  // Function to update the bar chart based on the selected sample
  function updateBarChart(sample) {
    var top10Values = sample.sample_values.slice(0, 10).reverse();
    var top10Ids = sample.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    var top10Labels = sample.otu_labels.slice(0, 10).reverse();

    var trace = {
      x: top10Values,
      y: top10Ids,
      text: top10Labels,
      type: "bar",
      orientation: "h"
    };

    var layout = {
      title: "Top 10 OTUs",
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU IDs" }
    };

    Plotly.newPlot("bar", [trace], layout);
  }
})
.catch(function(error) {
