try {
    const AThelper = window.AThelper = {};
    const extPrefix = AThelper.prefix = 'AThelper__';

    // Open Indexed Data Base
    const openRequest = indexedDB.open('AThelper', 1);

    openRequest.onerror = function () {
        console.error('Error:', openRequest.error);
    };

    openRequest.onupgradeneeded = function () {
        const db = openRequest.result;

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
        const db = AThelper.db = openRequest.result;
        setTheme();

        db.onversionchange = function () {
            db.close();
            console.warn(browser.i18n.getMessage('dbOnVersionChange'));
        };

        db.onerror = function (event) {
            const request = event.target;
            console.error('Error:', request.error);
        };
    };

    createMainMenu();
    createModalWindow();

    browser.runtime.onMessage.addListener(handlePrivilegedRequests);



    function handlePrivilegedRequests(request, sender, response) {
        switch (request.message) {
            case 'getTheme':
                response({
                    'message': AThelper.themeCurrent
                })
                break;
            case 'setTheme':
                if (request.value === 'dark') {
                    setDarkTheme();
                } else {
                    setDefaultTheme();
                }
                break;
            default: response({
                'message': browser.i18n.getMessage('unknownRequest')
            });
        }
        // console.log(request.message)
    }

    function setTheme() {
        const themeToggle = document.getElementById(`${extPrefix}themeToggle`);
        themeToggle.addEventListener('click', () => {
            if (!AThelper.themeCurrent || AThelper.themeCurrent === 'default') {
                setDarkTheme();
            } else {
                setDefaultTheme();
            }
        });

        const isMobileLayout = document.querySelector('.mobile-layout') || document.querySelector('#reader-layout');

        const getThemeRequest = AThelper.db.transaction('settings')
                                            .objectStore('settings')
                                            .get('theme');
        getThemeRequest.onsuccess = function() {
            AThelper.themeCurrent = getThemeRequest.result ? getThemeRequest.result.value : null;
            if (AThelper.themeCurrent === 'dark' && !isMobileLayout) {
                setDarkTheme();
            }
            if (isMobileLayout) {
                themeToggle.classList.add(`${extPrefix}d-none`);
                document.body.classList.remove(`${extPrefix}theme_dark`);
            }
        }
    }

    function setDarkTheme() {
        if (AThelper.themeCurrent !== 'dark') {
            AThelper.themeCurrent = 'dark';
            AThelper.db.transaction('settings', 'readwrite')
                        .objectStore('settings')
                        .put({
                            'name': 'theme',
                            'value': 'dark'
                        });
        }

        document.body.classList.add(`${extPrefix}theme_dark`);
        document.getElementById(`${extPrefix}themeToggle_path`).setAttribute('fill', '#FFFFFF');
        document.getElementById(`${extPrefix}typoIcon_path`).setAttribute('stroke', '#FFFFFF');
        document.getElementById(`${extPrefix}typosList_path`).setAttribute('stroke', '#FFFFFF');
    }

    function setDefaultTheme() {
        AThelper.themeCurrent = 'default';
        AThelper.db.transaction('settings', 'readwrite')
                    .objectStore('settings')
                    .put({
                        'name': 'theme',
                        'value': 'default'
                    });

        document.body.classList.remove(`${extPrefix}theme_dark`);
        document.getElementById(`${extPrefix}themeToggle_path`).setAttribute('fill', '#212121');
        document.getElementById(`${extPrefix}typoIcon_path`).setAttribute('stroke', '#212121');
        document.getElementById(`${extPrefix}typosList_path`).setAttribute('stroke', '#212121');
    }

    function createMainMenu() {
        const mainMenu = document.createElement('div');
        mainMenu.classList.add(`${extPrefix}menu`);

        const xmlns = 'http://www.w3.org/2000/svg';
        const typoIcon = document.createElementNS(xmlns, 'svg');
        typoIcon.id = `${extPrefix}typoIcon`;
        typoIcon.classList.add(`${extPrefix}cursor`);
        typoIcon.classList.add(`${extPrefix}typoIcon`);
        typoIcon.setAttribute('width', '24px');
        typoIcon.setAttribute('height', '24px');
        typoIcon.setAttribute('viewBox', '0 0 24 24');
        typoIcon.setAttribute('fill', 'none');
        const typoIconTitle = document.createElementNS(xmlns, 'title');
        typoIconTitle.textContent = browser.i18n.getMessage('typoIconTitle');
        typoIcon.appendChild(typoIconTitle);
        const typoIconPath = document.createElementNS(xmlns, 'path');
        typoIconPath.id = `${extPrefix}typoIcon_path`;
        typoIconPath.setAttribute('d', 'M11 4H7.2C6.0799 4 5.51984 4 5.09202 4.21799C4.71569 4.40974 4.40973 4.7157 4.21799 5.09202C4 5.51985 4 6.0799 4 7.2V16.8C4 17.9201 4 18.4802 4.21799 18.908C4.40973 19.2843 4.71569 19.5903 5.09202 19.782C5.51984 20 6.0799 20 7.2 20H16.8C17.9201 20 18.4802 20 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V12.5M15.5 5.5L18.3284 8.32843M10.7627 10.2373L17.411 3.58902C18.192 2.80797 19.4584 2.80797 20.2394 3.58902C21.0205 4.37007 21.0205 5.6364 20.2394 6.41745L13.3774 13.2794C12.6158 14.0411 12.235 14.4219 11.8012 14.7247C11.4162 14.9936 11.0009 15.2162 10.564 15.3882C10.0717 15.582 9.54378 15.6885 8.48793 15.9016L8 16L8.04745 15.6678C8.21536 14.4925 8.29932 13.9048 8.49029 13.3561C8.65975 12.8692 8.89125 12.4063 9.17906 11.9786C9.50341 11.4966 9.92319 11.0768 10.7627 10.2373Z');
        typoIconPath.setAttribute('stroke', '#212121');
        typoIconPath.setAttribute('stroke-width', '2');
        typoIconPath.setAttribute('stroke-linecap', 'round');
        typoIconPath.setAttribute('stroke-linejoin', 'round');
        typoIcon.appendChild(typoIconPath);
        mainMenu.appendChild(typoIcon);

        const typosList = document.createElementNS(xmlns, 'svg');
        typosList.id = `${extPrefix}typosList`;
        typosList.classList.add(`${extPrefix}cursor`);
        typosList.classList.add(`${extPrefix}typosList`);
        typosList.classList.add(`${extPrefix}my-auto`);
        typosList.setAttribute('width', '24px');
        typosList.setAttribute('height', '24px');
        typosList.setAttribute('viewBox', '0 0 24 24');
        typosList.setAttribute('fill', 'none');
        const typosListTitle = document.createElementNS(xmlns, 'title');
        typosListTitle.textContent = browser.i18n.getMessage('typosListTitle');
        typosList.appendChild(typosListTitle);
        const typosListPath = document.createElementNS(xmlns, 'path');
        typosListPath.id = `${extPrefix}typosList_path`;
        typosListPath.setAttribute('fill-rule', 'evenodd');
        typosListPath.setAttribute('clip-rule', 'evenodd');
        typosListPath.setAttribute('d', 'M2.25 6C2.25 5.58579 2.58579 5.25 3 5.25H21C21.4142 5.25 21.75 5.58579 21.75 6C21.75 6.41421 21.4142 6.75 21 6.75H3C2.58579 6.75 2.25 6.41421 2.25 6ZM2.25 10C2.25 9.58579 2.58579 9.25 3 9.25H21C21.4142 9.25 21.75 9.58579 21.75 10C21.75 10.4142 21.4142 10.75 21 10.75H3C2.58579 10.75 2.25 10.4142 2.25 10ZM14.4697 12.9697C14.7626 12.6768 15.2374 12.6768 15.5303 12.9697L17.5 14.9393L19.4697 12.9697C19.7626 12.6768 20.2374 12.6768 20.5303 12.9697C20.8232 13.2626 20.8232 13.7374 20.5303 14.0303L18.5607 16L20.5303 17.9697C20.8232 18.2626 20.8232 18.7374 20.5303 19.0303C20.2374 19.3232 19.7626 19.3232 19.4697 19.0303L17.5 17.0607L15.5303 19.0303C15.2374 19.3232 14.7626 19.3232 14.4697 19.0303C14.1768 18.7374 14.1768 18.2626 14.4697 17.9697L16.4393 16L14.4697 14.0303C14.1768 13.7374 14.1768 13.2626 14.4697 12.9697ZM2.25 14C2.25 13.5858 2.58579 13.25 3 13.25H11C11.4142 13.25 11.75 13.5858 11.75 14C11.75 14.4142 11.4142 14.75 11 14.75H3C2.58579 14.75 2.25 14.4142 2.25 14ZM2.25 18C2.25 17.5858 2.58579 17.25 3 17.25H11C11.4142 17.25 11.75 17.5858 11.75 18C11.75 18.4142 11.4142 18.75 11 18.75H3C2.58579 18.75 2.25 18.4142 2.25 18Z');
        typosListPath.setAttribute('fill', '#212121');
        typosList.appendChild(typosListPath);
        mainMenu.appendChild(typosList);

        const themeToggle = document.createElementNS(xmlns, 'svg');
        themeToggle.id = `${extPrefix}themeToggle`;
        themeToggle.classList.add(`${extPrefix}cursor`);
        themeToggle.classList.add(`${extPrefix}mt-auto`);
        themeToggle.setAttribute('width', '24px');
        themeToggle.setAttribute('height', '24px');
        themeToggle.setAttribute('viewBox', '0 0 24 24');
        themeToggle.setAttribute('version', '1.1');
        const themeToggleTitle = document.createElementNS(xmlns, 'title');
        themeToggleTitle.textContent = browser.i18n.getMessage('themeToggleTitle');
        themeToggle.appendChild(themeToggleTitle);
        const themeToggleGOuter = document.createElementNS(xmlns, 'g');
        themeToggleGOuter.setAttribute('stroke', 'none');
        themeToggleGOuter.setAttribute('stroke-width', '1');
        themeToggleGOuter.setAttribute('fill', 'none');
        themeToggleGOuter.setAttribute('fill-rule', 'evenodd');
        const themeToggleGInner = document.createElementNS(xmlns, 'g');
        themeToggleGInner.id = `${extPrefix}themeToggle_path`;
        themeToggleGInner.setAttribute('fill', '#212121');
        themeToggleGInner.setAttribute('fill-rule', 'nonzero');
        const themeTogglePath = document.createElementNS(xmlns, 'path');
        themeTogglePath.setAttribute('d', 'M12,22 C17.5228475,22 22,17.5228475 22,12 C22,6.4771525 17.5228475,2 12,2 C6.4771525,2 2,6.4771525 2,12 C2,17.5228475 6.4771525,22 12,22 Z M12,20 L12,4 C16.418278,4 20,7.581722 20,12 C20,16.418278 16.418278,20 12,20 Z');
        themeToggleGInner.appendChild(themeTogglePath);
        themeToggleGOuter.appendChild(themeToggleGInner);
        themeToggle.appendChild(themeToggleGOuter);
        mainMenu.appendChild(themeToggle);

        document.body.appendChild(mainMenu);
    }

    function createModalWindow() {
        const extModal = AThelper.modal = document.createElement('div');
        extModal.classList.add(`${extPrefix}modal`);
        const modalContent = document.createElement('div');
        modalContent.classList.add(`${extPrefix}modal_content`);

        const modalHeader = document.createElement('div');
        modalHeader.classList.add(`${extPrefix}modal_header`);
        const modalCloseIcon = document.createElement('span');
        modalCloseIcon.classList.add(`${extPrefix}modal_close`);
        modalCloseIcon.textContent = 'X';
        modalHeader.appendChild(modalCloseIcon);
        const modalTitle = document.createElement('h2');
        modalTitle.classList.add(`${extPrefix}modal_title`);
        modalHeader.appendChild(modalTitle);
        modalContent.appendChild(modalHeader);

        const modalBody = document.createElement('div');
        modalBody.classList.add(`${extPrefix}modal_body`);
        modalContent.appendChild(modalBody);

        const modalFooter = document.createElement('div');
        modalFooter.classList.add(`${extPrefix}modal_footer`);
        modalFooter.classList.add(`${extPrefix}d-flex`);
        const modalActionMain = document.createElement('button');
        modalActionMain.classList.add(`${extPrefix}modal_actionMain`);
        modalActionMain.classList.add(`${extPrefix}ml-auto`);
        modalActionMain.classList.add(`${extPrefix}mr-2`);
        modalActionMain.classList.add('btn');
        modalActionMain.classList.add('btn-primary');
        modalFooter.appendChild(modalActionMain);
        const modalActionSecond = document.createElement('button');
        modalActionSecond.classList.add(`${extPrefix}modal_actionSecond`);
        modalActionSecond.classList.add(`${extPrefix}mr-2`);
        modalActionSecond.classList.add('btn');
        modalActionSecond.classList.add('btn-danger');
        modalFooter.appendChild(modalActionSecond);
        const modalCloseButton = document.createElement('button');
        modalCloseButton.classList.add(`${extPrefix}modal_close`);
        modalCloseButton.classList.add('btn');
        modalCloseButton.classList.add('btn-gray');
        modalCloseButton.textContent = browser.i18n.getMessage('closeText');
        modalFooter.appendChild(modalCloseButton);
        modalContent.appendChild(modalFooter);

        extModal.appendChild(modalContent);
        document.body.appendChild(extModal);

        const extModalClose = extModal.querySelectorAll(`.${extPrefix}modal_close`);
        for (let i = 0; i < extModalClose.length; i++) {
            extModalClose[i].addEventListener('click', () => {
                extModal.classList.remove(`${extPrefix}d-block`);
            });
        }

        window.addEventListener('click', (event) => {
            if (event.target === extModal) {
                extModal.classList.remove(`${extPrefix}d-block`);
            }
        });
        window.addEventListener('keyup', (event) => {
            if (extModal.classList.contains(`${extPrefix}d-block`) && event.code === 'Escape') {
                extModal.classList.remove(`${extPrefix}d-block`);
            }
        });
    }
} catch (error) {
    console.error('Error:', error);
}
