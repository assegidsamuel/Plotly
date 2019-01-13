function buildMetadata(sample) {

  var url = `/metadata/${sample}`;
  d3.json(url).then(function(sample){
    var sample_metadata = d3.select("#sample-metadata");
    
    sample_metadata.html("");
    
    Object.entries(sample).forEach(function ([key, value]) {
      var row = sample_metadata.append("p");
      row.text(`${key}: ${value}`);

});
  }
)};

function buildCharts(sample) {

  var url = `/samples/${sample}`;
  d3.json(url).then(function(data) {
console.log(data);
      // @TODO: Build a Bubble Chart using the sample data
      var x = data.otu_ids;
      var y = data.sample_values;
      var size = data.sample_values;
      var colors = data.otu_ids; 
      var values = data.otu_labels;
  
      var trace1 = {
        x: x,
        y: y,
        text: values,
        mode: 'markers',
        marker: {
          color: colors,
          size: size
        } 
      };
    
      var data = [trace1];
  
      var layout = {
        xaxis: { title: "OTU ID"},
      };
  
      Plotly.newPlot('bubble', data, layout);


    d3.json(url).then(function(data) {
      var pie_values = data.sample_values.slice(0,10);
      var pie_labels = data.otu_ids.slice(0,10);
      var pie_hover = data.otu_labels.slice(0,10);
  
      var data = [{
        values: pie_values,
        labels: pie_labels,
        hovertext: pie_hover,
        type: 'pie'
      }];
        Plotly.newPlot('pie', data);
      });
    });
  }


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

