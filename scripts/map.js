function showMap() {
  // Replace with your own Mapbox access token
  mapboxgl.accessToken =
    "pk.eyJ1IjoiZG1hcnRpbmV6MjEiLCJhIjoiY204bmd1cTEzMDBpdzJxcHdxZngwd2t4cCJ9.I6BKiiI_214s2Q_r6En1jA";

  // Default location (YVR city hall) 49.26504440741209, -123.11540318587558
  let defaultCoords = { lat: 49.26504440741209, lng: -123.11540318587558 };

  // FIRST, Find out where the user is
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // User allowed location access
        let userCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        initializeMap(userCoords);
      },
      (error) => {
        console.warn("Geolocation error:", error);
        initializeMap(defaultCoords); // Load with default location
      }
    );
  } else {
    console.error("Geolocation is not supported.");
    initializeMap(defaultCoords); // Load with default location
  }

  function initializeMap(coords) {
    var userLocation = [coords.lng, coords.lat]; // user's location

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v12",
      center: userLocation, // center the map at the user's location
      zoom: 12,
    });
    // Attach the geocoder to the map
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      types: "country,region,place,postcode,locality,neighborhood,address",
      placeholder: "Search for places",
      mapboxgl: mapboxgl,
    });

    map.addControl(geocoder);

    geocoder.on("result", (e) => {
      const address = e.result.place_name;
      document.getElementById("event-location").value = address;
    });

    showPoint(map, userLocation);
    getClickedLocation(map, (clickedLocation) => {});
  }
}
showMap();

// ---------------------------------------------------------------------
// Add a pin for point that is provided as a parameter point (lat, long)
// when the map loads. Note map.on is an event listener.
//
// @params   map:  the map object;
//           point:  an array of [lng, lat] coordinates
// ---------------------------------------------------------------------
function showPoint(map, point) {
  map.on("load", () => {
    //a point is added via a layer
    map.addLayer({
      id: "point",
      type: "circle",
      source: {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Point",
                coordinates: point,
              },
            },
          ],
        },
      },
      paint: {
        "circle-radius": 10,
        "circle-color": "#1C3144",
      },
    });
  });
}

//-----------------------------------------------------------------------------
// This function is asynchronous event listener for when the user clicks on the map.
// This function will return in the callback, the coordinates of the clicked location
// and display a pin at that location as a map layer
//
// @params   map:  the map object;
//           callback:  a function that will be called with the clicked location
//-----------------------------------------------------------------------------
function getClickedLocation(map, callback) {
  map.on("click", (event) => {
    const clickedLocation = Object.keys(event.lngLat).map(
      (key) => event.lngLat[key]
    );
    const end = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Point",
            coordinates: clickedLocation,
          },
        },
      ],
    };
    if (map.getLayer("end")) {
      map.getSource("end").setData(end);
    } else {
      map.addLayer({
        id: "end",
        type: "circle",
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "Point",
                  coordinates: clickedLocation,
                },
              },
            ],
          },
        },
        paint: {
          "circle-radius": 10,
          "circle-color": "#F60665",
        },
      });
    }
    console.log(clickedLocation);
    callback(clickedLocation);

    // Fetch the address using reverse geocoding
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${clickedLocation[0]},${clickedLocation[1]}.json?access_token=${mapboxgl.accessToken}`
    )
      .then((response) => response.json())
      .then((data) => {
        const address = data.features[0]?.place_name || "Unknown location";
        document.getElementById("event-location").value = address;
      })
      .catch((error) => console.error("Error fetching address:", error));
  });
}
