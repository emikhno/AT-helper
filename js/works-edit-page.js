(function (AThelper) {
    const bsPrefix = AThelper.prefix + '_bookStat_';
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
        showLastDate.textContent = browser.i18n.getMessage("lastScanText") + ' ' + dateLast;
        document.getElementById('search-results').prepend(showLastDate);
    }

    for (let i = 0; i < books.length; i++) {
        const bookName = books[i].querySelector('.book-title a').textContent;

        handleBookStat(books[i], bookName, 'Просмотры'); // Do not translate because this text is used for searching elements
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

            const diffElement = document.createElement('span');
            diffElement.style.color = diff > 0 ? '#4CAF50' : (diff < 0 ? '#F44336' : '#757575');
            diffElement.textContent = '(' + (diff > 0 ? '+' : '') + diff + ')';
            statElement.appendChild(diffElement);
        }
        localStorage.setItem(`${bsPrefix}${bookName}: ${statName}`, statCurrent);
    }
}(window.AThelper));
