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
    pitch: 45, // The angle the map camera starts at
    maxZoom: 12,
    minZoom: 6,
    maxBounds: [
        [-133.68163130881976, 39.32091789058595],
        [-109.06713519997989, 54.215746760525796]
    ]
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
                    "#1cd4d0",
                    ['==', ["get", "normal_lead"],
                        null
                    ], //color null values a certain color, testing for now
                    '#dcdee0',
                    ["step", ["get",
                            "normal_lead"
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
                    0, ["*", ['get', 'normal_lead'],
                        2000
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
                    "#1cd4d0",
                    ['==', ["get", "normal_nox"],
                        null
                    ], //color null values a certain color
                    '#dcdee0',
                    ["step", ["get", "normal_nox"], // else color step based on bins
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
                'fill-extrusion-height': [ // Get `fill-extrusion-height` from the source `Annual_Tons_Km2` property
                    "interpolate", [
                        "linear"
                    ], // change height as we zoom in (needs to find a standard for all 
                    ["zoom"],
                    0, ["*", ['get', 'normal_nox'],
                        2000
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
                    "#1cd4d0",
                    ['==', ["get", "normal_ozone"],
                        null
                    ], //color null values a certain color
                    '#dcdee0',
                    ["step", ["get", "normal_ozone"], // else color step based on bins
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
                'fill-extrusion-height': [ // Get `fill-extrusion-height` from the source `Avg_Ozone_Conc_ppb_km2` property
                    "interpolate", [
                        "linear"
                    ], // change height as we zoom in (needs to find a standard for all 
                    ["zoom"],
                    0, ["*", ['get', 'normal_ozone'],
                        2000
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
                    "#1cd4d0",
                    ['==', ["get", "normal_count"], null], //color null values a certain color
                    '#dcdee0',
                    ["step", ["get", "normal_count"], // else color step based on bins
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
                'fill-extrusion-height': [ // Get `fill-extrusion-height` from the source `Count_` property
                    "interpolate", [
                        "linear"
                    ], // change height as we zoom in (needs to find a standard for all 
                    ["zoom"],
                    0, ["*", ['get', 'normal_count'],
                        2000
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
                    "#1cd4d0",
                    ['==', ["get", "normal_traffic"],
                        null
                    ], //color null values a certain color
                    '#dcdee0',
                    ["step", ["get",
                            "normal_traffic"
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
                'fill-extrusion-height': [ // Get `fill-extrusion-height` from the source `Proximity_to_Heavy_Traffic_Road` property
                    "interpolate", [
                        "linear"
                    ], // change height as we zoom in (needs to find a standard for all 
                    ["zoom"],
                    0, ["*", ['get', 'normal_traffic'],
                        2000
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
                    "#1cd4d0",
                    ['==', ["get", "normal_rsei"],
                        null
                    ], //color null values a certain color
                    '#dcdee0',
                    ["step", ["get",
                            "normal_rsei"
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
                'fill-extrusion-height': [ // Get `fill-extrusion-height` from the source `Average_RSEI_Concentrations` property
                    "interpolate", [
                        "linear"
                    ], // change height as we zoom in (needs to find a standard for all 
                    ["zoom"],
                    0, ["*", ['get', 'normal_rsei'],
                        2000
                    ], //This expression multiplies data value to determine height of polygon (need to fiddle with these)
                    13, .5
                ],
                'fill-extrusion-opacity': .9,
            }
        },
        firstSymbolId
    );
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right'); // add map controls

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

const current_layer_var = { //used to get the variable to be shown in popup
    'lead-extrusion': 'Percent_Units_with_Lead',
    'nox-extrusion': 'Annual_Tons_Km2',
    'ozone-extrusion': 'Avg_Ozone_Conc_ppb_km2',
    'pm25-extrusion': 'Count_',
    'traffic-extrusion': 'Proximity_to_Heavy_Traffic_Road',
    'rsei-extrusion': 'Average_RSEI_Concentrations'
};

const current_layer_var_text = { //Used in displaying variable names in popup window
    'lead-extrusion': 'Percent of Housing Units Built With Lead:',
    'nox-extrusion': 'Diesel Emission Levels of NOx (Annual Tons/Km2):',
    'ozone-extrusion': 'Average Ozone Concentration (ppb/Km2):',
    'pm25-extrusion': 'Average PM 2.5 Pollution Count:',
    'traffic-extrusion': 'Population Estimated to Live Near Busy Roadways:',
    'rsei-extrusion': 'Average Toxicity-Weighted Concentration of Chemical Pollutants (RSEI):'
};

map.on('idle', () => {
    
    var popups = document.getElementsByClassName("mapboxgl-popup");

    const toggleableLayerIds = ['lead-extrusion', 'nox-extrusion',
        'ozone-extrusion', 'pm25-extrusion', 'traffic-extrusion', 'rsei-extrusion'
    ];

    const id_text = {
        'lead-extrusion': 'Lead in Housing Units',
        'nox-extrusion': 'Diesel and NOX Emissions',
        'ozone-extrusion': 'Ozone Concentrations',
        'pm25-extrusion': 'PM 2.5 Air Pollution Count',
        'traffic-extrusion': 'Proximity to Heavy Traffic',
        'rsei-extrusion': 'Hazardous Chemical Releases'
    };

    const popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true
    });

    if (!map.getLayer('lead-extrusion') || !map.getLayer('nox-extrusion') || !map.getLayer(
            'ozone-extrusion') ||
        !map.getLayer('pm25-extrusion') || !map.getLayer(
            'traffic-extrusion') || !map.getLayer(
            'rsei-extrusion')) {
        return;
    }

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
        link.textContent = id_text[id];
        link.className = 'inactive';

        // Show or hide layer when the toggle is clicked.
        link.onclick = function (e) {
            const clickedLayer = this.id;
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
        }
    });

    map.on('styledata', () => { //whenever map layers change styling, only happens when layer visibility is changed
        popup.remove(); //remove all popups
        map.removeFeatureState({ //remove click feature state (no longer blue colored)
            source: current_layer_data[current_layer],
            id: polygonID
        });
    });

    map.on('click', current_layer, function (e) { //when a polygon is clicked on
        popup_close() //close all other popups
        popup.setLngLat(e.lngLat) //change popup location
        popup.setHTML(`<strong>Census Tract:</strong> #${e.features[0].properties.Census_Tract}<br> <strong>${current_layer_var_text[current_layer]}</strong> ${e.features[0].properties[current_layer_var[current_layer]]}`)
        //change popup text
        popup.addTo(map); //add to map
    });

    function popup_close() { // this is a simple function that iterates through all popups and closes them
        for (var i = 0; i < popups.length; i++) {
            popups[i].remove();
        }
    }

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