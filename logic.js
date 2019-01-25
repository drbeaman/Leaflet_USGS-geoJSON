// 1.0 Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/" +
  "4.5_month.geojson";

// 2.0 Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

// 3.0 Get the colors
function getColor(m) {
  return m > 7.5  ? 'Red' :
    m > 6.5  ? 'DeepPink' :
    m > 5.5  ? 'Gold' :
    m > 4.5  ? 'Yellow' :
    '#FFEDA0';
}

// 4.0 Put the colors into style function
function style(feature) {
  return {
      fillColor: getColor(feature.properties.mag),
      weight: 3,
      opacity: .8,
      fillOpacity: 0.7
  };
}

// 5.0 Function to assign the marker size according to earthquake magnitude
function assignRadius(value) {
  return value * 30000;
}

// 6.0 CREATE FEATURES FUNCTION
function createFeatures(earthquakeData) {

  // 6.1 Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.mag + " Magnitude Earthquake</h3><hr>" +
    feature.properties.place + "</h3><hr><p>" + 
    new Date(feature.properties.time) + "</p>");
  }
  
  // 6.2 Define the pointToLayer for the SIZE and COLOR variables which are not using
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

  // 6.3 Create a GeoJSON layer containing the features and pointToLayers arrays on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    style: style,
    onEachFeature: onEachFeature,
    pointToLayer: pointToLayer
  });

  // 6.4 Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

// 7.0 CREATE MAP FUNCTION
function createMap(earthquakes) {

  // 7.1 Define streetmap and darkmap layers
  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // 7.2 Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light Map": lightmap,
    "Dark Map": darkmap
  };

  // 7.3 Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // 7.4 Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 2,
    layers: [lightmap, earthquakes]
  });

  // 7.5 Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


  // 7.6 Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "info legend");
    var grades = [4.5,5.5,6.5,7.5]
    var labels = [];

    // div.innerHTML = legendInfo;
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
          '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

    return div;
  };

  // 7.7 Adding legend to the map
  legend.addTo(myMap);``

}
