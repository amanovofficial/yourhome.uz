DG.then(function () {
    var map,
        clickedElement = document.getElementById('clicked_element'),
        map = DG.map('map', {
            center: [41.32104299, 69.28193847],
            zoom: 13
        });

    let marker = DG.marker([41, 69], {
        label: 'Местоположение дома'
    })

    marker.addTo(map)
    map.on('click', function (e) {
        let latitude = document.querySelector('#latitude')
        let longitude = document.querySelector('#longitude')

        marker.setLatLng(e.latlng)
        latitude.value = e.latlng.lat
        longitude.value = e.latlng.lng

        if (latitude.value !== '' && longitude.value !== '') {
            let mapToggle = document.querySelector('#mapToggle')
            mapToggle.classList.remove('Red')
            mapToggle.classList.add('customBGColor')
            mapToggle.setAttribute('title', 'Местоположение успешно добавлено, нажмите чтобы изменить')
            let ButtonTextContent = document.querySelector('#textbtn')
            ButtonTextContent.innerHTML = 'Изменить местоположение'
        }
    });
});

