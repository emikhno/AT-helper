let db;
openDB();

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request.message, sender)

    switch (request.message) {
        case 'getTheme':
            return getTheme();
        case 'setTheme':
            return setTheme(request.payload);

        case 'saveTypo':
            return saveTypo(request.payload);
        case 'deleteTypo':
            return deleteTypo(request.payload);
        case 'getBookTypos':
            return getBookTypos(request.payload);

        case 'saveBook':
            return saveBook(request.payload);

        case 'getMyBooksStatsTimestamps':
            return getMyBooksStatsTimestamps();
        case 'getMyBooksStats':
            return getMyBooksStats(request.payload);
        case 'saveMyBooksStats':
            return saveMyBooksStats(request.payload);

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
            db.createObjectStore('my_books_stats', {keyPath: 'timestamp'});
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
                resolve(request.result ? request.result.value : null);
            }

            request.onerror = function(event) {
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

function saveTypo(typo) {
    if (db) {
        const transaction = db.transaction('typos', 'readwrite');
        transaction.objectStore('typos')
                    .put(typo);

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

function deleteTypo(typoId) {
    if (db) {
        const transaction = db.transaction('typos', 'readwrite');
        transaction.objectStore('typos')
                    .delete(typoId);

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

function getBookTypos(bookId) {
    if (db) {
        const request = db.transaction('typos')
                            .objectStore('typos')
                            .index('book_index')
                            .getAll(bookId);

        return new Promise((resolve, reject) => {
            request.onsuccess = function() {
                resolve(request.result);
            }

            request.onerror = function(event) {
                reject(event);
            }
        });
    } else {
        openDB();
    }
}

function saveBook(book) {
    if (db) {
        const transaction = db.transaction('books', 'readwrite');
        transaction.objectStore('books')
                    .put(book);

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

function getMyBooksStatsTimestamps() {
    if (db) {
        const request = db.transaction('my_books_stats')
                            .objectStore('my_books_stats')
                            .getAllKeys();

        return new Promise((resolve, reject) => {
            request.onsuccess = function() {
                resolve(request.result);
            }

            request.onerror = function(event) {
                reject(event);
            }
        });
    } else {
        openDB();
    }
}

function getMyBooksStats(timestamp) {
    if (db) {
        const request = db.transaction('my_books_stats')
                            .objectStore('my_books_stats')
                            .get(timestamp);

        return new Promise((resolve, reject) => {
            request.onsuccess = function() {
                resolve(request.result ? request.result.data : null);
            }

            request.onerror = function(event) {
                reject(event);
            }
        });
    } else {
        openDB();
    }
}

function saveMyBooksStats(stats) {
    if (db) {
        const transaction = db.transaction('my_books_stats', 'readwrite')
        transaction.objectStore('my_books_stats')
                    .put(stats);

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
