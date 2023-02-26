// MAP CODE BELOW ONLY
mapboxgl.accessToken =
    'pk.eyJ1IjoiY2FsdmludXciLCJhIjoiY2xkMjZmczV1MDBsYjNwcDB0cjI4NjFrMCJ9.VQx5_-ESFCLBxyQS4xqiLg';
const map = new mapboxgl.Map({
    style: 'mapbox://styles/calvinuw/clekjeejj000801tfbram6nsr',
    center: [-122.33628494223058, 47.63748628060085], // centered on seattle, may need to be changed
    zoom: 6,
    container: 'map',
    antialias: true,
    projection: 'mercator',
    pitch: 45 // The angle the map camera starts at
});

map.on('load', function loadingData() {
    const layers = map.getStyle().layers;
    // Find the index of the first symbol layer in the map style.
    let firstSymbolId;
    for (const layer of layers) {
        if (layer.type === 'symbol') {
            firstSymbolId = layer.id;
            break;
        }
    }

    map.addSource('lead_data', {
        type: 'geojson',
        'generateId': true, // crucially important for click color change to work
        data: './assets/Lead_Risk_From_Housing_(Current_Version).json'
    });

    map.addSource('nox_data', {
        type: 'geojson',
        'generateId': true, // crucially important for click color change to work
        data: './assets/NOx-Diesel_Emissions2C_Annual_Tons_Km2_(Current_Version).json'
    });

    map.addSource('ozone_data', {
        type: 'geojson',
        'generateId': true, // crucially important for click color change to work
        data: './assets/Ozone_Concentration_(Current_Version).json'
    });

    map.addSource('pm25_data', {
        type: 'geojson',
        'generateId': true, // crucially important for click color change to work
        data: './assets/PM2_5_Concentration_(Current_Version).json'
    });

    map.addSource('traffic_data', {
        type: 'geojson',
        'generateId': true, // crucially important for click color change to work
        data: './assets/Proximity_to_Heavy_Traffic_Roadways_(Current_Version).json'
    });

    map.addSource('rsei_data', {
        type: 'geojson',
        'generateId': true, // crucially important for click color change to work
        data: './assets/Toxic_Releases_from_Facilities2C_RSEI_Model_(Current_Version).json'
    });

    map.addLayer({
            'id': 'lead-extrusion',
            'type': 'fill-extrusion',
            'filter': ['!=', ["get", "Census_Tract"], null],
            'source': 'lead_data',
            'layout': {
                'visibility': 'visible'
            },
            'paint': {
                // Get the `fill-extrusion-color` from the source `color` property.
                'fill-extrusion-color': [
                    "case",
                    ['boolean', ["feature-state", 'clicked'],
                        false
                    ], // If the 'clicked' variable of a feature is true, then color
                    "#00f7ff",
                    ['==', ["get", "Percent_Units_with_Lead"],
                        null
                    ], //color null values a certain color, testing for now
                    '#f5f542',
                    ["step", ["get",
                            "Percent_Units_with_Lead"
                        ], // else color step based on bins
                        '#fff7ec', // stop_output_0
                        10, // stop_input_0
                        '#fee8c8', // stop_output_1
                        20, // stop_input_1
                        '#fdd49e', // stop_output_2
                        30, // stop_input_2
                        '#fdbb84', // stop_output_3
                        40, // stop_input_3
                        '#fc8d59', // stop_output_4
                        50, // stop_input_4
                        '#ef6548', // stop_output_5
                        60, // stop_input_5
                        '#d7301f', // stop_output_6
                        70, // stop_input_6
                        '#7a0000'
                    ]
                ],
                'fill-extrusion-height': [ // Get `fill-extrusion-height` from the source `Percent_Units_with_Lead` property
                    "interpolate", [
                        "linear"
                    ], // change height as we zoom in (needs to find a standard for all layers)
                    ["zoom"],
                    0, ["*", ['get', 'Percent_Units_with_Lead'],
                        1000
                    ], //This expression multiplies data value to determine height of polygon (need to fiddle with these)
                    13, .5
                ],
                'fill-extrusion-opacity': .9
            }
        },
        firstSymbolId
    );

    map.addLayer({
            'id': 'nox-extrusion',
            'type': 'fill-extrusion',
            'source': 'nox_data',
            'layout': {
                'visibility': 'none'
            },
            'paint': {
                // Get the `fill-extrusion-color` from the source `color` property.
                'fill-extrusion-color': [
                    "case",
                    ['boolean', ["feature-state", 'clicked'],
                        false
                    ], // If the 'clicked' variable of a feature is true, then color
                    "#00f7ff",
                    ['==', ["get", "Annual_Tons_Km2"],
                        null
                    ], //color null values a certain color
                    '#f5f542',
                    ["step", ["get", "Annual_Tons_Km2"], // else color step based on bins
                        '#fff7ec', // stop_output_0
                        20, // stop_input_0
                        '#fee8c8', // stop_output_1
                        30, // stop_input_1
                        '#fdd49e', // stop_output_2
                        40, // stop_input_2
                        '#fdbb84', // stop_output_3
                        50, // stop_input_3
                        '#fc8d59', // stop_output_4
                        60, // stop_input_4
                        '#ef6548', // stop_output_5
                        70, // stop_input_5
                        '#d7301f', // stop_output_6
                        80, // stop_input_6
                        '#7a0000'
                    ]
                ],
                'fill-extrusion-height': [ // Get `fill-extrusion-height` from the source `Annual_Tons_Km2` property
                    "interpolate", [
                        "linear"
                    ], // change height as we zoom in (needs to find a standard for all 
                    ["zoom"],
                    0, ["*", ['get', 'Annual_Tons_Km2'],
                        1000
                    ], //This expression multiplies data value to determine height of polygon (need to fiddle with these)
                    13, .5
                ],
                'fill-extrusion-opacity': .9
            }
        },
        firstSymbolId
    );

    map.addLayer({
            'id': 'ozone-extrusion',
            'type': 'fill-extrusion',
            'source': 'ozone_data',
            'layout': {
                'visibility': 'none'
            },
            'paint': {
                // Get the `fill-extrusion-color` from the source `color` property.
                'fill-extrusion-color': [
                    "case",
                    ['boolean', ["feature-state", 'clicked'],
                        false
                    ], // If the 'clicked' variable of a feature is true, then color
                    "#00f7ff",
                    ['==', ["get", "Avg_Ozone_Conc_ppb_km2"],
                        null
                    ], //color null values a certain color
                    '#f5f542',
                    ["step", ["get", "Avg_Ozone_Conc_ppb_km2"], // else color step based on bins
                        '#fff7ec', // stop_output_0
                        20, // stop_input_0
                        '#fee8c8', // stop_output_1
                        30, // stop_input_1
                        '#fdd49e', // stop_output_2
                        40, // stop_input_2
                        '#fdbb84', // stop_output_3
                        50, // stop_input_3
                        '#fc8d59', // stop_output_4
                        60, // stop_input_4
                        '#ef6548', // stop_output_5
                        70, // stop_input_5
                        '#d7301f', // stop_output_6
                        80, // stop_input_6
                        '#7a0000'
                    ]
                ],
                'fill-extrusion-height': [ // Get `fill-extrusion-height` from the source `Avg_Ozone_Conc_ppb_km2` property
                    "interpolate", [
                        "linear"
                    ], // change height as we zoom in (needs to find a standard for all 
                    ["zoom"],
                    0, ["*", ['get', 'Avg_Ozone_Conc_ppb_km2'],
                        1000
                    ], //This expression multiplies data value to determine height of polygon (need to fiddle with these)
                    13, .5
                ],
                'fill-extrusion-opacity': .9
            }
        },
        firstSymbolId
    );

    map.addLayer({
            'id': 'pm25-extrusion',
            'type': 'fill-extrusion',
            'source': 'pm25_data',
            'layout': {
                'visibility': 'none'
            },
            'paint': {
                // Get the `fill-extrusion-color` from the source `color` property.
                'fill-extrusion-color': [
                    "case",
                    ['boolean', ["feature-state", 'clicked'],
                        false
                    ], // If the 'clicked' variable of a feature is true, then color
                    "#00f7ff",
                    ['==', ["get", "Count_"], null], //color null values a certain color
                    '#f5f542',
                    ["step", ["get", "Count_"], // else color step based on bins
                        '#fff7ec', // stop_output_0
                        .2, // stop_input_0
                        '#fee8c8', // stop_output_1
                        .3, // stop_input_1
                        '#fdd49e', // stop_output_2
                        .4, // stop_input_2
                        '#fdbb84', // stop_output_3
                        .5, // stop_input_3
                        '#fc8d59', // stop_output_4
                        .6, // stop_input_4
                        '#ef6548', // stop_output_5
                        .7, // stop_input_5
                        '#d7301f', // stop_output_6
                        .8, // stop_input_6
                        '#7a0000'
                    ]
                ],
                'fill-extrusion-height': [ // Get `fill-extrusion-height` from the source `Count_` property
                    "interpolate", [
                        "linear"
                    ], // change height as we zoom in (needs to find a standard for all 
                    ["zoom"],
                    0, ["*", ['get', 'Count_'],
                        100000
                    ], //This expression multiplies data value to determine height of polygon (need to fiddle with these)
                    13, .5
                ],
                'fill-extrusion-opacity': .9
            }
        },
        firstSymbolId
    );

    map.addLayer({
            'id': 'traffic-extrusion',
            'type': 'fill-extrusion',
            'source': 'traffic_data',
            'layout': {
                'visibility': 'none'
            },
            'paint': {
                // Get the `fill-extrusion-color` from the source `color` property.
                'fill-extrusion-color': [
                    "case",
                    ['boolean', ["feature-state", 'clicked'],
                        false
                    ], // If the 'clicked' variable of a feature is true, then color
                    "#00f7ff",
                    ['==', ["get", "Proximity_to_Heavy_Traffic_Road"],
                        null
                    ], //color null values a certain color
                    '#f5f542',
                    ["step", ["get",
                            "Proximity_to_Heavy_Traffic_Road"
                        ], // else color step based on bins
                        '#fff7ec', // stop_output_0
                        2500, // stop_input_0
                        '#fee8c8', // stop_output_1
                        5000, // stop_input_1
                        '#fdd49e', // stop_output_2
                        7500, // stop_input_2
                        '#fdbb84', // stop_output_3
                        10000, // stop_input_3
                        '#fc8d59', // stop_output_4
                        12500, // stop_input_4
                        '#ef6548', // stop_output_5
                        15000, // stop_input_5
                        '#d7301f', // stop_output_6
                        80000, // stop_input_6
                        '#7a0000'
                    ]
                ],
                'fill-extrusion-height': [ // Get `fill-extrusion-height` from the source `Proximity_to_Heavy_Traffic_Road` property
                    "interpolate", [
                        "linear"
                    ], // change height as we zoom in (needs to find a standard for all 
                    ["zoom"],
                    0, ["*", ['get', 'Proximity_to_Heavy_Traffic_Road'],
                        1
                    ], //This expression multiplies data value to determine height of polygon (need to fiddle with these)
                    13, .5
                ],
                'fill-extrusion-opacity': .9
            }
        },
        firstSymbolId
    );

    map.addLayer({
            'id': 'rsei-extrusion',
            'type': 'fill-extrusion',
            'source': 'rsei_data',
            'layout': {
                'visibility': 'none'
            },
            'paint': {
                // Get the `fill-extrusion-color` from the source `color` property.
                'fill-extrusion-color': [
                    "case",
                    ['boolean', ["feature-state", 'clicked'],
                        false
                    ], // If the 'clicked' variable of a feature is true, then color
                    "#00f7ff",
                    ['==', ["get", "Average_RSEI_Concentrations"],
                        null
                    ], //color null values a certain color
                    '#f5f542',
                    ["step", ["get",
                            "Average_RSEI_Concentrations"
                        ], // else color step based on bins
                        '#fff7ec', // stop_output_0
                        2000, // stop_input_0
                        '#fee8c8', // stop_output_1
                        5000, // stop_input_1
                        '#fdd49e', // stop_output_2
                        7500, // stop_input_2
                        '#fdbb84', // stop_output_3
                        10000, // stop_input_3
                        '#fc8d59', // stop_output_4
                        15000, // stop_input_4
                        '#ef6548', // stop_output_5
                        20000, // stop_input_5
                        '#d7301f', // stop_output_6
                        60000, // stop_input_6
                        '#7a0000'
                    ]
                ],
                'fill-extrusion-height': [ // Get `fill-extrusion-height` from the source `Average_RSEI_Concentrations` property
                    "interpolate", [
                        "linear"
                    ], // change height as we zoom in (needs to find a standard for all 
                    ["zoom"],
                    0, ["*", ['get', 'Average_RSEI_Concentrations'],
                        2
                    ], //This expression multiplies data value to determine height of polygon (need to fiddle with these)
                    13, .5
                ],
                'fill-extrusion-opacity': .9,
            }
        },
        firstSymbolId
    );
});

var current_layer = 'lead-extrusion'; // starting layer
const current_layer_data = { // used to define the source of current layer
    'lead-extrusion': 'lead_data',
    'nox-extrusion': 'nox_data',
    'ozone-extrusion': 'ozone_data',
    'pm25-extrusion': 'pm25_data',
    'traffic-extrusion': 'traffic_data',
    'rsei-extrusion': 'rsei_data'
};

const current_layer_var = {
    'lead-extrusion': 'Percent_Units_with_Lead',
    'nox-extrusion': 'Annual_Tons_Km2',
    'ozone-extrusion': 'Avg_Ozone_Conc_ppb_km2',
    'pm25-extrusion': 'Count_',
    'traffic-extrusion': 'Proximity_to_Heavy_Traffic_Road',
    'rsei-extrusion': 'Average_RSEI_Concentrations'
};

map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

map.on('idle', () => {
    if (!map.getLayer('lead-extrusion') || !map.getLayer('nox-extrusion') || !map.getLayer(
            'ozone-extrusion') ||
        !map.getLayer('pm25-extrusion') || !map.getLayer(
            'traffic-extrusion') || !map.getLayer(
            'rsei-extrusion')) {
        return;
    }

    // Enumerate ids of the layers.
    const toggleableLayerIds = ['lead-extrusion', 'nox-extrusion',
        'ozone-extrusion', 'pm25-extrusion', 'traffic-extrusion', 'rsei-extrusion'
    ];

    // Set up the corresponding toggle button for each layer.
    for (const id of toggleableLayerIds) {
        // Skip layers that already have a button set up.
        if (document.getElementById(id)) {
            continue;
        }

        // Create a link.
        const link = document.createElement('a');
        link.id = id;
        link.href = '#';
        link.textContent = id;
        link.className = 'inactive';

        // Show or hide layer when the toggle is clicked.
        link.onclick = function (e) {

            const clickedLayer = this.textContent;

            // preventDefault() tells the user agent that if the event does not get explicitly handled, 
            // its default action should not be taken as it normally would be.
            e.preventDefault();
            // The stopPropagation() method prevents further propagation of the current event in the capturing 
            // and bubbling phases. It does not, however, prevent any default behaviors from occurring; 
            // for instance, clicks on links are still processed. If you want to stop those behaviors, 
            // see the preventDefault() method.
            e.stopPropagation();

            const visibility = map.getLayoutProperty(
                clickedLayer,
                'visibility'
            );


            for (var j = 0; j < toggleableLayerIds.length; j++) { //Sets layer visibility
                if (clickedLayer === toggleableLayerIds[
                        j]) { //if layer clicked is the same as at current index of toggeable layers
                    layers.children[j].className = 'active'; //set as active css
                    map.setLayoutProperty(toggleableLayerIds[j], 'visibility',
                        'visible'); //set layer to visible
                    current_layer = toggleableLayerIds[j]; // set current layer for click highlight
                } else {
                    layers.children[j].className = ''; //give default styling
                    if (load == 0) {
                        layers.children[0].className = 'active';
                        load = load + 1;
                    }
                    map.setLayoutProperty(toggleableLayerIds[j], 'visibility',
                        'none'); //set layer to not visible
                }
            }
        };
        // in the menu place holder, insert the layer links.
        const layers = document.getElementById('layer_menu');
        layers.appendChild(link);
    }

    var polygonID = null; //id of polygon clicked on

    map.on('click', current_layer, function (e) {
        if (e.features.length > 0) {
            if (typeof polygonID ===
                'number') { // if the polygon id is no longer null (starting condition is null)
                map.removeFeatureState({ //remove click feature state (no longer blue colored)
                    source: current_layer_data[current_layer],
                    id: polygonID
                });
            }
            polygonID = e.features[0].id; // Get generated ID

            map.setFeatureState({ //set feature at polyon id to clicked=true, meaning it will become blue colored
                source: current_layer_data[current_layer],
                id: polygonID,
            }, {
                clicked: true
            });
            console.log(e.features[0].properties.Census_Tract)
            new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(`<strong>Census Tract:</strong> ${e.features[0].properties.Census_Tract}<br> <strong>Variable Value:</strong> ${e.features[0].properties[current_layer_var[current_layer]]}`)
                .addTo(map);

        }
    });
});

// Side bar opening 
function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.visibility = 'hidden';
    document.getElementById("main").style.marginLeft = "250px";
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    document.getElementById("main").style.visibility = 'visible';
}

// MAP CODE ABOVE ONLY