function toDate(date) {
    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

document.querySelectorAll('.date').forEach(item => {
    item.innerHTML = `<li class="date"><strong>Добавлено в:</strong>  ${toDate(item.textContent)}</li>`
})

const mapToggle = document.querySelector('#mapToggle');
if(mapToggle){
    mapToggle.addEventListener('click', () => {
        let map = document.querySelector('#map')
        let hideButton = document.querySelector('#hideButton')
    
        if (map.classList.contains('hide')) {
            map.classList.remove('hide')
            hideButton.classList.remove('hide')
        }
    })
}

 
const hideButton = document.querySelector('#hideButton')
if(hideButton){
    hideButton.addEventListener('click', () => {

        let hideButton = document.querySelector('#hideButton')
        let map = document.querySelector('#map')
    
        if (!hideButton.classList.contains('hide')) {
            hideButton.classList.add('hide')
        }
        if (!map.classList.contains('hide')) {
            map.classList.add('hide')
        }
    })
}
