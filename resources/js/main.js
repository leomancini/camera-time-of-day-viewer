
function updateImages(images) {
    images.map((image) => {
        const thumbnailWrapper = document.createElement('div'); 
        thumbnailWrapper.classList.add('thumbnailWrapper');

        const label = document.createElement('label');
        const filename = image.split('/');
        let dateParts = filename[filename.length-1].split('.jpg').join('').split('-');
        let date = new Date(`${dateParts[0]}-${dateParts[1]}-${dateParts[2]}T${dateParts[3]}:${dateParts[4]}`);

        label.innerHTML = `${date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit' })}`;

        const imageElement = new Image();
        imageElement.src = image;

        imageElement.onload = () => {
            thumbnailWrapper.appendChild(label);
        }

        imageElement.onerror = () => {
            if (thumbnailWrapper) {
                thumbnailWrapper.parentNode.removeChild(thumbnailWrapper);
            }
        }

        thumbnailWrapper.appendChild(imageElement);

        imageElementsWrapper.appendChild(thumbnailWrapper);
    });

    imageElementsWrapper.classList.remove('loading');
    loadingSpinner.classList.remove('loading');
    loadingSpinner.classList.remove('initialLoad');
    loadingBottomGradient.classList.remove('loading');

    if (imageElementsWrapper.getBoundingClientRect().bottom <= window.innerHeight) {
        setTimeout(() => {
            lazyLoadImages();
        }, 500);
    }
}

function getImagesForTimeOfDay(params) {
    window.currentlyLoading = true;
    window.imagesType = 'TimeOfDay';

    let hour = zeroPad(parseInt(hourOutput.innerHTML), 2);
    let minute = zeroPad(parseInt(minuteOutput.innerHTML), 2);

    imageElementsWrapper.classList.add('loading');
    loadingSpinner.classList.add('loading');
    loadingBottomGradient.classList.add('loading');
    
    fetch(
        `getImagesForTimeOfDay.php?h=${hour}&m=${minute}&page=${params.page}`
    ).then(
        response => response.json()
    ).then(
        images => {
            if (images.length > 0) {
                updateImages(images);
            } else {
                window.allImagesLoaded = true;
                imageElementsWrapper.classList.remove('loading');
                loadingSpinner.classList.remove('loading');
                loadingBottomGradient.classList.remove('loading');
            }

            window.currentlyLoading = false;
        }
    ).catch((error) => {
        console.error('Error:', error);
        window.currentlyLoading = false;
    });

    updateTitle('time', { hour, minute });
}

function getImagesForSunTime(params) {
    window.currentlyLoading = true;
    window.imagesType = 'SunTime';
    window.sunTimeType = params.type;

    imageElementsWrapper.classList.add('loading');
    loadingSpinner.classList.add('loading');
    loadingBottomGradient.classList.add('loading');
    sliders.classList.add('disabled');

    fetch(
        `getImagesForSunTime.php?type=${params.type}&page=${params.page}`
    ).then(
        response => response.json()
    ).then(
        images => {
            updateImages(images);
            window.currentlyLoading = false;
        }
    ).catch((error) => {
        console.error('Error:', error);
        window.currentlyLoading = false;
    });

    updateTitle('sun', { type: params.type });
}

function updateTitle(type, data) {
    const time = document.querySelector('#time');

    switch (type) {
        case 'time':
            time.innerHTML = `${data.hour}:${data.minute}`;
            
            document.title = `Every Day at ${data.hour}:${data.minute}`;
        break;
        case 'sun':
            const label = document.querySelector(`button#${data.type}`).innerHTML;
            time.innerHTML = `${label.toUpperCase()}`;

            document.title = `Every Day at ${label[0].toUpperCase()}${label.slice(1)}`;
        break;
    }
}

function zeroPad(num, places) {
    return String(num).padStart(places, '0'); // From https://stackoverflow.com/a/2998874
}

function removeSelectedStateFromAllButtons() {
    document.querySelectorAll('button').forEach((button) => {
        button.classList.remove('selected');
    });
}

const imageElementsWrapper = document.querySelector('#images');
const loadingSpinner = document.querySelector('#spinner');
const loadingBottomGradient = document.querySelector('#loadingBottomGradient');

const sliders = document.querySelector('#sliders');
const hourSlider = document.querySelector('.slider#hour');
const minuteSlider = document.querySelector('.slider#minute');

const hourOutput = document.querySelector('.output#hour');
const minuteOutput = document.querySelector('.output#minute');

hourOutput.innerHTML = hourSlider.value;
minuteOutput.innerHTML = minuteSlider.value;

hourSlider.oninput = function() {
    hourOutput.innerHTML = this.value;

    clearImages();
    getImagesForTimeOfDay({ page: 0 });

    removeSelectedStateFromAllButtons();
}

minuteSlider.oninput = function() {
    minuteOutput.innerHTML = this.value;

    clearImages();
    getImagesForTimeOfDay({ page: 0 });

    removeSelectedStateFromAllButtons();
}

sliders.onmouseover = function() {
    sliders.classList.remove('disabled');
}

sliders.ontouchstart = function() {
    sliders.classList.remove('disabled');
}

function clearImages() {
    window.allImagesLoaded = false;
    window.page = 0;
    window.sunTimeType = null;
    loadingSpinner.classList.add('initialLoad');

    imageElementsWrapper.innerHTML = '';
}

document.querySelectorAll('#controls #buttons button').forEach((button) => {
    button.onclick = function() {
        clearImages();
        getImagesForSunTime({
            type: this.getAttribute('id'),
            page: 0
        });

        removeSelectedStateFromAllButtons();

        this.classList.add('selected');
    }
});

window.allImagesLoaded = false;
window.page = 0;
window.imagesType = 'TimeOfDay';
window.sunTimeType = null;
window.currentlyLoading = false;

function lazyLoadImages() {
    if (!window.allImagesLoaded && !window.currentlyLoading) {
        if (Math.round(window.innerHeight + window.scrollY) >= Math.round(document.body.offsetHeight)) {
            window.page = window.page + 1;
            console.log('load MORE');
            if (window.imagesType === 'TimeOfDay') {
                getImagesForTimeOfDay({ page: window.page });
            } else if (window.imagesType = 'SunTime') {
                getImagesForSunTime({
                    type: window.sunTimeType,
                    page: window.page
                });
            }
        }
    }
}

window.onscroll = lazyLoadImages;

getImagesForTimeOfDay({ page: 0 });