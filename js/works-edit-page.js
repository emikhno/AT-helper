const bsPrefix = extPrefix + '_bookStat_';
const dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
}
const dateCurrent = new Date().toLocaleString("ru", dateOptions);
const dateLast = localStorage.getItem(`${bsPrefix}dateLast`);

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

localStorage.setItem(`${bsPrefix}dateLast`, dateCurrent);



function handleBookStat(book, bookName, statName) {
    const statElement = book.querySelector('[data-hint="' + statName + '"]');
    let statCurrent = statElement.outerText;
    const isShortStatK = statCurrent.search(/\d+K$/) !== -1;
    const isShortStatM = statCurrent.search(/\d+М$/) !== -1;
    statCurrent = statCurrent.replace(/\D/g, '');
    statCurrent = isShortStatM ? parseFloat(statCurrent) : parseInt(statCurrent);
    let statLast = localStorage.getItem(`${bsPrefix}${bookName}: ${statName}`);
    if (statLast !== null) {
        statLast = isShortStatM ? parseFloat(statLast) : parseInt(statLast);
        let diff = 0;
        if (isShortStatK && statLast > 999) {
            diff = statCurrent - 10;
        } else if (isShortStatM && statLast > 999) {
            diff = statCurrent - 1;
        } else {
            diff = statCurrent - statLast;
        }
        const diffColor = diff > 0 ? '#4CAF50' : (diff < 0 ? '#F44336' : 'inherit');
        const diffSign = diff > 0 ? '+' : '';
        statElement.innerHTML = statElement.innerHTML + `(<span style="color: ${diffColor}">${diffSign}${diff}</span>)`;
    }
    localStorage.setItem(`${bsPrefix}${bookName}: ${statName}`, statCurrent);
}
