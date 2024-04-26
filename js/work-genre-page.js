try {
    let prevUrl = window.location.href;
    setInterval(() => {
        const currUrl = window.location.href;
        if (currUrl !== prevUrl) {
            prevUrl = currUrl;

            const timerId = setInterval(() => {
                const nprogress = document.getElementById('nprogress');
                if (!nprogress) {
                    clearInterval(timerId);
                    createLikesFilter(likesMin, likesMax);
                    applyLikesFilter(likesMin, likesMax);
                }
            }, 1000);
        }
    }, 100);

    let likesMin;
    let likesMax;
    browser.runtime.sendMessage({
        message: 'getLikesFilter'
    }).then(response => {
        [likesMin, likesMax] = response ?? [null, null];
        createLikesFilter(likesMin, likesMax);
        applyLikesFilter(likesMin, likesMax);
    }).catch((error) => {
        console.error(error);
    });


    function createLikesFilter(likesMin, likesMax) {
        if (document.getElementById('moreFilters_likes')) {
            return;
        }

        const moreFilters = document.getElementById('moreFilters');

        const moreFiltersRow = document.createElement('div');
        moreFiltersRow.classList.add('filter-row');
        moreFiltersRow.classList.add('row');
        moreFiltersRow.id = 'moreFilters_likes'

        const likesFilterMinWrapper = document.createElement('div');
        likesFilterMinWrapper.classList.add('form-group');
        likesFilterMinWrapper.classList.add('col-xs-3');
        const likesFilterMinLabel = document.createElement('label');
        likesFilterMinLabel.textContent = browser.i18n.getMessage('likesFromText');
        const likesFilterMin = document.createElement('input');
        likesFilterMin.type = 'number';
        likesFilterMin.min = 0;
        likesFilterMin.step = 10;
        likesFilterMin.value = likesMin;
        likesFilterMin.classList.add('form-control');
        likesFilterMinWrapper.appendChild(likesFilterMinLabel);
        likesFilterMinWrapper.appendChild(likesFilterMin);

        const likesFilterMaxWrapper = document.createElement('div');
        likesFilterMaxWrapper.classList.add('form-group');
        likesFilterMaxWrapper.classList.add('col-xs-3');
        const likesFilterMaxLabel = document.createElement('label');
        likesFilterMaxLabel.textContent = browser.i18n.getMessage('likesToText');
        const likesFilterMax = document.createElement('input');
        likesFilterMax.type = 'number';
        likesFilterMax.min = 0;
        likesFilterMax.step = 10;
        likesFilterMax.value = likesMax;
        likesFilterMax.classList.add('form-control');
        likesFilterMaxWrapper.appendChild(likesFilterMaxLabel);
        likesFilterMaxWrapper.appendChild(likesFilterMax);

        moreFiltersRow.appendChild(likesFilterMinWrapper);
        moreFiltersRow.appendChild(likesFilterMaxWrapper);
        moreFilters.appendChild(moreFiltersRow);

        likesFilterMin.addEventListener('change', (event) => {
            likesMin = event.target.value;

            browser.runtime.sendMessage({
                message: 'setLikesFilter',
                payload: [likesMin, likesMax]
            }).then(response => {
                applyLikesFilter(likesMin, likesMax);
            }).catch((error) => {
                console.error(error);
            });
        });

        likesFilterMax.addEventListener('change', (event) => {
            likesMax = event.target.value;

            browser.runtime.sendMessage({
                message: 'setLikesFilter',
                payload: [likesMin, likesMax]
            }).then(response => {
                applyLikesFilter(likesMin, likesMax);
            }).catch((error) => {
                console.error(error);
            });
        });
    }

    function applyLikesFilter(likesMin, likesMax) {
        const searchResults = document.querySelectorAll('#search-results .book-row');
        if (!searchResults) {
            return;
        }

        for (let i = 0; i < searchResults.length; i++) {
            const likeCountElement = searchResults[i].querySelector('.like-count');
            let likeCount = likeCountElement.textContent;
            const isShortK = likeCount.search(/\d+K$/) !== -1;
            likeCount = likeCount.replace(/\D/g, '');
            likeCount = isShortK ? parseInt(likeCount) * 1000: parseInt(likeCount);

            searchResults[i].hidden = ((likesMin && likeCount < likesMin) || (likesMax && likeCount > likesMax));
        }
    }
} catch (error) {
    console.error('Error:', error);
}
