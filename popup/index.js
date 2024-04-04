const themeDefault = document.getElementById('themeDefault');
const themeDark = document.getElementById('themeDark');
const typosList = document.getElementById('typosList');

browser.tabs.query({
    url: 'https://author.today/*'
}).then((response) => {
    if (response.length) {
        const tabId = response[0].id;
        return browser.tabs.sendMessage(
            tabId,
            {
                message: 'getTheme'
            }
        )
    } else {
        throw 'NoAuthorTodayTabs';
    }
}).then((response) => {
    if (response && response.message === 'dark') {
        setDarkTheme();
    } else {
        setDefaultTheme();
    }
}).catch(error => {
    themeDefault.disabled = true;
    themeDark.disabled = true;
    console.error('Error:', error)
});

themeDefault.addEventListener('click', (event) => {
    setThemeRequest('default');
    setDefaultTheme();
});

themeDark.addEventListener('click', (event) => {
    setThemeRequest('dark');
    setDarkTheme();
});

function setThemeRequest(theme) {
    browser.tabs.query({
        url: 'https://author.today/*'
    }).then((response) => {
        if (response.length) {
            const tabId = response[0].id;
            browser.tabs.sendMessage(
                tabId,
                {
                    message: 'setTheme',
                    value: theme
                }
            )
        } else {
            throw 'NoAuthorTodayTabs';
        }
    }).catch(error => console.error('Error:', error));
}

function setDarkTheme() {
    themeDark.checked = true;
    document.body.classList.add('theme_dark');
    typosList.setAttribute('stroke', '#FFFFFF');
}

function setDefaultTheme() {
    themeDefault.checked = true;
    document.body.classList.remove('theme_dark');
    typosList.setAttribute('stroke', '#000000');
}
