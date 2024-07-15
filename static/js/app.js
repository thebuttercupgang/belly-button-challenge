// Build the metadata panel
function buildMetadata(sampleID) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let metaArray = metadata.filter(sample => sample.id == sampleID);

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    let entry = metaArray[0];
    
    for ([key, value] of Object.entries(entry)) {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    }
  });
}

// function to build both charts
function buildCharts(sampleID) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let sampleArray = samples.filter(sample => sample.id == sampleID);
    let sample = sampleArray[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otuIds = sample.otu_ids;
    let otuLabels = sample.otu_labels;
    let sampleValues = sample.sample_values;


    
    // BUBBLE CHART

    // Build a Bubble Chart
    let trace1 = {
      x: otuIds,
      y: sampleValues, 
      type: "scatter",
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds,
        opacity: .75, 
        colorscale: 'YlGnBu'
      }

    };
    let bubbleData = [trace1]

    let bubbleLayout = {
      title: "Bacteria Cultures Per Culture",
      xaxis: {
        title: {
          text: `OTU ID ${sampleID}`
        }
      },
      yaxis: {
        title: {
          text: "Number of Bacteria"
        }
      }      
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);



    // BAR CHART

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let otuIdsString = otuIds.map(id => `OTU ${id}`);

    // then sort the ids, the values are already in ascending order so you just have to reverse it
    let otuIdsSorted = otuIdsString.slice(0,10).reverse();
    let sampleValuesSorted = sampleValues.slice(0,10).sort((a,b) => (a-b));
    console.log(otuIdsSorted)
  
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let trace2 = {
      x: sampleValuesSorted,
      y: otuIdsSorted,
      type: "bar",
      orientation: "h",
      text: otuLabels
    };

    let barData = [trace2]

    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {
        title: {
          text: `OTU ID ${sampleID}`
        }
      }
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", barData, barLayout)
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach(sample => {
      dropdown.append("option").text(sample)
    });

    // Get the first sample from the list
    let firstSample = names[0];
    
    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();