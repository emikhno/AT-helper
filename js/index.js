const extPrefix = 'AThelper__';

const mainMenu = document.createElement('div');
mainMenu.classList.add(`${extPrefix}menu`);
mainMenu.innerHTML =
    `<svg id="${extPrefix}themeToggle" class="${extPrefix}cursor ${extPrefix}mt-auto" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>ic_fluent_dark_theme_24_filled</title>
    <desc>Created with Sketch.</desc>
    <g id="🔍-Product-Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="ic_fluent_dark_theme_24_filled" fill="#212121" fill-rule="nonzero">
            <path d="M12,22 C17.5228475,22 22,17.5228475 22,12 C22,6.4771525 17.5228475,2 12,2 C6.4771525,2 2,6.4771525 2,12 C2,17.5228475 6.4771525,22 12,22 Z M12,20 L12,4 C16.418278,4 20,7.581722 20,12 C20,16.418278 16.418278,20 12,20 Z" id="🎨-Color">
</path>
        </g>
    </g>
</svg>`;
document.body.appendChild(mainMenu);

const themeToggle = document.getElementById(`${extPrefix}themeToggle`);
themeToggle.addEventListener('click', () => {
    if (!themeCurrent || themeCurrent === 'default') {
        setDarkTheme();
    } else {
        setDefaultTheme();
    }
});

let themeCurrent = localStorage.getItem(`${extPrefix}theme`);
if (themeCurrent === 'dark') {
    setDarkTheme();
}


function setDarkTheme() {
    if (themeCurrent !== 'dark') {
        themeCurrent = 'dark';
        localStorage.setItem(`${extPrefix}theme`, themeCurrent);
    }

    document.body.classList.add(`${extPrefix}theme_dark`);
    document.getElementById('ic_fluent_dark_theme_24_filled').setAttribute('fill', '#FFFFFF');
}

function setDefaultTheme() {
    themeCurrent = 'default';
    localStorage.setItem(`${extPrefix}theme`, themeCurrent);

    document.body.classList.remove(`${extPrefix}theme_dark`);
    document.getElementById('ic_fluent_dark_theme_24_filled').setAttribute('fill', '#212121');
}
