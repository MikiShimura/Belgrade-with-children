mapboxgl.accessToken = mapToken

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [place.geometry.longtitude, place.geometry.latitude],
    zoom: 12,
    projection: 'globe'
});
map.on('style.load', () => {
    map.setFog({});
});
new mapboxgl.Marker()
.setLngLat([place.geometry.longtitude, place.geometry.latitude])
.addTo(map);