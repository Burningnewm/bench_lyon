
// Key API to access mapBox API please enter your own ^^
const MAP_API_TOKEN = "YOUR API TOKEN HERE";

// Base URL to acces Lyon's open data
const BASE_URL =  "https://download.data.grandlyon.com/ws/grandlyon/adr_voie_lieu.adrbanc_latest/all.json?maxfeatures=-1&start=1"


// To create icon constructeur with leaflet
var BenchIcon = L.Icon.extend({
    options: {
        iconSize:     [38, 95],
        iconAnchor:   [22, 94],
        popupAnchor:  [-3, -76]
    }
});
//To create specific icons based on type of bench
var benchBeton = new BenchIcon({iconUrl: 'benchBeton.svg'}),
    benchMetal = new BenchIcon({iconUrl: 'benchMetal.svg'}),
    benchNull = new BenchIcon({iconUrl: 'benchNull.svg'}),
    benchStone = new BenchIcon({iconUrl: 'bench-park.svg'}),
    benchWood = new BenchIcon({iconUrl: 'benchWood.svg'});    

// To get map of Lyon
var mymap = L.map('mapid').setView([45.7640 , 4.8357],14);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',{
        attribution : 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11', // mapbox/satellite-v9 for satellite vue
        tileSize: 512,
        zoomOffset: -1,
        accessToken: MAP_API_TOKEN
    }).addTo(mymap);

//to create marker clusters groups with Marker Cluster pluggin
var markers = L.markerClusterGroup();

//Async function to retrieve date from Lyon's open Data website
async function benchesLyon(){
    const responses = await fetch(BASE_URL);
        if (responses.status !== 200){
            console.log(responses.status);
            return;
        }
    const elements = await responses.json();
    return elements;       
}

// To asign each data point with its corresponding bench type
function benchesTypes(){
    benchesLyon().then(data => {
    data.values.forEach(element => { 
        let data_marker;
                 
        switch(element.materiau){
            case "béton" :
                data_marker = L.marker([element.lat, element.lon], {icon : benchBeton});
                data_marker.bindPopup(`le materiau est du ${element.materiau}`);
                markers.addLayer(data_marker);
                break;
            case  "bois":
                data_marker = L.marker([element.lat, element.lon], {icon : benchWood});
                data_marker.bindPopup(`le materiau est du ${element.materiau}`);
                markers.addLayer(data_marker);
                break;
            case "pierre" :
                data_marker = L.marker([element.lat, element.lon], {icon : benchStone});
                data_marker.bindPopup(`le materiau est de la ${element.materiau}`);
                markers.addLayer(data_marker);
                break;
            case "métal":
                data_marker = L.marker([element.lat, element.lon], {icon : benchMetal});
                data_marker.bindPopup(`le materiau est du ${element.materiau}`);
                markers.addLayer(data_marker);
                break;
            default :
                data_marker = L.marker([element.lat, element.lon], {icon : benchNull});
                data_marker.bindPopup(`Le materiau utilisé est inconnus, allez y faire un tour pour le découvrir`);
                markers.addLayer(data_marker);
                break;
        }
}); 
}).catch(err => {
    console.log(err);
})
}
//adding layers for cluster groups
mymap.addLayer(markers);

//calling benTypes function
benchesTypes();


    
