try {
    const AThelper = window.AThelper;
    const extPrefix = AThelper.prefix;
    const books = document.querySelectorAll('.book-row');
    const now = Date.now();
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

            // Create date selector
            const showLastDate = document.createElement('div');
            showLastDate.style.marginBottom = '10px';
            showLastDate.textContent = browser.i18n.getMessage('lastScanText') + ' ';

            const dateSelector = document.createElement('select');
            dateSelector.classList.add('form-control');
            dateSelector.style.width = '25%';
            dateSelector.style.display = 'inline';

            const oneDay = 1000*60*60*24;
            timestamps.forEach(timestamp => {
                if ((now - timestamp)/oneDay > 30) {
                    browser.runtime.sendMessage({
                        message: 'deleteMyBooksStats',
                        payload: timestamp
                    });
                    return;
                }

                const dateSelectorOption = document.createElement('option');
                dateSelectorOption.value = timestamp;
                dateSelectorOption.textContent = new Date(timestamp).toLocaleString("ru", dateOptions);
                if (timestamp === timestampLast) {
                    dateSelectorOption.selected = true;
                }
                dateSelector.prepend(dateSelectorOption);
            });

            dateSelector.addEventListener('change', (event) => {
                browser.runtime.sendMessage({
                    message: 'getMyBooksStats',
                    payload: +event.target.value
                }).then((response) => {
                    handleBooksStats(response, false);
                }).catch((error) => {
                    console.error(error);
                });
            });

            showLastDate.appendChild(dateSelector);
            document.getElementById('search-results').prepend(showLastDate);

            // Get last timestamp data
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



    function handleBooksStats(dataLast = null, shouldUpdateDB = true) {
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

        if (shouldUpdateDB) {
            browser.runtime.sendMessage({
                message: 'saveMyBooksStats',
                payload: dataCurrent
            }).catch((error) => {
                console.error(error);
            });
        }
    }

    function handleBookStat(book, statsLast, statNameEnglish) {
        const statElement = book.querySelector('[data-hint="' + statsMap.get(statNameEnglish) + '"]');
        const diffElementOld = statElement.querySelector(`.${extPrefix}statDiff`);
        if (diffElementOld) {
            diffElementOld.remove();
        }

        let statCurrent = statElement.textContent;
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
            diffElement.classList.add(`${extPrefix}statDiff`)
            diffElement.classList.add(diff > 0
                ? 'AThelper__color_green'
                : (diff < 0
                    ? 'AThelper__color_red'
                    : 'AThelper__color_gray'));
            diffElement.textContent = '(' + (diff > 0 ? '+' : '') + diff + ')';
            statElement.appendChild(diffElement);
        }
        return statCurrent;
    }
} catch (error) {
    console.error('Error:', error);
}
