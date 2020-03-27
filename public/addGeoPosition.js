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

document.querySelector('#mapToggle').addEventListener('click', () => {
    let map = document.querySelector('#map')
    let hideButton = document.querySelector('#hideButton')

    if (map.classList.contains('hide')) {
        map.classList.remove('hide')
        hideButton.classList.remove('hide')
    }
})

document.querySelector('#hideButton').addEventListener('click', () => {

    let hideButton = document.querySelector('#hideButton')
    let map = document.querySelector('#map')

    if (!hideButton.classList.contains('hide')) {
        hideButton.classList.add('hide')
    }
    if (!map.classList.contains('hide')) {
        map.classList.add('hide')
    }
})
