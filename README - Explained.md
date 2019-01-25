# README - Explained

Things to know about running this app:
1.  You need to register for your own free Mapbox account and API key to run this visualization.  Register here 
    (https://www.mapbox.com) and paste your API key in config.js file. 
2.  Logic.js file is numbered to emphasize which processes need to run within each functions.  The greatest
    obstacle to getting the features to render was making sure only the necessary functions were inside two larger
    "createFeatures" and "createMaps" functions.  Features needs "L.geoJSON", "L.circle" or "onEachFeature" commands
    INSIDE the createFeatures function. "L.Map", "L.Control" and all legend commands need to reside INSIDE the
    createMap function or they will not render / the map will not display in the browser.