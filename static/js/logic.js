

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
  .then(function(data) {

console.log(data);

const key = 'rLxfDDAcGaB2Eydogtvx';
const map = L.map('map').setView([  38.597559, -122.807471], 4.5); //starting position
L.tileLayer(`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${key}`,{ //style URL
tileSize: 512,
zoomOffset: -1,
minZoom: 1,
attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
crossOrigin: true
}).addTo(map);

let features = data.features ;
for (let i = 0; i < features.length; i++) {
  let sample  = features[i];
  let coordinates = sample.geometry.coordinates;
let mag = sample.properties.mag;
let location = sample.properties.place;

  let log = coordinates[0];
  let lat = coordinates[1];
  let depth = coordinates[2];

  //L.marker([lat,log ]).addTo(map);


      // Color based on depth
let color;
      if (depth > 90) {
        color = "red";
      } else if (depth > 70) {
        color = "darkorange";
      } else if (depth > 50) {
        color = "orangered";
      } else if (depth > 30) {
        color = "orange";
      } else if (depth > 10) {
        color = "yellowgreen";
      } else {
        color = "lightgreen";
      };

      // Create circle marker with size based on magnitude and color based on depth
      let marker = L.circleMarker([lat, log], {
        radius: mag * 2, // Size based on magnitude
        color: color,
        fillOpacity: 1,
                stroke: false // Disable the stroke (no outer ring)

      }).addTo(map);

            marker.bindTooltip(`Magnitude: ${mag}<br>Location: ${location}<br>Depth: ${depth} km`);


}


 d3.json("PB2002_plates.json").then(function(platesData) {
      L.geoJSON(platesData, {
        style: function() {
          return {
            color: "blue", // Color for tectonic plates boundaries
            weight: 2,
             fillOpacity: 0,  // Ensure no fill opacity is set for boundaries
      stroke: true
          };
        }
      }).addTo(map);
    });




    let legend = L.control({ position: "bottomright" });

    legend.onAdd = function(map) {
      let div = L.DomUtil.create("div", "info legend");

 div.style.backgroundColor = "white";  // Set the background color to white
      div.style.padding = "10px";           // Add padding for better readability
      div.style.border = "2px solid #ccc";  // Add a border for aesthetics

      let grades = [-10, 10, 30, 50, 70, 90];
      let colors = ["lightgreen", "yellowgreen", "orange", "orangered", "darkorange", "red"];
      let labels = [];

      // Loop through depth intervals and generate a label with a colored square for each interval
      for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
          '<i style="background-color:' + colors[i] + '; width: 18px; height: 18px; display: inline-block; margin-right: 8px;"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }

      return div;
    };

    legend.addTo(map);


//      // data is an object, convert to array.
//      data = [data[0], data[1]];
//
//      drawText("#jsonDemo", data);



   });



  //L.marker([55.665957, 12.550343]).addTo(map);





