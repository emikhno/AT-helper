const extPrefix = 'AThelper__';

// Create extension's buttons
const mainMenu = document.createElement('div');
mainMenu.classList.add(`${extPrefix}menu`);
mainMenu.innerHTML =
`<svg id="${extPrefix}typoIcon" class="${extPrefix}cursor ${extPrefix}typoIcon" width="24px" height="24px"
    viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <title>${browser.i18n.getMessage("typoIconTitle")}</title>
    <path id="${extPrefix}typoIcon_path" d="M11 4H7.2C6.0799 4 5.51984 4 5.09202 4.21799C4.71569 4.40974 4.40973 4.7157 4.21799 5.09202C4 5.51985 4 6.0799 4 7.2V16.8C4 17.9201 4 18.4802 4.21799 18.908C4.40973 19.2843 4.71569 19.5903 5.09202 19.782C5.51984 20 6.0799 20 7.2 20H16.8C17.9201 20 18.4802 20 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V12.5M15.5 5.5L18.3284 8.32843M10.7627 10.2373L17.411 3.58902C18.192 2.80797 19.4584 2.80797 20.2394 3.58902C21.0205 4.37007 21.0205 5.6364 20.2394 6.41745L13.3774 13.2794C12.6158 14.0411 12.235 14.4219 11.8012 14.7247C11.4162 14.9936 11.0009 15.2162 10.564 15.3882C10.0717 15.582 9.54378 15.6885 8.48793 15.9016L8 16L8.04745 15.6678C8.21536 14.4925 8.29932 13.9048 8.49029 13.3561C8.65975 12.8692 8.89125 12.4063 9.17906 11.9786C9.50341 11.4966 9.92319 11.0768 10.7627 10.2373Z"
        stroke="#212121" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

<svg id="${extPrefix}typosList" class="${extPrefix}cursor ${extPrefix}typosList ${extPrefix}my-auto" width="24px" height="24px"
    viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <title>${browser.i18n.getMessage("typosListTitle")}</title>
    <path id="${extPrefix}typosList_path" fill-rule="evenodd" clip-rule="evenodd" d="M2.25 6C2.25 5.58579 2.58579 5.25 3 5.25H21C21.4142 5.25 21.75 5.58579 21.75 6C21.75 6.41421 21.4142 6.75 21 6.75H3C2.58579 6.75 2.25 6.41421 2.25 6ZM2.25 10C2.25 9.58579 2.58579 9.25 3 9.25H21C21.4142 9.25 21.75 9.58579 21.75 10C21.75 10.4142 21.4142 10.75 21 10.75H3C2.58579 10.75 2.25 10.4142 2.25 10ZM14.4697 12.9697C14.7626 12.6768 15.2374 12.6768 15.5303 12.9697L17.5 14.9393L19.4697 12.9697C19.7626 12.6768 20.2374 12.6768 20.5303 12.9697C20.8232 13.2626 20.8232 13.7374 20.5303 14.0303L18.5607 16L20.5303 17.9697C20.8232 18.2626 20.8232 18.7374 20.5303 19.0303C20.2374 19.3232 19.7626 19.3232 19.4697 19.0303L17.5 17.0607L15.5303 19.0303C15.2374 19.3232 14.7626 19.3232 14.4697 19.0303C14.1768 18.7374 14.1768 18.2626 14.4697 17.9697L16.4393 16L14.4697 14.0303C14.1768 13.7374 14.1768 13.2626 14.4697 12.9697ZM2.25 14C2.25 13.5858 2.58579 13.25 3 13.25H11C11.4142 13.25 11.75 13.5858 11.75 14C11.75 14.4142 11.4142 14.75 11 14.75H3C2.58579 14.75 2.25 14.4142 2.25 14ZM2.25 18C2.25 17.5858 2.58579 17.25 3 17.25H11C11.4142 17.25 11.75 17.5858 11.75 18C11.75 18.4142 11.4142 18.75 11 18.75H3C2.58579 18.75 2.25 18.4142 2.25 18Z"
        fill="#212121"/>
</svg>

<svg id="${extPrefix}themeToggle" class="${extPrefix}cursor ${extPrefix}mt-auto" width="24px" height="24px"
    viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>${browser.i18n.getMessage("themeToggleTitle")}</title>
    <g id="🔍-Product-Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="ic_fluent_dark_theme_24_filled" fill="#212121" fill-rule="nonzero">
            <path d="M12,22 C17.5228475,22 22,17.5228475 22,12 C22,6.4771525 17.5228475,2 12,2 C6.4771525,2 2,6.4771525 2,12 C2,17.5228475 6.4771525,22 12,22 Z M12,20 L12,4 C16.418278,4 20,7.581722 20,12 C20,16.418278 16.418278,20 12,20 Z" id="🎨-Color"></path>
        </g>
    </g>
</svg>`;
document.body.appendChild(mainMenu);

// Set theme
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

// Create modal
const typoListModal = document.createElement('div');
typoListModal.classList.add(`${extPrefix}modal`);
typoListModal.innerHTML =
`<div class="${extPrefix}modal_content">
    <div class="${extPrefix}modal_header">
      <span class="${extPrefix}modal_close">&times;</span>
      <h2 class="${extPrefix}modal_title"></h2>
    </div>
    <div class="${extPrefix}modal_body">
    </div>
    <div class="${extPrefix}modal_footer ${extPrefix}d-flex">
        <button type="button" class="${extPrefix}modal_actionMain ${extPrefix}ml-auto ${extPrefix}mr-2 btn btn-primary"></button>
        <button type="button" class="${extPrefix}modal_actionSecond ${extPrefix}mr-2 btn btn-danger"></button>
        <button type="button" class="${extPrefix}modal_close btn btn-gray">${browser.i18n.getMessage("closeText")}</button>
    </div>
</div>`
document.body.appendChild(typoListModal);

const typoListModalClose = typoListModal.querySelectorAll(`.${extPrefix}modal_close`);
for (let i = 0; i < typoListModalClose.length; i++) {
    typoListModalClose[i].addEventListener('click', () => {
        typoListModal.classList.remove('AThelper__d-block');
    });
}

window.addEventListener('click', (event) => {
    if (event.target === typoListModal) {
        typoListModal.classList.remove('AThelper__d-block');
    }
});



function setDarkTheme() {
    if (themeCurrent !== 'dark') {
        themeCurrent = 'dark';
        localStorage.setItem(`${extPrefix}theme`, themeCurrent);
    }

    document.body.classList.add(`${extPrefix}theme_dark`);
    document.getElementById('ic_fluent_dark_theme_24_filled').setAttribute('fill', '#FFFFFF');
    document.getElementById(`${extPrefix}typoIcon_path`).setAttribute('stroke', '#FFFFFF');
    document.getElementById(`${extPrefix}typosList_path`).setAttribute('stroke', '#FFFFFF');
}

function setDefaultTheme() {
    themeCurrent = 'default';
    localStorage.setItem(`${extPrefix}theme`, themeCurrent);

    document.body.classList.remove(`${extPrefix}theme_dark`);
    document.getElementById('ic_fluent_dark_theme_24_filled').setAttribute('fill', '#212121');
    document.getElementById(`${extPrefix}typoIcon_path`).setAttribute('stroke', '#212121');
    document.getElementById(`${extPrefix}typosList_path`).setAttribute('stroke', '#212121');
}
