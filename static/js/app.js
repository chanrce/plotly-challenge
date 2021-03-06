// Define a function that will create metadata for given sample
function buildMetadata(sample) {

    // Read the json data
    d3.json("samples.json").then((data) => {
        // Parse and filter the data to get the sample's metadata
        //Getting metadata from samples.json
        var Metadata = data.metadata;

        //Filtering the samples.json data by id. Returning samples.json values if they match the given "sample"
        var filteredData =  Metadata.filter(selectiondata => selectiondata.id == sample);
        filteredData = filteredData[0]
        console.log(filteredData);   

        // Specify the location of the metadata -- where the new demographic chart will go --  and update it
        //Identifying the location -- use inspect HTML
        var demographics = d3.select("#sample-metadata");

        //Refreshing/Updating the chart with new selected sample
        demographics.html("");

       //Add this information to the demographic info table
        Object.entries(filteredData).forEach(function([key,value]) {
            console.log(key,value);
            var row = demographics.append("tr")
            row.append("td").html(`${key}`)
            row.append("td").html(`${value}`)

        });
    });
}

// Define a function that will create charts for given sample
function buildCharts(sample) {

    // Read the json data
    d3.json("samples.json").then((data) => {
        console.log(data)
        // Parse and filter the data to get the sample's OTU data
        //Filtering by samples section in json. The id and sample are equal -- correspond to the dropdown selection
        var byid = data.samples.filter(entry => entry.id == sample)[0];
        console.log(byid)
        //Data for chart from samples section
        var values = byid.sample_values;
        var otuids = byid.otu_ids;
        var otu_labels = byid.otu_labels;
        
        // Create bar chart in correct location

        //Slicing to take only top 10 values
        var ten_otus = otuids.slice(0, 10).reverse();
        console.log(ten_otus);
        
        var named_otus = ten_otus.map(named => `OTU ${named}`);
        console.log(named_otus)
       
        var ten_values = values.slice(0,10).reverse();
        console.log(ten_values);

        var ten_otulabels = otu_labels.slice(0,10).reverse();
        console.log(ten_otulabels);

        //Bar chart creation
        var trace = {
            x: ten_values,
            y: named_otus,
            text: ten_otulabels,
            orientation: "h",
            type: "bar"
           
            
        };

        //Create data array for the plot
        var bar_data = [trace];

        //Define the plot layout
        var bar_layout ={
            //Dynamic graph title that updates along with ID number
            title: `Top Ten OTUs for ID #${sample}`,
            xaxis: {title: "Sample Value"}

        };
        
        //Plotting
        Plotly.newPlot("bar", bar_data, bar_layout);


        // Create bubble chart in correct location        
        var trace2 = {
            x: otuids,
            y: values,
            mode: "markers",
            text: otu_labels,
            marker: {
                size: values,
                color: otuids

            }

        }

        var bubble_data = [trace2];

        var bubble_layout = {
            title: "Samples",
            showlegend: false,
            height: 600,
            width: 1100

        }
        Plotly.newPlot ("bubble", bubble_data, bubble_layout)

    })

}

// Define function that will run on page load
function init() {
    //Select the dropdown menu using HTML inspection
    var dropdownMenu = d3.select("#selDataset")

    // Read json data
    d3.json("samples.json").then((data)=> {
        //Creating descriptive variable for names. Getting names from samples.json file.
        var names = data.names;
        //Checking to see if sample names were properly logged
        console.log(names);
        // Parse and filter data to get sample names
        
        //Creating forEach
        names.forEach(function(name) {

            //Appending the options to the menu:
            var options = dropdownMenu.append("option")

            //Converting the options to text format
            options.text(name)     

        });
        //Calls the first item in the dropdown
        buildMetadata(names[0])
        buildCharts(names[0])

    });

}

function optionChanged(newSample){

    // Update metadata with newly selected sample
    buildMetadata(newSample);
    // Update charts with newly selected sample
    buildCharts(newSample);
}

// Initialize dashboard on page load
init();