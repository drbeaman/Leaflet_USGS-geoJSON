// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/" +
  "4.5_month.geojson";

// Function that will determine the color of an earthquake based on the magnitude
// function chooseColor(mag) {
//   switch (mag) {
//   case when <= 5.0 :
//     return "yellow";
//   case when <= 5.5:
//     return "orange";
//   case when <= 6.0:
//     return "red";
//   case when <=6.5:
//     return "green";
//   case "Staten Island":
//     return "purple";
//   default:
//     return "black";
//   }
// }

  // Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

// Function to assign each earthquake according to color bucket
// function assignColor(magnitude) {
//   if (magnitude > 8.0) {
//     return 'RedBrick'
//   }
//   else if (magnitude >= 6.5) {
//     return 'Red'
//   }
//   else if (magnitude >= 6.0) {
//     return 'Green'
//   }
//   else if (magnitude >= 5.5) {
//     return 'LimeGreen'
//   } 
//   else if (magnitude >= 5.0) {
//     return 'LawnGreen'
//   }
//   else if (magnitude > 4.5) {
//     return 'GreenYellow'
//   }
//   else {
//     return 'Chartreuse';
//   }
// };


// Function to assign the marker size according to earthquake magnitude
function assignRadius(value) {
  return value * 20000;
}

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.mag + " Magnitude Earthquake</h3><hr>" +
    feature.properties.place + "</h3><hr><p>" + 
    new Date(feature.properties.time) + "</p>");
  }
  function getColor(m) {
    return m > 8.0 ? '#800026' :
      m > 7.5  ? '#BD0026' :
      m > 7.0  ? '#E31A1C' :
      m > 6.5  ? '#FC4E2A' :
      m > 6.0   ? '#FD8D3C' :
      m > 5.5   ? '#FEB24C' :
      m > 5.0   ? '#FED976' :
      '#FFEDA0';
  }
  
  function style(feature) {
    return {
        fillColor: getColor(feature.properties.mag),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
  }
  // Define the pointToLayer for the SIZE and COLOR variables which are not using
  // Leaflet defaults; required for non-defaults in Leaflet layers.
  function pointToLayer(feature, latlng) {
    return new L.circle(latlng, {
      radius: assignRadius(feature.properties.mag),
      fillColor: getColor(feature.properties.mag),
      color: '#0000',
      weight: .75,
      stroke: true,
      fillOpacity: .75
    })
    
  }

  // Create a GeoJSON layer containing the features and pointToLayers arrays on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    style: style,
    onEachFeature: onEachFeature,
    // pointToLayer: pointToLayer
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 2,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "info legend");
    var grades = [0,1,2,3,4,5,6]
    var labels = [];

    // div.innerHTML = legendInfo;
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
          '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);``

}
