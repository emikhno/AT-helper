try {
    const books = document.querySelectorAll('.book-row');
    const now = new Date().getTime();
    const dateOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    }
    // Do not translate because this text is used for searching elements:
    const statsMap = new Map();
    statsMap.set('views', 'Просмотры');
    statsMap.set('likes', 'Понравилось');
    statsMap.set('libs', 'Добавили в библиотеку');
    statsMap.set('comments', 'Комментарии');

    browser.runtime.sendMessage({
        message: 'getMyBooksStatsTimestamps'
    }).then(response => {
        const timestamps = response;

        if (timestamps.length > 0) {
            const timestampLast = timestamps[timestamps.length - 1];
            const dateLast = new Date(timestampLast).toLocaleString("ru", dateOptions);
            const showLastDate = document.createElement('div');
            showLastDate.style.marginBottom = '10px';
            showLastDate.textContent = browser.i18n.getMessage('lastScanText') + ' ' + dateLast;
            document.getElementById('search-results').prepend(showLastDate);

            return browser.runtime.sendMessage({
                message: 'getMyBooksStats',
                payload: timestampLast
            });
        }
    }).then((response) => {
        handleBooksStats(response);
    }).catch((error) => {
        console.error(error);
    });



    function handleBooksStats(dataLast = null) {
        const dataCurrent = {
            timestamp: now,
            data: []
        }

        for (let i = 0; i < books.length; i++) {
            dataCurrent.data[i] = {};

            const bookTitle = books[i].querySelector('.book-title a').textContent;
            dataCurrent.data[i].book_title = bookTitle;

            const statsLast = dataLast ? dataLast.find(book => book.book_title === bookTitle) : null;

            for (let statNameEnglish of statsMap.keys()) {
                dataCurrent.data[i][statNameEnglish] = handleBookStat(books[i], statsLast, statNameEnglish);
            }
        }

        browser.runtime.sendMessage({
            message: 'saveMyBooksStats',
            payload: dataCurrent
        }).catch((error) => {
            console.error(error);
        });
    }

    function handleBookStat(book, statsLast, statNameEnglish) {
        const statElement = book.querySelector('[data-hint="' + statsMap.get(statNameEnglish) + '"]');
        let statCurrent = statElement.outerText;
        const isShortStatK = statCurrent.search(/\d+K$/) !== -1;
        const isShortStatM = statCurrent.search(/\d+М$/) !== -1;
        statCurrent = statCurrent.replace(/\D/g, '');
        statCurrent = isShortStatM ? parseFloat(statCurrent) : parseInt(statCurrent);
        let statLast = statsLast ? statsLast[statNameEnglish] : null;
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
        return statCurrent;
    }
} catch (error) {
    console.error('Error:', error);
}
