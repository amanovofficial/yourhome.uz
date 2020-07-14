var map;

DG.then(function () {
    map = DG.map('map', {
        center: [41.32104299, 69.28193847],
        zoom: 13
    });

    const url = '/blurbs?asynchronicQuery=true';
    fetch(url)
        .then((response) => {
            return response.json()
        })
        .then((COORDS) => {
            for (var i = 0; i < COORDS.length; i++) {
                DG.marker([COORDS[i].latitude, COORDS[i].longitude]).addTo(map).bindPopup(COORDS[i].hintContent);
            }
        })
});