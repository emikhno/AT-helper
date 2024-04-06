let db;
openDB();

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request.message, sender)

    switch (request.message) {
        case 'getTheme':
            return getTheme();
        case 'setTheme':
            return setTheme(request.payload)
        default:
            sendResponse({
                'message': browser.i18n.getMessage('unknownRequest')
            });
    }
});



function openDB() {
    const openRequest = indexedDB.open('AThelper', 1);

    openRequest.onerror = function () {
        console.error('Error:', openRequest.error);
    };

    openRequest.onupgradeneeded = function () {
        db = openRequest.result;

        if (!db.objectStoreNames.contains('settings')) {
            db.createObjectStore('settings', {keyPath: 'name'});
        }
        if (!db.objectStoreNames.contains('books')) {
            db.createObjectStore('books', {keyPath: 'id'});
        }
        if (!db.objectStoreNames.contains('typos')) {
            const typos = db.createObjectStore('typos', {keyPath: 'id', autoIncrement: true});
            typos.createIndex('book_index', 'book_id');
        }
        if (!db.objectStoreNames.contains('my_books_stats')) {
            const booksStats = db.createObjectStore('my_books_stats', {keyPath: 'id', autoIncrement: true});
            booksStats.createIndex('timestamp_index', 'timestamp');
        }
    };

    openRequest.onsuccess = function () {
        db = openRequest.result;

        db.onversionchange = function () {
            db.close();
            console.warn(browser.i18n.getMessage('dbOnVersionChange'));
        };

        db.onerror = function (event) {
            const request = event.target;
            console.error('Error:', request.error);
        };
    };
}

function getTheme() {
    if (db) {
        const request = db.transaction('settings')
                            .objectStore('settings')
                            .get('theme');

        return new Promise((resolve, reject) => {
            request.onsuccess = function() {
                console.log(1)
                resolve(request.result ? request.result.value : null);
            }

            request.onerror = function(event) {
                console.log(2)
                reject(event);
            }
        });
    } else {
        openDB();
    }
}

function setTheme(value) {
    if (db) {
        const transaction = db.transaction('settings', 'readwrite');
        transaction.objectStore('settings')
                    .put({
                        'name': 'theme',
                        'value': value
                    });

        return new Promise((resolve, reject) => {
            transaction.oncomplete = function() {
                resolve(true);
            }

            transaction.onerror = function(event) {
                reject(event);
            }
        });
    } else {
        openDB();
    }
}
