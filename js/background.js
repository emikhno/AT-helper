importScripts("./browser-polyfill.js");

try {
    let db;
    openDB();

    browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
        // console.log(request.message, sender)

        switch (request.message) {
            case 'getTheme':
                return getTheme();
            case 'setTheme':
                const setThemeRequest = setTheme(request.payload);
                setThemeRequest.then(() => {
                    return browser.tabs.query({
                        url: 'https://author.today/*'
                    });
                }).then((response) => {
                    response.forEach((tab) => {
                        browser.tabs.sendMessage(
                            tab.id,
                            {
                                message: 'applyTheme',
                                payload: request.payload
                            }
                        )
                    });
                }).catch(error => {
                    console.error('Error:', error);
                });
                break;

            case 'getBlogTopicFilter':
                return getBlogTopicFilter();
            case 'setBlogTopicFilter':
                return setBlogTopicFilter(request.payload);

            case 'getLikesFilter':
                return getLikesFilter();
            case 'setLikesFilter':
                return setLikesFilter(request.payload);

            case 'saveTypo':
                return saveTypo(request.payload);
            case 'deleteTypo':
                return deleteTypo(request.payload);
            case 'getBookTypos':
                return getBookTypos(request.payload);
            case 'getBooksTypos':
                return getBooksTypos();

            case 'getBook':
                return getBook(request.payload);
            case 'saveBook':
                return saveBook(request.payload);

            case 'getMyBooksStatsTimestamps':
                return getMyBooksStatsTimestamps();
            case 'getMyBooksStats':
                return getMyBooksStats(request.payload);
            case 'saveMyBooksStats':
                return saveMyBooksStats(request.payload);
            case 'deleteMyBooksStats':
                return deleteMyBooksStats(request.payload);

            case 'getProfileInfo':
                return getProfileInfo(request.payload);
            case 'getProfilesInfo':
                return getProfilesInfo();
            case 'setProfileInfo':
                return setProfileInfo(request.payload);
            case 'deleteProfileInfo':
                return deleteProfileInfo(request.payload);

            case 'exportDB':
                return exportDB();
            case 'importDB':
                return importDB(request.payload);

            default:
                sendResponse({
                    'message': browser.i18n.getMessage('unknownRequest')
                });
        }
    });



    function openDB() {
        const openRequest = indexedDB.open('AThelper', 2);

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
            if (!db.objectStoreNames.contains('profiles')) {
                db.createObjectStore('profiles', {keyPath: 'id'});
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

    function getBlogTopicFilter() {
        if (db) {
            const request = db.transaction('settings')
                                .objectStore('settings')
                                .get('blog_topic_filter');

            return new Promise((resolve, reject) => {
                request.onsuccess = function() {
                    resolve(request.result ? request.result.values : null);
                }

                request.onerror = function(event) {
                    reject(event);
                }
            });
        } else {
            openDB();
        }
    }

    function setBlogTopicFilter(value) {
        if (db) {
            const transaction = db.transaction('settings', 'readwrite');
            transaction.objectStore('settings')
                        .put({
                            'name': 'blog_topic_filter',
                            'values': value
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

    function getLikesFilter() {
        if (db) {
            const request = db.transaction('settings')
                                .objectStore('settings')
                                .get('likes_filter');

            return new Promise((resolve, reject) => {
                request.onsuccess = function() {
                    resolve(request.result ? request.result.values : null);
                }

                request.onerror = function(event) {
                    reject(event);
                }
            });
        } else {
            openDB();
        }
    }

    function setLikesFilter(value) {
        if (db) {
            const transaction = db.transaction('settings', 'readwrite');
            transaction.objectStore('settings')
                        .put({
                            'name': 'likes_filter',
                            'values': value
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

    function getBooksTypos() {
        if (db) {
            const request = db.transaction('typos')
                                .objectStore('typos')
                                .getAll();

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

    function getBook(bookId) {
        if (db) {
            const request = db.transaction('books')
                                .objectStore('books')
                                .get(bookId);

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

    function deleteMyBooksStats(timestamp) {
        if (db) {
            const transaction = db.transaction('my_books_stats', 'readwrite')
            transaction.objectStore('my_books_stats')
                        .delete(timestamp);

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

    function getProfileInfo(profileId) {
        if (db) {
            const request = db.transaction('profiles')
                                .objectStore('profiles')
                                .get(profileId);

            return new Promise((resolve, reject) => {
                request.onsuccess = function() {
                    resolve(request.result ? request.result.info : null);
                }

                request.onerror = function(event) {
                    reject(event);
                }
            });
        } else {
            openDB();
        }
    }

    function getProfilesInfo() {
        if (db) {
            const request = db.transaction('profiles')
                                .objectStore('profiles')
                                .getAll();

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

    function setProfileInfo(profile) {
        if (db) {
            const transaction = db.transaction('profiles', 'readwrite');
            transaction.objectStore('profiles')
                        .put(profile);

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

    function deleteProfileInfo(profileId) {
        if (db) {
            const transaction = db.transaction('profiles', 'readwrite')
            transaction.objectStore('profiles')
                        .delete(profileId);

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

    function exportDB() {
        if (!db) {
            return;
        }

        const transaction = db.transaction([...db.objectStoreNames]);
        const requests = [...db.objectStoreNames].map(table => {
            const request = transaction.objectStore(table)
                                        .getAll();

            return new Promise((resolve, reject) => {
                request.onsuccess = function () {
                    resolve({
                        table: table,
                        data: request.result
                    });
                }

                request.onerror = function (event) {
                    reject(event);
                }
            });
        });

        return Promise.all(requests);
    }

    function importDB(importedData) {
        if (db) {
            const requests = importedData.map(table => {
                const transaction = db.transaction(table.table, 'readwrite');
                const store = transaction.objectStore(table.table);

                table.data.forEach(data => {
                    store.put(data);
                });

                return new Promise((resolve, reject) => {
                    transaction.oncomplete = function () {
                        resolve(true);
                    }

                    transaction.onerror = function (event) {
                        reject(event);
                    }
                });
            });

            return Promise.all(requests);
        } else {
            openDB();
        }
    }
} catch (error) {
    console.error('Error:', error);
}
