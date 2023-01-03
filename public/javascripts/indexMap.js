mapboxgl.accessToken = mapToken

const map = new mapboxgl.Map({
    container: 'index-map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [20.460005315344528, 44.816095610744426],
    zoom: 10,
    projection: 'globe'
});
map.on('style.load', () => {
    map.setFog({});
});
map.addControl(new mapboxgl.NavigationControl());

for(let place of places) {
    let color = null;
    if (place.category === "Culture") { 
        color = { "color": "#0d6efd" } 
    }else if(place.category === "Sport") { 
        color = { "color": "#198754" }
    }else if(place.category === "Entertainment") { 
        color = { "color": "#0dcaf0" }
    }else if(place.category === "Education") { 
        color = { "color": "#dc3545" }
    }else if(place.category === "Nature") { 
        color = { "color": "#ffc107" }
    };
    new mapboxgl.Marker(color)
    .setLngLat([place.geometry.longtitude, place.geometry.latitude])
    .setPopup(
        new mapboxgl
        .Popup({ offset: 25 })
        .setHTML(`<a href="/${place._id}">${place.title}</a><p>${place.location}</p>`)
    )
    .addTo(map);
}
