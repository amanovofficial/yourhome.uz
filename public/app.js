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

