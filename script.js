// Initialize the map
const map = L.map('map').setView([20.5937, 78.9629], 5); // Center of India

// Add the tile layer (OpenStreetMap as a base map)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Sample data for markers
const locations = [
    { name: "Taj Mahal", lat: 27.1751, lon: 78.0421, description: "A famous landmark in Agra." },
    { name: "Gateway of India", lat: 18.9220, lon: 72.8347, description: "Historic monument in Mumbai." },
    { name: "Red Fort", lat: 28.6562, lon: 77.2410, description: "Historic fort in Delhi." }
];

const markers = [];
let savedMarkers = JSON.parse(localStorage.getItem("markers")) || [];

// Function to create a marker
function createMarker(lat, lon, name, description, color = 'blue') {
    const icon = L.icon({
        iconUrl: `https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|${color}`,
        iconSize: [21, 34],
        iconAnchor: [10, 34],
        popupAnchor: [0, -34],
    });

    const marker = L.marker([lat, lon], { icon }).addTo(map);
    marker.bindPopup(`<b>${name}</b><br>${description}`);
    markers.push(marker);

    marker.on('click', function () {
        if (confirm("Do you want to remove this marker?")) {
            map.removeLayer(marker);
            updateLocationList();
        }
    });
    updateLocationList();
}

// Load predefined locations
locations.forEach(location => {
    createMarker(location.lat, location.lon, location.name, location.description);
});

// Search function
function searchLocation() {
    const searchInput = document.getElementById('search').value.toLowerCase();
    const foundLocation = locations.find(location => location.name.toLowerCase().includes(searchInput));

    if (foundLocation) {
        map.setView([foundLocation.lat, foundLocation.lon], 12);
    } else {
        alert("Location not found! Please try another search.");
    }
}

// Add click event to the map to add markers
map.on('click', function (e) {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;

    const name = prompt("Enter a name for this location:");
    const description = prompt("Enter a description for this location:");
    const color = prompt("Enter a color for the marker (blue, green, red):", "blue");

    if (name && description) {
        createMarker(lat, lon, name, description, color);
    }
});

// Save markers to localStorage
function saveMarkers() {
    const markerData = markers.map(marker => {
        return {
            lat: marker.getLatLng().lat,
            lon: marker.getLatLng().lng,
            name: marker.getPopup().getContent().match(/<b>(.*?)<\/b>/)[1],
            description: marker.getPopup().getContent().split("<br>")[1],
        };
    });

    localStorage.setItem("markers", JSON.stringify(markerData));
    alert("Markers saved!");
}

// Load markers from localStorage
function loadMarkers() {
    savedMarkers.forEach(markerData => {
        createMarker(markerData.lat, markerData.lon, markerData.name, markerData.description);
    });
}

// Update the list of locations
function updateLocationList() {
    const list = document.getElementById("locationListItems");
    list.innerHTML = ""; // Clear the list

    markers.forEach((marker, index) => {
        const li = document.createElement("li");
        const latLng = marker.getLatLng();
        const name = marker.getPopup().getContent().match(/<b>(.*?)<\/b>/)[1];

        li.innerHTML = `${name} <button onclick="centerMap(${latLng.lat}, ${latLng.lng})">Go to Location</button> <button onclick="removeMarker(${index})">Remove</button>`;
        list.appendChild(li);
    });
}

// Center map on a location
function centerMap(lat, lon) {
    map.setView([lat, lon], 12);
}

// Remove a marker
function removeMarker(index) {
    map.removeLayer(markers[index]);
    markers.splice(index, 1);
    updateLocationList();
}

// Attach event listeners to buttons
document.getElementById('searchButton').addEventListener('click', searchLocation);
document.getElementById('saveMarkers').addEventListener('click', saveMarkers);
document.getElementById('loadMarkers').addEventListener('click', loadMarkers);

// Load markers on page load
if (savedMarkers.length > 0) {
    loadMarkers();
}
