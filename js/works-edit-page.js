const dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
}
const dateCurrent = new Date().toLocaleString("ru", dateOptions);
const dateLast = localStorage.getItem(`${extPrefix}dateLast`);

const books = document.querySelectorAll('.book-row');

if (dateLast !== null) {
    const showLastDate = document.createElement('div');
    showLastDate.style.marginBottom = '10px';
    showLastDate.textContent = 'Последнее сканирование: ' + dateLast;
    document.getElementById('search-results').prepend(showLastDate);
}

for (let i = 0; i < books.length; i++) {
	const bookName = books[i].querySelector('.book-title a').textContent;

    handleBookStat(books[i], bookName, 'Просмотры');
    handleBookStat(books[i], bookName, 'Понравилось');
    handleBookStat(books[i], bookName, 'Добавили в библиотеку');
    handleBookStat(books[i], bookName, 'Комментарии');
}

localStorage.setItem(`${extPrefix}dateLast`, dateCurrent);



function handleBookStat(book, bookName, statName) {
    const statElement = book.querySelector('[data-hint="' + statName + '"]');
    const statCurrent = parseInt(statElement.outerText.replace(/\D/g, ''));
    const statLast = localStorage.getItem(`${extPrefix}${bookName}: ${statName}`);
    if (statLast !== null) {
        const diff = statCurrent - parseInt(statLast);
        const diffColor = diff > 0 ? '#4CAF50' : (diff < 0 ? '#F44336' : 'inherit');
        const diffSign = diff > 0 ? '+' : '';
        statElement.innerHTML = statElement.innerHTML + `(<span style="color: ${diffColor}">${diffSign}${diff}</span>)`;
    }
    localStorage.setItem(`${extPrefix}${bookName}: ${statName}`, statCurrent);
}
